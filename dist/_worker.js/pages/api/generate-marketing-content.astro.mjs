globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
const POST = async ({ request, locals }) => {
  const env = getEnv(locals);
  const aiBinding = env.AI;
  if (!aiBinding) {
    return new Response(JSON.stringify({ success: false, error: "AI binding is not configured." }), { status: 500 });
  }
  try {
    const body = await request.json();
    const { prompt, contentType } = body;
    if (!prompt || !contentType) {
      return new Response(JSON.stringify({ success: false, error: "Prompt and contentType are required." }), { status: 400 });
    }
    const systemPrompt = `You are an expert Polish marketing content generator. Your task is to create a compelling and professional piece of content based on the user's topic and the specified content type. The response should be in Polish and ready to be published.

    Content Type: ${contentType}
    Topic: ${prompt}`;
    const aiResponse = await aiBinding.run("@cf/google/gemma-2-9b-it", {
      messages: [
        { role: "system", content: systemPrompt }
      ],
      max_tokens: 1500
    });
    return new Response(JSON.stringify({
      success: true,
      text: aiResponse.response || "AI model did not return a response."
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Marketing Content API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate content."
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
