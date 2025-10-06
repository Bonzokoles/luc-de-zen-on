import type { APIRoute } from 'astro';

// Helper to get secrets
function getEnv(locals: App.Locals): Record<string, any> {
  return import.meta.env.DEV ? process.env : locals?.runtime?.env || {};
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);
  const aiBinding = env.AI;

  if (!aiBinding) {
    return new Response(JSON.stringify({ status: 'error', error: 'AI binding is not configured.' }), { status: 500 });
  }

  try {
    const body = await request.json();
    const { data, prompt } = body;

    if (!data || !prompt) {
      return new Response(JSON.stringify({ status: 'error', message: 'Data and prompt are required.' }), { status: 400 });
    }

    const systemPrompt = `You are "Analytics Prophet", an AI specializing in time-series data analysis and forecasting. Your task is to analyze the provided data and generate a concise, insightful report based on the user's prompt.

    DATA:
    ${JSON.stringify(data)}

    USER'S PROMPT:
    "${prompt}"

    Your response should be in Polish and include:
    1.  **Kluczowe Obserwacje:** A summary of the main trends, patterns, or anomalies in the data.
    2.  **Prognoza:** A natural language forecast for the next period.
    3.  **Rekomendacje:** One or two actionable recommendations based on your analysis.`;

    const aiResponse = await aiBinding.run('@cf/google/gemma-2-9b-it', {
        messages: [
            { role: 'system', content: systemPrompt }
        ],
        max_tokens: 1024,
    });

    return new Response(JSON.stringify({
      status: 'success',
      analysis: aiResponse.response || "AI model did not return a response."
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Analytics Prophet API Error:", error);
    return new Response(JSON.stringify({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to generate analysis.'
    }), { status: 500 });
  }
};
