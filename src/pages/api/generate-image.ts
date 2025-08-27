export const POST = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();
    
    // Wywołaj Worker do generowania obrazu
    const workerUrl = 'https://mybonzo-worker.bonzokoles.workers.dev/generate-image';
    
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Image Generation API Error:', error);
    
    // Zwróć mock image URL jeśli worker nie działa
    const requestBody = await request.json() as { prompt?: string };
    
    return new Response(JSON.stringify({ 
      imageUrl: 'https://via.placeholder.com/512x512/001122/00d9ff?text=Mock+Generated+Image',
      prompt: requestBody.prompt || 'Mock prompt',
      success: true,
      message: 'Wygenerowano mock obraz (worker niedostępny)'
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
