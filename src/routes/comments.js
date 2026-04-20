const express = require('express');
const router = express.Router({ mergeParams: true });
const store = require('../data');

// Get comments for a task with pagination
router.get('/', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = store.tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  let taskComments = store.comments.filter(c => c.taskId === taskId);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = taskComments.slice(start, end + 1);

  res.json({
    comments: paginated,
    total: taskComments.length,
    page,
    limit
  });
});

// Add a comment to a task
router.post('/', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const task = store.tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  const comment = {
    id: store.nextCommentId++,
    taskId,
    text,
    createdAt: new Date().toISOString()
  };
  store.comments.push(comment);
  res.status(201).json(comment);
});

// Delete a comment
router.delete('/:commentId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const commentId = parseInt(req.params.commentId);
  const index = store.comments.findIndex(c => c.id === commentId && c.taskId === taskId);
  if (index === -1) return res.status(404).json({ error: 'Comment not found' });
  const deleted = store.comments.splice(index, 1)[0];
  res.json({ message: 'Comment deleted', comment: deleted });
});

module.exports = router;
