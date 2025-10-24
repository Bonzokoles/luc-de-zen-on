/**
 * Voice AI Worker Frontend Integration
 * Komunikacja z Voice AI Worker endpoints
 */

class VoiceAIAPI {
  constructor() {
    this.baseUrl = 'https://mybonzo.com/api/polaczek/voice-ai';
    this.endpoints = {
      health: '/health',
      transcribe: '/transcribe',
      synthesize: '/synthesize',
      analyze: '/analyze',
      command: '/command',
      realtime: '/realtime'
    };
  }

  // Sprawdź status Voice AI Worker
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.health}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Voice AI Health check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Transkrypcja audio na tekst
  async transcribeAudio(audioFile, options = {}) {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      if (options.language) formData.append('language', options.language);
      if (options.service) formData.append('service', options.service); // google, azure, openai
      
      const response = await fetch(`${this.baseUrl}${this.endpoints.transcribe}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Audio transcription failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Synteza mowy z tekstu
  async synthesizeText(text, options = {}) {
    try {
      const body = {
        text,
        voice: options.voice || 'pl-PL-Standard-A',
        language: options.language || 'pl-PL',
        service: options.service || 'google',
        format: options.format || 'mp3'
      };

      const response = await fetch(`${this.baseUrl}${this.endpoints.synthesize}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return { success: true, audioUrl, blob: audioBlob };
    } catch (error) {
      console.error('Text synthesis failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Analiza dźwięku
  async analyzeAudio(audioFile) {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      const response = await fetch(`${this.baseUrl}${this.endpoints.analyze}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Audio analysis failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Przetwarzanie komend głosowych
  async processVoiceCommand(audioFile, context = {}) {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('context', JSON.stringify(context));
      
      const response = await fetch(`${this.baseUrl}${this.endpoints.command}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Voice command processing failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Połączenie WebSocket dla real-time
  connectRealtime(onMessage, onError) {
    try {
      const wsUrl = this.baseUrl.replace('https://', 'wss://') + this.endpoints.realtime;
      const ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };
      
      return ws;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      if (onError) onError(error);
      return null;
    }
  }
}

// Voice AI Interface dla popup interactions
class VoiceAIInterface {
  constructor() {
    this.api = new VoiceAIAPI();
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  // Szybka transkrypcja z mikrofonem
  async quickTranscribe() {
    try {
      if (!this.isRecording) {
        // Rozpocznij nagrywanie
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        
        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          const result = await this.api.transcribeAudio(audioBlob);
          
          if (result.success) {
            this.showNotification('Transkrypcja: ' + result.data.text, 'success');
            return result.data.text;
          } else {
            this.showNotification('Błąd transkrypcji: ' + result.error, 'error');
          }
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        this.showNotification('Nagrywanie rozpoczęte...', 'info');
        
        // Auto-stop po 30 sekundach
        setTimeout(() => {
          if (this.isRecording) this.stopRecording();
        }, 30000);
        
      } else {
        // Zatrzymaj nagrywanie
        this.stopRecording();
      }
    } catch (error) {
      console.error('Quick transcribe error:', error);
      this.showNotification('Błąd dostępu do mikrofonu', 'error');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.showNotification('Nagrywanie zatrzymane', 'info');
    }
  }

  // Szybka synteza tekstu
  async quickSynthesize(text) {
    if (!text || text.trim().length === 0) {
      this.showNotification('Wprowadź tekst do syntezy', 'warning');
      return;
    }

    try {
      this.showNotification('Generowanie audio...', 'info');
      const result = await this.api.synthesizeText(text);
      
      if (result.success) {
        // Odtwórz wygenerowane audio
        const audio = new Audio(result.audioUrl);
        audio.play();
        this.showNotification('Audio wygenerowane i odtworzone', 'success');
        return result;
      } else {
        this.showNotification('Błąd syntezy: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Quick synthesize error:', error);
      this.showNotification('Błąd syntezy mowy', 'error');
    }
  }

  // Pokaż powiadomienie
  showNotification(message, type = 'info') {
    // Używa systemu powiadomień z głównej strony
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Health check z wyświetlaniem statusu
  async checkStatus() {
    try {
      this.showNotification('Sprawdzanie statusu Voice AI...', 'info');
      const result = await this.api.checkHealth();
      
      if (result.success) {
        const status = `Voice AI: ${result.data.status || 'OK'}, Wersja: ${result.data.version || '1.0.0'}`;
        this.showNotification(status, 'success');
        return result.data;
      } else {
        this.showNotification('Voice AI niedostępny: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Status check error:', error);
      this.showNotification('Błąd sprawdzania statusu', 'error');
    }
  }
}

// Export klas
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VoiceAIAPI, VoiceAIInterface };
} else if (typeof window !== 'undefined') {
  window.VoiceAIAPI = VoiceAIAPI;
  window.VoiceAIInterface = VoiceAIInterface;
}

// ES6 Module exports for dynamic import compatibility
export { VoiceAIAPI, VoiceAIInterface };
