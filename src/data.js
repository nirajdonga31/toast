module.exports = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ],
  tasks: [
    { id: 1, title: 'Learn Express', completed: false },
    { id: 2, title: 'Build an API', completed: true }
  ],
  categories: [
    { id: 1, name: 'Work', color: '#FF5733' },
    { id: 2, name: 'Personal', color: '#33FF57' }
  ],
  comments: [
    { id: 1, taskId: 1, text: 'Great start!', createdAt: '2026-04-15T10:00:00.000Z' },
    { id: 2, taskId: 1, text: 'Keep going', createdAt: '2026-04-15T11:00:00.000Z' }
  ],
  nextUserId: 3,
  nextTaskId: 3,
  nextCategoryId: 3,
  nextCommentId: 3
};
