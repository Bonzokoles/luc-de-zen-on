// System Agent Functions - MyBonzo System Management & Monitoring
// Version: 1.0.0

class SystemAgent {
  constructor() {
    this.systemInfo = {};
    this.performanceMetrics = {};
    this.healthChecks = new Map();
    this.monitoringInterval = null;
    this.alerts = [];
    
    this.initializeSystemMonitoring();
  }

  // Initialize system monitoring
  initializeSystemMonitoring() {
    this.collectSystemInfo();
    this.setupHealthChecks();
    this.startPerformanceMonitoring();
  }

  // Collect basic system information
  collectSystemInfo() {
    this.systemInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
      memory: this.getMemoryInfo(),
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toISOString()
    };
  }

  // Get memory information if available
  getMemoryInfo() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Setup health check endpoints
  setupHealthChecks() {
    this.healthChecks.set('api', {
      name: 'API Health',
      endpoint: '/api/health',
      status: 'unknown',
      lastCheck: null,
      responseTime: null
    });

    this.healthChecks.set('status', {
      name: 'Status Check',
      endpoint: '/api/status-check',
      status: 'unknown',
      lastCheck: null,
      responseTime: null
    });

    this.healthChecks.set('workers', {
      name: 'Workers Status',
      endpoint: '/api/workers-status',
      status: 'unknown',
      lastCheck: null,
      responseTime: null
    });
  }

  // Start performance monitoring
  startPerformanceMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.collectPerformanceMetrics();
      this.runHealthChecks();
    }, 30000); // Every 30 seconds
  }

  // Collect performance metrics
  collectPerformanceMetrics() {
    const timing = performance.timing;
    const navigation = performance.navigation;

    this.performanceMetrics = {
      // Page load times
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domComplete - timing.navigationStart,
      
      // Network timing
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnect: timing.connectEnd - timing.connectStart,
      serverResponse: timing.responseStart - timing.requestStart,
      pageDownload: timing.responseEnd - timing.responseStart,
      
      // Navigation info
      navigationType: navigation.type,
      redirectCount: navigation.redirectCount,
      
      // Memory (if available)
      memory: this.getMemoryInfo(),
      
      // Connection info
      connectionType: this.getConnectionType(),
      
      timestamp: new Date().toISOString()
    };

    this.updatePerformanceUI();
  }

  // Get connection type
  getConnectionType() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return null;
  }

  // Run health checks on all endpoints
  async runHealthChecks() {
    for (const [key, check] of this.healthChecks) {
      try {
        const startTime = performance.now();
        const response = await fetch(check.endpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        const endTime = performance.now();

        check.status = response.ok ? 'healthy' : 'unhealthy';
        check.responseTime = Math.round(endTime - startTime);
        check.lastCheck = new Date().toISOString();
        check.statusCode = response.status;

      } catch (error) {
        check.status = 'error';
        check.responseTime = null;
        check.lastCheck = new Date().toISOString();
        check.error = error.message;
        
        this.addAlert({
          type: 'error',
          message: `Health check failed for ${check.name}: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }
    }

    this.updateHealthUI();
  }

  // System diagnostics
  runDiagnostics() {
    const diagnostics = {
      browser: this.checkBrowserSupport(),
      connectivity: this.checkConnectivity(),
      performance: this.analyzePerformance(),
      storage: this.checkStorage(),
      apis: this.checkAPISupport(),
      timestamp: new Date().toISOString()
    };

    return diagnostics;
  }

  // Check browser support for key features
  checkBrowserSupport() {
    return {
      webAudio: !!(window.AudioContext || window.webkitAudioContext),
      speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      speechSynthesis: !!window.speechSynthesis,
      webGL: !!window.WebGLRenderingContext,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
      webWorkers: !!window.Worker,
      fetch: !!window.fetch,
      promiseSupport: !!window.Promise
    };
  }

  // Check connectivity status
  checkConnectivity() {
    return {
      online: navigator.onLine,
      connection: this.getConnectionType(),
      lastOnlineCheck: new Date().toISOString()
    };
  }

  // Analyze current performance
  analyzePerformance() {
    const metrics = this.performanceMetrics;
    const analysis = {
      overall: 'good',
      issues: [],
      recommendations: []
    };

    // Check load times
    if (metrics.loadComplete > 5000) {
      analysis.overall = 'poor';
      analysis.issues.push('Slow page load time');
      analysis.recommendations.push('Optimize assets and reduce bundle size');
    } else if (metrics.loadComplete > 3000) {
      analysis.overall = 'fair';
      analysis.issues.push('Moderate page load time');
    }

    // Check memory usage
    if (metrics.memory && metrics.memory.usedJSHeapSize > 50 * 1024 * 1024) {
      analysis.issues.push('High memory usage');
      analysis.recommendations.push('Review memory leaks and optimize code');
    }

    return analysis;
  }

  // Check storage availability
  checkStorage() {
    const storage = {
      localStorage: this.getStorageInfo('localStorage'),
      sessionStorage: this.getStorageInfo('sessionStorage'),
      indexedDB: !!window.indexedDB
    };

    return storage;
  }

  getStorageInfo(storageType) {
    try {
      const storage = window[storageType];
      if (!storage) return { available: false };

      // Test storage
      const testKey = '__test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);

      return {
        available: true,
        itemCount: storage.length
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  }

  // Check API support
  checkAPISupport() {
    return {
      fetchAPI: !!window.fetch,
      geolocation: !!navigator.geolocation,
      notifications: !!window.Notification,
      serviceWorker: !!navigator.serviceWorker,
      pushManager: !!(window.PushManager),
      mediaDevices: !!(navigator.mediaDevices),
      batteryAPI: !!navigator.getBattery,
      gamepad: !!navigator.getGamepads
    };
  }

  // Clear system caches
  async clearCaches() {
    const results = {
      localStorage: false,
      sessionStorage: false,
      caches: false
    };

    try {
      // Clear localStorage
      if (window.localStorage) {
        localStorage.clear();
        results.localStorage = true;
      }

      // Clear sessionStorage  
      if (window.sessionStorage) {
        sessionStorage.clear();
        results.sessionStorage = true;
      }

      // Clear cache API
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        results.caches = true;
      }

    } catch (error) {
      console.error('Cache clearing failed:', error);
    }

    return results;
  }

  // Add system alert
  addAlert(alert) {
    this.alerts.unshift(alert);
    if (this.alerts.length > 10) {
      this.alerts = this.alerts.slice(0, 10);
    }
    this.updateAlertsUI();
  }

  // Update UI components
  updatePerformanceUI() {
    const metrics = this.performanceMetrics;
    
    // Update load time
    const loadTimeEl = document.getElementById('loadTime');
    if (loadTimeEl && metrics.loadComplete) {
      loadTimeEl.textContent = `${Math.round(metrics.loadComplete)}ms`;
    }

    // Update memory usage
    const memoryEl = document.getElementById('memoryUsage');
    if (memoryEl && metrics.memory) {
      const mbUsed = Math.round(metrics.memory.usedJSHeapSize / 1024 / 1024);
      memoryEl.textContent = `${mbUsed}MB`;
    }
  }

  updateHealthUI() {
    this.healthChecks.forEach((check, key) => {
      const statusEl = document.getElementById(`${key}Status`);
      const timeEl = document.getElementById(`${key}Time`);
      
      if (statusEl) {
        statusEl.textContent = check.status.toUpperCase();
        statusEl.className = check.status === 'healthy' ? 'text-[#00ff88]' : 
                            check.status === 'unhealthy' ? 'text-[#ffd700]' : 'text-[#ff4444]';
      }
      
      if (timeEl && check.responseTime) {
        timeEl.textContent = `${check.responseTime}ms`;
      }
    });
  }

  updateAlertsUI() {
    const alertsEl = document.getElementById('systemAlerts');
    if (alertsEl && this.alerts.length > 0) {
      alertsEl.innerHTML = this.alerts.map(alert => `
        <div class="text-xs p-2 rounded border border-${alert.type === 'error' ? 'red' : 'yellow'}-500/20 bg-${alert.type === 'error' ? 'red' : 'yellow'}-500/10">
          <span class="text-${alert.type === 'error' ? 'red' : 'yellow'}-400">${new Date(alert.timestamp).toLocaleTimeString()}</span>
          <br>
          ${alert.message}
        </div>
      `).join('');
    }
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  // Get current system status
  getStatus() {
    return {
      systemInfo: this.systemInfo,
      performanceMetrics: this.performanceMetrics,
      healthChecks: Object.fromEntries(this.healthChecks),
      alerts: this.alerts,
      monitoring: !!this.monitoringInterval
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SystemAgent;
} else if (typeof window !== 'undefined') {
  window.SystemAgent = SystemAgent;
}