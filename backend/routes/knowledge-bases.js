// Knowledge Base Routes

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { processDocument } = require('../utils/document-processor');
const { generateEmbedding } = require('../utils/embeddings');
const { logInfo, logError } = require('../utils/logger');

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'pdf,docx,txt,md,csv,json').split(',');
    const ext = path.extname(file.originalname).substring(1).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${ext} not allowed`));
    }
  }
});

// All routes require authentication
router.use(requireAuth);

// ===================================
// GET /api/knowledge-bases
// ===================================

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT kb.*,
              (SELECT COUNT(*) FROM knowledge_chunks WHERE kb_id = kb.id) as total_chunks,
              (SELECT COUNT(*) FROM agents WHERE knowledge_base_id = kb.id) as agents_using
       FROM knowledge_bases kb
       WHERE kb.user_id = $1
       ORDER BY kb.created_at DESC`,
      [req.session.userId]
    );

    res.json({ knowledgeBases: result.rows });

  } catch (error) {
    logError('Get knowledge bases error:', error);
    next(error);
  }
});

// ===================================
// GET /api/knowledge-bases/:id
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
      `SELECT * FROM knowledge_bases WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Knowledge base not found' });
    }

    // Get chunks
    const chunksResult = await db.query(
      `SELECT id, text, metadata, created_at
       FROM knowledge_chunks
       WHERE kb_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.params.id]
    );

    const kb = result.rows[0];
    kb.chunks = chunksResult.rows;

    res.json({ knowledgeBase: kb });

  } catch (error) {
    logError('Get knowledge base error:', error);
    next(error);
  }
});

// ===================================
// POST /api/knowledge-bases
// ===================================

router.post('/', upload.array('files', 10), [
  body('name').trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const files = req.files || [];

    // Generate unique ID
    const kbId = `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create knowledge base
    const result = await db.query(
      `INSERT INTO knowledge_bases
       (id, user_id, name, description, processing_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [kbId, req.session.userId, name, description, 'processing']
    );

    const kb = result.rows[0];

    // Process files in background
    setImmediate(async () => {
      try {
        let totalChunks = 0;

        for (const file of files) {
          logInfo('Processing file:', { filename: file.originalname, kbId });

          // Process document into chunks
          const chunks = await processDocument(file.path, file.originalname);

          // Generate embeddings and insert chunks
          for (const chunk of chunks) {
            const embedding = await generateEmbedding(chunk.text);

            await db.query(
              `INSERT INTO knowledge_chunks (kb_id, text, embedding, metadata)
               VALUES ($1, $2, $3, $4)`,
              [
                kbId,
                chunk.text,
                JSON.stringify(embedding),
                JSON.stringify({
                  source: file.originalname,
                  type: chunk.type,
                  page: chunk.page
                })
              ]
            );

            totalChunks++;
          }
        }

        // Update knowledge base status
        await db.query(
          `UPDATE knowledge_bases
           SET processing_status = 'completed', total_chunks = $1, updated_at = NOW()
           WHERE id = $2`,
          [totalChunks, kbId]
        );

        logInfo('Knowledge base processing completed:', { kbId, totalChunks });

      } catch (error) {
        logError('Knowledge base processing error:', error);

        await db.query(
          `UPDATE knowledge_bases SET processing_status = 'failed' WHERE id = $1`,
          [kbId]
        );
      }
    });

    res.status(201).json({
      message: 'Knowledge base created, files processing in background',
      knowledgeBase: kb
    });

  } catch (error) {
    logError('Create knowledge base error:', error);
    next(error);
  }
});

// ===================================
// DELETE /api/knowledge-bases/:id
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

    // Check if KB exists and belongs to user
    const checkResult = await db.query(
      'SELECT id FROM knowledge_bases WHERE id = $1 AND user_id = $2',
      [id, req.session.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Knowledge base not found' });
    }

    // Check if any agents are using this KB
    const agentsResult = await db.query(
      'SELECT COUNT(*) as count FROM agents WHERE knowledge_base_id = $1',
      [id]
    );

    if (parseInt(agentsResult.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete knowledge base that is in use by agents'
      });
    }

    // Delete chunks
    await db.query('DELETE FROM knowledge_chunks WHERE kb_id = $1', [id]);

    // Delete KB
    await db.query(
      'DELETE FROM knowledge_bases WHERE id = $1 AND user_id = $2',
      [id, req.session.userId]
    );

    logInfo('Knowledge base deleted:', { kbId: id, userId: req.session.userId });

    res.json({ message: 'Knowledge base deleted successfully' });

  } catch (error) {
    logError('Delete knowledge base error:', error);
    next(error);
  }
});

// ===================================
// POST /api/knowledge-bases/:id/search
// Search knowledge base
// ===================================

router.post('/:id/search', [
  param('id').isString(),
  body('query').trim().isLength({ min: 1 }),
  body('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { query, limit = 5 } = req.body;

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Semantic search using pgvector
    const result = await db.query(
      `SELECT text, metadata,
              1 - (embedding <=> $1::vector) as similarity
       FROM knowledge_chunks
       WHERE kb_id = $2
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      [JSON.stringify(queryEmbedding), id, limit]
    );

    res.json({ results: result.rows });

  } catch (error) {
    logError('Search knowledge base error:', error);
    next(error);
  }
});

module.exports = router;
