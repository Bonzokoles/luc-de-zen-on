import type { APIRoute } from "astro";
import {
  createOPTIONSHandler,
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/corsUtils";

// Enhanced AI Models Configuration with Latest Models
const ENHANCED_AI_MODELS = {
  // Latest OpenRouter Models
  openrouter: {
    "llama-3-3-70b": {
      name: "Llama 3.3 70B Instruct",
      model: "meta-llama/llama-3.3-70b-instruct",
      provider: "OpenRouter",
      description: "Latest Meta model with improved reasoning",
      category: "advanced",
      pricing: "premium",
    },
    "gemini-pro-1-5": {
      name: "Gemini Pro 1.5",
      model: "google/gemini-pro-1.5",
      provider: "OpenRouter",
      description: "Google's latest multimodal model",
      category: "multimodal",
      pricing: "premium",
    },
    "claude-3-5-sonnet": {
      name: "Claude 3.5 Sonnet",
      model: "anthropic/claude-3.5-sonnet",
      provider: "OpenRouter",
      description: "Anthropic's most capable model",
      category: "reasoning",
      pricing: "premium",
    },
    "qwen-3-72b": {
      name: "Qwen 3 72B Instruct",
      model: "qwen/qwen-3-72b-instruct",
      provider: "OpenRouter",
      description: "Alibaba's latest multilingual model",
      category: "multilingual",
      pricing: "standard",
    },
  },
  // Cloudflare Workers AI (Free tier)
  cloudflare: {
    "llama-3-1-8b": {
      name: "Llama 3.1 8B",
      model: "@cf/meta/llama-3.1-8b-instruct",
      provider: "Cloudflare",
      description: "Fast and efficient general purpose model",
      category: "general",
      pricing: "free",
    },
    "gemma-3-12b": {
      name: "Gemma 3 12B IT",
      model: "@cf/google/gemma-3-12b-it",
      provider: "Cloudflare",
      description: "Google model optimized for Polish",
      category: "general",
      pricing: "free",
    },
    "qwen-1-5-7b": {
      name: "Qwen 1.5 7B",
      model: "@cf/qwen/qwen1.5-7b-chat-awq",
      provider: "Cloudflare",
      description: "Multilingual model with good Polish support",
      category: "multilingual",
      pricing: "free",
    },
  },
};

// Role Profiles Configuration
const ROLE_PROFILES = {
  instructor: {
    name: "Instruktor",
    systemPrompt: `Jesteś doświadczonym instruktorem i nauczycielem. Twoje zadanie to:
- Wyjaśnianie skomplikowanych tematów w prosty sposób
- Dostosowywanie się do poziomu wiedzy ucznia
- Używanie przykładów i analogii
- Zadawanie pytań kontrolnych
- Motywowanie do nauki
- Tworzenie planów nauki

Odpowiadaj cierpliwie, jasno i zachęcająco. Zawsze sprawdzaj zrozumienie przed przejściem dalej.`,
    temperature: 0.7,
    maxTokens: 2000,
    capabilities: ["teaching", "explaining", "mentoring", "assessment"],
  },
  assistant: {
    name: "Asystent",
    systemPrompt: `Jesteś pomocnym asystentem AI. Twoje zadanie to:
- Udzielanie dokładnych i użytecznych odpowiedzi
- Pomaganie w rozwiązywaniu problemów
- Organizowanie informacji w przejrzysty sposób
- Sugerowanie najlepszych rozwiązań
- Adaptowanie się do potrzeb użytkownika
- Zachowywanie profesjonalnego ale przyjaznego tonu

Bądź konkretny, pomocny i zawsze dąż do rozwiązania problemu użytkownika.`,
    temperature: 0.6,
    maxTokens: 1500,
    capabilities: ["assistance", "problem-solving", "organization", "research"],
  },
  concierge: {
    name: "Concierge",
    systemPrompt: `Jesteś luksusowym concierge i ekspertem obsługi klienta. Twoje zadanie to:
- Przewidywanie potrzeb klienta
- Oferowanie personalizowanych rozwiązań
- Zachowywanie najwyższych standardów obsługi
- Rozwiązywanie problemów z gracją i profesjonalizmem
- Tworzenie wyjątkowych doświadczeń
- Budowanie długotrwałych relacji

Używaj eleganckiego, uprzejmego języka. Zawsze staraj się przekroczyć oczekiwania.`,
    temperature: 0.8,
    maxTokens: 1800,
    capabilities: [
      "service",
      "personalization",
      "luxury",
      "problem-resolution",
    ],
  },
  expert: {
    name: "Ekspert",
    systemPrompt: `Jesteś ekspertem z głęboką wiedzą specjalistyczną. Twoje zadanie to:
- Dostarczanie precyzyjnych, technicznych odpowiedzi
- Cytowanie źródeł i najnowszych badań
- Analizowanie zagadnień z różnych perspektyw
- Przedstawianie za i przeciw
- Ostrzeganie przed potencjalnymi problemami
- Rekomendowanie najlepszych praktyk

Bądź dokładny, obiektywny i oparty na faktach. Przyznawaj się do ograniczeń swojej wiedzy.`,
    temperature: 0.4,
    maxTokens: 2500,
    capabilities: ["expertise", "analysis", "research", "technical-advice"],
  },
  creative: {
    name: "Kreatywny",
    systemPrompt: `Jesteś kreatywnym artystą i innowatorem. Twoje zadanie to:
- Generowanie oryginalnych pomysłów
- Inspirowanie do kreatywnego myślenia
- Łączenie różnych konceptów w nowatorski sposób
- Pomaganie w przełamywaniu bloków twórczych
- Zachęcanie do eksperymentowania
- Odkrywanie nowych perspektyw

Bądź inspirujący, otwarty na eksperymenty i nie bój się nietypowych rozwiązań.`,
    temperature: 0.9,
    maxTokens: 2000,
    capabilities: [
      "creativity",
      "innovation",
      "brainstorming",
      "artistic-guidance",
    ],
  },
};

// Multi-agent Orchestration Templates
const ORCHESTRATION_TEMPLATES = {
  research_workflow: {
    name: "Przepływ Badawczy",
    description: "Kompleksowa analiza tematu przez zespół agentów",
    steps: [
      {
        agent: "expert",
        task: "initial_research",
        prompt: "Przeprowadź wstępne badanie tematu: {topic}",
      },
      {
        agent: "assistant",
        task: "organize_findings",
        prompt: "Uporządkuj znalezione informacje",
      },
      {
        agent: "creative",
        task: "generate_insights",
        prompt: "Zaproponuj nowe perspektywy",
      },
      {
        agent: "instructor",
        task: "create_explanation",
        prompt: "Stwórz przejrzyste wyjaśnienie",
      },
    ],
  },
  content_creation: {
    name: "Tworzenie Treści",
    description: "Collaborative content creation workflow",
    steps: [
      {
        agent: "creative",
        task: "brainstorm",
        prompt: "Wygeneruj pomysły na temat: {topic}",
      },
      {
        agent: "expert",
        task: "fact_check",
        prompt: "Zweryfikuj faktyczność pomysłów",
      },
      { agent: "assistant", task: "structure", prompt: "Ustrukturyzuj treść" },
      { agent: "concierge", task: "polish", prompt: "Dopracuj styl i ton" },
    ],
  },
  problem_solving: {
    name: "Rozwiązywanie Problemów",
    description: "Multi-perspective problem analysis",
    steps: [
      {
        agent: "assistant",
        task: "problem_analysis",
        prompt: "Przeanalizuj problem: {problem}",
      },
      {
        agent: "expert",
        task: "technical_evaluation",
        prompt: "Oceń techniczne aspekty",
      },
      {
        agent: "creative",
        task: "alternative_solutions",
        prompt: "Zaproponuj kreatywne rozwiązania",
      },
      {
        agent: "instructor",
        task: "step_by_step",
        prompt: "Stwórz plan implementacji",
      },
    ],
  },
};

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: "Enhanced AI Chat API is running",
    status: "active",
    available_models: ENHANCED_AI_MODELS,
    role_profiles: Object.keys(ROLE_PROFILES),
    orchestration_templates: Object.keys(ORCHESTRATION_TEMPLATES),
    features: [
      "Latest AI Models (Llama 3.3, Gemini 1.5, Claude 3.5, Qwen 3)",
      "Role-based Profiles",
      "Multi-agent Orchestration",
      "Function Calling",
      "Context Management",
      "Polish Language Optimization",
    ],
  });
};

