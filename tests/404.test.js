const request = require('supertest');

describe('404 handler', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../src/index');
  });

  it('returns 404 for unknown endpoints', async () => {
    const res = await request(app).get('/not-a-real-endpoint');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Endpoint not found' });
  });
});
