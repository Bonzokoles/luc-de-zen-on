export const POST = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();
    
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
          prompt: body.prompt,
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
        prompt: body.prompt,
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
    const requestBody = await request.json() as { prompt?: string };
    
    return new Response(JSON.stringify({ 
      success: true,
      imageUrl: `https://via.placeholder.com/1024x1024/001122/00d9ff?text=${encodeURIComponent(requestBody.prompt?.slice(0, 50) || 'Generated Image')}`,
      prompt: requestBody.prompt || 'Mock prompt',
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

export const OPTIONS = () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};