# Multi-stage build for AutomatchAI
# Stage 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Build backend
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
# Copy prisma directory first to ensure schema is available
COPY backend/prisma ./prisma/
RUN npm install
COPY backend ./
RUN npx prisma generate
RUN npm run build

# Stage 3: Production environment
FROM node:18
WORKDIR /app

# Copy built artifacts from previous stages
COPY --from=frontend-build /app/frontend/dist ./public
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/package.json ./package.json

# Copy prisma directory for runtime
COPY --from=backend-build /app/backend/prisma ./prisma

# Copy .env file
COPY backend/.env ./

# Create start script
COPY start.sh ./
RUN chmod +x start.sh

# Expose the port
EXPOSE 3000

# Set environment variables explicitly
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="postgresql://neondb_owner:npg_7B2VWHjCeYuT@ep-silent-violet-a10469r9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
ENV JWT_SECRET="automatch_secret"
ENV GEMINI_API_KEY="AIzaSyAj5Gh1iLFG0HvdZqaNGTVJkbkeLX5S5nE"
ENV SERP_API_KEY="4f68aa9b6e7491102b020c0f28f8b283af8fa5e7a83d67844c267751c78fc638"

# Start the application
CMD ["./start.sh"]