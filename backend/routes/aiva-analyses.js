// AIVA ROI Analyses Routes
// CRUD operations for persistent ROI analyses storage

const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const db = require('../db/database');
const { requireAuth, requireAdmin, requireSuperAdmin, getAccessibleCompanyIds } = require('../middleware/auth');
const { logInfo, logError } = require('../utils/logger');

// All routes require authentication
router.use(requireAuth);

// ===================================
// GET /api/aiva/analyses
// List analyses with role-based filtering
// ===================================

router.get('/', [
  query('status').optional({ checkFalsy: true, nullable: true }).isIn(['draft', 'completed', 'archived']),
  query('company_id').optional({ checkFalsy: true, nullable: true }).isInt({ min: 1 }),
  query('user_id').optional({ checkFalsy: true, nullable: true }).isInt({ min: 1 }),
  query('limit').optional({ checkFalsy: true, nullable: true }).isInt({ min: 1, max: 100 }),
  query('offset').optional({ checkFalsy: true, nullable: true }).isInt({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Convert query params to integers if present
    const status = req.query.status;
    const company_id = req.query.company_id ? parseInt(req.query.company_id, 10) : undefined;
    const user_id = req.query.user_id ? parseInt(req.query.user_id, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const userId = req.session.userId;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    let queryText = 'SELECT * FROM roi_analyses WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    // Role-based filtering
    if (role === 'user') {
      // User can only see their own analyses
      paramCount++;
      queryText += ` AND user_id = $${paramCount}`;
      queryParams.push(userId);
    } else if (role === 'admin') {
      // Admin can see all analyses from their company
      if (!userCompanyId) {
        return res.status(403).json({ error: 'Admin must belong to a company' });
      }
      paramCount++;
      queryText += ` AND company_id = $${paramCount}`;
      queryParams.push(userCompanyId);
    }
    // Super admin can see all (no additional filter)

    // Optional filters
    if (status) {
      paramCount++;
      queryText += ` AND status = $${paramCount}`;
      queryParams.push(status);
    }

    if (company_id && (role === 'super_admin' || (role === 'admin' && company_id === userCompanyId))) {
      paramCount++;
      queryText += ` AND company_id = $${paramCount}`;
      queryParams.push(company_id);
    }

    if (user_id && (role === 'super_admin' || (role === 'admin' && userCompanyId))) {
      paramCount++;
      queryText += ` AND user_id = $${paramCount}`;
      queryParams.push(user_id);
    }

    // Ordering and pagination
    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(limit, offset);

    const result = await db.query(queryText, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM roi_analyses WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (role === 'user') {
      countParamCount++;
      countQuery += ` AND user_id = $${countParamCount}`;
      countParams.push(userId);
    } else if (role === 'admin') {
      countParamCount++;
      countQuery += ` AND company_id = $${countParamCount}`;
      countParams.push(userCompanyId);
    }

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
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
    logError('List analyses error:', error);
    next(error);
  }
});

// ===================================
// POST /api/aiva/analyses
// Create new analysis
// ===================================

router.post('/', [
  body('title').optional().trim().isLength({ max: 255 }),
  body('jobTitle').notEmpty().withMessage('Job title is required').trim().isLength({ min: 1, max: 255 }),
  body('industry').notEmpty().withMessage('Industry is required').trim().isLength({ min: 1, max: 100 }),
  body('companyName').notEmpty().withMessage('Company name is required').trim().isLength({ min: 1, max: 255 }),
  body('companyWebsite').optional().trim(),
  body('companySize').optional().trim(),
  body('hourlyRate').notEmpty().withMessage('Hourly rate is required').isFloat({ min: 0 }).withMessage('Hourly rate must be a valid number'),
  body('biggestFrustration').optional().trim(),
  body('analysisData').notEmpty().withMessage('Analysis data is required').isObject().withMessage('Analysis data must be an object')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Create a more user-friendly error message
      const errorMessages = errors.array().map(err => {
        const field = err.param || 'field';
        const msg = err.msg || 'is invalid';
        return `${field}: ${msg}`;
      });
      return res.status(400).json({ 
        error: `Validation failed: ${errorMessages.join(', ')}`,
        errors: errors.array() 
      });
    }

    const {
      title,
      jobTitle,
      industry,
      companyName,
      companyWebsite,
      companySize,
      companyContext,
      hourlyRate,
      biggestFrustration,
      analysisData
    } = req.body;

    const userId = req.session.userId;
    const userCompanyId = req.session.companyId;
    const userRole = req.session.role;

    // For super_admin, ensure they have a company_id (should be Repeatable.AI)
    // If not in session, fetch it from database
    let companyIdToUse = userCompanyId;
    if (userRole === 'super_admin' && !companyIdToUse) {
      // First, try to get company_id from user record
      const userResult = await db.query(
        'SELECT company_id FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows.length > 0 && userResult.rows[0].company_id) {
        companyIdToUse = userResult.rows[0].company_id;
        req.session.companyId = companyIdToUse;
        logInfo('Super admin company_id fetched from user record:', {
          userId,
          companyId: companyIdToUse
        });
      } else {
        // Fallback: fetch Repeatable.AI company
        const companyResult = await db.query(
          'SELECT id FROM companies WHERE name = $1 LIMIT 1',
          ['Repeatable.AI']
        );
        if (companyResult.rows.length > 0) {
          companyIdToUse = companyResult.rows[0].id;
          // Update user record and session
          await db.query(
            'UPDATE users SET company_id = $1 WHERE id = $2',
            [companyIdToUse, userId]
          );
          req.session.companyId = companyIdToUse;
          logInfo('Super admin assigned to Repeatable.AI and session updated:', {
            userId,
            companyId: companyIdToUse
          });
        }
      }
    }

    // Add logging to debug
    logInfo('Saving analysis - company_id check:', {
      userId,
      userRole,
      sessionCompanyId: userCompanyId,
      companyIdToUse,
      hasCompanyId: !!companyIdToUse
    });

    // Validate company_id (non-super_admin users must have a company)
    if (!companyIdToUse && userRole !== 'super_admin') {
      return res.status(400).json({ 
        error: 'User must belong to a company. Please contact your administrator.' 
      });
    }

    // Super admin should always have Repeatable.AI company
    if (userRole === 'super_admin' && !companyIdToUse) {
      logError('Super admin missing company_id:', { userId, userRole });
      return res.status(500).json({ 
        error: 'System configuration error: Repeatable.AI company not found. Please contact support.' 
      });
    }

    // Extract metrics from analysisData for easy querying
    const metrics = analysisData.metrics || {};
    const deliverables = analysisData.deliverables || [];

    // Calculate totals
    const totalAnnualHoursFreed = deliverables.reduce((sum, d) => {
      return sum + (parseFloat(d.annualHoursFreed) || 0);
    }, 0);

    const totalPayrollFreed = totalAnnualHoursFreed * parseFloat(hourlyRate);
    const annualValueCreated = metrics.annualValueCreated || metrics.conservativeEstimate || (totalPayrollFreed * 3.3);
    const paybackDays = metrics.paybackDays || null;
    const productivityMultiplier = parseFloat(metrics.productivityMultiplier) || null;

    // Insert analysis
    const result = await db.query(
      `INSERT INTO roi_analyses (
        user_id, company_id, title, job_title, industry, company_name, 
        company_website, company_size, company_context, hourly_rate, 
        biggest_frustration, analysis_data, total_annual_hours_freed, 
        total_payroll_freed, annual_value_created, payback_days, 
        productivity_multiplier, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        userId,
        companyIdToUse, // Use determined company_id (should never be null at this point)
        title || `${jobTitle} - ${companyName}`,
        jobTitle,
        industry,
        companyName,
        companyWebsite || null,
        companySize || null,
        companyContext ? JSON.stringify(companyContext) : null,
        parseFloat(hourlyRate),
        biggestFrustration || null,
        JSON.stringify(analysisData),
        totalAnnualHoursFreed,
        totalPayrollFreed,
        annualValueCreated,
        paybackDays,
        productivityMultiplier,
        req.body.status || 'completed'
      ]
    );

    const analysis = result.rows[0];

    logInfo('Analysis created:', { 
      analysisId: analysis.id, 
      userId, 
      companyId: userCompanyId 
    });

    res.status(201).json({
      message: 'Analysis saved successfully',
      analysis: {
        id: analysis.id,
        title: analysis.title,
        jobTitle: analysis.job_title,
        companyName: analysis.company_name,
        createdAt: analysis.created_at,
        status: analysis.status
      }
    });

  } catch (error) {
    logError('Create analysis error:', error);
    next(error);
  }
});

// ===================================
// GET /api/aiva/analyses/:id
// Get specific analysis
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
    const userId = req.session.userId;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Get analysis
    const result = await db.query(
      'SELECT * FROM roi_analyses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = result.rows[0];

    // Check access permissions
    if (role === 'user') {
      // User can only access their own analyses
      if (analysis.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'admin') {
      // Admin can access analyses from their company
      if (analysis.company_id !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    // Super admin can access any analysis

    // Update last_viewed_at
    await db.query(
      'UPDATE roi_analyses SET last_viewed_at = NOW() WHERE id = $1',
      [id]
    );

    // Parse JSONB fields
    analysis.analysis_data = typeof analysis.analysis_data === 'string' 
      ? JSON.parse(analysis.analysis_data) 
      : analysis.analysis_data;
    
    analysis.company_context = analysis.company_context && typeof analysis.company_context === 'string'
      ? JSON.parse(analysis.company_context)
      : analysis.company_context;

    res.json({ analysis });

  } catch (error) {
    logError('Get analysis error:', error);
    next(error);
  }
});

// ===================================
// PUT /api/aiva/analyses/:id
// Update analysis
// ===================================

router.put('/:id', [
  param('id').isInt(),
  body('title').optional().trim().isLength({ max: 255 }),
  body('status').optional().isIn(['draft', 'completed', 'archived']),
  body('analysisData').optional().isObject()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.session.userId;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Get existing analysis
    const existingResult = await db.query(
      'SELECT * FROM roi_analyses WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const existing = existingResult.rows[0];

    // Check access and update permissions
    if (role === 'user') {
      // User can only update their own analyses, and only if status is 'draft'
      if (existing.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      if (existing.status !== 'draft' && req.body.status !== 'archived') {
        return res.status(403).json({ 
          error: 'Can only edit draft analyses. Archive this analysis to create a new one.' 
        });
      }
    } else if (role === 'admin') {
      // Admin can update analyses from their company
      if (existing.company_id !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    // Super admin can update any analysis

    // Build update query
    const updates = [];
    const updateParams = [];
    let paramCount = 0;

    if (req.body.title !== undefined) {
      paramCount++;
      updates.push(`title = $${paramCount}`);
      updateParams.push(req.body.title);
    }

    if (req.body.status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      updateParams.push(req.body.status);
    }

    if (req.body.analysisData !== undefined) {
      paramCount++;
      updates.push(`analysis_data = $${paramCount}`);
      updateParams.push(JSON.stringify(req.body.analysisData));

      // Recalculate metrics if analysisData changed
      const deliverables = req.body.analysisData.deliverables || [];
      const metrics = req.body.analysisData.metrics || {};
      const hourlyRate = parseFloat(existing.hourly_rate);

      const totalAnnualHoursFreed = deliverables.reduce((sum, d) => {
        return sum + (parseFloat(d.annualHoursFreed) || 0);
      }, 0);

      const totalPayrollFreed = totalAnnualHoursFreed * hourlyRate;
      const annualValueCreated = metrics.annualValueCreated || metrics.conservativeEstimate || (totalPayrollFreed * 3.3);
      const paybackDays = metrics.paybackDays || null;
      const productivityMultiplier = parseFloat(metrics.productivityMultiplier) || null;

      paramCount++;
      updates.push(`total_annual_hours_freed = $${paramCount}`);
      updateParams.push(totalAnnualHoursFreed);

      paramCount++;
      updates.push(`total_payroll_freed = $${paramCount}`);
      updateParams.push(totalPayrollFreed);

      paramCount++;
      updates.push(`annual_value_created = $${paramCount}`);
      updateParams.push(annualValueCreated);

      if (paybackDays !== null) {
        paramCount++;
        updates.push(`payback_days = $${paramCount}`);
        updateParams.push(paybackDays);
      }

      if (productivityMultiplier !== null) {
        paramCount++;
        updates.push(`productivity_multiplier = $${paramCount}`);
        updateParams.push(productivityMultiplier);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updates.push(`updated_at = NOW()`);
    updateParams.push(id);

    const updateQuery = `UPDATE roi_analyses SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const updateResult = await db.query(updateQuery, updateParams);

    const updated = updateResult.rows[0];
    updated.analysis_data = typeof updated.analysis_data === 'string' 
      ? JSON.parse(updated.analysis_data) 
      : updated.analysis_data;

    logInfo('Analysis updated:', { analysisId: id, userId });

    res.json({
      message: 'Analysis updated successfully',
      analysis: updated
    });

  } catch (error) {
    logError('Update analysis error:', error);
    next(error);
  }
});

// ===================================
// DELETE /api/aiva/analyses/:id
// Delete analysis
// ===================================

router.delete('/:id', [
  param('id').isInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.session.userId;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Get analysis to check permissions
    const result = await db.query(
      'SELECT * FROM roi_analyses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = result.rows[0];

    // Check access permissions
    if (role === 'user') {
      // User can only delete their own analyses
      if (analysis.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'admin') {
      // Admin can delete analyses from their company
      if (analysis.company_id !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    // Super admin can delete any analysis

    // Delete analysis
    await db.query('DELETE FROM roi_analyses WHERE id = $1', [id]);

    logInfo('Analysis deleted:', { analysisId: id, userId });

    res.json({ message: 'Analysis deleted successfully' });

  } catch (error) {
    logError('Delete analysis error:', error);
    next(error);
  }
});

// ===================================
// POST /api/aiva/analyses/:id/share
// Share analysis with specific users
// ===================================

router.post('/:id/share', [
  param('id').isInt(),
  body('userIds').isArray().notEmpty(),
  body('permission').optional().isIn(['view', 'comment'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { userIds, permission = 'view' } = req.body;
    const userId = req.session.userId;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Get analysis to check permissions
    const analysisResult = await db.query(
      'SELECT * FROM roi_analyses WHERE id = $1',
      [id]
    );

    if (analysisResult.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = analysisResult.rows[0];

    // Check access - user can share their own, admin can share company analyses
    if (role === 'user') {
      if (analysis.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'admin') {
      if (analysis.company_id !== userCompanyId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Verify all users exist and are in same company (for non-super-admin)
    if (role !== 'super_admin') {
      const usersResult = await db.query(
        `SELECT id, company_id FROM users 
         WHERE id = ANY($1::int[]) AND is_active = TRUE`,
        [userIds]
      );

      if (usersResult.rows.length !== userIds.length) {
        return res.status(400).json({ error: 'One or more users not found' });
      }

      // Verify users are in same company (for admin)
      if (role === 'admin') {
        const invalidUsers = usersResult.rows.filter(u => u.company_id !== userCompanyId);
        if (invalidUsers.length > 0) {
          return res.status(403).json({ 
            error: 'Cannot share with users outside your company' 
          });
        }
      }
    }

    // Insert shares (using INSERT ... ON CONFLICT to handle duplicates)
    const sharePromises = userIds.map(sharedUserId => 
      db.query(
        `INSERT INTO analysis_shares (analysis_id, shared_with_user_id, shared_by_user_id, permission)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (analysis_id, shared_with_user_id) 
         DO UPDATE SET permission = $4, created_at = NOW()`,
        [id, sharedUserId, userId, permission]
      )
    );

    await Promise.all(sharePromises);

    // Update is_shared flag on analysis
    await db.query(
      'UPDATE roi_analyses SET is_shared = TRUE, shared_at = NOW() WHERE id = $1',
      [id]
    );

    logInfo('Analysis shared:', { analysisId: id, sharedWith: userIds, sharedBy: userId });

    res.json({ 
      message: 'Analysis shared successfully',
      sharedWith: userIds.length
    });

  } catch (error) {
    logError('Share analysis error:', error);
    next(error);
  }
});

// ===================================
// GET /api/aiva/analyses/:id/metrics
// Get aggregated metrics (for admins/super admins)
// ===================================

router.get('/:id/metrics', [
  param('id').isInt()
], requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.session.role;
    const userCompanyId = req.session.companyId;

    // Get analysis
    const analysisResult = await db.query(
      'SELECT * FROM roi_analyses WHERE id = $1',
      [id]
    );

    if (analysisResult.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const analysis = analysisResult.rows[0];

    // Check access
    if (role === 'admin' && analysis.company_id !== userCompanyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Return metrics
    res.json({
      metrics: {
        totalAnnualHoursFreed: parseFloat(analysis.total_annual_hours_freed || 0),
        totalPayrollFreed: parseFloat(analysis.total_payroll_freed || 0),
        annualValueCreated: parseFloat(analysis.annual_value_created || 0),
        paybackDays: analysis.payback_days,
        productivityMultiplier: parseFloat(analysis.productivity_multiplier || 0)
      }
    });

  } catch (error) {
    logError('Get analysis metrics error:', error);
    next(error);
  }
});

module.exports = router;

