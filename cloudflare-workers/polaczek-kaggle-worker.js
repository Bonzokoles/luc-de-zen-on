/**
 * POLACZEK Kaggle Worker - System POLACZEK_23
 * Cloudflare Worker dla integracji z Kaggle API
 * Wyszukiwanie i analiza zbiorów danych dla polskiego agenta AI
 */

// POLACZEK Kaggle Configuration
const KAGGLE_CONFIG = {
  apiBaseUrl: "https://www.kaggle.com/api/v1",
  focusDatasets: ["polish-nlp", "sentiment-analysis", "qa-datasets", "polish-language"],
  teamUsername: "polaczek-ai-team",
  researchAreas: ["polish-language", "ai-training", "nlp-models", "sentiment-analysis"]
};

// Polish Research Team
const RESEARCH_TEAM = {
  PIOTR_WISNIEWSKI: {
    name: "Piotr Wiśniewski",
    role: "ML Engineer - Kaggle Lead",
    specialization: "Dataset Discovery & Integration",
    email: "piotr.wisniewski@mybonzo.com",
    kaggle_profile: "piotr-wisniewski-ai"
  },
  ANNA_NOWAK: {
    name: "Anna Nowak", 
    role: "Data Scientist - Dataset Curator",
    specialization: "Polish Language Datasets",
    email: "anna.nowak@mybonzo.com",
    kaggle_profile: "anna-nowak-data"
  },
  MARIA_WOJCIK: {
    name: "Maria Wójcik",
    role: "NLP Expert - Language Model Trainer", 
    specialization: "Polish NLP Training Data",
    email: "maria.wojcik@mybonzo.com",
    kaggle_profile: "maria-wojcik-nlp"
  },
  JAKUB_KOWALSKI: {
    name: "Jakub Kowalski",
    role: "Lead Researcher - Project Coordinator",
    specialization: "AI Research Pipeline",
    email: "jakub.kowalski@mybonzo.com", 
    kaggle_profile: "jakub-kowalski-lead"
  }
};

// Helper functions for Kaggle operations
function validateSearchQuery(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return false;
  }
  
  // Basic validation - no special characters that could cause issues
  const validPattern = /^[a-zA-Z0-9\s\-_.,ąćęłńóśźż]+$/i;
  return validPattern.test(query);
}

function formatPolishResponse(data, operation = 'search') {
  return {
    success: true,
    operation: operation,
    timestamp: new Date().toISOString(),
    team_lead: "Piotr Wiśniewski - Kaggle Research",
    data: data,
    message_pl: "Operacja Kaggle wykonana pomyślnie",
    message_en: "Kaggle operation completed successfully"
  };
}

function formatErrorResponse(error, operation = 'search') {
  return {
    success: false,
    operation: operation,
    timestamp: new Date().toISOString(),
    team_lead: "Piotr Wiśniewski - Kaggle Research",
    error: error.message || error,
    message_pl: "Błąd podczas wykonywania operacji Kaggle",
    message_en: "Error executing Kaggle operation"
  };
}

