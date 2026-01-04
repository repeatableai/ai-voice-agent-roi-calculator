# Use Node.js 18
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY AIVA/package*.json ./AIVA/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Install frontend dependencies and build
WORKDIR /app/AIVA
RUN npm ci
RUN npm run build

# Copy backend code
WORKDIR /app
COPY backend/ ./backend/

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]

