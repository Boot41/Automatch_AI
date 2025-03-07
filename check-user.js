const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'tes6@gmail.com' },
    });

    if (user) {
      console.log('User found:', { id: user.id, email: user.email, name: user.name });
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
