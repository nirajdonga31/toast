const express = require('express');
const router = express.Router();
const store = require('../data');

// Get all tasks (optional ?completed=true/false filter)
router.get('/', (req, res) => {
  let result = store.tasks;
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    result = store.tasks.filter(t => t.completed === completed);
  }
  res.json(result);
});

// Create a new task
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = { id: store.nextTaskId++, title, completed: false };
  store.tasks.push(task);
  res.status(201).json(task);
});

// Update a task
router.patch('/:id', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { title, completed } = req.body;
  if (title !== undefined) task.title = title.trim() || task.title;
  if (completed !== undefined) task.completed = Boolean(completed);
  res.json(task);
});

// Assign task to user
router.post('/:id/assign', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { userId } = req.body;
  const uid = Number(userId);
  if (!Number.isInteger(uid)) return res.status(400).json({ error: 'userId must be an integer' });
  const user = store.users.find(u => u.id === uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  task.userId = uid;
  task.assignedAt = req.body.assignedAt || new Date().toISOString();
  res.json(task);
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
  res.json({ message: 'Task deleted', task: deleted });
});

module.exports = router;
