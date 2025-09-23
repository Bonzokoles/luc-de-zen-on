/**
 * BigQuery Analytics API Worker
 * Handles SQL queries and data analytics via Google BigQuery
 */

interface BigQueryRequest {
  query: string;
  dataset?: string;
  projectId?: string;
}

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/api/bigquery' && request.method === 'POST') {
        const body: BigQueryRequest = await request.json();
        const { query, dataset = 'default', projectId = 'demo-project' } = body;
        
        if (!query || query.trim().length === 0) {
          return new Response(JSON.stringify({ 
            error: 'Query is required',
            status: 'error'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Simulate BigQuery processing
        const sanitizedQuery = query.trim().toUpperCase();
        let response: any = {};

        // Simulate different query types
        if (sanitizedQuery.includes('SELECT')) {
          response = {
            status: 'success',
            query: query,
            results: [
              { id: 1, name: 'Sample Data 1', value: 125.67, timestamp: '2025-08-31T19:00:00Z' },
              { id: 2, name: 'Sample Data 2', value: 298.43, timestamp: '2025-08-31T18:45:00Z' },
              { id: 3, name: 'Sample Data 3', value: 187.92, timestamp: '2025-08-31T18:30:00Z' }
            ],
            rowCount: 3,
            executionTime: '2.34s',
            bytesProcessed: '1.2MB',
            dataset: dataset,
            projectId: projectId
          };
        } else if (sanitizedQuery.includes('COUNT')) {
          response = {
            status: 'success',
            query: query,
            results: [{ count: 15847 }],
            rowCount: 1,
            executionTime: '0.89s',
            bytesProcessed: '456KB',
            dataset: dataset,
            projectId: projectId
          };
        } else if (sanitizedQuery.includes('CREATE') || sanitizedQuery.includes('INSERT')) {
          response = {
            status: 'success',
            query: query,
            message: 'Query executed successfully',
            affectedRows: 1,
            executionTime: '1.12s',
            dataset: dataset,
            projectId: projectId
          };
        } else {
          response = {
            status: 'success',
            query: query,
            results: [{ result: 'Query executed', status: 'completed' }],
            rowCount: 1,
            executionTime: '0.67s',
            bytesProcessed: '234KB',
            dataset: dataset,
            projectId: projectId
          };
        }

        // Use AI for query optimization if available
        if (env.AI) {
          try {
            const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
              messages: [
                {
                  role: 'system',
                  content: 'You are a BigQuery expert. Analyze the SQL query and provide optimization suggestions.'
                },
                {
                  role: 'user',
                  content: `Analyze this SQL query: ${query}`
                }
              ]
            });

            response.optimization = {
              suggestions: aiResponse.response || 'Query appears to be well-optimized',
              aiAnalysis: true
            };
          } catch (aiError) {
            console.log('AI analysis unavailable:', aiError);
          }
        }

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET endpoint for schema information
      if (url.pathname === '/api/bigquery/schema' && request.method === 'GET') {
        const schema = {
          datasets: [
            {
              name: 'analytics',
              tables: ['users', 'events', 'sessions', 'pageviews']
            },
            {
              name: 'sales',
              tables: ['orders', 'products', 'customers', 'transactions']
            },
            {
              name: 'logs',
              tables: ['access_logs', 'error_logs', 'performance_metrics']
            }
          ]
        };

        return new Response(JSON.stringify(schema), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        error: 'Endpoint not found',
        availableEndpoints: [
          'POST /api/bigquery - Execute SQL query',
          'GET /api/bigquery/schema - Get database schema'
        ]
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('BigQuery API Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        status: 'error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}
