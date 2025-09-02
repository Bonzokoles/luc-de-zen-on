import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const GET = async () => {
  return createSuccessResponse({
    message: 'Image Generator API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { prompt: "your description" }'
  });
};

export const POST = async ({ request }: { request: Request }) => {
  // Parse the request body once and store it
  const body = await request.json();
  const prompt = body.prompt || '';
  
  try {    
    // Try the new image generation worker
    const imageWorkerUrl = 'https://generate-image.stolarnia-ams.workers.dev';
    
    try {
      const response = await fetch(imageWorkerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        
        return new Response(JSON.stringify({
          success: true,
          imageUrl: data.imageUrl || data.image,
          prompt: prompt,
          width: data.width || 1024,
          height: data.height || 1024,
          steps: data.steps || 4,
          message: 'Obraz wygenerowany przez Cloudflare AI (FLUX-1-schnell)'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (imageError) {
      console.log('Image generation worker niedostępny, próbuję fallback...');
    }

    // Fallback to agents-backend if available
    const agentsBackendUrl = 'https://agents-backend.stolarnia-ams.workers.dev/api/generate-image';
    
    try {
      const response = await fetch(agentsBackendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        
        return new Response(JSON.stringify({
          success: true,
          imageUrl: data.imageUrl || data.r2Key || data.image,
          prompt: prompt,
          message: 'Obraz wygenerowany przez agents-backend (fallback)'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (agentsError) {
      console.log('agents-backend także niedostępny...');
    }

    throw new Error('Wszystkie workery niedostępne');

  } catch (error) {
    console.error('Image Generation API Error:', error);
    
    // Return error instead of mock image
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Generatory obrazów są obecnie niedostępne',
      message: 'Przepraszam, nie mogę obecnie wygenerować obrazu. Spróbuj ponownie za chwilę.',
      prompt: prompt,
      details: 'Wszystkie workery generowania obrazów (agents-backend i mybonzo-worker) są niedostępne.'
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);
