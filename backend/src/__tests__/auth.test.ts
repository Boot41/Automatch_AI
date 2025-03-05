import request from 'supertest';
import { app } from '../test/testApp'; // Make sure you export your express app
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

describe('Authentication Endpoints', () => {
  // Clear the database before each test
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/auth/signup', () => {
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(signupData.email);
      expect(response.body.name).toBe(signupData.name);
      expect(response.body).not.toHaveProperty('password'); // Password should not be returned
    });

    it('should return 400 if user already exists', async () => {
      // First create a user
      await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData);

      // Try to create the same user again
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User Already Exists');
    });

    it('should return 400 if required fields are missing', async () => {
      jest.setTimeout(10000);
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          // email missing
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/signin', () => {
    beforeEach(async () => {
      // Create a test user before each signin test
      await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should sign in user successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Email');
    });

    it('should return 400 for invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Password');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create a test user and get token
      const signupResponse = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      const signinResponse = await request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      authToken = signinResponse.body.token;
    });

    it('should return user data for authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('name', 'Test User');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User must be logged in.');
    });

    it('should return 401 with invalid auth token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User must be logged in.');
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});
