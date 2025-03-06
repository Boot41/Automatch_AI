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
CMD ["/app/start.sh"]