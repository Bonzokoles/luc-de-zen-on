import type { APIRoute } from 'astro';

// AI Functions for Kaggle
async function getKaggleInstructions(env: any) {
  return {
    title: 'Kaggle Datasets API - Kompletny przewodnik',
    description: 'Kompleksowy system zarządzania datasetami Kaggle z asystą AI',
    sections: {
      'Podstawowe użycie': {
        list: 'Wyświetla popularne datasety z różnych kategorii',
        search: 'Wyszukiwanie datasetów po nazwie, tagu lub kategorii', 
        trending: 'Najnowsze trendy i popularne datasety',
        analyze: 'Analiza datasetów z wykorzystaniem AI'
      },
      'Funkcje AI': {
        ai_help: 'Zadaj pytanie o datasety - AI pomoże znaleźć odpowiednie',
        recommendations: 'Personalizowane rekomendacje na podstawie projektu',
        category_analysis: 'Analiza kategorii i trendów w datasetach'
      },
      'Parametry wyszukiwania': {
        q: 'Zapytanie wyszukiwania (tekst)',
        category: 'Kategoria datasetu (np. "computer-vision", "nlp")',
        sortBy: 'Sortowanie: "hot", "recent", "votes"',
        fileType: 'Typ pliku: "csv", "json", "sqlite", "all"'
      },
      'Przykłady użycia': {
        'Wyszukaj datasety CV': '?action=search&q=computer vision&category=computer-vision',
        'Popularne datasety NLP': '?action=list&category=nlp&sortBy=votes',
        'AI pomocy': '?ai_help=Znajdź datasety do analizy sentymentu tekstów',
        'Rekomendacje': '?action=recommend&project=klasyfikacja obrazów medycznych'
      }
    },
    api_features: {
      real_time_search: 'Wyszukiwanie w czasie rzeczywistym',
      ai_insights: 'Insights generowane przez AI o datasetach',
      category_filtering: 'Zaawansowane filtrowanie po kategoriach',
      trend_analysis: 'Analiza trendów w popularności datasetów'
    }
  };
}

async function getKaggleAIHelp(env: any, question: string, category?: string) {
  try {
    const prompt = `Jesteś ekspertem od datasetów Kaggle. Użytkownik pyta: "${question}"
    ${category ? `Kategoria: ${category}` : ''}
    
    Odpowiedz po polsku, podając konkretne rekomendacje datasetów, linki i wskazówki praktyczne.
    Skup się na datasetach dostępnych na Kaggle i ich praktycznym zastosowaniu.`;

    if (env.AI) {
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });
      return response.response || 'Nie udało się uzyskać odpowiedzi AI';
    }
    
    return 'AI obecnie niedostępne. Sprawdź dokumentację Kaggle API lub skontaktuj się z pomocą.';
  } catch (error) {
    return `Błąd AI: ${error instanceof Error ? error.message : 'Nieznany błąd'}`;
  }
}

async function getKaggleCategories() {
  return [
    { name: 'computer-vision', description: 'Obrazy i widzenie komputerowe', count: 2847 },
    { name: 'nlp', description: 'Przetwarzanie języka naturalnego', count: 1593 },
    { name: 'tabular', description: 'Dane tabelaryczne', count: 4521 },
    { name: 'time-series', description: 'Szeregi czasowe', count: 892 },
    { name: 'audio', description: 'Dane audio i dźwięk', count: 456 },
    { name: 'healthcare', description: 'Zdrowie i medycyna', count: 1247 },
    { name: 'finance', description: 'Finanse i ekonomia', count: 743 },
    { name: 'sports', description: 'Sport i rekreacja', count: 389 },
    { name: 'social-science', description: 'Nauki społeczne', count: 621 },
    { name: 'earth-science', description: 'Nauki o Ziemi', count: 334 }
  ];
}

