if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../../chunks/corsUtils_DfX9K_yD.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

function findRelevantDocs(query) {
  const docs = [
    {
      title: "POLACZEK Agent System 23",
      description: "Advanced AI agent management platform with creation, monitoring, and control capabilities",
      keywords: ["agents", "ai", "management", "polaczek", "system"],
      relevance: 95
    },
    {
      title: "Agent Dashboard",
      description: "Real-time monitoring and control interface for AI agents",
      keywords: ["dashboard", "monitoring", "control", "real-time"],
      relevance: 85
    },
    {
      title: "Agent Creator",
      description: "Wizard for creating custom AI agents with specialized capabilities",
      keywords: ["create", "generator", "wizard", "custom"],
      relevance: 80
    },
    {
      title: "Multi-language Agent Support",
      description: "Support for Python and JavaScript/TypeScript agent development",
      keywords: ["python", "javascript", "typescript", "multi-language"],
      relevance: 75
    },
    {
      title: "WebSocket Communication",
      description: "Real-time bidirectional communication between agents and clients",
      keywords: ["websocket", "real-time", "communication", "bidirectional"],
      relevance: 70
    }
  ];
  const queryLower = query.toLowerCase();
  return docs.filter(
    (doc) => doc.keywords.some((keyword) => queryLower.includes(keyword)) || doc.description.toLowerCase().includes(queryLower) || doc.title.toLowerCase().includes(queryLower)
  ).sort((a, b) => b.relevance - a.relevance);
}
const OPTIONS = createOPTIONSHandler(["GET", "POST"]);
const GET = async () => {
  return createSuccessResponse({
    message: "POLACZEK AGENT SYS 2.3 - Full SDK API",
    status: "active",
    version: "2.3.0",
    methods: ["GET", "POST", "OPTIONS"],
    description: "Advanced Polish AI Agent System with comprehensive SDK functions",
    features: [
      "MyBonzo Knowledge Base Integration",
      "Advanced Polish AI Assistant",
      "Multi-Model AI Support",
      "Agent Creation & Management",
      "SDK Functions (search, analyze, generate, recommend)",
      "Session Management with Memory",
      "Real-time Translation Services",
      "Dynamic Content Generation",
      "Advanced Data Analysis",
      "Personalized Recommendations Engine",
      "Custom Agent Builder"
    ],
    sdk_functions: {
      "chat": "Standard conversational AI (default mode)",
      "search": "Advanced search through MyBonzo knowledge base and documentation",
      "analyze": "Deep analysis of text, data, or user input with AI insights",
      "generate": "Generate content, reports, or creative materials",
      "recommend": "Provide personalized recommendations based on user data",
      "translate": "Translate between languages with context awareness",
      "summarize": "Summarize long content with key points extraction",
      "agent_create": "Create custom AI agents with specific capabilities",
      "agent_manage": "Manage, update, or configure existing agents"
    },
    models: {
      "qwen": "@cf/qwen/qwen1.5-7b-chat-awq (default, optimized for Polish)",
      "gemma": "@cf/google/gemma-7b-it (multilingual support)",
      "fast": "@cf/qwen/qwen1.5-0.5b-chat (fast responses)",
      "advanced": "@cf/meta/llama-3.3-70b-instruct-fp8-fast (most capable)",
      "claude": "@cf/anthropic/claude-3-haiku (creative tasks)"
    },
    defaults: {
      model: "qwen",
      language: "pl",
      temperature: 0.6,
      function: "chat",
      memory: false,
      session_timeout: "1h"
    },
    usage_examples: {
      "basic_chat": '{ "prompt": "Cześć! Co potrafisz?", "model": "qwen" }',
      "search_function": '{ "prompt": "Znajdź informacje o AI", "function": "search" }',
      "analyze_function": '{ "prompt": "Przeanalizuj ten tekst", "function": "analyze", "data": "..." }',
      "agent_creation": '{ "prompt": "Stwórz agenta do obsługi klienta", "function": "agent_create", "agent_config": {...} }',
      "with_memory": '{ "prompt": "Kontynuujmy rozmowę", "session_id": "123", "memory": true }'
    },
    endpoints: {
      "GET /": "API documentation and status",
      "POST /": "Main chat and SDK functions endpoint",
      "POST /agent/create": "Create new AI agent",
      "GET /agent/list": "List user agents",
      "POST /agent/config": "Configure agent settings"
    }
  });
};
const MODELS = {
  "qwen": "@cf/qwen/qwen1.5-7b-chat-awq",
  "gemma": "@cf/google/gemma-7b-it",
  "fast": "@cf/qwen/qwen1.5-0.5b-chat",
  "advanced": "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "claude": "@cf/anthropic/claude-3-haiku"
};
function getContextualResponse(prompt) {
  const relevantDocs = findRelevantDocs(prompt);
  let context = "";
  if (relevantDocs && relevantDocs.length > 0) {
    context = relevantDocs.map((doc) => `${doc.title}: ${doc.description}`).join("\n");
  }
  context += `

POLACZEK Agent System 2.3 Features:
- Advanced AI agent creation and management
- Multi-modal content generation
- Polish language optimization
- MyBonzo knowledge integration
- Real-time analytics and monitoring
- Custom personality and expertise configuration`;
  return context;
}
async function executeSDKFunction(functionName, prompt, data, env, agent_config) {
  switch (functionName) {
    case "search":
      return await searchFunction(prompt, data, env);
    case "analyze":
      return await analyzeFunction(prompt, data, env);
    case "generate":
      return await generateFunction(prompt, data, env);
    case "recommend":
      return await recommendFunction(prompt, data, env);
    case "translate":
      return await translateFunction(prompt, data, env);
    case "summarize":
      return await summarizeFunction(prompt, data, env);
    case "agent_create":
      return await agentCreateFunction(prompt, data, env, agent_config);
    case "agent_manage":
      return await agentManageFunction(prompt, data, env, agent_config);
    default:
      return { result: prompt };
  }
}
async function searchFunction(prompt, data, env) {
  const searchResults = findRelevantDocs(prompt);
  let result = `🔍 **Wyniki wyszukiwania POLACZEK Agent System:**

`;
  if (searchResults && searchResults.length > 0) {
    searchResults.slice(0, 5).forEach((doc, index) => {
      result += `${index + 1}. **${doc.title}**
${doc.description}
`;
      if (doc.keywords) {
        result += `Słowa kluczowe: ${doc.keywords.join(", ")}
`;
      }
      if (doc.relevance) {
        result += `Relevance: ${doc.relevance}%
`;
      }
      result += "\n";
    });
    const enhancedPrompt = `Na podstawie wyników wyszukiwania, podaj dodatkowe sugestie i insights związane z zapytaniem: "${prompt}"`;
    const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
      messages: [{ role: "user", content: enhancedPrompt }],
      temperature: 0.4
    });
    result += `
💡 **AI Insights:**
${aiResp.response || aiResp.result}`;
  } else {
    result += "Nie znaleziono dokumentów pasujących do zapytania. Spróbuj użyć innych słów kluczowych.";
  }
  return { result, processed_data: { results_count: searchResults?.length || 0, search_terms: prompt } };
}
async function analyzeFunction(prompt, data, env) {
  const analysisPrompt = `Jako ekspert POLACZEK Agent System, przeanalizuj dokładnie następujące dane/tekst i podaj komprehensywną analizę po polsku:

Analiza powinna zawierać:
1. Główne tematy i koncepcje
2. Potencjalne problemy i rozwiązania
3. Rekomendacje działań
4. Ocena jakości/ważności
5. Sugestie dalszych kroków

Dane do analizy:
${data || prompt}`;
  const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
    messages: [{ role: "user", content: analysisPrompt }],
    temperature: 0.3
  });
  return {
    result: `📊 **Analiza POLACZEK Agent System:**

${aiResp.response || aiResp.result}`,
    processed_data: {
      analysis_type: "comprehensive_analysis",
      input_length: (data || prompt).length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
async function generateFunction(prompt, data, env) {
  const generatePrompt = `Jako kreator treści POLACZEK Agent System, wygeneruj wysokiej jakości treść według następujących wytycznych po polsku:

${prompt}

${data ? `
Dodatkowe dane kontekstowe: ${JSON.stringify(data)}` : ""}

Wygenerowana treść powinna być:
- Profesjonalna i angażująca
- Zoptymalizowana pod kątem celu
- Zawierać konkretne przykłady
- Być gotowa do użycia`;
  const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
    messages: [{ role: "user", content: generatePrompt }],
    temperature: 0.7
  });
  return {
    result: `✨ **Wygenerowana treść - POLACZEK Agent System:**

${aiResp.response || aiResp.result}`,
    processed_data: {
      generation_type: "advanced_content",
      temperature: 0.7,
      word_count: (aiResp.response || aiResp.result).split(" ").length
    }
  };
}
async function recommendFunction(prompt, data, env) {
  const context = getContextualResponse(prompt);
  const recommendPrompt = `Jako system rekomendacyjny POLACZEK Agent System, na podstawie kontekstu MyBonzo i danych użytkownika, podaj 5-7 spersonalizowanych rekomendacji po polsku:

Kontekst systemu: ${context}
Zapytanie użytkownika: ${prompt}
${data ? `Dodatkowe dane użytkownika: ${JSON.stringify(data)}` : ""}

Rekomendacje powinny być:
- Konkretne i wykonalne
- Dostosowane do potrzeb użytkownika
- Oparte na najlepszych praktykach
- Z wyjaśnieniem dlaczego są ważne`;
  const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
    messages: [{ role: "user", content: recommendPrompt }],
    temperature: 0.5
  });
  const recommendations = (aiResp.response || aiResp.result).split("\n").filter((line) => line.trim().match(/^[\d•\-\*].+/)).slice(0, 7);
  return {
    result: `🎯 **Personalne rekomendacje - POLACZEK Agent System:**

${aiResp.response || aiResp.result}`,
    recommendations,
    processed_data: {
      recommendation_count: recommendations.length,
      personalization_level: "high"
    }
  };
}
async function translateFunction(prompt, data, env) {
  const translatePrompt = `Jako system tłumaczeń POLACZEK Agent System, przetłumacz następujący tekst zachowując kontekst i znaczenie:

${data || prompt}

Instrukcje tłumaczenia:
- Zachowaj ton i styl oryginału
- Uwzględnij kontekst branżowy/techniczny
- Podaj alternatywne tłumaczenia dla kluczowych terminów
- Jeśli nie wskazano języka docelowego, przetłumacz na angielski`;
  const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
    messages: [{ role: "user", content: translatePrompt }],
    temperature: 0.2
  });
  return {
    result: `🌍 **Tłumaczenie - POLACZEK Agent System:**

${aiResp.response || aiResp.result}`,
    processed_data: {
      translation_service: "ai_powered_contextual",
      source_length: (data || prompt).length
    }
  };
}
async function summarizeFunction(prompt, data, env) {
  const summarizePrompt = `Jako system streszczający POLACZEK Agent System, stwórz komprehensywne streszczenie następującej treści po polsku:

${data || prompt}

Streszczenie powinno zawierać:
1. Główne punkty (3-5 najważniejszych)
2. Kluczowe wnioski
3. Potencjalne implikacje
4. Rekomendowane działania (jeśli dotyczy)

Format: punktowy z krótkimi wyjaśnieniami`;
  const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
    messages: [{ role: "user", content: summarizePrompt }],
    temperature: 0.3
  });
  return {
    result: `📝 **Streszczenie - POLACZEK Agent System:**

${aiResp.response || aiResp.result}`,
    processed_data: {
      summary_type: "comprehensive_structured",
      compression_ratio: Math.round((data || prompt).length / (aiResp.response || aiResp.result).length * 100) / 100
    }
  };
}
async function agentCreateFunction(prompt, data, env, agent_config) {
  const createPrompt = `Jako kreator agentów POLACZEK Agent System, stwórz konfigurację nowego agenta AI na podstawie:

Zapytanie: ${prompt}
${agent_config ? `Konfiguracja: ${JSON.stringify(agent_config)}` : ""}
${data ? `Dodatkowe dane: ${JSON.stringify(data)}` : ""}

Wygeneruj kompletną konfigurację agenta zawierającą:
1. Nazwa agenta
2. Główny cel i zadania
3. Personality prompt
4. Specjalizacje i ekspertyzy
5. Przykładowe interakcje
6. Zalecane parametry modelu
7. Integracje z systemem`;
  const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
    messages: [{ role: "user", content: createPrompt }],
    temperature: 0.6
  });
  const agent_info = {
    agent_id: `agent_${Date.now()}`,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    status: "configured",
    creator: "polaczek_system"
  };
  return {
    result: `🤖 **Nowy Agent Stworzony - POLACZEK Agent System:**

${aiResp.response || aiResp.result}`,
    agent_info,
    processed_data: {
      creation_type: "custom_agent",
      agent_id: agent_info.agent_id
    }
  };
}
async function agentManageFunction(prompt, data, env, agent_config) {
  const managePrompt = `Jako menedżer agentów POLACZEK Agent System, wykonaj zarządzanie agentem:

Polecenie: ${prompt}
${agent_config ? `Aktualny agent: ${JSON.stringify(agent_config)}` : ""}
${data ? `Parametry: ${JSON.stringify(data)}` : ""}

Dostępne operacje:
- Lista aktywnych agentów
- Modyfikacja konfiguracji
- Monitoring wydajności
- Aktualizacja parametrów
- Analiza interakcji`;
  const aiResp = await env.AI.run("@cf/qwen/qwen1.5-7b-chat-awq", {
    messages: [{ role: "user", content: managePrompt }],
    temperature: 0.4
  });
  return {
    result: `⚙️ **Zarządzanie Agentami - POLACZEK Agent System:**

${aiResp.response || aiResp.result}`,
    processed_data: {
      management_type: "agent_configuration",
      operation_timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
function buildSystemPrompt(language, context, agent_config) {
  const basePrompt = language === "en" ? "You are POLACZEK Agent System 2.3, an advanced AI assistant specialized in Polish business applications." : "Jesteś POLACZEK Agent System 2.3, zaawansowany asystent AI specjalizujący się w polskich zastosowaniach biznesowych.";
  let systemPrompt = `${basePrompt}

${language === "en" ? "Key capabilities:" : "Główne możliwości:"}
- ${language === "en" ? "Advanced search and analysis" : "Zaawansowane wyszukiwanie i analiza"}
- ${language === "en" ? "Content generation and recommendations" : "Generowanie treści i rekomendacje"}
- ${language === "en" ? "AI agent creation and management" : "Tworzenie i zarządzanie agentami AI"}
- ${language === "en" ? "MyBonzo knowledge base integration" : "Integracja z bazą wiedzy MyBonzo"}

${language === "en" ? "Communication style: Professional, helpful, and precise. Always provide actionable insights." : "Styl komunikacji: Profesjonalny, pomocny i precyzyjny. Zawsze podawaj praktyczne wskazówki."}

${context ? `${language === "en" ? "Available context:" : "Dostępny kontekst:"} ${context}` : ""}

${agent_config ? `${language === "en" ? "Agent configuration:" : "Konfiguracja agenta:"} ${JSON.stringify(agent_config)}` : ""}`;
  return systemPrompt;
}
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const {
      prompt,
      model = "qwen",
      temperature = 0.6,
      language = "pl",
      context,
      function: sdkFunction = "chat",
      data,
      session_id,
      user_preferences,
      memory = false,
      agent_config
    } = body;
    if (!prompt || prompt.trim().length === 0) {
      return createErrorResponse("Prompt jest wymagany", 400);
    }
    const env = locals.runtime.env;
    if (!env?.AI) {
      return createErrorResponse("AI service niedostępny", 503);
    }
    const modelId = MODELS[model] || MODELS.qwen;
    const contextualKnowledge = getContextualResponse(prompt);
    let sdkResult = null;
    let finalAnswer;
    if (sdkFunction && sdkFunction !== "chat") {
      sdkResult = await executeSDKFunction(sdkFunction, prompt, data, env, agent_config);
      finalAnswer = sdkResult.result;
    } else {
      const systemPrompt = buildSystemPrompt(language, contextualKnowledge, agent_config);
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ];
      const aiResp = await env.AI.run(modelId, {
        messages,
        temperature
      });
      finalAnswer = aiResp?.response || aiResp?.result || "Brak odpowiedzi od modelu.";
    }
    const response = {
      answer: finalAnswer,
      function_used: sdkFunction,
      data_processed: sdkResult?.processed_data,
      recommendations: sdkResult?.recommendations,
      session_id: session_id || `polaczek_${Date.now()}`,
      modelUsed: modelId,
      persona: "POLACZEK Agent System 2.3",
      language,
      context: contextualKnowledge ? "MyBonzo Knowledge Base + Agent System" : "General + Agent System",
      knowledge_source: "MyBonzo Portfolio + POLACZEK Agents",
      sdk_version: "2.3.0",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      agent_info: sdkResult?.agent_info
    };
    return createSuccessResponse(response);
  } catch (error) {
    console.error("POLACZEK Agent System error:", error);
    return createErrorResponse("Błąd wewnętrzny serwera", 500);
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
