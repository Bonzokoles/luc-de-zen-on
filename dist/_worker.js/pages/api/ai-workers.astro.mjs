globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

let workersStorage = [
  {
    id: "worker-multi-ai",
    name: "Multi-AI Assistant",
    type: "chat",
    endpoint: "/api/chat",
    workerUrl: "https://multi-ai-assistant.stolarnia-ams.workers.dev",
    status: "active",
    config: {
      model: "@cf/qwen/qwen1.5-0.5b-chat",
      maxTokens: 1e3,
      temperature: 0.7
    },
    created: (/* @__PURE__ */ new Date()).toISOString(),
    lastUsed: (/* @__PURE__ */ new Date()).toISOString()
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
      temperature: 0.6
    },
    created: (/* @__PURE__ */ new Date()).toISOString(),
    lastUsed: (/* @__PURE__ */ new Date()).toISOString()
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
      temperature: 0.8
    },
    created: (/* @__PURE__ */ new Date()).toISOString(),
    lastUsed: (/* @__PURE__ */ new Date()).toISOString()
  }
];
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "list";
    switch (action) {
      case "list":
        return createSuccessResponse({
          workers: workersStorage,
          total: workersStorage.length,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
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
  } catch (error) {
    console.error("❌ AI Workers API błąd:", error);
    return createErrorResponse(`Błąd serwera: ${error?.message || "Nieznany błąd"}`, 500);
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
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
  } catch (error) {
    console.error("❌ AI Workers POST błąd:", error);
    return createErrorResponse(`Błąd przetwarzania: ${error?.message || "Nieznany błąd"}`, 500);
  }
};
async function createWorker(data) {
  const { name, type, config, endpoint } = data;
  if (!name || !type) {
    return createErrorResponse("Nazwa i typ worker są wymagane", 400);
  }
  const workerId = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newWorker = {
    id: workerId,
    name: name.trim(),
    type,
    endpoint: endpoint || `/api/${type}`,
    status: "active",
    config: {
      model: config?.model || "llama-3.1-8b-instant",
      maxTokens: config?.maxTokens || 1e3,
      temperature: config?.temperature || 0.7,
      ...config
    },
    created: (/* @__PURE__ */ new Date()).toISOString(),
    lastUsed: null
  };
  workersStorage.push(newWorker);
  console.log(`✅ Utworzono nowy worker: ${name} (${workerId})`);
  return createSuccessResponse({
    message: "Worker został utworzony pomyślnie",
    worker: newWorker
  });
}
async function updateWorker(data) {
  const { workerId, updates } = data;
  if (!workerId) {
    return createErrorResponse("Worker ID jest wymagane", 400);
  }
  const workerIndex = workersStorage.findIndex((w) => w.id === workerId);
  if (workerIndex === -1) {
    return createErrorResponse("Worker nie został znaleziony", 404);
  }
  workersStorage[workerIndex] = {
    ...workersStorage[workerIndex],
    ...updates,
    lastUsed: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.log(`✅ Zaktualizowano worker: ${workerId}`);
  return createSuccessResponse({
    message: "Worker został zaktualizowany",
    worker: workersStorage[workerIndex]
  });
}
async function deleteWorker(data) {
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
    deletedWorker
  });
}
async function testWorker(data) {
  const { workerId, testData } = data;
  if (!workerId) {
    return createErrorResponse("Worker ID jest wymagane", 400);
  }
  const worker = workersStorage.find((w) => w.id === workerId);
  if (!worker) {
    return createErrorResponse("Worker nie został znaleziony", 404);
  }
  worker.lastUsed = (/* @__PURE__ */ new Date()).toISOString();
  try {
    let testResult;
    if (worker.workerUrl) {
      const testResponse = await fetch(worker.workerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: testData?.message || "Test connectivity",
          prompt: testData?.prompt || "Odpowiedz krótko: czy działasz poprawnie?"
        })
      });
      if (testResponse.ok) {
        const responseData = await testResponse.json();
        testResult = {
          response: responseData.response || responseData.answer || "Worker działa poprawnie",
          model: worker.config.model,
          source: "real_worker",
          workerUrl: worker.workerUrl,
          status: "success"
        };
      } else {
        throw new Error(`Worker responded with status ${testResponse.status}`);
      }
    } else {
      const testResponse = await fetch(`${worker.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: testData?.prompt || "Test connectivity"
        })
      });
      if (testResponse.ok) {
        const responseData = await testResponse.json();
        testResult = {
          response: responseData.answer || responseData.response || "API endpoint działa poprawnie",
          model: worker.config.model,
          source: "local_api",
          endpoint: worker.endpoint,
          status: "success"
        };
      } else {
        throw new Error(`API endpoint responded with status ${testResponse.status}`);
      }
    }
    console.log(`✅ Test worker: ${worker.name} (${workerId}) - sukces`);
    return createSuccessResponse({
      message: "Test worker zakończony pomyślnie",
      worker: worker.name,
      result: testResult,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error(`❌ Test worker failed: ${worker.name} (${workerId})`, error);
    return createErrorResponse(`Test worker nieudany: ${error.message}`, 500);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
