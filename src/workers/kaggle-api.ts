/**
 * Kaggle Datasets API Worker
 * Search and retrieve information about Kaggle datasets and competitions
 */

interface KaggleRequest {
  query: string;
  type?: 'datasets' | 'competitions' | 'kernels';
  page?: number;
  sortBy?: 'relevance' | 'hottest' | 'mostVoted' | 'recent';
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
      if (url.pathname === '/api/kaggle' && request.method === 'POST') {
        const body: KaggleRequest = await request.json();
        const { query, type = 'datasets', page = 1, sortBy = 'relevance' } = body;
        
        if (!query || query.trim().length === 0) {
          return new Response(JSON.stringify({ 
            error: 'Search query is required',
            status: 'error'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Simulate Kaggle API response based on type
        let results: any[] = [];
        
        if (type === 'datasets') {
          results = [
            {
              id: 'machine-learning-dataset-1',
              title: 'Machine Learning Dataset Collection',
              description: 'Comprehensive collection of ML datasets for various algorithms',
              author: 'datascientist123',
              size: '2.3 GB',
              downloadCount: 45672,
              voteCount: 1234,
              tags: ['machine-learning', 'classification', 'regression'],
              lastUpdated: '2025-08-15',
              url: 'https://kaggle.com/datasets/machine-learning-dataset-1',
              fileTypes: ['CSV', 'JSON'],
              license: 'CC0'
            },
            {
              id: 'ai-training-data-v2',
              title: 'AI Training Data v2.0',
              description: 'Large-scale training data for deep learning models',
              author: 'ai_researcher',
              size: '5.7 GB',
              downloadCount: 23891,
              voteCount: 987,
              tags: ['artificial-intelligence', 'deep-learning', 'neural-networks'],
              lastUpdated: '2025-08-20',
              url: 'https://kaggle.com/datasets/ai-training-data-v2',
              fileTypes: ['CSV', 'NPZ', 'HDF5'],
              license: 'MIT'
            },
            {
              id: 'data-analysis-sample',
              title: 'Data Analysis Sample Set',
              description: 'Perfect dataset for learning data analysis techniques',
              author: 'analytics_pro',
              size: '892 MB',
              downloadCount: 67234,
              voteCount: 1567,
              tags: ['data-analysis', 'statistics', 'visualization'],
              lastUpdated: '2025-08-25',
              url: 'https://kaggle.com/datasets/data-analysis-sample',
              fileTypes: ['CSV', 'XLSX'],
              license: 'Apache 2.0'
            }
          ];
        } else if (type === 'competitions') {
          results = [
            {
              id: 'ml-competition-2025',
              title: 'Machine Learning Competition 2025',
              description: 'Predict customer behavior using advanced ML techniques',
              status: 'active',
              deadline: '2025-12-31',
              prize: '$25,000',
              participants: 2847,
              submissions: 15632,
              organizer: 'TechCorp AI',
              difficulty: 'intermediate',
              tags: ['prediction', 'customer-analytics', 'machine-learning'],
              url: 'https://kaggle.com/competitions/ml-competition-2025'
            },
            {
              id: 'ai-vision-challenge',
              title: 'Computer Vision Challenge',
              description: 'Advanced image recognition and classification',
              status: 'active',
              deadline: '2025-11-15',
              prize: '$15,000',
              participants: 1923,
              submissions: 8745,
              organizer: 'VisionAI Labs',
              difficulty: 'advanced',
              tags: ['computer-vision', 'image-classification', 'deep-learning'],
              url: 'https://kaggle.com/competitions/ai-vision-challenge'
            }
          ];
        } else if (type === 'kernels') {
          results = [
            {
              id: 'data-analysis-tutorial',
              title: 'Complete Data Analysis Tutorial',
              description: 'Step-by-step guide to data analysis with Python',
              author: 'data_guru',
              language: 'Python',
              voteCount: 2345,
              commentCount: 156,
              forkCount: 892,
              lastUpdated: '2025-08-28',
              tags: ['tutorial', 'python', 'pandas', 'matplotlib'],
              url: 'https://kaggle.com/kernels/data-analysis-tutorial'
            },
            {
              id: 'ml-model-comparison',
              title: 'ML Model Performance Comparison',
              description: 'Comparing different machine learning algorithms',
              author: 'ml_expert',
              language: 'Python',
              voteCount: 1678,
              commentCount: 89,
              forkCount: 567,
              lastUpdated: '2025-08-30',
              tags: ['machine-learning', 'comparison', 'scikit-learn'],
              url: 'https://kaggle.com/kernels/ml-model-comparison'
            }
          ];
        }

        // Filter results based on query (simple simulation)
        const queryLower = query.toLowerCase();
        const filteredResults = results.filter(item => 
          item.title.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.tags.some((tag: string) => tag.toLowerCase().includes(queryLower))
        );

        const response = {
          status: 'success',
          query: query,
          type: type,
          page: page,
          sortBy: sortBy,
          totalResults: filteredResults.length,
          results: filteredResults.slice((page - 1) * 10, page * 10), // Paginate results
          hasMore: filteredResults.length > page * 10
        };

        // Use AI for enhanced search if available
        if (env.AI && filteredResults.length > 0) {
          try {
            const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
              messages: [
                {
                  role: 'system',
                  content: 'You are a Kaggle expert. Provide insights about the search results and recommendations.'
                },
                {
                  role: 'user',
                  content: `User searched for: "${query}" in ${type}. Provide brief insights about these results and suggest related topics.`
                }
              ]
            });

            (response as any).aiInsights = {
              recommendations: aiResponse.response || 'Great selection of results for your query!',
              suggestedTags: ['machine-learning', 'data-science', 'python', 'analytics']
            };
          } catch (aiError) {
            console.log('AI insights unavailable:', aiError);
          }
        }

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET endpoint for trending topics
      if (url.pathname === '/api/kaggle/trending' && request.method === 'GET') {
        const trending = {
          datasets: ['machine-learning', 'covid-19', 'climate-data', 'financial-markets'],
          competitions: ['computer-vision', 'nlp', 'time-series', 'recommendation-systems'],
          tags: ['python', 'tensorflow', 'pytorch', 'pandas', 'scikit-learn']
        };

        return new Response(JSON.stringify(trending), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        error: 'Endpoint not found',
        availableEndpoints: [
          'POST /api/kaggle - Search datasets, competitions, or kernels',
          'GET /api/kaggle/trending - Get trending topics'
        ]
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Kaggle API Error:', error);
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
