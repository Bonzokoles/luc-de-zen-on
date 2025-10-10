import type { APIRoute } from "astro";
import {
  createOPTIONSHandler,
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/corsUtils";

export const OPTIONS = createOPTIONSHandler(["POST", "OPTIONS"]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as any;
    const {
      prompt,
      model = "bielik-7b-instruct",
      temperature = 0.7,
      max_tokens = 512,
    } = body;

    console.log("BIELIK Chat request:", {
      prompt: prompt?.substring(0, 100),
      model,
      temperature,
      max_tokens,
    });

    if (!prompt || prompt.trim() === "") {
      return createErrorResponse("Prompt jest wymagany", 400);
    }

    // Cloudflare Worker URL for BIELIK
    const BIELIK_WORKER_URL = "https://bielik-worker.stolarnia-ams.workers.dev";

    try {
      // Call Cloudflare Worker
      const workerResponse = await fetch(BIELIK_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            process.env.CLOUDFLARE_API_TOKEN || "dev-token"
          }`,
        },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          max_tokens,
          timestamp: Date.now(),
        }),
      });

      if (!workerResponse.ok) {
        console.error(
          "Worker response not ok:",
          workerResponse.status,
          workerResponse.statusText
        );
        const errorData = (await workerResponse.json()) as any;
        return createErrorResponse(
          errorData.error || "Błąd workera BIELIK",
          workerResponse.status
        );
      }

      const data = await workerResponse.json();
      console.log("BIELIK Worker response received");

      return createSuccessResponse(data);
    } catch (innerError) {
      console.error("BIELIK Worker error:", innerError);
      return createErrorResponse("Błąd komunikacji z BIELIK Worker", 500);
    }
  } catch (error) {
    console.error("BIELIK Chat error:", error);
    return createErrorResponse(
      "Błąd podczas przetwarzania żądania BIELIK",
      500
    );
  }
};
