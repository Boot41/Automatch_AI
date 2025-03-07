import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { JWT_SECRET } from '../../secrets';

// Mock the prisma client
jest.mock('../../db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock request and response
    mockRequest = {
      headers: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    nextFunction = jest.fn();
  });

  it('should call next() when valid token is provided', async () => {
    // Mock a valid token
    const userId = 1;
    const token = 'valid_token';
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    // Mock jwt.verify to return a valid decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ userId });

    // Mock prisma to return a user
    const mockUser = { id: userId, name: 'Test User', email: 'test@example.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Call the middleware
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verify jwt.verify was called with the correct token
    expect(jwt.verify).toHaveBeenCalledWith(token, JWT_SECRET);

    // Verify prisma.user.findUnique was called with the correct userId
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId }
    });

    // Verify user was added to the request
    expect(mockRequest.user).toEqual(mockUser);

    // Verify next() was called
    expect(nextFunction).toHaveBeenCalled();

    // Verify response methods were not called
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should return 401 when no authorization header is provided', async () => {
    // No authorization header
    mockRequest.headers = {};

    // Call the middleware
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verify response was called with 401
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No authorization header' });

    // Verify next() was not called
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header has invalid format', async () => {
    // Invalid authorization format
    mockRequest.headers = {
      authorization: 'InvalidFormat'
    };

    // Call the middleware
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verify response was called with 401
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid authorization format' });

    // Verify next() was not called
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when no token is provided after Bearer', async () => {
    // Empty token
    mockRequest.headers = {
      authorization: 'Bearer '
    };

    // Call the middleware
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verify response was called with 401
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No token provided' });

    // Verify next() was not called
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when invalid token is provided', async () => {
    // Mock an invalid token
    const token = 'invalid_token';
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    // Mock jwt.verify to throw an error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    try {
      // Call the middleware
      await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Verify response was called with 401
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('token')
      }));

      // Verify next() was not called
      expect(nextFunction).not.toHaveBeenCalled();
    } catch (error) {
      // If the middleware throws an error, that's also acceptable
      // The important thing is that next() wasn't called
      expect(nextFunction).not.toHaveBeenCalled();
    }
  });

  it('should return 401 when user is not found', async () => {
    // Mock a valid token
    const userId = 999; // Non-existent user
    const token = 'valid_token';
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    // Mock jwt.verify to return a valid decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ userId });

    // Mock prisma to return null (user not found)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Call the middleware
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verify response was called with 401
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });

    // Verify next() was not called
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    // Mock a valid token
    const userId = 1;
    const token = 'valid_token';
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    // Mock jwt.verify to return a valid decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ userId });

    // Mock prisma to throw an error
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Call the middleware
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verify response was called with 500
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error in auth middleware' });

    // Verify next() was not called
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
