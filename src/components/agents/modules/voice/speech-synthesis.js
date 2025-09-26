// Voice Agent - Speech Synthesis Module
// Advanced text-to-speech with voice customization

export class SpeechSynthesisManager {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.voices = [];
    this.currentVoice = null;
    this.settings = {
      rate: 1.0,      // 0.1 to 10
      pitch: 1.0,     // 0 to 2
      volume: 1.0,    // 0 to 1
      language: 'pl-PL'
    };
    
    this.queue = [];
    this.isPlaying = false;
    this.currentUtterance = null;
    
    this.presetVoices = {
      'natural': { rate: 0.9, pitch: 1.0, volume: 0.8 },
      'robot': { rate: 1.5, pitch: 0.5, volume: 1.0 },
      'whisper': { rate: 0.7, pitch: 0.8, volume: 0.3 },
      'announcement': { rate: 0.8, pitch: 1.2, volume: 1.0 },
      'fast': { rate: 1.8, pitch: 1.1, volume: 0.9 },
      'slow': { rate: 0.5, pitch: 0.9, volume: 0.7 }
    };
    
    this.initialize();
  }
  
  initialize() {
    if (!this.synthesis) {
      console.warn('Speech Synthesis API not supported');
      return false;
    }
    
    // Load available voices
    this.loadVoices();
    
    // Handle voices loading (Chrome specific)
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
    
    return true;
  }
  
  loadVoices() {
    this.voices = this.synthesis.getVoices();
    
    // Find best Polish voice
    const polishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('pl') || voice.lang.startsWith('pl-PL')
    );
    
    if (polishVoices.length > 0) {
      this.currentVoice = polishVoices.find(voice => voice.localService) || polishVoices[0];
    } else {
      // Fallback to any available voice
      this.currentVoice = this.voices.find(voice => voice.localService) || this.voices[0];
    }
    
    this.onVoicesLoaded?.(this.voices);
  }
  
  speak(text, options = {}) {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not available');
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    utterance.voice = options.voice || this.currentVoice;
    utterance.rate = options.rate || this.settings.rate;
    utterance.pitch = options.pitch || this.settings.pitch;
    utterance.volume = options.volume || this.settings.volume;
    utterance.lang = options.language || this.settings.language;
    
    // Event listeners
    utterance.onstart = () => {
      this.isPlaying = true;
      this.currentUtterance = utterance;
      this.onStart?.(text);
    };
    
    utterance.onend = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      this.onEnd?.(text);
      this.processQueue();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.onError?.(event.error);
      this.isPlaying = false;
      this.currentUtterance = null;
    };
    
    utterance.onpause = () => {
      this.onPause?.(text);
    };
    
    utterance.onresume = () => {
      this.onResume?.(text);
    };
    
    // Speak immediately or add to queue
    if (options.immediate || !this.isPlaying) {
      this.synthesis.speak(utterance);
    } else {
      this.queue.push(utterance);
    }
    
    return utterance;
  }
  
  speakWithPreset(text, presetName) {
    const preset = this.presetVoices[presetName];
    if (!preset) {
      throw new Error(`Unknown voice preset: ${presetName}`);
    }
    
    return this.speak(text, preset);
  }
  
  pause() {
    if (this.synthesis && this.isPlaying) {
      this.synthesis.pause();
    }
  }
  
  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }
  
  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
      this.queue = [];
    }
  }
  
  setVoice(voiceIndex) {
    if (voiceIndex >= 0 && voiceIndex < this.voices.length) {
      this.currentVoice = this.voices[voiceIndex];
      return true;
    }
    return false;
  }
  
  setVoiceByName(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.currentVoice = voice;
      return true;
    }
    return false;
  }
  
  setRate(rate) {
    if (rate >= 0.1 && rate <= 10) {
      this.settings.rate = rate;
      return true;
    }
    return false;
  }
  
  setPitch(pitch) {
    if (pitch >= 0 && pitch <= 2) {
      this.settings.pitch = pitch;
      return true;
    }
    return false;
  }
  
  setVolume(volume) {
    if (volume >= 0 && volume <= 1) {
      this.settings.volume = volume;
      return true;
    }
    return false;
  }
  
  setLanguage(language) {
    this.settings.language = language;
    
    // Try to find a voice for this language
    const languageVoices = this.voices.filter(voice => 
      voice.lang.startsWith(language.split('-')[0])
    );
    
    if (languageVoices.length > 0) {
      this.currentVoice = languageVoices[0];
    }
  }
  
  addToQueue(text, options = {}) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.voice = options.voice || this.currentVoice;
    utterance.rate = options.rate || this.settings.rate;
    utterance.pitch = options.pitch || this.settings.pitch;
    utterance.volume = options.volume || this.settings.volume;
    utterance.lang = options.language || this.settings.language;
    
    this.queue.push(utterance);
    
    if (!this.isPlaying) {
      this.processQueue();
    }
  }
  
  processQueue() {
    if (this.queue.length > 0 && !this.isPlaying) {
      const utterance = this.queue.shift();
      this.synthesis.speak(utterance);
    }
  }
  
  clearQueue() {
    this.queue = [];
  }
  
  getVoices() {
    return this.voices.map((voice, index) => ({
      index,
      name: voice.name,
      language: voice.lang,
      localService: voice.localService,
      default: voice.default
    }));
  }
  
  getPolishVoices() {
    return this.voices
      .filter(voice => voice.lang.startsWith('pl'))
      .map((voice, index) => ({
        index: this.voices.indexOf(voice),
        name: voice.name,
        language: voice.lang,
        localService: voice.localService,
        default: voice.default
      }));
  }
  
  getCurrentSettings() {
    return {
      ...this.settings,
      currentVoice: this.currentVoice ? {
        name: this.currentVoice.name,
        language: this.currentVoice.lang
      } : null,
      isPlaying: this.isPlaying,
      queueLength: this.queue.length
    };
  }
  
  getPresets() {
    return Object.keys(this.presetVoices);
  }
  
  isSupported() {
    return 'speechSynthesis' in window;
  }
  
  // Text preprocessing for better pronunciation
  preprocessText(text) {
    // Replace common abbreviations
    const replacements = {
      'www.': 'www kropka ',
      '@': ' małpa ',
      '&': ' i ',
      '%': ' procent',
      '$': ' dolar',
      '€': ' euro',
      '£': ' funt',
      '#': ' hash',
      '+': ' plus',
      '=': ' równa się',
      '<': ' mniejsze niż',
      '>': ' większe niż'
    };
    
    let processed = text;
    for (const [search, replace] of Object.entries(replacements)) {
      processed = processed.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
    }
    
    return processed;
  }
  
  speakProcessed(text, options = {}) {
    const processedText = this.preprocessText(text);
    return this.speak(processedText, options);
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.SpeechSynthesisManager = SpeechSynthesisManager;
}