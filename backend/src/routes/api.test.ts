import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../src/server.js';
import http from 'http';
let server;
let BASE_URL = '';


// BASE_URL will be set after server starts

beforeAll(async () => {
  server = http.createServer(app).listen(0);
  await new Promise<void>((resolve) => {
    server.on('listening', () => {
      const port = (server.address() as any).port;
      BASE_URL = `http://127.0.0.1:${port}/api`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

describe('GeoShop REST API Integration Tests', () => {
  it('GET /api/health returns 200 OK and status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.service).toBe('GeoShop Global API');
  });

  it('GET /api/products returns products list', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it('GET /api/products/search?q=iphone finds iPhone products', async () => {
    const res = await fetch(`${BASE_URL}/products/search?q=iphone`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    const hasIphone = data.data.some((p: any) => p.name.toLowerCase().includes('iphone'));
    expect(hasIphone).toBe(true);
  });

  it('GET /api/locations returns 8 global country locations', async () => {
    const res = await fetch(`${BASE_URL}/locations`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThanOrEqual(8);
    const hasIndia = data.data.some((loc: any) => loc.code === 'IND');
    const hasUSA = data.data.some((loc: any) => loc.code === 'USA');
    expect(hasIndia).toBe(true);
    expect(hasUSA).toBe(true);
  });

  it('GET /api/websites returns shopping merchant platforms', async () => {
    const res = await fetch(`${BASE_URL}/websites`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it('GET /api/history returns search audit log', async () => {
    const res = await fetch(`${BASE_URL}/history`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('GET /api/saved returns saved listings', async () => {
    const res = await fetch(`${BASE_URL}/saved`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
