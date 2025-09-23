globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const GET = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "SELECT 1 as test";
    const env = locals.runtime?.env;
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
    return new Response(JSON.stringify({
      status: "error",
      service: "BigQuery",
      error: "Implementacja BigQuery wymaga Google Cloud SDK",
      message: "Prawdziwe zapytania BigQuery wymagają implementacji Google Cloud BigQuery client library",
      projectId,
      query,
      note: "Skonfiguruj Google Cloud BigQuery SDK dla pełnej funkcjonalności"
    }), {
      status: 501,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
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
    const env = locals.runtime?.env;
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
    return new Response(JSON.stringify({
      status: "error",
      service: "BigQuery",
      operation: "query_execution",
      error: "Implementacja BigQuery wymaga Google Cloud SDK",
      message: "Prawdziwe zapytania BigQuery wymagają implementacji Google Cloud BigQuery client library",
      projectId,
      query,
      dataset: dataset || "analytics",
      note: "Skonfiguruj Google Cloud BigQuery SDK i biblioteki dla pełnej funkcjonalności"
    }), {
      status: 501,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
