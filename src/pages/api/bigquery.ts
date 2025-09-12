import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || 'SELECT 1 as test';
    
    // Check environment variables from Cloudflare
    const env = locals.runtime?.env;
    const projectId = env?.GOOGLE_CLOUD_PROJECT_ID;
    const serviceAccountKey = env?.GOOGLE_SERVICE_ACCOUNT_KEY;

    // Check if BigQuery credentials are configured
    if (!projectId || !serviceAccountKey) {
      return new Response(JSON.stringify({
        status: 'error',
        service: 'BigQuery',
        error: 'BigQuery nie jest skonfigurowane',
        message: 'Brak wymaganych zmiennych środowiskowych: GOOGLE_CLOUD_PROJECT_ID i GOOGLE_SERVICE_ACCOUNT_KEY',
        required_config: ['GOOGLE_CLOUD_PROJECT_ID', 'GOOGLE_SERVICE_ACCOUNT_KEY'],
        query: query
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // Return error indicating real implementation needed
    return new Response(JSON.stringify({
      status: 'error',
      service: 'BigQuery',
      error: 'Implementacja BigQuery wymaga Google Cloud SDK',
      message: 'Prawdziwe zapytania BigQuery wymagają implementacji Google Cloud BigQuery client library',
      projectId: projectId,
      query: query,
      note: 'Skonfiguruj Google Cloud BigQuery SDK dla pełnej funkcjonalności'
    }), {
      status: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      status: 'error',
      service: 'BigQuery',
      message: error?.message || 'Nieznany błąd BigQuery'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { query, dataset } = body;
    
    // Check environment variables from Cloudflare
    const env = locals.runtime?.env;
    const projectId = env?.GOOGLE_CLOUD_PROJECT_ID;
    const serviceAccountKey = env?.GOOGLE_SERVICE_ACCOUNT_KEY;

    // Check if BigQuery credentials are configured
    if (!projectId || !serviceAccountKey) {
      return new Response(JSON.stringify({
        status: 'error',
        service: 'BigQuery',
        error: 'BigQuery nie jest skonfigurowane',
        message: 'Brak wymaganych zmiennych środowiskowych: GOOGLE_CLOUD_PROJECT_ID i GOOGLE_SERVICE_ACCOUNT_KEY',
        required_config: ['GOOGLE_CLOUD_PROJECT_ID', 'GOOGLE_SERVICE_ACCOUNT_KEY'],
        query: query,
        dataset: dataset
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Return error indicating real implementation needed
    return new Response(JSON.stringify({
      status: 'error',
      service: 'BigQuery',
      operation: 'query_execution',
      error: 'Implementacja BigQuery wymaga Google Cloud SDK',
      message: 'Prawdziwe zapytania BigQuery wymagają implementacji Google Cloud BigQuery client library',
      projectId: projectId,
      query: query,
      dataset: dataset || 'analytics',
      note: 'Skonfiguruj Google Cloud BigQuery SDK i biblioteki dla pełnej funkcjonalności'
    }), {
      status: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      status: 'error',
      service: 'BigQuery',
      message: error?.message || 'Nieznany błąd BigQuery'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);
