const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'tes6@gmail.com',
        password: hashedPassword
      },
    });

    console.log('User created successfully:', { id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
