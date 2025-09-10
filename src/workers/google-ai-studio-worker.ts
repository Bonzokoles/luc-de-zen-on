/**
 * Google AI Studio Worker - Cloudflare Worker for Google Gemini API integration
 * Uses Cloudflare AI Gateway for enhanced monitoring and caching
 */

export interface Env {
  GOOGLE_AI_STUDIO_API_KEY: string;
  AI_GATEWAY_ACCOUNT_ID: string;
  AI_GATEWAY_ID: string;
}

interface GoogleAIRequest {
  model?: string;
  prompt?: string;
  messages?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  max_tokens?: number;
  temperature?: number;
}

interface GoogleAIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
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
      const requestData: GoogleAIRequest = await request.json();
      
      // Convert messages to Google AI format
      let contents: Array<{
        role: 'user' | 'model';
        parts: Array<{ text: string }>;
      }> = [];
      if (requestData.messages) {
        contents = requestData.messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.parts[0]?.text || '' }]
        }));
      } else if (requestData.prompt) {
        contents = [{
          role: 'user',
          parts: [{ text: requestData.prompt }]
        }];
      }

      // Default configuration
      const model = requestData.model || 'gemini-1.5-flash';
      const config = {
        contents,
        generationConfig: {
          temperature: requestData.temperature || 0.7,
          maxOutputTokens: requestData.max_tokens || 1000,
        },
      };

      // Build AI Gateway URL
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/google-ai-studio/v1/models/${model}:generateContent`;

      // Make request to Google AI Studio via Cloudflare AI Gateway
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'x-goog-api-key': env.GOOGLE_AI_STUDIO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        console.error('Google AI Studio API error:', response.status, await response.text());
        return new Response(
          JSON.stringify({ 
            error: 'Google AI Studio API error', 
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

      const data: GoogleAIResponse = await response.json();
      
      return new Response(
        JSON.stringify({
          success: true,
          response: data.candidates[0]?.content?.parts[0]?.text || '',
          model: model,
          usage: data.usageMetadata,
          provider: 'google-ai-studio'
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
