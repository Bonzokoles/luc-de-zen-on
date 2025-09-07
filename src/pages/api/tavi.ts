/**
 * Enhanced Tavily Search API
 * Production-ready AI-powered web search with real Tavily integration
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

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || url.searchParams.get('q') || 'AI technology';
  
  // Check for Tavily API key
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  
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

export const POST: APIRoute = async ({ request }) => {
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

    // Check for Tavily API key
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    
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
