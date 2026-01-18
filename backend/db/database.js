// Database Connection and Query Utility

const { Pool } = require('pg');
const { logInfo, logError } = require('../utils/logger');

// Create connection pool only if DATABASE_URL is provided
let pool = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false // For platforms like Heroku
      } : false
    });
    logInfo('Database pool created');
  } catch (error) {
    logError('Failed to create database pool:', error);
    pool = null;
  }
} else {
  logInfo('DATABASE_URL not set - running without database (calculator will work, login/save disabled)');
}

// Initialize database (create tables if needed)
async function initialize() {
  if (!pool) {
    logInfo('Database not configured - skipping initialization');
    return;
  }

  try {
    // Test connection
    const client = await pool.connect();
    logInfo('Database connection successful');

    // Check if tables exist
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'users'
    `);

    if (result.rows.length === 0) {
      logInfo('Tables not found, please run migrations');
      // You can run migrations here or manually
    } else {
      logInfo('Database tables found');
    }

    client.release();

  } catch (error) {
    logError('Database initialization error:', error);
    // Don't throw - allow app to continue without database
    logInfo('App will continue without database (calculator will work, login/save disabled)');
  }
}

// Execute query
async function query(text, params) {
  if (!pool) {
    throw new Error('Database not configured. DATABASE_URL environment variable is required.');
  }

  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (duration > 1000) {
      logInfo('Slow query detected', {
        query: text.substring(0, 100),
        duration: `${duration}ms`
      });
    }

    return result;

  } catch (error) {
    logError('Database query error:', {
      query: text.substring(0, 100),
      error: error.message
    });
    throw error;
  }
}

// Get a client from the pool for transactions
async function getClient() {
  if (!pool) {
    throw new Error('Database not configured');
  }
  return await pool.connect();
}

// Close pool
async function end() {
  if (pool) {
    await pool.end();
    logInfo('Database connection pool closed');
  }
}

// Handle pool errors
if (pool) {
  pool.on('error', (err, client) => {
    logError('Unexpected database pool error:', err);
  });
}

module.exports = {
  initialize,
  query,
  getClient,
  end
};
