import type { APIRoute } from 'astro';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs/promises';
import path from 'path';

// Type definitions for the BigQuery REST API response
interface BigQueryError {
  message: string;
}
interface BigQueryRow {
  f: { v: string }[];
}
interface BigQuerySchemaField {
  name: string;
}
interface BigQueryResponse {
  schema: {
    fields: BigQuerySchemaField[];
  };
  rows: BigQueryRow[];
  totalRows: number;
  error?: BigQueryError;
}

async function getGcpCredentials() {
  try {
    const keyFilePath = path.resolve('docs/JSON_KEY/zenon-project-467918-5a0e85e4b6d1.json');
    const keyFileContent = await fs.readFile(keyFilePath, 'utf-8');
    const credentials = JSON.parse(keyFileContent);

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/bigquery'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    return {
      projectId: credentials.project_id,
      accessToken: accessToken?.token,
    };
  } catch (error) {
    console.error('Failed to get GCP credentials:', error);
    return { projectId: null, accessToken: null };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { projectId, accessToken } = await getGcpCredentials();

    if (!projectId || !accessToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Google Cloud credentials could not be loaded."
      }), { status: 500 });
    }

    const body: { query?: string } = await request.json();
    const query = body.query;

    if (!query) {
      return new Response(JSON.stringify({ success: false, error: "Query is missing from request body." }), { status: 400 });
    }

    const response = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        useLegacySql: false,
      }),
    });

    const data = await response.json() as BigQueryResponse;

    if (!response.ok) {
      console.error("BigQuery API Error:", data.error?.message);
      throw new Error(data.error?.message || 'BigQuery API request failed');
    }
    
    if (!data.rows) {
        return new Response(JSON.stringify({ success: true, results: [], metadata: { rowCount: 0 } }), { status: 200 });
    }

    const fields = data.schema.fields.map((field) => field.name);
    const results = data.rows.map((row) => {
        const rowObject: { [key: string]: any } = {};
        row.f.forEach((field, index) => {
            rowObject[fields[index]] = field.v;
        });
        return rowObject;
    });

    return new Response(JSON.stringify({ 
        success: true, 
        results: results, 
        metadata: { rowCount: data.totalRows || 0 } 
    }), { status: 200 });

  } catch (error: any) {
    console.error("BigQuery lightweight API error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};