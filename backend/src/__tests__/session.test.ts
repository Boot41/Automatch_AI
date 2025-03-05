import request from 'supertest';
import { app } from '../test/testApp';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

describe('Session Endpoints', () => {
  let authToken: string;
  let userId: number;
  let sessionId: number;

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

    // Create a test session
    const session = await prisma.session.create({
      data: { userId }
    });
    sessionId = session.id;

    // Create some test messages
    await prisma.message.createMany({
      data: [
        {
          sessionId,
          role: 'bot',
          content: 'Hello! What product are you looking for today?'
        },
        {
          sessionId,
          role: 'user',
          content: 'I am looking for a car'
        },
        {
          sessionId,
          role: 'bot',
          content: 'I can help you find a car dealer.'
        }
      ]
    });
  });

  describe('GET /api/v1/user/sessions', () => {
    it('should get all sessions for authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/user/sessions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sessions');
      expect(Array.isArray(response.body.sessions)).toBe(true);
      expect(response.body.sessions.length).toBeGreaterThan(0);
      expect(response.body.sessions[0]).toHaveProperty('id', sessionId);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/v1/user/sessions');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User must be logged in.');
    });
  });

  describe('GET /api/v1/user/messages/:sessionId', () => {
    it('should get all messages for a valid session', async () => {
      const response = await request(app)
        .get(`/api/v1/user/messages/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('messages');
      expect(Array.isArray(response.body.messages)).toBe(true);
      expect(response.body.messages.length).toBe(3);
      expect(response.body.messages[0].role).toBe('bot');
      expect(response.body.messages[1].role).toBe('user');
      expect(response.body.messages[2].role).toBe('bot');
    });

    it('should return 403 for unauthorized session access', async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          name: 'Other User',
          email: 'other@example.com',
          password: 'hashedpassword'
        }
      });
      const otherUserToken = jwt.sign({ userId: otherUser.id }, JWT_SECRET);

      const response = await request(app)
        .get(`/api/v1/user/messages/${sessionId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Unauthorized access to session');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get(`/api/v1/user/messages/${sessionId}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User must be logged in.');
    });

    it('should handle invalid session ID', async () => {
      const invalidSessionId = 99999;
      const response = await request(app)
        .get(`/api/v1/user/messages/${invalidSessionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Unauthorized access to session');
    });
  });
});
