// Agent Management Routes

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { logInfo, logError } = require('../utils/logger');

// All routes require authentication
router.use(requireAuth);

// ===================================
// GET /api/agents
// Get all agents for current user
// ===================================

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, name, description, voice_settings, context_settings,
              features, status, created_at, updated_at,
              (SELECT COUNT(*) FROM conversations WHERE agent_id = agents.id) as total_interactions
       FROM agents
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.session.userId]
    );

    res.json({ agents: result.rows });

  } catch (error) {
    logError('Get agents error:', error);
    next(error);
  }
});

// ===================================
// GET /api/agents/:id
// Get specific agent
// ===================================

router.get('/:id', [
  param('id').isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await db.query(
      `SELECT a.*, kb.name as knowledge_base_name,
              (SELECT json_agg(target_url) FROM agent_urls WHERE agent_id = a.id) as target_urls
       FROM agents a
       LEFT JOIN knowledge_bases kb ON a.knowledge_base_id = kb.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [req.params.id, req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json({ agent: result.rows[0] });

  } catch (error) {
    logError('Get agent error:', error);
    next(error);
  }
});

// ===================================
// POST /api/agents
// Create new agent
// ===================================

router.post('/', [
  body('name').trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('knowledgeBaseId').optional().isString(),
  body('targetUrls').optional().isArray(),
  body('voiceSettings').optional().isObject(),
  body('contextSettings').optional().isObject(),
  body('features').optional().isObject()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      knowledgeBaseId,
      targetUrls = [],
      voiceSettings = {},
      contextSettings = {},
      features = {}
    } = req.body;

    // Generate unique agent ID
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Default settings
    const defaultVoiceSettings = {
      voiceId: voiceSettings.voiceId || 'EXAVITQu4vr4xnSDxMaL',
      stability: voiceSettings.stability || 0.5,
      similarityBoost: voiceSettings.similarityBoost || 0.75,
      style: voiceSettings.style || 0,
      speakingRate: voiceSettings.speakingRate || 1.0
    };

    const defaultContextSettings = {
      systemPrompt: contextSettings.systemPrompt ||
        'You are a helpful AI assistant. Provide accurate, conversational responses.',
      temperature: contextSettings.temperature || 0.7,
      maxTokens: contextSettings.maxTokens || 1000,
      personality: contextSettings.personality || 'professional',
      language: contextSettings.language || 'en',
      specialInstructions: contextSettings.specialInstructions || ''
    };

    const defaultFeatures = {
      quiz: features.quiz || false,
      roleplay: features.roleplay || false,
      summaries: features.summaries !== false,
      translations: features.translations || false,
      codeExplanation: features.codeExplanation || false
    };

    // Insert agent
    const result = await db.query(
      `INSERT INTO agents
       (id, user_id, name, description, knowledge_base_id, voice_settings,
        context_settings, features, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        agentId,
        req.session.userId,
        name,
        description,
        knowledgeBaseId || null,
        JSON.stringify(defaultVoiceSettings),
        JSON.stringify(defaultContextSettings),
        JSON.stringify(defaultFeatures),
        'active'
      ]
    );

    const agent = result.rows[0];

    // Insert target URLs
    if (targetUrls.length > 0) {
      const urlValues = targetUrls.map((url, i) =>
        `($1, $${i + 2})`
      ).join(',');

      await db.query(
        `INSERT INTO agent_urls (agent_id, target_url) VALUES ${urlValues}`,
        [agentId, ...targetUrls]
      );
    }

    logInfo('Agent created:', { agentId, userId: req.session.userId });

    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        ...agent,
        targetUrls
      }
    });

  } catch (error) {
    logError('Create agent error:', error);
    next(error);
  }
});

// ===================================
// PUT /api/agents/:id
// Update agent
// ===================================

router.put('/:id', [
  param('id').isString(),
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('voiceSettings').optional().isObject(),
  body('contextSettings').optional().isObject(),
  body('features').optional().isObject(),
  body('status').optional().isIn(['active', 'inactive', 'archived'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if agent exists and belongs to user
    const checkResult = await db.query(
      'SELECT id FROM agents WHERE id = $1 AND user_id = $2',
      [id, req.session.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Build update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }

    if (updates.description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }

    if (updates.voiceSettings) {
      updateFields.push(`voice_settings = $${paramCount++}`);
      values.push(JSON.stringify(updates.voiceSettings));
    }

    if (updates.contextSettings) {
      updateFields.push(`context_settings = $${paramCount++}`);
      values.push(JSON.stringify(updates.contextSettings));
    }

    if (updates.features) {
      updateFields.push(`features = $${paramCount++}`);
      values.push(JSON.stringify(updates.features));
    }

    if (updates.status) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(id, req.session.userId);

    const result = await db.query(
      `UPDATE agents SET ${updateFields.join(', ')}
       WHERE id = $${paramCount++} AND user_id = $${paramCount++}
       RETURNING *`,
      values
    );

    logInfo('Agent updated:', { agentId: id, userId: req.session.userId });

    res.json({
      message: 'Agent updated successfully',
      agent: result.rows[0]
    });

  } catch (error) {
    logError('Update agent error:', error);
    next(error);
  }
});

// ===================================
// DELETE /api/agents/:id
// Delete agent
// ===================================

router.delete('/:id', [
  param('id').isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Check if agent exists and belongs to user
    const checkResult = await db.query(
      'SELECT id FROM agents WHERE id = $1 AND user_id = $2',
      [id, req.session.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Delete related records (cascading should handle this, but explicit for safety)
    await db.query('DELETE FROM agent_urls WHERE agent_id = $1', [id]);
    await db.query('DELETE FROM conversations WHERE agent_id = $1', [id]);
    await db.query('DELETE FROM analytics WHERE agent_id = $1', [id]);

    // Delete agent
    await db.query(
      'DELETE FROM agents WHERE id = $1 AND user_id = $2',
      [id, req.session.userId]
    );

    logInfo('Agent deleted:', { agentId: id, userId: req.session.userId });

    res.json({ message: 'Agent deleted successfully' });

  } catch (error) {
    logError('Delete agent error:', error);
    next(error);
  }
});

// ===================================
// GET /api/agents/for-url
// Get agent for specific URL (public endpoint for widget)
// ===================================

router.get('/for-url', async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    const result = await db.query(
      `SELECT a.* FROM agents a
       JOIN agent_urls au ON a.id = au.agent_id
       WHERE au.target_url = $1 AND a.status = 'active'
       LIMIT 1`,
      [url]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No agent found for this URL' });
    }

    // Return only safe fields (no sensitive data)
    const agent = result.rows[0];
    res.json({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      voiceSettings: agent.voice_settings,
      contextSettings: {
        personality: agent.context_settings.personality,
        language: agent.context_settings.language
      },
      features: agent.features
    });

  } catch (error) {
    logError('Get agent for URL error:', error);
    next(error);
  }
});

module.exports = router;
