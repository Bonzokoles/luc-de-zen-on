import type { APIRoute } from 'astro';

// Lightweight proxy for calendar functionality  
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const env = import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
    const cloudFunctionUrl = env.GCP_CALENDAR_URL || 'https://your-region-your-project.cloudfunctions.net/calendar';
    
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GCP_FUNCTION_TOKEN || ''}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Cloud function error: ${response.status}`);
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Calendar service unavailable',
      fallback: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};