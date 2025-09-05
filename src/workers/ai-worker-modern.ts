// Modern AI Worker with Function Calling
// Based on Cloudflare documentation and best practices

import { Router } from 'itty-router';
import { runWithTools } from '@cloudflare/ai-utils';
import type { Env, ChatRequest, ChatResponse, FunctionCallingRequest } from '../types/cloudflare';

const router = Router();

// Health check endpoint
router.get('/health', () => {
  return Response.json({ 
    status: 'ok', 
    service: 'Modern AI Worker',
    timestamp: new Date().toISOString(),
    capabilities: ['chat', 'function-calling', 'translation']
  });
});

// Basic chat endpoint
router.post('/chat', async (request: Request, env: Env) => {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId = 'default', model = '@cf/meta/llama-3.1-8b-instruct', temperature = 0.7 } = body;

    if (!message || message.trim().length === 0) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await env.AI.run(model, {
      messages: [
        { role: 'system', content: 'Jesteś pomocnym asystentem AI MyBonzo. Odpowiadaj zwięźle po polsku.' },
        { role: 'user', content: message.trim() }
      ],
      temperature
    });

    const chatResponse: ChatResponse = {
      success: true,
      response: response.response || 'Przepraszam, nie udało się wygenerować odpowiedzi.',
      sessionId,
      model,
      timestamp: new Date().toISOString()
    };

    return Response.json(chatResponse);
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json({ 
      error: 'Chat service temporarily unavailable',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});

// Advanced function calling endpoint
router.post('/function-call', async (request: Request, env: Env) => {
  try {
    const body: FunctionCallingRequest = await request.json();
    const { messages, tools, model = '@hf/nousresearch/hermes-2-pro-mistral-7b' } = body;

    // Example tool functions
    const availableTools = {
      getCurrentTime: async (): Promise<string> => {
        return new Date().toLocaleString('pl-PL');
      },
      
      translateText: async (args: { text: string; targetLanguage: string }): Promise<string> => {
        const { text, targetLanguage } = args;
        // Simple translation logic - could be enhanced with AI translation
        if (targetLanguage === 'english') {
          return `Translated to English: ${text}`;
        }
        return `Translated to ${targetLanguage}: ${text}`;
      },
      
      generateImage: async (args: { prompt: string; style?: string }): Promise<string> => {
        const { prompt, style } = args;
        try {
          const imageResponse = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
            prompt: style ? `${prompt}, in a ${style} style` : prompt,
            width: 512,
            height: 512
          });
          
          if (imageResponse && imageResponse.image) {
            return `Image generated successfully for prompt: "${prompt}"`;
          }
          return 'Failed to generate image';
        } catch (error) {
          return `Image generation failed: ${error}`;
        }
      }
    };

    // Map tools to their functions
    const toolsWithFunctions = tools.map(tool => ({
      ...tool,
      function: availableTools[tool.name as keyof typeof availableTools] || 
        (() => Promise.resolve('Function not available'))
    }));

    const response = await runWithTools(env.AI, model, {
      messages,
      tools: toolsWithFunctions
    });

    return Response.json({
      success: true,
      response,
      model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Function calling error:', error);
    return Response.json({ 
      error: 'Function calling service temporarily unavailable',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});

// Polish language model endpoint
router.post('/polish', async (request: Request, env: Env) => {
  try {
    const body: ChatRequest = await request.json();
    const { message, temperature = 0.7 } = body;

    if (!message || message.trim().length === 0) {
      return Response.json({ error: 'Wiadomość jest wymagana' }, { status: 400 });
    }

    // Use Polish model if available
    const polishModel = '@hf/speakleash/bielik-7b-instruct-v0.1';
    
    const response = await env.AI.run(polishModel, {
      messages: [
        { role: 'system', content: 'Jesteś polskim asystentem AI. Odpowiadaj naturalnie po polsku.' },
        { role: 'user', content: message.trim() }
      ],
      temperature
    });

    return Response.json({
      success: true,
      response: response.response || 'Przepraszam, nie mogę teraz odpowiedzieć.',
      model: polishModel,
      language: 'polish',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Polish AI error:', error);
    return Response.json({ 
      error: 'Polski asystent AI jest chwilowo niedostępny',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});

// 404 handler
router.all('*', () => {
  return new Response('AI Worker - Endpoint not found', { status: 404 });
});

// Main export with CORS headers
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const response = await router.handle(request, env);
      
      // Add CORS headers to all responses
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }), { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }
  }
};
