// Authentication Routes

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const { generateToken, verifyToken } = require('../utils/jwt');
const { logInfo, logError } = require('../utils/logger');

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// ===================================
// POST /api/auth/register
// ===================================

router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const name = req.body.name || email.split('@')[0]; // Use email username as name if not provided

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email, passwordHash, name, 'user']
    );

    const user = result.rows[0];

    logInfo('User registered:', { email, userId: user.id });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    logError('Registration error:', error);
    next(error);
  }
});

// ===================================
// POST /api/auth/login
// ===================================

router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Get user from database
    const result = await db.query(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      logInfo('Failed login attempt:', { email });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Create session
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;

    // Generate JWT token (optional, for API access)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    logInfo('User logged in:', { email, userId: user.id });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });

  } catch (error) {
    logError('Login error:', error);
    next(error);
  }
});

// ===================================
// POST /api/auth/logout
// ===================================

router.post('/logout', (req, res) => {
  const userId = req.session?.userId;

  req.session.destroy((err) => {
    if (err) {
      logError('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }

    res.clearCookie('aivoice.sid');

    if (userId) {
      logInfo('User logged out:', { userId });
    }

    res.json({ message: 'Logout successful' });
  });
});

// ===================================
// GET /api/auth/me
// ===================================

router.get('/me', async (req, res, next) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await db.query(
      'SELECT id, email, name, role, created_at, last_login FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      req.session.destroy();
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });

  } catch (error) {
    logError('Get user error:', error);
    next(error);
  }
});

// ===================================
// POST /api/auth/change-password
// ===================================

router.post('/change-password', [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
], async (req, res, next) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, req.session.userId]
    );

    logInfo('Password changed:', { userId: req.session.userId });

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    logError('Change password error:', error);
    next(error);
  }
});

// ===================================
// POST /api/auth/request-reset
// ===================================

router.post('/request-reset', [
  body('email').isEmail().normalizeEmail()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user exists
    const result = await db.query(
      'SELECT id, email, name FROM users WHERE email = $1',
      [email]
    );

    // Always return success (security: don't reveal if email exists)
    if (result.rows.length === 0) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = generateToken({ userId: user.id, type: 'reset' }, '1h');

    // Store reset token in database
    await db.query(
      `INSERT INTO password_resets (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [user.id, resetToken]
    );

    // TODO: Send email with reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await sendEmail(user.email, 'Password Reset', resetLink);

    logInfo('Password reset requested:', { email, userId: user.id });

    res.json({ message: 'If the email exists, a reset link has been sent' });

  } catch (error) {
    logError('Request reset error:', error);
    next(error);
  }
});

// ===================================
// POST /api/auth/reset-password
// ===================================

router.post('/reset-password', [
  body('token').exists(),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (decoded.type !== 'reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    // Check if token exists and is not expired
    const result = await db.query(
      `SELECT id, user_id FROM password_resets
       WHERE token = $1 AND expires_at > NOW() AND used = FALSE`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const resetRecord = result.rows[0];

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, resetRecord.user_id]
    );

    // Mark reset token as used
    await db.query(
      'UPDATE password_resets SET used = TRUE WHERE id = $1',
      [resetRecord.id]
    );

    logInfo('Password reset completed:', { userId: resetRecord.user_id });

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    logError('Reset password error:', error);
    next(error);
  }
});

module.exports = router;
