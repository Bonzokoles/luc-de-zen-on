globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const GET = async ({ request, locals }) => {
  try {
    const env = false ? process.env : locals?.runtime?.env || {};
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID || env.GOOGLE_PROJECT_ID || env.GCP_PROJECT_ID;
    if (!projectId) {
      return new Response(JSON.stringify({
        success: false,
        error: "Google Cloud project not configured",
        message: "GOOGLE_CLOUD_PROJECT_ID or GOOGLE_PROJECT_ID environment variable is required",
        debug: {
          GOOGLE_CLOUD_PROJECT_ID: !!env.GOOGLE_CLOUD_PROJECT_ID,
          GOOGLE_PROJECT_ID: !!env.GOOGLE_PROJECT_ID,
          GCP_PROJECT_ID: !!env.GCP_PROJECT_ID
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const url = new URL(request.url);
    const queryParams = url.searchParams.toString();
    const cloudFunctionUrl = `https://europe-west1-${projectId}.cloudfunctions.net/mybonzo-bigquery-api${queryParams ? "?" + queryParams : ""}`;
    const response = await fetch(cloudFunctionUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent") || "MyBonzo-Proxy/1.0"
      }
    });
    const data = await response.json();
    return new Response(JSON.stringify({
      ...data,
      proxied: true,
      proxyVersion: "1.0.0",
      originalEndpoint: "/api/bigquery",
      cloudFunction: cloudFunctionUrl
    }), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, max-age=300"
        // 5 minute cache
      }
    });
  } catch (error) {
    console.error("BigQuery proxy error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Proxy error",
      message: error instanceof Error ? error.message : "Unknown error",
      service: "BigQuery API Proxy",
      fallback: true
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const env = false ? process.env : locals?.runtime?.env || {};
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID || env.GCP_PROJECT_ID;
    if (!projectId) {
      return new Response(JSON.stringify({
        success: false,
        error: "Google Cloud project not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const cloudFunctionUrl = `https://europe-west1-${projectId}.cloudfunctions.net/mybonzo-bigquery-api`;
    const body = await request.text();
    const response = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent") || "MyBonzo-Proxy/1.0"
      },
      body
    });
    const data = await response.json();
    return new Response(JSON.stringify({
      ...data,
      proxied: true,
      proxyVersion: "1.0.0"
    }), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      }
    });
  } catch (error) {
    console.error("BigQuery POST proxy error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Proxy error",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
