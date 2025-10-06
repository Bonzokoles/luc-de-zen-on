import type { APIRoute } from 'astro';
import { AnalyticsHubServiceClient } from '@google-cloud/bigquery-analyticshub';

// Helper to get secrets
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

let analyticsHubClient: AnalyticsHubServiceClient;

// Initialize the client, caching it for reuse
function initializeAnalyticsHub(env: Record<string, any>) {
  if (analyticsHubClient) return;

  const projectId = env.GCP_PROJECT_ID;
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;

  if (!projectId || !keyJson) {
    throw new Error('GCP_PROJECT_ID and GCP_SERVICE_ACCOUNT_KEY must be configured in secrets.');
  }

  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY is not a valid JSON string.');
  }

  analyticsHubClient = new AnalyticsHubServiceClient({ projectId, credentials });
  console.log('Analytics Hub client initialized successfully.');
}

// Example datasets for demonstration when GCP is not configured
const EXAMPLE_DATASETS = [
  {
    ref: 'titanic-dataset',
    title: 'Titanic - Machine Learning from Disaster',
    description: 'Klasyczny zbiór danych o pasażerach Titanica do nauki machine learning. Zawiera informacje demograficzne i czy pasażer przeżył katastrofę.',
    downloadCount: 450000,
    voteCount: 12500,
    size: '74 KB',
    lastUpdated: '2025-09-15',
    tags: ['classification', 'beginner', 'binary-classification']
  },
  {
    ref: 'house-prices-dataset',
    title: 'House Prices - Advanced Regression Techniques',
    description: 'Dane o cenach domów w Ames, Iowa. Idealny do nauki technik regresji i feature engineering.',
    downloadCount: 280000,
    voteCount: 8900,
    size: '460 KB',
    lastUpdated: '2025-09-20',
    tags: ['regression', 'intermediate', 'real-estate']
  },
  {
    ref: 'covid19-dataset',
    title: 'COVID-19 Global Dataset',
    description: 'Globalne dane o pandemii COVID-19 z aktualizacjami dziennymi. Zawiera statystyki zachorowań, zgonów i szczepień.',
    downloadCount: 150000,
    voteCount: 3400,
    size: '125 MB',
    lastUpdated: '2025-10-01',
    tags: ['time-series', 'health', 'pandemic']
  },
  {
    ref: 'ecommerce-dataset',
    title: 'E-commerce Sales Data',
    description: 'Dane sprzedaży e-commerce z informacjami o produktach, klientach i transakcjach. Świetny do analizy biznesowej.',
    downloadCount: 95000,
    voteCount: 2100,
    size: '89 MB',
    lastUpdated: '2025-09-25',
    tags: ['business', 'sales', 'customer-analysis']
  }
];

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const body = await request.json();
    const searchQuery = body.search?.toLowerCase() || '';

    // Check if GCP credentials are configured
    const projectId = env.GCP_PROJECT_ID;
    const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
    const dataExchangeLocation = env.GCP_DATA_EXCHANGE_LOCATION;
    const dataExchangeId = env.GCP_DATA_EXCHANGE_ID;

    if (!projectId || !keyJson || !dataExchangeLocation || !dataExchangeId) {
      // Return example data when credentials are not configured
      console.log('GCP credentials not configured, returning example datasets');
      
      const filteredData = searchQuery 
        ? EXAMPLE_DATASETS.filter(dataset => 
            dataset.title.toLowerCase().includes(searchQuery) ||
            dataset.description.toLowerCase().includes(searchQuery) ||
            dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery))
          )
        : EXAMPLE_DATASETS;

      return new Response(JSON.stringify({
        status: 'success',
        query: searchQuery,
        data: filteredData,
        note: 'Przykładowe zbiory danych - skonfiguruj GCP credentials dla prawdziwych zbiorów z Analytics Hub'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Real Analytics Hub execution when credentials are available
    initializeAnalyticsHub(env);

    const parent = `projects/${projectId}/locations/${dataExchangeLocation}/dataExchanges/${dataExchangeId}`;
    const [listings] = await analyticsHubClient.listListings({ parent });

    const filteredListings = searchQuery
      ? listings.filter(l => l.displayName?.toLowerCase().includes(searchQuery) || l.description?.toLowerCase().includes(searchQuery))
      : listings;

    const formattedData = filteredListings.map((listing: any) => ({
      ref: listing.name.split('/').slice(-1)[0],
      title: listing.displayName,
      description: listing.description || 'No description available.',
      downloadCount: listing.requestCount || 0,
      voteCount: 0,
      size: 'N/A',
      lastUpdated: new Date().toLocaleDateString('pl-PL'),
      tags: [listing.primaryContact, listing.category].filter(Boolean)
    }));

    return new Response(JSON.stringify({
      status: 'success',
      query: searchQuery,
      data: formattedData
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Analytics Hub (Kaggle) API Error:", error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to fetch datasets from Analytics Hub.'
    }), { status: 500 });
  }
};