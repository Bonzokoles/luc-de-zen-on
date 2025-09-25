globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getApiKey } from '../../chunks/loadEnv_m7uO93o2.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const POST = async ({ request }) => {
  try {
    const { description, email, priority = "medium", category = "" } = await request.json();
    if (!description || !email) {
      return new Response(JSON.stringify({ error: "Description and email are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const ticketId = `TICK-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const openaiKey = getApiKey("OPENAI_API_KEY");
    const classificationPrompt = `Klasyfikuj poniższe zgłoszenie techniczniejsze do odpowiedniego zespołu i oceń jego priorytet.

Zgłoszenie ID: ${ticketId}
E-mail: ${email}
Priorytet podany przez użytkownika: ${priority}
Kategoria: ${category || "nie podana"}
Opis problemu: ${description}

Zwróć odpowiedź w formacie JSON:
{
  "team": "[tech-support/billing/sales/other]",
  "priority": "[low/medium/high/critical]",
  "category": "[bug/feature-request/question/complaint/other]",
  "urgency": "[can-wait/same-day/immediate]",
  "summary": "[krótkie podsumowanie problemu]",
  "suggested_actions": "[sugerowane działania dla zespołu]"
}

Kryteria klasyfikacji zespołów:
- tech-support: błędy techniczne, problemy z funkcjonalnością, integracje
- billing: płatności, faktury, subskrypcje, rozliczenia
- sales: zapytania przedsprzedażowe, oferty, funkcjonalności premium
- other: ogólne pytania, feedback, pozostałe`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jesteś ekspertem w klasyfikacji zgłoszeń technicznych. Zwracaj odpowiedzi wyłącznie w formacie JSON."
          },
          {
            role: "user",
            content: classificationPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.1
      })
    });
    if (!response.ok) {
      const fallbackClassification = {
        team: "tech-support",
        priority,
        category: "question",
        urgency: "same-day",
        summary: description.substring(0, 100) + "...",
        suggested_actions: "Przegląd i ocena przez zespół"
      };
      return new Response(JSON.stringify({
        ticketId,
        classification: fallbackClassification,
        status: "classified",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        note: "Użyto klasyfikacji awaryjnej z powodu problemu z AI"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const aiData = await response.json();
    let classification;
    try {
      classification = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      classification = {
        team: "tech-support",
        priority,
        category: "question",
        urgency: "same-day",
        summary: description.substring(0, 100) + "...",
        suggested_actions: "Przegląd i ocena przez zespół"
      };
    }
    return new Response(JSON.stringify({
      ticketId,
      classification,
      status: "created",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      originalData: {
        description,
        email,
        priority,
        category
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Ticket creation error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ url }) => {
  const ticketId = url.searchParams.get("id");
  if (!ticketId) {
    return new Response(JSON.stringify({ error: "Ticket ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({
    ticketId,
    status: "in-progress",
    team: "tech-support",
    lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
    updates: [
      { timestamp: (/* @__PURE__ */ new Date()).toISOString(), message: "Ticket został utworzony i przypisany" },
      { timestamp: new Date(Date.now() - 36e5).toISOString(), message: "Zespół rozpoczął analizę" }
    ]
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
