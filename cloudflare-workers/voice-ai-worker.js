/**
 * Voice AI Worker for Cloudflare
 * Handles advanced voice processing, integration with AI services
 */

// Voice AI Worker Implementation
class VoiceAIWorker {
  constructor(env) {
    this.env = env;
    this.aiServices = {
      google: env.GOOGLE_SPEECH_KEY,
      azure: env.AZURE_COGNITIVE_KEY,
      openai: env.OPENAI_API_KEY,
      elevenlabs: env.ELEVENLABS_API_KEY
    };
  }

  async handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    try {
      switch (path) {
        case '/voice-ai/health':
          return this.handleHealth();
        
        case '/voice-ai/transcribe':
          return await this.handleTranscription(request);
        
        case '/voice-ai/synthesize':
          return await this.handleSynthesis(request);
        
        case '/voice-ai/analyze':
          return await this.handleAnalysis(request);
        
        case '/voice-ai/command':
          return await this.handleCommand(request);
        
        case '/voice-ai/realtime':
          return await this.handleRealtimeConnection(request);
        
        default:
          return new Response(JSON.stringify({
            error: 'Endpoint not found',
            available: ['/health', '/transcribe', '/synthesize', '/analyze', '/command', '/realtime']
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } catch (error) {
      console.error('Voice AI Worker Error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal worker error',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  handleHealth() {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    return new Response(JSON.stringify({
      status: 'healthy',
      service: 'Voice AI Worker',
      version: '1.0.0',
      capabilities: [
        'Speech Recognition',
        'Voice Synthesis', 
        'Audio Analysis',
        'Voice Commands',
        'Real-time Processing'
      ],
      aiServices: {
        google: !!this.aiServices.google,
        azure: !!this.aiServices.azure,
        openai: !!this.aiServices.openai,
        elevenlabs: !!this.aiServices.elevenlabs
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders
    });
  }

  async handleTranscription(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const body = await request.json();
      const { audioData, language = 'pl-PL', provider = 'auto' } = body;

      if (!audioData) {
        return new Response(JSON.stringify({
          error: 'Audio data is required'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Choose AI service based on availability and preference
      let result;
      if (provider === 'google' && this.aiServices.google) {
        result = await this.transcribeWithGoogle(audioData, language);
      } else if (provider === 'azure' && this.aiServices.azure) {
        result = await this.transcribeWithAzure(audioData, language);
      } else if (provider === 'openai' && this.aiServices.openai) {
        result = await this.transcribeWithOpenAI(audioData, language);
      } else {
        // Auto-select best available service
        result = await this.transcribeWithBestAvailable(audioData, language);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Transcription Error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Transcription failed',
        details: error.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  async handleSynthesis(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const body = await request.json();
      const { 
        text, 
        language = 'pl-PL', 
        voice, 
        provider = 'auto',
        speed = 1.0,
        pitch = 1.0 
      } = body;

      if (!text) {
        return new Response(JSON.stringify({
          error: 'Text is required for synthesis'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Choose synthesis service
      let result;
      if (provider === 'elevenlabs' && this.aiServices.elevenlabs) {
        result = await this.synthesizeWithElevenLabs(text, voice, speed);
      } else if (provider === 'google' && this.aiServices.google) {
        result = await this.synthesizeWithGoogle(text, language, voice, speed, pitch);
      } else if (provider === 'azure' && this.aiServices.azure) {
        result = await this.synthesizeWithAzure(text, language, voice, speed, pitch);
      } else {
        result = await this.synthesizeWithBestAvailable(text, language, voice, speed, pitch);
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Synthesis Error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Synthesis failed',
        details: error.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  async handleAnalysis(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    try {
      const body = await request.json();
      const { audioData, analysisType = 'all' } = body;

      if (!audioData) {
        return new Response(JSON.stringify({
          error: 'Audio data is required for analysis'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const analysisResult = await this.performAudioAnalysis(audioData, analysisType);

      return new Response(JSON.stringify(analysisResult), {
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Analysis Error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Audio analysis failed',
        details: error.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  async handleCommand(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    try {
      const body = await request.json();
      const { command, language = 'pl-PL', context = {} } = body;

      if (!command) {
        return new Response(JSON.stringify({
          error: 'Command is required'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const commandResult = await this.processVoiceCommand(command, language, context);

      return new Response(JSON.stringify(commandResult), {
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Command Processing Error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Command processing failed',
        details: error.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  async handleRealtimeConnection(request) {
    // WebSocket for real-time voice processing
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected websocket', { status: 400 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    
    // Handle real-time voice processing
    server.addEventListener('message', async event => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'audio_chunk':
            const result = await this.processAudioChunk(data.chunk);
            server.send(JSON.stringify({
              type: 'transcription_result',
              result
            }));
            break;
            
          case 'voice_command':
            const commandResult = await this.processVoiceCommand(data.command, data.language);
            server.send(JSON.stringify({
              type: 'command_result',
              result: commandResult
            }));
            break;
            
          default:
            server.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        server.send(JSON.stringify({
          type: 'error',
          message: error.message
        }));
      }
    });

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }

  // AI Service Integration Methods
  async transcribeWithGoogle(audioData, language) {
    if (!this.aiServices.google) {
      throw new Error('Google Speech API key not configured');
    }

    // Mock implementation - replace with actual Google Cloud Speech API call
    return {
      success: true,
      transcript: 'Mock transcription from Google Speech API',
      confidence: 92,
      language,
      provider: 'google',
      processingTime: 250
    };
  }

  async transcribeWithAzure(audioData, language) {
    if (!this.aiServices.azure) {
      throw new Error('Azure Cognitive Services key not configured');
    }

    // Mock implementation - replace with actual Azure Speech API call
    return {
      success: true,
      transcript: 'Mock transcription from Azure Cognitive Services',
      confidence: 89,
      language,
      provider: 'azure',
      processingTime: 300
    };
  }

  async transcribeWithOpenAI(audioData, language) {
    if (!this.aiServices.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const formData = this.createFormData(audioData, language);
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.aiServices.openai}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error.message}`);
      }

      const result = await response.json();

      return {
        success: true,
        transcript: result.text,
        confidence: 95, // OpenAI doesn't provide confidence, assume high
        language,
        provider: 'openai',
        processingTime: 400
      };
    } catch (error) {
      console.error('OpenAI Transcription Error:', error);
      throw error;
    }
  }

  async transcribeWithBestAvailable(audioData, language) {
    // Priority order: OpenAI > Google > Azure
    if (this.aiServices.openai) {
      return await this.transcribeWithOpenAI(audioData, language);
    } else if (this.aiServices.google) {
      return await this.transcribeWithGoogle(audioData, language);
    } else if (this.aiServices.azure) {
      return await this.transcribeWithAzure(audioData, language);
    } else {
      // Fallback to local mock
      return {
        success: true,
        transcript: 'Witaj w systemie POLACZEK. Wszystkie systemy działają prawidłowo.',
        confidence: 85,
        language,
        provider: 'local_mock',
        processingTime: 100
      };
    }
  }

  async synthesizeWithElevenLabs(text, voice, speed) {
    if (!this.aiServices.elevenlabs) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice || 'rachel'}` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.aiServices.elevenlabs
        },
        body: JSON.stringify({
          text: text,
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.8
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.detail.message}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        success: true,
        audioUrl: audioUrl,
        voice: voice || 'rachel',
        speed,
        provider: 'elevenlabs',
        quality: 'premium'
      };
    } catch (error) {
      console.error('ElevenLabs Synthesis Error:', error);
      throw error;
    }
  }

  async synthesizeWithGoogle(text, language, voice, speed, pitch) {
    // Mock Google Cloud Text-to-Speech
    return {
      success: true,
      audioUrl: 'https://mock-google-tts.com/speech.wav',
      voice: voice || 'pl-PL-Wavenet-A',
      speed,
      pitch,
      provider: 'google'
    };
  }

  async synthesizeWithAzure(text, language, voice, speed, pitch) {
    // Mock Azure Cognitive Services Speech
    return {
      success: true,
      audioUrl: 'https://mock-azure-tts.com/speech.wav',
      voice: voice || 'pl-PL-ZofiaNeural',
      speed,
      pitch,
      provider: 'azure'
    };
  }

  async synthesizeWithBestAvailable(text, language, voice, speed, pitch) {
    // Priority: ElevenLabs > Google > Azure
    if (this.aiServices.elevenlabs) {
      return await this.synthesizeWithElevenLabs(text, voice, speed);
    } else if (this.aiServices.google) {
      return await this.synthesizeWithGoogle(text, language, voice, speed, pitch);
    } else if (this.aiServices.azure) {
      return await this.synthesizeWithAzure(text, language, voice, speed, pitch);
    } else {
      return {
        success: true,
        audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeCsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSsFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwFJnfH8N2QQAoUXrTp66hVFApGn+DyvmcfCTJ+zPDOeSwF',
        provider: 'local_mock',
        message: 'Using mock audio - no TTS service available'
      };
    }
  }

  async performAudioAnalysis(audioData, analysisType) {
    // Mock comprehensive audio analysis
    const mockAnalysis = {
      success: true,
      analysis: {
        transcription: {
          text: 'Wysokiej jakości nagranie głosowe w języku polskim',
          confidence: 94,
          language: 'pl-PL'
        },
        emotion: {
          overall: 'neutral',
          confidence: 87,
          details: {
            happiness: 20,
            sadness: 10,
            anger: 5,
            fear: 8,
            surprise: 12,
            neutral: 45
          }
        },
        quality: {
          overall: 'good',
          score: 82,
          metrics: {
            clarity: 85,
            noiseLevel: 12,
            volume: 78,
            speechRate: 92
          }
        },
        audio: {
          duration: 3.2,
          format: 'webm',
          sampleRate: 48000,
          channels: 1
        }
      },
      processingTime: 450
    };

    return mockAnalysis;
  }

  async processVoiceCommand(command, language, context) {
    if (!this.env.AI) {
      throw new Error('AI binding not configured');
    }

    try {
      const systemPrompt = `You are a voice command processing AI for the MyBonzo platform.
Your task is to understand the user's command and respond with a JSON object containing the action to be performed and any relevant parameters.

The available actions are: open_polaczek, open_webmaster, generate_image, play_music, system_status.

Example:
User: "otwórz polaczek"
AI: {"action": "open_polaczek"}

User: "wygeneruj obraz psa"
AI: {"action": "generate_image", "prompt": "pies"}

User: "włącz muzykę"
AI: {"action": "play_music"}
`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: command },
      ];

      const aiResponse = await this.env.AI.run('@cf/qwen/qwen1.5-7b-chat-awq', {
        messages,
        temperature: 0.2,
      });

      const responseJson = JSON.parse(aiResponse.response);

      return {
        success: true,
        recognized: true,
        command: {
          intent: responseJson.action,
          confidence: 90,
          language,
          parameters: responseJson
        },
        execution: {
          executed: true,
          action: responseJson.action,
          message: `Executing command: ${responseJson.action}`
        }
      };
    } catch (error) {
      console.error('AI Command Processing Error:', error);
      return {
        success: false,
        recognized: false,
        error: 'Failed to process command with AI'
      };
    }
  }

  async processAudioChunk(audioChunk) {
    // Real-time audio chunk processing
    return {
      type: 'partial_transcription',
      text: 'Przetwarzanie...',
      confidence: 50,
      final: false
    };
  }

  createFormData(audioData, language) {
    // Helper to create FormData for API calls
    const formData = new FormData();
    
    // Convert base64 to blob
    const audioBlob = new Blob([
      new Uint8Array(
        atob(audioData).split('').map(c => c.charCodeAt(0))
      )
    ], { type: 'audio/webm' });
    
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', language.split('-')[0]); // 'pl' from 'pl-PL'
    
    return formData;
  }
}

// Cloudflare Worker event listener
export default {
  async fetch(request, env, ctx) {
    const worker = new VoiceAIWorker(env);
    return await worker.handleRequest(request);
  }
};