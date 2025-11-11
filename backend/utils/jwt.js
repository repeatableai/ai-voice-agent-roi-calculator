// JWT Token Utility

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Decode JWT token without verification (for debugging)
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
