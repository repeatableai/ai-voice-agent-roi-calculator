// AI Chat Routes - Proxy to Anthropic and ElevenLabs

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Anthropic = require('@anthropic-ai/sdk');
const fetch = require('node-fetch');
const db = require('../db/database');
const { generateEmbedding } = require('../utils/embeddings');
const { logInfo, logError } = require('../utils/logger');

// Anthropic model configuration - use correct model name
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20240620';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ===================================
// POST /api/ai/chat
// Chat with AI agent
// ===================================

router.post('/chat', [
  body('agentId').isString(),
  body('message').trim().isLength({ min: 1, max: 10000 }),
  body('conversationId').optional().isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { agentId, message, conversationId } = req.body;

    // Get agent configuration
    const agentResult = await db.query(
      'SELECT * FROM agents WHERE id = $1 AND status = $2',
      [agentId, 'active']
    );

    if (agentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found or inactive' });
    }

    const agent = agentResult.rows[0];

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const convResult = await db.query(
        'SELECT * FROM conversations WHERE id = $1 AND agent_id = $2',
        [conversationId, agentId]
      );

      if (convResult.rows.length > 0) {
        conversation = convResult.rows[0];
      }
    }

    if (!conversation) {
      // Create new conversation
      const newConvResult = await db.query(
        `INSERT INTO conversations (agent_id, user_identifier, messages)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [agentId, req.session?.userId || req.ip, JSON.stringify([])]
      );
      conversation = newConvResult.rows[0];
    }

    // Get conversation history
    const messages = conversation.messages || [];

    // Get relevant context from knowledge base
    let context = '';
    if (agent.knowledge_base_id) {
      const queryEmbedding = await generateEmbedding(message);

      const contextResult = await db.query(
        `SELECT text
         FROM knowledge_chunks
         WHERE kb_id = $1
         ORDER BY embedding <=> $2::vector
         LIMIT 5`,
        [agent.knowledge_base_id, JSON.stringify(queryEmbedding)]
      );

      context = contextResult.rows.map(r => r.text).join('\n\n');
    }

    // Build system prompt
    const systemPrompt = `${agent.context_settings.systemPrompt}

${context ? `Relevant context from knowledge base:\n${context}` : ''}

Personality: ${agent.context_settings.personality}
Language: ${agent.context_settings.language}
${agent.context_settings.specialInstructions ? `\nSpecial instructions: ${agent.context_settings.specialInstructions}` : ''}`;

    // Build conversation for Claude
    const claudeMessages = [
      ...messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Claude API
    const startTime = Date.now();

    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: agent.context_settings.maxTokens || 1000,
      temperature: agent.context_settings.temperature || 0.7,
      system: systemPrompt,
      messages: claudeMessages
    });

    const responseTime = Date.now() - startTime;
    const aiResponse = response.content[0].text;

    // Update conversation
    messages.push(
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
    );

    await db.query(
      'UPDATE conversations SET messages = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(messages), conversation.id]
    );

    // Log analytics
    await db.query(
      `INSERT INTO analytics (agent_id, event_type, event_data)
       VALUES ($1, $2, $3)`,
      [
        agentId,
        'chat_interaction',
        JSON.stringify({
          messageLength: message.length,
          responseLength: aiResponse.length,
          responseTime,
          hasContext: context.length > 0
        })
      ]
    );

    // Generate speech with ElevenLabs (optional)
    let audioUrl = null;
    if (req.body.synthesizeSpeech) {
      try {
        const audio = await synthesizeSpeech(aiResponse, agent.voice_settings);
        // In production, upload to S3/CDN and return URL
        audioUrl = `/audio/${Date.now()}.mp3`;
      } catch (error) {
        logError('Speech synthesis error:', error);
        // Continue without audio
      }
    }

    logInfo('AI chat completed:', {
      agentId,
      responseTime,
      messageLength: message.length
    });

    res.json({
      conversationId: conversation.id,
      response: aiResponse,
      audioUrl,
      responseTime
    });

  } catch (error) {
    logError('AI chat error:', error);

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: error.headers?.['retry-after']
      });
    }

    next(error);
  }
});

// ===================================
// POST /api/ai/synthesize-speech
// Convert text to speech using ElevenLabs
// ===================================

router.post('/synthesize-speech', [
  body('text').trim().isLength({ min: 1, max: 5000 }),
  body('voiceSettings').optional().isObject()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, voiceSettings = {} } = req.body;

    const audioBuffer = await synthesizeSpeech(text, voiceSettings);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });

    res.send(audioBuffer);

  } catch (error) {
    logError('Synthesize speech error:', error);
    next(error);
  }
});

// ===================================
// Helper Functions
// ===================================

async function synthesizeSpeech(text, voiceSettings = {}) {
  const voiceId = voiceSettings.voiceId || 'EXAVITQu4vr4xnSDxMaL';

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: voiceSettings.stability || 0.5,
          similarity_boost: voiceSettings.similarityBoost || 0.75,
          style: voiceSettings.style || 0,
          use_speaker_boost: true
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return await response.buffer();
}

module.exports = router;
