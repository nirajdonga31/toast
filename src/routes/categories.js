const express = require('express');
const router = express.Router();
const store = require('../data');

// Get all categories
router.get('/', (req, res) => {
  res.json(store.categories);
});

// Create a category
router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
    return res.status(400).json({ error: 'Invalid color format' });
  }
  const category = {
    id: store.nextCategoryId++,
    name,
    color: color || '#CCCCCC'
  };
  store.categories.push(category);
  res.status(201).json(category);
});

// Get category by ID
router.get('/:id', (req, res) => {
  const category = store.categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

// Update a category
router.patch('/:id', (req, res) => {
  const category = store.categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const { name, color } = req.body;
  if (name !== undefined) category.name = name;
  if (color !== undefined) {
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({ error: 'Invalid color format' });
    }
    category.color = color;
  }
  res.json(category);
});

// Delete a category
router.delete('/:id', (req, res) => {
  const index = store.categories.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  const deleted = store.categories.splice(index, 1)[0];
  store.tasks.forEach(t => {
    if (t.categoryId === deleted.id) t.categoryId = null;
  });
  res.json({ message: 'Category deleted', category: deleted });
});

module.exports = router;
