// Jest setup file

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/automatch_test';

// Mock the Prisma client
jest.mock('../db', () => {
  return {
    prisma: {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
      session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
      message: {
        create: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
      $disconnect: jest.fn(),
    },
  };
});

// Mock the Gemini service
jest.mock('../services/gemini.service', () => {
  return {
    generateContent: jest.fn().mockResolvedValue('This is a mocked AI response'),
  };
});

// Global setup before tests
beforeAll(async () => {
  // Any global setup can go here
});

// Global teardown after tests
afterAll(async () => {
  // Any global teardown can go here
});
