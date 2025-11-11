// Request Logger Middleware

const { logInfo } = require('../utils/logger');

function logger(req, res, next) {
  const startTime = Date.now();

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    logInfo('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.session?.userId
    });
  });

  next();
}

module.exports = logger;
