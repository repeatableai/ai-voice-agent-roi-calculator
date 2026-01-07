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
const PORT = process.env.PORT || 8080; // Fly.io uses 8080, Render uses 10000, local uses 3000
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

// Path resolution - Works for Fly.io, Render, and local development
// Fly.io Docker: WORKDIR /app/backend, so __dirname = /app/backend
// Render: startCommand "cd backend && npm start", so __dirname = /opt/render/project/src/backend
// Local: depends on how you start, but __dirname = <project>/backend

let finalPath;
let frontendPath;
let fallbackPath;

try {
  // Primary path: from backend/ directory, go up one level to project root, then to AIVA/dist
  const primaryPath = path.join(__dirname, '../AIVA/dist');
  
  // Try multiple paths to handle different deployment scenarios
  const pathsToTry = [
    primaryPath,                                    // __dirname/../AIVA/dist (most reliable)
    path.join(process.cwd(), '../AIVA/dist'),      // process.cwd()/../AIVA/dist
    path.join(__dirname, '../../AIVA/dist'),       // __dirname/../../AIVA/dist
    path.join(process.cwd(), 'AIVA/dist'),         // process.cwd()/AIVA/dist
  ];
  
  logInfo(`[PATH] Resolving frontend path...`);
  logInfo(`[PATH] __dirname: ${__dirname}`);
  logInfo(`[PATH] process.cwd(): ${process.cwd()}`);
  
  for (const testPath of pathsToTry) {
    logInfo(`[PATH] Checking: ${testPath} - exists: ${fs.existsSync(testPath)}`);
    if (fs.existsSync(testPath)) {
      finalPath = testPath;
      logInfo(`[PATH] ✓ Found: ${finalPath}`);
      break;
    }
  }
  
  if (!finalPath) {
    logError(`[PATH] ✗ No valid path found! Tried:`);
    pathsToTry.forEach(p => logError(`[PATH]   - ${p}`));
    // Use primary path as fallback (will show error when trying to serve)
    finalPath = primaryPath;
    logError(`[PATH] Using fallback: ${finalPath}`);
  }
  
  frontendPath = primaryPath;
  fallbackPath = pathsToTry[1] || primaryPath;
  
} catch (err) {
  logError(`CRITICAL: Error in path resolution: ${err.message}`);
  logError(`CRITICAL: Stack: ${err.stack}`);
  // Set a default path to prevent server crash
  finalPath = path.join(__dirname, '../AIVA/dist');
  frontendPath = finalPath;
  fallbackPath = finalPath;
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

// Serve static files (CSS, JS, images, etc.) - Use express.static for reliability
if (fs.existsSync(finalPath)) {
  try {
    // Use express.static middleware - express handles content types automatically
    app.use(express.static(finalPath, {
      maxAge: '1y', // Cache for 1 year
      etag: true,
      lastModified: true
      // Removed setHeaders - express.static handles content types automatically
    }));
    logInfo(`[STATIC] Serving static files from: ${finalPath}`);
    
    // Verify files are accessible
    const assetsPath = path.join(finalPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      const assetFiles = fs.readdirSync(assetsPath);
      logInfo(`[STATIC] Found ${assetFiles.length} asset files in assets/ directory`);
    }
  } catch (err) {
    logError(`[STATIC] Error setting up static file serving: ${err.message}`);
    logError(`[STATIC] Stack: ${err.stack}`);
  }
} else {
  logError(`[STATIC] Static files directory not found: ${finalPath}`);
  logError(`[STATIC] Current working directory: ${process.cwd()}`);
  logError(`[STATIC] __dirname: ${__dirname}`);
  
  // Try to list what's actually in the directory
  try {
    const parentDir = path.dirname(finalPath);
    if (fs.existsSync(parentDir)) {
      const parentFiles = fs.readdirSync(parentDir);
      logError(`[STATIC] Files in parent directory: ${parentFiles.join(', ')}`);
    }
  } catch (e) {
    logError(`[STATIC] Cannot list parent directory: ${e.message}`);
  }
}

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

// Global error handler - MUST be last
// Add check to prevent handling static file errors (they should be handled above)
app.use((err, req, res, next) => {
  // If this is a static file request, it should have been handled already
  // If we're here, something went wrong - log it but don't return JSON
  if (!req.path.startsWith('/api') && req.path.match(/\.[a-zA-Z0-9]+$/)) {
    logError(`[ERROR HANDLER] Static file error reached error handler - this should not happen!`);
    logError(`[ERROR HANDLER] Path: ${req.path}`);
    logError(`[ERROR HANDLER] Error: ${err.message}`);
    logError(`[ERROR HANDLER] Stack: ${err.stack}`);
    if (!res.headersSent) {
      const contentType = req.path.endsWith('.css') ? 'text/css' : 
                         req.path.endsWith('.js') ? 'application/javascript' : 'text/plain';
      return res.status(err.statusCode || 500).type(contentType).send(`/* Error: ${err.message} */`);
    }
    return;
  }
  // For non-static file errors, use the normal error handler
  errorHandler(err, req, res, next);
});

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
