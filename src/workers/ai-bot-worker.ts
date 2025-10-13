interface PromptRequest {
  prompt: string;
  model?: string;
  temperature?: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST method allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      const {
        prompt,
        model = "@cf/meta/llama-3.1-8b-instruct",
        temperature = 0.7,
      } = await request.json<PromptRequest>();

      if (!prompt || prompt.trim().length === 0) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Wywołanie Workers AI
      const response = await env.AI.run(model as any, {
        messages: [
          {
            role: "system",
            content:
              "Jesteś pomocnym asystentem AI. Odpowiadaj zwięźle po polsku.",
          },
          { role: "user", content: prompt.trim() },
        ],
        temperature,
      });

      return new Response(
        JSON.stringify({
          success: true,
          answer:
            (response as any).response ||
            "Przepraszam, nie udało się wygenerować odpowiedzi.",
          model,
          prompt,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("AI Bot Worker Error:", error);

      return new Response(
        JSON.stringify({
          error: "AI processing failed",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  },
};
