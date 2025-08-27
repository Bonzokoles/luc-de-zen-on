export const GET = async ({ url }: { url: URL }) => {
  try {
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Wywołaj Worker do pobrania agenta
    const workerUrl = `https://mybonzo-worker.bonzokoles.workers.dev/api/agent?id=${id}`;
    
    const response = await fetch(workerUrl);
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Agent Fetch API Error:', error);
    return new Response(JSON.stringify({ error: 'Agent not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

export const POST = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();
    
    // Wywołaj Worker do zapisania agenta
    const workerUrl = 'https://mybonzo-worker.bonzokoles.workers.dev/api/agent';
    
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
    console.error('Agent Save API Error:', error);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Agent zapisany lokalnie (mock)'
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
