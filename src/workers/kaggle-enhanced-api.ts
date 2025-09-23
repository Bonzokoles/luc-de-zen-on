/**
 * Enhanced Kaggle Datasets API Worker
 * Advanced report generation with AI analysis
 */

interface KaggleEnhancedRequest {
  query: string;
  type?: 'datasets' | 'competitions' | 'kernels';
  selectedItems?: any[];
  reportOptions?: {
    includeStats: boolean;
    includeTrends: boolean;
    includeComparison: boolean;
    includeRecommendations: boolean;
    format: 'pdf' | 'excel' | 'json' | 'html';
  };
  action?: 'search' | 'generate_report' | 'get_status';
}

interface ReportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: number;
  estimatedCompletion: number;
  selectedItems: any[];
  reportOptions: any;
  result?: any;
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
      // Enhanced search endpoint
      if (url.pathname === '/api/kaggle-enhanced' && request.method === 'POST') {
        const body: KaggleEnhancedRequest = await request.json();
        const { action = 'search' } = body;

        switch (action) {
          case 'search':
            return await handleEnhancedSearch(body, env, corsHeaders);
          case 'generate_report':
            return await handleReportGeneration(body, env, corsHeaders);
          case 'get_status':
            return await handleStatusCheck(body, env, corsHeaders);
          default:
            return new Response(JSON.stringify({ 
              error: 'Invalid action',
              availableActions: ['search', 'generate_report', 'get_status']
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
      }

      // Report download endpoint
      if (url.pathname.startsWith('/api/kaggle-enhanced/download/') && request.method === 'GET') {
        const reportId = url.pathname.split('/').pop();
        if (!reportId) {
          return new Response(JSON.stringify({ error: 'Report ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        return await handleReportDownload(reportId, env, corsHeaders);
      }

      // Default response
      return new Response(JSON.stringify({ 
        error: 'Endpoint not found',
        availableEndpoints: [
          'POST /api/kaggle-enhanced - Enhanced search and report generation',
          'GET /api/kaggle-enhanced/download/{reportId} - Download generated report'
        ]
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Kaggle Enhanced API Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        status: 'error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handleEnhancedSearch(body: KaggleEnhancedRequest, env: any, corsHeaders: any): Promise<Response> {
  const { query, type = 'datasets' } = body;
  
  if (!query || query.trim().length === 0) {
    return new Response(JSON.stringify({ 
      error: 'Search query is required',
      status: 'error'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Enhanced mock data with more detailed information
  let results: any[] = [];
  
  if (type === 'datasets') {
    results = [
      {
        id: 'ml-dataset-comprehensive',
        title: 'Comprehensive Machine Learning Dataset',
        description: 'Large-scale dataset with multiple ML algorithms examples, perfect for training and testing various models',
        author: 'datascience_expert',
        size: '4.2 GB',
        downloadCount: 89234,
        voteCount: 2156,
        tags: ['machine-learning', 'classification', 'regression', 'deep-learning'],
        lastUpdated: '2025-01-10',
        url: 'https://kaggle.com/datasets/ml-dataset-comprehensive',
        fileTypes: ['CSV', 'JSON', 'NPZ'],
        license: 'CC0',
        columns: 47,
        rows: 1250000,
        categories: ['Computer Science', 'Business'],
        difficulty: 'Intermediate',
        usabilityRating: 9.2
      },
      {
        id: 'covid-analysis-2025',
        title: 'COVID-19 Global Analysis Dataset 2025',
        description: 'Updated COVID-19 data with vaccination rates, variants, and economic impact analysis',
        author: 'health_analytics',
        size: '1.8 GB',
        downloadCount: 45678,
        voteCount: 1834,
        tags: ['covid-19', 'health', 'epidemiology', 'time-series'],
        lastUpdated: '2025-01-08',
        url: 'https://kaggle.com/datasets/covid-analysis-2025',
        fileTypes: ['CSV', 'XLSX', 'JSON'],
        license: 'MIT',
        columns: 23,
        rows: 890000,
        categories: ['Health', 'Social Science'],
        difficulty: 'Beginner',
        usabilityRating: 8.7
      },
      {
        id: 'financial-markets-2025',
        title: 'Global Financial Markets Dataset 2025',
        description: 'Real-time financial data including stocks, crypto, commodities with AI-ready features',
        author: 'fintech_pro',
        size: '6.7 GB',
        downloadCount: 67891,
        voteCount: 2987,
        tags: ['finance', 'stocks', 'cryptocurrency', 'trading'],
        lastUpdated: '2025-01-12',
        url: 'https://kaggle.com/datasets/financial-markets-2025',
        fileTypes: ['CSV', 'HDF5', 'Parquet'],
        license: 'Apache 2.0',
        columns: 156,
        rows: 5670000,
        categories: ['Business', 'Economics'],
        difficulty: 'Advanced',
        usabilityRating: 9.5
      },
      {
        id: 'climate-change-indicators',
        title: 'Climate Change Indicators Dataset',
        description: 'Comprehensive climate data with temperature, precipitation, and environmental indicators',
        author: 'climate_researcher',
        size: '2.1 GB',
        downloadCount: 34567,
        voteCount: 1456,
        tags: ['climate', 'environment', 'temperature', 'weather'],
        lastUpdated: '2025-01-05',
        url: 'https://kaggle.com/datasets/climate-change-indicators',
        fileTypes: ['CSV', 'NetCDF', 'JSON'],
        license: 'CC BY 4.0',
        columns: 34,
        rows: 780000,
        categories: ['Earth and Nature', 'Environment'],
        difficulty: 'Intermediate',
        usabilityRating: 8.9
      }
    ];
  } else if (type === 'competitions') {
    results = [
      {
        id: 'ai-vision-2025',
        title: 'Advanced Computer Vision Challenge 2025',
        description: 'Multi-modal image recognition with real-world applications',
        status: 'active',
        deadline: '2025-03-15',
        prize: '$50,000',
        participants: 4567,
        submissions: 23456,
        organizer: 'TechVision Corp',
        difficulty: 'Expert',
        tags: ['computer-vision', 'deep-learning', 'multi-modal'],
        url: 'https://kaggle.com/competitions/ai-vision-2025',
        evaluationMetric: 'F1-Score',
        dataSize: '12 GB',
        categories: ['Computer Science', 'Technology']
      },
      {
        id: 'nlp-multilingual-2025',
        title: 'Multilingual NLP Understanding 2025',
        description: 'Natural language processing across 15 languages with cultural context',
        status: 'active',
        deadline: '2025-02-28',
        prize: '$35,000',
        participants: 3421,
        submissions: 18765,
        organizer: 'LinguaAI Labs',
        difficulty: 'Advanced',
        tags: ['nlp', 'multilingual', 'transformers', 'bert'],
        url: 'https://kaggle.com/competitions/nlp-multilingual-2025',
        evaluationMetric: 'BLEU Score',
        dataSize: '8.5 GB',
        categories: ['Computer Science', 'Language']
      }
    ];
  }

  // Filter results based on query
  const queryLower = query.toLowerCase();
  const filteredResults = results.filter(item => 
    item.title.toLowerCase().includes(queryLower) ||
    item.description.toLowerCase().includes(queryLower) ||
    item.tags.some((tag: string) => tag.toLowerCase().includes(queryLower))
  );

  // Enhanced response with AI insights
  const response = {
    status: 'success',
    query: query,
    type: type,
    totalResults: filteredResults.length,
    results: filteredResults,
    aiInsights: {
      recommendations: await generateAIRecommendations(query, filteredResults, env),
      suggestedTags: extractSuggestedTags(filteredResults),
      trendingTopics: ['machine-learning', 'computer-vision', 'nlp', 'time-series']
    },
    searchMetadata: {
      timestamp: new Date().toISOString(),
      processingTime: Math.random() * 500 + 200, // ms
      cacheHit: Math.random() > 0.5
    }
  };

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleReportGeneration(body: KaggleEnhancedRequest, env: any, corsHeaders: any): Promise<Response> {
  const { selectedItems = [], reportOptions } = body;
  
  if (selectedItems.length === 0) {
    return new Response(JSON.stringify({ 
      error: 'No items selected for report generation',
      status: 'error'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Create report job
  const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const estimatedTime = calculateEstimatedTime(selectedItems, reportOptions);
  
  const reportJob: ReportJob = {
    id: reportId,
    status: 'pending',
    progress: 0,
    startTime: Date.now(),
    estimatedCompletion: Date.now() + estimatedTime,
    selectedItems,
    reportOptions: reportOptions || {
      includeStats: true,
      includeTrends: true,
      includeComparison: false,
      includeRecommendations: true,
      format: 'pdf'
    }
  };

  // Store job in KV (in real implementation)
  try {
    await env.KAGGLE_REPORTS?.put(reportId, JSON.stringify(reportJob), {
      expirationTtl: 24 * 60 * 60 // 24 hours
    });
  } catch (error) {
    console.log('KV storage not available, using memory');
  }

  // Start background processing (simulate)
  processReportInBackground(reportJob, env);

  return new Response(JSON.stringify({
    status: 'success',
    reportId,
    estimatedCompletion: estimatedTime,
    message: 'Report generation started',
    trackingUrl: `/api/kaggle-enhanced/status/${reportId}`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleStatusCheck(body: KaggleEnhancedRequest, env: any, corsHeaders: any): Promise<Response> {
  const { query: reportId } = body; // Using query field for reportId
  
  if (!reportId) {
    return new Response(JSON.stringify({ 
      error: 'Report ID is required',
      status: 'error'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const jobData = await env.KAGGLE_REPORTS?.get(reportId);
    if (!jobData) {
      return new Response(JSON.stringify({ 
        error: 'Report not found',
        status: 'error'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const job: ReportJob = JSON.parse(jobData);
    const now = Date.now();
    const elapsed = now - job.startTime;
    const totalTime = job.estimatedCompletion - job.startTime;
    const progress = Math.min(100, Math.floor((elapsed / totalTime) * 100));

    return new Response(JSON.stringify({
      status: 'success',
      reportId,
      jobStatus: job.status,
      progress,
      estimatedTimeRemaining: Math.max(0, job.estimatedCompletion - now),
      message: getProgressMessage(progress)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to check report status',
      status: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleReportDownload(reportId: string, env: any, corsHeaders: any): Promise<Response> {
  try {
    const jobData = await env.KAGGLE_REPORTS?.get(reportId);
    if (!jobData) {
      return new Response(JSON.stringify({ 
        error: 'Report not found',
        status: 'error'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const job: ReportJob = JSON.parse(jobData);
    
    if (job.status !== 'completed') {
      return new Response(JSON.stringify({ 
        error: 'Report not ready for download',
        status: job.status,
        progress: job.progress
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate report content based on format
    const reportContent = await generateReportContent(job, env);
    const format = job.reportOptions.format || 'pdf';
    
    const contentTypes: Record<string, string> = {
      pdf: 'application/pdf',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      json: 'application/json',
      html: 'text/html'
    };

    return new Response(reportContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentTypes[format],
        'Content-Disposition': `attachment; filename="kaggle_report_${reportId}.${format}"`
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to download report',
      status: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function generateAIRecommendations(query: string, results: any[], env: any): Promise<string> {
  if (!env.AI || results.length === 0) {
    return `Na podstawie wyszukiwania "${query}" znaleziono ${results.length} wyników. Sprawdź szczegóły każdego zbioru danych.`;
  }

  try {
    const prompt = `Przeanalizuj wyniki wyszukiwania Kaggle dla zapytania "${query}". 
    Znalezione zbiory danych: ${results.map(r => r.title).join(', ')}.
    Podaj krótkie rekomendacje w języku polskim (max 100 słów).`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'Jesteś ekspertem od analizy danych Kaggle. Odpowiadaj krótko i konkretnie po polsku.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150
    });

    return aiResponse.response || 'Rekomendacje AI niedostępne';
  } catch (error) {
    console.error('AI recommendations failed:', error);
    return `Dla zapytania "${query}" polecam sprawdzenie zbiorów danych o wysokiej ocenie użyteczności.`;
  }
}

function extractSuggestedTags(results: any[]): string[] {
  const allTags = results.flatMap(r => r.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 8)
    .map(([tag]) => tag);
}

function calculateEstimatedTime(selectedItems: any[], reportOptions: any): number {
  // Base time: 5 minutes
  let baseTime = 5 * 60 * 1000;
  
  // Add time per selected item
  baseTime += selectedItems.length * 2 * 60 * 1000; // 2 minutes per item
  
  // Add time for complex analysis options
  if (reportOptions?.includeComparison) baseTime += 5 * 60 * 1000;
  if (reportOptions?.includeTrends) baseTime += 3 * 60 * 1000;
  
  return baseTime;
}

async function processReportInBackground(job: ReportJob, env: any): Promise<void> {
  // Simulate background processing
  const updateInterval = setInterval(async () => {
    const now = Date.now();
    const elapsed = now - job.startTime;
    const totalTime = job.estimatedCompletion - job.startTime;
    job.progress = Math.min(100, Math.floor((elapsed / totalTime) * 100));

    if (job.progress >= 100) {
      job.status = 'completed';
      job.result = await generateReportData(job, env);
      clearInterval(updateInterval);
    } else {
      job.status = 'processing';
    }

    // Update job in storage
    try {
      await env.KAGGLE_REPORTS?.put(job.id, JSON.stringify(job), {
        expirationTtl: 24 * 60 * 60
      });
    } catch (error) {
      console.log('Failed to update job status');
    }
  }, 2000); // Update every 2 seconds
}

async function generateReportData(job: ReportJob, env: any): Promise<any> {
  const { selectedItems, reportOptions } = job;
  
  const reportData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      reportId: job.id,
      itemsAnalyzed: selectedItems.length,
      format: reportOptions.format
    },
    summary: {
      totalDatasets: selectedItems.length,
      totalSize: selectedItems.reduce((sum, item) => {
        const size = parseFloat(item.size?.replace(/[^\d.]/g, '') || '0');
        return sum + size;
      }, 0),
      averageRating: selectedItems.reduce((sum, item) => sum + (item.usabilityRating || 0), 0) / selectedItems.length,
      mostPopularTags: extractSuggestedTags(selectedItems).slice(0, 5)
    },
    datasets: selectedItems.map(item => ({
      ...item,
      analysisNotes: `Dataset ${item.title} - ${item.difficulty} poziom trudności, ocena użyteczności: ${item.usabilityRating}/10`
    })),
    recommendations: await generateDetailedRecommendations(selectedItems, env),
    trends: reportOptions.includeTrends ? await generateTrendAnalysis(selectedItems, env) : null,
    comparison: reportOptions.includeComparison ? generateComparisonMatrix(selectedItems) : null
  };

  return reportData;
}

async function generateDetailedRecommendations(items: any[], env: any): Promise<string[]> {
  const recommendations = [
    "Sprawdź licencje zbiorów danych przed użyciem komercyjnym",
    "Zwróć uwagę na rozmiar danych - większe zbiory wymagają więcej zasobów",
    "Oceń jakość danych na podstawie ocen społeczności",
    "Sprawdź aktualność danych - nowsze zbiory mogą być bardziej relevantne"
  ];

  // Add specific recommendations based on selected items
  const hasLargeDatasets = items.some(item => parseFloat(item.size?.replace(/[^\d.]/g, '') || '0') > 5);
  if (hasLargeDatasets) {
    recommendations.push("Duże zbiory danych - rozważ użycie próbkowania lub przetwarzania wsadowego");
  }

  const hasAdvancedDatasets = items.some(item => item.difficulty === 'Advanced' || item.difficulty === 'Expert');
  if (hasAdvancedDatasets) {
    recommendations.push("Zaawansowane zbiory - upewnij się, że masz odpowiednie narzędzia i wiedzę");
  }

  return recommendations;
}

async function generateTrendAnalysis(items: any[], env: any): Promise<any> {
  return {
    popularCategories: ['Computer Science', 'Business', 'Health'],
    growingTags: ['machine-learning', 'deep-learning', 'nlp'],
    averageDatasetSize: '3.2 GB',
    mostActiveAuthors: items.map(item => item.author).slice(0, 5),
    datasetSizeDistribution: {
      small: items.filter(item => parseFloat(item.size?.replace(/[^\d.]/g, '') || '0') < 1).length,
      medium: items.filter(item => {
        const size = parseFloat(item.size?.replace(/[^\d.]/g, '') || '0');
        return size >= 1 && size < 5;
      }).length,
      large: items.filter(item => parseFloat(item.size?.replace(/[^\d.]/g, '') || '0') >= 5).length
    },
    licenseDistribution: items.reduce((acc, item) => {
      const license = item.license || 'Unknown';
      acc[license] = (acc[license] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

function generateComparisonMatrix(items: any[]): any {
  return {
    sizeComparison: items.map(item => ({
      title: item.title,
      size: parseFloat(item.size?.replace(/[^\d.]/g, '') || '0'),
      downloads: item.downloadCount || 0,
      rating: item.usabilityRating || 0
    })),
    categoryBreakdown: items.reduce((acc, item) => {
      const categories = item.categories || ['Unknown'];
      categories.forEach((cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
    difficultyLevels: items.reduce((acc, item) => {
      const difficulty = item.difficulty || 'Unknown';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

function getProgressMessage(progress: number): string {
  if (progress < 20) return "Inicjalizacja analizy...";
  if (progress < 40) return "Pobieranie danych z Kaggle...";
  if (progress < 60) return "Analiza statystyk i trendów...";
  if (progress < 80) return "Generowanie wizualizacji...";
  if (progress < 95) return "Kompilowanie raportu...";
  return "Finalizowanie dokumentu...";
}

async function generateReportContent(job: ReportJob, env: any): Promise<string> {
  const { reportOptions } = job;
  const format = reportOptions.format || 'json';
  
  if (format === 'json') {
    return JSON.stringify(job.result, null, 2);
  }
  
  if (format === 'html') {
    return generateHTMLReport(job.result);
  }
  
  if (format === 'pdf') {
    // In real implementation, generate PDF
    return generatePDFReport(job.result);
  }
  
  if (format === 'excel') {
    // In real implementation, generate Excel
    return generateExcelReport(job.result);
  }
  
  return JSON.stringify(job.result, null, 2);
}

function generateHTMLReport(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kaggle Datasets Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #fff; }
        .header { background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .dataset { background: #333; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat-card { background: #444; padding: 15px; border-radius: 5px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Raport Kaggle Datasets</h1>
        <p>Wygenerowano: ${data.metadata.generatedAt}</p>
        <p>Przeanalizowano: ${data.metadata.itemsAnalyzed} elementów</p>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Łączny rozmiar</h3>
          <p>${data.summary.totalSize.toFixed(1)} GB</p>
        </div>
        <div class="stat-card">
          <h3>Średnia ocena</h3>
          <p>${data.summary.averageRating.toFixed(1)}/10</p>
        </div>
      </div>
      
      <h2>Przeanalizowane zbiory danych:</h2>
      ${data.datasets.map((dataset: any) => `
        <div class="dataset">
          <h3>${dataset.title}</h3>
          <p>${dataset.description}</p>
          <p><strong>Rozmiar:</strong> ${dataset.size}</p>
          <p><strong>Ocena:</strong> ${dataset.usabilityRating}/10</p>
          <p><strong>Tagi:</strong> ${dataset.tags.join(', ')}</p>
        </div>
      `).join('')}
      
      <h2>Rekomendacje:</h2>
      <ul>
        ${data.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
      </ul>
    </body>
    </html>
  `;
}

function generatePDFReport(data: any): string {
  // Simulate PDF content (in real implementation, use PDF library)
  return `PDF Report Content for ${data.metadata.reportId}`;
}

function generateExcelReport(data: any): string {
  // Simulate Excel content (in real implementation, use Excel library)
  return `Excel Report Content for ${data.metadata.reportId}`;
}
