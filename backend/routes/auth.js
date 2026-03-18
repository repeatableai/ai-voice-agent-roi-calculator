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

    const { email, password, invitationToken } = req.body;
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

    // Determine company assignment
    let companyId = null;
    let userRole = 'user';
    let invitedBy = null;

    // Check if invitation token provided
    if (invitationToken) {
      const invitationResult = await db.query(
        `SELECT company_id, role, invited_by, expires_at 
         FROM invitations 
         WHERE token = $1 AND email = $2 AND accepted_at IS NULL AND expires_at > NOW()`,
        [invitationToken, email]
      );

      if (invitationResult.rows.length > 0) {
        const invitation = invitationResult.rows[0];
        companyId = invitation.company_id;
        userRole = invitation.role;
        invitedBy = invitation.invited_by;
      } else {
        return res.status(400).json({ error: 'Invalid or expired invitation token' });
      }
    } else {
      // Check if email domain matches existing company
      const emailDomain = email.split('@')[1];
      if (emailDomain) {
        const companyResult = await db.query(
          'SELECT id FROM companies WHERE domain = $1 AND subscription_status = $2',
          [emailDomain, 'active']
        );

        if (companyResult.rows.length > 0) {
          companyId = companyResult.rows[0].id;
        }
      }
    }

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, role, company_id, invited_by, invited_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, role, company_id, created_at`,
      [
        email, 
        passwordHash, 
        name, 
        userRole, 
        companyId, 
        invitedBy,
        invitedBy ? new Date() : null
      ]
    );

    // Mark invitation as accepted if used
    if (invitationToken) {
      await db.query(
        `UPDATE invitations 
         SET accepted_at = NOW(), accepted_by_user_id = $1 
         WHERE token = $2`,
        [result.rows[0].id, invitationToken]
      );
    }

    const user = result.rows[0];

    logInfo('User registered:', { email, userId: user.id });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.company_id
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

    // Check database connection
    if (!process.env.DATABASE_URL) {
      logError('DATABASE_URL not configured');
      return res.status(503).json({ 
        error: 'Database not configured',
        message: 'Please contact support'
      });
    }

    // Get user from database (include company_id)
    let result;
    try {
      result = await db.query(
        'SELECT id, email, password_hash, name, role, company_id FROM users WHERE email = $1',
        [email]
      );
    } catch (dbError) {
      logError('Database query error during login:', dbError);
      return res.status(503).json({ 
        error: 'Database connection failed',
        message: 'Please try again later'
      });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptError) {
      logError('Password comparison error:', bcryptError);
      return res.status(500).json({ 
        error: 'Authentication error',
        message: 'Please try again'
      });
    }

    if (!isValidPassword) {
      logInfo('Failed login attempt:', { email });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login (non-critical, don't fail if this fails)
    try {
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );
    } catch (updateError) {
      logError('Failed to update last_login:', updateError);
      // Continue anyway - not critical
    }

    // Get user's company_id if exists
    let companyId = null;
    try {
      const userCompanyResult = await db.query(
        'SELECT company_id FROM users WHERE id = $1',
        [user.id]
      );
      companyId = userCompanyResult.rows[0]?.company_id || null;
    } catch (companyError) {
      logError('Failed to get company_id:', companyError);
      // Continue anyway - company_id is optional
    }

    // Create session
    try {
      req.session.userId = user.id;
      req.session.email = user.email;
      req.session.role = user.role;
      req.session.companyId = companyId;
    } catch (sessionError) {
      logError('Session creation error:', sessionError);
      return res.status(500).json({ 
        error: 'Session error',
        message: 'Please try again'
      });
    }

    // Generate JWT token (optional, for API access)
    let token = null;
    try {
      if (process.env.JWT_SECRET) {
        token = generateToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          companyId: companyId
        });
      }
    } catch (tokenError) {
      logError('Token generation error:', tokenError);
      // Continue without token - not critical for login
    }

    logInfo('User logged in:', { email, userId: user.id });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: companyId
      },
      ...(token && { token })
    });

  } catch (error) {
    logError('Login error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    
    // Return more specific error messages
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: 'Database connection failed',
        message: 'Please try again later'
      });
    }
    
    if (error.code === '42P01') { // Table doesn't exist
      return res.status(503).json({ 
        error: 'Database not initialized',
        message: 'Please contact support'
      });
    }
    
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
      // Return 200 with null user instead of 401 to avoid console errors
      // Frontend handles null user as "not authenticated"
      return res.status(200).json({ user: null });
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      // No database - clear session and return null
      req.session.destroy();
      return res.status(200).json({ user: null });
    }

    try {
      const result = await db.query(
        'SELECT id, email, name, role, company_id, created_at, last_login FROM users WHERE id = $1',
        [req.session.userId]
      );

      if (result.rows.length === 0) {
        req.session.destroy();
        return res.status(200).json({ user: null });
      }

      res.json({ user: result.rows[0] });
    } catch (dbError) {
      // Database error - clear session and return null
      logError('Database error in /me:', dbError);
      req.session.destroy();
      return res.status(200).json({ user: null });
    }

  } catch (error) {
    logError('Get user error:', error);
    // Always return 200 with null user to avoid breaking frontend
    return res.status(200).json({ user: null });
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

// ===================================
// POST /api/auth/create-employee
// Admin creates an employee with email/password
// ===================================

router.post('/create-employee', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().isLength({ min: 1 }),
  body('role').optional().isIn(['user', 'admin'])
], async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get current user to check permissions
    const currentUserResult = await db.query(
      'SELECT id, role, company_id FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (currentUserResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const currentUser = currentUserResult.rows[0];

    // Only admin or super_admin can create employees
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only admins can create employees' });
    }

    // Admin must have a company
    if (currentUser.role === 'admin' && !currentUser.company_id) {
      return res.status(400).json({ error: 'Admin must belong to a company to create employees' });
    }

    const { email, password, name, role } = req.body;
    const employeeName = name || email.split('@')[0];
    const employeeRole = role || 'user';

    // Admin can only create 'user' or 'admin' roles in their company
    // Super admin can create any role
    if (currentUser.role === 'admin' && employeeRole === 'super_admin') {
      return res.status(403).json({ error: 'Cannot create super_admin users' });
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Use admin's company for new employee
    const companyId = currentUser.company_id;

    // Create employee
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, role, company_id, invited_by, invited_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, email, name, role, company_id, created_at`,
      [email, passwordHash, employeeName, employeeRole, companyId, req.session.userId]
    );

    const newEmployee = result.rows[0];

    logInfo('Employee created by admin:', {
      createdBy: req.session.userId,
      employeeId: newEmployee.id,
      email: newEmployee.email
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: newEmployee.id,
        email: newEmployee.email,
        name: newEmployee.name,
        role: newEmployee.role,
        companyId: newEmployee.company_id
      }
    });

  } catch (error) {
    logError('Create employee error:', error);
    next(error);
  }
});

module.exports = router;
