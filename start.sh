#!/bin/sh

# Print environment variables for debugging (masking sensitive info)
echo "Environment variables:"
echo "PORT=$PORT"
echo "DATABASE_URL=" $(echo $DATABASE_URL | sed 's/\/\/[^:]*:[^@]*@/\/\/****:****@/')
echo "NODE_ENV=$NODE_ENV"

# Generate Prisma client if needed
if [ ! -d "./node_modules/.prisma" ]; then
  echo "Generating Prisma client..."
  npx prisma generate
fi

# Start the Node.js server
node dist/index.js