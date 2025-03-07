const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('Starting auth test...');
    
    // Step 1: Get the user
    console.log('Step 1: Finding user...');
    const user = await prisma.user.findUnique({
      where: { email: 'test6@gmail.com' },
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', { id: user.id, email: user.email, name: user.name });
    
    // Step 2: Test bcrypt separately
    console.log('Step 2: Testing bcrypt...');
    try {
      console.log('Hashing a test password...');
      const testHash = await bcrypt.hash('testpassword', 10);
      console.log('Test hash created:', testHash);
    } catch (bcryptError) {
      console.error('Error with bcrypt hash:', bcryptError);
    }
    
    // Step 3: Try to compare passwords
    console.log('Step 3: Comparing passwords...');
    try {
      const isValid = await bcrypt.compare('test123', user.password);
      console.log('Password comparison result:', isValid);
    } catch (compareError) {
      console.error('Error comparing passwords:', compareError);
    }
    
  } catch (error) {
    console.error('Error in auth test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
