import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app';

describe('Product API', () => {
  let token = '';
  let productId = '';

  const testUser = {
    name: 'Product Test User',
    email: `product_${Date.now()}@example.com`,
    password: 'Test@12345'
  };

  const product = {
    name: 'Test Laptop',
    price: 55000,
    description: 'Laptop created for API testing'
  };

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    token =
      loginResponse.body?.token ??
      loginResponse.body?.data?.token ??
      loginResponse.body?.data?.accessToken;

    if (!token) {
      throw new Error('Could not obtain authentication token for product tests');
    }
  });

  it('should fetch all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const products = Array.isArray(response.body)
      ? response.body
      : response.body?.data ?? response.body?.products;

    expect(Array.isArray(products)).toBe(true);
  });

  it('should create a product', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(product);

    expect([200, 201]).toContain(response.status);

    const createdProduct =
      response.body?.data?.product ??
      response.body?.data ??
      response.body?.product ??
      response.body;

    productId = String(createdProduct?._id ?? createdProduct?.id ?? '');

    expect(productId).not.toBe('');
    expect(createdProduct.name).toBe(product.name);
  });

  it('should update a product', async () => {
    expect(productId).not.toBe('');

    const response = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Test Laptop',
        price: 60000,
        description: 'Updated product description'
      });

    expect(response.status).toBe(200);
  });

  it('should delete a product created by this test', async () => {
    expect(productId).not.toBe('');

    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 204]).toContain(response.status);
  });
});