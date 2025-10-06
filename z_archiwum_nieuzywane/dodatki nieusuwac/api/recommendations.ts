import type { APIRoute } from 'astro';
import { getGoogleDriveData } from '../../utils/google-drive-integration';

interface RecommendationRequest {
  userProfile: string;
  recommendationType: 'products' | 'content' | 'learning' | 'business' | 'technology' | 'mixed';
  contextData?: string;
  selectedModels: string[];
  useGoogleDrive?: boolean;
  driveDataTypes?: string[];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: RecommendationRequest = await request.json();
    const { userProfile, recommendationType, contextData, selectedModels, useGoogleDrive, driveDataTypes } = body;
    
    if (!userProfile || !selectedModels || selectedModels.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'User profile and selected models are required',
        status: 'error'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get Google Drive context if enabled
    let driveContext = '';
    if (useGoogleDrive) {
      try {
        driveContext = await getGoogleDriveData(import.meta.env, driveDataTypes || []);
      } catch (error) {
        console.warn('Google Drive integration failed:', error);
        driveContext = 'Google Drive: Nie skonfigurowano lub błąd połączenia';
      }
    }

    // Generate recommendations using multiple models
    const modelResults = await Promise.allSettled(
      selectedModels.map(modelName => 
        generateRecommendationsWithModel(modelName, userProfile, recommendationType, contextData, driveContext)
      )
    );

    // Process results
    const successfulResults = modelResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    const failedModels = modelResults
      .map((result, index) => ({ result, model: selectedModels[index] }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ model }) => model);

    // Combine and rank recommendations
    const combinedRecommendations = combineAndRankRecommendations(successfulResults);
    
    // Generate AI insights
    const aiInsights = generateAIInsights(userProfile, combinedRecommendations, successfulResults);

    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      userProfile: userProfile.substring(0, 100) + '...', // Truncated for privacy
      recommendationType,
      modelsUsed: selectedModels.filter(model => !failedModels.includes(model)),
      failedModels,
      recommendations: combinedRecommendations,
      aiInsights,
      metadata: {
        totalModels: selectedModels.length,
        successfulModels: successfulResults.length,
        processingTime: Math.random() * 3000 + 1000, // ms
        googleDriveUsed: useGoogleDrive,
        dataSourcesCount: useGoogleDrive ? 3 : 2
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      status: 'error',
      message: error?.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function generateRecommendationsWithModel(
  modelName: string, 
  userProfile: string, 
  type: string, 
  context: string = '', 
  driveContext: string
): Promise<any> {
  const prompt = `
Jesteś ekspertem od rekomendacji. Przeanalizuj profil użytkownika i wygeneruj 3-5 spersonalizowanych rekomendacji.

PROFIL UŻYTKOWNIKA:
${userProfile}

TYP REKOMENDACJI: ${type}

DODATKOWY KONTEKST:
${context || 'Brak dodatkowego kontekstu'}

${driveContext ? `DANE Z GOOGLE DRIVE:\n${driveContext}` : ''}

WYMAGANIA:
- Rekomendacje muszą być konkretne i praktyczne
- Podaj tytuł, opis, powód rekomendacji
- Oceń dopasowanie w skali 1-100
- Uwzględnij budżet i czas realizacji
- Odpowiadaj w języku polskim

FORMAT ODPOWIEDZI:
{
  "recommendations": [
    {
      "title": "Tytuł rekomendacji",
      "description": "Szczegółowy opis",
      "reason": "Dlaczego to pasuje do profilu",
      "score": 95,
      "category": "Kategoria",
      "price": "Koszt",
      "timeframe": "Czas realizacji",
      "priority": "high|medium|low"
    }
  ],
  "summary": "Krótkie podsumowanie analizy"
}
`;

  try {
    // Mock response for now - in production, this would call the actual AI model
    const mockResponse = {
      recommendations: [
        {
          title: `Rekomendacja z ${modelName}`,
          description: `Spersonalizowana rekomendacja wygenerowana przez model ${modelName} na podstawie Twojego profilu.`,
          reason: `Analiza przez ${modelName} wskazuje wysokie dopasowanie`,
          score: Math.floor(Math.random() * 20 + 80),
          category: type,
          price: 'Do ustalenia',
          timeframe: 'Zależy od implementacji',
          priority: 'medium'
        }
      ],
      summary: `Analiza wykonana przez ${modelName}`
    };

    return {
      model: modelName,
      success: true,
      ...mockResponse
    };

  } catch (error: any) {
    console.error(`Error with model ${modelName}:`, error);
    return {
      model: modelName,
      success: false,
      error: error?.message || 'Unknown error',
      recommendations: [],
      summary: `Błąd podczas analizy przez ${modelName}`
    };
  }
}

function combineAndRankRecommendations(modelResults: any[]): any[] {
  const allRecommendations: any[] = [];
  
  // Collect all recommendations from all models
  modelResults.forEach(result => {
    if (result.success && result.recommendations) {
      result.recommendations.forEach((rec: any) => {
        allRecommendations.push({
          ...rec,
          sourceModel: result.model
        });
      });
    }
  });

  // Sort by score
  allRecommendations.sort((a, b) => (b.score || 0) - (a.score || 0));

  // Return top 8 recommendations
  return allRecommendations.slice(0, 8);
}

function generateAIInsights(userProfile: string, recommendations: any[], modelResults: any[]): any {
  const insights = {
    profileAnalysis: [] as string[],
    recommendationTrends: [] as string[],
    modelConsensus: [] as string[],
    actionableSteps: [] as string[]
  };

  // Analyze user profile
  if (userProfile.toLowerCase().includes('ai') || userProfile.toLowerCase().includes('machine learning')) {
    insights.profileAnalysis.push('Silne zainteresowanie sztuczną inteligencją');
  }
  if (userProfile.toLowerCase().includes('cloud') || userProfile.toLowerCase().includes('aws') || userProfile.toLowerCase().includes('azure')) {
    insights.profileAnalysis.push('Doświadczenie z technologiami chmurowymi');
  }
  if (userProfile.toLowerCase().includes('python') || userProfile.toLowerCase().includes('javascript')) {
    insights.profileAnalysis.push('Umiejętności programistyczne');
  }

  // Analyze recommendation trends
  const categories = recommendations.map(r => r.category).filter(Boolean);
  const categoryCount = categories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0];
  
  if (topCategory) {
    insights.recommendationTrends.push(`Dominująca kategoria: ${topCategory[0]} (${topCategory[1]} rekomendacji)`);
  }

  // Model consensus analysis
  const modelAgreement = modelResults.filter(r => r.success).length / modelResults.length * 100;
  insights.modelConsensus.push(`Zgodność modeli: ${modelAgreement.toFixed(1)}%`);

  // Generate actionable steps
  insights.actionableSteps.push('Rozpocznij od rekomendacji o najwyższym score');
  insights.actionableSteps.push('Sprawdź dostępność budżetu dla płatnych opcji');
  insights.actionableSteps.push('Zaplanuj harmonogram realizacji');
  insights.actionableSteps.push('Monitoruj postępy i dostosowuj plan');

  return insights;
}
