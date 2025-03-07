import request from 'supertest';
import { app } from '../../test/testApp';
import { prisma } from '../../db';
import * as sessionController from '../../controllers/session.controller';
import { Request, Response } from 'express';

// Mock the prisma client
jest.mock('../../db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com', password: 'password' }),
    },
    session: {
      create: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
      findUnique: jest.fn().mockResolvedValue({ id: 1, userId: 1, user: { id: 1, name: 'Test User', email: 'test@example.com', password: 'password' } }),
      findMany: jest.fn().mockResolvedValue([
        { id: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, userId: 1, createdAt: new Date(), updatedAt: new Date() }
      ]),
      delete: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
    },
    message: {
      findMany: jest.fn().mockResolvedValue([
        { id: 1, sessionId: 1, content: 'Hello', role: 'user', createdAt: new Date() },
        { id: 2, sessionId: 1, content: 'Hi there', role: 'bot', createdAt: new Date() }
      ]),
      deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
    },
    $disconnect: jest.fn(),
  },
}));

describe('Session Controller Unit Tests', () => {
  // Helper function to create mock request and response objects
  const mockRequestResponse = () => {
    const req: Partial<Request> = {
      body: {},
      query: {},
      params: {},
      headers: {},
      user: { id: 1, name: 'Test User', email: 'test@example.com', password: 'password' }
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return { req, res };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSessions', () => {
    it('should get all sessions for a user', async () => {
      const { req, res } = mockRequestResponse();
      
      await sessionController.getSessions(req as Request, res as Response);
      
      expect(prisma.session.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object)
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      const { req, res } = mockRequestResponse();
      req.user = undefined;
      
      await sessionController.getSessions(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not authenticated' });
    });

    it('should handle errors gracefully', async () => {
      const { req, res } = mockRequestResponse();
      
      // Mock prisma to throw an error
      (prisma.session.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await sessionController.getSessions(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getMessages', () => {
    it('should get messages for a session', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      
      await sessionController.getMessages(req as Request, res as Response);
      
      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true }
      });
      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { sessionId: 1 },
        orderBy: { createdAt: 'asc' }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      req.user = undefined;
      
      await sessionController.getMessages(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not authenticated' });
    });

    it('should return 403 if trying to access another user\'s session', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      
      // Mock session to belong to another user
      (prisma.session.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
        userId: 2, // Different from the authenticated user (1)
        user: { id: 2, name: 'Another User', email: 'another@example.com', password: 'password' }
      });
      
      await sessionController.getMessages(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access to session' });
    });

    it('should handle errors gracefully', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      
      // Mock prisma to throw an error
      (prisma.session.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await sessionController.getMessages(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('deleteSession', () => {
    it('should delete a session', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      
      await sessionController.deleteSession(req as Request, res as Response);
      
      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(prisma.message.deleteMany).toHaveBeenCalledWith({
        where: { sessionId: 1 }
      });
      expect(prisma.session.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      req.user = undefined;
      
      await sessionController.deleteSession(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not authenticated' });
    });

    it('should return 403 if trying to delete another user\'s session', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      
      // Mock session to belong to another user
      (prisma.session.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
        userId: 2 // Different from the authenticated user (1)
      });
      
      await sessionController.deleteSession(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access to session' });
    });

    it('should handle errors gracefully', async () => {
      const { req, res } = mockRequestResponse();
      req.params = { sessionId: '1' };
      
      // Mock prisma to throw an error
      (prisma.session.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await sessionController.deleteSession(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
