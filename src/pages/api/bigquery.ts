import type { APIRoute } from 'astro';
import { BigQuery } from '@google-cloud/bigquery';

// Helper to get secrets from the environment
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

let bigquery: BigQuery;

// Initialize the BigQuery client, caching it for reuse
function initializeBigQuery(env: Record<string, any>) {
  if (bigquery) return;

  const projectId = env.GCP_PROJECT_ID;
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;

  if (!projectId || !keyJson) {
    throw new Error('GCP_PROJECT_ID and GCP_SERVICE_ACCOUNT_KEY must be configured in environment secrets.');
  }

  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error('GCP_SERVICE_ACCOUNT_KEY secret is not a valid JSON string.');
  }

  bigquery = new BigQuery({
    projectId,
    credentials,
  });
  console.log('BigQuery client initialized successfully.');
}

// Example queries for demonstration when credentials are not configured
const EXAMPLE_QUERIES = [
  {
    query: "SELECT 1 as test_column",
    results: [{ test_column: 1 }],
    rowCount: 1,
    executionTime: "45ms"
  },
  {
    query: "SELECT 'GitHub' as platform, 'JavaScript' as language, 1234567 as repos_count",
    results: [{ platform: 'GitHub', language: 'JavaScript', repos_count: 1234567 }],
    rowCount: 1,
    executionTime: "62ms"
  },
  {
    query: "SELECT language.name, COUNT(*) as count FROM `bigquery-public-data.github_repos.languages`",
    results: [
      { name: 'JavaScript', count: 2456789 },
      { name: 'Python', count: 1834567 },
      { name: 'Java', count: 1523456 },
      { name: 'TypeScript', count: 987654 },
      { name: 'Go', count: 654321 }
    ],
    rowCount: 5,
    executionTime: "1.2s"
  }
];

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const body = await request.json();
    const query = body.query;

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ status: 'error', message: 'Query is required and must be a string.' }), { status: 400 });
    }

    // Check if GCP credentials are configured
    const projectId = env.GCP_PROJECT_ID;
    const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;

    if (!projectId || !keyJson) {
      // Return example data when credentials are not configured
      console.log('BigQuery credentials not configured, returning example data');
      
      // Find matching example or return default
      const example = EXAMPLE_QUERIES.find(ex => 
        query.toLowerCase().includes(ex.query.toLowerCase().split(' ')[1]) // Simple matching
      ) || EXAMPLE_QUERIES[0];

      return new Response(JSON.stringify({
        status: 'success',
        query: query,
        rowCount: example.rowCount,
        executionTime: example.executionTime,
        results: example.results,
        note: 'Przykładowe dane - skonfiguruj GCP_PROJECT_ID i GCP_SERVICE_ACCOUNT_KEY dla prawdziwych zapytań'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Real BigQuery execution when credentials are available
    initializeBigQuery(env);
    const startTime = Date.now();
    
    const [job] = await bigquery.createQueryJob({ query: query });
    console.log(`BigQuery job ${job.id} started.`);

    const [rows] = await job.getQueryResults();
    const executionTime = `${Date.now() - startTime}ms`;

    return new Response(JSON.stringify({
      status: 'success',
      query: query,
      rowCount: rows.length,
      executionTime: executionTime,
      results: rows
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("BigQuery API Error:", error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to execute BigQuery query.'
    }), { status: 500 });
  }
};
