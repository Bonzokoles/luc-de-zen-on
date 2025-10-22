// Voice AI Service - Zarządzanie syntezą mowy dla wszystkich agentów AI
// Obsługa wielu providerów (ElevenLabs, Azure, Google, OpenAI, AWS Polly)

import { voiceConfigManager, type VoiceProfile, type AgentVoiceMapping } from './voice-ai-config';

export interface VoiceRequest {
  text: string;
  agentId: string;
  context?: 'greeting' | 'response' | 'error' | 'notification';
  language?: string;
  priority?: number; // 1-10
  sessionId?: string;
  userId?: string;
}

export interface VoiceResponse {
  audioUrl: string;
  audioBuffer?: ArrayBuffer;
  duration: number; // seconds
  cost: number; // USD
  provider: string;
  voiceId: string;
  characters: number;
  requestId: string;
  timestamp: string;
}

export interface VoiceQueueItem extends VoiceRequest {
  id: string;
  timestamp: string;
  attempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export class VoiceAIService {
  private queue: VoiceQueueItem[] = [];
  private processing = false;
  private readonly MAX_CONCURRENT = 3;
  private activeRequests = 0;

  constructor() {
    this.startQueueProcessor();
  }

  /**
   * Główna metoda do konwersji tekstu na mowę
   */
  async textToSpeech(request: VoiceRequest): Promise<VoiceResponse> {
    // Walidacja długości tekstu
    const maxLength = voiceConfigManager.getConfiguration().globalSettings.maxTextLength;
    if (request.text.length > maxLength) {
      throw new Error(`Text too long. Maximum ${maxLength} characters allowed.`);
    }

    // Pobierz odpowiedni profil głosowy
    const voiceProfile = voiceConfigManager.getVoiceForAgent(request.agentId, request.context);
    if (!voiceProfile) {
      throw new Error(`No voice profile found for agent: ${request.agentId}`);
    }

    console.log(`🎤 TTS Request for ${request.agentId}: "${request.text.substring(0, 50)}..."`);

    // Wybierz provider i wykonaj syntezę
    switch (voiceProfile.provider) {
      case 'elevenlabs':
        return await this.synthesizeWithElevenLabs(request.text, voiceProfile, request);
      case 'azure':
        return await this.synthesizeWithAzure(request.text, voiceProfile, request);
      case 'google':
        return await this.synthesizeWithGoogle(request.text, voiceProfile, request);
      case 'openai':
        return await this.synthesizeWithOpenAI(request.text, voiceProfile, request);
      case 'polly':
        return await this.synthesizeWithPolly(request.text, voiceProfile, request);
      default:
        throw new Error(`Unsupported voice provider: ${voiceProfile.provider}`);
    }
  }

  /**
   * Dodaj żądanie do kolejki (dla requestów o niskim priorytecie)
   */
  async queueTextToSpeech(request: VoiceRequest): Promise<string> {
    const queueItem: VoiceQueueItem = {
      ...request,
      id: `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      attempts: 0,
      status: 'pending'
    };

    this.queue.push(queueItem);
    console.log(`📝 Added TTS request to queue: ${queueItem.id}`);

    return queueItem.id;
  }

  /**
   * ElevenLabs synthesis
   */
  private async synthesizeWithElevenLabs(text: string, profile: VoiceProfile, request: VoiceRequest): Promise<VoiceResponse> {
    const config = voiceConfigManager.getConfiguration().providers.elevenlabs;
    
    if (!config.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const startTime = Date.now();
    const requestId = `el_${Date.now()}`;

    try {
      const response = await fetch(`${config.baseUrl}/text-to-speech/${profile.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': config.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: config.model,
          voice_settings: {
            stability: profile.settings.stability,
            similarity_boost: profile.settings.clarity,
            style: profile.settings.emotionalRange,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const duration = this.estimateAudioDuration(text, profile.settings.speed);
      const cost = text.length * profile.costPerCharacter;

      // W rzeczywistej implementacji zapisz audio do storage (S3, CloudFlare R2, etc.)
      const audioUrl = await this.saveAudioToStorage(audioBuffer, requestId, 'mp3');

      console.log(`✅ ElevenLabs TTS completed: ${duration.toFixed(1)}s, $${cost.toFixed(4)}`);

      return {
        audioUrl,
        audioBuffer,
        duration,
        cost,
        provider: 'elevenlabs',
        voiceId: profile.voiceId,
        characters: text.length,
        requestId,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      console.error(`❌ ElevenLabs TTS failed:`, error);
      throw new Error(`ElevenLabs synthesis failed: ${error.message}`);
    }
  }

  /**
   * Azure Speech synthesis
   */
  private async synthesizeWithAzure(text: string, profile: VoiceProfile, request: VoiceRequest): Promise<VoiceResponse> {
    const config = voiceConfigManager.getConfiguration().providers.azure;
    
    if (!config.subscriptionKey) {
      throw new Error('Azure Speech key not configured');
    }

    const requestId = `az_${Date.now()}`;
    const ssml = this.buildSSML(text, profile);

    try {
      const response = await fetch(`${config.endpoint}cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': config.subscriptionKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'MyBonzo-VoiceAI'
        },
        body: ssml
      });

      if (!response.ok) {
        throw new Error(`Azure Speech API error: ${response.status} - ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const duration = this.estimateAudioDuration(text, profile.settings.speed);
      const cost = text.length * profile.costPerCharacter;

      const audioUrl = await this.saveAudioToStorage(audioBuffer, requestId, 'mp3');

      console.log(`✅ Azure TTS completed: ${duration.toFixed(1)}s, $${cost.toFixed(4)}`);

      return {
        audioUrl,
        audioBuffer,
        duration,
        cost,
        provider: 'azure',
        voiceId: profile.voiceId,
        characters: text.length,
        requestId,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      console.error(`❌ Azure TTS failed:`, error);
      throw new Error(`Azure synthesis failed: ${error.message}`);
    }
  }

  /**
   * OpenAI TTS synthesis
   */
  private async synthesizeWithOpenAI(text: string, profile: VoiceProfile, request: VoiceRequest): Promise<VoiceResponse> {
    const config = voiceConfigManager.getConfiguration().providers.openai;
    
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestId = `oai_${Date.now()}`;

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          input: text,
          voice: profile.voiceId, // alloy, echo, fable, onyx, nova, shimmer
          speed: profile.settings.speed
        })
      });

      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const duration = this.estimateAudioDuration(text, profile.settings.speed);
      const cost = text.length * profile.costPerCharacter;

      const audioUrl = await this.saveAudioToStorage(audioBuffer, requestId, 'mp3');

      console.log(`✅ OpenAI TTS completed: ${duration.toFixed(1)}s, $${cost.toFixed(4)}`);

      return {
        audioUrl,
        audioBuffer,
        duration,
        cost,
        provider: 'openai',
        voiceId: profile.voiceId,
        characters: text.length,
        requestId,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      console.error(`❌ OpenAI TTS failed:`, error);
      throw new Error(`OpenAI synthesis failed: ${error.message}`);
    }
  }

  /**
   * Google Cloud TTS (placeholder)
   */
  private async synthesizeWithGoogle(text: string, profile: VoiceProfile, request: VoiceRequest): Promise<VoiceResponse> {
    // Implementacja Google Cloud Text-to-Speech
    throw new Error('Google Cloud TTS not implemented yet');
  }

  /**
   * AWS Polly TTS (placeholder)
   */
  private async synthesizeWithPolly(text: string, profile: VoiceProfile, request: VoiceRequest): Promise<VoiceResponse> {
    // Implementacja AWS Polly
    throw new Error('AWS Polly TTS not implemented yet');
  }

  /**
   * Buduje SSML dla Azure
   */
  private buildSSML(text: string, profile: VoiceProfile): string {
    const pitch = profile.settings.pitch >= 0 ? `+${profile.settings.pitch}Hz` : `${profile.settings.pitch}Hz`;
    const rate = profile.settings.speed;

    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${profile.language}">
        <voice name="${profile.voiceId}">
          <prosody rate="${rate}" pitch="${pitch}" volume="${profile.settings.volume}">
            ${text}
          </prosody>
        </voice>
      </speak>
    `.trim();
  }

  /**
   * Oszacowanie długości audio na podstawie tekstu i prędkości
   */
  private estimateAudioDuration(text: string, speed: number): number {
    // Średnio 150 słów na minutę dla normalnej prędkości
    const wordsPerMinute = 150 * speed;
    const words = text.split(/\s+/).length;
    return (words / wordsPerMinute) * 60;
  }

  /**
   * Zapisuje audio do storage (placeholder)
   */
  private async saveAudioToStorage(audioBuffer: ArrayBuffer, requestId: string, format: string): Promise<string> {
    // W rzeczywistej implementacji użyj CloudFlare R2, AWS S3, lub Azure Blob Storage
    // Tutaj zwracamy placeholder URL
    return `https://voice-storage.mybonzo.com/audio/${requestId}.${format}`;
  }

  /**
   * Procesor kolejki TTS
   */
  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.processing || this.activeRequests >= this.MAX_CONCURRENT) {
        return;
      }

      const pendingItems = this.queue.filter(item => item.status === 'pending');
      if (pendingItems.length === 0) {
        return;
      }

      // Sortuj według priorytetu
      pendingItems.sort((a, b) => (b.priority || 5) - (a.priority || 5));
      
      const item = pendingItems[0];
      await this.processQueueItem(item);
    }, 1000);
  }

  /**
   * Przetwarza pojedynczy element kolejki
   */
  private async processQueueItem(item: VoiceQueueItem): Promise<void> {
    if (this.activeRequests >= this.MAX_CONCURRENT) {
      return;
    }

    this.activeRequests++;
    item.status = 'processing';
    item.attempts++;

    try {
      const result = await this.textToSpeech({
        text: item.text,
        agentId: item.agentId,
        context: item.context,
        language: item.language,
        priority: item.priority,
        sessionId: item.sessionId,
        userId: item.userId
      });

      item.status = 'completed';
      console.log(`✅ Queue item ${item.id} completed`);

      // Emit event lub callback dla powiadomienia o zakończeniu
      this.notifyQueueCompletion(item.id, result);

    } catch (error: any) {
      console.error(`❌ Queue item ${item.id} failed:`, error);
      
      if (item.attempts < 3) {
        item.status = 'pending'; // Retry
      } else {
        item.status = 'failed';
      }
    } finally {
      this.activeRequests--;
    }
  }

  /**
   * Powiadomienie o zakończeniu przetwarzania kolejki
   */
  private notifyQueueCompletion(queueId: string, result: VoiceResponse): void {
    // Emit custom event lub wywołaj callback
    console.log(`🎵 TTS Queue ${queueId} completed:`, result.audioUrl);
  }

  /**
   * Pobiera status kolejki
   */
  getQueueStatus(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  } {
    return {
      pending: this.queue.filter(item => item.status === 'pending').length,
      processing: this.queue.filter(item => item.status === 'processing').length,
      completed: this.queue.filter(item => item.status === 'completed').length,
      failed: this.queue.filter(item => item.status === 'failed').length,
      total: this.queue.length
    };
  }

  /**
   * Czyszczenie zakończonych zadań z kolejki
   */
  cleanupQueue(): void {
    const before = this.queue.length;
    this.queue = this.queue.filter(item => 
      item.status === 'pending' || item.status === 'processing'
    );
    const cleaned = before - this.queue.length;
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} completed/failed items from TTS queue`);
    }
  }
}

// Singleton instance
export const voiceAIService = new VoiceAIService();