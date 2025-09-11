import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../utils/corsUtils.ts';
import { PolaczekKnowledgeBase } from '../../utils/polaczekKnowledge.js';
import { findRelevantDocs } from '../../utils/documentationIndex.js';

type ChatBody = {
    prompt: string;
    model?: string;
    temperature?: number;
    language?: 'pl' | 'auto' | 'en';
    context?: Record<string, any>;
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const GET = async () => {
    return createSuccessResponse({
        message: 'POLACZEK Chat API is running',
        status: 'active',
        methods: ['GET', 'POST', 'OPTIONS'],
        description: 'POST { prompt, model?, temperature?, language?: "pl" }',
        features: ['MyBonzo Knowledge Base', 'Polish AI Assistant', 'Contextual Responses'],
        defaults: {
            model: 'polaczek',
            language: 'pl',
            temperature: 0.6,
        },
    });
};

// MyBonzo Knowledge Base
const MyBonzoKnowledge = {
    site: {
        title: "MyBonzo – Portfolio Karol Lisson",
        description: "Nowoczesne portfolio, design i AI. SYSTEM AGENTS.",
        url: "https://luc-de-zen-on.pages.dev",
        owner: "Karol Lisson",
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
        github_repo: "https://github.com/Bonzokoles/luc-de-zen-on",
        ai_models: [
            "@cf/meta/llama-3.1-8b-instruct",
            "@cf/google/gemma-7b-it",
            "@cf/qwen/qwen1.5-7b-chat-awq",
            "@cf/deepseek-ai/deepseek-math-7b-instruct"
        ]
    }
};

// Enhanced knowledge retrieval with documentation integration (static for Cloudflare Workers)
async function getEnhancedContext(prompt: string) {
    let context = getContextualResponse(prompt);

    // Static documentation integration for Cloudflare Workers
    try {
        const relevantDocs = findRelevantDocs(prompt);

        if (relevantDocs && relevantDocs.length > 0) {
            context += '\n\n📖 **Dokumentacja:**\n';
            // Add static information about available documentation
            relevantDocs.slice(0, 2).forEach(doc => {
                context += `\n**${doc.title}**:\n${doc.description}\n`;
                if (doc.keywords) {
                    context += `Słowa kluczowe: ${doc.keywords.join(', ')}\n`;
                }
            });
        }
    } catch (error) {
        console.error('Error reading documentation index:', error);
    }

    return context;
} function getContextualResponse(userQuery: string): string {
    const queryLower = userQuery.toLowerCase();
    let context = '';

    // Check if query is about specific services
    if (queryLower.includes('obraz') || queryLower.includes('generuj') || queryLower.includes('zdjęcie') || queryLower.includes('image')) {
        context = `🎨 **Generator obrazów AI MyBonzo**\n\n`;
        context += `MyBonzo oferuje zaawansowany generator obrazów AI używający modelu Flux-1 Schnell. `;
        context += `Możesz generować obrazy z tekstu w różnych stylach i rozmiarach (512-1024px).\n\n`;
        context += `• Strona: ${MyBonzoKnowledge.site.url}/image-generator\n`;
        context += `• API: ${MyBonzoKnowledge.services["AI Image Generator"].api}\n`;
        context += `• Funkcje: ${MyBonzoKnowledge.services["AI Image Generator"].features.join(', ')}`;
    }

    else if (queryLower.includes('bigquery') || queryLower.includes('analiza') || queryLower.includes('dane') || queryLower.includes('sql')) {
        context = `📊 **BigQuery Analytics MyBonzo**\n\n`;
        context += `MyBonzo oferuje zaawansowaną analizę danych przez BigQuery Analytics. `;
        context += `Możesz wykonywać zapytania SQL i analizować dane z Google Cloud.\n\n`;
        context += `• Strona: ${MyBonzoKnowledge.site.url}/bigquery-analytics\n`;
        context += `• API: ${MyBonzoKnowledge.services["BigQuery Analytics"].api}`;
    }

    else if (queryLower.includes('kaggle') || queryLower.includes('dataset') || queryLower.includes('dane')) {
        context = `🏆 **Kaggle Integration MyBonzo**\n\n`;
        context += `MyBonzo ma integrację z Kaggle do wyszukiwania zbiorów danych i śledzenia konkursy ML. `;
        context += `Znajdź najlepsze datasety dla swoich projektów.\n\n`;
        context += `• Strona: ${MyBonzoKnowledge.site.url}/kaggle-datasets\n`;
        context += `• API: ${MyBonzoKnowledge.services["Kaggle Datasets"].api}`;
    }

    else if (queryLower.includes('agents') || queryLower.includes('agent') || queryLower.includes('mybonzo agent')) {
        context = `🤖 **System AI Agentów MyBonzo**\n\n`;
        context += `MyBonzo oferuje zaawansowany system AI agentów z różnymi specjalizacjami:\n`;
        context += `• **MyBonzo AI** - Główny agent cyberpunkowy z pełną funkcjonalnością\n`;
        context += `• **POLACZEK** - Polski asystent wspierający lokalne zadania\n`;
        context += `• **Bielik** - Specjalista od analizy i wyszukiwania\n\n`;
        context += `• Strona: ${MyBonzoKnowledge.site.url}/agents\n`;
        context += `• API: ${MyBonzoKnowledge.services["AI Agents System"].api}`;
    }

    else if (queryLower.includes('strona') || queryLower.includes('mybonzo') || queryLower.includes('portfolio') || queryLower.includes('o stronie')) {
        context = `🚀 **O MyBonzo**\n\n`;
        context += `${MyBonzoKnowledge.site.title} - ${MyBonzoKnowledge.site.description}\n\n`;
        context += `Strona portfolio Karola Lissona oferuje zaawansowane funkcje AI i automatyzacji:\n\n`;
        context += `**🎯 Główne funkcje:**\n`;
        MyBonzoKnowledge.advanced_functions.forEach(func => {
            context += `• ${func}\n`;
        });
        context += `\n**📧 Kontakt:** ${MyBonzoKnowledge.site.email}\n`;
        context += `**🌐 GitHub:** ${MyBonzoKnowledge.site.github}\n`;
        context += `**⚡ Framework:** ${MyBonzoKnowledge.technical_info.framework}`;
    }

    else if (queryLower.includes('api') || queryLower.includes('endpoint')) {
        context = `🔗 **Dostępne API MyBonzo**\n\n`;
        Object.entries(MyBonzoKnowledge.services).forEach(([name, service]) => {
            context += `• **${name}**: ${service.api}\n`;
        });
        context += `\nWszystkie API obsługują CORS i są dostępne publicznie.`;
    }

    else if (queryLower.includes('technologie') || queryLower.includes('tech') || queryLower.includes('framework')) {
        context = `⚙️ **Stack Technologiczny MyBonzo**\n\n`;
        context += `• **Framework:** ${MyBonzoKnowledge.technical_info.framework}\n`;
        context += `• **Hosting:** ${MyBonzoKnowledge.technical_info.hosting}\n`;
        context += `• **AI Models:** ${MyBonzoKnowledge.technical_info.ai_models.join(', ')}\n`;
        context += `• **Deployment:** ${MyBonzoKnowledge.technical_info.deployment_url}`;
    }

    return context;
}

function buildSystemPrompt(language: 'pl' | 'auto' | 'en' | undefined, context: string) {
    const lang = language === 'en' ? 'en' : 'pl';

    const sysPl = `Jesteś POLACZEK — przyjaznym, kompetentnym asystentem AI dla strony MyBonzo.
Pomagasz użytkownikom w nawigacji i korzystaniu z funkcji strony.

WIEDZA O MYBONZO:
${context}

ZASADY:
• Mów po polsku, jeśli nie poproszono inaczej
• Odpowiadaj krótko, precyzyjnie i praktycznie
• Używaj informacji z bazy wiedzy MyBonzo
• Podawaj konkretne linki i endpointy
• Jeśli nie znasz odpowiedzi, powiedz wprost
• Używaj emoji do uatrakcyjnienia odpowiedzi
• Podkreślaj mocne strony MyBonzo AI platform
`;

    const sysEn = `You are POLACZEK — a friendly, competent AI assistant for MyBonzo website.
You help users navigate and use the site's features.

MYBONZO KNOWLEDGE:
${context}

RULES:
• Speak English when requested
• Answer concisely and practically  
• Use MyBonzo knowledge base information
• Provide specific links and endpoints
• If you don't know something, say so directly
• Use emojis to make responses engaging
• Highlight MyBonzo AI platform strengths
`;

    return lang === 'en' ? sysEn : sysPl;
}

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
    try {
        const body = (await request.json()) as ChatBody;
        const { prompt, model = 'polaczek', temperature = 0.6, language = 'pl', context } = body;
        const env: any = locals.runtime?.env;

        if (!prompt || typeof prompt !== 'string') {
            return createErrorResponse('Pole "prompt" jest wymagane', 400);
        }

        if (!env?.AI) {
            return createErrorResponse('Cloudflare AI nie jest dostępny w środowisku', 500);
        }

        // Get enhanced contextual knowledge about MyBonzo based on user query (with documentation)
        const contextualKnowledge = await getEnhancedContext(prompt);

        // Choose appropriate model
        const modelId = model.startsWith('@cf/') ? model : '@cf/meta/llama-3.1-8b-instruct';

        const systemPrompt = buildSystemPrompt(language, contextualKnowledge);

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
        ];

        const aiResp: any = await env.AI.run(modelId as any, {
            messages,
            temperature,
        });

        const answer: string = aiResp?.response || aiResp?.result || 'Brak odpowiedzi od modelu.';

        return createSuccessResponse({
            answer,
            modelUsed: modelId,
            persona: 'POLACZEK',
            language: language,
            context: contextualKnowledge ? 'MyBonzo Knowledge Base' : 'General',
            knowledge_source: 'MyBonzo Portfolio',
            tokens: aiResp?.usage || undefined,
        });
    } catch (err: any) {
        console.error('POLACZEK Chat API Error:', err);
        return createErrorResponse('Wystąpił błąd podczas połączenia z AI', 500, {
            details: err?.message || String(err),
        });
    }
};
