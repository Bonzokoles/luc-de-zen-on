/**
 * WebSocket Realtime AI Worker
 * Provides WebSocket endpoint that clients can connect to for real-time AI interactions
 */

export interface Env {
  // AI Gateway Config
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
  
  // API Keys for real-time providers
  OPENAI_API_KEY: string;
  GOOGLE_AI_STUDIO_API_KEY: string;
  CARTESIA_API_KEY: string;
  ELEVENLABS_API_KEY: string;
  
  // Cloudflare Token for AI Gateway
  CLOUDFLARE_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Upgrade, Connection',
        },
      });
    }

    const upgradeHeader = request.headers.get('Upgrade');
    
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response(JSON.stringify({
        error: 'WebSocket upgrade required',
        message: 'This endpoint only supports WebSocket connections',
        usage: 'Connect with WebSocket client using: ws://your-worker.workers.dev?provider=openai&model=gpt-4o-realtime'
      }), { 
        status: 426,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const url = new URL(request.url);
    const provider = url.searchParams.get('provider') || 'openai';
    const model = url.searchParams.get('model');
    
    // Construct AI Gateway WebSocket URL based on provider
    let gatewayUrl: string;
    let authHeaders: Record<string, string> = {};

    switch (provider) {
      case 'openai':
        const openaiModel = model || 'gpt-4o-realtime-preview-2024-12-17';
        gatewayUrl = `wss://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/openai?model=${openaiModel}`;
        authHeaders = {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1',
        };
        break;

      case 'google-ai-studio':
        gatewayUrl = `wss://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/google?api_key=${env.GOOGLE_AI_STUDIO_API_KEY}`;
        break;

      case 'cartesia':
        gatewayUrl = `wss://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/cartesia?cartesia_version=2024-06-10&api_key=${env.CARTESIA_API_KEY}`;
        break;

      case 'elevenlabs':
        gatewayUrl = `wss://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/elevenlabs`;
        authHeaders = {
          'xi-api-key': env.ELEVENLABS_API_KEY,
        };
        break;

      default:
        return new Response(JSON.stringify({
          error: 'Unsupported provider',
          supported: ['openai', 'google-ai-studio', 'cartesia', 'elevenlabs']
        }), { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
    }

    // Return instructions for client-side WebSocket connection
    return new Response(JSON.stringify({
      message: 'WebSocket endpoint ready',
      gatewayUrl,
      provider,
      model: model || 'default',
      instructions: 'Connect using WebSocket client to this URL with appropriate headers',
      example: {
        javascript: `
const ws = new WebSocket('${request.url}');
ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Message:', JSON.parse(event.data));
ws.send(JSON.stringify({type: 'message', content: 'Hello AI!'}));
        `
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
