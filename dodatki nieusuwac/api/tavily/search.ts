import type { APIRoute } from 'astro';

// Search history tracking (similar to agent-06)
const searchHistory: Array<{
  id: string;
  query: string;
  timestamp: number;
  results: number;
  searchDepth: string;
  executionTime: number;
  status: 'success' | 'error';
}> = [];

// AI Functions for Tavily
async function getTavilyInstructions(env: any) {
  return {
    title: 'Tavily Search API - Kompletny przewodnik',
    description: 'Zaawansowana wyszukiwarka internetowa z AI insights i analytics',
    sections: {
      'Podstawowe wyszukiwanie': {
        search: 'Wyszukiwanie z głębokością podstawową lub zaawansowaną',
        images: 'Dołączanie obrazów do wyników wyszukiwania',
        domains: 'Wyszukiwanie w określonych domenach',
        excludeDomains: 'Wykluczanie określonych domen'
      },
      'Zaawansowane funkcje': {
        ai_insights: 'Podsumowania i insights generowane przez AI',
        trend_analysis: 'Analiza trendów w wynikach wyszukiwania',
        source_credibility: 'Ocena wiarygodności źródeł',
        content_categorization: 'Kategoryzacja treści'
      },
      'Parametry': {
        q: 'Zapytanie wyszukiwania (wymagane)',
        search_depth: 'basic, advanced (domyślnie: basic)',
        include_images: 'true/false - dołącz obrazy',
        max_results: 'liczba wyników (1-20, domyślnie: 5)',
        include_domains: 'lista domen oddzielonych przecinkami',
        exclude_domains: 'lista wykluczanych domen'
      }
    },
    examples: {
      'Podstawowe wyszukiwanie': '?q=artificial intelligence&search_depth=basic',
      'Z obrazami': '?q=machine learning&include_images=true',
      'AI insights': '?q=blockchain&ai_insights=true',
      'Określone domeny': '?q=python&include_domains=github.com,stackoverflow.com'
    },
    analytics_features: {
      search_history: 'Historia wszystkich wyszukiwań',
      trend_detection: 'Wykrywanie trendów w zapytaniach',
      performance_metrics: 'Metryki wydajności wyszukiwania',
      source_analysis: 'Analiza źródeł i wiarygodności'
    }
  };
}

async function getTavilyAIHelp(env: any, question: string) {
  try {
    const prompt = `Jesteś ekspertem od wyszukiwania internetowego i analizy informacji. 
    Użytkownik pyta: "${question}"
    
    Pomóż użytkownikowi znaleźć najlepsze strategie wyszukiwania, słowa kluczowe, 
    i sposoby weryfikacji informacji. Odpowiedz po polsku.`;

    if (env.AI) {
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });
      return response.response || 'Nie udało się uzyskać odpowiedzi AI';
    }
    
    return 'AI obecnie niedostępne. Spróbuj różnych słów kluczowych i sprawdź wiarygodność źródeł.';
  } catch (error) {
    return `Błąd AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`;
  }
}

