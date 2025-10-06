globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
const ticketDatabase = /* @__PURE__ */ new Map();
const POST = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const aiBinding = env.AI;
    if (!aiBinding) {
      throw new Error("AI binding is not configured in your environment.");
    }
    const { description, email, priority = "medium", category = "" } = await request.json();
    if (!description || !email) {
      return new Response(JSON.stringify({ error: "Description and email are required" }), { status: 400 });
    }
    const ticketId = `TICK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
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
        { role: "system", content: "You are an expert at classifying technical support tickets. You must respond ONLY with a valid JSON object." },
        { role: "user", content: classificationPrompt }
      ],
      max_tokens: 500,
      temperature: 0.2
    });
    let classification;
    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch || !jsonMatch[0]) throw new Error("No JSON object found in AI response.");
      classification = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI classification response:", aiResponse.response);
      classification = {
        team: "tech-support",
        priority,
        category: "other",
        summary: description.substring(0, 100) + "...",
        suggested_actions: "Manual review required due to AI classification failure."
      };
    }
    const newTicket = {
      ticketId,
      status: "open",
      team: classification.team,
      lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
      updates: [{ timestamp: (/* @__PURE__ */ new Date()).toISOString(), message: "Ticket created and classified by AI." }],
      classification,
      originalRequest: { description, email, priority, category }
    };
    ticketDatabase.set(ticketId, newTicket);
    return new Response(JSON.stringify({
      ticketId,
      classification,
      status: "created",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), { status: 200 });
  } catch (error) {
    console.error("Ticket creation error:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), { status: 500 });
  }
};
const GET = async ({ url }) => {
  const ticketId = url.searchParams.get("id");
  if (!ticketId) {
    return new Response(JSON.stringify({ error: "Ticket ID is required" }), { status: 400 });
  }
  const ticket = ticketDatabase.get(ticketId);
  if (!ticket) {
    return new Response(JSON.stringify({ error: "Ticket not found" }), { status: 404 });
  }
  if (Math.random() > 0.5 && ticket.status === "open") {
    ticket.status = "in-progress";
    ticket.updates.push({ timestamp: (/* @__PURE__ */ new Date()).toISOString(), message: "Agent is reviewing the details." });
    ticket.lastUpdate = (/* @__PURE__ */ new Date()).toISOString();
  }
  return new Response(JSON.stringify(ticket), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
