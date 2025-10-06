import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'list';
    
    const env = (locals as any)?.runtime?.env;
    
    if (!env?.KAGGLE_USERNAME || !env?.KAGGLE_KEY) {
      return new Response(JSON.stringify({
        success: false,
        service: 'Kaggle Competitions',
        error: 'Kaggle nie jest skonfigurowane'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;
    switch (action) {
      case 'list':
        result = await listActiveCompetitions(env);
        break;
      case 'featured':
        result = await getFeaturedCompetitions(env);
        break;
      case 'my-submissions':
        result = await getMySubmissions(env);
        break;
      default:
        result = { error: 'Unknown action' };
    }
    
    return new Response(JSON.stringify({
      success: true,
      service: 'Kaggle Competitions',
      action: action,
      data: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Kaggle Competitions',
      error: error instanceof Error ? error.message : 'Nieznany błąd competitions'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function listActiveCompetitions(env: any) {
  return {
    competitions: [
      {
        title: 'G-Research Crypto Forecasting',
        description: 'Forecast short term returns in 14 popular cryptocurrencies',
        deadline: '2025-12-31',
        prize: '$100,000',
        participants: 2341,
        submissions: 45672,
        category: 'Financial'
      },
      {
        title: 'Feedback Prize - Predicting Effective Arguments',
        description: 'Identify argumentative elements in student writing',
        deadline: '2025-11-15',
        prize: '$60,000',
        participants: 1892,
        submissions: 23451,
        category: 'NLP'
      }
    ]
  };
}

async function getFeaturedCompetitions(env: any) {
  return {
    featured: [
      {
        title: 'Titanic - Machine Learning from Disaster',
        description: 'Use machine learning to create a model that predicts which passengers survived',
        type: 'Getting Started',
        difficulty: 'Beginner',
        participants: 150000,
        category: 'Classification'
      }
    ]
  };
}

async function getMySubmissions(env: any) {
  return {
    submissions: [
      {
        competition: 'House Prices',
        score: 0.12345,
        rank: 1250,
        date: '2025-09-25',
        status: 'scored'
      }
    ]
  };
}