const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'testuser@example.com' },
    });
    
    if (existingUser) {
      console.log('User already exists:', { id: existingUser.id, email: existingUser.email });
      return;
    }
    
    // Create a new user with a known password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const newUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: hashedPassword
      },
    });
    
    console.log('User created successfully:', { id: newUser.id, email: newUser.email, name: newUser.name });
    console.log('Login credentials:');
    console.log('Email: testuser@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
