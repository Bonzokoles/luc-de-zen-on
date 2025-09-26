/**
 * 🎤 Voice Command Agent - Web Speech API Implementation
 * TypeScript port of voice_command_agent.py with web compatibility
 */

import { BaseGoogleADKAgent } from '../types';
import type { AgentConfig, AgentResponse, VoiceCommand, SpeechRecognitionResult, TTSOptions } from '../types';

export interface VoiceCommandTypes {
  command: string;
  description: string;
  action: string;
  parameters?: Record<string, any>;
}

export class VoiceCommandAgent extends BaseGoogleADKAgent {
  private recognition: any | null = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private commands: Map<string, VoiceCommand> = new Map();
  private currentLanguage: string = 'pl-PL';
  
  constructor() {
    const config: AgentConfig = {
      agent_id: "voice_command_001",
      name: "Voice Command Agent",
      model: "web-speech-api",
      status: "ready",
      category: "utility",
      icon: "🎤",
      color: "#ff6b35",
      priority: "HIGH",
      description: "Agent do rozpoznawania i przetwarzania komend głosowych"
    };

    super(config);
    
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
    this.setupCommands();
    this.setupCapabilities();
  }

  async initialize(): Promise<void> {
    try {
      // Sprawdź dostępność Web Speech API
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Web Speech API nie jest dostępne w tej przeglądarce');
      }

      // Sprawdź dostępność Speech Synthesis API
      if (!('speechSynthesis' in window)) {
        throw new Error('Speech Synthesis API nie jest dostępne w tej przeglądarce');
      }

      this.config.status = 'ready';
      console.log('🎤 Voice Command Agent zainicjalizowany');
      
    } catch (error) {
      this.config.status = 'error';
      console.error('❌ Błąd inicjalizacji Voice Command Agent:', error);
      throw error;
    }
  }

  private initializeSpeechRecognition(): void {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = this.currentLanguage;
        
        this.recognition.onstart = () => {
          this.isListening = true;
          console.log('🎤 Rozpoczęto nasłuchiwanie...');
        };
        
        this.recognition.onend = () => {
          this.isListening = false;
          console.log('🔇 Zakończono nasłuchiwanie');
        };
        
        this.recognition.onresult = (event: any) => {
          const result = event.results[event.results.length - 1];
          if (result.isFinal) {
            const transcript = result[0].transcript.trim();
            const confidence = result[0].confidence;
            
            console.log(`🎯 Rozpoznano: "${transcript}" (pewność: ${(confidence * 100).toFixed(1)}%)`);
            void this.processVoiceCommand(transcript, confidence).catch((error) => {
              console.error('❌ Błąd obsługi komendy głosowej:', error);
            });
          }
        };
        
        this.recognition.onerror = (event: any) => {
          console.error('❌ Błąd rozpoznawania mowy:', event.error);
          this.isListening = false;
        };
      }
    } catch (error) {
      console.error('❌ Błąd inicjalizacji rozpoznawania mowy:', error);
    }
  }

  private setupCommands(): void {
    const commandList: VoiceCommand[] = [
      {
        command: "status",
        description: "Sprawdź status systemów",
        action: "check_system_status",
        confidence_threshold: 0.8
      },
      {
        command: "czas",
        description: "Podaj aktualny czas",
        action: "get_current_time",
        confidence_threshold: 0.7
      },
      {
        command: "pogoda",
        description: "Sprawdź pogodę",
        action: "get_weather",
        confidence_threshold: 0.7
      },
      {
        command: "otwórz gemini",
        description: "Aktywuj Gemini Pro Agent",
        action: "activate_gemini",
        confidence_threshold: 0.8
      },
      {
        command: "muzyka start",
        description: "Rozpocznij odtwarzanie muzyki",
        action: "start_music",
        confidence_threshold: 0.8
      },
      {
        command: "muzyka stop",
        description: "Zatrzymaj muzykę",
        action: "stop_music",
        confidence_threshold: 0.8
      },
      {
        command: "głośniej",
        description: "Zwiększ głośność",
        action: "volume_up",
        confidence_threshold: 0.7
      },
      {
        command: "ciszej",
        description: "Zmniejsz głośność",
        action: "volume_down",
        confidence_threshold: 0.7
      },
      {
        command: "pomoc",
        description: "Pokaż dostępne komendy",
        action: "show_help",
        confidence_threshold: 0.6
      },
      {
        command: "reset",
        description: "Zresetuj agenta",
        action: "reset_agent",
        confidence_threshold: 0.9
      }
    ];

    commandList.forEach(cmd => {
      this.commands.set(cmd.command.toLowerCase(), cmd);
    });
  }

  private setupCapabilities(): void {
    this.capabilities = [
      {
        name: "Rozpoznawanie mowy",
        description: "Konwersja mowy na tekst w czasie rzeczywistym",
        category: "speech",
        complexity: "advanced",
        examples: ["Aktywacja komend głosowych", "Dyktowanie tekstu"]
      },
      {
        name: "Synteza mowy",
        description: "Konwersja tekstu na mowę",
        category: "speech",
        complexity: "intermediate",
        examples: ["Odpowiedzi głosowe", "Odczytywanie komunikatów"]
      },
      {
        name: "Komendy systemowe",
        description: "Wykonywanie komend systemowych głosem",
        category: "control",
        complexity: "advanced",
        examples: ["Kontrola muzyki", "Sprawdzanie statusu", "Aktywacja agentów"]
      }
    ];
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const startTime = new Date();
    
    try {
      this.addToHistory({
        timestamp: startTime.toISOString(),
        type: 'input',
        content: message
      });

      // Sprawdź czy wiadomość to komenda głosowa
      const response = await this.processVoiceCommand(message, 1.0);
      
      const endTime = new Date();
      const responseTime = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.addToHistory({
        timestamp: endTime.toISOString(),
        type: 'output',
        content: response,
        response_time: responseTime
      });

      this.updateMetrics(responseTime, true);

      return {
        status: 'success',
        response,
        metadata: {
          agent: this.config.name,
          model: this.config.model,
          response_time: responseTime,
          timestamp: endTime.toISOString()
        }
      };

    } catch (error) {
      const endTime = new Date();
      const responseTime = (endTime.getTime() - startTime.getTime()) / 1000;
      
      this.updateMetrics(responseTime, false);
      
      return {
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async processVoiceCommand(transcript: string, confidence: number): Promise<string> {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Znajdź pasującą komendę
    let bestMatch: VoiceCommand | null = null;
    let bestScore = 0;

    for (const [commandText, command] of this.commands) {
      if (normalizedTranscript.includes(commandText)) {
        const score = confidence * (commandText.length / normalizedTranscript.length);
        if (score > bestScore && confidence >= (command.confidence_threshold || 0.7)) {
          bestMatch = command;
          bestScore = score;
        }
      }
    }

    if (bestMatch) {
      console.log(`🎯 Wykonuję komendę: ${bestMatch.command}`);
      return await this.executeCommand(bestMatch);
    } else {
      return `Nie rozpoznano komendy w: "${transcript}". Powiedz "pomoc" aby zobaczyć dostępne komendy.`;
    }
  }

  private async executeCommand(command: VoiceCommand): Promise<string> {
    switch (command.action) {
      case 'check_system_status':
        return await this.checkSystemStatus();
      
      case 'get_current_time':
        return await this.getCurrentTime();
      
      case 'get_weather':
        return await this.getWeather();
      
      case 'activate_gemini':
        return await this.activateGemini();
      
      case 'start_music':
        return await this.startMusic();
      
      case 'stop_music':
        return await this.stopMusic();
      
      case 'volume_up':
        return await this.adjustVolume(0.1);
      
      case 'volume_down':
        return await this.adjustVolume(-0.1);
      
      case 'show_help':
        return await this.showHelp();
      
      case 'reset_agent':
        return await this.resetAgent();
      
      default:
        return `Nieznana akcja: ${command.action}`;
    }
  }

  // Implementacje komend
  private async checkSystemStatus(): Promise<string> {
    const status = {
      voice_recognition: this.recognition ? 'aktywne' : 'niedostępne',
      speech_synthesis: this.synthesis ? 'aktywne' : 'niedostępne',
      is_listening: this.isListening,
      language: this.currentLanguage,
      commands_loaded: this.commands.size
    };

    const statusMessage = `Status systemu:
- Rozpoznawanie mowy: ${status.voice_recognition}
- Synteza mowy: ${status.speech_synthesis}
- Nasłuchiwanie: ${status.is_listening ? 'włączone' : 'wyłączone'}
- Język: ${status.language}
- Załadowane komendy: ${status.commands_loaded}`;

    await this.speak(statusMessage);
    return statusMessage;
  }

  private async getCurrentTime(): Promise<string> {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL');
    const dateString = now.toLocaleDateString('pl-PL');
    
    const message = `Aktualna godzina: ${timeString}, data: ${dateString}`;
    await this.speak(message);
    return message;
  }

  private async getWeather(): Promise<string> {
    // Symulacja sprawdzania pogody
    const message = "Sprawdzam aktualną pogodę...";
    await this.speak(message);
    return message;
  }

  private async activateGemini(): Promise<string> {
    const message = "Aktywuję Gemini Pro Agent";
    await this.speak(message);
    
    // Tu można dodać logikę aktywacji Gemini
    window.dispatchEvent(new CustomEvent('activateAgent', { 
      detail: { agentId: 'gemini_pro_001' }
    }));
    
    return message;
  }

  private async startMusic(): Promise<string> {
    const message = "Rozpoczynam odtwarzanie muzyki";
    await this.speak(message);
    
    // Tu można dodać integrację z music control agent
    window.dispatchEvent(new CustomEvent('musicControl', { 
      detail: { action: 'play' }
    }));
    
    return message;
  }

  private async stopMusic(): Promise<string> {
    const message = "Zatrzymuję muzykę";
    await this.speak(message);
    
    window.dispatchEvent(new CustomEvent('musicControl', { 
      detail: { action: 'stop' }
    }));
    
    return message;
  }

  private async adjustVolume(change: number): Promise<string> {
    const action = change > 0 ? 'zwiększam' : 'zmniejszam';
    const message = `${action} głośność`;
    
    await this.speak(message);
    
    window.dispatchEvent(new CustomEvent('musicControl', { 
      detail: { action: 'volume', change }
    }));
    
    return message;
  }

  private async showHelp(): Promise<string> {
    const commandsList = Array.from(this.commands.values())
      .map(cmd => `- "${cmd.command}": ${cmd.description}`)
      .join('\n');
    
    const message = `Dostępne komendy głosowe:\n${commandsList}`;
    await this.speak("Sprawdź ekran aby zobaczyć dostępne komendy");
    
    return message;
  }

  private async resetAgent(): Promise<string> {
    await this.reset();
    const message = "Agent został zresetowany";
    await this.speak(message);
    return message;
  }

  // Metody kontroli nasłuchiwania
  async startListening(): Promise<boolean> {
    if (!this.recognition) {
      throw new Error('Rozpoznawanie mowy nie jest dostępne');
    }

    if (this.isListening) {
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('❌ Błąd uruchomienia nasłuchiwania:', error);
      return false;
    }
  }

  async stopListening(): Promise<void> {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Synteza mowy
  async speak(text: string, options?: Partial<TTSOptions>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech Synthesis nie jest dostępne'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Ustawienia domyślne
      utterance.lang   = options?.language || this.currentLanguage;
      utterance.rate   = options?.rate   ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;
      utterance.pitch  = options?.pitch  ?? 1.0;      // Znajdź głos w wybranym języku
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(utterance.lang.substring(0, 2))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  // Gettery
  getIsListening(): boolean {
    return this.isListening;
  }

  getAvailableCommands(): VoiceCommand[] {
    return Array.from(this.commands.values());
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  async setLanguage(language: string): Promise<void> {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}