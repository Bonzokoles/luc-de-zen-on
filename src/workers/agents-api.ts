export default {
  async fetch(request: Request, env: any) {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    
    if (request.method === "GET" && url.pathname === "/api/agents") {
      try {
        const keys = await env.AGENTS.list();
        const agents = await Promise.all(keys.keys.map(async (key: any) => {
          const value = await env.AGENTS.get(key.name);
          return value ? JSON.parse(value) : null;
        }));
        return new Response(JSON.stringify(agents.filter(Boolean)), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch agents' }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    if (request.method === "POST" && url.pathname === "/api/agent") {
      try {
        const data = await request.json() as { id: string; [key: string]: any };
        if (!data.id) {
          return new Response(JSON.stringify({ error: 'Agent ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await env.AGENTS.put(data.id, JSON.stringify(data));
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to save agent' }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    return new Response(JSON.stringify({ error: "Not found" }), { 
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
