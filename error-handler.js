// Comprehensive Error Handling System

class ErrorHandler {
  constructor(config = {}) {
    this.config = {
      // Show detailed errors in development
      debug: config.debug || false,
      // Log errors to external service
      logService: config.logService || null,
      // Error reporting callback
      onError: config.onError || null,
      // User-friendly error messages
      userMessages: config.userMessages || this.getDefaultMessages(),
      ...config
    };

    this.setupGlobalHandlers();
  }

  // Setup global error handlers
  setupGlobalHandlers() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
      event.preventDefault();
    });

    // Catch global errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Global Error');
      event.preventDefault();
    });
  }

  // Main error handler
  handleError(error, context = '') {
    // Log error
    this.logError(error, context);

    // Get user-friendly message
    const userMessage = this.getUserMessage(error);

    // Show error to user
    this.showErrorToUser(userMessage, error);

    // Call custom handler if provided
    if (this.config.onError) {
      this.config.onError(error, context);
    }

    // Send to external logging service
    if (this.config.logService) {
      this.sendToLogService(error, context);
    }
  }

  // Log error to console
  logError(error, context) {
    const timestamp = new Date().toISOString();

    const errorLog = {
      timestamp,
      context,
      message: error.message,
      stack: error.stack,
      type: error.name,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    if (this.config.debug) {
      console.error('Error Details:', errorLog);
    } else {
      console.error(`[${timestamp}] ${context}: ${error.message}`);
    }
  }

  // Get user-friendly error message
  getUserMessage(error) {
    // Check if error has a custom user message
    if (error.userMessage) {
      return error.userMessage;
    }

    // Map error types to user messages
    const errorType = this.categorizeError(error);
    return this.config.userMessages[errorType] || this.config.userMessages.default;
  }

  // Categorize error type
  categorizeError(error) {
    if (error instanceof NetworkError) return 'network';
    if (error instanceof AuthenticationError) return 'auth';
    if (error instanceof ValidationError) return 'validation';
    if (error instanceof RateLimitError) return 'rateLimit';
    if (error instanceof StorageError) return 'storage';
    if (error instanceof APIError) return 'api';
    if (error instanceof PermissionError) return 'permission';

    // Check error message for patterns
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return 'network';
    }
    if (error.message?.includes('auth') || error.message?.includes('unauthorized')) {
      return 'auth';
    }

    return 'default';
  }

  // Default user-friendly messages
  getDefaultMessages() {
    return {
      network: 'Unable to connect to the server. Please check your internet connection and try again.',
      auth: 'Your session has expired. Please log in again.',
      validation: 'Please check your input and try again.',
      rateLimit: 'Too many requests. Please wait a moment and try again.',
      storage: 'Unable to save your data. Please try again.',
      api: 'The service is temporarily unavailable. Please try again later.',
      permission: 'You don\'t have permission to perform this action.',
      default: 'Something went wrong. Please try again.'
    };
  }

  // Show error to user
  showErrorToUser(message, error) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${this.escapeHtml(message)}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      ${this.config.debug ? `<div class="error-details">${this.escapeHtml(error.stack)}</div>` : ''}
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Send error to external logging service
  async sendToLogService(error, context) {
    try {
      await fetch(this.config.logService, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          context,
          error: {
            message: error.message,
            stack: error.stack,
            type: error.name
          },
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (logError) {
      console.error('Failed to send error to logging service:', logError);
    }
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Wrap async function with error handling
  static wrapAsync(fn, context = '') {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        window.errorHandler?.handleError(error, context);
        throw error;
      }
    };
  }

  // Wrap sync function with error handling
  static wrap(fn, context = '') {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        window.errorHandler?.handleError(error, context);
        throw error;
      }
    };
  }
}

// Custom Error Classes

class NetworkError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'NetworkError';
    this.details = details;
    this.userMessage = 'Network connection failed. Please check your internet connection.';
  }
}

class AuthenticationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'AuthenticationError';
    this.details = details;
    this.userMessage = 'Authentication failed. Please log in again.';
  }
}

class ValidationError extends Error {
  constructor(message, field = null, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.details = details;
    this.userMessage = message;
  }
}

class RateLimitError extends Error {
  constructor(message, retryAfter = null) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    this.userMessage = `Too many requests. Please try again ${retryAfter ? `in ${retryAfter} seconds` : 'later'}.`;
  }
}

class StorageError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'StorageError';
    this.details = details;
    this.userMessage = 'Failed to save data. Please try again.';
  }
}

