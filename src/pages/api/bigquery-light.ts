import type { APIRoute } from 'astro';

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

export const POST: APIRoute = async ({ request, locals }) => {
  // Using 'any' to bypass a potentially incorrect TS error about 'runtime' not existing on 'Locals'
  const env = (locals as any).runtime?.env;

  const GCP_PROJECT_ID = env?.GCP_PROJECT_ID;
  const GCP_ACCESS_TOKEN = env?.GCP_ACCESS_TOKEN;

  if (!GCP_PROJECT_ID || !GCP_ACCESS_TOKEN) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Google Cloud credentials (GCP_PROJECT_ID, GCP_ACCESS_TOKEN) are not configured in environment secrets."
    }), { status: 500 });
  }

  try {
    const body: { query?: string } = await request.json();
    const query = body.query;

    if (!query) {
      return new Response(JSON.stringify({ success: false, error: "Query is missing from request body." }), { status: 400 });
    }

    const response = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${GCP_PROJECT_ID}/queries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GCP_ACCESS_TOKEN}`,
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