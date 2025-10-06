globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const GET = async ({ request, locals, url }) => {
  try {
    const env = false ? process.env : locals?.runtime?.env || {};
    const projectId = env.GOOGLE_CLOUD_PROJECT_ID || env.GCP_PROJECT_ID;
    if (!projectId) {
      return new Response(JSON.stringify({
        success: false,
        error: "Google Cloud project not configured",
        message: "GOOGLE_CLOUD_PROJECT_ID environment variable is required"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const queryParams = url.searchParams.toString();
    const cloudFunctionUrl = `https://europe-west1-${projectId}.cloudfunctions.net/mybonzo-recommendations-api${queryParams ? "?" + queryParams : ""}`;
    const response = await fetch(cloudFunctionUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent") || "MyBonzo-Proxy/1.0",
        "X-Forwarded-For": request.headers.get("X-Forwarded-For") || "unknown",
        "Accept-Language": request.headers.get("Accept-Language") || "pl"
      }
    });
    const data = await response.json();
    return new Response(JSON.stringify({
      ...data,
      proxied: true,
      proxyVersion: "1.0.0",
      originalEndpoint: "/api/get-recommendations",
      cloudFunction: cloudFunctionUrl
    }), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Cache-Control": "public, max-age=60"
        // 1 minute cache (recommendations change frequently)
      }
    });
  } catch (error) {
    console.error("Recommendations proxy error:", error);
    const fallbackRecommendations = [
      {
        id: "fallback_explore",
        title: "Eksploruj możliwości AI",
        description: "Odkryj zaawansowane funkcje systemu MyBonzo AI",
        category: "exploration",
        confidence: 0.7,
        fallback: true
      },
      {
        id: "fallback_optimize",
        title: "Optymalizuj workflow",
        description: "Przejrzyj i uspraw swoje codzienne zadania",
        category: "productivity",
        confidence: 0.6,
        fallback: true
      }
    ];
    return new Response(JSON.stringify({
      success: true,
      recommendations: fallbackRecommendations,
      fallback: true,
      error: "Cloud Function unavailable - using fallback recommendations",
      service: "Recommendations API Proxy"
    }), {
      status: 200,
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
    const cloudFunctionUrl = `https://europe-west1-${projectId}.cloudfunctions.net/mybonzo-recommendations-api`;
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
    console.error("Recommendations POST proxy error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Proxy error",
      message: error instanceof Error ? error.message : "Unknown error",
      service: "Recommendations API Proxy"
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
