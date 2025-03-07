# Use Node.js as base image
FROM node:19-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
WORKDIR /app/backend
RUN npm install --production
WORKDIR /app/frontend
RUN npm install

# Copy source code
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
COPY start.sh .
RUN chmod +x start.sh

# Generate Prisma client
WORKDIR /app/backend
RUN npx prisma generate

# Build the client at build time
WORKDIR /app/frontend
ENV NODE_ENV=production
RUN npm run build

# Copy env.js to the dist directory
RUN cp env.js dist/

# Set working directory back to app root
WORKDIR /app

# Expose backend port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Start using the start script
CMD ["./start.sh"]