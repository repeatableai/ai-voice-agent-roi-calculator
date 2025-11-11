// Authentication and Authorization System for AI Voice Agent Admin Dashboard

class AuthSystem {
  constructor(config = {}) {
    this.config = {
      sessionTimeout: config.sessionTimeout || 3600000, // 1 hour
      maxLoginAttempts: config.maxLoginAttempts || 5,
      lockoutDuration: config.lockoutDuration || 900000, // 15 minutes
      requireMFA: config.requireMFA || false,
      ...config
    };

    this.currentUser = null;
    this.loginAttempts = new Map();
    this.sessions = new Map();
    this.initialize();
  }

  initialize() {
    // Check for existing session
    this.checkSession();

    // Setup session timeout
    this.setupSessionTimeout();

    // Setup CSRF protection
    this.setupCSRF();
  }

  // Check for existing valid session
  checkSession() {
    const sessionToken = this.getSessionToken();
    if (!sessionToken) return false;

    const session = this.sessions.get(sessionToken);
    if (!session) {
      this.clearSession();
      return false;
    }

    // Check if session expired
    if (Date.now() > session.expiresAt) {
      this.clearSession();
      return false;
    }

    // Restore user
    this.currentUser = session.user;
    this.extendSession(sessionToken);
    return true;
  }

