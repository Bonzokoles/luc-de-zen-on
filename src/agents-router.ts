import { Agent, getAgentByName, routeAgentRequest } from "agents";
import type { AgentNamespace } from "agents";
import { MyBonzoAgent } from "./workers/mybonzo-agent";

// Export the Agent class for Durable Objects binding
export { MyBonzoAgent };

interface Env {
  AI: any; // Cloudflare Workers AI binding
  OPENAI_API_KEY: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  
  // Durable Object bindings
  MYBONZO_AGENT: any; // DurableObjectNamespace
  
  // KV and R2 bindings
  SESSION: any; // KVNamespace
  IMAGES: any; // R2Bucket
  KNOWLEDGE_BASE: any; // KVNamespace
  
  // Service bindings
  POLACZEK_WORKER: any; // Fetcher
}

/**
 * MyBonzo Agent Router - Enterprise-grade routing for AI Agents
 * 
 * This is the main entry point for the MyBonzo AI platform.
 * It routes requests to appropriate agents and handles both HTTP and WebSocket connections.
 * 
 * Routes:
 * - /agents/mybonzo-agent/:name - Direct agent routing
 * - /api/agent/:agentName/:instanceName - Custom agent API
 * - /ws/agent/:name - WebSocket connections to agents
 * - /health - Health check for the entire system
 */
export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    console.log(`🌐 Request: ${request.method} ${url.pathname}`);

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route 1: Automatic agent routing using Agents SDK
      // Pattern: /agents/:agent/:name
      if (url.pathname.startsWith('/agents/')) {
        console.log('🤖 Routing to agent via SDK...');
        try {
          const response = await routeAgentRequest(request, env);
          return response || new Response('Agent not found', { status: 404 });
        } catch (error) {
          console.error('Agent routing error:', error);
          return new Response('Agent routing failed', { status: 500 });
        }
      }

      // Route 2: WebSocket connections to specific agents
      // Pattern: /ws/agent/:name
      if (url.pathname.startsWith('/ws/agent/')) {
        const agentName = url.pathname.split('/')[3];
        console.log(`🔗 WebSocket connection to agent: ${agentName}`);
        
        // Upgrade to WebSocket and route to agent
        const upgradeHeader = request.headers.get('Upgrade');
        if (upgradeHeader !== 'websocket') {
          return new Response('Expected WebSocket', { status: 426 });
        }

        // Get the agent instance
        const agent = await getAgentByName(agentName, env.MYBONZO_AGENT);
        
        // Handle WebSocket upgrade and routing
        return await agent.fetch(request);
      }

      // Route 3: HTTP API for agents
      // Pattern: /api/agent/:agentName/:instanceName
      if (url.pathname.startsWith('/api/agent/')) {
        const pathParts = url.pathname.split('/');
        const agentType = pathParts[3];
        const instanceName = pathParts[4];
        
        console.log(`📡 HTTP API call to ${agentType}:${instanceName}`);
        
        // Route to specific agent instance
        const agent = await getAgentByName(instanceName, env.MYBONZO_AGENT);
        return await agent.fetch(request);
      }

      // Route 4: Health check endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          service: 'MyBonzo Agent Router',
          timestamp: new Date().toISOString(),
          agents: {
            'mybonzo-agent': 'available'
          },
          bindings: {
            AI: !!env.AI,
            IMAGES: !!env.IMAGES,
            SESSION: !!env.SESSION,
            KNOWLEDGE_BASE: !!env.KNOWLEDGE_BASE,
            POLACZEK_WORKER: !!env.POLACZEK_WORKER
          }
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Route 5: Agent discovery endpoint
      if (url.pathname === '/api/agents') {
        return new Response(JSON.stringify({
          availableAgents: [
            {
              name: 'mybonzo-agent',
              description: 'Main AI assistant with chat, image generation, and translation',
              capabilities: [
                'Real-time chat',
                'Image generation',
                'Polish-English translation',
                'Persistent memory',
                'Multi-model AI support'
              ],
              endpoints: {
                websocket: '/agents/mybonzo-agent/{instanceName}',
                http: '/api/agent/mybonzo-agent/{instanceName}'
              }
            }
          ]
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Route 6: Legacy compatibility - redirect old endpoints
      if (url.pathname.startsWith('/api/generate-image')) {
        // Redirect to agent-based image generation
        const agent = await getAgentByName('main', env.MYBONZO_AGENT);
        
        // Transform HTTP request to agent message
        const body = await request.json();
        const agentRequest = new Request(request.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'generate_image',
            ...body
          })
        });
        
        return await agent.fetch(agentRequest);
      }

      // Route 7: Legacy POLACZEK worker fallback
      if (url.pathname.startsWith('/ws/polaczek') || url.pathname.startsWith('/api/polaczek')) {
        console.log('🔄 Routing to legacy POLACZEK worker...');
        return await env.POLACZEK_WORKER.fetch(request);
      }

      // Route 8: Default agent instance for compatibility
      if (url.pathname === '/') {
        return new Response(`
<!DOCTYPE html>
<html>
<head>
    <title>MyBonzo AI Agent Platform</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .method { color: #0066cc; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🤖 MyBonzo AI Agent Platform</h1>
    <p>Enterprise-grade AI agents with persistent state and real-time communication.</p>
    
    <h2>Available Endpoints:</h2>
    
    <div class="endpoint">
        <span class="method">WS</span> /agents/mybonzo-agent/{name}
        <br>WebSocket connection to AI agent
    </div>
    
    <div class="endpoint">
        <span class="method">GET</span> /health
        <br>System health check
    </div>
    
    <div class="endpoint">
        <span class="method">GET</span> /api/agents
        <br>List available agents and capabilities
    </div>
    
    <div class="endpoint">
        <span class="method">POST</span> /api/agent/mybonzo-agent/{name}
        <br>HTTP API for agent communication
    </div>
    
    <h2>Features:</h2>
    <ul>
        <li>✅ Real-time WebSocket communication</li>
        <li>✅ Persistent conversation history</li>
        <li>✅ Multi-model AI support (OpenAI + Cloudflare Workers AI)</li>
        <li>✅ Image generation with R2 storage</li>
        <li>✅ Polish-English translation</li>
        <li>✅ Scheduled tasks and autonomous operations</li>
        <li>✅ Enterprise-grade error handling</li>
    </ul>
    
    <p><strong>Status:</strong> <span style="color: green;">🟢 Online</span></p>
</body>
</html>`, {
          headers: { 
            'Content-Type': 'text/html',
            ...corsHeaders
          }
        });
      }

      // No route matched
      return new Response(`
{
  "error": "Route not found",
  "path": "${url.pathname}",
  "availableRoutes": [
    "/agents/mybonzo-agent/{name}",
    "/api/agent/{type}/{name}",
    "/ws/agent/{name}",
    "/health",
    "/api/agents"
  ]
}`, {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Router error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  },

  /**
   * Scheduled event handler for agent maintenance
   */
  async scheduled(event: any, env: Env, ctx: any): Promise<void> {
    console.log('🔄 Running scheduled agent maintenance...');
    
    try {
      // Example: Run maintenance on a default agent instance
      const mainAgent = await getAgentByName('main', env.MYBONZO_AGENT);
      
      // Trigger scheduled tasks on the agent
      await mainAgent.fetch(new Request('https://dummy.local/scheduled', {
        method: 'POST',
        headers: { 'X-Scheduled-Event': 'true' }
      }));
      
      console.log('✅ Scheduled maintenance completed');
    } catch (error) {
      console.error('❌ Scheduled maintenance failed:', error);
    }
  }
};
