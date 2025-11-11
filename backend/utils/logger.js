// Logger Utility

const winston = require('winston');

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-voice-agent' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Write errors to error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Helper functions
function logInfo(message, meta = {}) {
  logger.info(message, meta);
}

function logError(message, error = null) {
  if (error instanceof Error) {
    logger.error(message, {
      error: error.message,
      stack: error.stack
    });
  } else if (typeof error === 'object') {
    logger.error(message, error);
  } else {
    logger.error(message);
  }
}

function logWarn(message, meta = {}) {
  logger.warn(message, meta);
}

function logDebug(message, meta = {}) {
  logger.debug(message, meta);
}

module.exports = {
  logger,
  logInfo,
  logError,
  logWarn,
  logDebug
};
