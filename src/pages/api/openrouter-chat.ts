import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as {
      message?: string;
      model?: string;
      systemPrompt?: string;
    };
    const {
      message,
      model,
      systemPrompt = "Jesteś pomocnym asystentem AI.",
    } = body;

    if (!message || !model) {
      return new Response(
        JSON.stringify({
          error: "Brak wymaganych pól: message, model",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Defensive coding - sprawdzenie dostępności środowiska
    const env = (locals as any).runtime?.env;
    if (!env) {
      return new Response(
        JSON.stringify({
          error: "Environment not available",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const openrouterApiKey =
      env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!openrouterApiKey) {
      return new Response(
        JSON.stringify({
          error: "Brak konfiguracji OpenRouter API key",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterApiKey}`,
          "HTTP-Referer": "https://www.mybonzo.com",
          "X-Title": "MyBonzo AI Platform",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      return new Response(
        JSON.stringify({
          error: `OpenRouter API Error: ${response.status}`,
          details: errorData,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: any;
    };

    return new Response(
      JSON.stringify({
        response: data.choices?.[0]?.message?.content || "Brak odpowiedzi",
        model: model,
        usage: data.usage,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(
      JSON.stringify({
        error: "Błąd serwera podczas komunikacji z OpenRouter",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
