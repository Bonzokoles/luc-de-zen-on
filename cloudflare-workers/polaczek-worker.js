/**
 * POLACZEK Agent Worker - System POLACZEK_23
 * Cloudflare Worker dla polskiego agenta AI
 * Integracja z BigQuery i Kaggle
 */

// POLACZEK Agent Configuration
const POLACZEK_CONFIG = {
  name: "POLACZEK Agent",
  version: "2.3.0",
  language: "pl-PL",
  personality: "friendly_expert",
  capabilities: [
    "chat", "analysis", "translation", 
    "bigquery_integration", "kaggle_datasets",
    "polish_cultural_context"
  ]
};

// Polish Team Members for POLACZEK System
const POLISH_TEAM = {
  JAKUB_KOWALSKI: {
    name: "Jakub Kowalski",
    role: "Lead AI Engineer", 
    specialization: "Natural Language Processing",
    email: "jakub.kowalski@mybonzo.com"
  },
  ANNA_NOWAK: {
    name: "Anna Nowak",
    role: "Data Scientist",
    specialization: "BigQuery Analytics",
    email: "anna.nowak@mybonzo.com"
  },
  PIOTR_WISNIEWSKI: {
    name: "Piotr Wiśniewski", 
    role: "ML Engineer",
    specialization: "Kaggle Datasets Integration",
    email: "piotr.wisniewski@mybonzo.com"
  },
  MARIA_WOJCIK: {
    name: "Maria Wójcik",
    role: "AI Trainer",
    specialization: "Polish Language Models",
    email: "maria.wojcik@mybonzo.com"
  }
};

// BigQuery Integration for POLACZEK
const POLACZEK_BIGQUERY = {
  project_id: "mybonzo-polaczek",
  dataset_id: "polish_ai_data", 
  tables: {
    conversations: "polaczek_conversations",
    analytics: "interaction_analytics",
    feedback: "user_feedback",
    performance: "model_performance"
  },
  queries: {
    popular_topics: `
      SELECT topic, COUNT(*) as frequency
      FROM \`mybonzo-polaczek.polish_ai_data.polaczek_conversations\`
      WHERE language = 'pl'
      GROUP BY topic
      ORDER BY frequency DESC
    `,
    user_satisfaction: `
      SELECT AVG(rating) as avg_rating, manager_name
      FROM \`mybonzo-polaczek.polish_ai_data.user_feedback\`
      WHERE created_date >= CURRENT_DATE() - 30
      GROUP BY manager_name
    `
  }
};

// Kaggle Integration for Polish Datasets
const POLACZEK_KAGGLE = {
  polish_datasets: [
    {
      name: "polish-language-corpus",
      owner: "jakub-kowalski-ai",
      description: "Comprehensive Polish language dataset for NLP",
      manager: POLISH_TEAM.JAKUB_KOWALSKI.name
    },
    {
      name: "polish-sentiment-analysis",
      owner: "anna-nowak-data", 
      description: "Polish text sentiment classification dataset",
      manager: POLISH_TEAM.ANNA_NOWAK.name
    },
    {
      name: "polish-qa-dataset",
      owner: "piotr-wisniewski-ml",
      description: "Polish question-answering dataset",
      manager: POLISH_TEAM.PIOTR_WISNIEWSKI.name
    }
  ],
  api_config: {
    base_url: "https://www.kaggle.com/api/v1",
    endpoints: {
      datasets: "/datasets/list",
      download: "/datasets/download",
      metadata: "/datasets/metadata"
    }
  }
};

// Main POLACZEK Worker Handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json; charset=utf-8'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // POLACZEK Chat endpoint
      if (path === '/api/polaczek/chat') {
        return handlePolaczekChat(request, env, corsHeaders);
      }

      // BigQuery Analytics endpoint
      if (path === '/api/polaczek/bigquery') {
        return handlePolaczekBigQuery(request, env, corsHeaders);
      }

      // Kaggle Datasets endpoint  
      if (path === '/api/polaczek/kaggle') {
        return handlePolaczekKaggle(request, env, corsHeaders);
      }

      // Team information endpoint
      if (path === '/api/polaczek/team') {
        return new Response(JSON.stringify({
          config: POLACZEK_CONFIG,
          team: POLISH_TEAM,
          message: "🇵🇱 POLACZEK Agent - Polski zespół AI"
        }), { headers: corsHeaders });
      }

      // Default POLACZEK info
      return new Response(JSON.stringify({
        agent: POLACZEK_CONFIG,
        message: "🤖 Witaj! Jestem POLACZEK - Twój polski asystent AI",
        team: "Zespół polskich specjalistów AI",
        capabilities: POLACZEK_CONFIG.capabilities,
        integrations: {
          bigquery: "Aktywne - Analityka konwersacji",
          kaggle: "Aktywne - Polskie zbiory danych"
        },
        endpoints: [
          "/api/polaczek/chat",
          "/api/polaczek/bigquery", 
          "/api/polaczek/kaggle",
          "/api/polaczek/team"
        ]
      }, null, 2), { headers: corsHeaders });

    } catch (error) {
      return new Response(JSON.stringify({
        error: "Błąd systemu POLACZEK",
        details: error.message,
        contact: POLISH_TEAM.JAKUB_KOWALSKI.email
      }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};

// POLACZEK Chat Handler
async function handlePolaczekChat(request, env, headers) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: "Tylko metoda POST jest obsługiwana"
    }), { status: 405, headers });
  }

  const body = await request.json();
  const { prompt, context } = body;

  // Simulate POLACZEK AI response
  const response = {
    agent: "POLACZEK",
    response: `Cześć! Jestem POLACZEK, Twój polski asystent AI. Otrzymałem Twoją wiadomość: "${prompt}". Mogę pomóc Ci z analizą danych w BigQuery, wyszukiwaniem zbiorów danych na Kaggle lub odpowiedzieć na pytania po polsku.`,
    context: context || "general",
    managed_by: POLISH_TEAM.MARIA_WOJCIK.name,
    capabilities: POLACZEK_CONFIG.capabilities,
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(response), { headers });
}

// BigQuery Integration Handler
async function handlePolaczekBigQuery(request, env, headers) {
  const analytics = {
    bigquery_config: POLACZEK_BIGQUERY,
    sample_queries: POLACZEK_BIGQUERY.queries,
    team_lead: POLISH_TEAM.ANNA_NOWAK,
    message: "BigQuery Analytics zarządzane przez polski zespół AI",
    polish_datasets: [
      "Konwersacje POLACZEK",
      "Analityka interakcji", 
      "Opinie użytkowników",
      "Wydajność modeli"
    ]
  };

  return new Response(JSON.stringify(analytics, null, 2), { headers });
}

// Kaggle Integration Handler
async function handlePolaczekKaggle(request, env, headers) {
  const kaggleInfo = {
    kaggle_config: POLACZEK_KAGGLE,
    polish_datasets: POLACZEK_KAGGLE.polish_datasets,
    team_lead: POLISH_TEAM.PIOTR_WISNIEWSKI,
    message: "Kaggle Datasets dla polskich modeli AI",
    available_datasets: POLACZEK_KAGGLE.polish_datasets.map(dataset => ({
      name: dataset.name,
      manager: dataset.manager,
      description: dataset.description
    }))
  };

  return new Response(JSON.stringify(kaggleInfo, null, 2), { headers });
}