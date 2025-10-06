import type { APIRoute } from 'astro';

/**
 * Analytics Real-time API
 * Provides real-time analytics data from Google Analytics
 */

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Access environment - Cloudflare runtime  
    const env = import.meta.env.DEV ? process.env : (locals as any)?.runtime?.env || {};
    const projectId = 'zenon-project-467918';
    const serviceAccountKey = env.GCP_SERVICE_ACCOUNT_KEY;

    // In development mode, use mock data even without credentials
    if (!serviceAccountKey && !import.meta.env.DEV) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Brak konfiguracji Google Cloud (GCP_SERVICE_ACCOUNT_KEY)'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For now, return mock real-time data until Google Analytics API is fully configured
    // In production, this would use Google Analytics Real Time Reporting API
    const mockData = {
      activeUsers: Math.floor(Math.random() * 50) + 10,
      currentPages: [
        { path: '/', users: Math.floor(Math.random() * 20) + 5 },
        { path: '/ai-functions/interactive-quizzes', users: Math.floor(Math.random() * 15) + 3 },
        { path: '/ai-functions/content-generator', users: Math.floor(Math.random() * 10) + 2 },
        { path: '/ai-functions/analytics-dashboard', users: Math.floor(Math.random() * 8) + 1 },
        { path: '/ai-functions/voice-assistant', users: Math.floor(Math.random() * 6) + 1 }
      ].sort((a, b) => b.users - a.users),
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify({
      success: true,
      data: mockData
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' // Real-time data should not be cached
      }
    });

  } catch (error) {
    console.error('Analytics real-time error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Błąd pobierania danych real-time'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};