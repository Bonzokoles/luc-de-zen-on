import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || 'technology';
    const count = parseInt(url.searchParams.get('count') || '5');
    
    const env = (locals as any)?.runtime?.env;
    
    if (!env?.TAVILY_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        service: 'Tavily News',
        error: 'Tavily nie jest skonfigurowane'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newsResults = await getTrendingNews(env, topic, count);
    
    return new Response(JSON.stringify({
      success: true,
      service: 'Tavily News',
      topic: topic,
      count: count,
      news: newsResults,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      service: 'Tavily News',
      error: error instanceof Error ? error.message : 'Nieznany błąd news'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function getTrendingNews(env: any, topic: string, count: number) {
  // Mock trending news for different topics
  const newsTemplates = {
    technology: [
      'AI Breakthrough: New Model Achieves Human-Level Performance',
      'Tech Giants Announce Major Partnership in Cloud Computing',
      'Quantum Computing Milestone Reached by Research Team',
      'Cybersecurity Alert: New Threat Detection System Released',
      'Green Technology Investment Reaches Record High'
    ],
    business: [
      'Market Analysis: Tech Stocks Show Strong Growth',
      'Startup Funding Reaches New Heights in Q3',
      'Economic Indicators Point to Steady Recovery',
      'International Trade Agreements Create New Opportunities',
      'Sustainable Business Practices Drive Innovation'
    ],
    science: [
      'Medical Research: Promising Results in Cancer Treatment',
      'Space Exploration: New Planet Discovery Announced',
      'Climate Study Reveals Important Environmental Patterns',
      'Biotechnology Advances in Genetic Research',
      'Physics Experiment Confirms Theoretical Predictions'
    ]
  };

  const templates = newsTemplates[topic as keyof typeof newsTemplates] || newsTemplates.technology;
  
  return {
    articles: templates.slice(0, count).map((title, index) => ({
      title: title,
      url: `https://news-source-${index + 1}.com/article`,
      summary: `Recent developments in ${topic} showing significant progress and implications for the industry. This article covers key insights and expert analysis.`,
      published: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
      source: `News Source ${index + 1}`,
      category: topic,
      sentiment: index % 3 === 0 ? 'positive' : index % 3 === 1 ? 'neutral' : 'mixed'
    })),
    trending_topics: [
      `${topic} trends`,
      `latest ${topic} news`,
      `${topic} analysis`,
      `${topic} developments`
    ]
  };
}