// Simulated Kaggle API operations (replace with real Kaggle API when credentials available)
async function searchDatasets(query, category = null) {
  console.log(`🔍 Searching Kaggle datasets for: ${query}`);
  console.log(`📂 Category filter: ${category || 'all'}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock datasets relevant to Polish AI/NLP
  const mockDatasets = [
    {
      ref: "polish-nlp/sentiment-analysis-pl",
      title: "Polish Sentiment Analysis Dataset", 
      subtitle: "Comprehensive Polish text sentiment classification",
      description: "Dataset contains 50,000 Polish text samples with sentiment labels",
      size: "45.2 MB",
      downloadCount: 2847,
      voteCount: 156,
      tags: ["nlp", "polish", "sentiment-analysis", "text-classification"],
      lastUpdated: "2024-09-10",
      relevanceScore: query.toLowerCase().includes('polish') ? 0.95 : 0.7
    },
    {
      ref: "ai-research/polish-qa-dataset",
      title: "Polish Question-Answering Dataset",
      subtitle: "Q&A pairs in Polish for AI training", 
      description: "10,000 question-answer pairs in Polish language for training conversational AI",
      size: "12.8 MB",
      downloadCount: 1234,
      voteCount: 89,
      tags: ["qa", "polish", "conversational-ai", "nlp"],
      lastUpdated: "2024-09-05",
      relevanceScore: query.toLowerCase().includes('qa') || query.toLowerCase().includes('question') ? 0.9 : 0.6
    },
    {
      ref: "language-models/polish-text-corpus",
      title: "Large Polish Text Corpus",
      subtitle: "Comprehensive Polish language text collection",
      description: "Large collection of Polish texts from various domains for language model training",
      size: "2.3 GB", 
      downloadCount: 5642,
      voteCount: 312,
      tags: ["polish", "corpus", "language-model", "text-mining"],
      lastUpdated: "2024-08-28",
      relevanceScore: query.toLowerCase().includes('text') || query.toLowerCase().includes('corpus') ? 0.85 : 0.5
    }
  ];
  
  // Filter by relevance and query match
  let filteredDatasets = mockDatasets.filter(dataset => {
    const searchLower = query.toLowerCase();
    const titleMatch = dataset.title.toLowerCase().includes(searchLower);
    const descMatch = dataset.description.toLowerCase().includes(searchLower);
    const tagMatch = dataset.tags.some(tag => tag.includes(searchLower));
    
    return titleMatch || descMatch || tagMatch || dataset.relevanceScore > 0.6;
  });
  
  // Sort by relevance score
  filteredDatasets.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return {
    datasets: filteredDatasets,
    totalCount: filteredDatasets.length,
    searchQuery: query,
    category: category
  };
}

async function getDatasetDetails(datasetRef) {
  console.log(`📊 Getting details for dataset: ${datasetRef}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock detailed dataset info
  return {
    ref: datasetRef,
    title: "Dataset Details",
    description: `Detailed information for ${datasetRef}`,
    files: [
      { name: "train.csv", size: "25.4 MB" },
      { name: "test.csv", size: "8.1 MB" },
      { name: "README.md", size: "2.3 KB" }
    ],
    columns: ["text", "label", "confidence", "metadata"],
    license: "CC BY-SA 4.0",
    language: "Polish",
    lastUpdated: "2024-09-10"
  };
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json; charset=utf-8'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // Health check endpoint
      if (path === '/health' || path === '/api/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          service: 'POLACZEK Kaggle Worker',
          version: '2.3.0',
          team_lead: 'Piotr Wiśniewski',
          timestamp: new Date().toISOString()
        }), { headers: corsHeaders });
      }

      // Kaggle dataset search endpoint
      if (path === '/api/kaggle' || path === '/api/polaczek/kaggle') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({
            error: 'Method not allowed',
            message_pl: 'Tylko POST jest dozwolony dla wyszukiwania Kaggle'
          }), { status: 405, headers: corsHeaders });
        }

        const body = await request.json().catch(() => ({}));
        const { search, category } = body;

        if (!search) {
          return new Response(JSON.stringify({
            error: 'Search query is required',
            message_pl: 'Zapytanie wyszukiwania jest wymagane',
            example: { search: 'polish nlp', category: 'nlp' }
          }), { status: 400, headers: corsHeaders });
        }

        if (!validateSearchQuery(search)) {
          return new Response(JSON.stringify({
            error: 'Invalid search query',
            message_pl: 'Nieprawidłowe zapytanie wyszukiwania'
          }), { status: 400, headers: corsHeaders });
        }

        try {
          const result = await searchDatasets(search, category);
          const response = formatPolishResponse(result, 'kaggle_search');
          
          return new Response(JSON.stringify(response), { headers: corsHeaders });
        } catch (error) {
          const errorResponse = formatErrorResponse(error, 'kaggle_search');
          return new Response(JSON.stringify(errorResponse), { 
            status: 500, 
            headers: corsHeaders 
          });
        }
      }

      // Dataset details endpoint
      if (path.startsWith('/api/kaggle/dataset/') || path.startsWith('/api/polaczek/kaggle/dataset/')) {
        const datasetRef = path.split('/').pop();
        
        if (!datasetRef) {
          return new Response(JSON.stringify({
            error: 'Dataset reference is required',
            message_pl: 'Referencja do zbioru danych jest wymagana'
          }), { status: 400, headers: corsHeaders });
        }

        try {
          const result = await getDatasetDetails(datasetRef);
          const response = formatPolishResponse(result, 'dataset_details');
          
          return new Response(JSON.stringify(response), { headers: corsHeaders });
        } catch (error) {
          const errorResponse = formatErrorResponse(error, 'dataset_details');
          return new Response(JSON.stringify(errorResponse), { 
            status: 500, 
            headers: corsHeaders 
          });
        }
      }

      // Research team information endpoint
      if (path === '/api/team' || path === '/api/polaczek/team') {
        return new Response(JSON.stringify({
          service: 'POLACZEK Kaggle Research Team',
          version: '2.3.0',
          team: RESEARCH_TEAM,
          focus_areas: KAGGLE_CONFIG.researchAreas,
          message_pl: 'Zespół badawczy Kaggle dla systemu POLACZEK'
        }), { headers: corsHeaders });
      }

      // Featured datasets endpoint
      if (path === '/api/datasets' || path === '/api/polaczek/datasets') {
        return new Response(JSON.stringify({
          featured_datasets: KAGGLE_CONFIG.focusDatasets,
          research_areas: KAGGLE_CONFIG.researchAreas,
          team_username: KAGGLE_CONFIG.teamUsername,
          team_lead: 'Piotr Wiśniewski',
          message_pl: 'Rekomendowane zbiory danych Kaggle dla polskiego AI'
        }), { headers: corsHeaders });
      }

      // Default 404 response
      return new Response(JSON.stringify({
        error: 'Endpoint not found',
        message_pl: 'Nieznany endpoint API',
        available_endpoints: [
          '/api/kaggle - POST: Search datasets',
          '/api/kaggle/dataset/{ref} - GET: Dataset details',
          '/api/team - GET: Team information',
          '/api/datasets - GET: Featured datasets',
          '/health - GET: Health check'
        ]
      }), { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('POLACZEK Kaggle Worker Error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message_pl: 'Wewnętrzny błąd serwera Kaggle',
        team_contact: 'Piotr Wiśniewski - piotr.wisniewski@mybonzo.com'
      }), { status: 500, headers: corsHeaders });
    }
  }
};