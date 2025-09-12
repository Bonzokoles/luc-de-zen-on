// src/workers/main-chat-worker.ts
var main_chat_worker_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    if (request.method === "POST") {
      try {
        const requestData = await request.json();
        const chatMessages = [
          {
            role: "system",
            content: "Jesteś głównym asystentem MyBonzo. Pomagasz użytkownikom w ich codziennych zadaniach. Odpowiadaj w języku polskim w sposób przyjazny i profesjonalny."
          },
          ...requestData.messages
        ];
        // Zmieniony model na Gemma
        const response = await env.AI.run("@cf/google/gemma-7b-it", {
          messages: chatMessages,
          max_tokens: requestData.max_tokens || 512,
          temperature: requestData.temperature || 0.7
        });
        return new Response(JSON.stringify({
          success: true,
          response: response.response || "Nie udało się wygenerować odpowiedzi.",
          model: "gemma-7b-it",
          provider: "cloudflare-ai",
          chat_type: "main"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (error) {
        console.error("Main chat error:", error);
        return new Response(JSON.stringify({
          error: "Main chat error",
          details: error?.message || "Unknown error"
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
export {
  main_chat_worker_default as default
};
