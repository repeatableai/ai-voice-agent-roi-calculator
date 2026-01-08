// Company Management Routes
// CRUD operations for companies and employee management

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const db = require('../db/database');
const { requireAuth, requireAdmin, requireSuperAdmin } = require('../middleware/auth');
const { logInfo, logError } = require('../utils/logger');

// All routes require authentication
router.use(requireAuth);

// ===================================
// GET /api/companies
// List companies (role-based filtering)
// ===================================

router.get('/', async (req, res, next) => {
  try {
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    let queryText = 'SELECT * FROM companies WHERE subscription_status = $1';
    const queryParams = ['active'];

    // Role-based filtering
    if (role === 'user' || role === 'admin') {
      // Users and admins can only see their own company
      if (!userCompanyId) {
        return res.json({ companies: [] });
      }
      queryText += ' AND id = $2';
      queryParams.push(userCompanyId);
    }
    // Super admin sees all companies

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, queryParams);

    res.json({ companies: result.rows });

  } catch (error) {
    logError('List companies error:', error);
    next(error);
  }
});

// ===================================
// POST /api/companies
// Create company (Super Admin only)
// ===================================

router.post('/', requireSuperAdmin, [
  body('name').trim().isLength({ min: 1, max: 255 }),
  body('domain').optional().trim(),
  body('industry').optional().trim(),
  body('size').optional().trim(),
  body('website').optional().trim().isURL(),
  body('subscriptionTier').optional().isIn(['free', 'pro', 'enterprise']),
  body('maxUsers').optional().isInt({ min: 1 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      domain,
      industry,
      size,
      website,
      subscriptionTier = 'free',
      maxUsers = 10
    } = req.body;

    const createdBy = req.session.userId;

    // Check if domain already exists
    if (domain) {
      const existingDomain = await db.query(
        'SELECT id FROM companies WHERE domain = $1',
        [domain]
      );

      if (existingDomain.rows.length > 0) {
        return res.status(409).json({ error: 'Company with this domain already exists' });
      }
    }

    // Create company
    const result = await db.query(
      `INSERT INTO companies (
        name, domain, industry, size, website, subscription_tier, 
        max_users, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        name,
        domain || null,
        industry || null,
        size || null,
        website || null,
        subscriptionTier,
        maxUsers,
        createdBy
      ]
    );

    const company = result.rows[0];

    logInfo('Company created:', { companyId: company.id, name, createdBy });

    res.status(201).json({
      message: 'Company created successfully',
      company
    });

  } catch (error) {
    logError('Create company error:', error);
    next(error);
  }
});

// ===================================
// GET /api/companies/:id
// Get company details
// ===================================

router.get('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Get company
    const result = await db.query(
      'SELECT * FROM companies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = result.rows[0];

    // Check access permissions
    if (role === 'user' || role === 'admin') {
      if (company.id !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    // Super admin can access any company

    res.json({ company });

  } catch (error) {
    logError('Get company error:', error);
    next(error);
  }
});

// ===================================
// PUT /api/companies/:id
// Update company (Admin of company or Super Admin)
// ===================================

router.put('/:id', [
  param('id').isInt(),
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('domain').optional().trim(),
  body('industry').optional().trim(),
  body('size').optional().trim(),
  body('website').optional().trim().isURL(),
  body('subscriptionTier').optional().isIn(['free', 'pro', 'enterprise']),
  body('subscriptionStatus').optional().isIn(['active', 'suspended', 'cancelled']),
  body('maxUsers').optional().isInt({ min: 1 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Get existing company
    const existingResult = await db.query(
      'SELECT * FROM companies WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const existing = existingResult.rows[0];

    // Check access permissions
    if (role === 'admin') {
      if (existing.id !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'user') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    // Super admin can update any company

    // Build update query
    const updates = [];
    const updateParams = [];
    let paramCount = 0;

    const allowedFields = {
      name: 'name',
      domain: 'domain',
      industry: 'industry',
      size: 'size',
      website: 'website',
      subscriptionTier: 'subscription_tier',
      subscriptionStatus: 'subscription_status',
      maxUsers: 'max_users'
    };

    Object.keys(allowedFields).forEach(key => {
      if (req.body[key] !== undefined) {
        paramCount++;
        updates.push(`${allowedFields[key]} = $${paramCount}`);
        updateParams.push(req.body[key]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updates.push('updated_at = NOW()');
    updateParams.push(id);

    const updateQuery = `UPDATE companies SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const updateResult = await db.query(updateQuery, updateParams);

    logInfo('Company updated:', { companyId: id, userId: req.session.userId });

    res.json({
      message: 'Company updated successfully',
      company: updateResult.rows[0]
    });

  } catch (error) {
    logError('Update company error:', error);
    next(error);
  }
});

// ===================================
// GET /api/companies/:id/employees
// List employees (Admin: their company, Super Admin: any company)
// ===================================

router.get('/:id/employees', [
  param('id').isInt(),
  query('isActive').optional().isBoolean()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { isActive } = req.query;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Check access permissions
    if (role === 'admin') {
      if (parseInt(id) !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'user') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    // Super admin can access any company

    // Verify company exists
    const companyResult = await db.query(
      'SELECT id FROM companies WHERE id = $1',
      [id]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Get employees
    let queryText = `
      SELECT id, email, name, role, department, job_title, 
             is_active, created_at, last_login
      FROM users 
      WHERE company_id = $1
    `;
    const queryParams = [id];

    if (isActive !== undefined) {
      queryText += ` AND is_active = $2`;
      queryParams.push(isActive === 'true');
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, queryParams);

    res.json({
      companyId: parseInt(id),
      employees: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    logError('List employees error:', error);
    next(error);
  }
});

// ===================================
// POST /api/companies/:id/invite
// Invite employee (Admin: their company, Super Admin: any company)
// ===================================

router.post('/:id/invite', [
  param('id').isInt(),
  body('email').isEmail().normalizeEmail(),
  body('role').optional().isIn(['user', 'admin'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { email, role = 'user' } = req.body;
    const userId = req.session.userId;
    const userRole = req.session.role;
    const userCompanyId = req.session.companyId;

    // Check access permissions
    if (userRole === 'admin') {
      if (parseInt(id) !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (userRole === 'user') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    // Super admin can invite to any company

    // Verify company exists
    const companyResult = await db.query(
      'SELECT id, max_users FROM companies WHERE id = $1',
      [id]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = companyResult.rows[0];

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id, company_id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      const existing = existingUser.rows[0];
      if (existing.company_id === parseInt(id)) {
        return res.status(409).json({ error: 'User is already a member of this company' });
      } else {
        return res.status(409).json({ error: 'User already exists with a different company' });
      }
    }

    // Check company user limit
    const userCountResult = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE company_id = $1',
      [id]
    );
    const currentUserCount = parseInt(userCountResult.rows[0].count);

    if (currentUserCount >= company.max_users) {
      return res.status(403).json({ 
        error: `Company has reached its user limit (${company.max_users}). Please upgrade your subscription.` 
      });
    }

    // Check for existing pending invitation
    const existingInvitation = await db.query(
      `SELECT id FROM invitations 
       WHERE email = $1 AND company_id = $2 AND accepted_at IS NULL AND expires_at > NOW()`,
      [email, id]
    );

    if (existingInvitation.rows.length > 0) {
      return res.status(409).json({ error: 'Pending invitation already exists for this email' });
    }

    // Generate invitation token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    // Create invitation
    const invitationResult = await db.query(
      `INSERT INTO invitations (
        company_id, email, token, role, invited_by, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [id, email, token, role, userId, expiresAt]
    );

    const invitation = invitationResult.rows[0];

    logInfo('Employee invited:', { 
      companyId: id, 
      email, 
      role, 
      invitedBy: userId,
      invitationId: invitation.id
    });

    // In production, send email here
    // For now, return token (in production, token should be sent via email)
    res.status(201).json({
      message: 'Invitation created successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expires_at
      },
      invitationToken: token, // Only return in development - remove in production
      invitationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?token=${token}`
    });

  } catch (error) {
    logError('Invite employee error:', error);
    next(error);
  }
});

// ===================================
// GET /api/companies/:id/analytics
// Company-wide analytics (Admin: their company, Super Admin: any company)
// ===================================

router.get('/:id/analytics', [
  param('id').isInt()
], requireAdmin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Check access permissions
    if (role === 'admin') {
      if (parseInt(id) !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    // Super admin can access any company

    // Verify company exists
    const companyResult = await db.query(
      'SELECT id FROM companies WHERE id = $1',
      [id]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Get aggregated metrics from all analyses
    const metricsResult = await db.query(
      `SELECT 
        COUNT(*) as total_analyses,
        COUNT(DISTINCT user_id) as total_users,
        SUM(total_annual_hours_freed) as total_hours_freed,
        SUM(total_payroll_freed) as total_payroll_freed,
        SUM(annual_value_created) as total_value_created,
        AVG(productivity_multiplier) as avg_productivity_multiplier
      FROM roi_analyses
      WHERE company_id = $1 AND status = 'completed'`,
      [id]
    );

    // Get analyses by job title
    const jobTitleResult = await db.query(
      `SELECT 
        job_title,
        COUNT(*) as count,
        SUM(total_annual_hours_freed) as total_hours,
        SUM(annual_value_created) as total_value
      FROM roi_analyses
      WHERE company_id = $1 AND status = 'completed'
      GROUP BY job_title
      ORDER BY count DESC
      LIMIT 10`,
      [id]
    );

    // Get analyses by industry
    const industryResult = await db.query(
      `SELECT 
        industry,
        COUNT(*) as count
      FROM roi_analyses
      WHERE company_id = $1 AND status = 'completed'
      GROUP BY industry
      ORDER BY count DESC`,
      [id]
    );

    // Get recent analyses
    const recentResult = await db.query(
      `SELECT id, title, job_title, user_id, created_at, annual_value_created
      FROM roi_analyses
      WHERE company_id = $1 AND status = 'completed'
      ORDER BY created_at DESC
      LIMIT 10`,
      [id]
    );

    res.json({
      companyId: parseInt(id),
      metrics: {
        totalAnalyses: parseInt(metricsResult.rows[0]?.total_analyses || 0),
        totalUsers: parseInt(metricsResult.rows[0]?.total_users || 0),
        totalHoursFreed: parseFloat(metricsResult.rows[0]?.total_hours_freed || 0),
        totalPayrollFreed: parseFloat(metricsResult.rows[0]?.total_payroll_freed || 0),
        totalValueCreated: parseFloat(metricsResult.rows[0]?.total_value_created || 0),
        avgProductivityMultiplier: parseFloat(metricsResult.rows[0]?.avg_productivity_multiplier || 0)
      },
      breakdowns: {
        byJobTitle: jobTitleResult.rows,
        byIndustry: industryResult.rows
      },
      recentAnalyses: recentResult.rows
    });

  } catch (error) {
    logError('Get company analytics error:', error);
    next(error);
  }
});

module.exports = router;

