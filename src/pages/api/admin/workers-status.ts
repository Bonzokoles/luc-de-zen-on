import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
  createOPTIONSHandler,
} from "@/utils/corsUtils";

export const OPTIONS = createOPTIONSHandler(["GET", "POST"]);

interface WorkerConfig {
  name: string;
  url: string;
  endpoint?: string;
  timeout?: number;
}

// Define the workers to monitor
const WORKERS: WorkerConfig[] = [
  {
    name: "AI Bot Worker",
    url: "/api/ai-bot-worker",
    endpoint: "/api/chat",
    timeout: 5000,
  },
  {
    name: "Generate Image",
    url: "/api/generate-image",
    endpoint: "/api/generate-image",
    timeout: 10000,
  },
  {
    name: "FAQ Generator",
    url: "/api/faq-generator",
    endpoint: "/api/faq-generator",
    timeout: 5000,
  },
  {
    name: "Voice Avatar",
    url: "/api/voice-avatar",
    endpoint: "/api/voice-handler",
    timeout: 8000,
  },
  {
    name: "Marketing Content",
    url: "/api/generate-marketing-content",
    endpoint: "/api/generate-marketing-content",
    timeout: 5000,
  },
  {
    name: "Recommendations",
    url: "/api/get-recommendations",
    endpoint: "/api/get-recommendations",
    timeout: 5000,
  },
  {
    name: "Education Recommendations",
    url: "/api/education-recommendations",
    endpoint: "/api/education-recommendations",
    timeout: 5000,
  },
  {
    name: "Quiz Generator",
    url: "/api/quiz",
    endpoint: "/api/quiz",
    timeout: 5000,
  },
  {
    name: "Reminders",
    url: "/api/reminders",
    endpoint: "/api/reminders",
    timeout: 3000,
  },
  {
    name: "Ticket System",
    url: "/api/tickets",
    endpoint: "/api/tickets",
    timeout: 3000,
  },
];

interface WorkerStatus {
  name: string;
  status: "online" | "offline" | "partial" | "maintenance";
  cpu: number | null;
  ram: number | null;
  requests: number;
  responseMs: number | null;
  lastCheck: string;
  uptime: string;
  errors: number;
  url?: string;
}

async function testWorkerEndpoint(
  worker: WorkerConfig
): Promise<Partial<WorkerStatus>> {
  const startTime = Date.now();

  try {
    const testPayload = getTestPayload(worker.name);

    const response = await fetch(`${worker.endpoint || worker.url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WorkersStatusMonitor/1.0",
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(worker.timeout || 5000),
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        status: "online",
        responseMs: responseTime,
        lastCheck: new Date().toISOString(),
      };
    } else {
      return {
        status: "partial",
        responseMs: responseTime,
        lastCheck: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error(`Worker ${worker.name} test failed:`, error);
    return {
      status: "offline",
      responseMs: null,
      lastCheck: new Date().toISOString(),
    };
  }
}

function getTestPayload(workerName: string): any {
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

async function getWorkerMetrics(
  workerName: string
): Promise<Partial<WorkerStatus>> {
  // Mock metrics - in production, this could integrate with Cloudflare Analytics API
  const baseMetrics = {
    cpu: Math.floor(Math.random() * 80) + 10,
    ram: Math.floor(Math.random() * 70) + 20,
    requests: Math.floor(Math.random() * 500) + 50,
    uptime: `${(Math.random() * 5 + 95).toFixed(1)}%`,
    errors: Math.floor(Math.random() * 10),
  };

  // Simulate some workers being offline
  if (Math.random() < 0.1) {
    return {
      cpu: null,
      ram: null,
      requests: 0,
      uptime: "0%",
      errors: Math.floor(Math.random() * 20) + 10,
    };
  }

  return baseMetrics;
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token !== "HAOS77") {
      return createErrorResponse("Unauthorized access", 401);
    }

    // Get worker statuses in parallel
    const workerPromises = WORKERS.map(async (worker) => {
      const [statusResult, metricsResult] = await Promise.all([
        testWorkerEndpoint(worker),
        getWorkerMetrics(worker.name),
      ]);

      return {
        name: worker.name,
        url: worker.endpoint || worker.url,
        ...metricsResult,
        ...statusResult,
      } as WorkerStatus;
    });

    const workers = await Promise.all(workerPromises);

    // Calculate overall system metrics
    const onlineWorkers = workers.filter((w) => w.status === "online").length;
    const totalWorkers = workers.length;
    const systemUptime = ((onlineWorkers / totalWorkers) * 100).toFixed(1);
    const avgResponseTime =
      workers
        .filter((w) => w.responseMs !== null)
        .reduce((sum, w) => sum + (w.responseMs || 0), 0) /
        workers.filter((w) => w.responseMs !== null).length || 0;

    const systemMetrics = {
      totalWorkers,
      onlineWorkers,
      systemUptime: `${systemUptime}%`,
      avgResponseTime: Math.round(avgResponseTime),
      totalRequests: workers.reduce((sum, w) => sum + w.requests, 0),
      totalErrors: workers.reduce((sum, w) => sum + w.errors, 0),
      lastUpdate: new Date().toISOString(),
    };

    return createSuccessResponse({
      workers,
      system: systemMetrics,
      status: "success",
    });
  } catch (error) {
    console.error("Workers status check failed:", error);
    return createErrorResponse("Failed to check workers status", 500);
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token !== "HAOS77") {
      return createErrorResponse("Unauthorized access", 401);
    }

    const body = (await request.json()) as any;
    const { action, workerName } = body;

    if (action === "test" && workerName) {
      // Test specific worker
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
        ...statusResult,
      } as WorkerStatus;

      return createSuccessResponse({
        worker: workerStatus,
        status: "success",
      });
    }

    if (action === "restart" && workerName) {
      // In production, this could trigger a worker restart via Cloudflare API
      return createSuccessResponse({
        message: `Worker ${workerName} restart triggered`,
        status: "success",
      });
    }

    return createErrorResponse("Invalid action", 400);
  } catch (error) {
    console.error("Worker action failed:", error);
    return createErrorResponse("Failed to perform worker action", 500);
  }
};
