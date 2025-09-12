/**
 * Cloudflare Voice AI - Simplified for MyBonzo Platform
 * Based on ShadFlareAi implementation, adapted for Astro + React Island
 */

interface VoiceAIConfig {
  model: string;
  voice: string;
  language: string;
  enableRealtime: boolean;
  latencyTarget?: number;
}

interface VoiceMetrics {
  volume: number;
  rms: number;
  peak: number;
  voiceActive: boolean;
  latency: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  timestamp: number;
}

export class CloudflareVoiceAI {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private config: VoiceAIConfig;
  private sessionId: string | null = null;
  private isConnected = false;
  private isRecording = false;
  
  // Voice AI Worker endpoint
  private voiceAIWorkerUrl = 'https://voice-ai-worker.mybonzo.pl'; // Replace with actual worker URL
  
  private metrics: VoiceMetrics = {
    volume: 0,
    rms: 0,
    peak: 0,
    voiceActive: false,
    latency: 0,
    quality: 'excellent',
    timestamp: 0
  };
  
  // Event handlers
  public onTranscription?: (text: string) => void;
  public onAudioResponse?: (audioData: ArrayBuffer) => void;
  public onMetricsUpdate?: (metrics: VoiceMetrics) => void;
  public onError?: (error: string) => void;
  public onConnectionChange?: (connected: boolean) => void;

  constructor(config: VoiceAIConfig) {
    this.config = {
      latencyTarget: 800,
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔄 Initializing MyBonzo Voice AI...');
      await this.setupAudioCapture();
      await this.setupWebSocket();
      console.log('✅ Voice AI initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Voice AI:', error);
      this.onError?.(`Initialization failed: ${error}`);
      throw error;
    }
  }

  private async setupAudioCapture(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 48000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }
    });

    this.audioContext = new AudioContext({ 
      sampleRate: 48000,
      latencyHint: 'interactive'
    });

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Load audio worklet processor for advanced audio processing
    try {
      await this.audioContext.audioWorklet.addModule('/audio-processor.js');
      
      // Create audio worklet node
      const workletNode = new AudioWorkletNode(this.audioContext, 'voice-ai-processor');
      
      // Connect audio source
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(workletNode);
      
      // Handle worklet messages
      workletNode.port.onmessage = (event) => {
        if (event.data.type === 'metrics') {
          this.metrics = {
            ...this.metrics,
            ...event.data,
            timestamp: Date.now()
          };
          this.onMetricsUpdate?.(this.metrics);
        } else if (event.data.type === 'audioData') {
          // Send audio data to WebSocket
          this.sendMessage({
            type: 'audio_data',
            audioData: Array.from(event.data.buffer),
            timestamp: event.data.timestamp
          });
        }
      };
      
      // Store worklet reference
      (this as any).workletNode = workletNode;
      
    } catch (error) {
      console.warn('Audio worklet not available, using fallback:', error);
      // Fallback to basic audio processing
      this.setupBasicAudioProcessing();
    }

    console.log('🎵 Audio capture setup complete');
  }

  private setupBasicAudioProcessing(): void {
    if (!this.audioContext || !this.mediaStream) return;
    
    // Create basic audio analyzer
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 2048;
    
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    source.connect(analyser);
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    // Basic metrics calculation
    const updateMetrics = () => {
      analyser.getByteFrequencyData(dataArray);
      
      let sum = 0;
      let peak = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i] / 255;
        sum += value * value;
        peak = Math.max(peak, value);
      }
      
      const rms = Math.sqrt(sum / dataArray.length);
      
      this.metrics = {
        volume: Math.min(100, rms * 200),
        rms: rms,
        peak: peak,
        voiceActive: rms > 0.01,
        latency: this.metrics.latency,
        quality: this.metrics.quality,
        timestamp: Date.now()
      };
      
      this.onMetricsUpdate?.(this.metrics);
      
      if (this.isRecording) {
        requestAnimationFrame(updateMetrics);
      }
    };
    
    // Start metrics when recording
    const originalStart = this.startRecording.bind(this);
    this.startRecording = async () => {
      await originalStart();
      updateMetrics();
    };
  }

  private async setupWebSocket(): Promise<void> {
    const wsUrl = `/api/voice-ai/websocket`;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const fullUrl = `${protocol}//${window.location.host}${wsUrl}`;
    
    this.ws = new WebSocket(fullUrl);

    this.ws.onopen = () => {
      console.log('✅ Voice AI WebSocket connected');
      this.isConnected = true;
      this.onConnectionChange?.(true);
      this.sendMessage({
        type: 'configure',
        config: this.config,
        timestamp: Date.now()
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.onConnectionChange?.(false);
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.onError?.('WebSocket connection failed');
    };
  }

  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'transcription':
        this.onTranscription?.(data.text);
        break;
      case 'audio_response':
        if (data.audio) {
          const audioData = new Uint8Array(data.audio).buffer;
          this.onAudioResponse?.(audioData);
        }
        break;
      case 'metrics':
        this.metrics = { ...data.metrics, timestamp: Date.now() };
        this.onMetricsUpdate?.(this.metrics);
        break;
      case 'error':
        this.onError?.(data.message);
        break;
    }
  }

  private sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  async startRecording(): Promise<void> {
    if (!this.mediaStream || !this.audioContext) {
      throw new Error('Audio not initialized');
    }

    this.isRecording = true;
    this.sendMessage({ type: 'start_recording' });
    console.log('🎤 Recording started');
  }

  stopRecording(): void {
    this.isRecording = false;
    this.sendMessage({ type: 'stop_recording' });
    console.log('⏹️ Recording stopped');
  }

  getMetrics(): VoiceMetrics {
    return { ...this.metrics };
  }

  // Process transcribed text through Voice AI Worker
  async processWithAI(text: string): Promise<string> {
    try {
      const response = await fetch(`${this.voiceAIWorkerUrl}/voice-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'chat_completion',
          data: text,
          sessionId: this.sessionId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Generate speech from AI response
        const audioResponse = await this.generateSpeech(result.response);
        if (audioResponse && this.onAudioResponse) {
          this.onAudioResponse(audioResponse);
        }
        
        return result.response;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.onError?.(`AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return '';
    }
  }

  // Generate speech using Voice AI Worker
  async generateSpeech(text: string): Promise<ArrayBuffer | null> {
    try {
      const response = await fetch(`${this.voiceAIWorkerUrl}/voice-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'generate_speech',
          data: text,
          sessionId: this.sessionId
        })
      });

      if (response.ok && response.headers.get('Content-Type')?.includes('audio')) {
        return await response.arrayBuffer();
      }
      
      return null;
    } catch (error) {
      this.onError?.(`Speech generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  // Send audio for transcription to Voice AI Worker
  async transcribeAudio(audioData: ArrayBuffer): Promise<string> {
    try {
      const response = await fetch(`${this.voiceAIWorkerUrl}/voice-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'transcribe',
          data: Array.from(new Uint8Array(audioData)),
          sessionId: this.sessionId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return result.transcription;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.onError?.(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return '';
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    console.log('🔌 Voice AI disconnected');
  }
}