async function searchKaggleDatasets(query: string, category?: string, sortBy?: string) {
  // Mock data - replace with real Kaggle API
  const mockDatasets = [
    {
      id: 'house-prices-advanced',
      title: 'House Prices - Advanced Regression',
      description: 'Predict sales prices and practice feature engineering',
      url: 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques',
      votes: 8932,
      downloads: 125000,
      category: 'tabular',
      tags: ['regression', 'real estate', 'feature engineering'],
      fileTypes: ['csv'],
      size: '1.5 MB'
    },
    {
      id: 'mnist-digit',
      title: 'MNIST Handwritten Digits',
      description: 'Classic computer vision dataset',
      url: 'https://www.kaggle.com/datasets/hojjatk/mnist-dataset',
      votes: 12450,
      downloads: 89000,
      category: 'computer-vision',
      tags: ['computer vision', 'classification', 'deep learning'],
      fileTypes: ['csv', 'png'],
      size: '11.5 MB'
    }
  ];

  return mockDatasets.filter(dataset => {
    const matchesQuery = !query || 
      dataset.title.toLowerCase().includes(query.toLowerCase()) ||
      dataset.description.toLowerCase().includes(query.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
    const matchesCategory = !category || dataset.category === category;
    
    return matchesQuery && matchesCategory;
  });
}

async function generateSearchInsights(results: any[], query?: string | null) {
  if (!query) return 'Brak szczegółowych insights dla ogólnego wyszukiwania';
  
  const categories = results.map(r => r.category).filter((v, i, a) => a.indexOf(v) === i);
  const avgVotes = results.reduce((sum, r) => sum + r.votes, 0) / results.length;
  
  return `Znaleziono ${results.length} datasetów dla "${query}". Główne kategorie: ${categories.join(', ')}. Średnia popularność: ${Math.round(avgVotes)} głosów.`;
}

async function getPopularDatasets(category?: string) {
  const allDatasets = [
    {
      id: 'titanic',
      title: 'Titanic: Machine Learning from Disaster',
      description: 'Przewiduj przeżywalność pasażerów Titanica',
      url: 'https://www.kaggle.com/c/titanic',
      votes: 15420,
      downloads: 234000,
      category: 'tabular',
      tags: ['classification', 'beginner-friendly', 'binary-classification'],
      fileTypes: ['csv'],
      size: '89 KB'
    },
    {
      id: 'house-prices',
      title: 'House Prices - Advanced Regression',
      description: 'Przewiduj ceny domów z zaawansowaną inżynierią cech',
      url: 'https://www.kaggle.com/c/house-prices-advanced-regression-techniques',
      votes: 8932,
      downloads: 125000,
      category: 'tabular',
      tags: ['regression', 'real estate', 'feature engineering'],
      fileTypes: ['csv'],
      size: '1.5 MB'
    },
    {
      id: 'mnist',
      title: 'MNIST Handwritten Digits',
      description: 'Klasyczny dataset rozpoznawania cyfr pisanych odręcznie',
      url: 'https://www.kaggle.com/datasets/hojjatk/mnist-dataset',
      votes: 12450,
      downloads: 89000,
      category: 'computer-vision',
      tags: ['computer vision', 'classification', 'deep learning'],
      fileTypes: ['csv', 'png'],
      size: '11.5 MB'
    }
  ];

  return category ? allDatasets.filter(d => d.category === category) : allDatasets;
}

async function analyzeDatasetTrends(env: any) {
  try {
    const analysis = {
      trending_categories: ['computer-vision', 'nlp', 'time-series'],
      growth_insights: {
        'computer-vision': '+45% wzrost zainteresowania',
        'nlp': '+67% wzrost dzięki LLM',
        'time-series': '+23% wzrost w finansach'
      },
      recommended_focus: 'Datasety multimodalne zyskują na popularności',
      ai_prediction: 'W najbliższych miesiącach spodziewaj się wzrostu datasetów związanych z generative AI'
    };

    if (env.AI) {
      const prompt = 'Przeanalizuj trendy w datasetach Kaggle na 2024 rok. Odpowiedz po polsku z konkretnymi insightami.';
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });
      analysis.ai_prediction = aiResponse.response || analysis.ai_prediction;
    }

    return analysis;
  } catch (error) {
    return { error: 'Nie udało się przeanalizować trendów' };
  }
}

