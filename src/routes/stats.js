const express = require('express');
const router = express.Router();
const store = require('../data');

// Overall task stats
router.get('/tasks', (req, res) => {
  const total = store.tasks.length;
  const completed = store.tasks.filter(t => t.completed).length;
  const overdue = store.tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
  const byPriority = { low: 0, medium: 0, high: 0 };
  store.tasks.forEach(t => {
    if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;
    else byPriority.medium++;
  });
  res.json({
    total,
    completed,
    pending: total - completed,
    overdue,
    byPriority,
    completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) + '%' : '0%'
  });
});

// User-specific task stats
router.get('/users/:id/tasks', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = store.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const userTasks = store.tasks.filter(t => t.userId === userId);
  const total = userTasks.length;
  const completed = userTasks.filter(t => t.completed).length;
  res.json({
    userId,
    total,
    completed,
    pending: total - completed,
    completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) + '%' : '0%'
  });
});

module.exports = router;
