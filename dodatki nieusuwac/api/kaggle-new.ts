import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || 'machine learning';
    
    // Demo mode - return sample data since API keys might not be configured
    const datasets = [
      {
        ref: "tensorflow/datasets",
        title: "TensorFlow Datasets",
        subtitle: "Collection of ready-to-use datasets",
        description: "A collection of datasets ready to use with TensorFlow or other Python ML frameworks.",
        lastUpdated: "2025-08-28",
        downloadCount: 125000,
        voteCount: 1250,
        size: "2.3 GB",
        tags: ["machine learning", "tensorflow", "computer vision"]
      },
      {
        ref: "titanic/dataset", 
        title: "Titanic Dataset",
        subtitle: "Machine Learning from Disaster",
        description: "The classic Titanic dataset for practicing machine learning fundamentals.",
        lastUpdated: "2025-08-25",
        downloadCount: 89000,
        voteCount: 890,
        size: "150 KB",
        tags: ["classification", "beginner", "competition"]
      },
      {
        ref: "house-prices/dataset",
        title: "House Prices Dataset", 
        subtitle: "Advanced Regression Techniques",
        description: "Predict sales prices and practice feature engineering, RFs, and gradient boosting.",
        lastUpdated: "2025-08-20",
        downloadCount: 67000,
        voteCount: 670,
        size: "460 KB", 
        tags: ["regression", "real estate", "feature engineering"]
      }
    ];

    return new Response(JSON.stringify({
      status: 'success',
      service: 'Kaggle Datasets',
      query: search,
      data: datasets,
      mode: 'demo',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      service: 'Kaggle',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, dataset_ref } = body;

    let response;
    
    if (action === 'download_dataset' && dataset_ref) {
      // Dataset download simulation
      response = {
        action: 'download_dataset',
        dataset: dataset_ref,
        download_url: `https://www.kaggle.com/api/v1/datasets/download/${dataset_ref}`,
        status: 'ready',
        size: '245 MB',
        estimated_time: '2-3 minutes'
      };
    } else if (action === 'list_competitions') {
      // List competitions
      response = {
        action: 'list_competitions',
        competitions: [
          {
            ref: "machine-learning-challenge-2025",
            title: "Machine Learning Challenge 2025",
            deadline: "2025-12-31T23:59:59Z",
            reward: "$50,000",
            teamCount: 1247,
            submissionCount: 5892
          },
          {
            ref: "ai-vision-competition",
            title: "AI Vision Competition",
            deadline: "2025-11-15T23:59:59Z",
            reward: "$25,000",
            teamCount: 892,
            submissionCount: 3456
          }
        ]
      };
    } else {
      // Default demo response
      response = {
        action: 'demo_info',
        message: 'Kaggle API działa w trybie demo',
        available_actions: ['download_dataset', 'list_competitions'],
        note: 'Skonfiguruj KAGGLE_USERNAME i KAGGLE_KEY dla pełnej funkcjonalności'
      };
    }

    return new Response(JSON.stringify({
      status: 'success',
      service: 'Kaggle API',
      data: response,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      service: 'Kaggle',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
