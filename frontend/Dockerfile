FROM node:22.14.0-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev"]
