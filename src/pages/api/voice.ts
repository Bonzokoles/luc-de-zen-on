import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, request }) => {
  const searchParams = new URL(request.url).searchParams;
  const action = searchParams.get("action");

  // Test connection
  if (action === "test") {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Voice AI API endpoint is working",
        timestamp: new Date().toISOString(),
        availableActions: [
          "test",
          "recognize",
          "synthesize",
          "analyze",
          "commands",
        ],
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

  // Get status
  if (action === "status") {
    return new Response(
      JSON.stringify({
        success: true,
        status: "active",
        endpoints: {
          recognition: "/api/voice/recognition",
          synthesis: "/api/voice/synthesis",
          analysis: "/api/voice/analysis",
          commands: "/api/voice/commands",
        },
        timestamp: new Date().toISOString(),
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

  return new Response(
    JSON.stringify({
      error: "Invalid action parameter",
      availableActions: ["test", "status"],
    }),
    {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = (await request.json()) as any;
    const { action, text, language, voiceType } = data;

    if (action === "synthesize" && text) {
      // Voice synthesis logic would go here
      return new Response(
        JSON.stringify({
          success: true,
          message: "Voice synthesis request processed",
          text: text,
          language: language || "pl-PL",
          voiceType: voiceType || "neural",
          timestamp: new Date().toISOString(),
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

    if (action === "recognize") {
      // Voice recognition logic would go here
      return new Response(
        JSON.stringify({
          success: true,
          message: "Voice recognition request processed",
          timestamp: new Date().toISOString(),
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

    return new Response(
      JSON.stringify({
        error: "Invalid action or missing parameters",
        received: data,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Invalid JSON payload",
        message: error?.message || "Unknown error",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
