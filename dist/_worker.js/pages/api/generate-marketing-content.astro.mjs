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
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../chunks/corsUtils_DD_RavK2.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const POST = async ({ request, locals }) => {
  try {
    const { prompt, contentType } = await request.json();
    const env = locals.runtime.env;
    if (!prompt || !contentType) {
      return createErrorResponse("Missing required fields", 400);
    }
    if (!env.AI) {
      return createErrorResponse("Cloudflare AI nie jest dostępny", 500);
    }
    const systemPrompt = "Jesteś ekspertem marketingu tworzącym angażujące teksty w stylu nowoczesnym i profesjonalnym. Używaj dynamicznego, przystępnego stylu z wyraźnym CTA zachęcającym do działania.";
    const userPrompt = `Napisz ${contentType} na temat: ${prompt}. Użyj stylu: dynamiczny, przystępny, z CTA zachęcającym do działania. Tekst powinien być profesjonalny ale przyjazny.`;
    const response = await env.AI.run(env.ADVANCED_TEXT_MODEL || "@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    });
    const generatedText = response.response;
    return createSuccessResponse({
      success: true,
      text: generatedText,
      contentType,
      prompt
    });
  } catch (error) {
    console.error("Error generating marketing content:", error);
    return createErrorResponse("Failed to generate marketing content", 500);
  }
};
const OPTIONS = createOPTIONSHandler(["POST", "OPTIONS"]);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
