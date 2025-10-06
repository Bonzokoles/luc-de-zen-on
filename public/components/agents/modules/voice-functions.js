// Voice Agent Functions - MyBonzo Voice Command System
// Version: 1.0.0

class VoiceAgent {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.commands = new Map();
    this.config = {
      language: 'pl-PL',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1
    };
    
    this.initializeCommands();
    this.setupSpeechRecognition();
  }

  // Initialize voice commands
  initializeCommands() {
    this.commands.set('mybonzo', () => this.handleWakeWord());
    this.commands.set('asystent', () => this.handleWakeWord());
    this.commands.set('otwórz menu', () => this.openMenu());
    this.commands.set('zamknij aplikację', () => this.closeApp());
    this.commands.set('pokaż pomoc', () => this.showHelp());
    this.commands.set('stop', () => this.stopListening());
    this.commands.set('koniec', () => this.stopListening());
  }

  // Setup Speech Recognition
  setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      Object.assign(this.recognition, this.config);
      
      this.recognition.onstart = () => this.onRecognitionStart();
      this.recognition.onresult = (event) => this.onRecognitionResult(event);
      this.recognition.onerror = (event) => this.onRecognitionError(event);
      this.recognition.onend = () => this.onRecognitionEnd();
      
      return true;
    }
    return false;
  }

  // Start listening
  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      return true;
    }
    return false;
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.speak('Zatrzymuję nasłuchiwanie.');
      return true;
    }
    return false;
  }

  // Process recognized speech
  processCommand(transcript) {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    for (const [command, handler] of this.commands) {
      if (normalizedTranscript.includes(command)) {
        handler();
        this.logCommand(command, transcript);
        return true;
      }
    }
    
    this.handleUnknownCommand(transcript);
    return false;
  }

  // Event handlers
  onRecognitionStart() {
    this.isListening = true;
    this.updateStatus('listening');
    console.log('Voice recognition started');
  }

  onRecognitionResult(event) {
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

    this.updateTranscript(finalTranscript, interimTranscript);

    if (finalTranscript) {
      this.processCommand(finalTranscript);
    }
  }

  onRecognitionError(event) {
    console.error('Speech recognition error:', event.error);
    this.updateStatus('error');
    this.isListening = false;
  }

  onRecognitionEnd() {
    this.isListening = false;
    this.updateStatus('ready');
    console.log('Voice recognition ended');
  }

  // Command handlers
  handleWakeWord() {
    this.speak('Tak, słucham. W czym mogę pomóc?');
    this.updateStatus('active');
  }

  openMenu() {
    this.speak('Otwieramy główne menu aplikacji.');
    // Navigate to main menu
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  closeApp() {
    this.speak('Zamykam aplikację.');
    // Close or navigate away
    if (typeof window !== 'undefined') {
      window.close();
    }
  }

  showHelp() {
    this.speak('Wyświetlam panel pomocy z dostępnymi komendami.');
    this.displayHelpPanel();
  }

  handleUnknownCommand(transcript) {
    this.speak('Nie rozpoznałem tej komendy. Spróbuj ponownie.');
    console.log('Unknown command:', transcript);
  }

  // Text-to-speech
  speak(text, options = {}) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'pl-PL';
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 0.8;
      
      this.synthesis.speak(utterance);
      return true;
    }
    return false;
  }

  // UI Updates
  updateStatus(status) {
    const statusElement = document.getElementById('voiceStatus');
    const statusText = document.getElementById('statusText');
    
    if (statusElement && statusText) {
      switch (status) {
        case 'listening':
          statusElement.textContent = 'NASŁUCHUJE';
          statusElement.className = 'text-[#ff6b35]';
          statusText.textContent = 'Mówię...';
          break;
        case 'active':
          statusElement.textContent = 'AKTYWNY';
          statusElement.className = 'text-[#00ff88]';
          statusText.textContent = 'Komenda rozpoznana!';
          break;
        case 'error':
          statusElement.textContent = 'BŁĄD';
          statusElement.className = 'text-[#ff4444]';
          statusText.textContent = 'Wystąpił błąd rozpoznawania';
          break;
        default:
          statusElement.textContent = 'GOTOWY';
          statusElement.className = 'text-[#00ff88]';
          statusText.textContent = 'Kliknij aby rozpocząć nasłuchiwanie';
      }
    }
  }

  updateTranscript(finalText, interimText) {
    const outputElement = document.getElementById('speechOutput');
    if (outputElement) {
      outputElement.innerHTML = finalText + 
        '<span class="text-[#ff6b35]/60">' + interimText + '</span>';
    }
  }

  logCommand(command, transcript) {
    const historyElement = document.getElementById('commandHistory');
    if (historyElement) {
      const historyItem = document.createElement('div');
      historyItem.className = 'text-[#e1f5fe] text-sm mb-2 p-2 bg-[#ff6b35]/10 rounded border border-[#ff6b35]/20';
      historyItem.innerHTML = `
        <span class="text-[#ff6b35] font-mono">${new Date().toLocaleTimeString()}</span>
        <br>
        Komenda: "${command}" | Transkrypcja: "${transcript}"
      `;
      
      if (historyElement.firstChild?.textContent === 'Brak wykonanych komend') {
        historyElement.innerHTML = '';
      }
      historyElement.insertBefore(historyItem, historyElement.firstChild);
    }
    
    // Update command counter
    const commandCount = document.getElementById('commandCount');
    if (commandCount) {
      const currentCount = parseInt(commandCount.textContent) || 0;
      commandCount.textContent = (currentCount + 1).toString();
    }
  }

  displayHelpPanel() {
    // Create and show help modal
    const helpModal = document.createElement('div');
    helpModal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
    helpModal.innerHTML = `
      <div class="bg-[#0f3846] border border-[#ff6b35]/20 rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-[#ff6b35] text-xl font-bold mb-4">Dostępne komendy głosowe</h3>
        <ul class="text-[#e1f5fe] space-y-2 text-sm">
          <li>• "mybonzo" / "asystent" - aktywacja</li>
          <li>• "otwórz menu" - główne menu</li>
          <li>• "zamknij aplikację" - zamknięcie</li>
          <li>• "pokaż pomoc" - ten panel</li>
          <li>• "stop" / "koniec" - zatrzymanie</li>
        </ul>
        <button onclick="this.parentElement.parentElement.remove()" 
                class="mt-4 px-4 py-2 bg-[#ff6b35] text-white rounded hover:bg-[#e55a2e] transition-colors">
          Zamknij
        </button>
      </div>
    `;
    document.body.appendChild(helpModal);
  }

  // Get current status
  getStatus() {
    return {
      isListening: this.isListening,
      isSupported: !!this.recognition,
      language: this.config.language,
      commandsCount: this.commands.size
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VoiceAgent;
} else if (typeof window !== 'undefined') {
  window.VoiceAgent = VoiceAgent;
}