import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const dataset = url.searchParams.get('dataset');
    const aiHelp = url.searchParams.get('ai_help');
    const instructions = url.searchParams.get('instructions');
    
    const env = (locals as any)?.runtime?.env;
    
    // Check if BigQuery is configured (but only block actual query execution)
    const missingBigQueryCreds =
      !env?.GOOGLE_CLOUD_PROJECT_ID || !env?.GOOGLE_CLOUD_PRIVATE_KEY;

    if (!query && !instructions && !aiHelp) {
      return new Response(JSON.stringify({
        success: true,
        service: 'BigQuery Analytics - Enhanced with AI',
        instructions: {
          basic_usage: 'Użyj ?query=YOUR_SQL_QUERY do wykonania zapytania',
          ai_help: 'Użyj ?ai_help=PROBLEM_DESCRIPTION do uzyskania pomocy AI',
          instructions: 'Użyj ?instructions=true do wyświetlenia wszystkich instrukcji',
          examples: {
            daily_stats: '?query=SELECT DATE(created_at) as date, COUNT(*) as visits FROM `project.dataset.analytics` GROUP BY date ORDER BY date DESC LIMIT 30',
            user_analysis: '?query=SELECT user_type, COUNT(DISTINCT user_id) as users FROM `project.dataset.users` GROUP BY user_type',
            ai_help_example: '?ai_help=Jak znaleźć top 10 stron z największą liczbą odwiedzin?'
          }
        },
        ai_capabilities: [
          'Generowanie zapytań SQL na podstawie opisów w języku naturalnym',
          'Optymalizacja istniejących zapytań',
          'Analiza wyników i generowanie raportów',
          'Sugestie najlepszych praktyk BigQuery'
        ],
        available_datasets: await getAvailableDatasets(),
        common_queries: await getCommonQueries()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await generateSQLWithAI(env, aiHelp, dataset || undefined);
      return new Response(JSON.stringify({
        success: true,
        service: 'BigQuery AI Assistant',
        question: aiHelp,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle instructions request
    if (instructions) {
      const detailedInstructions = await getDetailedInstructions(env);
      return new Response(JSON.stringify({
        success: true,
        service: 'BigQuery Analytics - Instrukcje',
        instructions: detailedInstructions,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if query is provided for analytics execution
    if (!query) {
      return new Response(JSON.stringify({
        success: false,
        service: 'BigQuery Analytics',
        error: 'Query parameter is required',
        message: 'Provide ?query=YOUR_SQL_QUERY parameter',
        timestamp: new Date().toISOString()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (missingBigQueryCreds) {
      return new Response(JSON.stringify({
        success: false,
        service: 'BigQuery Analytics',
        error: 'BigQuery nie jest skonfigurowane',
        message: 'Brak danych uwierzytelniających Google Cloud'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Execute BigQuery analytics query
    const analyticsResult = await executeBigQueryAnalytics(env, query, dataset ?? 'default');
    
    return new Response(JSON.stringify({
      success: true,
      service: 'BigQuery Analytics',
      query: query,
      dataset: dataset,
      results: analyticsResult,
      ai_insights: await generateInsights(env, analyticsResult),
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'BigQuery Analytics',
      error: error instanceof Error ? error.message : 'Nieznany błąd analytics'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function executeBigQueryAnalytics(env: any, query: string, dataset: string) {
  // For now, return mock results - will implement real BigQuery connection when you provide API key
  return {
    rows: [
      { date: '2025-09-26', users: 1250, sessions: 1680, pageviews: 4230 },
      { date: '2025-09-25', users: 1180, sessions: 1520, pageviews: 3890 },
      { date: '2025-09-24', users: 1340, sessions: 1780, pageviews: 4560 }
    ],
    schema: [
      { name: 'date', type: 'DATE' },
      { name: 'users', type: 'INTEGER' },
      { name: 'sessions', type: 'INTEGER' },
      { name: 'pageviews', type: 'INTEGER' }
    ],
    totalRows: 3,
    jobComplete: true,
    mock: true
  };
}

async function getAvailableDatasets() {
  // Mock datasets - will connect to real BigQuery when API key is provided
  return [
    {
      id: 'analytics',
      name: 'Website Analytics',
      tables: ['pageviews', 'sessions', 'users', 'events']
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Data',
      tables: ['orders', 'products', 'customers', 'transactions']
    },
    {
      id: 'marketing',
      name: 'Marketing Data',
      tables: ['campaigns', 'ads', 'conversions', 'attribution']
    }
  ];
}

async function getCommonQueries() {
  return {
    daily_stats: {
      name: 'Statystyki dzienne',
      query: 'SELECT DATE(created_at) as date, COUNT(*) as visits FROM `{project}.{dataset}.analytics` GROUP BY date ORDER BY date DESC LIMIT 30',
      description: 'Dzienne statystyki odwiedzin'
    },
    top_pages: {
      name: 'Najpopularniejsze strony',
      query: 'SELECT page_path, COUNT(*) as views FROM `{project}.{dataset}.pageviews` GROUP BY page_path ORDER BY views DESC LIMIT 20',
      description: 'Top 20 najczęściej odwiedzanych stron'
    },
    user_engagement: {
      name: 'Zaangażowanie użytkowników',
      query: 'SELECT user_type, AVG(session_duration) as avg_duration, COUNT(DISTINCT user_id) as users FROM `{project}.{dataset}.sessions` GROUP BY user_type',
      description: 'Analiza zaangażowania różnych typów użytkowników'
    },
    conversion_funnel: {
      name: 'Lejek konwersji',
      query: 'WITH funnel AS (SELECT event_name, COUNT(DISTINCT user_id) as users FROM `{project}.{dataset}.events` WHERE event_name IN ("page_view", "add_to_cart", "purchase") GROUP BY event_name) SELECT * FROM funnel ORDER BY users DESC',
      description: 'Analiza lejka konwersji e-commerce'
    }
  };
}

async function generateSQLWithAI(env: any, question: string, dataset?: string) {
  try {
    // Use Cloudflare AI to generate SQL from natural language
    if (env?.AI) {
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: `Jesteś ekspertem BigQuery SQL. Generujesz zapytania SQL na podstawie opisów w języku naturalnym. 
            
Dostępne datasety:
- analytics (tabele: pageviews, sessions, users, events)
- ecommerce (tabele: orders, products, customers, transactions)  
- marketing (tabele: campaigns, ads, conversions, attribution)

Zawsze używaj formatu: \`project.dataset.table\` w zapytaniach.
Odpowiedz tylko zapytaniem SQL bez dodatkowych komentarzy.`
          },
          {
            role: 'user',
            content: `Wygeneruj zapytanie SQL dla: ${question}${dataset ? ` używając datasetu: ${dataset}` : ''}`
          }
        ]
      });

      return {
        sql_query: aiResponse.response || 'SELECT 1 -- AI nie mogło wygenerować zapytania',
        explanation: 'Zapytanie wygenerowane przez AI na podstawie opisu',
        tips: [
          'Sprawdź czy nazwy tabel są prawidłowe',
          'Dodaj LIMIT dla dużych zapytań',
          'Użyj WHERE do filtrowania danych'
        ],
        ai_generated: true
      };
    }

    // Fallback response if AI is not available
    return {
      sql_query: 'SELECT COUNT(*) FROM `project.dataset.table` -- Zastąp właściwymi nazwami',
      explanation: `Nie mogę wygenerować zapytania dla: "${question}" - AI niedostępne`,
      tips: [
        'Sprawdź dostępność Cloudflare AI',
        'Użyj ?query= z gotowym zapytaniem SQL',
        'Zobacz ?instructions=true dla przykładów'
      ],
      ai_generated: false
    };

  } catch (error) {
    return {
      sql_query: 'SELECT "Error" as status',
      explanation: `Błąd generowania SQL: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
      tips: ['Spróbuj ponownie później', 'Użyj gotowego zapytania SQL'],
      ai_generated: false
    };
  }
}

async function getDetailedInstructions(env: any) {
  return {
    setup: {
      title: 'Konfiguracja BigQuery',
      steps: [
        'Ustaw zmienną środowiskową GOOGLE_CLOUD_PROJECT_ID',
        'Ustaw zmienną środowiskową GOOGLE_CLOUD_PRIVATE_KEY (base64)',
        'Upewnij się że masz odpowiednie uprawnienia do BigQuery'
      ],
      required_env_vars: [
        'GOOGLE_CLOUD_PROJECT_ID',
        'GOOGLE_CLOUD_PRIVATE_KEY'
      ]
    },
    usage: {
      title: 'Jak używać API',
      endpoints: {
        basic_query: {
          url: '/api/bigquery/analytics?query=YOUR_SQL',
          description: 'Wykonaj zapytanie SQL'
        },
        ai_help: {
          url: '/api/bigquery/analytics?ai_help=OPIS_PROBLEMU',
          description: 'Uzyskaj pomoc AI w generowaniu SQL'
        },
        instructions: {
          url: '/api/bigquery/analytics?instructions=true',
          description: 'Wyświetl szczegółowe instrukcje'
        }
      }
    },
    examples: {
      title: 'Przykłady zapytań',
      queries: {
        daily_stats: {
          name: 'Statystyki dzienne',
          query: 'SELECT DATE(created_at) as date, COUNT(*) as visits FROM `{project}.{dataset}.analytics` GROUP BY date ORDER BY date DESC LIMIT 30',
          description: 'Dzienne statystyki odwiedzin'
        },
        top_pages: {
          name: 'Najpopularniejsze strony',
          query: 'SELECT page_path, COUNT(*) as views FROM `{project}.{dataset}.pageviews` GROUP BY page_path ORDER BY views DESC LIMIT 20',
          description: 'Top 20 najczęściej odwiedzanych stron'
        },
        user_engagement: {
          name: 'Zaangażowanie użytkowników',
          query: 'SELECT user_type, AVG(session_duration) as avg_duration, COUNT(DISTINCT user_id) as users FROM `{project}.{dataset}.sessions` GROUP BY user_type',
          description: 'Analiza zaangażowania różnych typów użytkowników'
        }
      }
    },
    best_practices: [
      'Zawsze używaj LIMIT dla eksploracyjnych zapytań',
      'Używaj WHERE do filtrowania niepotrzebnych danych',
      'Partycjonuj tabele według dat dla lepszej wydajności',
      'Używaj SELECT tylko dla potrzebnych kolumn',
      'Testuj zapytania na małych zestawach danych'
    ],
    troubleshooting: {
      common_errors: [
        {
          error: 'Table not found',
          solution: 'Sprawdź nazwy projektu, datasetu i tabeli'
        },
        {
          error: 'Access denied',
          solution: 'Sprawdź uprawnienia konta usługowego'
        },
        {
          error: 'Query timeout',
          solution: 'Dodaj LIMIT i WHERE do filtrowania danych'
        }
      ]
    }
  };
}

async function generateInsights(env: any, results: any) {
  if (!results || !results.rows) return null;

  try {
    // Use AI to generate insights from query results
    if (env?.AI && results.rows.length > 0) {
      const dataPreview = JSON.stringify(results.rows.slice(0, 5));
      
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: 'Jesteś analitykiem danych. Analizujesz wyniki zapytań BigQuery i generujesz krótkie, praktyczne podsumowanie. Odpowiedz tylko tekstem podsumowania bez dodatkowych formatów.'
          },
          {
            role: 'user',
            content: `Przeanalizuj te dane z BigQuery i wygeneruj krótkie podsumowanie: ${dataPreview}`
          }
        ]
      });

      return {
        summary: aiResponse.response || 'Nie można wygenerować podsumowania',
        ai_generated: true,
        data_points: results.totalRows,
        timestamp: new Date().toISOString()
      };
    }

    return {
      summary: `Znaleziono ${results.totalRows} rekordów`,
      ai_generated: false,
      data_points: results.totalRows
    };

  } catch (error) {
    return {
      summary: 'Błąd podczas generowania insights',
      error: error instanceof Error ? error.message : 'Nieznany błąd',
      ai_generated: false
    };
  }
}