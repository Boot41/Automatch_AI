import { prisma } from '../db';

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean the database before each test
  await prisma.message.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  // Add a small delay to ensure all connections are properly closed
  await new Promise((resolve) => setTimeout(resolve, 100));
});
