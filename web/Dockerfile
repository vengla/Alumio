FROM node:18-alpine

WORKDIR /app

# Copy package info
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start Next.js production server
CMD ["npm", "start"]
