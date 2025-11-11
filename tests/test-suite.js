// Comprehensive Test Suite for AI Voice Agent System

// Test Framework (Simple, no dependencies)
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0
    };
  }

  describe(description, fn) {
    console.log(`\n📦 ${description}`);
    fn();
  }

  it(description, fn) {
    this.tests.push({ description, fn });
  }

  async run() {
    console.log('\n🧪 Running Test Suite...\n');
    const startTime = Date.now();

    for (const test of this.tests) {
      this.results.total++;

      try {
        await test.fn();
        console.log(`✅ ${test.description}`);
        this.results.passed++;
      } catch (error) {
        console.error(`❌ ${test.description}`);
        console.error(`   ${error.message}`);
        this.results.failed++;
      }
    }

    const duration = Date.now() - startTime;

    console.log('\n' + '='.repeat(50));
    console.log(`\n📊 Test Results:`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`   Total: ${this.results.total}`);
    console.log(`   Duration: ${duration}ms\n`);

    return this.results;
  }
}

// Assertion Library
class Expect {
  constructor(actual) {
    this.actual = actual;
  }

  toBe(expected) {
    if (this.actual !== expected) {
      throw new Error(`Expected ${expected} but got ${this.actual}`);
    }
  }

  toEqual(expected) {
    if (JSON.stringify(this.actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`);
    }
  }

  toBeTruthy() {
    if (!this.actual) {
      throw new Error(`Expected truthy value but got ${this.actual}`);
    }
  }

  toBeFalsy() {
    if (this.actual) {
      throw new Error(`Expected falsy value but got ${this.actual}`);
    }
  }

  toContain(item) {
    if (!this.actual.includes(item)) {
      throw new Error(`Expected ${this.actual} to contain ${item}`);
    }
  }

  toThrow() {
    let threw = false;
    try {
      this.actual();
    } catch (error) {
      threw = true;
    }
    if (!threw) {
      throw new Error('Expected function to throw but it didn\'t');
    }
  }

  toBeInstanceOf(expectedClass) {
    if (!(this.actual instanceof expectedClass)) {
      throw new Error(`Expected instance of ${expectedClass.name}`);
    }
  }

  toBeGreaterThan(expected) {
    if (this.actual <= expected) {
      throw new Error(`Expected ${this.actual} to be greater than ${expected}`);
    }
  }

  toBeLessThan(expected) {
    if (this.actual >= expected) {
      throw new Error(`Expected ${this.actual} to be less than ${expected}`);
    }
  }
}

function expect(actual) {
  return new Expect(actual);
}

// Mock Helpers
class Mock {
  constructor() {
    this.calls = [];
    this.returnValue = undefined;
  }

  mockReturnValue(value) {
    this.returnValue = value;
    return this;
  }

  mockImplementation(fn) {
    this.implementation = fn;
    return this;
  }

  fn() {
    return (...args) => {
      this.calls.push(args);
      if (this.implementation) {
        return this.implementation(...args);
      }
      return this.returnValue;
    };
  }

  toHaveBeenCalled() {
    if (this.calls.length === 0) {
      throw new Error('Expected function to have been called');
    }
  }

  toHaveBeenCalledWith(...args) {
    const found = this.calls.some(call =>
      JSON.stringify(call) === JSON.stringify(args)
    );
    if (!found) {
      throw new Error(`Expected function to have been called with ${JSON.stringify(args)}`);
    }
  }
}

function mock() {
  return new Mock();
}

// ===========================================
// TEST SUITES
// ===========================================

const test = new TestRunner();

// Storage Adapter Tests
test.describe('StorageAdapter', () => {
  test.it('should initialize with localStorage', () => {
    const storage = new StorageAdapter({ storageProvider: 'localStorage' });
    expect(storage.provider).toBe('localStorage');
  });

  test.it('should set and get data', async () => {
    const storage = new StorageAdapter({ storageProvider: 'localStorage' });
    await storage.set('test_key', { value: 'test' });
    const result = await storage.get('test_key');
    expect(result.value).toBe('test');
  });

  test.it('should delete data', async () => {
    const storage = new StorageAdapter({ storageProvider: 'localStorage' });
    await storage.set('test_delete', { value: 'test' });
    await storage.delete('test_delete');
    const result = await storage.get('test_delete');
    expect(result).toBe(null);
  });

  test.it('should list keys with prefix', async () => {
    const storage = new StorageAdapter({ storageProvider: 'localStorage' });
    await storage.set('agent_1', { id: 1 });
    await storage.set('agent_2', { id: 2 });
    await storage.set('other_1', { id: 3 });

    const keys = await storage.list('agent_');
    expect(keys.length).toBeGreaterThan(0);
  });
});

// Authentication Tests
test.describe('AuthSystem', () => {
  test.it('should validate email format', () => {
    const auth = new AuthSystem();
    expect(auth.validateEmail('test@example.com')).toBeTruthy();
    expect(auth.validateEmail('invalid-email')).toBeFalsy();
  });

  test.it('should validate password strength', () => {
    const auth = new AuthSystem();
    expect(auth.validatePassword('Test123!')).toBeTruthy();
    expect(auth.validatePassword('weak')).toBeFalsy();
  });

  test.it('should hash passwords', async () => {
    const auth = new AuthSystem();
    const hash1 = await auth.hashPassword('password123');
    const hash2 = await auth.hashPassword('password123');
    expect(hash1).toBe(hash2);
  });

  test.it('should detect account lockout', () => {
    const auth = new AuthSystem({ maxLoginAttempts: 3 });

    for (let i = 0; i < 3; i++) {
      auth.recordFailedAttempt('test@example.com');
    }

    expect(auth.isAccountLocked('test@example.com')).toBeTruthy();
  });

  test.it('should generate session tokens', () => {
    const auth = new AuthSystem();
    const token1 = auth.generateSessionToken();
    const token2 = auth.generateSessionToken();

    expect(token1).not.toBe(token2);
    expect(token1.startsWith('session_')).toBeTruthy();
  });
});

// Rate Limiter Tests
test.describe('RateLimiter', () => {
  test.it('should allow requests within limit', async () => {
    const limiter = new RateLimiter({ maxRequests: 5, windowMs: 1000 });

    for (let i = 0; i < 5; i++) {
      const result = await limiter.check({ ip: '127.0.0.1' });
      expect(result.allowed).toBeTruthy();
    }
  });

  test.it('should block requests over limit', async () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 1000 });

    await limiter.check({ ip: '127.0.0.1' });
    await limiter.check({ ip: '127.0.0.1' });
    const result = await limiter.check({ ip: '127.0.0.1' });

    expect(result.allowed).toBeFalsy();
  });

  test.it('should reset after window expires', async () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 100 });

    await limiter.check({ ip: '127.0.0.1' });

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150));

    const result = await limiter.check({ ip: '127.0.0.1' });
    expect(result.allowed).toBeTruthy();
  });
});

// Input Sanitizer Tests
test.describe('InputSanitizer', () => {
  test.it('should sanitize HTML', () => {
    const dirty = '<script>alert("xss")</script>Hello';
    const clean = InputSanitizer.sanitizeHTML(dirty);
    expect(clean).not.toContain('<script>');
  });

  test.it('should validate email', () => {
    const valid = InputSanitizer.validateEmail('test@example.com');
    expect(valid).toBe('test@example.com');

    expect(() => InputSanitizer.validateEmail('invalid')).toThrow();
  });

  test.it('should sanitize file names', () => {
    const dangerous = '../../../etc/passwd';
    const safe = InputSanitizer.sanitizeFileName(dangerous);
    expect(safe).not.toContain('..');
    expect(safe).not.toContain('/');
  });

  test.it('should validate URLs', () => {
    const valid = InputSanitizer.sanitizeURL('https://example.com');
    expect(valid).toBe('https://example.com/');

    expect(() => InputSanitizer.sanitizeURL('javascript:alert(1)')).toThrow();
  });

  test.it('should validate file types', () => {
    expect(() => InputSanitizer.validateFileType('test.pdf', ['pdf', 'doc'])).not.toThrow();
    expect(() => InputSanitizer.validateFileType('test.exe', ['pdf', 'doc'])).toThrow();
  });
});

// Error Handler Tests
test.describe('ErrorHandler', () => {
  test.it('should categorize errors correctly', () => {
    const handler = new ErrorHandler({ debug: false });

    expect(handler.categorizeError(new NetworkError('test'))).toBe('network');
    expect(handler.categorizeError(new AuthenticationError('test'))).toBe('auth');
    expect(handler.categorizeError(new ValidationError('test'))).toBe('validation');
  });

  test.it('should get user-friendly messages', () => {
    const handler = new ErrorHandler({ debug: false });
    const message = handler.getUserMessage(new NetworkError('Failed to fetch'));

    expect(message).toContain('connection');
  });

  test.it('should wrap async functions', async () => {
    const fn = async () => {
      throw new Error('Test error');
    };

    const wrapped = ErrorHandler.wrapAsync(fn, 'test context');

    try {
      await wrapped();
    } catch (error) {
      expect(error.message).toBe('Test error');
    }
  });
});

// Validator Tests
test.describe('Validator', () => {
  test.it('should validate required fields', () => {
    expect(() => {
      Validator.validate({}, { name: { required: true } });
    }).toThrow();
  });

  test.it('should validate types', () => {
    expect(() => {
      Validator.validate(
        { age: 'not a number' },
        { age: { type: 'number' } }
      );
    }).toThrow();
  });

  test.it('should validate min length', () => {
    expect(() => {
      Validator.validate(
        { password: '123' },
        { password: { minLength: 8 } }
      );
    }).toThrow();
  });

  test.it('should validate email format', () => {
    expect(() => {
      Validator.validate(
        { email: 'invalid' },
        { email: { type: 'email' } }
      );
    }).toThrow();
  });

  test.it('should pass valid data', () => {
    expect(() => {
      Validator.validate(
        { name: 'John', email: 'john@example.com', age: 25 },
        {
          name: { required: true, type: 'string' },
          email: { required: true, type: 'email' },
          age: { type: 'number' }
        }
      );
    }).not.toThrow();
  });
});

// Cache Manager Tests
test.describe('CacheManager', () => {
  test.it('should cache values', () => {
    const cache = new CacheManager({ maxSize: 10 });
    cache.set('key1', 'value1');

    expect(cache.get('key1')).toBe('value1');
  });

  test.it('should return null for missing keys', () => {
    const cache = new CacheManager();
    expect(cache.get('nonexistent')).toBe(null);
  });

  test.it('should expire old entries', async () => {
    const cache = new CacheManager({ ttl: 100 });
    cache.set('key1', 'value1');

    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(cache.get('key1')).toBe(null);
  });

  test.it('should evict LRU when at max size', () => {
    const cache = new CacheManager({ maxSize: 2 });
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');

    expect(cache.get('key1')).toBe(null);
    expect(cache.get('key2')).toBe('value2');
    expect(cache.get('key3')).toBe('value3');
  });
});

// Performance Helpers Tests
test.describe('Performance Helpers', () => {
  test.it('debounce should delay execution', async () => {
    let callCount = 0;
    const fn = debounce(() => callCount++, 50);

    fn();
    fn();
    fn();

    expect(callCount).toBe(0);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(callCount).toBe(1);
  });

  test.it('throttle should limit execution', async () => {
    let callCount = 0;
    const fn = throttle(() => callCount++, 50);

    fn();
    fn();
    fn();

    expect(callCount).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 100));
    fn();

    expect(callCount).toBe(2);
  });

  test.it('memoize should cache results', () => {
    let callCount = 0;
    const fn = memoize((x) => {
      callCount++;
      return x * 2;
    });

    fn(5);
    fn(5);
    fn(5);

    expect(callCount).toBe(1);

    fn(10);
    expect(callCount).toBe(2);
  });
});

// Retry Helper Tests
test.describe('RetryHelper', () => {
  test.it('should retry on failure', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('Fail');
      return 'success';
    };

    const result = await RetryHelper.withRetry(fn, { maxRetries: 3, delay: 10 });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  test.it('should throw after max retries', async () => {
    const fn = async () => {
      throw new Error('Always fail');
    };

    try {
      await RetryHelper.withRetry(fn, { maxRetries: 3, delay: 10 });
      throw new Error('Should not reach here');
    } catch (error) {
      expect(error.message).toBe('Always fail');
    }
  });
});

// Agent Creation Tests
test.describe('Agent Creation', () => {
  test.it('should generate unique agent IDs', () => {
    const dashboard = new AIVoiceAdminDashboard();
    const id1 = dashboard.generateId();
    const id2 = dashboard.generateId();

    expect(id1).not.toBe(id2);
    expect(id1.startsWith('agent_')).toBeTruthy();
  });

  test.it('should create agent with default settings', async () => {
    const dashboard = new AIVoiceAdminDashboard();
    const agent = await dashboard.createAgent({
      name: 'Test Agent',
      description: 'Test Description'
    });

    expect(agent.name).toBe('Test Agent');
    expect(agent.status).toBe('active');
    expect(agent.voiceSettings).toBeTruthy();
    expect(agent.contextSettings).toBeTruthy();
  });
});

// Knowledge Processing Tests
test.describe('KnowledgeProcessor', () => {
  test.it('should chunk text properly', () => {
    const processor = new KnowledgeProcessor();
    const text = 'This is a test. '.repeat(100);
    const chunks = processor.chunkText(text, 'test.txt', 100);

    expect(chunks.length).toBeGreaterThan(1);
    chunks.forEach(chunk => {
      expect(chunk.text.length).toBeLessThan(150);
    });
  });
});

// Run all tests
if (typeof window !== 'undefined') {
  window.runTests = () => test.run();
  console.log('Tests loaded. Run window.runTests() to execute.');
} else {
  test.run();
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { test, expect, mock };
}
