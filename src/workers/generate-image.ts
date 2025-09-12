// Deprecated duplicate worker. Use /api/generate-image instead.
export default {
  async fetch(request: Request): Promise<Response> {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    return new Response(JSON.stringify({
      error: 'This worker endpoint is deprecated. Use /api/generate-image',
      status: 410,
      migrateTo: '/api/generate-image'
    }), { status: 410, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
};
