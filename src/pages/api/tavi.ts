/**
 * Enhanced Tavily Search API
 * Production-ready AI-powered web search integration
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
  
  // Check for Tavily API key from environment
  const env = (locals as any)?.runtime?.env;
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

  try {
    // Dynamic import of Tavily library
    const { tavily } = await import('@tavily/core');
    
    // Initialize Tavily client
    const tvly = tavily({ apiKey: tavilyApiKey });
    
    // Perform search
    const searchResults = await tvly.search(query, {
      maxResults: 5,
      includeAnswer: true,
      includeImages: false
    });

    return new Response(JSON.stringify({
      status: 'success',
      query: query,
      results: searchResults.results || [],
      answer: searchResults.answer || null,
      total_results: searchResults.results?.length || 0,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Tavily API Error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      error: 'Błąd podczas wyszukiwania Tavily',
      message: error instanceof Error ? error.message : 'Nieznany błąd',
      query: query,
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

    // Check for Tavily API key from environment
    const env = (locals as any)?.runtime?.env;
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

    try {
      // Dynamic import of Tavily library
      const { tavily } = await import('@tavily/core');
      
      // Initialize Tavily client
      const tvly = tavily({ apiKey: tavilyApiKey });
      
      // Prepare search options
      const searchOptions: any = {};
      if (maxResults) searchOptions.maxResults = Math.min(maxResults, 20);
      if (includeImages) searchOptions.includeImages = includeImages;
      if (includeAnswer) searchOptions.includeAnswer = includeAnswer;
      if (includeDomains && includeDomains.length > 0) searchOptions.includeDomains = includeDomains;
      
      // Perform search
      const searchResults = await tvly.search(query, searchOptions);

      return new Response(JSON.stringify({
        status: 'success',
        query: query,
        searchType: searchType,
        results: searchResults.results || [],
        answer: searchResults.answer || null,
        total_results: searchResults.results?.length || 0,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Tavily API Error:', error);
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Błąd podczas wyszukiwania Tavily',
        message: error instanceof Error ? error.message : 'Nieznany błąd',
        query: query,
        searchType: searchType,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

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
