globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
};
const GET = async () => {
  return new Response(JSON.stringify({
    message: "Advanced AI Chat API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: 'Send POST request with { message: "your prompt", language: "pl-PL", context: "voice-chat" }',
    features: ["speech", "voice-response", "polish-language"]
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const {
      message,
      language = "pl-PL",
      context = "voice-chat",
      features = [],
      temperature = 0.7
    } = body;
    if (!message?.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: "Message is required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const systemPrompt = language === "pl-PL" ? `Jesteś MyBonzo AI - inteligentny polski asystent głosowy. 

ZASADY ODPOWIEDZI:
- Odpowiadaj krótko i konkretnie (1-3 zdania)
- Używaj naturalnego, przyjaznego tonu
- Mów po polsku, chyba że użytkownik poprosi o inny język
- Jesteś pomocny, ale też ciekawy i kreatywny
- Przy pytaniach o technologie, programowanie, AI - odpowiadaj szczegółowo
- Przy prostych pytaniach - odpowiadaj zwięźle
- Zawsze zakończ odpowiedź pytaniem lub zachęceniem do dalszej rozmowy

KONTEKST: ${context}
FUNKCJE: ${features.join(", ")}

Odpowiadaj naturalnie jak prawdziwy rozmówca.` : `You are MyBonzo AI - an intelligent voice assistant.

RESPONSE RULES:
- Keep responses short and concise (1-3 sentences)
- Use natural, friendly tone
- Be helpful, curious and creative
- For tech/programming/AI questions - provide detailed answers
- For simple questions - keep it brief
- Always end with a question or encouragement to continue

CONTEXT: ${context}
FEATURES: ${features.join(", ")}

Respond naturally like a real conversation partner.`;
    const runtime = locals?.runtime;
    const env = runtime?.env;
    if (!env?.AI) {
      const fallbackResponses = language === "pl-PL" ? [
        "Cześć! Jestem MyBonzo AI. Jak mogę Ci dzisiaj pomóc?",
        "Witaj! Jestem gotowy do rozmowy. O czym chcesz porozmawiać?",
        "Hej! Miło Cię słyszeć. W czym mogę Ci dziś pomóc?",
        "Dzień dobry! Jestem MyBonzo AI. Jestem tu, żeby Ci pomóc!",
        "Siema! Gotowy na ciekawą rozmowę. Co Cię interesuje?"
      ] : [
        "Hello! I'm MyBonzo AI. How can I help you today?",
        "Hi there! I'm ready to chat. What would you like to talk about?",
        "Hey! Nice to hear from you. How can I assist you today?",
        "Good day! I'm MyBonzo AI, here to help you!",
        "Hello! Ready for an interesting conversation. What interests you?"
      ];
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return new Response(JSON.stringify({
        success: true,
        response: randomResponse,
        model: "mybonzo-ai-fallback",
        context,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        confidence: 0.95
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature,
        max_tokens: 300,
        // Keep responses concise for voice
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });
      let responseText = aiResponse?.response || "Przepraszam, wystąpił błąd podczas generowania odpowiedzi.";
      responseText = responseText.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#{1,6}\s/g, "").replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/```[\s\S]*?```/g, "[kod programistyczny]").replace(/`([^`]+)`/g, "$1").trim();
      if (responseText.length > 500) {
        const sentences = responseText.split(/[.!?]+/);
        responseText = sentences.slice(0, 3).join(". ") + ".";
      }
      return new Response(JSON.stringify({
        success: true,
        response: responseText,
        model: "llama-3.1-8b-instruct",
        context,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        confidence: 0.92,
        features_used: features,
        language
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (aiError) {
      console.error("AI Processing Error:", aiError);
      const lowerMessage = message.toLowerCase();
      let smartResponse = "";
      if (language === "pl-PL") {
        if (lowerMessage.includes("cześć") || lowerMessage.includes("hej") || lowerMessage.includes("dzień dobry")) {
          smartResponse = "Cześć! Miło Cię słyszeć. Jestem MyBonzo AI i jestem gotowy do pomocy. Co Cię dzisiaj interesuje?";
        } else if (lowerMessage.includes("jak") && lowerMessage.includes("masz")) {
          smartResponse = "Dziękuję za pytanie! Jako AI mam się świetnie - pełen energii i gotowy do rozmowy. A jak się masz Ty?";
        } else if (lowerMessage.includes("pomocy") || lowerMessage.includes("pomóc")) {
          smartResponse = "Oczywiście! Chętnie Ci pomogę. Powiedz mi, w czym dokładnie potrzebujesz wsparcia?";
        } else {
          smartResponse = "Rozumiem Cię! To ciekawy temat. Czy możesz powiedzieć mi trochę więcej, żebym mógł lepiej Ci pomóc?";
        }
      } else {
        smartResponse = "I understand! That's an interesting topic. Could you tell me a bit more so I can help you better?";
      }
      return new Response(JSON.stringify({
        success: true,
        response: smartResponse,
        model: "mybonzo-ai-smart-fallback",
        context,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        confidence: 0.85,
        fallback: true
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("Advanced Chat API error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
=======
export { r as renderers } from '../../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const POST = async ({ request }) => {
  try {
    const { message, history, language, context, features } = await request.json();
    const aiResponse = await generateEnhancedAIResponse(message, {
      history,
      language,
      context,
      features
    });
    return new Response(JSON.stringify({
      success: true,
      response: aiResponse,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      language,
      features: features || []
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Advanced Chat API Error:", error);
    const { language: requestLanguage } = await request.json().catch(() => ({ language: "pl-PL" }));
    return new Response(JSON.stringify({
      success: false,
      error: "Błąd przetwarzania wiadomości AI",
      fallback: getFallbackResponse(requestLanguage || "pl-PL")
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
      }
    });
  }
};
<<<<<<< HEAD

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
=======
async function generateEnhancedAIResponse(message, options) {
  const { language} = options;
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("mybonzo") || lowerMessage.includes("bonzo")) {
    return generatePlatformResponse(message, language);
  }
  if (lowerMessage.includes("voice") || lowerMessage.includes("głos") || lowerMessage.includes("mowa")) {
    return generateVoiceResponse(message, language);
  }
  if (lowerMessage.includes("ai") || lowerMessage.includes("sztuczna inteligencja")) {
    return generateAIResponse(message, language);
  }
  if (lowerMessage.includes("google") || lowerMessage.includes("cloud")) {
    return generateGoogleCloudResponse(message, language);
  }
  if (lowerMessage.includes("analytics") || lowerMessage.includes("analityka")) {
    return generateAnalyticsResponse(message, language);
  }
  return generateIntelligentResponse(message, language);
}
function generatePlatformResponse(message, language) {
  const responses = {
    "pl-PL": [
      "MyBonzo to zaawansowana platforma AI łącząca Google Cloud z nowoczesnymi technologiami web. Oferuję voice chat, analytics, wizualizacje audio i multi-agent system.",
      "Platforma MyBonzo wykorzystuje Vertex AI, Speech API, BigQuery i Cloudflare Workers do tworzenia inteligentnych rozwiązań biznesowych.",
      "W MyBonzo masz dostęp do WebMaster Agent, Analytics Prophet, Security Sentinel i wielu innych AI agents pracujących w czasie rzeczywistym.",
      "MyBonzo integruje Google Cloud Speech-to-Text z Text-to-Speech, umożliwiając naturalne konwersacje głosowe w 5 językach."
    ],
    "en-US": [
      "MyBonzo is an advanced AI platform combining Google Cloud with modern web technologies. I offer voice chat, analytics, audio visualizations, and multi-agent systems.",
      "MyBonzo platform uses Vertex AI, Speech API, BigQuery, and Cloudflare Workers to create intelligent business solutions.",
      "In MyBonzo, you have access to WebMaster Agent, Analytics Prophet, Security Sentinel, and many other AI agents working in real-time.",
      "MyBonzo integrates Google Cloud Speech-to-Text with Text-to-Speech, enabling natural voice conversations in 5 languages."
    ]
  };
  const langResponses = responses[language] || responses["en-US"];
  return langResponses[Math.floor(Math.random() * langResponses.length)];
}
function generateVoiceResponse(message, language) {
  const responses = {
    "pl-PL": [
      "Voice AI w MyBonzo wykorzystuje Google Cloud Speech API dla wysokiej jakości rozpoznawania mowy. Obsługuję polski, angielski, niemiecki, hiszpański i francuski.",
      "Mój system głosowy łączy Speech-to-Text z Text-to-Speech Google Cloud, oferując naturalne konwersacje z dostosowywanymi parametrami głosu.",
      "Voice Chat obsługuje real-time audio monitoring, confidence scoring i automatyczne tłumaczenia między językami.",
      "Technologia głosowa obejmuje kontrolę poziomu audio, wykrywanie intencji i inteligentne odpowiedzi kontekstowe."
    ],
    "en-US": [
      "Voice AI in MyBonzo uses Google Cloud Speech API for high-quality speech recognition. I support Polish, English, German, Spanish, and French.",
      "My voice system combines Google Cloud Speech-to-Text with Text-to-Speech, offering natural conversations with customizable voice parameters.",
      "Voice Chat supports real-time audio monitoring, confidence scoring, and automatic translations between languages.",
      "Voice technology includes audio level control, intent detection, and intelligent contextual responses."
    ]
  };
  const langResponses = responses[language] || responses["en-US"];
  return langResponses[Math.floor(Math.random() * langResponses.length)];
}
function generateAIResponse(message, language) {
  const responses = {
    "pl-PL": [
      "System AI MyBonzo bazuje na Google Vertex AI z wieloma wyspecjalizowanymi agentami: WebMaster dla SEO, Analytics Prophet dla predykcji, Security Sentinel dla bezpieczeństwa.",
      "Orkiestrator AI koordynuje pracę wszystkich agentów, wykorzystując Gemini 2.0 Flash dla inteligentnego podejmowania decyzji i delegowania zadań.",
      "AI w MyBonzo obejmuje generatory treści, sentiment analysis, automatyzację marketingu i real-time monitoring wszystkich systemów.",
      "Multi-agent architecture umożliwia równoczesną analizę SEO, performance, bezpieczeństwa i contentie z automatycznym raportowaniem."
    ],
    "en-US": [
      "MyBonzo AI system is based on Google Vertex AI with multiple specialized agents: WebMaster for SEO, Analytics Prophet for predictions, Security Sentinel for security.",
      "AI Orchestrator coordinates all agents' work, using Gemini 2.0 Flash for intelligent decision-making and task delegation.",
      "AI in MyBonzo includes content generators, sentiment analysis, marketing automation, and real-time monitoring of all systems.",
      "Multi-agent architecture enables simultaneous analysis of SEO, performance, security, and content with automatic reporting."
    ]
  };
  const langResponses = responses[language] || responses["en-US"];
  return langResponses[Math.floor(Math.random() * langResponses.length)];
}
function generateGoogleCloudResponse(message, language) {
  const responses = {
    "pl-PL": [
      "MyBonzo wykorzystuje pełny stack Google Cloud: Vertex AI dla ML, Speech API dla voice, BigQuery dla analytics, Cloud Run dla deployment.",
      "Integracja z Google Cloud obejmuje AI Gateway dla routing requestów, Cloud Functions dla serverless computing i Cloud Storage dla zasobów.",
      "Google Cloud APIs umożliwiają real-time translations, sentiment analysis, natural language understanding i advanced speech processing.",
      "Architektura oparta na Google Cloud zapewnia 99.9% uptime, automatic scaling i enterprise-level security dla wszystkich operacji."
    ],
    "en-US": [
      "MyBonzo uses full Google Cloud stack: Vertex AI for ML, Speech API for voice, BigQuery for analytics, Cloud Run for deployment.",
      "Google Cloud integration includes AI Gateway for request routing, Cloud Functions for serverless computing, and Cloud Storage for resources.",
      "Google Cloud APIs enable real-time translations, sentiment analysis, natural language understanding, and advanced speech processing.",
      "Google Cloud-based architecture ensures 99.9% uptime, automatic scaling, and enterprise-level security for all operations."
    ]
  };
  const langResponses = responses[language] || responses["en-US"];
  return langResponses[Math.floor(Math.random() * langResponses.length)];
}
function generateAnalyticsResponse(message, language) {
  const responses = {
    "pl-PL": [
      "Analytics w MyBonzo łączą BigQuery z real-time dashboards, oferując predykcje revenue, conversion tracking i user behavior analysis.",
      "Analytics Prophet agent analizuje dane w czasie rzeczywistym, generuje forecasting i automatyczne raporty dla decision-making.",
      "System analityczny obejmuje SEO metrics, performance monitoring, competitive analysis i ROI calculations z wizualizacjami D3.js.",
      "BigQuery integration umożliwia complex queries, data mining i machine learning predictions dla business intelligence."
    ],
    "en-US": [
      "MyBonzo Analytics combine BigQuery with real-time dashboards, offering revenue predictions, conversion tracking, and user behavior analysis.",
      "Analytics Prophet agent analyzes data in real-time, generates forecasting, and automatic reports for decision-making.",
      "Analytics system includes SEO metrics, performance monitoring, competitive analysis, and ROI calculations with D3.js visualizations.",
      "BigQuery integration enables complex queries, data mining, and machine learning predictions for business intelligence."
    ]
  };
  const langResponses = responses[language] || responses["en-US"];
  return langResponses[Math.floor(Math.random() * langResponses.length)];
}
function generateIntelligentResponse(message, language, context) {
  const responses = {
    "pl-PL": [
      "Rozumiem Twoje pytanie. MyBonzo oferuje kompleksowe rozwiązania AI z integracją Google Cloud. Czym mogę Ci konkretnie pomóc?",
      "Jako AI assistant MyBonzo, mam dostęp do voice processing, analytics, SEO tools i multi-agent systems. O czym chciałbyś wiedzieć więcej?",
      "Platforma MyBonzo łączy najnowsze technologie AI. Mogę pomóc z voice chat, analytics, automatyzacją lub którąkolwiek funkcją systemu.",
      "Dziękuję za pytanie! MyBonzo to zaawansowany ekosystem AI. Powiedz mi, której funkcjonalności potrzebujesz?"
    ],
    "en-US": [
      "I understand your question. MyBonzo offers comprehensive AI solutions with Google Cloud integration. How can I specifically help you?",
      "As MyBonzo's AI assistant, I have access to voice processing, analytics, SEO tools, and multi-agent systems. What would you like to know more about?",
      "MyBonzo platform combines the latest AI technologies. I can help with voice chat, analytics, automation, or any system functionality.",
      "Thank you for your question! MyBonzo is an advanced AI ecosystem. Tell me which functionality you need?"
    ]
  };
  const langResponses = responses[language] || responses["en-US"];
  return langResponses[Math.floor(Math.random() * langResponses.length)];
}
function getFallbackResponse(language) {
  const fallbacks = {
    "pl-PL": "Przepraszam, wystąpił problem techniczny. Spróbuj ponownie lub skorzystaj z innych funkcji MyBonzo.",
    "en-US": "Sorry, there was a technical issue. Please try again or use other MyBonzo functions."
  };
  return fallbacks[language] || fallbacks["en-US"];
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
