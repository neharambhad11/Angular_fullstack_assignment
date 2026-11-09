import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';

describe('Weather API', () => {
  it('should return weather information for a valid city', async () => {
    const response = await request(app)
      .get('/api/weather')
      .query({ city: 'Mumbai' });

    expect(response.status).toBe(200);

    const weather =
      response.body?.data ??
      response.body;

    expect(weather).toBeDefined();
    expect(weather.name).toBe('Mumbai');
    expect(weather.main).toBeDefined();
    expect(weather.weather).toBeInstanceOf(Array);
  }, 20000);

  it('should handle an invalid city', async () => {
    const response = await request(app)
      .get('/api/weather')
      .query({ city: 'InvalidCityName123456' });

    expect([400, 404]).toContain(response.status);
  }, 20000);

  it('should reject a request without a city', async () => {
    const response = await request(app)
      .get('/api/weather');

    expect([400, 422]).toContain(response.status);
  });
});