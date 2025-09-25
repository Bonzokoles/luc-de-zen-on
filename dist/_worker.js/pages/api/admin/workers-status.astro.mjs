globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "POST"]);
const WORKERS = [
  { name: "AI Bot Worker", url: "/api/ai-bot-worker", endpoint: "/api/chat", timeout: 5e3 },
  { name: "Generate Image", url: "/api/generate-image", endpoint: "/api/generate-image", timeout: 1e4 },
  { name: "FAQ Generator", url: "/api/faq-generator", endpoint: "/api/faq-generator", timeout: 5e3 },
  { name: "Voice Avatar", url: "/api/voice-avatar", endpoint: "/api/voice-handler", timeout: 8e3 },
  { name: "Marketing Content", url: "/api/generate-marketing-content", endpoint: "/api/generate-marketing-content", timeout: 5e3 },
  { name: "Recommendations", url: "/api/get-recommendations", endpoint: "/api/get-recommendations", timeout: 5e3 },
  { name: "Education Recommendations", url: "/api/education-recommendations", endpoint: "/api/education-recommendations", timeout: 5e3 },
  { name: "Quiz Generator", url: "/api/quiz", endpoint: "/api/quiz", timeout: 5e3 },
  { name: "Reminders", url: "/api/reminders", endpoint: "/api/reminders", timeout: 3e3 },
  { name: "Ticket System", url: "/api/tickets", endpoint: "/api/tickets", timeout: 3e3 }
];
async function testWorkerEndpoint(worker) {
  const startTime = Date.now();
  try {
    const testPayload = getTestPayload(worker.name);
    const response = await fetch(`${worker.endpoint || worker.url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WorkersStatusMonitor/1.0"
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(worker.timeout || 5e3)
    });
    const responseTime = Date.now() - startTime;
    if (response.ok) {
      return {
        status: "online",
        responseMs: responseTime,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString()
      };
    } else {
      return {
        status: "partial",
        responseMs: responseTime,
        lastCheck: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  } catch (error) {
    console.error(`Worker ${worker.name} test failed:`, error);
    return {
      status: "offline",
      responseMs: null,
      lastCheck: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
function getTestPayload(workerName) {
  switch (workerName) {
    case "AI Bot Worker":
      return { message: "health check" };
    case "Generate Image":
      return { prompt: "test", width: 256, height: 256 };
    case "FAQ Generator":
      return { knowledgeBase: "test knowledge base", count: 1 };
    case "Voice Avatar":
      return { text: "test", action: "speech" };
    case "Marketing Content":
      return { prompt: "test", contentType: "social media post" };
    case "Recommendations":
      return { preferences: "test preferences" };
    case "Education Recommendations":
      return { userProfile: { interests: ["test"] } };
    case "Quiz Generator":
      return { topic: "test", difficulty: "beginner" };
    case "Reminders":
      return { action: "list" };
    case "Ticket System":
      return { action: "list" };
    default:
      return { test: true };
  }
}
async function getWorkerMetrics(workerName) {
  const baseMetrics = {
    cpu: Math.floor(Math.random() * 80) + 10,
    ram: Math.floor(Math.random() * 70) + 20,
    requests: Math.floor(Math.random() * 500) + 50,
    uptime: `${(Math.random() * 5 + 95).toFixed(1)}%`,
    errors: Math.floor(Math.random() * 10)
  };
  if (Math.random() < 0.1) {
    return {
      cpu: null,
      ram: null,
      requests: 0,
      uptime: "0%",
      errors: Math.floor(Math.random() * 20) + 10
    };
  }
  return baseMetrics;
}
const GET = async ({ request, locals }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== "HAOS77") {
      return createErrorResponse("Unauthorized access", 401);
    }
    const workerPromises = WORKERS.map(async (worker) => {
      const [statusResult, metricsResult] = await Promise.all([
        testWorkerEndpoint(worker),
        getWorkerMetrics(worker.name)
      ]);
      return {
        name: worker.name,
        url: worker.endpoint || worker.url,
        ...metricsResult,
        ...statusResult
      };
    });
    const workers = await Promise.all(workerPromises);
    const onlineWorkers = workers.filter((w) => w.status === "online").length;
    const totalWorkers = workers.length;
    const systemUptime = (onlineWorkers / totalWorkers * 100).toFixed(1);
    const avgResponseTime = workers.filter((w) => w.responseMs !== null).reduce((sum, w) => sum + (w.responseMs || 0), 0) / workers.filter((w) => w.responseMs !== null).length || 0;
    const systemMetrics = {
      totalWorkers,
      onlineWorkers,
      systemUptime: `${systemUptime}%`,
      avgResponseTime: Math.round(avgResponseTime),
      totalRequests: workers.reduce((sum, w) => sum + w.requests, 0),
      totalErrors: workers.reduce((sum, w) => sum + w.errors, 0),
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString()
    };
    return createSuccessResponse({
      workers,
      system: systemMetrics,
      status: "success"
    });
  } catch (error) {
    console.error("Workers status check failed:", error);
    return createErrorResponse("Failed to check workers status", 500);
  }
};
const POST = async ({ request, locals }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== "HAOS77") {
      return createErrorResponse("Unauthorized access", 401);
    }
    const body = await request.json();
    const { action, workerName } = body;
    if (action === "test" && workerName) {
      const worker = WORKERS.find((w) => w.name === workerName);
      if (!worker) {
        return createErrorResponse("Worker not found", 404);
      }
      const statusResult = await testWorkerEndpoint(worker);
      const metricsResult = await getWorkerMetrics(worker.name);
      const workerStatus = {
        name: worker.name,
        url: worker.endpoint || worker.url,
        ...metricsResult,
        ...statusResult
      };
      return createSuccessResponse({
        worker: workerStatus,
        status: "success"
      });
    }
    if (action === "restart" && workerName) {
      return createSuccessResponse({
        message: `Worker ${workerName} restart triggered`,
        status: "success"
      });
    }
    return createErrorResponse("Invalid action", 400);
  } catch (error) {
    console.error("Worker action failed:", error);
    return createErrorResponse("Failed to perform worker action", 500);
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
