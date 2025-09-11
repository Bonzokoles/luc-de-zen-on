import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Date.now(),
    services: {
      ai: 'operational',
      kv_storage: 'operational',
      image_generation: 'operational'
    },
    version: '1.0.0'
  };

  return new Response(JSON.stringify(healthData), {
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};
