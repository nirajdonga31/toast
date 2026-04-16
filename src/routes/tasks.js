const express = require('express');
const router = express.Router();

let tasks = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build an API', completed: true }
];
let nextId = 3;

// Get all tasks (optional ?completed=true/false filter)
router.get('/', (req, res) => {
  let result = tasks;
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    result = tasks.filter(t => t.completed === completed);
  }
  res.json(result);
});

// Create a new task
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = { id: nextId++, title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Toggle task completion
router.patch('/:id/toggle', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.completed = !task.completed;
  res.json(task);
});

// Delete a task
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  const deleted = tasks.splice(index, 1)[0];
  res.json({ message: 'Task deleted', task: deleted });
});

module.exports = router;
