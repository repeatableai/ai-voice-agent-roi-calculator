// Authentication Middleware

const { verifyToken } = require('../utils/jwt');
const { logInfo } = require('../utils/logger');

// Require authentication via session or JWT
function requireAuth(req, res, next) {
  // Check session first
  if (req.session && req.session.userId) {
    return next();
  }

  // Check JWT token in Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);

      // Add user info to request
      req.session = req.session || {};
      req.session.userId = decoded.userId;
      req.session.email = decoded.email;
      req.session.role = decoded.role;

      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // No authentication found
  res.status(401).json({ error: 'Authentication required' });
}

// Require specific role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.session.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Optional authentication (don't fail if not authenticated)
function optionalAuth(req, res, next) {
  // Check session
  if (req.session && req.session.userId) {
    return next();
  }

  // Check JWT
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);
      req.session = req.session || {};
      req.session.userId = decoded.userId;
      req.session.email = decoded.email;
      req.session.role = decoded.role;
    } catch (error) {
      // Silently fail - authentication is optional
    }
  }

  next();
}

module.exports = {
  requireAuth,
  requireRole,
  optionalAuth
};
