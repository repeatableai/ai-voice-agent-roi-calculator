// Authentication Middleware

const { verifyToken } = require('../utils/jwt');
const { logInfo, logError } = require('../utils/logger');
const db = require('../db/database');

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
      req.session.companyId = decoded.companyId || null;

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
      req.session.companyId = decoded.companyId || null;
    } catch (error) {
      // Silently fail - authentication is optional
    }
  }

  next();
}

// Require admin or super admin role
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.session.role === 'admin' || req.session.role === 'super_admin') {
    return next();
  }

  return res.status(403).json({ error: 'Admin access required' });
}

// Require super admin role only
function requireSuperAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.session.role === 'super_admin') {
    return next();
  }

  return res.status(403).json({ error: 'Super admin access required' });
}

// Check if user belongs to same company as resource
// Used for validating company-based access
function requireSameCompany(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Super admin can access anything
  if (req.session.role === 'super_admin') {
    return next();
  }

  // Admin can access their company's resources
  if (req.session.role === 'admin') {
    // Company ID will be checked in route handlers
    return next();
  }

  // User can only access their own resources
  if (req.session.role === 'user') {
    // User ID will be checked in route handlers
    return next();
  }

  return res.status(403).json({ error: 'Insufficient permissions' });
}

// Helper: Get user's accessible company IDs
// Returns array of company IDs the user can access
async function getAccessibleCompanyIds(userId, role, companyId) {
  try {
    if (role === 'super_admin') {
      // Super admin can access all companies
      const result = await db.query('SELECT id FROM companies WHERE subscription_status = $1', ['active']);
      return result.rows.map(r => r.id);
    }
    
    if (role === 'admin') {
      // Admin can only access their own company
      return companyId ? [companyId] : [];
    }
    
    // User can only access their own company (for viewing company-wide shared data)
    return companyId ? [companyId] : [];
  } catch (error) {
    logError('Error getting accessible company IDs:', error);
    return [];
  }
}

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  requireSuperAdmin,
  requireSameCompany,
  optionalAuth,
  getAccessibleCompanyIds
};
