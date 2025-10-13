/**
 * AI Workers Management API
 * Endpoint do zarządzania AI Workers w środowisku Cloudflare
 */

import type { APIRoute } from "astro";
import {
  createOPTIONSHandler,
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// Real workers storage - using actual Cloudflare Workers
let workersStorage: any[] = [
  {
    id: "worker-multi-ai",
    name: "Multi-AI Assistant",
    type: "chat",
    endpoint: "/api/chat",
    workerUrl: "https://multi-ai-assistant.stolarnia-ams.workers.dev",
    status: "active",
    config: {
      model: "@cf/qwen/qwen1.5-0.5b-chat",
      maxTokens: 1000,
      temperature: 0.7,
    },
    created: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  },
  {
    id: "worker-bielik",
    name: "Bielik Polish AI",
    type: "chat",
    endpoint: "/api/bielik-chat",
    workerUrl: "https://bielik-chat-assistant.stolarnia-ams.workers.dev",
    status: "active",
    config: {
      model: "bielik-7b",
      maxTokens: 1500,
      temperature: 0.6,
    },
    created: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  },
  {
    id: "worker-image-gen",
    name: "Image Generator",
    type: "image",
    endpoint: "/api/generate-image",
    workerUrl: "https://generate-image.stolarnia-ams.workers.dev",
    status: "active",
    config: {
      model: "@cf/black-forest-labs/flux-1-schnell",
      maxTokens: 500,
      temperature: 0.8,
    },
    created: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  },
];

export const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "list";

    switch (action) {
      case "list":
        return createSuccessResponse({
          workers: workersStorage,
          total: workersStorage.length,
          timestamp: new Date().toISOString(),
        });

      case "get":
        const workerId = url.searchParams.get("id");
        if (!workerId) {
          return createErrorResponse("Worker ID jest wymagane", 400);
        }

        const worker = workersStorage.find((w) => w.id === workerId);
        if (!worker) {
          return createErrorResponse("Worker nie został znaleziony", 404);
        }

        return createSuccessResponse({ worker });

      default:
        return createErrorResponse("Nieznana akcja", 400);
    }
  } catch (error: any) {
    console.error("❌ AI Workers API błąd:", error);
    return createErrorResponse(
      `Błąd serwera: ${error?.message || "Nieznany błąd"}`,
      500
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as any;
    const { action, ...data } = body;

    switch (action) {
      case "create":
        return await createWorker(data);

      case "update":
        return await updateWorker(data);

      case "delete":
        return await deleteWorker(data);

      case "test":
        return await testWorker(data);

      default:
        return createErrorResponse("Nieznana akcja POST", 400);
    }
  } catch (error: any) {
    console.error("❌ AI Workers POST błąd:", error);
    return createErrorResponse(
      `Błąd przetwarzania: ${error?.message || "Nieznany błąd"}`,
      500
    );
  }
};

// Helper functions

async function createWorker(data: any) {
  const { name, type, config, endpoint } = data;

  if (!name || !type) {
    return createErrorResponse("Nazwa i typ worker są wymagane", 400);
  }

  // Generate unique ID
  const workerId = `worker-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const newWorker = {
    id: workerId,
    name: name.trim(),
    type,
    endpoint: endpoint || `/api/${type}`,
    status: "active",
    config: {
      model: config?.model || "llama-3.1-8b-instant",
      maxTokens: config?.maxTokens || 1000,
      temperature: config?.temperature || 0.7,
      ...config,
    },
    created: new Date().toISOString(),
    lastUsed: null,
  };

  workersStorage.push(newWorker);

  console.log(`✅ Utworzono nowy worker: ${name} (${workerId})`);

  return createSuccessResponse({
    message: "Worker został utworzony pomyślnie",
    worker: newWorker,
  });
}

async function updateWorker(data: any) {
  const { workerId, updates } = data;

  if (!workerId) {
    return createErrorResponse("Worker ID jest wymagane", 400);
  }

  const workerIndex = workersStorage.findIndex((w) => w.id === workerId);
  if (workerIndex === -1) {
    return createErrorResponse("Worker nie został znaleziony", 404);
  }

  // Update worker
  workersStorage[workerIndex] = {
    ...workersStorage[workerIndex],
    ...updates,
    lastUsed: new Date().toISOString(),
  };

  console.log(`✅ Zaktualizowano worker: ${workerId}`);

  return createSuccessResponse({
    message: "Worker został zaktualizowany",
    worker: workersStorage[workerIndex],
  });
}

async function deleteWorker(data: any) {
  const { workerId } = data;

  if (!workerId) {
    return createErrorResponse("Worker ID jest wymagane", 400);
  }

  const workerIndex = workersStorage.findIndex((w) => w.id === workerId);
  if (workerIndex === -1) {
    return createErrorResponse("Worker nie został znaleziony", 404);
  }

  const deletedWorker = workersStorage.splice(workerIndex, 1)[0];

  console.log(`✅ Usunięto worker: ${deletedWorker.name} (${workerId})`);

  return createSuccessResponse({
    message: "Worker został usunięty",
    deletedWorker,
  });
}

async function testWorker(data: any) {
  const { workerId, testData } = data;

  if (!workerId) {
    return createErrorResponse("Worker ID jest wymagane", 400);
  }

  const worker = workersStorage.find((w) => w.id === workerId);
  if (!worker) {
    return createErrorResponse("Worker nie został znaleziony", 404);
  }

  // Update last used timestamp
  worker.lastUsed = new Date().toISOString();

  try {
    // Test actual worker endpoint instead of mock response
    let testResult;

    if (worker.workerUrl) {
      // Test real Cloudflare Worker
      const testResponse = await fetch(worker.workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: testData?.message || "Test connectivity",
          prompt:
            testData?.prompt || "Odpowiedz krótko: czy działasz poprawnie?",
        }),
      });

      if (testResponse.ok) {
        const responseData = (await testResponse.json()) as any;
        testResult = {
          response:
            responseData.response ||
            responseData.answer ||
            "Worker działa poprawnie",
          model: worker.config.model,
          source: "real_worker",
          workerUrl: worker.workerUrl,
          status: "success",
        };
      } else {
        throw new Error(`Worker responded with status ${testResponse.status}`);
      }
    } else {
      // Test local API endpoint
      const testResponse = await fetch(`${worker.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: testData?.prompt || "Test connectivity",
        }),
      });

      if (testResponse.ok) {
        const responseData = (await testResponse.json()) as any;
        testResult = {
          response:
            responseData.answer ||
            responseData.response ||
            "API endpoint działa poprawnie",
          model: worker.config.model,
          source: "local_api",
          endpoint: worker.endpoint,
          status: "success",
        };
      } else {
        throw new Error(
          `API endpoint responded with status ${testResponse.status}`
        );
      }
    }

    console.log(`✅ Test worker: ${worker.name} (${workerId}) - sukces`);

    return createSuccessResponse({
      message: "Test worker zakończony pomyślnie",
      worker: worker.name,
      result: testResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`❌ Test worker failed: ${worker.name} (${workerId})`, error);

    return createErrorResponse(`Test worker nieudany: ${error.message}`, 500);
  }
}
