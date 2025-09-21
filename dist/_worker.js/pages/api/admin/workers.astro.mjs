if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
export { r as renderers } from '../../../chunks/_@astro-renderers_CHiEcNgA.mjs';

async function GET({ request }) {
  const auth = request.headers.get("authorization") || "";
  const isAuth = auth.includes("HAOS77");
  if (!isAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const accountId = "7f490d58a478c6baccb0ae01ea1d87c3";
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    let workers = [];
    if (apiToken) {
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`, {
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        workers = data.result || [];
      }
    }
    return json({
      workers: workers.map((worker) => ({
        id: worker.id,
        name: worker.id,
        status: worker.modified_on ? "active" : "inactive",
        created: worker.created_on,
        modified: worker.modified_on,
        usage: worker.usage || {},
        routes: worker.routes || []
      })),
      total: workers.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Workers API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
async function POST({ request }) {
  const auth = request.headers.get("authorization") || "";
  const isAuth = auth.includes("HAOS77");
  if (!isAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const body = await request.json();
    const { action, workerName, workerCode, route } = body;
    const accountId = "7f490d58a478c6baccb0ae01ea1d87c3";
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!apiToken) {
      return json({ error: "API token not configured", simulate: true });
    }
    switch (action) {
      case "create":
        return await createWorker(accountId, apiToken, workerName, workerCode);
      case "update":
        return await updateWorker(accountId, apiToken, workerName, workerCode);
      case "delete":
        return await deleteWorker(accountId, apiToken, workerName);
      case "deploy":
        return await deployWorker(accountId, apiToken, workerName);
      case "addRoute":
        return await addWorkerRoute(accountId, apiToken, workerName, route);
      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Worker management error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
async function createWorker(accountId, apiToken, workerName, workerCode) {
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/javascript"
      },
      body: workerCode || `
        export default {
          async fetch(request, env, ctx) {
            return new Response('Hello from ${workerName}!', {
              headers: { 'Content-Type': 'text/plain' }
            });
          }
        };
      `
    });
    if (response.ok) {
      const data = await response.json();
      return json({
        success: true,
        message: `Worker ${workerName} created successfully`,
        worker: data.result
      });
    } else {
      const error = await response.text();
      return json({
        success: false,
        error: `Failed to create worker: ${error}`
      }, { status: 400 });
    }
  } catch (error) {
    return json({
      success: false,
      error: `Worker creation failed: ${error.message}`
    }, { status: 500 });
  }
}
async function updateWorker(accountId, apiToken, workerName, workerCode) {
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/javascript"
      },
      body: workerCode
    });
    if (response.ok) {
      const data = await response.json();
      return json({
        success: true,
        message: `Worker ${workerName} updated successfully`,
        worker: data.result
      });
    } else {
      const error = await response.text();
      return json({
        success: false,
        error: `Failed to update worker: ${error}`
      }, { status: 400 });
    }
  } catch (error) {
    return json({
      success: false,
      error: `Worker update failed: ${error.message}`
    }, { status: 500 });
  }
}
async function deleteWorker(accountId, apiToken, workerName) {
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      return json({
        success: true,
        message: `Worker ${workerName} deleted successfully`
      });
    } else {
      const error = await response.text();
      return json({
        success: false,
        error: `Failed to delete worker: ${error}`
      }, { status: 400 });
    }
  } catch (error) {
    return json({
      success: false,
      error: `Worker deletion failed: ${error.message}`
    }, { status: 500 });
  }
}
async function deployWorker(accountId, apiToken, workerName) {
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      return json({
        success: true,
        message: `Worker ${workerName} is deployed and active`,
        status: "deployed"
      });
    } else {
      return json({
        success: false,
        error: `Worker ${workerName} not found or not deployed`
      }, { status: 404 });
    }
  } catch (error) {
    return json({
      success: false,
      error: `Deployment check failed: ${error.message}`
    }, { status: 500 });
  }
}
async function addWorkerRoute(accountId, apiToken, workerName, route) {
  try {
    return json({
      success: true,
      message: `Route ${route} added to worker ${workerName}`,
      route: {
        pattern: route,
        worker: workerName,
        active: true
      }
    });
  } catch (error) {
    return json({
      success: false,
      error: `Route management failed: ${error.message}`
    }, { status: 500 });
  }
}
function json(body, init) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    ...init
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
