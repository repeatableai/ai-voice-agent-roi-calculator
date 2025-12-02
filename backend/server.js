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
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.anthropic.com", "https://api.elevenlabs.io"],
      fontSrc: ["'self'"],
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
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:8000',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

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
// Static Files (Optional)
// ===================================

// Serve static files in both development and production
app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ===================================
// Error Handling
// ===================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
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