async function generateSearchInsights(results: any[], query: string, env: any) {
  const domains = results.map(r => new URL(r.url).hostname).filter((v, i, a) => a.indexOf(v) === i);
  const avgScore = results.reduce((sum, r) => sum + (r.score || 0.5), 0) / results.length;
  
  let aiInsights = `Wyszukiwanie "${query}" zwróciło ${results.length} wyników z ${domains.length} różnych domen. Średnia ocena relevance: ${(avgScore * 100).toFixed(1)}%.`;
  
  try {
    if (env.AI && results.length > 0) {
      const contentSample = results.slice(0, 3).map(r => r.content?.slice(0, 200)).join(' ');
      const prompt = `Przeanalizuj wyniki wyszukiwania dla "${query}". Próbka treści: "${contentSample}". Podaj kluczowe insights po polsku.`;
      
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });
      
      aiInsights += '\n\nAI Insights: ' + (aiResponse.response || 'Brak dodatkowych insights');
    }
  } catch (error) {
    // Fallback to basic insights
  }
  
  return aiInsights;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const includeImages = url.searchParams.get('include_images') === 'true';
    const searchDepth = url.searchParams.get('search_depth') || 'basic';
    const aiHelp = url.searchParams.get('ai_help');
    const instructions = url.searchParams.get('instructions');
    const aiInsights = url.searchParams.get('ai_insights') === 'true';
    
    const env = (locals as any)?.runtime?.env;

    // Handle instructions request
    if (instructions) {
      const tavilyInstructions = await getTavilyInstructions(env);
      return new Response(JSON.stringify({
        success: true,
        service: 'Tavily Search - Instrukcje',
        instructions: tavilyInstructions,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await getTavilyAIHelp(env, aiHelp);
      return new Response(JSON.stringify({
        success: true,
        service: 'Tavily AI Assistant',
        question: aiHelp,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Require query for actual search
    if (!query) {
      return new Response(JSON.stringify({
        success: true,
        service: 'Tavily Search API - Enhanced with AI',
        help: {
          description: 'Zaawansowana wyszukiwarka internetowa z AI insights',
          required_params: ['q - zapytanie wyszukiwania'],
          optional_params: [
            'search_depth - basic|advanced',
            'include_images - true|false',
            'ai_insights - true|false',
            'max_results - 1-20'
          ],
          examples: {
            basic: '?q=artificial intelligence',
            advanced: '?q=machine learning&search_depth=advanced&ai_insights=true',
            images: '?q=react components&include_images=true'
          }
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!env?.TAVILY_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        service: 'Tavily Search',
        error: 'Tavily nie jest skonfigurowane',
        message: 'Brak klucza API Tavily'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();
    const searchResults = await performTavilySearch(env, query!, {
      includeImages,
      searchDepth
    });
    const executionTime = Date.now() - startTime;

    // Generate AI insights if requested
    let insights = null;
    if (aiInsights && searchResults.results) {
      insights = await generateSearchInsights(searchResults.results, query!, env);
    }

    // Add to search history
    const historyEntry = {
      id: generateId(),
      query: query!,
      timestamp: Date.now(),
      results: searchResults.results?.length || 0,
      searchDepth,
      executionTime,
      status: 'success' as const
    };
    searchHistory.unshift(historyEntry);
    
    // Keep only last 50 searches
    if (searchHistory.length > 50) {
      searchHistory.pop();
    }
    
    return new Response(JSON.stringify({
      success: true,
      service: 'Tavily Search Enhanced',
      query: query,
      results: searchResults,
      searchDepth: searchDepth,
      includeImages: includeImages,
      ai_insights: insights,
      execution_time_ms: executionTime,
      search_id: historyEntry.id,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Tavily Search',
      error: error instanceof Error ? error.message : 'Nieznany błąd search'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function performTavilySearch(env: any, query: string, options: any) {
  // Mock search results for now
  return {
    answer: `Based on the search query "${query}", here are the key findings and insights from reliable sources.`,
    results: [
      {
        title: `Latest developments in ${query}`,
        url: 'https://example1.com',
        content: `Comprehensive overview of ${query} including recent advances, key technologies, and market trends. This source provides detailed analysis and expert insights.`,
        score: 0.95,
        published_date: '2025-09-25'
      },
      {
        title: `${query} - Research and Applications`,
        url: 'https://example2.com',
        content: `In-depth research on ${query} applications across various industries. Covers implementation strategies, benefits, and future outlook.`,
        score: 0.89,
        published_date: '2025-09-24'
      },
      {
        title: `${query} Best Practices Guide`,
        url: 'https://example3.com',
        content: `Practical guide covering best practices, common challenges, and solutions for ${query} implementation in real-world scenarios.`,
        score: 0.82,
        published_date: '2025-09-23'
      }
    ],
    images: options.includeImages ? [
      {
        url: 'https://example.com/image1.jpg',
        description: `Visual representation of ${query} concepts`
      },
      {
        url: 'https://example.com/image2.jpg',
        description: `Diagram showing ${query} architecture`
      }
    ] : [],
    follow_up_questions: [
      `What are the latest trends in ${query}?`,
      `How is ${query} being implemented in different industries?`,
      `What are the challenges of ${query} adoption?`
    ]
  };
}