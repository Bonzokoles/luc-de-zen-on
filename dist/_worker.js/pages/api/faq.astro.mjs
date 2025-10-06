globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const isNodeEnvironment = typeof process !== "undefined" && process.env;
const API_KEYS = {
  // OpenAI dla generowania FAQ i AI funkcji
  OPENAI_API_KEY: isNodeEnvironment ? process.env.OPENAI_API_KEY || "" : "",
  // Flowise dla automatyzacji workflow
  FLOWISE_API_TOKEN: isNodeEnvironment ? process.env.FLOWISE_API_TOKEN || "" : "",
  // ActivePieces dla powiadomień i automatyzacji
  ACTIVEPIECES_API_KEY: isNodeEnvironment ? process.env.ACTIVEPIECES_API_KEY || "" : "",
  // Cloudflare dla Workers i deployment
  CLOUDFLARE_API_TOKEN: isNodeEnvironment ? process.env.CLOUDFLARE_API_TOKEN || "" : "",
  CLOUDFLARE_ACCOUNT_ID: isNodeEnvironment ? process.env.CLOUDFLARE_ACCOUNT_ID || "" : "",
  // Inne integracje
  GITHUB_TOKEN: isNodeEnvironment ? process.env.GITHUB_TOKEN || "" : "",
  WEBHOOK_SECRET: isNodeEnvironment ? process.env.WEBHOOK_SECRET || "" : "",
  // Email/SMS dla powiadomień
  EMAIL_API_KEY: isNodeEnvironment ? process.env.EMAIL_API_KEY || "" : "",
  SMS_API_KEY: isNodeEnvironment ? process.env.SMS_API_KEY || "" : "",
  // Database i storage
  DATABASE_URL: isNodeEnvironment ? process.env.DATABASE_URL || "" : "",
  STORAGE_API_KEY: isNodeEnvironment ? process.env.STORAGE_API_KEY || "" : ""
};
function validateRequiredKeys() {
  const required = ["OPENAI_API_KEY"];
  const missing = [];
  required.forEach((key) => {
    if (!API_KEYS[key]) {
      missing.push(key);
    }
  });
  if (missing.length > 0 && isNodeEnvironment) {
    console.warn(`⚠️  Brakuje kluczy API: ${missing.join(", ")}`);
    console.warn("Niektóre funkcje mogą nie działać poprawnie.");
  }
  return missing.length === 0;
}
function getApiKey(keyName) {
  const key = API_KEYS[keyName];
  if (!key) {
    throw new Error(`Klucz API '${keyName}' nie został skonfigurowany`);
  }
  return key;
}
if (isNodeEnvironment) {
  validateRequiredKeys();
  console.log("🔑 System zarządzania kluczami API załadowany");
}

const POST = async ({ request }) => {
  try {
    const { knowledgeBase } = await request.json();
    if (!knowledgeBase) {
      return new Response(JSON.stringify({ error: "Knowledge base is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const openaiKey = getApiKey("OPENAI_API_KEY");
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
            content: "Generuj pytania i odpowiedzi FAQ na podstawie bazy wiedzy. Format: Q: pytanie\nA: odpowiedź\n\n"
          },
          {
            role: "user",
            content: `Baza wiedzy: ${knowledgeBase}`
          }
        ],
        max_tokens: 1e3,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: `OpenAI API error: ${error}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await response.json();
    const faq = data.choices[0].message.content;
    return new Response(JSON.stringify({
      faq,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "success"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("FAQ generation error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
