#!/bin/sh
set -e

# Wait for the database to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Check if database exists and has tables
PGPASSWORD=postgres psql -h db -U postgres -d automatch -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User');" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  # Database tables don't exist, run migrations
  echo "Setting up database schema..."
  npx prisma db push --accept-data-loss
else
  echo "Database schema already exists"
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Start the application
echo "Starting the application..."
exec "$@"
