export interface Env {
  AI: any;
  AI_MODELS: KVNamespace;
  AI_FILES: KVNamespace;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

// Funkcja do wyodrębnienia tekstu z różnych typów plików
async function extractTextFromFile(file: any): Promise<string> {
  try {
    if (!file || !file.content) return '';

    // Pliki tekstowe
    if (file.type.startsWith('text/') || 
        file.type === 'application/json' || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.txt')) {
      return file.content;
    }

    // Pliki PDF - w rzeczywistej implementacji użyłbyś biblioteki do parsowania PDF
    if (file.type === 'application/pdf') {
      return `[PDF File: ${file.name} - Content extraction not implemented yet]`;
    }

    // Obrazy - opisz że to obraz
    if (file.type.startsWith('image/')) {
      return `[Image File: ${file.name} - ${file.type}]`;
    }

    // Inne pliki
    return `[File: ${file.name} - ${file.type}]`;

  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `[Error reading file: ${file.name}]`;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Only POST is allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const requestData = await request.json() as { prompt: string };
      const { prompt } = requestData;

      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Pobierz aktualnie wybrany model z KV
      const selectedModel = await env.AI_MODELS?.get('selected_model') || 'gpt-4';
      const modelsConfig = await env.AI_MODELS?.get('models_config', { type: 'json' });
      const systemPrompt = await env.AI_MODELS?.get('system_prompt') || 
        'Jesteś pomocnym asystentem AI dla MyBonzo - firmy specjalizującej się w projektowaniu graficznym i rozwiązaniach AI. Odpowiadaj po polsku.';

      // Pobierz pliki kontekstowe
      const uploadedFiles = await env.AI_FILES?.get('uploaded_files', { type: 'json' }) || [];
      let contextFromFiles = '';

      if (uploadedFiles.length > 0) {
        const fileContexts: string[] = [];
        
        // Pobierz maksymalnie 5 najnowszych plików dla kontekstu
        const recentFiles = uploadedFiles.slice(-5);
        
        for (const fileInfo of recentFiles) {
          try {
            const fileData = await env.AI_FILES?.get(`file_${fileInfo.id}`, { type: 'json' });
            if (fileData) {
              const extractedText = await extractTextFromFile(fileData);
              if (extractedText.trim()) {
                fileContexts.push(`=== ${fileInfo.name} ===\n${extractedText}\n`);
              }
            }
          } catch (error) {
            console.error(`Error loading file ${fileInfo.id}:`, error);
          }
        }

        if (fileContexts.length > 0) {
          contextFromFiles = '\n\nKONTEKST Z PLIKÓW:\n' + fileContexts.join('\n') + '\n=== KONIEC KONTEKSTU ===\n\n';
        }
      }

      // Domyślna konfiguracja modeli
      const defaultModels = {
        'gpt-3.5-turbo': {
          name: 'GPT-3.5 Turbo',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          model: 'gpt-3.5-turbo',
          parameters: { temperature: 0.7, max_tokens: 1000 }
        },
        'gpt-4': {
          name: 'GPT-4',
          endpoint: 'https://api.openai.com/v1/chat/completions',
          model: 'gpt-4',
          parameters: { temperature: 0.7, max_tokens: 1500 }
        },
        'claude-3-haiku': {
          name: 'Claude 3 Haiku',
          endpoint: 'https://api.anthropic.com/v1/messages',
          model: 'claude-3-haiku-20240307',
          parameters: { temperature: 0.7, max_tokens: 1000 }
        },
        'cloudflare-llama': {
          name: 'Cloudflare Llama',
          endpoint: 'cloudflare-ai',
          model: '@cf/meta/llama-3.1-8b-instruct',
          parameters: { temperature: 0.7, max_tokens: 1000 }
        }
      };

      const models = modelsConfig?.models || defaultModels;
      const currentModel = models[selectedModel] || models['cloudflare-llama'];

      let answer = '';

      // Przygotuj pełny prompt z kontekstem
      const fullPrompt = contextFromFiles + prompt;

      // Sprawdź typ modelu i użyj odpowiedniego API
      if (currentModel.endpoint === 'cloudflare-ai') {
        // Użyj Cloudflare Workers AI
        const response = await env.AI.run(currentModel.model, {
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ]
        });
        answer = response.response || 'Przepraszam, nie mogę teraz odpowiedzieć.';
        
      } else if (currentModel.endpoint.includes('openai.com')) {
        // Użyj OpenAI API
        if (!env.OPENAI_API_KEY) {
          throw new Error('OpenAI API key not configured');
        }

        const response = await fetch(currentModel.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: currentModel.model,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: fullPrompt
              }
            ],
            ...currentModel.parameters
          })
        });

        const data = await response.json();
        answer = data.choices?.[0]?.message?.content || 'Przepraszam, nie mogę teraz odpowiedzieć.';

      } else if (currentModel.endpoint.includes('anthropic.com')) {
        // Użyj Anthropic API
        if (!env.ANTHROPIC_API_KEY) {
          throw new Error('Anthropic API key not configured');
        }

        const response = await fetch(currentModel.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: currentModel.model,
            max_tokens: currentModel.parameters.max_tokens,
            messages: [
              {
                role: 'user',
                content: `${systemPrompt}\n\nPytanie: ${fullPrompt}`
              }
            ]
          })
        });

        const data = await response.json();
        answer = data.content?.[0]?.text || 'Przepraszam, nie mogę teraz odpowiedzieć.';
      }

      return new Response(JSON.stringify({
        answer,
        model_used: selectedModel,
        model_name: currentModel.name,
        files_context: uploadedFiles.length > 0 ? `Wykorzystano kontekst z ${Math.min(uploadedFiles.length, 5)} plików` : null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('AI Worker Error:', error);
      return new Response(JSON.stringify({
        error: 'Wystąpił błąd podczas przetwarzania zapytania',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
