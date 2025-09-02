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
    // Najpierw spróbuj nowy agents-backend worker
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
          message: 'Obraz wygenerowany przez agents-backend'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (agentsError) {
      console.log('agents-backend niedostępny, próbuję stary worker...');
    }

    // Fallback do starego workera
    const workerUrl = 'https://mybonzo-worker.bonzokoles.workers.dev/generate-image';
    
    const response = await fetch(workerUrl, {
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
        message: 'Obraz wygenerowany przez mybonzo-worker'
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    throw new Error('Oba workery niedostępne');

  } catch (error) {
    console.error('Image Generation API Error:', error);
    
    // Zwróć mock image URL jeśli żaden worker nie działa
    return new Response(JSON.stringify({ 
      success: true,
      imageUrl: `https://via.placeholder.com/1024x1024/001122/00d9ff?text=${encodeURIComponent(prompt.slice(0, 50) || 'Generated Image')}`,
      prompt: prompt || 'Mock prompt',
      message: 'Mock obraz (workery niedostępne)'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);
