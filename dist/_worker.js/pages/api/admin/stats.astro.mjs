globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

async function GET({ request }) {
  const auth = request.headers.get("authorization") || "";
  const isDemoAuth = auth.includes("HAOS77");
  const stats = {
    // Oczekiwane przez AdminDashboard PanelStats
    visitors: 12540,
    queries: 3247,
    uptime: formatUptime(3 * 24 * 60 * 60 * 1e3 + 6 * 60 * 60 * 1e3 + 12 * 60 * 1e3),
    // "3:06:12"
    responseTime: 142,
    storage: 18.4,
    // GB
    bandwidth: 92.7,
    // GB
    // Oczekiwane przez sekcję quick-stats w admin.astro
    totalAPIRequests: 3247,
    errorAPIRequests: 6,
    // Stary kształt (zgodność wsteczna)
    totalVisitors: 12540,
    activeUsers: 42,
    openTickets: 11,
    systemLoad: 63,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    // Flaga informacyjna
    demoAuth: isDemoAuth
  };
  return json(stats);
}
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return `${days}:${String(hours % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
function json(body, init) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    },
    ...init
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
