// Performance Optimization Module

class PerformanceOptimizer {
  constructor() {
    this.cache = new Map();
    this.observers = [];
    this.metrics = [];
    this.initialize();
  }

  initialize() {
    this.setupPerformanceMonitoring();
    this.setupResourceOptimization();
  }

  // Performance Monitoring
  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('Long task detected:', entry.duration + 'ms');
          this.metrics.push({
            type: 'long-task',
            duration: entry.duration,
            timestamp: Date.now()
          });
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // longtask not supported
      }

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.value > 0.1) {
            console.warn('Layout shift detected:', entry.value);
          }
        }
      });

      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        // layout-shift not supported
      }
    }
  }

  // Resource Optimization
  setupResourceOptimization() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
      this.setupLazyLoading();
    }

    // Preload critical resources
    this.preloadCriticalResources();
  }

  // Lazy Loading
  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      // Add critical CSS, fonts, etc.
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  }

  // Get performance metrics
  getMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    return {
      // Page load metrics
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      domInteractive: navigation?.domInteractive,

      // Paint metrics
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,

      // Custom metrics
      longTasks: this.metrics.filter(m => m.type === 'long-task').length,

      // Memory (if available)
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }
}

// Caching System
class CacheManager {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 3600000; // 1 hour default
    this.cache = new Map();
    this.lruQueue = [];
  }

  // Get from cache
  get(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Update LRU
    this.updateLRU(key);

    return item.value;
  }

  // Set to cache
  set(key, value, ttl = this.ttl) {
    // Evict if at max size
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now()
    });

    this.updateLRU(key);
  }

  // Update LRU queue
  updateLRU(key) {
    const index = this.lruQueue.indexOf(key);
    if (index > -1) {
      this.lruQueue.splice(index, 1);
    }
    this.lruQueue.push(key);
  }

  // Evict least recently used
  evictLRU() {
    if (this.lruQueue.length > 0) {
      const key = this.lruQueue.shift();
      this.cache.delete(key);
    }
  }

  // Clear cache
  clear() {
    this.cache.clear();
    this.lruQueue = [];
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.hitRate || 0
    };
  }
}

// Debounce Helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle Helper
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization
function memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
  const cache = new Map();

  return function memoized(...args) {
    const key = keyGenerator(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Virtual Scroll for Large Lists
class VirtualScroller {
  constructor(container, itemHeight, items, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.items = items;
    this.renderItem = renderItem;

    this.visibleStart = 0;
    this.visibleEnd = 0;

    this.setup();
  }

  setup() {
    // Create viewport
    this.viewport = document.createElement('div');
    this.viewport.style.height = `${this.items.length * this.itemHeight}px`;
    this.viewport.style.position = 'relative';

    // Create content container
    this.content = document.createElement('div');
    this.content.style.position = 'absolute';
    this.content.style.top = '0';
    this.content.style.left = '0';
    this.content.style.right = '0';

    this.viewport.appendChild(this.content);
    this.container.appendChild(this.viewport);

    // Setup scroll listener
    this.container.addEventListener('scroll', throttle(() => {
      this.update();
    }, 16)); // ~60fps

    this.update();
  }

  update() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;

    // Calculate visible range
    this.visibleStart = Math.floor(scrollTop / this.itemHeight);
    this.visibleEnd = Math.ceil((scrollTop + containerHeight) / this.itemHeight);

    // Add buffer
    const bufferSize = 5;
    const renderStart = Math.max(0, this.visibleStart - bufferSize);
    const renderEnd = Math.min(this.items.length, this.visibleEnd + bufferSize);

    // Render visible items
    this.content.innerHTML = '';
    this.content.style.transform = `translateY(${renderStart * this.itemHeight}px)`;

    for (let i = renderStart; i < renderEnd; i++) {
      const item = this.renderItem(this.items[i], i);
      item.style.height = `${this.itemHeight}px`;
      this.content.appendChild(item);
    }
  }

  // Update items
  setItems(items) {
    this.items = items;
    this.viewport.style.height = `${this.items.length * this.itemHeight}px`;
    this.update();
  }
}

// Web Worker Pool for Heavy Computations
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workers = [];
    this.taskQueue = [];
    this.activeTask = new Map();

    // Create worker pool
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (e) => this.handleWorkerMessage(worker, e);
      this.workers.push(worker);
    }
  }

  // Execute task in worker
  async execute(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };

      // Find available worker
      const worker = this.getAvailableWorker();

      if (worker) {
        this.runTask(worker, task);
      } else {
        // Queue task
        this.taskQueue.push(task);
      }
    });
  }

  // Get available worker
  getAvailableWorker() {
    return this.workers.find(w => !this.activeTask.has(w));
  }

  // Run task on worker
  runTask(worker, task) {
    this.activeTask.set(worker, task);
    worker.postMessage(task.data);
  }

  // Handle worker response
  handleWorkerMessage(worker, event) {
    const task = this.activeTask.get(worker);

    if (task) {
      if (event.data.error) {
        task.reject(new Error(event.data.error));
      } else {
        task.resolve(event.data.result);
      }

      this.activeTask.delete(worker);

      // Process next task in queue
      if (this.taskQueue.length > 0) {
        const nextTask = this.taskQueue.shift();
        this.runTask(worker, nextTask);
      }
    }
  }

  // Terminate all workers
  terminate() {
    this.workers.forEach(w => w.terminate());
    this.workers = [];
    this.taskQueue = [];
    this.activeTask.clear();
  }
}

// IndexedDB Wrapper for Large Data Storage
class IndexedDBStorage {
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init(stores = []) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, store.options || { keyPath: 'id' });
          }
        });
      };
    });
  }

  async get(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async set(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Request Batching
class RequestBatcher {
  constructor(batchFunction, options = {}) {
    this.batchFunction = batchFunction;
    this.batchSize = options.batchSize || 10;
    this.batchDelay = options.batchDelay || 100;
    this.queue = [];
    this.timer = null;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  async flush() {
    if (this.queue.length === 0) return;

    clearTimeout(this.timer);
    this.timer = null;

    const batch = this.queue.splice(0, this.batchSize);

    try {
      const results = await this.batchFunction(batch.map(b => b.request));

      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }
}

// Image Optimization
class ImageOptimizer {
  static async compress(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            quality
          );
        };

        img.onerror = reject;
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static createThumbnail(file, size = 200) {
    return this.compress(file, size, 0.7);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PerformanceOptimizer,
    CacheManager,
    debounce,
    throttle,
    memoize,
    VirtualScroller,
    WorkerPool,
    IndexedDBStorage,
    RequestBatcher,
    ImageOptimizer
  };
}
