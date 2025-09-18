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
export { d as renderers } from '../../chunks/vendor_CYa9XZjz.mjs';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function simulateSTT(audioBuffer) {
  console.log(`Simulating STT for audio buffer of size: ${audioBuffer.byteLength}`);
  await new Promise((res) => setTimeout(res, 1e3));
  return "Opowiedz mi o przyszłości sztucznej inteligencji i modelu Bielik.";
}
async function simulateBielik(text) {
  console.log(`Bielik received text: ${text}`);
  await new Promise((res) => setTimeout(res, 800));
  return "Bielik, jako orkiestrator, będzie personalizować twoje doświadczenia, ucząc się z każdej interakcji. Przyszłość to adaptacyjne, proaktywne systemy AI.";
}
async function simulateTTS(text) {
  console.log(`Simulating TTS for text: ${text}`);
  await new Promise((res) => setTimeout(res, 1200));
  return new ArrayBuffer(0);
}
const POST = async ({ request }) => {
  try {
    const audioArrayBuffer = await request.arrayBuffer();
    const userText = await simulateSTT(audioArrayBuffer);
    const answerText = await simulateBielik(userText);
    const ttsAudioBuffer = await simulateTTS(answerText);
    return new Response(ttsAudioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        ...corsHeaders
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};
const OPTIONS = () => {
  return new Response(null, { headers: corsHeaders });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
