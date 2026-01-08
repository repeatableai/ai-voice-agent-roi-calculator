// Invitation Routes
// Handle user invitations to companies

const express = require('express');
const router = express.Router();
const { param, query, validationResult } = require('express-validator');
const db = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { logInfo, logError } = require('../utils/logger');

// All routes require authentication
router.use(requireAuth);

// ===================================
// GET /api/invitations/:token
// Validate invitation token
// ===================================

router.get('/:token', [
  param('token').trim().isLength({ min: 1 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;

    // Get invitation
    const result = await db.query(
      `SELECT 
        i.*,
        c.name as company_name,
        c.domain as company_domain,
        u.name as invited_by_name
      FROM invitations i
      JOIN companies c ON i.company_id = c.id
      JOIN users u ON i.invited_by = u.id
      WHERE i.token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const invitation = result.rows[0];

    // Check if already accepted
    if (invitation.accepted_at) {
      return res.status(400).json({ 
        error: 'Invitation already accepted',
        acceptedAt: invitation.accepted_at
      });
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(400).json({ 
        error: 'Invitation has expired',
        expiresAt: invitation.expires_at
      });
    }

    // Return invitation details (without sensitive info)
    res.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        companyName: invitation.company_name,
        companyDomain: invitation.company_domain,
        invitedByName: invitation.invited_by_name,
        expiresAt: invitation.expires_at,
        createdAt: invitation.created_at
      }
    });

  } catch (error) {
    logError('Validate invitation error:', error);
    next(error);
  }
});

// ===================================
// POST /api/invitations/:token/accept
// Accept invitation and create user account
// Note: This is typically handled during registration with invitationToken
// This endpoint is for explicit acceptance if needed
// ===================================

router.post('/:token/accept', [
  param('token').trim().isLength({ min: 1 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;

    // Get invitation
    const result = await db.query(
      `SELECT * FROM invitations WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const invitation = result.rows[0];

    // Check if already accepted
    if (invitation.accepted_at) {
      return res.status(400).json({ 
        error: 'Invitation already accepted',
        acceptedAt: invitation.accepted_at
      });
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(400).json({ 
        error: 'Invitation has expired',
        expiresAt: invitation.expires_at
      });
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [invitation.email]
    );

    if (existingUser.rows.length > 0) {
      // Mark invitation as accepted even if user exists
      await db.query(
        `UPDATE invitations 
         SET accepted_at = NOW(), accepted_by_user_id = $1 
         WHERE token = $2`,
        [existingUser.rows[0].id, token]
      );

      return res.status(409).json({ 
        error: 'User already exists with this email',
        userId: existingUser.rows[0].id
      });
    }

    // Note: User creation should happen during registration
    // This endpoint just marks the invitation as accepted
    // In a real flow, the user would register with the token
    
    res.json({
      message: 'Invitation validated. Please complete registration with this token.',
      invitation: {
        email: invitation.email,
        role: invitation.role,
        companyId: invitation.company_id
      }
    });

  } catch (error) {
    logError('Accept invitation error:', error);
    next(error);
  }
});

module.exports = router;

