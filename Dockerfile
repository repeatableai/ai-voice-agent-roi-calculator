# Use Node.js 18
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY AIVA/package*.json ./AIVA/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Install frontend dependencies
WORKDIR /app/AIVA
RUN npm ci

# Copy frontend source files (needed for build)
# Copy all AIVA files except node_modules (already installed) and dist (will be built)
COPY AIVA/index.html AIVA/vite.config.js AIVA/tailwind.config.js AIVA/postcss.config.js AIVA/eslint.config.js ./
COPY AIVA/src ./src
COPY AIVA/public ./public

# Build frontend
WORKDIR /app/AIVA
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

