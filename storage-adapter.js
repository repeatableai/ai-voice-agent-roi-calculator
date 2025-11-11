// Storage Adapter for AI Voice Agent System
// Supports localStorage, Firebase, and Supabase

class StorageAdapter {
  constructor(config) {
    this.config = config;
    this.provider = config.storageProvider || 'localStorage';
    this.initialize();
  }

  async initialize() {
    switch (this.provider) {
      case 'firebase':
        await this.initializeFirebase();
        break;
      case 'supabase':
        await this.initializeSupabase();
        break;
      case 'localStorage':
      default:
        this.initializeLocalStorage();
    }
  }

  initializeLocalStorage() {
    this.storage = window.localStorage;
  }

  async initializeFirebase() {
    // Firebase initialization
    if (!this.config.firebaseConfig) {
      throw new Error('Firebase config required');
    }
    // This would require firebase SDK
    console.warn('Firebase storage not fully implemented');
  }

  async initializeSupabase() {
    // Supabase initialization
    if (!this.config.supabaseUrl || !this.config.supabaseKey) {
      throw new Error('Supabase URL and key required');
    }
    // This would require supabase SDK
    console.warn('Supabase storage not fully implemented');
  }

  async get(key) {
    try {
      switch (this.provider) {
        case 'localStorage':
          const item = this.storage.getItem(key);
          return item ? JSON.parse(item) : null;
        case 'firebase':
          // Firebase get implementation
          return null;
        case 'supabase':
          // Supabase get implementation
          return null;
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async set(key, value) {
    try {
      switch (this.provider) {
        case 'localStorage':
          this.storage.setItem(key, JSON.stringify(value));
          return true;
        case 'firebase':
          // Firebase set implementation
          return false;
        case 'supabase':
          // Supabase set implementation
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      return false;
    }
  }

  async delete(key) {
    try {
      switch (this.provider) {
        case 'localStorage':
          this.storage.removeItem(key);
          return true;
        case 'firebase':
          // Firebase delete implementation
          return false;
        case 'supabase':
          // Supabase delete implementation
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
      return false;
    }
  }

  async list(prefix) {
    try {
      switch (this.provider) {
        case 'localStorage':
          const keys = [];
          for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key.startsWith(prefix)) {
              keys.push(key);
            }
          }
          return keys;
        case 'firebase':
          // Firebase list implementation
          return [];
        case 'supabase':
          // Supabase list implementation
          return [];
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error listing keys with prefix ${prefix}:`, error);
      return [];
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageAdapter;
}
