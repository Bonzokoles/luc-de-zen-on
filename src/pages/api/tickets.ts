import type { APIRoute } from "astro";

// In-memory "database" for tickets for demonstration purposes
const ticketDatabase: Map<string, any> = new Map();

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Defensive environment access
    const env = (locals as any)?.runtime?.env;
    if (!env) {
      return new Response(
        JSON.stringify({ error: "Environment not available" }),
        { status: 503 }
      );
    }

    const aiBinding = env.AI;
    if (!aiBinding) {
      return new Response(
        JSON.stringify({ error: "AI binding is not configured" }),
        { status: 503 }
      );
    }

    const body = (await request.json()) as any;
    const { description, email, priority = "medium", category = "" } = body;

    if (!description || !email) {
      return new Response(
        JSON.stringify({ error: "Description and email are required" }),
        { status: 400 }
      );
    }

    const ticketId = `TICK-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    const classificationPrompt = `Classify the following support ticket and return a JSON object.

    Ticket ID: ${ticketId}
    Email: ${email}
    User-provided Priority: ${priority}
    Category: ${category || "not provided"}
    Description: ${description}

    Your task is to analyze the description and return a valid JSON object with the following structure:
    {
      "team": "[tech-support/billing/sales/other]",
      "priority": "[low/medium/high/critical]",
      "category": "[bug/feature-request/question/complaint/other]",
      "summary": "[a short summary of the issue in Polish]",
      "suggested_actions": "[suggested next steps for the support team in Polish]"
    }

    Classification criteria:
    - tech-support: technical errors, bugs, integration problems.
    - billing: payments, invoices, subscriptions.
    - sales: pre-sales questions, feature inquiries.
    - other: general questions, feedback.`;

    const aiResponse = await aiBinding.run("@cf/google/gemma-2-9b-it", {
      messages: [
        {
          role: "system",
          content:
            "You are an expert at classifying technical support tickets. You must respond ONLY with a valid JSON object.",
        },
        { role: "user", content: classificationPrompt },
      ],
      max_tokens: 500,
      temperature: 0.2,
    });

    let classification;
    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch || !jsonMatch[0])
        throw new Error("No JSON object found in AI response.");
      classification = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error(
        "Failed to parse AI classification response:",
        aiResponse.response
      );
      // Fallback if AI fails to produce valid JSON
      classification = {
        team: "tech-support",
        priority: priority,
        category: "other",
        summary: description.substring(0, 100) + "...",
        suggested_actions:
          "Manual review required due to AI classification failure.",
      };
    }

    const newTicket = {
      ticketId,
      status: "open",
      team: classification.team,
      lastUpdate: new Date().toISOString(),
      updates: [
        {
          timestamp: new Date().toISOString(),
          message: "Ticket created and classified by AI.",
        },
      ],
      classification,
      originalRequest: { description, email, priority, category },
    };

    // Save to our in-memory database
    ticketDatabase.set(ticketId, newTicket);

    return new Response(
      JSON.stringify({
        ticketId,
        classification,
        status: "created",
        timestamp: new Date().toISOString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ticket creation error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  const ticketId = url.searchParams.get("id");

  if (!ticketId) {
    return new Response(JSON.stringify({ error: "Ticket ID is required" }), {
      status: 400,
    });
  }

  const ticket = ticketDatabase.get(ticketId);

  if (!ticket) {
    return new Response(JSON.stringify({ error: "Ticket not found" }), {
      status: 404,
    });
  }

  // Add a random update for demonstration purposes if the ticket is still in progress
  if (Math.random() > 0.5 && ticket.status === "open") {
    ticket.status = "in-progress";
    ticket.updates.push({
      timestamp: new Date().toISOString(),
      message: "Agent is reviewing the details.",
    });
    ticket.lastUpdate = new Date().toISOString();
  }

  return new Response(JSON.stringify(ticket), { status: 200 });
};
