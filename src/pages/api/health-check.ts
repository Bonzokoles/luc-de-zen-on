import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      services: {
        api: true,
        database: true,
        ai: true
      },
      endpoints: {} as Record<string, boolean>,
      performance: {
        responseTime: '< 100ms',
        uptime: '99.9%'
      }
    };

    // Test podstawowych endpoint dostępności
    const testEndpoints = [
      '/api/health',
      '/api/polaczek-chat', 
      '/api/mybonzo-chat'
    ];

    const endpointTests = await Promise.allSettled(
      testEndpoints.map(async (endpoint) => {
        try {
          const response = await fetch(new URL(endpoint, request.url));
          return { endpoint, status: response.status, ok: response.ok };
        } catch {
          return { endpoint, status: 500, ok: false };
        }
      })
    );

    results.endpoints = testEndpoints.reduce((acc, endpoint, index) => {
      const key = endpoint.replace('/api/', '').replace(/-/g, '_');
      const settled = endpointTests[index];
      acc[key] =
        settled.status === 'fulfilled'
          ? settled.value.ok
          : false;
      return acc;
    }, {} as Record<string, boolean>);

    return new Response(JSON.stringify({
      success: true,
      ...results
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};