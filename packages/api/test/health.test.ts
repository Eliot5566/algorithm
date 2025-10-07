import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { buildServer } from '../src/index';

const app = buildServer();

describe('health route', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns ok status', async () => {
    const response = await request(app.server).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
