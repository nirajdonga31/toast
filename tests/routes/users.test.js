const request = require('supertest');

describe('Users routes', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../../src/index');
  });

  describe('GET /users', () => {
    it('returns all users', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
      ]);
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user by id', async () => {
      const res = await request(app).get('/users/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' });
    });

    it('returns 404 for a non-existent user', async () => {
      const res = await request(app).get('/users/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });
  });

  describe('POST /users', () => {
    it('creates a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Charlie', email: 'charlie@example.com' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({ name: 'Charlie', email: 'charlie@example.com' });
      expect(res.body).toHaveProperty('id');
    });

    it('returns 400 when name is missing', async () => {
      const res = await request(app)
        .post('/users')
        .send({ email: 'no-name@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Name and email are required' });
    });

    it('returns 400 when email is missing', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'NoEmail' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Name and email are required' });
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes an existing user', async () => {
      const res = await request(app).delete('/users/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: 'User deleted',
        user: { id: 1, name: 'Alice', email: 'alice@example.com' }
      });

      const getRes = await request(app).get('/users/1');
      expect(getRes.statusCode).toBe(404);
    });

    it('returns 404 for a non-existent user', async () => {
      const res = await request(app).delete('/users/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'User not found' });
    });
  });
});
