// Google ADK Integration Script
// Initializes all Google ADK agents and floating buttons interface

import { floatingButtons } from '../utils/FloatingButtonsManager';

// Google ADK Manager - dynamically imported
let googleADKManager: any = null;
let isADKInitialized: boolean = false;

// Initialize Google ADK Manager
async function initGoogleADK() {
  if (isADKInitialized) return googleADKManager;
  
  try {
    console.log('🚀 Loading Google ADK Manager...');
    const adkModule = await import('../agents/google-adk/manager');
    googleADKManager = adkModule.GoogleADKManager.getInstance();
    
    await googleADKManager.initialize();
    
    // Connect ADK Manager to Floating Buttons
    await floatingButtons.setADKManager(googleADKManager);
    
    isADKInitialized = true;
    console.log('✅ Google ADK Manager loaded and initialized');
    
    return googleADKManager;
  } catch (error) {
    console.error('❌ Failed to load Google ADK Manager:', error);
    throw error;
  }
}

// Initialize floating buttons system
function initFloatingButtons() {
  console.log('🎯 Initializing Floating Buttons System...');
  
  // Render all default buttons
  const buttons = floatingButtons.getAllButtons();
  buttons.forEach(button => {
    const buttonElement = document.createElement('div');
    buttonElement.id = `floating-btn-${button.id}`;
    buttonElement.className = 'floating-button';
    buttonElement.style.cssText = `
      position: fixed;
      left: ${button.position.x}px;
      top: ${button.position.y}px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: ${button.color};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      z-index: 900;
      font-size: 18px;
      user-select: none;
      opacity: ${button.isVisible ? '1' : '0'};
      pointer-events: ${button.isVisible ? 'auto' : 'none'};
    `;

    buttonElement.innerHTML = button.icon;
    buttonElement.title = button.description;

    buttonElement.addEventListener('click', async () => {
      await floatingButtons.toggleButton(button.id);
    });

    buttonElement.addEventListener('mouseenter', () => {
      buttonElement.style.transform = 'scale(1.1)';
      buttonElement.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
    });

    buttonElement.addEventListener('mouseleave', () => {
      buttonElement.style.transform = 'scale(1)';
      buttonElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    document.body.appendChild(buttonElement);
  });

  console.log('✅ Floating Buttons System initialized');
}

// Voice Command Integration
function initVoiceCommand() {
  const startBtn = document.getElementById('voice-start-btn');
  const statusDiv = document.getElementById('voice-status');
  const transcriptDiv = document.getElementById('voice-transcript');
  
  if (!startBtn || !('webkitSpeechRecognition' in window)) return;

  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'pl-PL';

  let isListening = false;

  startBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      isListening = false;
      startBtn.textContent = '🎤 Start Listening';
      startBtn.style.background = '#22c55e';
      if (statusDiv) statusDiv.textContent = 'Stopped listening';
    } else {
      recognition.start();
      isListening = true;
      startBtn.textContent = '⏹️ Stop Listening';
      startBtn.style.background = '#ef4444';
      if (statusDiv) statusDiv.textContent = 'Listening...';
    }
  });

  recognition.onresult = (event: any) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (transcriptDiv) transcriptDiv.textContent = transcript;
  };

  recognition.onend = () => {
    isListening = false;
    startBtn.textContent = '🎤 Start Listening';
    startBtn.style.background = '#22c55e';
    if (statusDiv) statusDiv.textContent = 'Ready to listen...';
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    if (statusDiv) statusDiv.textContent = `Error: ${event.error}`;
    isListening = false;
    startBtn.textContent = '🎤 Start Listening';
    startBtn.style.background = '#22c55e';
  };
}

// Music Control Integration
function initMusicControls() {
  const audioContext = getOrCreateAudioContext();
  let currentAudio: HTMLAudioElement | null = null;
  let isPlaying = false;

  const musicControls = {
    toggle: () => {
      const audioElements = document.querySelectorAll('audio');
      if (audioElements.length > 0) {
        currentAudio = audioElements[0] as HTMLAudioElement;
        if (isPlaying) {
          currentAudio.pause();
          isPlaying = false;
        } else {
          currentAudio.play();
          isPlaying = true;
        }
        updateTrackDisplay();
      }
    },
    
    previous: () => {
      console.log('Previous track');
      // Implementation for previous track
    },
    
    next: () => {
      console.log('Next track');
      // Implementation for next track
    },
    
    setVolume: (value: string) => {
      const volume = parseInt(value) / 100;
      if (currentAudio) {
        currentAudio.volume = volume;
      }
      const volumeDisplay = document.getElementById('volume-display');
      if (volumeDisplay) {
        volumeDisplay.textContent = `${value}%`;
      }
    }
  };

  function updateTrackDisplay() {
    const trackDiv = document.getElementById('current-track');
    if (trackDiv && currentAudio) {
      trackDiv.textContent = isPlaying ? 'Music playing...' : 'Music paused';
    }
  }

  // Make music controls available globally
  (window as any).musicControls = musicControls;
}

// Audio Context Helper
function getOrCreateAudioContext() {
  if (!(window as any).GLOBAL_AUDIO_CONTEXT) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      (window as any).GLOBAL_AUDIO_CONTEXT = audioContext;
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      return null;
    }
  }
  return (window as any).GLOBAL_AUDIO_CONTEXT;
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // Ctrl + Shift + V for voice command
    if (event.ctrlKey && event.shiftKey && event.key === 'V') {
      event.preventDefault();
      floatingButtons.toggleButton('voice-command');
    }
    
    // Ctrl + Shift + M for music control
    if (event.ctrlKey && event.shiftKey && event.key === 'M') {
      event.preventDefault();
      floatingButtons.toggleButton('music-control');
    }
    
    // Ctrl + Shift + G for Gemini Pro
    if (event.ctrlKey && event.shiftKey && event.key === 'G') {
      event.preventDefault();
      floatingButtons.toggleButton('gemini-pro');
    }
    
    // Ctrl + Shift + E for hide all widgets
    if (event.ctrlKey && event.shiftKey && event.key === 'E') {
      event.preventDefault();
      floatingButtons.hideAllWidgets();
    }
  });
}

// Auto-initialization on DOM ready
function initialize() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initFloatingButtons();
        initKeyboardShortcuts();
        
        // Initialize ADK after a short delay to ensure everything is loaded
        setTimeout(async () => {
          try {
            await initGoogleADK();
            
            // Initialize specific controls after ADK is ready
            setTimeout(() => {
              initVoiceCommand();
              initMusicControls();
            }, 1000);
          } catch (error) {
            console.error('Failed to initialize Google ADK:', error);
          }
        }, 2000);
      }, 100);
    });
  } else {
    // DOM is already ready
    setTimeout(() => {
      initFloatingButtons();
      initKeyboardShortcuts();
      
      setTimeout(async () => {
        try {
          await initGoogleADK();
          
          setTimeout(() => {
            initVoiceCommand();
            initMusicControls();
          }, 1000);
        } catch (error) {
          console.error('Failed to initialize Google ADK:', error);
        }
      }, 2000);
    }, 100);
  }
}

// Start initialization
initialize();

// Export for manual initialization if needed
export { initGoogleADK, initFloatingButtons, initVoiceCommand, initMusicControls };

// Log system info
console.log('🎯 Google ADK Integration Script loaded');
console.log('📊 Available shortcuts:');
console.log('  Ctrl+Shift+V - Toggle Voice Command');
console.log('  Ctrl+Shift+M - Toggle Music Control');
console.log('  Ctrl+Shift+G - Toggle Gemini Pro');
console.log('  Ctrl+Shift+E - Hide All Widgets');