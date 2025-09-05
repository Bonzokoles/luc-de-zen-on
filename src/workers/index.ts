import { Agent, getAgentByName, routeAgentRequest } from "agents";
import { MyBonzoAgent } from "./mybonzo-agent";

interface Env {
  // Environment bindings
  AI: any;
  OPENAI_API_KEY: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  
  // Durable Object bindings
  MYBONZO_AGENT: any;
  
  // KV and R2 bindings
  SESSION: any;
  IMAGES: any;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      // Route Agent requests to /agents/:agent/:name
      if (url.pathname.startsWith('/agents/')) {
        console.log(`🤖 Routing Agent request: ${url.pathname}`);
        const response = await routeAgentRequest(request, env);
        return response || new Response('Agent not found', { status: 404 });
      }

      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          agents: ['mybonzo-agent'],
          version: '1.0.0'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // API endpoints
      if (url.pathname.startsWith('/api/')) {
        return handleApiRequest(request, env, ctx);
      }

      // Default response for non-agent requests
      return new Response(JSON.stringify({
        message: 'MyBonzo AI Platform - Agents Worker',
        endpoints: {
          agents: '/agents/:agent/:name',
          health: '/health',
          api: '/api/*'
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Handle API requests (non-agent)
 */
async function handleApiRequest(request: Request, env: Env, ctx: any): Promise<Response> {
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // API routes
  switch (url.pathname) {
    case '/api/agents/status':
      return new Response(JSON.stringify({
        agents: {
          'mybonzo-agent': {
            status: 'active',
            features: ['chat', 'image-generation', 'translation'],
            connections: 'variable'
          }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    default:
      return new Response(JSON.stringify({
        error: 'API endpoint not found',
        availableEndpoints: ['/api/agents/status']
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
  }
}

// Export the Agent class for Durable Objects binding
export { MyBonzoAgent };
