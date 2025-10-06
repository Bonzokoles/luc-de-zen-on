import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  };

  try {
    // Prosta lista wszystkich dostępnych endpoint
    const apiList = {
      timestamp: new Date().toISOString(),
      apis: {
        core: [
          { name: 'Health Check', endpoint: '/api/health', status: 'active' },
          { name: 'Status Check', endpoint: '/api/status-check', status: 'active' },
          { name: 'API List', endpoint: '/api/api-list', status: 'active' }
        ],
        chat: [
          { name: 'Main Chat', endpoint: '/api/chat', status: 'active' },
          { name: 'POLACZEK Chat', endpoint: '/api/polaczek-chat', status: 'active' },
          { name: 'MyBonzo Chat', endpoint: '/api/mybonzo-chat', status: 'active' }
        ],
        ai: [
          { name: 'Voice AI', endpoint: '/api/voice', status: 'active' },
          { name: 'Image Generation', endpoint: '/api/generate-image', status: 'active' },
          { name: 'Text Enhancement', endpoint: '/api/enhance-prompt', status: 'active' }
        ],
        admin: [
          { name: 'Admin Stats', endpoint: '/api/admin/stats', status: 'active' },
          { name: 'Admin Analytics', endpoint: '/api/admin/analytics', status: 'active' },
          { name: 'Admin Users', endpoint: '/api/admin/users', status: 'active' }
        ],
        external: [
          { name: 'Kaggle API', endpoint: '/api/kaggle', status: 'depends_on_keys' },
          { name: 'BigQuery API', endpoint: '/api/bigquery', status: 'depends_on_keys' },
          { name: 'Tavily Search', endpoint: '/api/tavi', status: 'depends_on_keys' }
        ]
      },
      total_endpoints: 0,
      active_endpoints: 0
    };

    // Policz endpoint
    let total = 0;
    let active = 0;
    Object.values(apiList.apis).forEach(category => {
      category.forEach(api => {
        total++;
        if (api.status === 'active') active++;
      });
    });

    apiList.total_endpoints = total;
    apiList.active_endpoints = active;

    return new Response(JSON.stringify(apiList), {
      status: 200,
      headers
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load API list',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers
    });
  }
};