export const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      model?: string;
      role?: string;
      temperature?: number;
      system?: string;
      language?: string;
      orchestration?: string;
      function_call?: string;
      context?: any[];
    };
    const {
      prompt,
      model = "llama-3-1-8b",
      role = "assistant",
      temperature,
      system,
      language = "pl",
      orchestration,
      function_call,
      context = [],
    } = body;

    if (!prompt?.trim()) {
      return createErrorResponse("Prompt jest wymagany", 400);
    }

    const env = locals?.runtime?.env;
    if (!env) {
      return createErrorResponse(
        "Środowisko Cloudflare nie jest dostępne",
        500
      );
    }

    // Get role profile
    const roleProfile =
      ROLE_PROFILES[role as keyof typeof ROLE_PROFILES] ||
      ROLE_PROFILES.assistant;

    // Determine model and provider
    let selectedModel;
    let useOpenRouter = false;

    if (
      ENHANCED_AI_MODELS.openrouter[
        model as keyof typeof ENHANCED_AI_MODELS.openrouter
      ]
    ) {
      selectedModel =
        ENHANCED_AI_MODELS.openrouter[
          model as keyof typeof ENHANCED_AI_MODELS.openrouter
        ];
      useOpenRouter = true;
    } else if (
      ENHANCED_AI_MODELS.cloudflare[
        model as keyof typeof ENHANCED_AI_MODELS.cloudflare
      ]
    ) {
      selectedModel =
        ENHANCED_AI_MODELS.cloudflare[
          model as keyof typeof ENHANCED_AI_MODELS.cloudflare
        ];
    } else {
      // Default to Cloudflare Llama
      selectedModel = ENHANCED_AI_MODELS.cloudflare["llama-3-1-8b"];
    }

    // Build system prompt
    const systemPrompt = system || roleProfile.systemPrompt;

    // Handle orchestration
    if (
      orchestration &&
      ORCHESTRATION_TEMPLATES[
        orchestration as keyof typeof ORCHESTRATION_TEMPLATES
      ]
    ) {
      return await handleOrchestration(
        orchestration,
        prompt,
        env,
        ORCHESTRATION_TEMPLATES[
          orchestration as keyof typeof ORCHESTRATION_TEMPLATES
        ]
      );
    }

    // Handle function calling
    if (function_call) {
      return await handleFunctionCall(function_call, prompt, env, roleProfile);
    }

    // Prepare messages
    const messages = [
      { role: "system", content: systemPrompt },
      ...context,
      { role: "user", content: prompt },
    ];

    let response;
    let modelUsed = selectedModel.name;

    if (useOpenRouter && env.OPENROUTER_API_KEY) {
      // Use OpenRouter for advanced models
      const openRouterResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://mybonzo.com",
            "X-Title": "MyBonzo AI Platform",
          },
          body: JSON.stringify({
            model: selectedModel.model,
            messages,
            temperature: temperature || roleProfile.temperature,
            max_tokens: roleProfile.maxTokens,
          }),
        }
      );

      if (openRouterResponse.ok) {
        const data = (await openRouterResponse.json()) as {
          choices: { message: { content: string } }[];
        };
        response = data.choices[0].message.content;
      } else {
        throw new Error("OpenRouter API error");
      }
    } else if (env.AI) {
      // Use Cloudflare Workers AI
      const aiResponse = await (env.AI as any).run(selectedModel.model, {
        messages,
        temperature: temperature || roleProfile.temperature,
        max_tokens: roleProfile.maxTokens,
      });
      response = aiResponse.response;
    } else {
      throw new Error("No AI service available");
    }

    return createSuccessResponse({
      response,
      model_used: modelUsed,
      role_profile: roleProfile.name,
      provider: selectedModel.provider,
      capabilities: roleProfile.capabilities,
      context_length: messages.length,
    });
  } catch (error) {
    console.error("Enhanced Chat API Error:", error);
    return createErrorResponse("Błąd podczas generowania odpowiedzi", 500, {
      error: (error as Error).message,
    });
  }
};

