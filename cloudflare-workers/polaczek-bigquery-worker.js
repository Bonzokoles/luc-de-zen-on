/**
 * POLACZEK BigQuery Worker - System POLACZEK_23
 * Cloudflare Worker dla integracji z Google BigQuery
 * Analityka danych dla polskiego agenta AI
 */

// POLACZEK BigQuery Configuration
const BIGQUERY_CONFIG = {
  projectId: "mybonzo-polaczek-analytics",
  datasetId: "polish_ai_interactions", 
  location: "europe-west1",
  tables: {
    conversations: "conversations",
    feedback: "feedback", 
    performance: "performance",
    users: "users"
  }
};

// Polish Analytics Team
const ANALYTICS_TEAM = {
  ANNA_NOWAK: {
    name: "Anna Nowak",
    role: "Data Scientist - BigQuery Lead",
    specialization: "Polish AI Analytics",
    email: "anna.nowak@mybonzo.com"
  },
  PIOTR_WISNIEWSKI: {
    name: "Piotr Wiśniewski", 
    role: "ML Engineer",
    specialization: "Query Optimization",
    email: "piotr.wisniewski@mybonzo.com"
  },
  MARIA_WOJCIK: {
    name: "Maria Wójcik",
    role: "AI Performance Analyst",
    specialization: "Model Training Data",
    email: "maria.wojcik@mybonzo.com"
  },
  JAKUB_KOWALSKI: {
    name: "Jakub Kowalski",
    role: "Lead Engineer - System Integration", 
    specialization: "BigQuery API Architecture",
    email: "jakub.kowalski@mybonzo.com"
  }
};

// Helper functions for BigQuery operations
function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    return false;
  }
  
  // Basic SQL injection protection
  const dangerousPatterns = /\b(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|TRUNCATE)\b/i;
  if (dangerousPatterns.test(query)) {
    return false;
  }
  
  return true;
}

function formatPolishResponse(data, operation = 'query') {
  return {
    success: true,
    operation: operation,
    timestamp: new Date().toISOString(),
    team_lead: "Anna Nowak - BigQuery Analytics",
    data: data,
    message_pl: "Zapytanie BigQuery wykonane pomyślnie",
    message_en: "BigQuery operation completed successfully"
  };
}

function formatErrorResponse(error, operation = 'query') {
  return {
    success: false,
    operation: operation,
    timestamp: new Date().toISOString(),
    team_lead: "Anna Nowak - BigQuery Analytics", 
    error: error.message || error,
    message_pl: "Błąd podczas wykonywania zapytania BigQuery",
    message_en: "Error executing BigQuery operation"
  };
}

// Simulated BigQuery operations (replace with real BigQuery client when needed)
async function executeQuery(query, projectId) {
  console.log(`🔍 Executing BigQuery query in project: ${projectId}`);
  console.log(`📝 Query: ${query}`);
  
  // Simulate query execution
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data for common queries
  if (query.toLowerCase().includes('select') && query.toLowerCase().includes('conversations')) {
    return {
      rows: [
        { user_id: 'user_001', message_count: 45, avg_response_time: 0.8 },
        { user_id: 'user_002', message_count: 32, avg_response_time: 0.6 },
        { user_id: 'user_003', message_count: 28, avg_response_time: 0.9 }
      ],
      totalRows: 3,
      schema: ['user_id', 'message_count', 'avg_response_time']
    };
  }
  
  return {
    rows: [{ result: 'Query executed successfully', count: 1 }],
    totalRows: 1,
    schema: ['result', 'count']
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
          service: 'POLACZEK BigQuery Worker',
          version: '2.3.0',
          team_lead: 'Anna Nowak',
          timestamp: new Date().toISOString()
        }), { headers: corsHeaders });
      }

      // BigQuery query endpoint
      if (path === '/api/bigquery' || path === '/api/polaczek/bigquery') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({
            error: 'Method not allowed',
            message_pl: 'Tylko POST jest dozwolony dla zapytań BigQuery'
          }), { status: 405, headers: corsHeaders });
        }

        const body = await request.json().catch(() => ({}));
        const { query, projectId = BIGQUERY_CONFIG.projectId } = body;

        if (!query) {
          return new Response(JSON.stringify({
            error: 'Query is required', 
            message_pl: 'Zapytanie SQL jest wymagane',
            example: 'SELECT * FROM conversations LIMIT 10'
          }), { status: 400, headers: corsHeaders });
        }

        if (!validateQuery(query)) {
          return new Response(JSON.stringify({
            error: 'Invalid or dangerous query',
            message_pl: 'Nieprawidłowe lub niebezpieczne zapytanie SQL'
          }), { status: 400, headers: corsHeaders });
        }

        try {
          const result = await executeQuery(query, projectId);
          const response = formatPolishResponse(result, 'bigquery_query');
          
          return new Response(JSON.stringify(response), { headers: corsHeaders });
        } catch (error) {
          const errorResponse = formatErrorResponse(error, 'bigquery_query');
          return new Response(JSON.stringify(errorResponse), { 
            status: 500, 
            headers: corsHeaders 
          });
        }
      }

      // Team information endpoint
      if (path === '/api/team' || path === '/api/polaczek/team') {
        return new Response(JSON.stringify({
          service: 'POLACZEK BigQuery Analytics Team',
          version: '2.3.0',
          team: ANALYTICS_TEAM,
          project_config: BIGQUERY_CONFIG,
          message_pl: 'Zespół analityczny BigQuery dla systemu POLACZEK'
        }), { headers: corsHeaders });
      }

      // Dataset information
      if (path === '/api/datasets' || path === '/api/polaczek/datasets') {
        return new Response(JSON.stringify({
          datasets: [
            {
              name: BIGQUERY_CONFIG.datasetId,
              location: BIGQUERY_CONFIG.location,
              tables: Object.keys(BIGQUERY_CONFIG.tables),
              description_pl: 'Zbiór danych interakcji z polskim agentem AI'
            }
          ],
          team_lead: 'Anna Nowak',
          message_pl: 'Dostępne zestawy danych BigQuery'
        }), { headers: corsHeaders });
      }

      // Default 404 response
      return new Response(JSON.stringify({
        error: 'Endpoint not found',
        message_pl: 'Nieznany endpoint API',
        available_endpoints: [
          '/api/bigquery - POST: Execute BigQuery',
          '/api/team - GET: Team information', 
          '/api/datasets - GET: Available datasets',
          '/health - GET: Health check'
        ]
      }), { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('POLACZEK BigQuery Worker Error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message_pl: 'Wewnętrzny błąd serwera BigQuery',
        team_contact: 'Anna Nowak - anna.nowak@mybonzo.com'
      }), { status: 500, headers: corsHeaders });
    }
  }
};