// Migration Route for localStorage Analyses
// Allows users to migrate analyses from localStorage to database

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { logInfo, logError } = require('../utils/logger');

// All routes require authentication
router.use(requireAuth);

// ===================================
// POST /api/aiva/migrate-analyses
// Migrate analyses from localStorage to database
// ===================================

router.post('/migrate-analyses', [
  body('analyses').isArray().notEmpty(),
  body('analyses.*.jobTitle').trim().isLength({ min: 1 }),
  body('analyses.*.industry').trim().isLength({ min: 1 }),
  body('analyses.*.companyName').trim().isLength({ min: 1 }),
  body('analyses.*.hourlyRate').isFloat({ min: 0 }),
  body('analyses.*.analysisData').isObject()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { analyses } = req.body;
    const userId = req.session.userId;
    const userCompanyId = req.session.companyId;

    if (!userCompanyId && req.session.role !== 'super_admin') {
      return res.status(400).json({ 
        error: 'User must belong to a company. Please contact your administrator.' 
      });
    }

    const migrated = [];
    const failed = [];

    for (const analysis of analyses) {
      try {
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
          analysisData,
          metrics
        } = analysis;

        // Extract metrics from analysisData if not provided separately
        const finalMetrics = metrics || analysisData.metrics || {};
        const deliverables = analysisData.deliverables || [];

        // Calculate totals
        const totalAnnualHoursFreed = deliverables.reduce((sum, d) => {
          return sum + (parseFloat(d.annualHoursFreed) || 0);
        }, 0);

        const totalPayrollFreed = totalAnnualHoursFreed * parseFloat(hourlyRate);
        const annualValueCreated = finalMetrics.annualValueCreated || finalMetrics.conservativeEstimate || (totalPayrollFreed * 3.3);
        const paybackDays = finalMetrics.paybackDays || null;
        const productivityMultiplier = parseFloat(finalMetrics.productivityMultiplier) || null;

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
          RETURNING id`,
          [
            userId,
            userCompanyId || analysis.companyId || null,
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
            'completed'
          ]
        );

        migrated.push({
          originalTitle: title || `${jobTitle} - ${companyName}`,
          newId: result.rows[0].id
        });

      } catch (error) {
        logError('Error migrating analysis:', error);
        failed.push({
          title: analysis.title || `${analysis.jobTitle} - ${analysis.companyName}`,
          error: error.message
        });
      }
    }

    logInfo('Analyses migration completed:', { 
      userId, 
      migrated: migrated.length, 
      failed: failed.length 
    });

    res.json({
      message: `Migration completed: ${migrated.length} migrated, ${failed.length} failed`,
      migrated,
      failed: failed.length > 0 ? failed : undefined
    });

  } catch (error) {
    logError('Migrate analyses error:', error);
    next(error);
  }
});

module.exports = router;

