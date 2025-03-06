FROM node:22.14.0

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the entire app to the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the backend port
EXPOSE 3000

# Create a startup script
RUN echo '#!/bin/bash\necho "Running migrations..."\nnpx prisma migrate deploy\necho "Pushing schema..."\nnpx prisma db push --accept-data-loss\necho "Starting server..."\nnpm start' > /app/start.sh && chmod +x /app/start.sh

# Start the backend app
CMD ["/app/start.sh"]FROM node:22.14.0

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the entire app to the container
COPY . .

# Set environment variables (secrets) directly in the Dockerfile
ENV DATABASE_URL="postgresql://neondb_owner:npg_7B2VWHjCeYuT@ep-silent-violet-a10469r9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
ENV JWT_SECRET="automatch_secret"
ENV GEMINI_API_KEY="AIzaSyAj5Gh1iLFG0HvdZqaNGTVJkbkeLX5S5nE"
ENV SERP_API_KEY="4f68aa9b6e7491102b020c0f28f8b283af8fa5e7a83d67844c267751c78fc638"

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Expose the backend port
EXPOSE 3000

# Start the backend app
CMD ["npm", "start"]