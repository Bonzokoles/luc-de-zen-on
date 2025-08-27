export interface Env {
  AI_MODELS: KVNamespace;
  AI_FILES: KVNamespace;
}

// Interfejs dla przesłanego pliku
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
      // GET /api/models - Lista modeli i ustawień
      if (request.method === 'GET' && path === '/api/models') {
        const modelsConfig = await env.AI_MODELS?.get('models_config', { type: 'json' });
        const selectedModel = await env.AI_MODELS?.get('selected_model') || 'cloudflare-llama';
        const systemPrompt = await env.AI_MODELS?.get('system_prompt') || 'Jesteś pomocnym asystentem AI dla MyBonzo - firmy specjalizującej się w projektowaniu graficznym i rozwiązaniach AI. Odpowiadaj po polsku.';
        const uploadedFiles = await env.AI_FILES?.get('uploaded_files', { type: 'json' }) || [];

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

        return new Response(JSON.stringify({
          models,
          selected_model: selectedModel,
          default_model: 'cloudflare-llama',
          system_prompt: systemPrompt,
          uploaded_files: uploadedFiles
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

        await env.AI_MODELS?.put('selected_model', model);

        return new Response(JSON.stringify({
          success: true,
          selected_model: model
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

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

      // POST /api/models/upload - Upload pliku
      if (request.method === 'POST' && path === '/api/models/upload') {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'File is required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Sprawdź rozmiar pliku (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'File size exceeds 10MB limit' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Sprawdź typ pliku
        const allowedTypes = [
          'text/plain', 'application/pdf', 'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/markdown', 'application/json', 'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/png', 'image/jpeg', 'image/gif', 'image/webp'
        ];

        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx|md|json|csv|xlsx|png|jpg|jpeg|gif|webp)$/i)) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Unsupported file type' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Generuj unikalne ID dla pliku
        const fileId = crypto.randomUUID();
        
        // Konwertuj plik do base64
        const arrayBuffer = await file.arrayBuffer();
        let content: string;

        if (file.type.startsWith('text/') || file.type === 'application/json' || file.name.endsWith('.md')) {
          // Pliki tekstowe - zapisz jako tekst
          content = new TextDecoder().decode(arrayBuffer);
        } else {
          // Pliki binarne - zapisz jako base64
          content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        }

        // Stwórz obiekt pliku
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          content: content,
          uploaded_at: new Date().toISOString()
        };

        // Zapisz plik w KV
        await env.AI_FILES?.put(`file_${fileId}`, JSON.stringify(uploadedFile));

        // Aktualizuj listę plików
        const currentFiles = await env.AI_FILES?.get('uploaded_files', { type: 'json' }) || [];
        const updatedFiles = [...currentFiles, {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploaded_at: uploadedFile.uploaded_at
        }];
        
        await env.AI_FILES?.put('uploaded_files', JSON.stringify(updatedFiles));

        return new Response(JSON.stringify({
          success: true,
          file_id: fileId,
          message: 'File uploaded successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // DELETE /api/models/upload/{fileId} - Usuń plik
      if (request.method === 'DELETE' && path.startsWith('/api/models/upload/')) {
        const fileId = path.split('/').pop();

        if (!fileId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'File ID is required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Usuń plik z KV
        await env.AI_FILES?.delete(`file_${fileId}`);

        // Aktualizuj listę plików
        const currentFiles = await env.AI_FILES?.get('uploaded_files', { type: 'json' }) || [];
        const updatedFiles = currentFiles.filter((f: any) => f.id !== fileId);
        await env.AI_FILES?.put('uploaded_files', JSON.stringify(updatedFiles));

        return new Response(JSON.stringify({
          success: true,
          message: 'File deleted successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET /api/models/files/{fileId} - Pobierz zawartość pliku
      if (request.method === 'GET' && path.startsWith('/api/models/files/')) {
        const fileId = path.split('/').pop();

        if (!fileId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'File ID is required' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const fileData = await env.AI_FILES?.get(`file_${fileId}`, { type: 'json' });

        if (!fileData) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'File not found' 
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          file: fileData
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
      console.error('Models API Error:', error);
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
