import type { APIRoute } from 'astro';

/**
 * BigQuery API Proxy - redirects to Google Cloud Function
 * Saves ~338KB from Cloudflare bundle by moving BigQuery logic to Cloud Functions
 */

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Get environment configuration
    const env = import.meta.env.DEV ? process.env : (locals as any)?.runtime?.env || {};
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID || env.GOOGLE_PROJECT_ID || env.GCP_PROJECT_ID;
    
    if (!projectId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Google Cloud project not configured',
        message: 'GOOGLE_CLOUD_PROJECT_ID or GOOGLE_PROJECT_ID environment variable is required',
        debug: { 
          GOOGLE_CLOUD_PROJECT_ID: !!env.GOOGLE_CLOUD_PROJECT_ID, 
          GOOGLE_PROJECT_ID: !!env.GOOGLE_PROJECT_ID,
          GCP_PROJECT_ID: !!env.GCP_PROJECT_ID
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract query parameters from original request
    const url = new URL(request.url);
    const queryParams = url.searchParams.toString();
    
    // Build Cloud Function URL
    const cloudFunctionUrl = `https://europe-west1-${projectId}.cloudfunctions.net/mybonzo-bigquery-api${queryParams ? '?' + queryParams : ''}`;
    
    // Forward request to Cloud Function
    const response = await fetch(cloudFunctionUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || 'MyBonzo-Proxy/1.0'
      }
    });

    // Forward the response
    const data = await response.json();
    
    return new Response(JSON.stringify({
      ...data,
      proxied: true,
      proxyVersion: '1.0.0',
      originalEndpoint: '/api/bigquery',
      cloudFunction: cloudFunctionUrl
    }), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=300' // 5 minute cache
      }
    });

  } catch (error) {
    console.error('BigQuery proxy error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
      service: 'BigQuery API Proxy',
      fallback: true
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = import.meta.env.DEV ? process.env : (locals as any)?.runtime?.env || {};
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID || env.GCP_PROJECT_ID;
    
    if (!projectId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Google Cloud project not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Forward POST requests (for custom queries)
    const cloudFunctionUrl = `https://europe-west1-${projectId}.cloudfunctions.net/mybonzo-bigquery-api`;
    const body = await request.text();
    
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || 'MyBonzo-Proxy/1.0'
      },
      body: body
    });

    const data = await response.json();
    
    return new Response(JSON.stringify({
      ...data,
      proxied: true,
      proxyVersion: '1.0.0'
    }), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    });

  } catch (error) {
    console.error('BigQuery POST proxy error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};