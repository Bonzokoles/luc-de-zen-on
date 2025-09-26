// 🚀 MyBonzo Advanced Utils - Unified Export
// Centralny hub dla wszystkich zaawansowanych systemów

// Core Systems
export { default as ErrorMonitor } from './error-monitor.js';
export { default as CacheManager } from './cache-manager.js';
export { default as AnalyticsManager } from './analytics.js';
export { default as AIAgentManager } from './ai-agent-manager.js';

// Voice System
import('../voice-manager.js').then(module => {
  window.VoiceManager = module.default || module.VoiceManager;
}).catch(() => {
  console.warn('Voice Manager not available');
});

// System Integration
class MyBonzoAdvancedCore {
  constructor() {
    this.errorMonitor = null;
    this.cacheManager = null;
    this.analytics = null;
    this.agentManager = null;
    this.voiceManager = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🚀 Initializing MyBonzo Advanced Systems...');
      
      // Initialize Error Monitoring first
      this.errorMonitor = new (await import('./error-monitor.js')).default();
      
      // Initialize Cache Management
      this.cacheManager = new (await import('./cache-manager.js')).default();
      
      // Initialize Analytics
      this.analytics = new (await import('./analytics.js')).default();
      
      // Initialize AI Agent Management
      this.agentManager = new (await import('./ai-agent-manager.js')).default();
      
      // Initialize Voice Manager
      try {
        const VoiceManagerModule = await import('../voice-manager.js');
        this.voiceManager = new (VoiceManagerModule.default || VoiceManagerModule.VoiceManager)();
        window.voiceManager = this.voiceManager;
      } catch (error) {
        console.warn('Voice Manager not available:', error);
      }
      
      this.initialized = true;
      
      // Track system initialization
      this.analytics.track('system_initialized', {
        version: '2.0',
        timestamp: Date.now(),
        modules: ['ErrorMonitor', 'CacheManager', 'Analytics', 'AIAgentManager', 'VoiceManager']
      });
      
      console.log('✅ MyBonzo Advanced Systems initialized successfully');
      
      // Show success notification if available
      if (window.notifications) {
        window.notifications.success('🚀 Zaawansowane systemy MyBonzo aktywne!', [
          { label: 'Test Voice', handler: () => this.voiceManager?.speak('Systemy głosowe działają poprawnie!') }
        ]);
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize MyBonzo Advanced Systems:', error);
      if (this.errorMonitor) {
        this.errorMonitor.logError('System Initialization Failed', error);
      }
    }
  }

  getSystemStatus() {
    return {
      initialized: this.initialized,
      errorMonitor: !!this.errorMonitor,
      cacheManager: !!this.cacheManager,
      analytics: !!this.analytics,
      agentManager: !!this.agentManager,
      voiceManager: !!this.voiceManager,
      timestamp: Date.now()
    };
  }
}

// Global instance
const advancedCore = new MyBonzoAdvancedCore();
window.MyBonzoAdvanced = advancedCore;

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    advancedCore.initialize();
  });
} else {
  advancedCore.initialize();
}

// Global instance
window.MyBonzoAdvanced = new MyBonzoAdvancedCore();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.MyBonzoAdvanced.initialize();
  });
} else {
  window.MyBonzoAdvanced.initialize();
}

export { MyBonzoAdvancedCore };
export default advancedCore;