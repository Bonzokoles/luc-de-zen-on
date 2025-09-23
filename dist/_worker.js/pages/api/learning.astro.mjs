globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const userLearningData = {};
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const ALL = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId parameter" }), { status: 400, headers: corsHeaders });
  }
  if (!userLearningData[userId]) {
    userLearningData[userId] = { dialogues: [], vocab: {} };
  }
  if (request.method === "GET") {
    const learningData = userLearningData[userId];
    return new Response(JSON.stringify(learningData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  if (request.method === "POST") {
    try {
      const payload = await request.json();
      const existing = userLearningData[userId];
      if (payload.dialogues && Array.isArray(payload.dialogues)) {
        existing.dialogues.push(...payload.dialogues);
      }
      if (payload.vocab) {
        Object.assign(existing.vocab, payload.vocab);
      }
      userLearningData[userId] = existing;
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), { status: 400, headers: corsHeaders });
    }
  }
  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
