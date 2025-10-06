// Voice Agent - Speech Recognition Module
// Advanced speech recognition with multiple language support

export class SpeechRecognitionManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.language = 'pl-PL';
    this.confidence = 0.8;
    this.maxAlternatives = 3;
    this.continuousMode = false;
    this.interimResults = true;
    
    this.supportedLanguages = {
      'pl-PL': 'Polski',
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'de-DE': 'Deutsch',
      'fr-FR': 'Français',
      'es-ES': 'Español',
      'it-IT': 'Italiano',
      'ru-RU': 'Русский',
      'ja-JP': '日本語',
      'zh-CN': '中文'
    };
    
    this.commandPatterns = {
      navigation: /^(idź do|przejdź do|otwórz|nawiguj do)\s+(.+)$/i,
      search: /^(szukaj|znajdź|wyszukaj)\s+(.+)$/i,
      control: /^(start|stop|pause|play|zatrzymaj|uruchom|pauza|graj)$/i,
      voice: /^(głośniej|ciszej|wycisz|zwiększ głośność|zmniejsz głośność)$/i,
      system: /^(pomoc|help|restart|odśwież|zamknij)$/i
    };
    
    this.initialize();
  }
  
  initialize() {
    if (typeof window === 'undefined') {
      console.warn('Speech Recognition API not available outside the browser');
      return false;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech Recognition API not supported');
      return false;
    }
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = this.continuousMode;
      this.recognition.interimResults = this.interimResults;
      this.recognition.lang = this.language;
      this.recognition.maxAlternatives = this.maxAlternatives;
      
      this.setupEventListeners();
      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      return false;
    }
  }
  
  setupEventListeners() {
    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatusChange?.('listening');
      console.log('Speech recognition started');
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      this.onStatusChange?.('stopped');
      console.log('Speech recognition ended');
    };
    
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          this.processCommand(transcript, confidence);
        } else {
          interimTranscript += transcript;
        }
      }
      
      this.onTranscript?.({
        final: finalTranscript,
        interim: interimTranscript,
        confidence: event.results[event.results.length - 1][0].confidence
      });
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.onError?.(event.error);
      this.isListening = false;
    };
  }
  
  startListening() {
    if (!this.recognition) {
      if (!this.initialize()) {
        throw new Error('Speech recognition not available');
      }
    }
    
    if (!this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        throw error;
      }
    }
  }
  
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
  
  setLanguage(langCode) {
    if (this.supportedLanguages[langCode]) {
      this.language = langCode;
      if (this.recognition) {
        this.recognition.lang = langCode;
      }
      return true;
    }
    return false;
  }
  
  setContinuousMode(enabled) {
    this.continuousMode = enabled;
    if (this.recognition) {
      this.recognition.continuous = enabled;
    }
  }
  
  setConfidenceThreshold(threshold) {
    if (threshold >= 0 && threshold <= 1) {
      this.confidence = threshold;
    }
  }
  
  processCommand(transcript, confidence) {
    if (confidence < this.confidence) {
      console.log(`Low confidence: ${confidence}, ignoring command`);
      return;
    }
    
    const command = transcript.toLowerCase().trim();
    let commandType = 'unknown';
    let parameters = null;
    
    // Analyze command type
    for (const [type, pattern] of Object.entries(this.commandPatterns)) {
      const match = command.match(pattern);
      if (match) {
        commandType = type;
        parameters = match.length > 2 ? match[2] : match[1];
        break;
      }
    }
    
    const commandData = {
      original: transcript,
      processed: command,
      type: commandType,
      parameters,
      confidence,
      timestamp: new Date().toISOString()
    };
    
    this.onCommand?.(commandData);
    return commandData;
  }
  
  getAvailableLanguages() {
    return this.supportedLanguages;
  }
  
  getCurrentLanguage() {
    return {
      code: this.language,
      name: this.supportedLanguages[this.language] ?? this.language
    };
  }

  isSupported() {
    if (typeof window === 'undefined') {
      return false;
    }
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  getStatus() {
    return {
      isListening: this.isListening,
      language: this.language,
      continuous: this.continuousMode,
      confidence: this.confidence,
      supported: this.isSupported()
    };
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.SpeechRecognitionManager = SpeechRecognitionManager;
}