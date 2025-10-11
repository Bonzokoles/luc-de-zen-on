import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { user_message, system_prompt, model } = body;

    if (!user_message || !system_prompt || !model) {
      return new Response(
        JSON.stringify({
          error: "Brak wymaganych pól: user_message, system_prompt, model",
        }),
        {
          status: 400,
        }
      );
    }

    // Defensive coding: Check if runtime environment is available
    const env = locals.runtime?.env;
    if (!env?.AI) {
      return new Response(
        JSON.stringify({
          error: "AI service not available",
          success: false,
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const ai = env.AI;

    const messages = [
      { role: "system", content: system_prompt },
      { role: "user", content: user_message },
    ];

    const inputs = {
      messages,
    };

    const response = await ai.run(model, inputs);

    // In a real-world scenario, you might want to stream the response.
    // For simplicity here, we return the full response at once.
    return new Response(JSON.stringify({ answer: response.response }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Błąd w generic-chat API:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd serwera podczas generowania odpowiedzi AI.",
      }),
      { status: 500 }
    );
  }
};
