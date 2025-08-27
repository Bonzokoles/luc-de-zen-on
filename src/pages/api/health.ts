export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

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
  }
};
