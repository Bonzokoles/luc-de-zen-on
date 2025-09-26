// voice-functions.js - Funkcje dla Voice Agent
// Wszystkie funkcje związane z zarządzaniem głosem i syntezą mowy

class VoiceAgentFunctions {
  constructor() {
    this.isRecording = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.currentVoice = null;
    this.init();
  }

  init() {
    console.log("🎙️ Initializing Voice Agent Functions...");
    this.setupSpeechRecognition();
    this.setupSpeechSynthesis();
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

// Export funkcji do globalnego scope
window.startVoiceRecording = () => voiceAgent.startVoiceRecording();
window.stopVoiceRecording = () => voiceAgent.stopVoiceRecording();
window.processVoiceCommand = () => voiceAgent.processVoiceCommand();
window.synthesizeVoice = () => voiceAgent.synthesizeVoice();
window.playVoiceResponse = () => voiceAgent.playVoiceResponse();
window.clearVoiceAgent = () => voiceAgent.clearVoiceAgent();
window.toggleVoiceMode = () => voiceAgent.toggleVoiceMode();

console.log("✅ Voice Agent Functions loaded and exported globally");

export default voiceAgent;