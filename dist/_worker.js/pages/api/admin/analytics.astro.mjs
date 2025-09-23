globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const OPTIONS = createOPTIONSHandler(["GET"]);
const GET = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const hasAuth = authHeader.includes("HAOS77");
    const analytics = {
      realTimeUsers: 7,
      totalSessions: 18425,
      bounceRate: 36.4,
      avgSessionDuration: 327,
      time: (/* @__PURE__ */ new Date()).toISOString(),
      demoAuth: hasAuth
    };
    return createSuccessResponse(analytics);
  } catch (e) {
    console.error("analytics error", e);
    return createErrorResponse("Failed to load analytics", 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
