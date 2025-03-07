const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection test result:', result);
    
    // Try to count users without creating anything
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
  } catch (error) {
    console.error('Error testing database connection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