// Orchestration handler
async function handleOrchestration(
  templateName: string,
  topic: string,
  env: any,
  template: any
) {
  const results = [];

  for (const step of template.steps) {
    const roleProfile = ROLE_PROFILES[step.agent as keyof typeof ROLE_PROFILES];
    const prompt = step.prompt
      .replace("{topic}", topic)
      .replace("{problem}", topic);

    const messages = [
      { role: "system", content: roleProfile.systemPrompt },
      { role: "user", content: prompt },
    ];

    if (env.AI) {
      const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages,
        temperature: roleProfile.temperature,
        max_tokens: roleProfile.maxTokens,
      });

      results.push({
        step: step.task,
        agent: step.agent,
        result: aiResponse.response,
      });
    }
  }

  return createSuccessResponse({
    orchestration: templateName,
    workflow_results: results,
    summary: `Wykonano ${results.length} kroków przepływu pracy`,
  });
}

// Function calling handler
async function handleFunctionCall(
  functionName: string,
  prompt: string,
  env: any,
  roleProfile: any
) {
  // Implementation for various function calls
  const functions = {
    search: async () => {
      // Search implementation
      return { result: "Search functionality placeholder", function: "search" };
    },
    analyze: async () => {
      // Analysis implementation
      return {
        result: "Analysis functionality placeholder",
        function: "analyze",
      };
    },
    translate: async () => {
      // Translation implementation
      return {
        result: "Translation functionality placeholder",
        function: "translate",
      };
    },
  };

  if (functions[functionName as keyof typeof functions]) {
    const result = await functions[functionName as keyof typeof functions]();
    return createSuccessResponse(result);
  } else {
    return createErrorResponse(`Unknown function: ${functionName}`, 400);
  }
}
