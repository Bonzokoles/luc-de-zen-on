globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const logs = [
  {
    id: "1",
    action: "User login",
    userId: "user123",
    timestamp: Date.now() - 36e5,
    details: { ip: "192.168.1.1", browser: "Chrome" },
    type: "info",
    source: "auth"
  },
  {
    id: "2",
    action: "API call failed",
    timestamp: Date.now() - 18e5,
    details: { endpoint: "/api/generate-content", error: "Rate limit exceeded" },
    type: "error",
    source: "api"
  },
  {
    id: "3",
    action: "Content generated",
    userId: "user456",
    timestamp: Date.now() - 9e5,
    details: { contentType: "blog post", tokens: 850 },
    type: "info",
    source: "ai"
  }
];
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const newLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...data
    };
    logs.push(newLog);
    return new Response(JSON.stringify({
      success: true,
      message: "Activity logged",
      id: newLog.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to log activity"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const GET = async ({ url }) => {
  const params = new URL(url).searchParams;
  const type = params.get("type");
  const limit = parseInt(params.get("limit") || "50");
  try {
    let filteredLogs = logs;
    if (type) {
      filteredLogs = logs.filter((log) => log.type === type);
    }
    const sortedLogs = filteredLogs.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    const stats = {
      total: logs.length,
      errors: logs.filter((log) => log.type === "error").length,
      warnings: logs.filter((log) => log.type === "warning").length,
      info: logs.filter((log) => log.type === "info").length,
      lastHour: logs.filter((log) => log.timestamp > Date.now() - 36e5).length,
      sources: [...new Set(logs.map((log) => log.source))],
      anomalies: logs.filter((log) => log.type === "error").length > 5
      // Simple anomaly detection
    };
    return new Response(JSON.stringify({
      success: true,
      logs: sortedLogs,
      stats
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to retrieve logs"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
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
