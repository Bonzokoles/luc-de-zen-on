import {
  createOPTIONSHandler,
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/corsUtils";

export const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

export async function POST({ request }: { request: Request }) {
  try {
    const body = (await request.json()) as any;
    const { prompt, model, temperature = 0.7, language = "pl" } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt jest wymagany" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const selectedModel = model || "llama-3.1-70b-instruct";

    // Try Multi-AI Worker first (primary AI source)
    try {
      const workerResponse = await fetch(
        "https://multi-ai-assistant.stolarnia-ams.workers.dev/qwen",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: prompt,
            sessionId: "chatbot-session",
            context: {
              source: "ai_bot_worker",
              timestamp: new Date().toISOString(),
            },
          }),
        }
      );

      if (workerResponse.ok) {
        const workerData = (await workerResponse.json()) as any;
        if (workerData.success && workerData.response) {
          return new Response(
            JSON.stringify({
              answer: workerData.response,
              model: workerData.model_name || "@cf/qwen/qwen1.5-0.5b-chat",
              status: "multi_ai_worker_success",
              source: "cloudflare_worker",
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
        }
      }
    } catch (workerError) {
      console.warn(
        "Multi-AI Worker failed, trying OpenAI fallback:",
        workerError
      );
    }

    // Fallback to OpenAI if available
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_API_KEY) {
      try {
        const openaiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: selectedModel.includes("gpt")
                ? selectedModel
                : "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    language === "pl"
                      ? "Jesteś pomocnym asystentem AI. Odpowiadaj po polsku w przystępny i przyjazny sposób."
                      : "You are a helpful AI assistant. Respond in a clear and friendly manner.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: temperature,
              max_tokens: 1000,
            }),
          }
        );

        if (openaiResponse.ok) {
          const openaiData = (await openaiResponse.json()) as any;
          const aiResponse =
            openaiData.choices[0]?.message?.content || "Brak odpowiedzi od API";

          return new Response(
            JSON.stringify({
              answer: aiResponse,
              model: selectedModel,
              status: "openai_api_success",
              tokens_used: openaiData.usage?.total_tokens || 0,
              source: "openai",
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
        }
      } catch (apiError) {
        console.error("OpenAI API error:", apiError);
      }
    }

    // If all AI sources fail, return error instead of demo response
    return new Response(
      JSON.stringify({
        error: "Systemy AI są obecnie niedostępne",
        answer:
          "Przepraszam, nie mogę obecnie przetworzyć Twojego zapytania. Spróbuj ponownie za chwilę.",
        model: selectedModel,
        status: "ai_unavailable",
        note: "Wszystkie systemy AI (Multi-AI Worker i OpenAI) są niedostępne.",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Chatbot error:", error);

    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas przetwarzania zapytania",
        details: error instanceof Error ? error.message : "Nieznany błąd",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  return createSuccessResponse({
    message: "AI Chatbot Worker is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description:
      'Send POST request with { prompt: "your message", model?: "model-name", temperature?: 0.7 }',
  });
}
