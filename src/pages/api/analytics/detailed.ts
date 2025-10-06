import type { APIRoute } from 'astro';

/**
 * Analytics Detailed API
 * Provides detailed analytics data including traffic sources, locations, top pages
 */

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d';

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

    // For now, return mock detailed data until Google Analytics API is fully configured
    // In production, this would use Google Analytics Data API for detailed reports
    const mockData = {
      trafficSources: [
        { source: 'google', users: Math.floor(Math.random() * 3000) + 1500 },
        { source: 'direct', users: Math.floor(Math.random() * 2000) + 1000 },
        { source: 'facebook', users: Math.floor(Math.random() * 1500) + 500 },
        { source: 'linkedin', users: Math.floor(Math.random() * 1000) + 300 },
        { source: 'twitter', users: Math.floor(Math.random() * 800) + 200 },
        { source: 'youtube', users: Math.floor(Math.random() * 600) + 150 }
      ].sort((a, b) => b.users - a.users).slice(0, 5),
      
      userLocations: [
        { country: 'Polska', users: Math.floor(Math.random() * 4000) + 2000 },
        { country: 'Niemcy', users: Math.floor(Math.random() * 1500) + 500 },
        { country: 'Wielka Brytania', users: Math.floor(Math.random() * 1200) + 400 },
        { country: 'Stany Zjednoczone', users: Math.floor(Math.random() * 1000) + 300 },
        { country: 'Francja', users: Math.floor(Math.random() * 800) + 200 },
        { country: 'Holandia', users: Math.floor(Math.random() * 600) + 150 }
      ].sort((a, b) => b.users - a.users).slice(0, 6),
      
      topPages: [
        { path: '/', pageviews: Math.floor(Math.random() * 8000) + 4000 },
        { path: '/ai-functions/interactive-quizzes', pageviews: Math.floor(Math.random() * 3000) + 1500 },
        { path: '/ai-functions/content-generator', pageviews: Math.floor(Math.random() * 2500) + 1200 },
        { path: '/ai-functions/voice-assistant', pageviews: Math.floor(Math.random() * 2000) + 1000 },
        { path: '/ai-functions/analytics-dashboard', pageviews: Math.floor(Math.random() * 1800) + 900 },
        { path: '/ai-functions/ai-tickets', pageviews: Math.floor(Math.random() * 1500) + 800 },
        { path: '/ai-functions/customer-automation', pageviews: Math.floor(Math.random() * 1200) + 600 },
        { path: '/ai-functions/reminders-calendar', pageviews: Math.floor(Math.random() * 1000) + 500 }
      ].sort((a, b) => b.pageviews - a.pageviews).slice(0, 8),
      
      period: period,
      generatedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify({
      success: true,
      data: mockData
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600' // 10 minutes cache for detailed data
      }
    });

  } catch (error) {
    console.error('Analytics detailed error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Błąd pobierania szczegółowych danych analitycznych'
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