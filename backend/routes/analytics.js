// Analytics Routes

const express = require('express');
const router = express.Router();
const { param, query, validationResult } = require('express-validator');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { logError } = require('../utils/logger');

// All routes require authentication
router.use(requireAuth);

// ===================================
// GET /api/analytics/overview
// Get overall analytics for user's agents
// ===================================

router.get('/overview', async (req, res, next) => {
  try {
    // Total agents
    const agentsResult = await db.query(
      'SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = $1) as active FROM agents WHERE user_id = $2',
      ['active', req.session.userId]
    );

    // Total conversations
    const conversationsResult = await db.query(
      `SELECT COUNT(*) as total
       FROM conversations c
       JOIN agents a ON c.agent_id = a.id
       WHERE a.user_id = $1`,
      [req.session.userId]
    );

    // Total interactions (messages)
    const interactionsResult = await db.query(
      `SELECT COUNT(*) as total
       FROM analytics a
       JOIN agents ag ON a.agent_id = ag.id
       WHERE ag.user_id = $1 AND a.event_type = $2`,
      [req.session.userId, 'chat_interaction']
    );

    // Average response time
    const responseTimeResult = await db.query(
      `SELECT AVG((event_data->>'responseTime')::int) as avg_response_time
       FROM analytics a
       JOIN agents ag ON a.agent_id = ag.id
       WHERE ag.user_id = $1 AND a.event_type = $2`,
      [req.session.userId, 'chat_interaction']
    );

    res.json({
      totalAgents: parseInt(agentsResult.rows[0].total),
      activeAgents: parseInt(agentsResult.rows[0].active),
      totalConversations: parseInt(conversationsResult.rows[0].total),
      totalInteractions: parseInt(interactionsResult.rows[0].total),
      avgResponseTime: Math.round(responseTimeResult.rows[0].avg_response_time || 0)
    });

  } catch (error) {
    logError('Get overview analytics error:', error);
    next(error);
  }
});

// ===================================
// GET /api/analytics/agents/:id
// Get analytics for specific agent
// ===================================

router.get('/agents/:id', [
  param('id').isString(),
  query('days').optional().isInt({ min: 1, max: 365 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const days = parseInt(req.query.days) || 30;

    // Verify agent belongs to user
    const agentCheck = await db.query(
      'SELECT id FROM agents WHERE id = $1 AND user_id = $2',
      [id, req.session.userId]
    );

    if (agentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Total interactions
    const interactionsResult = await db.query(
      `SELECT COUNT(*) as total
       FROM analytics
       WHERE agent_id = $1 AND event_type = $2 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [id, 'chat_interaction']
    );

    // Interactions over time (daily)
    const timeseriesResult = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM analytics
       WHERE agent_id = $1 AND event_type = $2 AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [id, 'chat_interaction']
    );

    // Average response time
    const responseTimeResult = await db.query(
      `SELECT AVG((event_data->>'responseTime')::int) as avg_response_time,
              MIN((event_data->>'responseTime')::int) as min_response_time,
              MAX((event_data->>'responseTime')::int) as max_response_time
       FROM analytics
       WHERE agent_id = $1 AND event_type = $2 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [id, 'chat_interaction']
    );

    // Message length statistics
    const messageLengthResult = await db.query(
      `SELECT AVG((event_data->>'messageLength')::int) as avg_message_length,
              AVG((event_data->>'responseLength')::int) as avg_response_length
       FROM analytics
       WHERE agent_id = $1 AND event_type = $2 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [id, 'chat_interaction']
    );

    // Context usage
    const contextResult = await db.query(
      `SELECT COUNT(*) FILTER (WHERE (event_data->>'hasContext')::boolean = true) as with_context,
              COUNT(*) FILTER (WHERE (event_data->>'hasContext')::boolean = false) as without_context
       FROM analytics
       WHERE agent_id = $1 AND event_type = $2 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [id, 'chat_interaction']
    );

    res.json({
      totalInteractions: parseInt(interactionsResult.rows[0].total),
      timeseries: timeseriesResult.rows,
      responseTime: {
        avg: Math.round(responseTimeResult.rows[0].avg_response_time || 0),
        min: responseTimeResult.rows[0].min_response_time || 0,
        max: responseTimeResult.rows[0].max_response_time || 0
      },
      messageStats: {
        avgMessageLength: Math.round(messageLengthResult.rows[0].avg_message_length || 0),
        avgResponseLength: Math.round(messageLengthResult.rows[0].avg_response_length || 0)
      },
      contextUsage: {
        withContext: parseInt(contextResult.rows[0].with_context || 0),
        withoutContext: parseInt(contextResult.rows[0].without_context || 0)
      }
    });

  } catch (error) {
    logError('Get agent analytics error:', error);
    next(error);
  }
});

// ===================================
// GET /api/analytics/conversations/:id
// Get conversation history
// ===================================

router.get('/conversations/:id', [
  param('id').isInt()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Get conversation and verify access
    const result = await db.query(
      `SELECT c.* FROM conversations c
       JOIN agents a ON c.agent_id = a.id
       WHERE c.id = $1 AND a.user_id = $2`,
      [id, req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation: result.rows[0] });

  } catch (error) {
    logError('Get conversation error:', error);
    next(error);
  }
});

// ===================================
// GET /api/analytics/recent-conversations
// Get recent conversations across all agents
// ===================================

router.get('/recent-conversations', [
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = parseInt(req.query.limit) || 20;

    const result = await db.query(
      `SELECT c.id, c.agent_id, c.created_at, c.updated_at,
              a.name as agent_name,
              jsonb_array_length(c.messages) / 2 as message_count
       FROM conversations c
       JOIN agents a ON c.agent_id = a.id
       WHERE a.user_id = $1
       ORDER BY c.updated_at DESC
       LIMIT $2`,
      [req.session.userId, limit]
    );

    res.json({ conversations: result.rows });

  } catch (error) {
    logError('Get recent conversations error:', error);
    next(error);
  }
});

module.exports = router;
