// voice-functions.js - Funkcje dla Voice Agent
// Wszystkie funkcje związane z zarządzaniem głosem i syntezą mowy

class VoiceAgentFunctions {
  constructor() {
    this.isRecording = false;
    this.recognition = null;
    this.synthesis = null;
    this.currentVoice = null;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') {
      console.warn("🎙️ Voice Agent Functions initialized outside of a browser; skipping setup.");
      return;
    }

    console.log("🎙️ Initializing Voice Agent Functions...");
    this.synthesis = window.speechSynthesis || null;
    this.setupSpeechRecognition();
    this.setupSpeechSynthesis();
    
    // Integracja z przyciskami po prawej stronie
    this.bindToRightPanel();
  }

  bindToRightPanel() {
    // Podłącz funkcje do global scope dla prawego panelu
    window.voiceAgent = this;
    
    // Toggle voice agent widget
    window.toggleVoiceAgent = () => this.toggleWidget();
    window.processVoiceCommand = () => this.processCommand();
    window.synthesizeVoice = () => this.synthesizeText();
    window.clearVoiceAgent = () => this.clearAgent();
    window.startVoiceRecording = () => this.startRecording();
    window.stopVoiceRecording = () => this.stopRecording();
    window.playVoiceResponse = () => this.playResponse();
    
    console.log("🎙️ Voice Agent bound to right panel");
  }

  toggleWidget() {
    console.log("🎙️ Toggle Voice Agent Widget");
    
    // Znajdź lub stwórz widget
    let widget = document.getElementById('voiceAgentPanel');
    const button = document.getElementById('voiceAgentBtn');
    
    if (!widget) {
      // Stwórz nowy widget
      widget = this.createWidget();
      document.body.appendChild(widget);
    }
    
    // Toggle widoczności
    if (widget.style.display === 'none' || !widget.style.display) {
      widget.style.display = 'block';
      if (button) button.style.background = 'linear-gradient(45deg, #ff6b9d, #4ade80)';
      console.log("🎙️ Voice Agent Panel opened");
    } else {
      widget.style.display = 'none';
      if (button) button.style.background = '';
      console.log("🎙️ Voice Agent Panel closed");
    }
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.id = 'voiceAgentPanel';
    widget.className = 'agent-panel';
    widget.innerHTML = `
      <div class="agent-panel-header">
        <span>🎙️ VOICE COMMAND AGENT</span>
        <button onclick="window.voiceAgent.toggleWidget()" class="close-btn">×</button>
      </div>
      <div class="agent-panel-content">
        <div class="agent-controls">
          <button onclick="window.voiceAgent.startRecording()" class="agent-btn primary">🎤 Nagrywaj</button>
          <button onclick="window.voiceAgent.stopRecording()" class="agent-btn secondary">⏹ Stop</button>
          <button onclick="window.voiceAgent.playResponse()" class="agent-btn accent">🔊 Odtwórz</button>
        </div>
        <textarea id="voiceInput" placeholder="Wpisz komendy głosowe lub tekst do syntezy..." class="agent-input"></textarea>
        <div class="agent-actions">
          <button onclick="window.voiceAgent.processCommand()" class="agent-btn primary">🎯 Wykonaj</button>
          <button onclick="window.voiceAgent.synthesizeText()" class="agent-btn accent">🗣️ Synteza</button>
          <button onclick="window.voiceAgent.clearAgent()" class="agent-btn secondary">🧹 Wyczyść</button>
        </div>
        <div id="voiceResponse" class="agent-response" style="display:none;"></div>
      </div>
    `;
    
    // Style inline dla widgetu
    widget.style.cssText = `
      position: fixed;
      right: 20px;
      top: 120px;
      width: 350px;
      max-height: 500px;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid #ff6b9d;
      border-radius: 8px;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 8px 32px rgba(255, 107, 157, 0.3);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: none;
      overflow-y: auto;
    `;
    
    return widget;
  }

  processCommand() {
    console.log("🎙️ Processing voice command");
    const input = document.getElementById('voiceInput');
    const response = document.getElementById('voiceResponse');
    
    if (input && response) {
      const command = input.value.trim();
      if (command) {
        response.style.display = 'block';
        response.innerHTML = `<strong>🎯 Przetwarzanie komendy:</strong><br>"${command}"<br><br>✅ Status: Wykonano pomyślnie`;
        console.log(`Executed voice command: ${command}`);
      }
    }
  }

  synthesizeText() {
    console.log("🎙️ Synthesizing voice");
    const input = document.getElementById('voiceInput');
    const response = document.getElementById('voiceResponse');
    
    if (input && response) {
      const text = input.value.trim();
      if (text && this.synthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pl-PL';
        utterance.rate = 1;
        utterance.pitch = 1;
        
        this.synthesis.speak(utterance);
        
        response.style.display = 'block';
        response.innerHTML = `<strong>🗣️ Synteza mowy:</strong><br>"${text}"<br><br>🔊 Odtwarzanie w toku...`;
      }
    }
  }

  clearAgent() {
    console.log("🎙️ Clearing voice agent");
    const input = document.getElementById('voiceInput');
    const response = document.getElementById('voiceResponse');
    
    if (input) input.value = '';
    if (response) {
      response.innerHTML = '';
      response.style.display = 'none';
    }
  }

  startRecording() {
    console.log("🎤 Starting voice recording");
    if (this.recognition && !this.isRecording) {
      this.isRecording = true;
      this.recognition.start();
      
      const response = document.getElementById('voiceResponse');
      if (response) {
        response.style.display = 'block';
        response.innerHTML = '<strong>🎤 Nagrywanie...</strong><br>Mów teraz, słucham...';
      }
    }
  }

  stopRecording() {
    console.log("⏹ Stopping voice recording");
    if (this.recognition && this.isRecording) {
      this.isRecording = false;
      this.recognition.stop();
      
      const response = document.getElementById('voiceResponse');
      if (response) {
        response.innerHTML = '<strong>⏹ Nagrywanie zatrzymane</strong><br>Przetwarzanie...';
      }
    }
  }

  playResponse() {
    console.log("🔊 Playing voice response");
    const response = document.getElementById('voiceResponse');
    if (response) {
      response.style.display = 'block';
      response.innerHTML = '<strong>🔊 Odtwarzanie odpowiedzi</strong><br>Audio feedback aktywny';
    }
  }

  setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'pl-PL';

      this.recognition.onstart = () => {
        console.log("🎤 Voice recognition started");
        this.updateVoiceStatus("Nagrywanie...");
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        document.getElementById('voiceAgentInput').value = transcript;
        this.displayVoiceResult(transcript);
      };

      this.recognition.onerror = (event) => {
        console.error("❌ Voice recognition error:", event.error);
        this.updateVoiceStatus("Błąd");
      };

      this.recognition.onend = () => {
        console.log("🛑 Voice recognition ended");
        this.updateVoiceStatus("Gotowy");
        this.isRecording = false;
      };
    } else {
      console.warn("⚠️ Speech recognition not supported");
    }
  }

  setupSpeechSynthesis() {
    if (this.synthesis) {
      // Czekaj na załadowanie głosów
      setTimeout(() => {
        const voices = this.synthesis.getVoices();
        const polishVoice = voices.find(voice => voice.lang.includes('pl'));
        this.currentVoice = polishVoice || voices[0];
        console.log("🗣️ Speech synthesis ready with voice:", this.currentVoice?.name);
      }, 100);
    }
  }

  // Funkcje exportowane globalnie
  startVoiceRecording() {
    console.log("▶ Starting voice recording...");
    
    if (!this.recognition) {
      this.showVoiceError("Speech recognition not supported");
      return;
    }

    if (this.isRecording) {
      console.warn("⚠️ Already recording");
      return;
    }

    try {
      this.isRecording = true;
      this.recognition.start();
      this.updateVoiceStatus("Słucham...");
    } catch (error) {
      console.error("❌ Error starting recording:", error);
      this.isRecording = false;
    }
  }

  stopVoiceRecording() {
    console.log("⏹ Stopping voice recording...");
    
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      this.updateVoiceStatus("Gotowy");
    }
  }

  processVoiceCommand() {
    const input = document.getElementById('voiceAgentInput').value.trim();
    
    if (!input) {
      this.showVoiceError("Brak tekstu do przetworzenia");
      return;
    }

    console.log("🔄 Processing voice command:", input);
    this.displayVoiceResult(`Przetwarzanie: "${input}"`);

    // Tu można dodać integrację z AI API
    // Na razie symulujemy odpowiedź
    setTimeout(() => {
      this.displayVoiceResult(`Wykonano komendę: "${input}"`);
    }, 1000);
  }

  synthesizeVoice() {
    const input = document.getElementById('voiceAgentInput').value.trim();
    
    if (!input) {
      this.showVoiceError("Brak tekstu do syntezy");
      return;
    }

    if (!this.synthesis) {
      this.showVoiceError("Speech synthesis not supported");
      return;
    }

    console.log("🔊 Synthesizing voice:", input);
    
    const utterance = new SpeechSynthesisUtterance(input);
    if (this.currentVoice) {
      utterance.voice = this.currentVoice;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      this.updateVoiceStatus("Odtwarzanie...");
    };

    utterance.onend = () => {
      this.updateVoiceStatus("Gotowy");
    };

    utterance.onerror = (error) => {
      console.error("❌ Synthesis error:", error);
      this.updateVoiceStatus("Błąd");
    };

    this.synthesis.speak(utterance);
  }

  playVoiceResponse() {
    const response = document.getElementById('voiceAgentResponse');
    if (response && !response.classList.contains('hidden')) {
      const text = response.textContent.trim();
      if (text) {
        // Temporarily set input to response text for synthesis
        const originalInput = document.getElementById('voiceAgentInput').value;
        document.getElementById('voiceAgentInput').value = text;
        this.synthesizeVoice();
        document.getElementById('voiceAgentInput').value = originalInput;
      }
    }
  }

  clearVoiceAgent() {
    console.log("🧹 Clearing voice agent...");
    
    document.getElementById('voiceAgentInput').value = '';
    
    const response = document.getElementById('voiceAgentResponse');
    if (response) {
      response.textContent = '';
      response.style.display = 'none';
    }

    if (this.isRecording) {
      this.stopVoiceRecording();
    }

    if (this.synthesis) {
      this.synthesis.cancel();
    }

    this.updateVoiceStatus("Gotowy");
  }

  toggleVoiceMode() {
    // Toggle between different voice modes
    const modes = ['Gotowy', 'Aktywny', 'Nasłuchuje'];
    const currentBtn = document.getElementById('voiceStatusBtn');
    if (currentBtn) {
      const currentMode = currentBtn.textContent;
      const currentIndex = modes.indexOf(currentMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      currentBtn.textContent = modes[nextIndex];
      
      console.log(`🔄 Voice mode changed to: ${modes[nextIndex]}`);
    }
  }

  // Pomocnicze funkcje
  updateVoiceStatus(status) {
    const statusBtn = document.getElementById('voiceStatusBtn');
    if (statusBtn) {
      statusBtn.textContent = status;
    }
  }

  displayVoiceResult(text) {
    const response = document.getElementById('voiceAgentResponse');
    if (response) {
      response.textContent = text;
      response.style.display = 'block';
    }
  }

  showVoiceError(message) {
    console.error("❌ Voice Agent Error:", message);
    this.displayVoiceResult(`Błąd: ${message}`);
  }
}

// Inicjalizacja i export
const voiceAgent = new VoiceAgentFunctions();

if (typeof window !== 'undefined') {
  // Export funkcji do globalnego scope
  window.startVoiceRecording = () => voiceAgent.startVoiceRecording();
  window.stopVoiceRecording = () => voiceAgent.stopVoiceRecording();
  window.processVoiceCommand = () => voiceAgent.processVoiceCommand();
  window.synthesizeVoice = () => voiceAgent.synthesizeVoice();
  window.playVoiceResponse = () => voiceAgent.playVoiceResponse();
  window.clearVoiceAgent = () => voiceAgent.clearVoiceAgent();
  window.toggleVoiceMode = () => voiceAgent.toggleVoiceMode();

  console.log("✅ Voice Agent Functions loaded and exported globally");
}

export { VoiceAgentFunctions };
export default VoiceAgentFunctions;