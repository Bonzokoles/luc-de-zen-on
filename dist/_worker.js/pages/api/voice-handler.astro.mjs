globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

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
