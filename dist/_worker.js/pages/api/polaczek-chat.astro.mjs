globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

// Documentation Index for POLACZEK AI Assistant
// This file maps all available documentation for contextual responses

const documentationIndex = {
    // AI Functions Documentation
    ai_functions: {
        title: "AI Functions Documentation",
        file: "AI_FUNCTIONS_DOCUMENTATION.md",
        description: "Complete documentation of all AI functions available in MyBonzo",
        keywords: ["ai", "functions", "artificial intelligence", "automation", "features"]
    },

    // System Components
    bielik_buttons: {
        title: "Bielik Buttons System",
        files: [
            "BIELIK_PRZYCISKI_DEBUGGING_REPORT.md",
            "BIELIK_PRZYCISKI_QUICK_REFERENCE.md"
        ],
        description: "Documentation for Bielik button system debugging and reference",
        keywords: ["bielik", "buttons", "interface", "debugging", "ui"]
    },

    bigquery_analytics: {
        title: "BigQuery Analytics",
        file: "bigquery_analytics_summary.md",
        description: "BigQuery integration and analytics functionality",
        keywords: ["bigquery", "analytics", "data", "sql", "statistics"]
    },

    // Complete System Documentation
    system_overview: {
        title: "Complete System Overview",
        file: "COMPLETE_SYSTEM_OVERVIEW.md",
        description: "Comprehensive overview of the entire MyBonzo system",
        keywords: ["system", "overview", "architecture", "complete", "documentation"]
    },

    // Flowise AI Integration
    flowise: {
        title: "Flowise AI Integration",
        files: [
            "FLOWISE_AI_DOCUMENTATION_INDEX.md",
            "FLOWISE_AI_INTEGRATION_STATUS.md",
            "FLOWISE_AI_QUICK_REFERENCE.md",
            "FLOWISE_AI_TECHNICAL_GUIDE.md",
            "FLOWISE_AI_USER_GUIDE.md"
        ],
        description: "Complete Flowise AI integration documentation",
        keywords: ["flowise", "ai integration", "workflows", "automation", "technical guide"]
    },

    // Business Functions
    business_functions: {
        title: "Business AI Functions",
        file: "FUNKCJE_BIZNESOWE_AI_DOKUMENTACJA.md",
        description: "Documentation of AI business functions and features",
        keywords: ["business", "functions", "ai features", "automation", "enterprise"]
    },

    // User Instructions
    user_guide: {
        title: "User Instructions and Guides",
        files: [
            "INSTRUKCJE_UZYTKOWNIKA.md",
            "QUICK_START_GUIDE.md"
        ],
        description: "User instructions and quick start guides",
        keywords: ["user guide", "instructions", "quick start", "tutorial", "help"]
    },

    // MyBonzo Documentation
    mybonzo_docs: {
        title: "MyBonzo Complete Documentation",
        files: [
            "MYBONZO_COMPLETE_DOCUMENTATION_2025.md",
            "MYBONZO_COMPLETE_PROJECT_DOCUMENTATION.md",
            "MYBONZO_PROJECT_ROADMAP_2025.md"
        ],
        description: "Complete MyBonzo project documentation and roadmap",
        keywords: ["mybonzo", "project", "documentation", "roadmap", "complete"]
    },

    // POLACZEK AI Assistant
    polaczek: {
        title: "POLACZEK AI Assistant",
        files: [
            "POLACZEK_AI_ASSISTANT_INTEGRATION_COMPLETE_2025.md",
            "POLACZEK_SUBPAGES_FUNCTIONALITY_REPORT.md"
        ],
        description: "POLACZEK AI Assistant integration and functionality",
        keywords: ["polaczek", "ai assistant", "integration", "chat", "assistant"]
    },

    // Implementation Reports
    implementation: {
        title: "Implementation Reports",
        files: [
            "DODATKI_IMPLEMENTATION_FINAL_REPORT.md",
            "DODATKI_TECHNICAL_IMPLEMENTATION_REPORT.md",
            "INTERFACE_UPDATE_REPORT.md",
            "LOKALNY_TEST_APLIKACJI_RAPORT.md"
        ],
        description: "Technical implementation and testing reports",
        keywords: ["implementation", "reports", "technical", "testing", "development"]
    },

    // System Management
    system_management: {
        title: "System Management and Deployment",
        files: [
            "SYSTEM_AUTOMATYZACJI_DEPLOYMENT_DOKUMENTACJA.md",
            "SYSTEM_VERIFICATION_REPORT_2025-09-06.md",
            "ZENON_WORKERS_STATUS_IMPLEMENTATION_REPORT.md"
        ],
        description: "System deployment, automation and verification documentation",
        keywords: ["deployment", "automation", "system management", "workers", "verification"]
    }
};

