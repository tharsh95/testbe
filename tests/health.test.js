import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/health', () => {
  it('should respond with status 200 and JSON { status: "ok" }', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});