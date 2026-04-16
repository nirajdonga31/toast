const express = require('express');
const router = express.Router();
const store = require('../data');

// Get all users
router.get('/', (req, res) => {
  res.json(store.users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = store.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create a new user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const user = { id: store.nextUserId++, name, email: email.toLowerCase() };
  store.users.push(user);
  res.status(201).json(user);
});

// Update a user
router.patch('/:id', (req, res) => {
  const user = store.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (email) {
    const existing = users.find(u => u.email === email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    user.email = email;
  }
  if (name) user.name = name;
  res.json(user);
});

// Get tasks for a user
router.get('/:id/tasks', (req, res) => {
  const user = store.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const userTasks = tasks.filter(t => t.userId === req.params.id);
  res.json(userTasks);
});

// Delete a user
router.delete('/:id', (req, res) => {
  const index = store.users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  const deleted = store.users.splice(index, 1)[0];
  res.json({ message: 'User deleted', user: deleted });
});

module.exports = router;
