class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.ttl = 5 * 60 * 1000; // 5 minut
    this.setupServiceWorker();
  }

  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered');
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  }

  set(key, value, customTTL = null) {
    const ttl = customTTL || this.ttl;
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, item);
    
    // Cleanup old entries
    if (this.cache.size > this.maxSize) {
      this.cleanup();
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (e) {
      console.warn('Failed to store in localStorage:', e);
    }
  }

  get(key) {
    let item = this.cache.get(key);
    
    // Try localStorage if not in memory
    if (!item) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          item = JSON.parse(stored);
          this.cache.set(key, item);
        }
      } catch (e) {
        console.warn('Failed to read from localStorage:', e);
      }
    }

    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
    localStorage.removeItem(`cache_${key}`);
  }

  cleanup() {
    const now = Date.now();
    const toDelete = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        toDelete.push(key);
      }
    });

    toDelete.forEach(key => this.delete(key));
  }

  clear() {
    this.cache.clear();
    Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate()
    };
  }
}

export default CacheManager;