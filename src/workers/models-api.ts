export interface Env {
  AI_MODELS: KVNamespace;
  AI_FILES: KVNamespace;
  AI: any;
}

// Enhanced AI Models Configuration for MyBonzo
const ENHANCED_AI_MODELS = {
  // Cloudflare AI Models (Primary - No API keys needed)
  'cf-llama-3.1-8b': {
    name: 'Llama 3.1 8B (Balanced)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/meta/llama-3.1-8b-instruct',
    parameters: { temperature: 0.7, max_tokens: 1000 },
    category: 'general',
    speed: 'fast',
    cost: 'free'
  },
  'cf-llama-3.3-70b': {
    name: 'Llama 3.3 70B (Advanced)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    parameters: { temperature: 0.7, max_tokens: 2000 },
    category: 'advanced',
    speed: 'medium',
    cost: 'free'
  },
  'cf-qwen-coder': {
    name: 'Qwen Coder 32B (Programming)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/qwen/qwen2.5-coder-32b-instruct',
    parameters: { temperature: 0.3, max_tokens: 1500 },
    category: 'code',
    speed: 'medium',
    cost: 'free'
  },
  'cf-deepseek-math': {
    name: 'DeepSeek Math 7B (Mathematics)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/deepseek-ai/deepseek-math-7b-instruct',
    parameters: { temperature: 0.3, max_tokens: 1000 },
    category: 'math',
    speed: 'fast',
    cost: 'free'
  },
  'cf-llama-vision': {
    name: 'Llama Vision 11B (Image+Text)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/meta/llama-3.2-11b-vision-instruct',
    parameters: { temperature: 0.7, max_tokens: 1000 },
    category: 'vision',
    speed: 'medium',
    cost: 'free'
  },
  'cf-qwen-fast': {
    name: 'Qwen 0.5B (Ultra Fast)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/qwen/qwen1.5-0.5b-chat',
    parameters: { temperature: 0.7, max_tokens: 500 },
    category: 'fast',
    speed: 'ultra-fast',
    cost: 'free'
  },
  'cf-mistral-small': {
    name: 'Mistral Small 24B (Precise)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/mistralai/mistral-small-3.1-24b-instruct',
    parameters: { temperature: 0.5, max_tokens: 1200 },
    category: 'precise',
    speed: 'medium',
    cost: 'free'
  },
  'cf-flux-schnell': {
    name: 'Flux Schnell (Image Generation)',
    provider: 'Cloudflare',
    endpoint: 'cloudflare-ai',
    model: '@cf/black-forest-labs/flux-1-schnell',
    parameters: { steps: 4 },
    category: 'image',
    speed: 'fast',
    cost: 'free'
  },
  // External API Models (Require API keys)
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    parameters: { temperature: 0.7, max_tokens: 1000 },
    category: 'external',
    speed: 'fast',
    cost: 'paid'
  },
  'gpt-4': {
    name: 'GPT-4',
    provider: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    parameters: { temperature: 0.7, max_tokens: 1500 },
    category: 'external',
    speed: 'medium',
    cost: 'paid'
  },
  'claude-3-haiku': {
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    parameters: { temperature: 0.7, max_tokens: 1000 },
    category: 'external',
    speed: 'fast',
    cost: 'paid'
  }
};

// Interfejs dla przes³anego pliku
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploaded_at: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/models - Lista modeli i ustawieñ
      if (request.method === 'GET' && path === '/api/models') {
        const modelsConfig = await env.AI_MODELS?.get('models_config', { type: 'json' });
        const selectedModel = await env.AI_MODELS?.get('selected_model') || 'cf-llama-3.1-8b';
        const systemPrompt = await env.AI_MODELS?.get('system_prompt') || 'Jesteœ zaawansowanym asystentem AI dla MyBonzo - firmy specjalizuj¹cej siê w projektowaniu graficznym i nowoczesnych rozwi¹zaniach AI. Odpowiadaj po polsku, b¹dŸ kreatywny i pomocny.';
        const uploadedFiles = await env.AI_FILES?.get('uploaded_files', { type: 'json' }) || [];

        // Use enhanced models or fall back to basic ones
        const models = modelsConfig?.models || ENHANCED_AI_MODELS;

        return new Response(JSON.stringify({
          models,
          selected_model: selectedModel,
          default_model: 'cf-llama-3.1-8b',
          system_prompt: systemPrompt,
          uploaded_files: uploadedFiles,
          model_categories: {
            general: 'Ogólne zastosowanie',
            advanced: 'Zaawansowane zadania',
            code: 'Programowanie',
            math: 'Matematyka',
            vision: 'Analiza obrazów',
            fast: 'Szybkie odpowiedzi',
            precise: 'Precyzyjne zadania',
            image: 'Generowanie obrazów',
            external: 'Zewnêtrzne API'
          },
          features: {
            cloudflare_ai: true,
            external_apis: true,
            image_generation: true,
            vision_support: true,
            file_upload: true,
            multi_language: true
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // POST /api/models/select - Zmiana modelu
      if (request.method === 'POST' && path === '/api/models/select') {
        const { model } = await request.json() as { model: string };

        if (!model) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Model is required'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Validate model exists
        if (!ENHANCED_AI_MODELS[model]) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid model selected'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        await env.AI_MODELS?.put('selected_model', model);

        return new Response(JSON.stringify({
          success: true,
          selected_model: model,
          model_info: ENHANCED_AI_MODELS[model]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // POST /api/models/test - Test model
      if (request.method === 'POST' && path === '/api/models/test') {
        const { model, prompt } = await request.json() as { model: string; prompt?: string };
        
        if (!model || !ENHANCED_AI_MODELS[model]) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Valid model is required'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const modelConfig = ENHANCED_AI_MODELS[model];
        const testPrompt = prompt || 'Napisz krótkie powitanie dla u¿ytkowników MyBonzo.';

        try {
          if (modelConfig.endpoint === 'cloudflare-ai') {
            // Test Cloudflare AI model
            const response = await env.AI.run(modelConfig.model, {
              messages: [{ role: 'user', content: testPrompt }],
              ...modelConfig.parameters
            });

            return new Response(JSON.stringify({
              success: true,
              model: model,
              response: response.response || response,
              latency: 'Available on next test',
              provider: 'Cloudflare AI'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          } else {
            // For external APIs, return mock response (would need API keys for real test)
            return new Response(JSON.stringify({
              success: true,
              model: model,
              response: 'Test model ready (requires API key for full functionality)',
              latency: 'N/A',
              provider: modelConfig.provider
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Model test failed',
            details: error instanceof Error ? error.message : 'Unknown error'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // Pozosta³e endpointy pozostaj¹ bez zmian...
      // POST /api/models/system-prompt - Zapisz prompt systemowy
      if (request.method === 'POST' && path === '/api/models/system-prompt') {
        const { system_prompt } = await request.json() as { system_prompt: string };

        if (!system_prompt || !system_prompt.trim()) {
          return new Response(JSON.stringify({
            success: false,
            error: 'System prompt is required'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        await env.AI_MODELS?.put('system_prompt', system_prompt.trim());

        return new Response(JSON.stringify({
          success: true,
          message: 'System prompt saved'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'Endpoint not found'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Enhanced Models API Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