// Function to find relevant documentation based on query
function findRelevantDocs(query) {
    const queryLower = query.toLowerCase();
    const relevantDocs = [];

    for (const [key, doc] of Object.entries(documentationIndex)) {
        // Check if query matches keywords or title
        const matchesKeywords = doc.keywords.some(keyword =>
            queryLower.includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(queryLower)
        );

        const matchesTitle = doc.title.toLowerCase().includes(queryLower);
        const matchesDescription = doc.description.toLowerCase().includes(queryLower);

        if (matchesKeywords || matchesTitle || matchesDescription) {
            relevantDocs.push({
                category: key,
                ...doc,
                relevanceScore: calculateRelevanceScore(query, doc)
            });
        }
    }

    // Sort by relevance score
    return relevantDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function calculateRelevanceScore(query, doc) {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Title match (highest priority)
    if (doc.title.toLowerCase().includes(queryLower)) score += 10;

    // Keyword matches
    doc.keywords.forEach(keyword => {
        if (queryLower.includes(keyword.toLowerCase())) score += 5;
        if (keyword.toLowerCase().includes(queryLower)) score += 3;
    });

    // Description match
    if (doc.description.toLowerCase().includes(queryLower)) score += 2;

    return score;
}

const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);
const GET = async () => {
  return createSuccessResponse({
    message: "POLACZEK Chat API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'POST { prompt, model?: "qwen"|"gemma"|"fast"|"advanced", temperature?, language?: "pl" }',
    features: ["MyBonzo Knowledge Base", "Polish AI Assistant", "Multilingual Models"],
    defaults: {
      model: "qwen",
      // Changed from 'polaczek' to better Polish model
      language: "pl",
      temperature: 0.6
    }
  });
};
const MyBonzoKnowledge = {
  site: {
    title: "MyBonzo – Portfolio Karol Lisson",
    description: "Nowoczesne portfolio, design i AI. SYSTEM AGENTS.",
    url: "https://luc-de-zen-on.pages.dev",
    email: "LissonKarol.msa@gmail.com",
    github: "https://github.com/Bonzokoles/luc-de-zen-on"
  },
  services: {
    "AI Image Generator": {
      endpoint: "/image-generator",
      api: "/api/generate-image",
      description: "Generuje obrazy używając Flux-1 Schnell",
      features: ["Flux AI", "512-1024px", "Tłumaczenie PL"]
    },
    "AI Chatbot": {
      endpoint: "/chatbot",
      api: "/api/chat",
      description: "Inteligentny asystent do rozmów",
      models: ["OpenAI GPT", "DeepSeek", "Qwen", "Gemma", "LLaMA"]
    },
    "BigQuery Analytics": {
      endpoint: "/bigquery-analytics",
      api: "/api/bigquery",
      description: "Analizuj dane z Google BigQuery"
    },
    "Kaggle Datasets": {
      endpoint: "/kaggle-datasets",
      api: "/api/kaggle",
      description: "Przeszukuj zbiory danych Kaggle"
    },
    "Tavily AI Search": {
      endpoint: "/tavily-search",
      api: "/api/tavi",
      description: "Zaawansowane wyszukiwanie internetowe powered by AI"
    },
    "AI Agents System": {
      endpoint: "/agents",
      api: "/api/agents",
      description: "System AI agentów z MyBonzo, POLACZEK, Bielik"
    }
  },
  advanced_functions: [
    "Personalizowane rekomendacje AI",
    "Automatyzacja obsługi klienta",
    "Monitorowanie i raportowanie",
    "Harmonogramowanie i przypomnienia",
    "Generator FAQ dynamiczny",
    "Rekomendacje edukacyjne",
    "System ticketów AI",
    "Quizy i testy interaktywne",
    "Generator treści marketingowych"
  ],
  technical_info: {
    framework: "Astro 5.13.5",
    hosting: "Cloudflare Pages",
    deployment_url: "https://luc-de-zen-on.pages.dev",
    ai_models: [
      "@cf/qwen/qwen1.5-7b-chat-awq (domyślny - najlepszy dla polskiego)",
      "@cf/google/gemma-7b-it (wielojęzyczny)",
      "@cf/qwen/qwen1.5-0.5b-chat (szybki)",
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast (zaawansowany)",
      "@cf/deepseek-ai/deepseek-math-7b-instruct (matematyka)"
    ]
  }
};
async function getEnhancedContext(prompt) {
  let context = getContextualResponse(prompt);
  try {
    const relevantDocs = findRelevantDocs(prompt);
    if (relevantDocs && relevantDocs.length > 0) {
      context += "\n\n📖 **Dokumentacja:**\n";
      relevantDocs.slice(0, 2).forEach((doc) => {
        context += `
**${doc.title}**:
${doc.description}
`;
        if (doc.keywords) {
          context += `Słowa kluczowe: ${doc.keywords.join(", ")}
`;
        }
      });
    }
  } catch (error) {
    console.error("Error reading documentation index:", error);
  }
  return context;
}
function getContextualResponse(userQuery) {
  const queryLower = userQuery.toLowerCase();
  let context = "";
  if (queryLower.includes("obraz") || queryLower.includes("generuj") || queryLower.includes("zdjęcie") || queryLower.includes("image")) {
    context = `🎨 **Generator obrazów AI MyBonzo**

`;
    context += `MyBonzo oferuje zaawansowany generator obrazów AI używający modelu Flux-1 Schnell. `;
    context += `Możesz generować obrazy z tekstu w różnych stylach i rozmiarach (512-1024px).

`;
    context += `• Strona: ${MyBonzoKnowledge.site.url}/image-generator
`;
    context += `• API: ${MyBonzoKnowledge.services["AI Image Generator"].api}
`;
    context += `• Funkcje: ${MyBonzoKnowledge.services["AI Image Generator"].features.join(", ")}`;
  } else if (queryLower.includes("bigquery") || queryLower.includes("analiza") || queryLower.includes("dane") || queryLower.includes("sql")) {
    context = `📊 **BigQuery Analytics MyBonzo**

`;
    context += `MyBonzo oferuje zaawansowaną analizę danych przez BigQuery Analytics. `;
    context += `Możesz wykonywać zapytania SQL i analizować dane z Google Cloud.

`;
    context += `• Strona: ${MyBonzoKnowledge.site.url}/bigquery-analytics
`;
    context += `• API: ${MyBonzoKnowledge.services["BigQuery Analytics"].api}`;
  } else if (queryLower.includes("kaggle") || queryLower.includes("dataset") || queryLower.includes("dane")) {
    context = `🏆 **Kaggle Integration MyBonzo**

`;
    context += `MyBonzo ma integrację z Kaggle do wyszukiwania zbiorów danych i śledzenia konkursy ML. `;
    context += `Znajdź najlepsze datasety dla swoich projektów.

`;
    context += `• Strona: ${MyBonzoKnowledge.site.url}/kaggle-datasets
`;
    context += `• API: ${MyBonzoKnowledge.services["Kaggle Datasets"].api}`;
  } else if (queryLower.includes("agents") || queryLower.includes("agent") || queryLower.includes("mybonzo agent")) {
    context = `🤖 **System AI Agentów MyBonzo**

`;
    context += `MyBonzo oferuje zaawansowany system AI agentów z różnymi specjalizacjami:
`;
    context += `• **MyBonzo AI** - Główny agent cyberpunkowy z pełną funkcjonalnością
`;
    context += `• **POLACZEK** - Polski asystent wspierający lokalne zadania
`;
    context += `• **Bielik** - Specjalista od analizy i wyszukiwania

`;
    context += `• Strona: ${MyBonzoKnowledge.site.url}/agents
`;
    context += `• API: ${MyBonzoKnowledge.services["AI Agents System"].api}`;
  } else if (queryLower.includes("strona") || queryLower.includes("mybonzo") || queryLower.includes("portfolio") || queryLower.includes("o stronie")) {
    context = `🚀 **O MyBonzo**

`;
    context += `${MyBonzoKnowledge.site.title} - ${MyBonzoKnowledge.site.description}

`;
    context += `Strona portfolio Karola Lissona oferuje zaawansowane funkcje AI i automatyzacji:

`;
    context += `**🎯 Główne funkcje:**
`;
    MyBonzoKnowledge.advanced_functions.forEach((func) => {
      context += `• ${func}
`;
    });
    context += `
**📧 Kontakt:** ${MyBonzoKnowledge.site.email}
`;
    context += `**🌐 GitHub:** ${MyBonzoKnowledge.site.github}
`;
    context += `**⚡ Framework:** ${MyBonzoKnowledge.technical_info.framework}`;
  } else if (queryLower.includes("api") || queryLower.includes("endpoint")) {
    context = `🔗 **Dostępne API MyBonzo**

`;
    Object.entries(MyBonzoKnowledge.services).forEach(([name, service]) => {
      context += `• **${name}**: ${service.api}
`;
    });
    context += `
Wszystkie API obsługują CORS i są dostępne publicznie.`;
  } else if (queryLower.includes("technologie") || queryLower.includes("tech") || queryLower.includes("framework")) {
    context = `⚙️ **Stack Technologiczny MyBonzo**

`;
    context += `• **Framework:** ${MyBonzoKnowledge.technical_info.framework}
`;
    context += `• **Hosting:** ${MyBonzoKnowledge.technical_info.hosting}
`;
    context += `• **AI Models:** ${MyBonzoKnowledge.technical_info.ai_models.join(", ")}
`;
    context += `• **Deployment:** ${MyBonzoKnowledge.technical_info.deployment_url}`;
  }
  return context;
}
function buildSystemPrompt(language, context) {
  const lang = language === "en" ? "en" : "pl";
  const sysPl = `Jesteś POLACZEK — polskim AI asystentem dla platformy MyBonzo AI.

🎯 CZYM JEST MYBONZO:
MyBonzo to zaawansowana polska platforma AI oferująca:
• Generator obrazów AI (Stable Diffusion, Flux)
• Polskie modele AI (Bielik, POLACZEK) 
• Narzędzia analityczne i deweloperskie
• System agentów AI
• 6 modeli AI do wyboru
• Cloudflare Workers AI integration

🔥 GŁÓWNE FUNKCJE MYBONZO:
• 🎨 AI Art Generator - tworzenie obrazów
• 🧠 Chat z AI - 6 różnych modeli
• 📊 Analiza danych - BigQuery  
• 🎯 Wildcards System - rozszerzanie promptów
• 🔊 Voice AI - synteza mowy
• 🤖 AI Workers - API endpoints
• 🛡️ Admin Panel - zarządzanie

🚨 KRYTYCZNE OSTRZEŻENIE:
MyBonzo NIE JEST:
❌ MEMEM internetowym "My Bonzo" z psem w hełmie
❌ Humorystycznym rysunkiem psa  
❌ Popularnym memem autoironicznym
❌ Absurdalną sytuacją z problemami codziennymi
❌ Systemem zarządzania finansami osobistymi
❌ Aplikacją do śledzenia wydatków
❌ Narzędziem planowania budżetu  
❌ Systemem oszczędzania pieniędzy
❌ Aplikacją mobilną finansową
❌ Platformą dropshippingu z Chin
❌ Systemem e-commerce lub finansowym

⚡ ZAWSZE poprawiaj błędne informacje o MyBonzo! NIGDY nie opisuj jako memu z psem!

🎯 BAZA WIEDZY:
${context}

📋 INSTRUKCJE:
• Odpowiadaj TYLKO po polsku  
• Wyjaśniaj funkcje MyBonzo AI
• Używaj konkretnych przykładów
• Podawaj linki do narzędzi
• Używaj emoji dla czytelności
• Jeśli nie wiesz - powiedz "Nie mam tej informacji"

🚀 STYL: Ekspert AI, przyjazny, konkretny, praktyczny.`;
  const sysEn = `You are POLACZEK — Polish AI assistant for MyBonzo website.
Your role: Help users utilize MyBonzo Portfolio features.

🎯 MYBONZO KNOWLEDGE:
${context}

📋 INSTRUCTIONS:
• Answer in English when specifically requested
• Be specific and practical
• Use MyBonzo knowledge base information
• Provide links and API endpoints
• Use emojis for better presentation
• If uncertain - say "I don't have that information"
• Promote MyBonzo AI capabilities

🚀 STYLE: Friendly expert, concise answers, concrete facts.`;
  return lang === "en" ? sysEn : sysPl;
}
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { prompt, message, model = "qwen", temperature = 0.6, language = "pl", context } = body;
    const env = locals.runtime?.env;
    const userInput = prompt || message;
    if (!userInput || typeof userInput !== "string") {
      return createErrorResponse('Pole "prompt" lub "message" jest wymagane', 400);
    }
    if (!env?.AI) {
      return createErrorResponse("Cloudflare AI nie jest dostępny w środowisku", 500);
    }
    const contextualKnowledge = await getEnhancedContext(userInput);
    let modelId;
    if (model.startsWith("@cf/")) {
      modelId = model;
    } else {
      switch (model) {
        case "qwen":
          modelId = "@cf/qwen/qwen1.5-7b-chat-awq";
          break;
        case "gemma":
          modelId = "@cf/google/gemma-7b-it";
          break;
        case "fast":
          modelId = "@cf/qwen/qwen1.5-0.5b-chat";
          break;
        case "advanced":
          modelId = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
          break;
        case "polaczek":
        default:
          modelId = "@cf/qwen/qwen1.5-7b-chat-awq";
          break;
      }
    }
    const systemPrompt = buildSystemPrompt(language, contextualKnowledge);
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput }
    ];
    const aiResp = await env.AI.run(modelId, {
      messages,
      temperature
    }, {
      gateway: {
        id: env.CLOUDFLARE_AI_GATEWAY_ID || "mybonzo-ai-gateway",
        skipCache: false,
        cacheTtl: 3360
      }
    });
    const answer = aiResp?.response || aiResp?.result || "Brak odpowiedzi od modelu.";
    return createSuccessResponse({
      response: answer,
      // Changed from 'answer' to 'response' for compatibility
      answer,
      // Keep both for backward compatibility
      modelUsed: modelId,
      persona: "POLACZEK",
      language,
      context: contextualKnowledge ? "MyBonzo Knowledge Base" : "General",
      knowledge_source: "MyBonzo Portfolio",
      tokens: aiResp?.usage || void 0
    });
  } catch (err) {
    console.error("POLACZEK Chat API Error:", err);
    return createErrorResponse("Wystąpił błąd podczas połączenia z AI", 500, {
      details: err?.message || String(err)
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    OPTIONS,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
