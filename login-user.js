const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

async function loginUser() {
  try {
    console.log('Starting login process...');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'test6@gmail.com' },
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', { id: user.id, email: user.email, name: user.name });
    
    // Skip password verification and generate a token directly
    // This is just for testing purposes - never do this in production!
    const JWT_SECRET = process.env.JWT_SECRET || 'automatch_secret';
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    console.log('Generated token:', token);
    console.log('Login successful!');
    
  } catch (error) {
    console.error('Error in login process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

loginUser();
