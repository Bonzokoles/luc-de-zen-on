import type { APIRoute } from 'astro';

// Lightweight proxy for qualify-lead functionality
// Redirects to Google Cloud Function to avoid googleapis in bundle

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    
    // Get Google Cloud Function URL from environment
    const env = import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
    const cloudFunctionUrl = env.GCP_QUALIFY_LEAD_URL || 'https://your-region-your-project.cloudfunctions.net/qualify-lead';
    
    // Forward request to Google Cloud Function
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Qualify lead proxy error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Service temporarily unavailable',
      fallback: true
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};