/**
 * ElevenLabs Worker - Cloudflare Worker for ElevenLabs TTS API integration
 * Uses Cloudflare AI Gateway for enhanced monitoring and caching
 */

export interface Env {
  ELEVENLABS_API_KEY: string;
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
}

interface ElevenLabsRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  output_format?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const requestData: ElevenLabsRequest = await request.json();
      
      // Default configuration
      const voiceId = requestData.voice_id || 'JBFqnCBsd6RMkjVDRZzb'; // Default voice
      const outputFormat = requestData.output_format || 'mp3_44100_128';
      
      const config = {
        text: requestData.text,
        model_id: requestData.model_id || 'eleven_multilingual_v2',
        voice_settings: {
          stability: requestData.voice_settings?.stability || 0.5,
          similarity_boost: requestData.voice_settings?.similarity_boost || 0.75,
          style: requestData.voice_settings?.style || 0.0,
          use_speaker_boost: requestData.voice_settings?.use_speaker_boost ?? true,
        },
      };

      // Build AI Gateway URL
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/elevenlabs/v1/text-to-speech/${voiceId}?output_format=${outputFormat}`;

      // Make request to ElevenLabs via Cloudflare AI Gateway
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'xi-api-key': env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        console.error('ElevenLabs API error:', response.status, await response.text());
        return new Response(
          JSON.stringify({ 
            error: 'ElevenLabs API error', 
            status: response.status 
          }), 
          { 
            status: response.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Return audio data as blob
      const audioData = await response.arrayBuffer();
      
      return new Response(audioData, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Access-Control-Allow-Origin': '*',
          'X-Provider': 'elevenlabs',
          'X-Voice-ID': voiceId,
          'X-Model-ID': config.model_id,
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
