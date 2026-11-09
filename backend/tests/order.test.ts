import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app';

describe('Order API', () => {
  let token = '';
  let productId = '';

  const testUser = {
    name: 'Order Test User',
    email: `order_${Date.now()}@example.com`,
    password: 'Test@12345'
  };

  beforeAll(async () => {
    // Register test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect([200, 201]).toContain(registerResponse.status);

    // Login
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
      throw new Error('Could not obtain authentication token for order tests');
    }

    // Create a product to use in the order
    const productResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Order Test Product',
        price: 1000,
        description: 'Product for order testing'
      });

    expect([200, 201]).toContain(productResponse.status);

    const createdProduct =
      productResponse.body?.data?.product ??
      productResponse.body?.data ??
      productResponse.body?.product ??
      productResponse.body;

    productId = String(createdProduct?._id ?? createdProduct?.id ?? '');

    if (!productId) {
      throw new Error('Could not obtain product ID for order tests');
    }
  });

  it('should create an order and calculate total on the backend', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productIds: [productId]
      });

    expect([200, 201]).toContain(response.status);

    const order =
      response.body?.data?.order ??
      response.body?.data ??
      response.body?.order ??
      response.body;

    expect(Number(order.totalAmount)).toBe(1000);
  });

  it('should fetch orders for the authenticated user', async () => {
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const orders = Array.isArray(response.body)
      ? response.body
      : response.body?.data ?? response.body?.orders;

    expect(Array.isArray(orders)).toBe(true);

    expect(
      orders.some((order: any) =>
        (order.productIds ?? []).includes(productId)
      )
    ).toBe(true);
  });

  it('should reject requests without an authentication token', async () => {
    const response = await request(app).get('/api/orders');

    expect([401, 403]).toContain(response.status);
  });
});