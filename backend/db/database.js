// Database Connection and Query Utility

const { Pool } = require('pg');
const { logInfo, logError } = require('../utils/logger');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // For platforms like Heroku
  } : false
});

// Initialize database (create tables if needed)
async function initialize() {
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
    throw error;
  }
}

// Execute query
async function query(text, params) {
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
  return await pool.connect();
}

// Close pool
async function end() {
  await pool.end();
  logInfo('Database connection pool closed');
}

// Handle pool errors
pool.on('error', (err, client) => {
  logError('Unexpected database pool error:', err);
});

module.exports = {
  initialize,
  query,
  getClient,
  end
};
