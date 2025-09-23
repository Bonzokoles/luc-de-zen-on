export const GET = async ({ locals }: { locals: any }) => {
  try {
    // Użyj bezpośrednio KV storage z Cloudflare Pages
    const env = locals.runtime.env;
    
    if (!env.AGENTS) {
      return new Response(JSON.stringify({ 
        error: 'KV storage AGENTS nie jest dostępny',
        agents: []
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const keys = await env.AGENTS.list();
    const agents = await Promise.all(keys.keys.map(async (key: any) => {
      const value = await env.AGENTS.get(key.name);
      return value ? JSON.parse(value) : null;
    }));

    return new Response(JSON.stringify(agents.filter(Boolean)), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Agents API Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Nie można pobrać agentów',
      agents: []
    }), {
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
