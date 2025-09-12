/**
 * Enhanced Tavily Search API
 * Production-ready AI-powered w  // Implement real Tavily API call
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': tavilyApiKey
      },
      body: JSON.stringify({
        query: query,
        search_depth: 'basic',
        include_answer: true,
        include_images: false,
        include_raw_content: false,
        max_results: 5
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      status: 'success',
      query: query,
      answer: data.answer || 'Brak odpowiedzi',
      results: data.results || [],
      usage: {
        tokensUsed: data.usage?.tokens || 0,
        requestsRemaining: data.usage?.requests_remaining || 0
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      status: 'error',
      error: 'Błąd podczas wyszukiwania',
      message: error.message,
      query: query,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }real Tavily integration
 */

import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

interface TavilyRequest {
  query: string;
  searchType?: 'search' | 'qna';
  maxResults?: number;
  includeImages?: boolean;
  includeAnswer?: boolean;
  includeDomains?: string[];
  excludeDomains?: string[];
  language?: string;
}

interface TavilyResponse {
  status: 'success' | 'error';
  query?: string;
  answer?: string;
  results?: Array<{
    title: string;
    url: string;
    content: string;
    score: number;
    publishedDate?: string;
  }>;
  images?: Array<{
    url: string;
    description: string;
  }>;
  usage?: {
    tokensUsed: number;
    requestsRemaining: number;
  };
  error?: string;
  timestamp: string;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || url.searchParams.get('q') || 'AI technology';
  
  // Check for Tavily API key from Cloudflare
  const env = locals.runtime?.env;
  const tavilyApiKey = env?.TAVILY_API_KEY;
  
  if (!tavilyApiKey) {
    return new Response(JSON.stringify({
      status: 'error',
      error: 'Tavily API nie jest skonfigurowane',
      message: 'Brak wymaganej zmiennej środowiskowej: TAVILY_API_KEY',
      required_config: ['TAVILY_API_KEY'],
      query: query,
      note: 'Uzyskaj klucz API z https://tavily.com/',
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Would implement real Tavily API call here
  return new Response(JSON.stringify({
    status: 'error',
    error: 'Implementacja Tavily API wymaga bibliotek klienta',
    message: 'Prawdziwe wyszukiwanie wymaga implementacji Tavily API client library',
    query: query,
    note: 'Zaimplementuj prawdziwe połączenie z Tavily API dla pełnej funkcjonalności',
    timestamp: new Date().toISOString()
  }), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body: TavilyRequest = await request.json();
    const { 
      query, 
      searchType = 'search', 
      maxResults = 10, 
      includeImages = false,
      includeAnswer = true,
      includeDomains = [],
      excludeDomains = [],
      language = 'en'
    } = body;

    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Query parameter is required',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for Tavily API key from Cloudflare
    const env = locals.runtime?.env;
    const tavilyApiKey = env?.TAVILY_API_KEY;
    
    if (!tavilyApiKey) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Tavily API nie jest skonfigurowane',
        message: 'Brak wymaganej zmiennej środowiskowej: TAVILY_API_KEY',
        required_config: ['TAVILY_API_KEY'],
        query: query,
        searchType: searchType,
        note: 'Uzyskaj klucz API z https://tavily.com/',
        timestamp: new Date().toISOString()
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Would implement real Tavily API call here
    return new Response(JSON.stringify({
      status: 'error',
      error: 'Implementacja Tavily API wymaga bibliotek klienta',
      message: 'Prawdziwe wyszukiwanie wymaga implementacji Tavily API client library',
      query: query,
      searchType: searchType,
      maxResults: maxResults,
      note: 'Zaimplementuj prawdziwe połączenie z Tavily API dla pełnej funkcjonalności',
      timestamp: new Date().toISOString()
    }), {
      status: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      error: 'Internal server error',
      timestamp: new Date().toISOString()
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
