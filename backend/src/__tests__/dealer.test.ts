import request from 'supertest';
import { app } from '../test/testApp';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import nock from 'nock';

describe('Dealer Endpoints', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword'
      }
    });
    userId = user.id;
    authToken = jwt.sign({ userId: user.id }, JWT_SECRET);
  });

  describe('POST /api/v1/dealer/find', () => {
    beforeEach(() => {
      // Mock the geocoding service
      nock('https://nominatim.openstreetmap.org')
        .get(/reverse.*/)        .reply(200, {
          address: {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India'
          }
        });

      // Mock the SerpAPI service
      nock('https://serpapi.com')
        .get(/search.*/)        .reply(200, {
          local_results: [
            {
              name: 'Test Dealer',
              address: '123 Test St',
              phone: '123-456-7890'
            }
          ]
        });
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should find nearby dealers with valid coordinates', async () => {
      const response = await request(app)
        .post('/api/v1/dealer/find')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product: 'car',
          latitude: 19.0760,
          longitude: 72.8777
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('dealers');
      expect(Array.isArray(response.body.dealers)).toBe(true);
      expect(response.body.dealers[0]).toHaveProperty('name');
      expect(response.body.dealers[0]).toHaveProperty('address');
      expect(response.body.dealers[0]).toHaveProperty('phone');
    });

    it('should return 400 if coordinates are missing', async () => {
      const response = await request(app)
        .post('/api/v1/dealer/find')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product: 'car'
          // missing latitude and longitude
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product, Latitude & Longitude are required');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/v1/dealer/find')
        .send({
          product: 'car',
          latitude: 19.0760,
          longitude: 72.8777
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User must be logged in.');
    });

    it('should handle geocoding service error', async () => {
      nock.cleanAll();
      nock('https://nominatim.openstreetmap.org')
        .get(/reverse.*/)        .replyWithError('Geocoding service error');

      const response = await request(app)
        .post('/api/v1/dealer/find')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product: 'car',
          latitude: 19.0760,
          longitude: 72.8777
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch location');
    });

    it('should handle dealer search service error', async () => {
      nock.cleanAll();
      nock('https://nominatim.openstreetmap.org')
        .get(/reverse.*/)        .reply(200, {
          address: {
            city: 'Mumbai'
          }
        });
      nock('https://serpapi.com')
        .get(/search.*/)        .replyWithError('Dealer search service error');

      const response = await request(app)
        .post('/api/v1/dealer/find')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product: 'car',
          latitude: 19.0760,
          longitude: 72.8777
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch dealers');
    });
  });
});
