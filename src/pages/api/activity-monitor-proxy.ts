import type { APIRoute } from 'astro';

// Helper to get secrets  
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : (locals as any)?.runtime?.env || {};
}

export const GET: APIRoute = async ({ params, request, locals }) => {
  try {
    const env = getEnv(locals);
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID || env.GCP_PROJECT_ID || 'mybonzo-cloud';
    
    // Build the Cloud Function URL  
    const baseUrl = env.GOOGLE_CLOUD_FUNCTION_BASE_URL || `https://europe-central2-${projectId}.cloudfunctions.net`;
    const functionUrl = `${baseUrl}/mybonzo-activity-monitor`;
    
    // Forward the request to Google Cloud Function
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const cloudFunctionUrl = new URL(functionUrl);
    searchParams.forEach((value, key) => {
      cloudFunctionUrl.searchParams.set(key, value);
    });
    
    console.log(`[Activity Monitor Proxy] Forwarding to: ${cloudFunctionUrl.toString()}`);
    
    const response = await fetch(cloudFunctionUrl.toString(), {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MyBonzo-Proxy/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Cloud Function responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60, s-maxage=120' // Cache for 1/2 minutes
      }
    });
    
  } catch (error) {
    console.error('[Activity Monitor Proxy] Error:', error);
    
    // Fallback response with mock data
    return new Response(JSON.stringify({
      error: 'Activity monitoring service temporarily unavailable',
      fallback: true,
      activities: [
        {
          timestamp: new Date().toISOString(),
          service: 'system',
          status: 'healthy',
          message: 'Fallback activity data while monitoring service is being set up'
        }
      ],
      summary: {
        totalActivities: 1,
        healthyServices: 1,
        errorCount: 0,
        lastUpdate: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID || env.GCP_PROJECT_ID || 'mybonzo-cloud';
    
    // Build the Cloud Function URL
    const baseUrl = env.GOOGLE_CLOUD_FUNCTION_BASE_URL || `https://europe-central2-${projectId}.cloudfunctions.net`;
    const functionUrl = `${baseUrl}/mybonzo-activity-monitor`;
    
    // Forward the POST request
    const body = await request.text();
    
    console.log(`[Activity Monitor Proxy] POST to: ${functionUrl}`);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MyBonzo-Proxy/1.0'
      },
      body: body
    });
    
    if (!response.ok) {
      throw new Error(`Cloud Function responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Activity Monitor Proxy] POST Error:', error);
    
    return new Response(JSON.stringify({
      error: 'Activity monitoring service temporarily unavailable',
      success: false
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};