interface AgentData {
  id: string;
  name?: string;
  status?: string;
  config?: any;
  system_prompt?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // GET /api/agents - Lista wszystkich agentów
      if (request.method === "GET" && url.pathname === "/api/agents") {
        const keys = await env.AGENTS.list();
        const agents = await Promise.all(keys.keys.map(async (key) => {
          const value = await env.AGENTS.get(key.name);
          return value ? JSON.parse(value) : null;
        }));
        
        return new Response(JSON.stringify({
          success: true,
          agents: agents.filter(Boolean),
          count: agents.filter(Boolean).length,
          timestamp: new Date().toISOString()
        }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      // GET /api/agent?id=xxx - Pobranie konkretnego agenta
      if (request.method === "GET" && url.pathname === "/api/agent") {
        const agentId = url.searchParams.get("id");
        if (!agentId) {
          return new Response(JSON.stringify({ error: "Agent ID is required" }), { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const agent = await env.AGENTS.get(agentId);
        if (!agent) {
          return new Response(JSON.stringify({ error: "Agent not found" }), { 
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          agent: JSON.parse(agent),
          timestamp: new Date().toISOString()
        }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      // POST /api/agent - Tworzenie/aktualizacja agenta
      if (request.method === "POST" && url.pathname === "/api/agent") {
        const data = await request.json<AgentData>();
        
        if (!data?.id) {
          return new Response(JSON.stringify({ error: "Agent ID is required" }), { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const agentData = {
          ...data,
          updated_at: new Date().toISOString(),
          created_at: data.created_at || new Date().toISOString()
        };

        await env.AGENTS.put(data.id, JSON.stringify(agentData));
        
        return new Response(JSON.stringify({
          success: true,
          message: "Agent saved successfully",
          agent: agentData
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ error: 'Endpoint not found' }), { 
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error('Agents API Error:', error);
      
      return new Response(JSON.stringify({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
}