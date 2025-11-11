// Rate Limiting and Security Features

class RateLimiter {
  constructor(config = {}) {
    this.config = {
      // Requests per window
      maxRequests: config.maxRequests || 100,
      // Window duration in ms
      windowMs: config.windowMs || 60000, // 1 minute
      // Key generator function
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      // Storage
      store: config.store || new Map(),
      // On limit reached callback
      onLimitReached: config.onLimitReached || null,
      ...config
    };

    this.requests = new Map();
    this.cleanup();
  }

  // Check if request should be allowed
  async check(req) {
    const key = this.config.keyGenerator(req);
    const now = Date.now();

    // Get existing requests for this key
    let record = this.requests.get(key);

    if (!record) {
      record = {
        count: 0,
        resetTime: now + this.config.windowMs,
        requests: []
      };
      this.requests.set(key, record);
    }

    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + this.config.windowMs;
      record.requests = [];
    }

    // Remove old requests
    record.requests = record.requests.filter(time => time > now - this.config.windowMs);
    record.count = record.requests.length;

    // Check limit
    if (record.count >= this.config.maxRequests) {
      if (this.config.onLimitReached) {
        this.config.onLimitReached(key, record);
      }

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      };
    }

    // Add new request
    record.requests.push(now);
    record.count++;

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime,
      retryAfter: 0
    };
  }

  // Default key generator (IP + User Agent)
  defaultKeyGenerator(req) {
    const ip = req.ip || req.headers?.['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers?.['user-agent'] || '';
    return `${ip}:${userAgent}`;
  }

  // Cleanup old records
  cleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.requests.entries()) {
        if (now > record.resetTime + this.config.windowMs) {
          this.requests.delete(key);
        }
      }
    }, this.config.windowMs);
  }

  // Reset limits for a key
  reset(key) {
    this.requests.delete(key);
  }

  // Get current status for a key
  getStatus(key) {
    const record = this.requests.get(key);
    if (!record) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: Date.now() + this.config.windowMs
      };
    }

    return {
      count: record.count,
      remaining: this.config.maxRequests - record.count,
      resetTime: record.resetTime
    };
  }
}

// IP Whitelist/Blacklist
class IPFilter {
  constructor(config = {}) {
    this.whitelist = new Set(config.whitelist || []);
    this.blacklist = new Set(config.blacklist || []);
    this.mode = config.mode || 'blacklist'; // 'whitelist' or 'blacklist'
  }

  // Check if IP is allowed
  isAllowed(ip) {
    // Whitelist mode: only whitelisted IPs allowed
    if (this.mode === 'whitelist') {
      return this.whitelist.has(ip);
    }

    // Blacklist mode: all except blacklisted IPs allowed
    return !this.blacklist.has(ip);
  }

  // Add IP to whitelist
  addToWhitelist(ip) {
    this.whitelist.add(ip);
  }

  // Add IP to blacklist
  addToBlacklist(ip) {
    this.blacklist.add(ip);
  }

  // Remove from whitelist
  removeFromWhitelist(ip) {
    this.whitelist.delete(ip);
  }

  // Remove from blacklist
  removeFromBlacklist(ip) {
    this.blacklist.delete(ip);
  }
}

// Input Sanitization
class InputSanitizer {
  // Sanitize HTML to prevent XSS
  static sanitizeHTML(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Sanitize SQL to prevent injection
  static sanitizeSQL(input) {
    if (typeof input !== 'string') return input;

    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  // Sanitize URL
  static sanitizeURL(url) {
    try {
      const parsed = new URL(url);

      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }

      return parsed.href;
    } catch (error) {
      throw new Error('Invalid URL');
    }
  }

  // Validate and sanitize JSON
  static sanitizeJSON(input) {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed);
    } catch (error) {
      throw new Error('Invalid JSON');
    }
  }

  // Remove potentially dangerous characters
  static removeSpecialChars(input, allowed = '') {
    const pattern = new RegExp(`[^a-zA-Z0-9${allowed}]`, 'g');
    return input.replace(pattern, '');
  }

  // Validate email
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      throw new Error('Invalid email address');
    }
    return email.toLowerCase().trim();
  }

  // Sanitize file name
  static sanitizeFileName(filename) {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/\.{2,}/g, '.')
      .substring(0, 255);
  }

  // Validate file type
  static validateFileType(filename, allowedTypes) {
    const ext = filename.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(ext)) {
      throw new Error(`File type .${ext} not allowed`);
    }
    return true;
  }

  // Validate file size
  static validateFileSize(size, maxSize) {
    if (size > maxSize) {
      throw new Error(`File size exceeds maximum of ${maxSize} bytes`);
    }
    return true;
  }
}

// Content Security Policy Manager
class CSPManager {
  constructor() {
    this.policies = {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };
  }

  // Add source to directive
  addSource(directive, source) {
    if (!this.policies[directive]) {
      this.policies[directive] = [];
    }
    if (!this.policies[directive].includes(source)) {
      this.policies[directive].push(source);
    }
  }

  // Generate CSP header
  generateHeader() {
    return Object.entries(this.policies)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  // Apply CSP via meta tag
  applyToPage() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = this.generateHeader();
    document.head.appendChild(meta);
  }
}

// Request Validator
class RequestValidator {
  constructor(authSystem) {
    this.authSystem = authSystem;
  }

  // Validate API request
  async validateRequest(req) {
    const errors = [];

    // Check authentication
    if (!this.authSystem.currentUser && req.requiresAuth !== false) {
      errors.push('Authentication required');
    }

    // Check CSRF token for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const csrfToken = req.headers?.['x-csrf-token'] || req.body?.csrf_token;
      if (!this.authSystem.validateCSRF(csrfToken)) {
        errors.push('Invalid CSRF token');
      }
    }

    // Check required headers
    if (req.requiredHeaders) {
      for (const header of req.requiredHeaders) {
        if (!req.headers?.[header]) {
          errors.push(`Missing required header: ${header}`);
        }
      }
    }

    // Validate content type
    if (req.body && req.method !== 'GET') {
      const contentType = req.headers?.['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        errors.push('Content-Type must be application/json');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate API key
  async validateAPIKey(apiKey) {
    const keyManager = new APIKeyManager(this.authSystem);
    const key = await keyManager.validateAPIKey(apiKey);

    if (!key) {
      throw new Error('Invalid API key');
    }

    return key;
  }
}

// Security Headers Manager
class SecurityHeaders {
  static getHeaders() {
    return {
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',

      // Prevent MIME sniffing
      'X-Content-Type-Options': 'nosniff',

      // XSS Protection
      'X-XSS-Protection': '1; mode=block',

      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',

      // Permissions Policy
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

      // Strict Transport Security
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

      // Remove server info
      'X-Powered-By': ''
    };
  }

  static apply() {
    // In browser context, we can only suggest these headers
    // They should be set by the server
    console.info('Security headers should be configured on the server:', this.getHeaders());
  }
}

// Encryption Helper
class EncryptionHelper {
  // Encrypt data with AES
  static async encrypt(data, key) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      await this.deriveKey(key),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }

  // Decrypt data
  static async decrypt(encryptedData, iv, key) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      await this.deriveKey(key),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      cryptoKey,
      new Uint8Array(encryptedData)
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
  }

  // Derive key from password
  static async deriveKey(password) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const baseKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode('ai-voice-agent-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      256
    );

    return derivedBits;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RateLimiter,
    IPFilter,
    InputSanitizer,
    CSPManager,
    RequestValidator,
    SecurityHeaders,
    EncryptionHelper
  };
}
