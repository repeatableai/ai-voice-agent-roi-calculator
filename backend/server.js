// AI Voice Agent System - Backend Server
// Production-ready Express.js server

const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const knowledgeBaseRoutes = require('./routes/knowledge-bases');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const aivaROIRoutes = require('./routes/aiva-roi');
const aivaDOCXRoutes = require('./routes/aiva-docx');

// Import middleware
const errorHandler = require('./middleware/error-handler');
const logger = require('./middleware/logger');
const validateRequest = require('./middleware/validate-request');

// Import utilities
const db = require('./db/database');
const { logInfo, logError } = require('./utils/logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ===================================
// Security Middleware
// ===================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.anthropic.com", "https://api.elevenlabs.io"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Support CORS_ORIGIN for single origin or ALLOWED_ORIGINS for multiple
    const corsOrigin = process.env.CORS_ORIGIN;
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:8000',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

    // If CORS_ORIGIN is set, add it to allowed origins
    if (corsOrigin && allowedOrigins.indexOf(corsOrigin) === -1) {
      allowedOrigins.push(corsOrigin);
    }

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};

app.use(cors(corsOptions));

// ===================================
// Request Parsing
// ===================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================================
// Logging
// ===================================

app.use(logger);

// ===================================
// Rate Limiting
// ===================================

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'development' ? 100 : 5, // More lenient in development
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});

// AI endpoint limiter (more expensive)
const aiLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // 20 AI requests per minute
  message: 'AI request rate limit exceeded'
});

app.use('/api/', generalLimiter);

// ===================================
// Session Management
// ===================================

let redisClient;
let sessionStore;

// Configure session immediately (synchronously)
const sessionConfig = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  name: 'aivoice.sid',
  cookie: {
    secure: NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 3600000, // 1 hour
    sameSite: NODE_ENV === 'production' ? 'strict' : 'lax' // Allow cross-origin in dev
  }
};

if (NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust first proxy
}

// Apply session middleware BEFORE routes
app.use(session(sessionConfig));

async function initializeRedis() {
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      sessionStore = new RedisStore({ client: redisClient });
      logInfo('Redis connected for session storage');
    } catch (error) {
      logError('Redis connection failed, using memory store:', error);
      sessionStore = null; // Will use memory store
    }
  }
}

// ===================================
// Health Check
// ===================================

app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    checks: {
      database: false,
      redis: false
    }
  };

  // Check database
  try {
    await db.query('SELECT 1');
    health.checks.database = true;
  } catch (error) {
    health.status = 'unhealthy';
    logError('Database health check failed:', error);
  }

  // Check Redis
  if (redisClient) {
    try {
      await redisClient.ping();
      health.checks.redis = true;
    } catch (error) {
      logError('Redis health check failed:', error);
    }
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// ===================================
// API Routes
// ===================================

// Auth routes (with strict rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// Agent management routes
app.use('/api/agents', agentRoutes);

// Knowledge base routes
app.use('/api/knowledge-bases', knowledgeBaseRoutes);

// AI chat routes (with AI-specific rate limiting)
app.use('/api/ai', aiLimiter, aiRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// AIVA ROI Calculator routes
app.use('/api/aiva', aivaROIRoutes);

// AIVA DOCX Generation routes
app.use('/api/aiva', aivaDOCXRoutes);

// ===================================
// Static Files - Serve AIVA Frontend
// ===================================

// Path resolution for Render compatibility
// Use process.cwd() for Render compatibility
// In Render: process.cwd() = /opt/render/project/src (project root)
// In local: process.cwd() = project root
const projectRoot = process.cwd();
const frontendPath = path.join(projectRoot, 'AIVA', 'dist');

// Fallback to __dirname for local development if needed
const fallbackPath = path.join(__dirname, '../AIVA/dist');

// Determine final path - use process.cwd() path if it exists, otherwise fallback
let finalPath;
if (fs.existsSync(frontendPath)) {
  finalPath = frontendPath;
} else if (fs.existsSync(fallbackPath)) {
  finalPath = fallbackPath;
  logInfo(`Using fallback path: ${fallbackPath}`);
} else {
  // Try alternative paths
  const alternatives = [
    path.join(process.cwd(), 'AIVA', 'dist'),
    path.join(__dirname, '../AIVA/dist'),
    path.join(__dirname, '../../AIVA/dist'),
  ];
  
  for (const altPath of alternatives) {
    if (fs.existsSync(altPath)) {
      finalPath = altPath;
      logInfo(`Using alternative path: ${altPath}`);
      break;
    }
  }
  
  // If still not found, use frontendPath as default (will error later with better logging)
  if (!finalPath) {
    finalPath = frontendPath;
  }
}

// Comprehensive logging for debugging
logInfo(`=== Frontend Path Resolution ===`);
logInfo(`process.cwd(): ${process.cwd()}`);
logInfo(`__dirname: ${__dirname}`);
logInfo(`frontendPath (cwd): ${frontendPath}`);
logInfo(`fallbackPath (__dirname): ${fallbackPath}`);
logInfo(`finalPath: ${finalPath}`);
logInfo(`finalPath exists: ${fs.existsSync(finalPath)}`);

if (fs.existsSync(finalPath)) {
  const files = fs.readdirSync(finalPath);
  logInfo(`Frontend directory exists with ${files.length} files`);
  logInfo(`Files: ${files.slice(0, 10).join(', ')}${files.length > 10 ? '...' : ''}`);
} else {
  logError(`Frontend directory does NOT exist at: ${finalPath}`);
  logError(`Also checked: ${fallbackPath}`);
  logError(`Directory listing of project root:`);
  try {
    const rootFiles = fs.readdirSync(process.cwd());
    logError(`Root files: ${rootFiles.join(', ')}`);
  } catch (e) {
    logError(`Cannot read project root: ${e.message}`);
  }
}

// Serve static files (CSS, JS, images, etc.) - MUST come before catch-all
// Wrap express.static in error-handling middleware to prevent JSON responses
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Only handle static files if directory exists
  if (!fs.existsSync(finalPath)) {
    // If it's a file request and directory doesn't exist, return proper 404
    if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
      return res.status(404).type('text/plain').send(`Static file directory not found`);
    }
    // Otherwise continue to catch-all route
    return next();
  }
  
  // Set up express.static with error handling
  const staticMiddleware = express.static(finalPath, {
    maxAge: '1y',
    etag: true,
    index: false,
    fallthrough: true
  });
  
  // Call static middleware with error handling
  staticMiddleware(req, res, (err) => {
    if (err) {
      // Error occurred - handle it here, don't let it reach error handler
      logError(`Static file error for ${req.path}: ${err.message}`);
      if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
        // It's a file request - return proper 404
        return res.status(404).type('text/plain').send(`File not found: ${req.path}`);
      }
      // Not a file request, continue to next middleware
      return next();
    }
    
    // If response was sent, don't continue
    if (res.headersSent) {
      return;
    }
    
    // If no error and response not sent, continue to next middleware
    next();
  });
});