  // Login with email and password
  async login(email, password) {
    // Check if account is locked
    if (this.isAccountLocked(email)) {
      throw new Error('Account temporarily locked due to too many failed attempts. Please try again later.');
    }

    try {
      // Validate credentials
      const user = await this.validateCredentials(email, password);

      if (!user) {
        this.recordFailedAttempt(email);
        throw new Error('Invalid email or password');
      }

      // Clear failed attempts
      this.loginAttempts.delete(email);

      // Check if MFA is required
      if (this.config.requireMFA || user.mfaEnabled) {
        return {
          requiresMFA: true,
          tempToken: this.generateTempToken(user)
        };
      }

      // Create session
      const session = this.createSession(user);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token: session.token
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Verify MFA code
  async verifyMFA(tempToken, code) {
    const user = this.getUserFromTempToken(tempToken);
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    const isValid = await this.validateMFACode(user, code);
    if (!isValid) {
      throw new Error('Invalid MFA code');
    }

    // Create session
    const session = this.createSession(user);

    return {
      success: true,
      user: this.sanitizeUser(user),
      token: session.token
    };
  }

  // Logout
  logout() {
    const token = this.getSessionToken();
    if (token) {
      this.sessions.delete(token);
    }

    this.clearSession();
    this.currentUser = null;

    // Redirect to login
    window.location.href = '/login';
  }

  // Create new session
  createSession(user) {
    const token = this.generateSessionToken();
    const expiresAt = Date.now() + this.config.sessionTimeout;

    const session = {
      token,
      user,
      createdAt: Date.now(),
      expiresAt,
      lastActivity: Date.now()
    };

    this.sessions.set(token, session);
    this.setSessionToken(token);
    this.currentUser = user;

    return session;
  }

  // Extend session
  extendSession(token) {
    const session = this.sessions.get(token);
    if (session) {
      session.lastActivity = Date.now();
      session.expiresAt = Date.now() + this.config.sessionTimeout;
    }
  }

  // Check if user has permission
  hasPermission(permission) {
    if (!this.currentUser) return false;

    // Admin has all permissions
    if (this.currentUser.role === 'admin') return true;

    // Check specific permission
    return this.currentUser.permissions?.includes(permission) || false;
  }

  // Check if user has role
  hasRole(role) {
    if (!this.currentUser) return false;
    return this.currentUser.role === role;
  }

  // Require authentication
  requireAuth() {
    if (!this.currentUser) {
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  // Require permission
  requirePermission(permission) {
    this.requireAuth();

    if (!this.hasPermission(permission)) {
      throw new Error('Permission denied');
    }
  }

  // Record failed login attempt
  recordFailedAttempt(email) {
    const attempts = this.loginAttempts.get(email) || {
      count: 0,
      firstAttempt: Date.now(),
      lockedUntil: null
    };

    attempts.count++;

    if (attempts.count >= this.config.maxLoginAttempts) {
      attempts.lockedUntil = Date.now() + this.config.lockoutDuration;
    }

    this.loginAttempts.set(email, attempts);
  }

  // Check if account is locked
  isAccountLocked(email) {
    const attempts = this.loginAttempts.get(email);
    if (!attempts || !attempts.lockedUntil) return false;

    if (Date.now() > attempts.lockedUntil) {
      // Lock expired, clear attempts
      this.loginAttempts.delete(email);
      return false;
    }

    return true;
  }

  // Validate credentials (would connect to backend)
  async validateCredentials(email, password) {
    // In production, this would make an API call to backend
    // For demo purposes, using localStorage

    const hashedPassword = await this.hashPassword(password);
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(u =>
      u.email === email && u.password === hashedPassword
    );

    return user || null;
  }

  // Validate MFA code
  async validateMFACode(user, code) {
    // In production, this would validate TOTP or SMS code
    // For demo, any 6-digit code works
    return /^\d{6}$/.test(code);
  }

  // Generate session token
  generateSessionToken() {
    return 'session_' + this.generateRandomString(32);
  }

  // Generate temp token for MFA
  generateTempToken(user) {
    const token = 'temp_' + this.generateRandomString(32);
    const expiry = Date.now() + 300000; // 5 minutes

    sessionStorage.setItem('temp_token', JSON.stringify({
      token,
      userId: user.id,
      expiresAt: expiry
    }));

    return token;
  }

  // Get user from temp token
  getUserFromTempToken(token) {
    const stored = sessionStorage.getItem('temp_token');
    if (!stored) return null;

    const data = JSON.parse(stored);

    if (data.token !== token || Date.now() > data.expiresAt) {
      sessionStorage.removeItem('temp_token');
      return null;
    }

    // Get user from storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === data.userId);
  }

  // Hash password
  async hashPassword(password) {
    // In production, use proper bcrypt or similar
    // This is a simple demo hash
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Session token management
  getSessionToken() {
    return localStorage.getItem('session_token');
  }

  setSessionToken(token) {
    localStorage.setItem('session_token', token);
  }

  clearSession() {
    localStorage.removeItem('session_token');
    sessionStorage.removeItem('temp_token');
  }

  // Setup session timeout
  setupSessionTimeout() {
    setInterval(() => {
      if (this.currentUser) {
        const token = this.getSessionToken();
        const session = this.sessions.get(token);

        if (!session || Date.now() > session.expiresAt) {
          this.logout();
        }
      }
    }, 60000); // Check every minute
  }

  // CSRF Protection
  setupCSRF() {
    this.csrfToken = this.generateRandomString(32);
    document.querySelectorAll('form').forEach(form => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'csrf_token';
      input.value = this.csrfToken;
      form.appendChild(input);
    });
  }

  validateCSRF(token) {
    return token === this.csrfToken;
  }

  // Sanitize user data for client
  sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // Generate random string
  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // User registration
  async register(userData) {
    const { email, password, name } = userData;

    // Validate input
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email address');
    }

    if (!this.validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const hashedPassword = await this.hashPassword(password);
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password: hashedPassword,
      name,
      role: 'user',
      permissions: ['agent:read'],
      createdAt: new Date().toISOString(),
      mfaEnabled: false
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return this.sanitizeUser(newUser);
  }

  // Validation helpers
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validatePassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  }
}

// API Key Management
class APIKeyManager {
  constructor(authSystem) {
    this.authSystem = authSystem;
  }

  // Generate API key for programmatic access
  generateAPIKey(userId, name, permissions = []) {
    this.authSystem.requireAuth();

    const apiKey = {
      id: 'key_' + Date.now(),
      userId,
      name,
      key: 'sk_' + this.generateSecureKey(48),
      permissions,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      expiresAt: null // null means no expiration
    };

    // Store API key
    const keys = JSON.parse(localStorage.getItem('api_keys') || '[]');
    keys.push(apiKey);
    localStorage.setItem('api_keys', JSON.stringify(keys));

    return apiKey;
  }

  // Validate API key
  async validateAPIKey(key) {
    const keys = JSON.parse(localStorage.getItem('api_keys') || '[]');
    const apiKey = keys.find(k => k.key === key);

    if (!apiKey) return null;

    // Check expiration
    if (apiKey.expiresAt && Date.now() > new Date(apiKey.expiresAt).getTime()) {
      return null;
    }

    // Update last used
    apiKey.lastUsed = new Date().toISOString();
    localStorage.setItem('api_keys', JSON.stringify(keys));

    return apiKey;
  }

  // Revoke API key
  revokeAPIKey(keyId) {
    this.authSystem.requireAuth();

    const keys = JSON.parse(localStorage.getItem('api_keys') || '[]');
    const filtered = keys.filter(k => k.id !== keyId);
    localStorage.setItem('api_keys', JSON.stringify(filtered));
  }

  generateSecureKey(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthSystem, APIKeyManager };
}
