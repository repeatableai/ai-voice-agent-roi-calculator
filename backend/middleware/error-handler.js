// Global Error Handler Middleware

const { logError } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  // CRITICAL: Never return JSON for static file requests
  // Check if this is a static file request (has file extension and not API route)
  if (!req.path.startsWith('/api') && req.path.match(/\.[a-zA-Z0-9]+$/)) {
    logError(`Static file error reached error handler (should not happen): ${req.path} - ${err.message}`);
    // Return proper error for static files, not JSON
    if (!res.headersSent) {
      const statusCode = err.statusCode || err.status || 500;
      // Determine content type based on file extension
      let contentType = 'text/plain';
      if (req.path.endsWith('.css')) {
        contentType = 'text/css';
      } else if (req.path.endsWith('.js')) {
        contentType = 'application/javascript';
      }
      return res.status(statusCode).type(contentType).send(`Error loading ${req.path}: ${err.message}`);
    }
    return;
  }
  
  // Also check for common static file paths
  if (!req.path.startsWith('/api') && (req.path.startsWith('/assets/') || req.path.startsWith('/static/'))) {
    logError(`Static asset error reached error handler: ${req.path} - ${err.message}`);
    if (!res.headersSent) {
      return res.status(err.statusCode || 404).type('text/plain').send(`Asset not found: ${req.path}`);
    }
    return;
  }
  
  // Log error
  logError('Request error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.session?.userId
  });

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      maxSize: process.env.MAX_FILE_SIZE || '10MB'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Unexpected file field'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details
    });
  }

  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      error: 'Resource already exists'
    });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: 'Referenced resource does not exist'
    });
  }

  if (err.code === '23502') { // Not null violation
    return res.status(400).json({
      error: 'Required field missing'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Anthropic API errors
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({
      error: 'AI service error',
      message: process.env.NODE_ENV === 'production'
        ? 'Failed to process AI request'
        : err.message
    });
  }

  // Default error response - ALWAYS log full error details
  const statusCode = err.statusCode || err.status || 500;
  
  // Log FULL error details for debugging
  logError('Full error details:', {
    message: err.message,
    name: err.name,
    stack: err.stack,
    status: err.status,
    statusCode: err.statusCode,
    code: err.code,
    type: err.constructor?.name,
    path: req.path,
    method: req.method,
    body: req.body ? JSON.stringify(req.body).substring(0, 1000) : 'No body'
  });
  
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  // In production, still return detailed error for API routes to help debug
  if (req.path.startsWith('/api')) {
    res.status(statusCode).json({
      error: message,
      type: err.name || 'UnknownError',
      code: err.code || 'UNKNOWN',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    res.status(statusCode).json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
}

module.exports = errorHandler;