async function getAIRecommendations(env: any, project: string) {
  const recommendations = [
    {
      dataset: 'Titanic Dataset',
      reason: 'Idealny dla nauki klasyfikacji binarnej',
      difficulty: 'Początkujący',
      match_score: 85
    },
    {
      dataset: 'House Prices',
      reason: 'Zaawansowana inżynieria cech dla regresji',
      difficulty: 'Średniozaawansowany',
      match_score: 78
    }
  ];

  try {
    if (env.AI) {
      const prompt = `Polecaj najlepsze datasety Kaggle dla projektu: "${project}". Odpowiedz po polsku z konkretnymi nazwami datasetów i uzasadnieniem.`;
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }]
      });
      
      return {
        ai_recommendations: aiResponse.response || 'Brak rekomendacji AI',
        standard_recommendations: recommendations,
        project_analysis: `Analiza dla: ${project}`
      };
    }
  } catch (error) {
    console.error('AI recommendations error:', error);
  }

  return {
    standard_recommendations: recommendations,
    project_analysis: `Analiza dla: ${project}`,
    note: 'AI recommendations currently unavailable'
  };
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const action = params.get('action') || 'list';
    const aiHelp = params.get('ai_help');
    const instructions = params.get('instructions');
    const category = params.get('category');
    const q = params.get('q');
    
    const env = (locals as any)?.runtime?.env;
    
    // Handle instructions request
    if (instructions) {
      const kaggleInstructions = await getKaggleInstructions(env);
      return new Response(JSON.stringify({
        success: true,
        service: 'Kaggle Datasets - Instrukcje',
        instructions: kaggleInstructions,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle AI help request
    if (aiHelp) {
      const aiResponse = await getKaggleAIHelp(env, aiHelp, category || undefined);
      return new Response(JSON.stringify({
        success: true,
        service: 'Kaggle AI Assistant',
        question: aiHelp,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!action || action === 'help') {
      return new Response(JSON.stringify({
        success: true,
        service: 'Kaggle Datasets API - Enhanced with AI',
        help: {
          available_actions: [
            'list - Wyświetl popularne datasety',
            'search - Szukaj datasetów (użyj ?q=QUERY)',
            'trending - Wyświetl trendy',
            'analyze - Analiza datasetów z AI',
            'recommend - Rekomendacje AI dla projektu'
          ],
          ai_features: [
            'ai_help - Zadaj pytanie o datasety AI',
            'instructions - Szczegółowe instrukcje API',
            'category - Filtruj po kategorii'
          ],
          examples: {
            search: '?action=search&q=computer vision',
            ai_help: '?ai_help=Znajdź najlepsze datasety do analizy sentymentu',
            category: '?action=list&category=machine-learning'
          }
        },
        categories: await getKaggleCategories(),
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;
    switch (action) {
      case 'search':
        const searchResults = await searchKaggleDatasets(q || '', category || undefined, params.get('sortBy') || 'hot');
        return new Response(JSON.stringify({
          success: true,
          service: 'Kaggle Dataset Search',
          query: q || 'wszystkie',
          category: category || 'wszystkie',
          results: searchResults,
          total: searchResults.length,
          ai_insights: await generateSearchInsights(searchResults, q),
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'list':
        const datasets = await getPopularDatasets(category || undefined);
        return new Response(JSON.stringify({
          success: true,
          service: 'Kaggle Popular Datasets',
          category: category || 'wszystkie',
          datasets,
          total: datasets.length,
          categories: await getKaggleCategories(),
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'trending':
        const trending = await getTrendingDatasets(env);
        return new Response(JSON.stringify({
          success: true,
          service: 'Kaggle Trending Datasets',
          trending,
          insights: 'Trendy oparte na ostatnich 30 dniach aktywności',
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'analyze':
        const analysis = await analyzeDatasetTrends(env);
        return new Response(JSON.stringify({
          success: true,
          service: 'Kaggle Dataset Analysis',
          analysis,
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'recommend':
        const project = params.get('project') || 'machine learning';
        const recommendations = await getAIRecommendations(env, project);
        return new Response(JSON.stringify({
          success: true,
          service: 'Kaggle AI Recommendations',
          project,
          recommendations,
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        result = { error: 'Unknown action' };
        break;
    }
    
    return new Response(JSON.stringify({
      success: true,
      service: 'Kaggle Datasets',
      action: action,
      data: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Kaggle Datasets',
      error: error instanceof Error ? error.message : 'Nieznany błąd datasets'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function listPopularDatasets(env: any) {
  // Mock popular datasets
  return {
    datasets: [
      {
        title: 'Titanic: Machine Learning from Disaster',
        owner: 'titanic',
        size: '74 KB',
        downloads: 500000,
        usability: 10.0,
        tags: ['classification', 'beginner', 'binary']
      },
      {
        title: 'House Prices - Advanced Regression Techniques',
        owner: 'competitions',
        size: '460 KB',
        downloads: 250000,
        usability: 9.4,
        tags: ['regression', 'real estate', 'feature engineering']
      },
      {
        title: 'Iris Species',
        owner: 'uciml',
        size: '4 KB',
        downloads: 800000,
        usability: 10.0,
        tags: ['classification', 'beginner', 'multiclass']
      }
    ]
  };
}

async function searchDatasets(env: any, query: string) {
  // Mock search results
  return {
    query: query,
    results: [
      {
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Dataset 1`,
        owner: 'kaggle',
        size: '1.2 GB',
        downloads: 45000,
        usability: 8.7,
        tags: [query, 'research', 'analysis']
      },
      {
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Dataset 2`,
        owner: 'community',
        size: '340 MB',
        downloads: 23000,
        usability: 9.1,
        tags: [query, 'training', 'deep learning']
      }
    ]
  };
}

async function getTrendingDatasets(env: any) {
  // Mock trending datasets
  return {
    trending: [
      {
        title: 'COVID-19 Global Dataset',
        owner: 'covid19',
        size: '15 MB',
        downloads: 125000,
        trend: '+450% this week',
        tags: ['covid', 'health', 'time series']
      },
      {
        title: 'Stock Market Data',
        owner: 'finance',
        size: '2.1 GB',
        downloads: 89000,
        trend: '+230% this week',
        tags: ['finance', 'stocks', 'prediction']
      }
    ]
  };
}