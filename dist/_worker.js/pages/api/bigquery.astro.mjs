globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const GET = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "SELECT 1 as test";
    const runtime = locals?.runtime;
    const env = runtime?.env;
    const projectId = env?.GOOGLE_CLOUD_PROJECT_ID;
    const serviceAccountKey = env?.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!projectId || !serviceAccountKey) {
      return new Response(JSON.stringify({
        status: "error",
        service: "BigQuery",
        error: "BigQuery nie jest skonfigurowane",
        message: "Brak wymaganych zmiennych środowiskowych: GOOGLE_CLOUD_PROJECT_ID i GOOGLE_SERVICE_ACCOUNT_KEY",
        required_config: ["GOOGLE_CLOUD_PROJECT_ID", "GOOGLE_SERVICE_ACCOUNT_KEY"],
        query
      }), {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      const header = {
        alg: "RS256",
        typ: "JWT",
        kid: serviceAccount.private_key_id
      };
      const now = Math.floor(Date.now() / 1e3);
      const payload = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/bigquery",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600
      };
      return new Response(JSON.stringify({
        status: "success",
        service: "BigQuery",
        results: [
          { id: 1, name: "Sample Row 1", value: 100, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
          { id: 2, name: "Sample Row 2", value: 200, timestamp: (/* @__PURE__ */ new Date()).toISOString() }
        ],
        metadata: {
          totalRows: 2,
          schema: [
            { name: "id", type: "INTEGER" },
            { name: "name", type: "STRING" },
            { name: "value", type: "INTEGER" },
            { name: "timestamp", type: "TIMESTAMP" }
          ],
          query,
          projectId,
          executionTime: "0.5s",
          bytesProcessed: "1024"
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (authError) {
      return new Response(JSON.stringify({
        status: "error",
        service: "BigQuery",
        error: "Authentication failed",
        message: authError instanceof Error ? authError.message : "BigQuery authentication error"
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      service: "BigQuery",
      message: error?.message || "Nieznany błąd BigQuery"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { query, dataset } = body;
    const runtime = locals?.runtime;
    const env = runtime?.env;
    const projectId = env?.GOOGLE_CLOUD_PROJECT_ID;
    const serviceAccountKey = env?.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!projectId || !serviceAccountKey) {
      return new Response(JSON.stringify({
        status: "error",
        service: "BigQuery",
        error: "BigQuery nie jest skonfigurowane",
        message: "Brak wymaganych zmiennych środowiskowych: GOOGLE_CLOUD_PROJECT_ID i GOOGLE_SERVICE_ACCOUNT_KEY",
        required_config: ["GOOGLE_CLOUD_PROJECT_ID", "GOOGLE_SERVICE_ACCOUNT_KEY"],
        query,
        dataset
      }), {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      const sampleResults = generateSampleResults(query, dataset);
      return new Response(JSON.stringify({
        success: true,
        service: "BigQuery",
        results: sampleResults.rows,
        metadata: {
          totalRows: sampleResults.rows.length,
          schema: sampleResults.schema,
          query,
          projectId,
          dataset: dataset || "analytics",
          executionTime: "1.2s",
          bytesProcessed: "2048",
          jobId: `job_${Date.now()}`,
          location: "US"
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (queryError) {
      return new Response(JSON.stringify({
        success: false,
        service: "BigQuery",
        error: "Query execution failed",
        message: queryError instanceof Error ? queryError.message : "BigQuery query error"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      service: "BigQuery",
      message: error?.message || "Nieznany błąd BigQuery"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
function generateSampleResults(query, dataset) {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes("users") || lowerQuery.includes("user")) {
    return {
      rows: [
        { user_id: 1, name: "Jan Kowalski", email: "jan@example.com", created_at: "2024-01-15T10:30:00Z" },
        { user_id: 2, name: "Anna Nowak", email: "anna@example.com", created_at: "2024-01-16T11:15:00Z" },
        { user_id: 3, name: "Piotr Wiśniewski", email: "piotr@example.com", created_at: "2024-01-17T09:45:00Z" }
      ],
      schema: [
        { name: "user_id", type: "INTEGER", mode: "NULLABLE" },
        { name: "name", type: "STRING", mode: "NULLABLE" },
        { name: "email", type: "STRING", mode: "NULLABLE" },
        { name: "created_at", type: "TIMESTAMP", mode: "NULLABLE" }
      ]
    };
  }
  if (lowerQuery.includes("sales") || lowerQuery.includes("revenue")) {
    return {
      rows: [
        { date: "2024-01-01", revenue: 15e3, orders: 45, avg_order: 333.33 },
        { date: "2024-01-02", revenue: 18500, orders: 52, avg_order: 355.77 },
        { date: "2024-01-03", revenue: 21200, orders: 67, avg_order: 316.42 }
      ],
      schema: [
        { name: "date", type: "DATE", mode: "NULLABLE" },
        { name: "revenue", type: "FLOAT", mode: "NULLABLE" },
        { name: "orders", type: "INTEGER", mode: "NULLABLE" },
        { name: "avg_order", type: "FLOAT", mode: "NULLABLE" }
      ]
    };
  }
  return {
    rows: [
      { id: 1, value: "Przykład 1", count: 100, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
      { id: 2, value: "Przykład 2", count: 200, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
      { id: 3, value: "Przykład 3", count: 150, timestamp: (/* @__PURE__ */ new Date()).toISOString() }
    ],
    schema: [
      { name: "id", type: "INTEGER", mode: "NULLABLE" },
      { name: "value", type: "STRING", mode: "NULLABLE" },
      { name: "count", type: "INTEGER", mode: "NULLABLE" },
      { name: "timestamp", type: "TIMESTAMP", mode: "NULLABLE" }
    ]
  };
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
