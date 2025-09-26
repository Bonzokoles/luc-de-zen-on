
class VoiceManager {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.synthesis = null;
    this.audioContext = null;
    this.currentAgent = null;
    this.conversationHistory = [];
    this.setupAudioContext();
    this.setupSpeechRecognition();
    this.setupSpeechSynthesis();
  }

  async setupAudioContext() {
    try {
      // Napraw AudioContext błąd
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      console.log('✅ AudioContext initialized:', this.audioContext.state);
      return true;
    } catch (error) {
      console.error('❌ AudioContext failed:', error);
      window.notifications?.error('Błąd inicjalizacji audio. Sprawdź uprawnienia przeglądarki.');
      return false;
    }
  }

  setupSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech Recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'pl-PL';
    
    this.recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      this.updateVoiceStatus('listening');
    };
    
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      this.handleVoiceInput(finalTranscript, interimTranscript);
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.handleVoiceError(event.error);
    };
    
    this.recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      this.updateVoiceStatus('stopped');
    };
    
    return true;
  }

  setupSpeechSynthesis() {
    this.synthesis = window.speechSynthesis;
    
    // Get Polish voice
    this.getPolishVoice().then(voice => {
      this.polishVoice = voice;
      console.log('✅ Polish voice ready:', voice?.name);
    });
  }

  async getPolishVoice() {
    return new Promise((resolve) => {
      const voices = this.synthesis.getVoices();
      let polishVoice = voices.find(voice => voice.lang.startsWith('pl'));
      
      if (!polishVoice) {
        // Wait for voices to load
        this.synthesis.addEventListener('voiceschanged', () => {
          const newVoices = this.synthesis.getVoices();
          polishVoice = newVoices.find(voice => voice.lang.startsWith('pl')) || newVoices[0];
          resolve(polishVoice);
        });
      } else {
        resolve(polishVoice);
      }
    });
  }

  async startVoiceAgent(agentType, config = {}) {
    try {
      // Ensure audio context is ready
      if (!this.audioContext || this.audioContext.state !== 'running') {
        const audioReady = await this.setupAudioContext();
        if (!audioReady) return false;
      }

      this.currentAgent = agentType;
      this.isListening = true;
      
      // Show voice interface
      this.showVoiceInterface(agentType);
      
      // Start recognition
      this.recognition.start();
      
      // Welcome message
      await this.speak(`Witaj! Jestem ${this.getAgentName(agentType)}. Jak mogę Ci pomóc?`);
      
      window.notifications?.success(`Agent ${this.getAgentName(agentType)} jest gotowy do rozmowy`, [
        { label: 'Zatrzymaj', handler: () => this.stopVoiceAgent() }
      ]);
      
      return true;
    } catch (error) {
      console.error('Failed to start voice agent:', error);
      this.handleVoiceError(error.message);
      return false;
    }
  }

  async stopVoiceAgent() {
    this.isListening = false;
    this.currentAgent = null;
    
    if (this.recognition) {
      this.recognition.stop();
    }
    
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    
    this.hideVoiceInterface();
    this.updateVoiceStatus('stopped');
    
    window.notifications?.success('Agent głosowy został zatrzymany');
  }

  async handleVoiceInput(finalTranscript, interimTranscript) {
    if (!finalTranscript.trim()) return;
    
    console.log('🗣️ User said:', finalTranscript);
    
    // Update UI with user input
    this.updateVoiceTranscript(finalTranscript, 'user');
    
    // Stop listening temporarily
    this.recognition.stop();
    this.updateVoiceStatus('processing');
    
    try {
      // Send to AI agent
      const response = await this.sendToAIAgent(finalTranscript);
      
      // Update conversation history
      this.conversationHistory.push({
        user: finalTranscript,
        agent: response,
        timestamp: Date.now(),
        agentType: this.currentAgent
      });
      
      // Update UI with agent response
      this.updateVoiceTranscript(response, 'agent');
      
      // Speak response
      await this.speak(response);
      
      // Resume listening
      if (this.isListening) {
        setTimeout(() => {
          this.recognition.start();
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      await this.speak('Przepraszam, wystąpił błąd. Spróbuj ponownie.');
      
      if (this.isListening) {
        setTimeout(() => {
          this.recognition.start();
        }, 2000);
      }
    }
  }

  async sendToAIAgent(message) {
    const endpoint = this.getAgentEndpoint(this.currentAgent);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getApiKey()}`
      },
      body: JSON.stringify({
        message,
        conversationHistory: this.conversationHistory.slice(-5), // Last 5 messages for context
        agentType: this.currentAgent,
        voiceMode: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.response || data.message || 'Nie otrzymałem odpowiedzi.';
  }

  async speak(text) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not available'));
        return;
      }
      
      // Cancel any ongoing speech
      this.synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      if (this.polishVoice) {
        utterance.voice = this.polishVoice;
      }
      
      utterance.onend = () => {
        console.log('🔊 Speech finished');
        resolve();
      };
      
      utterance.onerror = (error) => {
        console.error('Speech error:', error);
        reject(error);
      };
      
      this.synthesis.speak(utterance);
    });
  }

  getAgentName(agentType) {
    const names = {
      'geminiPro': 'Gemini Pro',
      'geminiVision': 'Gemini Vision',
      'codeBison': 'Code Bison',
      'textBison': 'Text Bison',
      'googleBard': 'Google Bard',
      'palm': 'PaLM',
      'vertex': 'Vertex AI',
      'aiStudio': 'AI Studio'
    };
    return names[agentType] || agentType;
  }

  getAgentEndpoint(agentType) {
    const endpoints = {
      'geminiPro': '/api/agents/gemini-pro',
      'geminiVision': '/api/agents/gemini-vision',
      'codeBison': '/api/agents/code-bison',
      'textBison': '/api/agents/text-bison',
      'googleBard': '/api/agents/google-bard',
      'palm': '/api/agents/palm',
      'vertex': '/api/agents/vertex',
      'aiStudio': '/api/agents/ai-studio'
    };
    return endpoints[agentType] || '/api/agents/default';
  }

  getApiKey() {
    // Get from environment or localStorage
    return localStorage.getItem('ai_api_key') || process.env.OPENAI_API_KEY;
  }

  handleVoiceError(error) {
    console.error('Voice error:', error);
    
    const errorMessages = {
      'network': 'Błąd połączenia sieciowego',
      'not-allowed': 'Brak uprawnień do mikrofonu. Sprawdź ustawienia przeglądarki.',
      'no-speech': 'Nie wykryto mowy. Spróbuj ponownie.',
      'audio-capture': 'Błąd przechwytywania audio',
      'aborted': 'Rozpoznawanie mowy zostało przerwane'
    };
    
    const message = errorMessages[error] || `Błąd głosowy: ${error}`;
    
    window.notifications?.error(message, [
      { label: 'Spróbuj ponownie', handler: () => this.restartVoice() },
      { label: 'Zatrzymaj', handler: () => this.stopVoiceAgent() }
    ]);
    
    this.updateVoiceStatus('error');
  }

  async restartVoice() {
    await this.stopVoiceAgent();
    setTimeout(() => {
      if (this.currentAgent) {
        this.startVoiceAgent(this.currentAgent);
      }
    }, 1000);
  }

  updateVoiceStatus(status) {
    const statusElement = document.getElementById('voiceStatus');
    if (statusElement) {
      statusElement.textContent = this.getStatusText(status);
      statusElement.className = `voice-status status-${status}`;
    }
    
    // Update button states
    this.updateVoiceButtons(status);
  }

  getStatusText(status) {
    const texts = {
      'listening': '🎤 Słucham...',
      'processing': '🤔 Przetwarzam...',
      'speaking': '🔊 Mówię...',
      'stopped': '⏹️ Zatrzymany',
      'error': '❌ Błąd'
    };
    return texts[status] || status;
  }

  updateVoiceButtons(status) {
    const buttons = document.querySelectorAll('[data-voice-button]');
    buttons.forEach(button => {
      const isActive = button.dataset.agentType === this.currentAgent;
      button.classList.toggle('voice-active', isActive && status === 'listening');
      button.classList.toggle('voice-processing', isActive && status === 'processing');
      button.classList.toggle('voice-error', status === 'error');
    });
  }

  showVoiceInterface(agentType) {
    const voiceInterface = this.createVoiceInterface(agentType);
    document.body.appendChild(voiceInterface);
  }

  hideVoiceInterface() {
    const existing = document.getElementById('voiceInterface');
    if (existing) {
      existing.remove();
    }
  }

  createVoiceInterface(agentType) {
    const voiceInterface = document.createElement('div');
    voiceInterface.id = 'voiceInterface';
    voiceInterface.className = 'voice-interface fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-md z-50';
    
    voiceInterface.innerHTML = `
      <div class="voice-header flex justify-between items-center mb-3">
        <h3 class="font-bold text-lg">🎤 ${this.getAgentName(agentType)}</h3>
        <button onclick="window.voiceManager.stopVoiceAgent()" class="text-gray-500 hover:text-red-500">✕</button>
      </div>
      
      <div id="voiceStatus" class="voice-status mb-3 p-2 rounded bg-gray-100 text-center">
        Inicjalizacja...
      </div>
      
      <div id="voiceTranscript" class="voice-transcript max-h-40 overflow-y-auto mb-3 p-2 border rounded">
        <div class="text-gray-500 text-sm">Rozmowa rozpocznie się za chwilę...</div>
      </div>
      
      <div class="voice-controls flex gap-2">
        <button onclick="window.voiceManager.toggleMute()" class="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          🔇 Wycisz
        </button>
        <button onclick="window.voiceManager.restartVoice()" class="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          🔄 Uruchom ponownie
        </button>
      </div>
    `;
    
    return voiceInterface;
  }

  updateVoiceTranscript(text, type) {
    const transcriptElement = document.getElementById('voiceTranscript');
    if (!transcriptElement) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message mb-2 p-2 rounded`;
    messageElement.textContent = text;
    
    transcriptElement.appendChild(messageElement);
    transcriptElement.scrollTop = transcriptElement.scrollHeight;
  }

  toggleMute() {
    if (this.synthesis) {
      if (this.synthesis.speaking) {
        this.synthesis.pause();
        console.log('🔊 Speech paused');
      } else if (this.synthesis.paused) {
        this.synthesis.resume();
        console.log('🔊 Speech resumed');
      }
    }
  }
}

// Export VoiceManager class
export default VoiceManager;
export { VoiceManager };

// Initialize global instance
if (typeof window !== 'undefined') {
  window.VoiceManager = VoiceManager;
}
