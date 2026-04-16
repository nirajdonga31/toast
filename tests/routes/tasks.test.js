const request = require('supertest');

describe('Tasks routes', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../../src/index');
  });

  describe('GET /tasks', () => {
    it('returns all tasks', async () => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { id: 1, title: 'Learn Express', completed: false },
        { id: 2, title: 'Build an API', completed: true }
      ]);
    });

    it('filters completed tasks when ?completed=true', async () => {
      const res = await request(app).get('/tasks?completed=true');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ id: 2, title: 'Build an API', completed: true }]);
    });

    it('filters incomplete tasks when ?completed=false', async () => {
      const res = await request(app).get('/tasks?completed=false');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ id: 1, title: 'Learn Express', completed: false }]);
    });
  });

  describe('POST /tasks', () => {
    it('creates a new task', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Write tests' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({ title: 'Write tests', completed: false });
      expect(res.body).toHaveProperty('id');
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Title is required' });
    });
  });

  describe('PATCH /tasks/:id/toggle', () => {
    it('toggles task completion', async () => {
      const res = await request(app).patch('/tasks/1/toggle');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 1, title: 'Learn Express', completed: true });
    });

    it('returns 404 for a non-existent task', async () => {
      const res = await request(app).patch('/tasks/999/toggle');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deletes an existing task', async () => {
      const res = await request(app).delete('/tasks/2');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: 'Task deleted',
        task: { id: 2, title: 'Build an API', completed: true }
      });

      const getRes = await request(app).get('/tasks/2');
      expect(getRes.statusCode).toBe(404);
    });

    it('returns 404 for a non-existent task', async () => {
      const res = await request(app).delete('/tasks/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });
  });
});
