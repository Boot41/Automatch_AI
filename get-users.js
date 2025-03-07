const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUsers() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // Don't select password for security
      }
    });
    console.log('Users:', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error getting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUsers();
