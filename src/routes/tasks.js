const express = require('express');
const router = express.Router();
const store = require('../data');

// Get all tasks with filters, search, and sort
router.get('/', (req, res) => {
  let result = [...store.tasks];

  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    result = result.filter(t => t.completed === completed);
  }

  if (req.query.priority) {
    result = result.filter(t => t.priority === req.query.priority);
  }

  if (req.query.categoryId) {
    const cid = parseInt(req.query.categoryId);
    result = result.filter(t => t.categoryId === cid);
  }

  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(q));
  }

  const sort = req.query.sort;
  const order = req.query.order === 'desc' ? -1 : 1;
  if (sort === 'dueDate') {
    result.sort((a, b) => (new Date(a.dueDate) - new Date(b.dueDate)) * order);
  }
  if (sort === 'priority') {
    const map = { low: 1, medium: 2, high: 3 };
    result.sort((a, b) => (map[a.priority] - map[b.priority]) * order);
  }
  if (sort === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title) * order);
  }

  res.json(result);
});

// Get overdue tasks
router.get('/overdue', (req, res) => {
  const now = new Date();
  const overdue = store.tasks.filter(t => !t.completed && new Date(t.dueDate) < now);
  res.json(overdue);
});

// Create a new task
router.post('/', (req, res) => {
  const { title, priority = 'medium', dueDate, categoryId } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = {
    id: store.nextTaskId++,
    title,
    completed: false,
    priority,
    dueDate: dueDate || null,
    categoryId: categoryId ? parseInt(categoryId) : null
  };
  store.tasks.push(task);
  res.status(201).json(task);
});

// Bulk create tasks
router.post('/bulk', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
  const created = [];
  items.forEach(({ title, priority, dueDate, categoryId }) => {
    if (!title) return;
    const task = {
      id: store.nextTaskId++,
      title,
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      categoryId: categoryId ? parseInt(categoryId) : null
    };
    store.tasks.push(task);
    created.push(task);
  });
  res.status(201).json({ created, count: created.length });
});

// Update a task
router.patch('/:id', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { title, completed, priority, dueDate, categoryId } = req.body;
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (categoryId !== undefined) {
    const category = store.categories.find(c => c.id === categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    task.categoryId = categoryId;
  }
  res.json(task);
});

// Bulk update tasks
router.patch('/bulk', (req, res) => {
  const { ids, changes } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
  const updated = [];
  ids.forEach(id => {
    const task = store.tasks.find(t => t.id === parseInt(id));
    if (!task) return;
    if (changes.title !== undefined) task.title = changes.title;
    if (changes.completed !== undefined) task.completed = changes.completed;
    if (changes.priority !== undefined) task.priority = changes.priority;
    updated.push(task);
  });
  res.json({ updated, count: updated.length });
});

// Toggle task completion
router.patch('/:id/toggle', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.completed = !task.completed;
  res.json(task);
});

// Delete a task
router.delete('/:id', (req, res) => {
  const index = store.tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  const deleted = store.tasks.splice(index, 1)[0];
  store.comments = store.comments.filter(c => c.taskId !== deleted.id);
  res.json({ message: 'Task deleted', task: deleted });
});

// Bulk delete tasks
router.delete('/bulk', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
  const deleted = [];
  ids.forEach(id => {
    const index = store.tasks.findIndex(t => t.id == id);
    deleted.push(store.tasks.splice(index, 1)[0]);
  });
  res.json({ deleted, count: deleted.length });
});

module.exports = router;
