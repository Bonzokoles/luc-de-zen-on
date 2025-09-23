globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "POST"]);
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const errors = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 3e4).toISOString(),
        level: "warning",
        message: "High memory usage detected",
        source: "system",
        details: "Memory usage at 85%"
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 12e4).toISOString(),
        level: "error",
        message: "Failed API request to external service",
        source: "api",
        details: "Timeout after 30s"
      }
    ].slice(0, limit);
    return createSuccessResponse({
      errors,
      total: errors.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Errors API error:", error);
    return createErrorResponse("Failed to fetch errors", 500);
  }
};
const POST = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    if (action === "clear") {
      return createSuccessResponse({
        success: true,
        message: "Errors cleared",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    return createErrorResponse("Unknown action", 400);
  } catch (error) {
    console.error("Clear errors error:", error);
    return createErrorResponse("Failed to clear errors", 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
