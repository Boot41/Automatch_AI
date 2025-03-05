FROM node:22.14.0-alpine

WORKDIR /app

# Install necessary tools
RUN apk add --no-cache postgresql-client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Copy the startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Use the startup script to run migrations before starting the app
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["npm", "start"]
