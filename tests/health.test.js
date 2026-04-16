const request = require('supertest');

describe('GET /health', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    app = require('../src/index');
  });

  it('returns status ok and a timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });
});