class APIError extends Error {
  constructor(message, statusCode = null, response = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.response = response;

    if (statusCode === 429) {
      this.userMessage = 'Too many requests. Please wait a moment.';
    } else if (statusCode >= 500) {
      this.userMessage = 'Server error. Please try again later.';
    } else if (statusCode === 404) {
      this.userMessage = 'Resource not found.';
    } else {
      this.userMessage = 'API request failed. Please try again.';
    }
  }
}

class PermissionError extends Error {
  constructor(message, required = null) {
    super(message);
    this.name = 'PermissionError';
    this.required = required;
    this.userMessage = 'You don\'t have permission to perform this action.';
  }
}

// Retry Helper
class RetryHelper {
  static async withRetry(fn, options = {}) {
    const {
      maxRetries = 3,
      delay = 1000,
      backoff = 2,
      shouldRetry = () => true
    } = options;

    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Check if we should retry
        if (!shouldRetry(error) || i === maxRetries - 1) {
          throw error;
        }

        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoff, i)));
      }
    }

    throw lastError;
  }
}

// Safe API Caller
class SafeAPICaller {
  constructor(errorHandler) {
    this.errorHandler = errorHandler;
  }

  async call(url, options = {}) {
    try {
      const response = await RetryHelper.withRetry(
        async () => {
          const res = await fetch(url, options);

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new APIError(
              errorData.message || `HTTP ${res.status}: ${res.statusText}`,
              res.status,
              errorData
            );
          }

          return res;
        },
        {
          maxRetries: 3,
          shouldRetry: (error) => {
            // Retry on network errors or 5xx server errors
            return error instanceof NetworkError ||
                   (error instanceof APIError && error.statusCode >= 500);
          }
        }
      );

      return await response.json();

    } catch (error) {
      // Convert fetch errors to NetworkError
      if (error.message?.includes('Failed to fetch')) {
        throw new NetworkError('Network request failed', { originalError: error });
      }

      throw error;
    }
  }

  async get(url, options = {}) {
    return this.call(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.call(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }

  async put(url, data, options = {}) {
    return this.call(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }

  async delete(url, options = {}) {
    return this.call(url, { ...options, method: 'DELETE' });
  }
}

// Validation Helper
class Validator {
  static validate(data, rules) {
    const errors = [];

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field];

      // Required check
      if (fieldRules.required && !value) {
        errors.push(new ValidationError(`${field} is required`, field));
        continue;
      }

      // Skip other validations if value is empty and not required
      if (!value) continue;

      // Type check
      if (fieldRules.type) {
        if (!this.checkType(value, fieldRules.type)) {
          errors.push(new ValidationError(
            `${field} must be of type ${fieldRules.type}`,
            field
          ));
        }
      }

      // Min length
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors.push(new ValidationError(
          `${field} must be at least ${fieldRules.minLength} characters`,
          field
        ));
      }

      // Max length
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors.push(new ValidationError(
          `${field} must be at most ${fieldRules.maxLength} characters`,
          field
        ));
      }

      // Pattern
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors.push(new ValidationError(
          fieldRules.patternMessage || `${field} format is invalid`,
          field
        ));
      }

      // Custom validator
      if (fieldRules.validator) {
        const result = fieldRules.validator(value);
        if (result !== true) {
          errors.push(new ValidationError(result || `${field} is invalid`, field));
        }
      }
    }

    if (errors.length > 0) {
      throw errors[0]; // Throw first error
    }

    return true;
  }

  static checkType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && !Array.isArray(value) && value !== null;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  }
}

// Add error notification styles
const errorStyles = document.createElement('style');
errorStyles.textContent = `
  .error-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 400px;
    background: white;
    border-left: 4px solid #f44336;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 4px;
    padding: 16px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  }

  .error-notification.fade-out {
    animation: fadeOut 0.3s ease;
    opacity: 0;
  }

  .error-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .error-icon {
    font-size: 24px;
  }

  .error-message {
    flex: 1;
    color: #333;
    font-size: 14px;
  }

  .error-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
  }

  .error-close:hover {
    color: #333;
  }

  .error-details {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #eee;
    font-family: monospace;
    font-size: 12px;
    color: #666;
    max-height: 200px;
    overflow-y: auto;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(errorStyles);

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ErrorHandler,
    NetworkError,
    AuthenticationError,
    ValidationError,
    RateLimitError,
    StorageError,
    APIError,
    PermissionError,
    RetryHelper,
    SafeAPICaller,
    Validator
  };
}
