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
import { e as createAstro, c as createComponent, a as renderTemplate } from '../../../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../../../chunks/vendor_QZhDtzeH.mjs';
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_DD_RavK2.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const OPTIONS = createOPTIONSHandler(["POST"]);
const POST = async ({ request, locals }) => {
  try {
    const { message, model, mode, history } = await request.json();
    if (!message || !model) {
      return createErrorResponse("Brak wymaganych parametr\xF3w: message, model", 400);
    }
    const adminMode = mode || "general";
    const systemPrompt = ADMIN_SYSTEM_PROMPTS[adminMode] || ADMIN_SYSTEM_PROMPTS.general;
    const ai = locals.runtime.env.AI;
    if (!ai) {
      return createErrorResponse("AI binding nie jest dost\u0119pne", 500);
    }
    const messages = [
      {
        role: "system",
        content: systemPrompt
      }
    ];
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      messages.push(...recentHistory);
    }
    messages.push({
      role: "user",
      content: message
    });
    const response = await ai.run(model, {
      messages,
      temperature: 0.7,
      max_tokens: 2e3
    });
    if (!response || !response.response) {
      return createErrorResponse("Brak odpowiedzi z modelu AI", 500);
    }
    return createSuccessResponse({
      response: response.response,
      model,
      mode: adminMode,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Admin Chat API Error:", error);
    if (error.message?.includes("model")) {
      return createErrorResponse(`B\u0142\u0105d modelu AI: ${error.message}`, 422);
    }
    if (error.message?.includes("rate limit")) {
      return createErrorResponse("Przekroczono limit zapyta\u0144. Spr\xF3buj ponownie za chwil\u0119.", 429);
    }
    return createErrorResponse(`B\u0142\u0105d wewn\u0119trzny: ${error.message}`, 500);
  }
};
const $$Chat = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Chat;
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/api/admin/chat.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/api/admin/chat.astro";
const $$url = "/api/admin/chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    OPTIONS,
    POST,
    default: $$Chat,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
