FROM node:18-alpine

WORKDIR /app

# Copy package info
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