// Serve index.html for non-API routes (SPA routing)
// This only catches routes that don't match static files
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Handle missing static files - return proper 404 with correct content type
  if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
    // This is a file request that wasn't found by express.static
    // Return proper 404, not JSON
    return res.status(404).type('text/plain').send(`File not found: ${req.path}`);
  }
  
  // Serve index.html for SPA routes
  const indexPath = path.join(finalPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    logError(`index.html not found at: ${indexPath}`);
    logError(`Tried paths: ${finalPath}, ${fallbackPath}`);
    logError(`Current working directory: ${process.cwd()}`);
    logError(`__dirname: ${__dirname}`);
    return res.status(404).type('text/html').send(`
      <html><body>
        <h1>404 - Frontend not found</h1>
        <p>Path: ${indexPath}</p>
        <p>Frontend path: ${finalPath}</p>
        <p>cwd: ${process.cwd()}</p>
        <p>__dirname: ${__dirname}</p>
      </body></html>
    `);
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      logError(`Error serving index.html: ${err.message}`);
      return res.status(500).type('text/html').send(`
        <html><body>
          <h1>500 - Error serving frontend</h1>
          <p>${err.message}</p>
        </body></html>
      `);
    }
  });
});

// ===================================
// Error Handling
// ===================================

// 404 handler - only for API routes
app.use((req, res) => {
  // Only API routes should reach here (frontend routes handled above)
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`
    });
  }
  
  // This shouldn't happen for frontend routes, but just in case
  const indexPath = path.join(finalPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).type('text/html').send(`
      <html>
        <body>
          <h1>404 - Frontend not found</h1>
          <p>Please ensure the frontend is built.</p>
          <p>Path: ${finalPath}</p>
        </body>
      </html>
    `);
  }
});

// Global error handler
app.use(errorHandler);

// ===================================
// Graceful Shutdown
// ===================================

async function gracefulShutdown(signal) {
  logInfo(`${signal} received, starting graceful shutdown`);

  // Stop accepting new requests
  server.close(async () => {
    logInfo('HTTP server closed');

    // Close database connections
    try {
      await db.end();
      logInfo('Database connections closed');
    } catch (error) {
      logError('Error closing database:', error);
    }

    // Close Redis connection
    if (redisClient) {
      try {
        await redisClient.quit();
        logInfo('Redis connection closed');
      } catch (error) {
        logError('Error closing Redis:', error);
      }
    }

    logInfo('Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logError('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logError('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ===================================
// Server Startup
// ===================================

let server;

async function startServer() {
  try {
    // Initialize database (non-blocking - server can start without DB for AIVA routes)
    db.initialize().then(() => {
      logInfo('Database initialized');
    }).catch((error) => {
      logError('Database initialization failed (server will continue without DB):', error.message);
      logInfo('Note: AIVA ROI routes do not require database connection');
    });

    // Initialize Redis (optional)
    await initializeRedis();

    // Start server
    server = app.listen(PORT, () => {
      logInfo(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      logInfo(`📡 API available at http://localhost:${PORT}/api`);
      logInfo(`💚 Health check at http://localhost:${PORT}/health`);
    });

  } catch (error) {
    logError('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Export for testing
module.exports = app;
