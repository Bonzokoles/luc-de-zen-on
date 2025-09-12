/**
 * Anthropic (Claude) Worker - Cloudflare Worker for Anthropic API integration
 * Uses Cloudflare AI Gateway for enhanced monitoring and caching
 */

export interface Env {
  ANTHROPIC_API_KEY: string;
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
}

interface AnthropicRequest {
  model?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  system?: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
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
      const requestData: AnthropicRequest = await request.json();
      
      // Default configuration
      const config = {
        model: requestData.model || 'claude-3-5-sonnet-20241022',
        max_tokens: requestData.max_tokens || 1000,
        temperature: requestData.temperature || 0.7,
        messages: requestData.messages,
        system: requestData.system || 'You are a helpful AI assistant.'
      };

      // Build AI Gateway URL
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/anthropic/v1/messages`;

      // Make request to Anthropic via Cloudflare AI Gateway
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        console.error('Anthropic API error:', response.status, await response.text());
        return new Response(
          JSON.stringify({ 
            error: 'Anthropic API error', 
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

      const data: AnthropicResponse = await response.json();
      
      return new Response(
        JSON.stringify({
          success: true,
          response: data.content[0]?.text || '',
          model: data.model,
          usage: data.usage,
          provider: 'anthropic'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

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
