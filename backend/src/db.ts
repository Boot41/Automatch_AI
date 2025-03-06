import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
});

// Test database connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  let currentAttempt = 0;
  
  while (currentAttempt < retries) {
    try {
      console.log(`Attempting database connection (attempt ${currentAttempt + 1}/${retries})...`);
      await prisma.$connect();
      console.log('Database connection successful');
      return;
    } catch (error) {
      currentAttempt++;
      console.error(`Database connection failed (attempt ${currentAttempt}/${retries}):`, error);
      
      // Log detailed connection info for debugging
      try {
        const databaseUrl = process.env.DATABASE_URL || 'Not set';
        // Mask the password in the connection string for security
        const maskedUrl = databaseUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
        console.log(`Database URL being used: ${maskedUrl}`);
      } catch (logError) {
        console.error('Error while logging connection info:', logError);
      }
      
      if (currentAttempt < retries) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Maximum connection attempts reached. Exiting...');
        process.exit(1);
      }
    }
  }
};

// Initialize connection
connectWithRetry();

// Add global error handler for Prisma
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error(`Prisma error in ${params.model}.${params.action}:`, error);
    throw error;
  }
});

export { prisma };
