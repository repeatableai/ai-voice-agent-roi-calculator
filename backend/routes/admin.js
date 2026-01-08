// Super Admin Routes
// Platform-wide management endpoints (super admin only)

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const db = require('../db/database');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');
const { logInfo, logError } = require('../utils/logger');

// All routes require super admin
router.use(requireAuth);
router.use(requireSuperAdmin);

// ===================================
// GET /api/admin/companies
// List all companies (super admin)
// ===================================

router.get('/companies', [
  query('status').optional().isIn(['active', 'suspended', 'cancelled']),
  query('tier').optional().isIn(['free', 'pro', 'enterprise'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, tier } = req.query;

    let queryText = 'SELECT * FROM companies WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryText += ` AND subscription_status = $${paramCount}`;
      queryParams.push(status);
    }

    if (tier) {
      paramCount++;
      queryText += ` AND subscription_tier = $${paramCount}`;
      queryParams.push(tier);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, queryParams);

    res.json({ companies: result.rows });

  } catch (error) {
    logError('List all companies error:', error);
    next(error);
  }
});

// ===================================
// GET /api/admin/users
// List all users across all companies (super admin)
// ===================================

router.get('/users', [
  query('role').optional().isIn(['user', 'admin', 'super_admin']),
  query('companyId').optional().isInt(),
  query('isActive').optional().isBoolean()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role, companyId, isActive } = req.query;

    let queryText = `
      SELECT 
        u.id, u.email, u.name, u.role, u.company_id, u.department, 
        u.job_title, u.is_active, u.created_at, u.last_login,
        c.name as company_name
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 0;

    if (role) {
      paramCount++;
      queryText += ` AND u.role = $${paramCount}`;
      queryParams.push(role);
    }

    if (companyId) {
      paramCount++;
      queryText += ` AND u.company_id = $${paramCount}`;
      queryParams.push(companyId);
    }

    if (isActive !== undefined) {
      paramCount++;
      queryText += ` AND u.is_active = $${paramCount}`;
      queryParams.push(isActive === 'true');
    }

    queryText += ' ORDER BY u.created_at DESC';

    const result = await db.query(queryText, queryParams);

    res.json({
      users: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    logError('List all users error:', error);
    next(error);
  }
});

// ===================================
// GET /api/admin/stats
// Platform-wide statistics (super admin)
// ===================================

router.get('/stats', async (req, res, next) => {
  try {
    // Get platform-wide statistics
    const companiesResult = await db.query('SELECT COUNT(*) as total FROM companies WHERE subscription_status = $1', ['active']);
    const usersResult = await db.query('SELECT COUNT(*) as total FROM users WHERE is_active = TRUE');
    const analysesResult = await db.query('SELECT COUNT(*) as total FROM roi_analyses WHERE status = $1', ['completed']);

    // Get aggregated metrics
    const metricsResult = await db.query(`
      SELECT 
        SUM(total_annual_hours_freed) as total_hours_freed,
        SUM(total_payroll_freed) as total_payroll_freed,
        SUM(annual_value_created) as total_value_created,
        AVG(productivity_multiplier) as avg_productivity_multiplier
      FROM roi_analyses
      WHERE status = 'completed'
    `);

    // Get companies by tier
    const tierResult = await db.query(`
      SELECT subscription_tier, COUNT(*) as count
      FROM companies
      WHERE subscription_status = 'active'
      GROUP BY subscription_tier
    `);

    res.json({
      stats: {
        totalCompanies: parseInt(companiesResult.rows[0]?.total || 0),
        totalUsers: parseInt(usersResult.rows[0]?.total || 0),
        totalAnalyses: parseInt(analysesResult.rows[0]?.total || 0),
        totalHoursFreed: parseFloat(metricsResult.rows[0]?.total_hours_freed || 0),
        totalPayrollFreed: parseFloat(metricsResult.rows[0]?.total_payroll_freed || 0),
        totalValueCreated: parseFloat(metricsResult.rows[0]?.total_value_created || 0),
        avgProductivityMultiplier: parseFloat(metricsResult.rows[0]?.avg_productivity_multiplier || 0)
      },
      breakdowns: {
        byTier: tierResult.rows
      }
    });

  } catch (error) {
    logError('Get platform stats error:', error);
    next(error);
  }
});

// ===================================
// GET /api/admin/analyses
// All analyses across platform (super admin)
// ===================================

router.get('/analyses', [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit = 50, offset = 0 } = req.query;

    const result = await db.query(
      `SELECT 
        ra.*,
        u.email as user_email,
        u.name as user_name,
        c.name as company_name
      FROM roi_analyses ra
      JOIN users u ON ra.user_id = u.id
      JOIN companies c ON ra.company_id = c.id
      ORDER BY ra.created_at DESC
      LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    const countResult = await db.query('SELECT COUNT(*) as total FROM roi_analyses');
    const total = parseInt(countResult.rows[0].total);

    res.json({
      analyses: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    logError('Get all analyses error:', error);
    next(error);
  }
});

// ===================================
// PUT /api/admin/users/:id/role
// Change user role (super admin)
// ===================================

router.put('/users/:id/role', [
  param('id').isInt(),
  body('role').isIn(['user', 'admin', 'super_admin'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Validate role constraints
    if (role === 'super_admin') {
      // Super admin cannot have company_id
      await db.query(
        'UPDATE users SET role = $1, company_id = NULL WHERE id = $2 RETURNING *',
        [role, id]
      );
    } else if (role === 'admin') {
      // Admin must have company_id
      const userResult = await db.query('SELECT company_id FROM users WHERE id = $1', [id]);
      if (!userResult.rows[0]?.company_id) {
        return res.status(400).json({ 
          error: 'Admin role requires a company_id. Please assign user to a company first.' 
        });
      }
      await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [role, id]);
    } else {
      await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [role, id]);
    }

    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    logInfo('User role updated:', { userId: id, newRole: role, updatedBy: req.session.userId });

    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    logError('Update user role error:', error);
    next(error);
  }
});

module.exports = router;

