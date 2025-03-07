import request from 'supertest';
import { app } from '../../test/testApp';
import { prisma } from '../../db';
import nock from 'nock';
import * as geminiService from '../../services/gemini.service';
import * as aiController from '../../controllers/ai.controller';
import { Request, Response } from 'express';

// Mock the generateContent function from the gemini service
jest.mock('../../services/gemini.service', () => ({
  generateContent: jest.fn().mockResolvedValue('This is a mocked AI response')
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: { dealers: [] } })
}));

// Mock the prisma client
jest.mock('../../db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({}),
    },
    session: {
      create: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
      findUnique: jest.fn().mockResolvedValue({ id: 1, userId: 1, user: { id: 1, name: 'Test User', email: 'test@example.com', password: 'password' } }),
      findMany: jest.fn().mockResolvedValue([]),
      deleteMany: jest.fn().mockResolvedValue({}),
    },
    message: {
      create: jest.fn().mockResolvedValue({ id: 1, content: 'Hello', role: 'bot' }),
      findMany: jest.fn().mockResolvedValue([{ id: 1, content: 'Hello', role: 'bot' }]),
      deleteMany: jest.fn().mockResolvedValue({}),
    },
    $disconnect: jest.fn(),
  },
}));

describe('AI Controller Unit Tests', () => {
  // Helper function to create mock request and response objects
  const mockRequestResponse = () => {
    const req: Partial<Request> = {
      body: {},
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

  describe('startChat', () => {
    it('should create a new session and return welcome message', async () => {
      const { req, res } = mockRequestResponse();
      
      await aiController.startChat(req as Request, res as Response);
      
      expect(prisma.session.create).toHaveBeenCalledWith({
        data: { userId: 1 }
      });
      expect(prisma.message.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      const { req, res } = mockRequestResponse();
      req.user = undefined;
      
      await aiController.startChat(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not authenticated' });
    });

    it('should handle errors gracefully', async () => {
      const { req, res } = mockRequestResponse();
      
      // Mock prisma to throw an error
      (prisma.session.create as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await aiController.startChat(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('replyChat', () => {
    it('should process user reply and return AI response', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        userReply: 'Hello AI'
      };
      
      await aiController.replyChat(req as Request, res as Response);
      
      expect(prisma.message.create).toHaveBeenCalledTimes(2); // User message and AI response
      expect(prisma.message.findMany).toHaveBeenCalled();
      expect(geminiService.generateContent).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      const { req, res } = mockRequestResponse();
      req.user = undefined;
      req.body = {
        sessionId: 1,
        userReply: 'Hello AI'
      };
      
      await aiController.replyChat(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not authenticated' });
    });

    it('should handle dealer search requests', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        userReply: 'find dealers near me'
      };
      
      // Mock previous messages to include product information
      (prisma.message.findMany as jest.Mock).mockResolvedValueOnce([
        { id: 1, role: 'bot', content: 'Here are some **iPhone** models' },
        { id: 2, role: 'user', content: 'find dealers near me' }
      ]);
      
      await aiController.replyChat(req as Request, res as Response);
      
      // Verify that the dealer extraction logic was triggered
      expect(prisma.message.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle dealer search with no product identified', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        userReply: 'find dealers near me'
      };
      
      // Mock previous messages without product information
      (prisma.message.findMany as jest.Mock).mockResolvedValueOnce([
        { id: 1, role: 'bot', content: 'How can I help you?' },
        { id: 2, role: 'user', content: 'find dealers near me' }
      ]);
      
      await aiController.replyChat(req as Request, res as Response);
      
      expect(prisma.message.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors in dealer API', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        userReply: 'find dealers for iphone'
      };
      
      // Mock previous messages to include product information
      (prisma.message.findMany as jest.Mock).mockResolvedValueOnce([
        { id: 1, role: 'bot', content: 'Here are some **iPhone** models' },
        { id: 2, role: 'user', content: 'find dealers for iphone' }
      ]);
      
      // Mock axios to throw an error
      const axios = require('axios');
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      await aiController.replyChat(req as Request, res as Response);
      
      expect(prisma.message.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors in AI service', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        userReply: 'Hello AI'
      };
      
      // Mock AI service to throw an error
      (geminiService.generateContent as jest.Mock).mockRejectedValueOnce(new Error('AI service error'));
      
      await aiController.replyChat(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
  });

  describe('saveDealerMessage', () => {
    it('should save dealer message to the session', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        userMessage: 'Show me dealers',
        dealerData: {
          type: 'dealer',
          message: 'Here are some dealers',
          dealers: [{ name: 'Test Dealer' }]
        }
      };
      
      await aiController.saveDealerMessage(req as Request, res as Response);
      
      expect(prisma.session.findUnique).toHaveBeenCalled();
      expect(prisma.message.create).toHaveBeenCalledTimes(2); // User message and dealer message
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 401 if user is not authenticated', async () => {
      const { req, res } = mockRequestResponse();
      req.user = undefined;
      req.body = {
        sessionId: 1,
        dealerData: {}
      };
      
      await aiController.saveDealerMessage(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not authenticated' });
    });

    it('should return 403 if trying to access another user\'s session', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        dealerData: {}
      };
      
      // Mock session to belong to another user
      (prisma.session.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 1,
        userId: 2, // Different from the authenticated user (1)
        user: { id: 2, name: 'Another User', email: 'another@example.com', password: 'password' }
      });
      
      await aiController.saveDealerMessage(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access to session' });
    });

    it('should handle errors gracefully', async () => {
      const { req, res } = mockRequestResponse();
      req.body = {
        sessionId: 1,
        dealerData: {}
      };
      
      // Mock prisma to throw an error
      (prisma.session.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      await aiController.saveDealerMessage(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('extractProduct', () => {
    it('should extract product from bot recommendations', () => {
      const messages = [
        { role: 'bot', content: 'Here are some **iPhone** models you might like' },
        { role: 'user', content: 'find dealers near me' }
      ];
      
      // Call the private function through the controller object
      const result = (aiController as any).extractProduct(messages);
      
      expect(result).toBe('iPhone');
    });

    it('should extract product from user messages', () => {
      const messages = [
        { role: 'bot', content: 'What product are you looking for?' },
        { role: 'user', content: 'I want to buy a samsung phone' }
      ];
      
      const result = (aiController as any).extractProduct(messages);
      
      expect(result).toBe('samsung');
    });

    it('should extract product category if no specific product is mentioned', () => {
      const messages = [
        { role: 'bot', content: 'What product are you looking for?' },
        { role: 'user', content: 'I want to buy a smartphone' }
      ];
      
      const result = (aiController as any).extractProduct(messages);
      
      expect(result).toBe('smartphone');
    });

    it('should return null if no product is identified', () => {
      const messages = [
        { role: 'bot', content: 'How can I help you?' },
        { role: 'user', content: 'I want to see what\'s available' }
      ];
      
      const result = (aiController as any).extractProduct(messages);
      
      expect(result).toBeNull();
    });
  });
});
