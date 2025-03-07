import request from 'supertest';
import { app } from '../../test/testApp';
import { prisma } from '../../db';
import * as dealerController from '../../controllers/dealer.controller';
import * as dealerService from '../../services/dealer.service';
import { Request, Response } from 'express';

// Mock the dealer service
jest.mock('../../services/dealer.service', () => ({
  searchDealers: jest.fn().mockResolvedValue([
    { name: 'Test Dealer', address: '123 Test St', phone: '123-456-7890' }
  ])
}));

// Mock the prisma client
jest.mock('../../db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' }),
    },
    session: {
      findUnique: jest.fn().mockResolvedValue({ id: 1, userId: 1, user: { id: 1, name: 'Test User', email: 'test@example.com', password: 'password' } }),
    },
    $disconnect: jest.fn(),
  },
}));

describe('Dealer Controller Unit Tests', () => {
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

  describe('findDealers', () => {
    it('should find dealers successfully', async () => {
      const { req, res } = mockRequestResponse();
      req.body = { location: '12345', productName: 'iphone' };
      
      await dealerController.findDealers(req as Request, res as Response);
      
      expect(dealerService.searchDealers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if product name is missing', async () => {
      const { req, res } = mockRequestResponse();
      req.body = { location: '12345' };
      
      await dealerController.findDealers(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if location is missing', async () => {
      const { req, res } = mockRequestResponse();
      req.body = { productName: 'iphone' };
      
      await dealerController.findDealers(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const { req, res } = mockRequestResponse();
      req.body = { location: '12345', productName: 'iphone' };
      
      // Mock dealer service to throw an error
      (dealerService.searchDealers as jest.Mock).mockRejectedValueOnce(new Error('Service error'));
      
      await dealerController.findDealers(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
    });
  });
});
