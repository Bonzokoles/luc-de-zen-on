import type { APIRoute } from 'astro';
import { BigQuery } from '@google-cloud/bigquery';
import { createErrorResponse, createSuccessResponse } from '../../../utils/corsUtils';

// --- SECURITY: Enhanced SQL Validation ---
function enhancedValidateQuery(query: string): string {
  const normalized = query.toLowerCase().replace(/\s+/g, " ").trim();
  const forbiddenPatterns = [
    /\b(drop|delete|insert|update|alter|create|truncate|grant|revoke)\b/i,
    /\bunion\s+(all\s+)?select\b/i,
    /\binto\s+(outfile|dumpfile)\b/i,
    /\bload_file\s*\(/i,
    /\bexec\s*\(/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(normalized)) {
      throw new Error(`Forbidden SQL pattern detected: ${pattern.toString()}`);
    }
  }

  // Ensure it's a SELECT statement
  if (!normalized.startsWith('select')) {
    throw new Error('Only SELECT statements are allowed.');
  }

  return query;
}

// --- MAIN API ROUTE ---
export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any)?.runtime?.env;
  if (!env?.GOOGLE_APPLICATION_CREDENTIALS || !env?.BIGQUERY_PROJECT_ID) {
    return createErrorResponse('BigQuery is not configured on the server.', 503);
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');

    if (!query) {
      return createErrorResponse('Query parameter is required.', 400);
    }

    // Validate the query before execution
    const validatedQuery = enhancedValidateQuery(query);

    const results = await executeBigQueryAnalytics(env, validatedQuery);

    return createSuccessResponse({
      success: true,
      service: 'BigQuery Analytics',
      query: validatedQuery,
      ...results,
    });

  } catch (error) {
    console.error("BigQuery API Error:", error);
    return createErrorResponse(error instanceof Error ? error.message : 'Unknown BigQuery error', 500);
  }
};

// --- BIGQUERY EXECUTION LOGIC ---
async function executeBigQueryAnalytics(env: any, query: string) {
  let bigquery;
  try {
    // The BigQuery client will automatically use the credentials
    // from the GOOGLE_APPLICATION_CREDENTIALS environment variable.
    bigquery = new BigQuery({
        projectId: env.BIGQUERY_PROJECT_ID,
    });
  } catch (authError) {
    console.error("BigQuery Authentication Error:", authError);
    throw new Error("Failed to authenticate with Google Cloud. Please check server credentials.");
  }

  const options = {
    query: query,
    location: 'US', // You can make this dynamic if needed
  };

  try {
    const [job] = await bigquery.createQueryJob(options);
    console.log(`BigQuery job ${job.id} started.`);

    const [rows] = await job.getQueryResults();

    const metadata = job.metadata.statistics;
    const totalRows = metadata.numRows ? parseInt(metadata.numRows, 10) : 0;
    const bytesProcessed = metadata.totalBytesProcessed ? parseInt(metadata.totalBytesProcessed, 10) : 0;

    console.log(`BigQuery job ${job.id} finished.`);

    return {
      results: rows,
      metadata: {
        totalRows,
        bytesProcessed,
        jobId: job.id,
        creationTime: metadata.creationTime,
        startTime: metadata.startTime,
        endTime: metadata.endTime,
      },
      jobComplete: true,
      mock: false,
    };
  } catch (queryError) {
    console.error('BigQuery Query Execution Error:', queryError);
    throw new Error(`BigQuery query failed: ${queryError.message}`);
  }
}