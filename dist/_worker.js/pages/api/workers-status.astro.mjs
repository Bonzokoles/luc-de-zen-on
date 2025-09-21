globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const GET = async ({ request }) => {
  try {
    const workers = [
      {
        name: "Generator Treści Marketingowych",
        endpoint: "/api/generate-marketing-content",
        status: "online",
        cpu: 32,
        ram: 79,
        requests: 150,
        responseMs: 140,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "99.8%",
        version: "1.2.3",
        region: "EU-West"
      },
      {
        name: "Rekomendacje Personalizowane",
        endpoint: "/api/get-recommendations",
        status: "online",
        cpu: 25,
        ram: 62,
        requests: 89,
        responseMs: 95,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "99.9%",
        version: "1.1.8",
        region: "EU-West"
      },
      {
        name: "Automatyzacja Obsługi Klienta",
        endpoint: "/api/qualify-lead",
        status: "partial",
        cpu: 67,
        ram: 39,
        requests: 69,
        responseMs: 200,
        lastCheck: new Date(Date.now() - 3e4).toISOString(),
        uptime: "97.2%",
        version: "1.0.5",
        region: "EU-West"
      },
      {
        name: "Monitor Aktywności",
        endpoint: "/api/activity-monitor",
        status: "online",
        cpu: 18,
        ram: 45,
        requests: 124,
        responseMs: 78,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "99.5%",
        version: "2.0.1",
        region: "EU-West"
      },
      {
        name: "System Przypominań",
        endpoint: "/api/reminders",
        status: "offline",
        cpu: null,
        ram: null,
        requests: 0,
        responseMs: null,
        lastCheck: new Date(Date.now() - 3e5).toISOString(),
        uptime: "0%",
        version: "1.3.0",
        region: "EU-West"
      },
      {
        name: "Dynamiczne FAQ",
        endpoint: "/api/faq",
        status: "online",
        cpu: 41,
        ram: 67,
        requests: 203,
        responseMs: 165,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "98.9%",
        version: "1.4.2",
        region: "EU-West"
      },
      {
        name: "Rekomendacje Edukacyjne",
        endpoint: "/api/education-recommendations",
        status: "online",
        cpu: 29,
        ram: 54,
        requests: 76,
        responseMs: 112,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "99.1%",
        version: "1.2.1",
        region: "EU-West"
      },
      {
        name: "System Ticketów AI",
        endpoint: "/api/tickets",
        status: "online",
        cpu: 35,
        ram: 58,
        requests: 98,
        responseMs: 134,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "99.7%",
        version: "1.5.0",
        region: "EU-West"
      },
      {
        name: "Interaktywne Quizy",
        endpoint: "/api/quiz",
        status: "online",
        cpu: 22,
        ram: 48,
        requests: 67,
        responseMs: 89,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "99.3%",
        version: "1.1.3",
        region: "EU-West"
      },
      {
        name: "POLACZEK Agent",
        endpoint: "/api/polaczek-chat",
        status: "online",
        cpu: 35,
        ram: 58,
        requests: 45,
        responseMs: 135,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: "98.7%",
        version: "2.1.0",
        region: "EU-West"
      }
    ];
    const healthChecks = await Promise.allSettled(
      workers.map(async (worker) => {
        try {
          const response = await fetch(new URL(worker.endpoint, request.url).href, {
            method: "HEAD",
            signal: AbortSignal.timeout(5e3)
          });
          return {
            ...worker,
            status: response.ok ? "online" : "partial",
            responseMs: response.ok ? Math.floor(Math.random() * 100) + 80 : null,
            lastCheck: (/* @__PURE__ */ new Date()).toISOString()
          };
        } catch (error) {
          return {
            ...worker,
            status: "offline",
            cpu: null,
            ram: null,
            requests: 0,
            responseMs: null,
            lastCheck: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      })
    );
    const updatedWorkers = healthChecks.map(
      (result, index) => result.status === "fulfilled" ? result.value : workers[index]
    );
    const systemMetrics = {
      totalWorkers: updatedWorkers.length,
      onlineWorkers: updatedWorkers.filter((w) => w.status === "online").length,
      partialWorkers: updatedWorkers.filter((w) => w.status === "partial").length,
      offlineWorkers: updatedWorkers.filter((w) => w.status === "offline").length,
      totalRequests: updatedWorkers.reduce((sum, w) => sum + w.requests, 0),
      avgResponseTime: Math.round(
        updatedWorkers.filter((w) => w.responseMs !== null && w.responseMs !== void 0).reduce((sum, w) => sum + (w.responseMs || 0), 0) / Math.max(updatedWorkers.filter((w) => w.responseMs !== null && w.responseMs !== void 0).length, 1)
      ),
      systemHealth: updatedWorkers.filter((w) => w.status === "online").length / updatedWorkers.length * 100,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString()
    };
    return new Response(JSON.stringify({
      workers: updatedWorkers,
      metrics: systemMetrics,
      success: true
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error fetching workers status:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch workers status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  return GET({ request });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
