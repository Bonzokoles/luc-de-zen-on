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
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../../chunks/corsUtils_DfX9K_yD.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_CHiEcNgA.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "POST"]);
const inMemoryBackups = [];
const GET = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return createSuccessResponse({ backups: inMemoryBackups, demoAuth: false });
    }
    return createSuccessResponse({ backups: inMemoryBackups, demoAuth: token === "HAOS77" });
  } catch (e) {
    console.error("backup GET error", e);
    return createErrorResponse("Failed to list backups", 500);
  }
};
const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== "HAOS77") {
      return createErrorResponse("Unauthorized", 401);
    }
    const { action, reason } = await request.json();
    if (action !== "create") {
      return createErrorResponse("Invalid action", 400);
    }
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const name = `backup_${stamp}${reason ? "_" + reason : ""}.zip`;
    const entry = { name, date: (/* @__PURE__ */ new Date()).toISOString(), age: "Active" };
    inMemoryBackups.unshift(entry);
    if (inMemoryBackups.length > 5) inMemoryBackups.pop();
    return createSuccessResponse({ status: "created", backup: entry });
  } catch (e) {
    console.error("backup POST error", e);
    return createErrorResponse("Failed to create backup", 500);
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
