export const GET = async ({ url, locals }: { url: URL; locals: any }) => {
  try {
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Użyj bezpośrednio KV storage
    const env = locals.runtime.env;
    
    if (!env.AGENTS) {
      return new Response(JSON.stringify({ error: 'KV storage not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const agentData = await env.AGENTS.get(id);
    
    if (!agentData) {
      return new Response(JSON.stringify({ error: 'Agent not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(agentData, {
      status: 200,
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

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
  try {
    const body = await request.json() as { id: string; [key: string]: any };
    const env = locals.runtime.env;
    
    if (!env.AGENTS) {
      return new Response(JSON.stringify({ error: 'KV storage not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!body.id) {
      return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Zapisz agenta do KV storage
    await env.AGENTS.put(body.id, JSON.stringify(body));
    
    return new Response(JSON.stringify({ success: true, agent: body }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Agent Save API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save agent' }), {
      status: 500,
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
