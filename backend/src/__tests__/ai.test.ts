import request from 'supertest';
import { app } from '../test/testApp';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import nock from 'nock';

describe('AI Endpoints', () => {
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

  describe('POST /api/v1/ai/start', () => {
    it('should start a new chat session', async () => {
      const response = await request(app)
        .post('/api/v1/ai/start')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('session');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Hello! What product are you looking for today?');

      // Verify session was created in database
      const session = await prisma.session.findFirst({
        where: { userId }
      });
      expect(session).toBeTruthy();
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/v1/ai/start');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User must be logged in.');
    });
  });

  describe('POST /api/v1/ai/reply', () => {
    let sessionId: number;

    beforeEach(async () => {
      // Create a test session
      const session = await prisma.session.create({
        data: { userId }
      });
      sessionId = session.id;

      // Create initial bot message
      await prisma.message.create({
        data: {
          sessionId,
          role: 'bot',
          content: 'Hello! What product are you looking for today?'
        }
      });
    });

    it('should handle user reply and generate AI response', async () => {
      const userReply = 'I am looking for a car';

      const response = await request(app)
        .post('/api/v1/ai/reply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          userReply
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify messages were saved in database
      const messages = await prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' }
      });

      expect(messages).toHaveLength(3); // Initial + user message + bot response
      expect(messages[1].role).toBe('user');
      expect(messages[1].content).toBe(userReply);
      expect(messages[2].role).toBe('bot');
    });

    it('should handle dealer search with location', async () => {
      // Mock the dealer API response
      nock('http://localhost:3000')
        .post('/api/v1/dealer/find')
        .reply(200, {
          dealers: [
            {
              name: 'Test Dealer',
              address: '123 Test St',
              phone: '123-456-7890'
            }
          ]
        });

      const response = await request(app)
        .post('/api/v1/ai/reply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          userReply: 'Find dealers for cars',
          latitude: 12.34,
          longitude: 56.78
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Test Dealer');
    });

    it('should handle dealer search without location', async () => {
      const response = await request(app)
        .post('/api/v1/ai/reply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId,
          userReply: 'Find dealers for cars'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('provide your location');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/v1/ai/reply')
        .send({
          sessionId,
          userReply: 'test message'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User must be logged in.');
    });
  });
});
