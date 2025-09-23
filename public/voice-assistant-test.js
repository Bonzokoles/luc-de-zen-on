// Voice Assistant POLACZEK Test Script
// Enhanced visualizer synchronization for music + voice integration

(function() {
  console.log("🎙️ Loading Voice Assistant Test Script...");

  // Enhanced Music + Voice Visualizer Controller
  class VoiceVisualizerController {
    constructor() {
      this.musicVisualizer = null;
      this.voiceVisualizer = null;
      this.isVoiceActive = false;
      this.isMusicActive = false;
      this.syncMode = 'separate'; // 'separate', 'combined', 'voice-priority'
      
      this.init();
    }

    init() {
      // Find visualizer elements
      this.musicVisualizer = document.querySelector('[style*="scaleY(1.03)"][style*="hue-rotate(30deg)"][style*="brightness(1.2)"]');
      this.voiceVisualizer = document.querySelector('[style*="opacity: 0.8"][style*="pointer-events:none"]:not([style*="scaleY"])');
      
      console.log("🎵 Music visualizer found:", !!this.musicVisualizer);
      console.log("🎙️ Voice visualizer found:", !!this.voiceVisualizer);
      
      // Listen for POLACZEK speaking events
      window.addEventListener('polaczek-speaking', (event) => {
        this.handleVoiceEvent(event.detail);
      });
      
      // Listen for music events
      window.addEventListener('music-playing', (event) => {
        this.handleMusicEvent(event.detail);
      });
      
      // Add test controls
      this.addTestControls();
    }

    handleVoiceEvent(detail) {
      this.isVoiceActive = detail.isActive;
      console.log("🎙️ Voice event:", detail);
      
      if (this.voiceVisualizer) {
        if (this.isVoiceActive) {
          // Enhance voice visualizer when speaking
          this.voiceVisualizer.style.transition = 'all 0.3s ease';
          this.voiceVisualizer.style.opacity = '1.0';
          this.voiceVisualizer.style.filter = 'hue-rotate(120deg) brightness(1.4) saturate(1.2)';
          this.voiceVisualizer.style.transform = 'translateX(-50%) scale(1.08)';
          
          // Reduce music visualizer intensity if both are active
          if (this.musicVisualizer && this.isMusicActive) {
            this.musicVisualizer.style.opacity = '0.2';
            this.musicVisualizer.style.filter = 'hue-rotate(30deg) brightness(0.6)';
          }
        } else {
          // Restore voice visualizer
          this.voiceVisualizer.style.opacity = '0.8';
          this.voiceVisualizer.style.filter = '';
          this.voiceVisualizer.style.transform = 'translateX(-50%)';
          
          // Restore music visualizer if active
          if (this.musicVisualizer && this.isMusicActive) {
            this.musicVisualizer.style.opacity = '0.4';
            this.musicVisualizer.style.filter = 'hue-rotate(30deg) brightness(1.2)';
          }
        }
      }
      
      this.updateSyncStatus();
    }

    handleMusicEvent(detail) {
      this.isMusicActive = detail.isActive;
      console.log("🎵 Music event:", detail);
      this.updateSyncStatus();
    }

    updateSyncStatus() {
      const status = {
        voice: this.isVoiceActive,
        music: this.isMusicActive,
        mode: this.syncMode,
        timestamp: new Date().toISOString()
      };
      
      // Store sync status for debugging
      window.VOICE_SYNC_STATUS = status;
      
      // Dispatch sync event for other components
      window.dispatchEvent(new CustomEvent('visualizer-sync', { detail: status }));
    }

    // Manual control methods
    testVoiceVisualizer(active = true) {
      console.log("🧪 Testing voice visualizer:", active);
      
      const event = new CustomEvent('polaczek-speaking', {
        detail: { 
          isActive: active, 
          message: active ? "Test voice message" : "" 
        }
      });
      
      window.dispatchEvent(event);
    }

    testMusicVisualizer(active = true) {
      console.log("🧪 Testing music visualizer:", active);
      
      const event = new CustomEvent('music-playing', {
        detail: { 
          isActive: active,
          track: active ? "Test track" : ""
        }
      });
      
      window.dispatchEvent(event);
    }

    testBothVisualizers() {
      console.log("🧪 Testing both visualizers together");
      
      // Start voice
      setTimeout(() => this.testVoiceVisualizer(true), 0);
      
      // Start music after 1 second
      setTimeout(() => this.testMusicVisualizer(true), 1000);
      
      // Stop voice after 3 seconds  
      setTimeout(() => this.testVoiceVisualizer(false), 3000);
      
      // Stop music after 5 seconds
      setTimeout(() => this.testMusicVisualizer(false), 5000);
    }

    addTestControls() {
      // Add test button to page (for development)
      if (window.location.search.includes('voice-test')) {
        const testPanel = document.createElement('div');
        testPanel.style.cssText = `
          position: fixed;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 10px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 12px;
          z-index: 10000;
        `;
        
        testPanel.innerHTML = `
          <div><strong>Voice Assistant Test Panel</strong></div>
          <button onclick="window.voiceController.testVoiceVisualizer(true)" style="margin: 2px; padding: 4px 8px;">Start Voice</button>
          <button onclick="window.voiceController.testVoiceVisualizer(false)" style="margin: 2px; padding: 4px 8px;">Stop Voice</button>
          <br>
          <button onclick="window.voiceController.testMusicVisualizer(true)" style="margin: 2px; padding: 4px 8px;">Start Music</button>
          <button onclick="window.voiceController.testMusicVisualizer(false)" style="margin: 2px; padding: 4px 8px;">Stop Music</button>
          <br>
          <button onclick="window.voiceController.testBothVisualizers()" style="margin: 2px; padding: 4px 8px;">Test Sync</button>
        `;
        
        document.body.appendChild(testPanel);
        console.log("🧪 Voice test panel added. Access via: ?voice-test");
      }
    }
  }

  // Initialize controller when page is ready
  if (document.readyState === 'complete') {
    window.voiceController = new VoiceVisualizerController();
  } else {
    window.addEventListener('load', () => {
      window.voiceController = new VoiceVisualizerController();
    });
  }

  // Utility functions for console debugging
  window.VOICE_DEBUG = {
    status: () => console.log(window.VOICE_SYNC_STATUS || "No sync status available"),
    testVoice: (active = true) => window.voiceController?.testVoiceVisualizer(active),
    testMusic: (active = true) => window.voiceController?.testMusicVisualizer(active),
    testBoth: () => window.voiceController?.testBothVisualizers(),
    help: () => {
      console.log(`
🎙️ Voice Assistant Debug Commands:
- VOICE_DEBUG.status() - Check current sync status
- VOICE_DEBUG.testVoice(true/false) - Test voice visualizer
- VOICE_DEBUG.testMusic(true/false) - Test music visualizer  
- VOICE_DEBUG.testBoth() - Test synchronized visualization
- Add ?voice-test to URL for visual test panel
      `);
    }
  };

  console.log("🎙️ Voice Assistant Test Script loaded!");
  console.log("🧪 Run VOICE_DEBUG.help() for debugging commands");
})();