globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { e as createAstro, c as createComponent, a as renderTemplate } from '../../../chunks/astro/server_BDhFni3J.mjs';
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Astro = createAstro("https://mybonzo.com");
=======
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const ADMIN_SYSTEM_PROMPTS = {
  general: `Jesteś zaawansowanym asystentem AI dla administratorów systemu MyBonzo. 

TWOJE ROLE:
- Ekspert w administracji systemami
- Specjalista od bezpieczeństwa i monitoringu
- Doradca w optymalizacji wydajności
- Pomoc w troubleshooting problemów

KONTEKST SYSTEMU MyBonzo:
- Astro framework z Cloudflare Pages
- Multiple AI Workers i API endpoints
- System agentów AI (POLACZEK, Bielik, MyBonzo)
- Cloudflare Workers AI integration
- KV storage dla danych

TWÓJ STYL:
- Profesjonalny ale przyjazny
- Konkretne i praktyczne rady
- Zawsze podawaj przykłady kodu gdy potrzeba
- Priorytetowo traktuj bezpieczeństwo
- Myśl proaktywnie o potencjalnych problemach

Odpowiadaj w języku polskim, używając profesjonalnej terminologii IT.`,
  technical: `Jesteś technicznym ekspertem AI dla systemu MyBonzo z głęboką wiedzą o:

TECHNOLOGIE:
- Astro.js, TypeScript, Cloudflare Workers
- AI Models - Llama, Mistral, Qwen, Bielik
- API design patterns i REST endpoints
- Wrangler CLI i deployment strategies
- Performance optimization

SPECJALIZACJA:
- Debugging kodu i API
- Architektura systemowa
- Code review i best practices
- Performance tuning
- Integration troubleshooting

PODEJŚCIE:
- Analizuj kod pod kątem wydajności
- Proponuj konkretne rozwiązania
- Pokazuj przykłady implementacji
- Zawsze wspominaj o bezpieczeństwie
- Myśl o skalowaniu i utrzymaniu

Odpowiadaj bardzo technicznie w języku polskim.`,
  security: `Jesteś ekspertem bezpieczeństwa dla systemu MyBonzo.

OBSZARY SPECJALIZACJI:
- Authentication i authorization
- API security i rate limiting
- Data protection (RODO/GDPR)
- Secure coding practices
- Infrastructure security
- Incident response

PRIORYTETY:
- Ochrona danych użytkowników
- Bezpieczeństwo API endpoints
- Monitoring podejrzanej aktywności
- Compliance z regulacjami
- Backup i disaster recovery

PODEJŚCIE:
- Security-first mindset
- Risk assessment każdej zmiany
- Proaktywne wykrywanie zagrożeń
- Edukacja zespołu o bezpieczeństwie
- Regularne audyty bezpieczeństwa

Zawsze priorytetowo traktuj bezpieczeństwo nad wygodą. Bądź vigilant i proaktywny.`,
  analytics: `Jesteś ekspertem od analityki i monitoringu systemu MyBonzo.

METRYKI KLUCZOWE:
- Worker performance i response times
- API usage patterns i rate limits
- Error rates i failure analysis
- User behavior analytics
- Cost optimization metrics
- AI model performance stats

NARZĘDZIA:
- Cloudflare Analytics
- Worker metrics i logs
- Custom monitoring dashboards
- Performance profiling
- Usage tracking

INSIGHTS:
- Identyfikuj trendy w użytkowaniu
- Przewiduj potrzeby skalowania
- Optymalizuj koszty operacyjne
- Znajdź bottlenecks wydajności
- Analizuj user experience

Fokusuj się na data-driven decisions i konkretne rekomendacje optymalizacji.`,
  deployment: `Jesteś ekspertem od deployment i DevOps dla systemu MyBonzo.

KOMPETENCJE:
- Cloudflare Pages deployment
- Wrangler CLI i Workers deployment
- CI/CD pipelines
- Environment management
- Rollback strategies
- Performance monitoring

BEST PRACTICES:
- Infrastructure as Code
- Automated testing przed deployment
- Progressive deployment
- Health checks i monitoring
- Disaster recovery planning

Fokusuj się na niezawodności, skalowalności i minimal downtime.`
};
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const OPTIONS = createOPTIONSHandler(["POST"]);
const POST = async ({ request, locals }) => {
  try {
    const { message, model, mode, history } = await request.json();
    if (!message || !model) {
<<<<<<< HEAD
      return createErrorResponse("Brak wymaganych parametr\u0102\u0142w: message, model", 400);
    }
    const adminMode = mode || "general";
    const systemPrompt = ADMIN_SYSTEM_PROMPTS[adminMode] || ADMIN_SYSTEM_PROMPTS.general;
    const ai = locals.runtime.env.AI;
    if (!ai) {
      return createErrorResponse("AI binding nie jest dost\xC4\u2122pne", 500);
    }
=======
      return createErrorResponse("Brak wymaganych parametrów: message, model", 400);
    }
    const adminMode = mode || "general";
    const systemPrompt = ADMIN_SYSTEM_PROMPTS[adminMode] || ADMIN_SYSTEM_PROMPTS.general;
    if (model === "polaczek") {
      try {
        const polaczekResponse = await fetch(new URL("/api/polaczek-chat", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: message,
            model: "polaczek",
            temperature: 0.7,
            language: "pl",
            system: systemPrompt
          })
        });
        if (polaczekResponse.ok) {
          const polaczekData = await polaczekResponse.json();
          return createSuccessResponse({
            response: polaczekData.data?.answer || polaczekData.answer,
            model: "polaczek-assistant",
            mode: adminMode,
            via: "polaczek-integration",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      } catch (polaczekError) {
        console.warn("Polaczek fallback failed, using regular AI:", polaczekError);
      }
    }
    const ai = locals.runtime.env.AI;
    if (!ai) {
      return createErrorResponse("AI binding nie jest dostępne", 500);
    }
    const modelId = model?.startsWith("@cf/") ? model : model === "qwen-pl" ? "@cf/qwen/qwen2.5-7b-instruct" : model === "llama-8b" ? "@cf/meta/llama-3.1-8b-instruct" : model === "gemma" ? "@cf/google/gemma-3-12b-it" : "@cf/google/gemma-3-12b-it";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
    const messages = [
      {
        role: "system",
        content: systemPrompt
      }
    ];
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      messages.push(...recentHistory);
    }
    messages.push({
      role: "user",
      content: message
    });
    const response = await ai.run(model, {
      messages,
      temperature: 0.7,
      max_tokens: 2e3
    });
    if (!response || !response.response) {
      return createErrorResponse("Brak odpowiedzi z modelu AI", 500);
    }
    return createSuccessResponse({
      response: response.response,
      model,
      mode: adminMode,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Admin Chat API Error:", error);
<<<<<<< HEAD
    if (error.message?.includes("model")) {
      return createErrorResponse(`B\u0139\u201A\xC4\u2026d modelu AI: ${error.message}`, 422);
    }
    if (error.message?.includes("rate limit")) {
      return createErrorResponse("Przekroczono limit zapyta\u0139\u201E. Spr\u0102\u0142buj ponownie za chwil\xC4\u2122.", 429);
    }
    return createErrorResponse(`B\u0139\u201A\xC4\u2026d wewn\xC4\u2122trzny: ${error.message}`, 500);
  }
};
const $$Chat = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Chat;
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/api/admin/chat.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/api/admin/chat.astro";
const $$url = "/api/admin/chat";
=======
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (errorMessage?.includes("model")) {
      return createErrorResponse(`Błąd modelu AI: ${errorMessage}`, 422);
    }
    if (errorMessage?.includes("rate limit")) {
      return createErrorResponse("Przekroczono limit zapytań. Spróbuj ponownie za chwilę.", 429);
    }
    return createErrorResponse(`Błąd wewnętrzny: ${errorMessage}`, 500);
  }
};
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    OPTIONS,
<<<<<<< HEAD
    POST,
    default: $$Chat,
    file: $$file,
    url: $$url
=======
    POST
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
