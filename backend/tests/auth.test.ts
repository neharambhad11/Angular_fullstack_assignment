import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';

describe('Authentication API', () => {
  const uniqueEmail = `test_${Date.now()}@example.com`;

  const user = {
    name: 'Test User',
    email: uniqueEmail,
    password: 'Test@12345'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect([200, 201]).toContain(response.status);
      expect(response.body).toBeDefined();
    });

    it('should reject duplicate email registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect([400, 409]).toContain(response.status);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password
        });

      expect(response.status).toBe(200);

      const token =
        response.body?.token ??
        response.body?.data?.token ??
        response.body?.data?.accessToken;

      expect(token).toBeTruthy();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword123'
        });

      expect([400, 401]).toContain(response.status);
    });
  });
});