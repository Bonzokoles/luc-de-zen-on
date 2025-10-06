globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
function parseAiResponse(responseText) {
  const answerMatch = responseText.match(/ANSWER:(.*?)SOURCES:/s);
  const answer = answerMatch ? answerMatch[1].trim() : "Model nie wygenerował odpowiedzi.";
  const sourcesMatch = responseText.match(/SOURCES:(.*)/s);
  const sourcesText = sourcesMatch ? sourcesMatch[1].trim() : "";
  const results = [];
  const sourceLines = sourcesText.split("\n");
  const lineRegex = /\d+\.\s*\[([^\]]+)\]\(([^\]]+)\)\s*-\s*(.*)/;
  for (const line of sourceLines) {
    const match = line.match(lineRegex);
    if (match) {
      results.push({
        title: match[1].trim(),
        url: match[2].trim(),
        content: match[3].trim(),
        score: 0.9
        // Default score
      });
    }
  }
  return { answer, results };
}
const POST = async ({ request, locals }) => {
  const env = getEnv(locals);
  const aiBinding = env.AI;
  if (!aiBinding) {
    return new Response(JSON.stringify({
      status: "error",
      error: "AI binding is not configured in your environment."
    }), { status: 500 });
  }
  try {
    const body = await request.json();
    const query = body.query;
    if (!query) {
      return new Response(JSON.stringify({ status: "error", error: "Query is required" }), { status: 400 });
    }
    const systemPrompt = `You are an AI research assistant. Your task is to search the web for the user's query and provide a concise answer, followed by a list of the most relevant sources. Format your response EXACTLY as follows, in Polish:

ANSWER: [Your summary and answer here]

SOURCES:
1. [Title of the first source](URL of the first source) - [Snippet or brief description of the first source]
2. [Title of the second source](URL of the second source) - [Snippet or brief description of the second source]
3. [Title of the third source](URL of the third source) - [Snippet or brief description of the third source]`;
    const aiResponse = await aiBinding.run("@cf/google/gemma-2-9b-it", {
      // Using a Google model available on Cloudflare
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ]
    });
    const parsedData = parseAiResponse(aiResponse.response || "");
    const responsePayload = {
      status: "success",
      query,
      answer: parsedData.answer,
      results: parsedData.results,
      usage: {
        // Placeholder usage info
        tokensUsed: aiResponse.response?.length || 0,
        requestsRemaining: 99
      }
    };
    return new Response(JSON.stringify(responsePayload), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Tavily API (via Gemini) Error:", error);
    return new Response(JSON.stringify({
      status: "error",
      error: error instanceof Error ? error.message : "Failed to perform search via AI."
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
