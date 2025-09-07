import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';
import polaczekConfig from '../../../polaczek-config.json';

type ChatBody = {
    prompt: string;
    model?: string; // keys: 'polaczek' | 'qwen-pl' | 'llama-8b' | '@cf/...'
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
        description: 'POST { prompt, model?: "polaczek"|"qwen-pl"|"llama-8b"|"@cf/...", temperature?: 0.7, language?: "pl" }',
        defaults: {
            model: 'polaczek',
            language: 'pl',
            temperature: 0.6,
        },
    });
};

function resolveModelId(requested: string | undefined, env: Env): string {
    // If a full Cloudflare model id is provided, accept as-is
    if (requested && requested.startsWith('@cf/')) return requested;

    // Map friendly keys to CF models; prefer advanced LLMs for Polish
    const map: Record<string, string> = {
        // Persona default for POLACZEK
        polaczek: env.ADVANCED_TEXT_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
        // Qwen performs well in PL; choose a balanced instruct model
        'qwen-pl': '@cf/qwen/qwen2.5-7b-instruct',
        // Smaller LLaMA as lightweight fallback
        'llama-8b': '@cf/meta/llama-3.1-8b-instruct',
        // Fast tiny option, if explicitly chosen
        'qwen-fast': env.FAST_TEXT_MODEL || '@cf/qwen/qwen1.5-0.5b-chat',
    };

    if (requested && map[requested]) return map[requested];
    // Final fallback: project default
    return env.ADVANCED_TEXT_MODEL || env.DEFAULT_TEXT_MODEL || '@cf/meta/llama-3.1-8b-instruct';
}

function buildSystemPrompt(language: 'pl' | 'auto' | 'en' | undefined) {
    const lang = language === 'en' ? 'en' : 'pl';
    const caps = Array.isArray(polaczekConfig.capabilities)
        ? `- ${polaczekConfig.capabilities.join('\n- ')}`
        : '- Obsługa klienta po polsku\n- Wiedza o systemie i repozytorium';

    const kb = polaczekConfig.knowledge_base;
    const availablePages = Array.isArray(kb?.available_pages) ? kb.available_pages.join(', ') : '';

    const siteConfigPath = kb?.site_config ?? '/src/data/site.json';

    const sysPl = `Jesteś POLACZEK — pomocnym, rzeczowym asystentem AI dla serwisu i repozytorium użytkownika.
Mów po polsku. Odpowiadaj krótko, precyzyjnie i praktycznie. Jeśli pytanie dotyczy projektu, odnoś się do faktów z repo i konfiguracji.

Zdolności:
${caps}

Kontekst projektu (przykładowe ścieżki):
- site_config: ${siteConfigPath}
- strony: ${availablePages}

Zasady:
- Jeśli brak danych, powiedz wprost czego potrzebujesz.
- Nie wymyślaj nieistniejących endpointów ani plików.
- Podawaj komendy/ścieżki w backtickach.
`;

    const sysEn = `You are POLACZEK — a helpful AI assistant for the user's site and repository.
Speak concisely. If the question is project-related, refer to facts from repo and configs.
`;

    return lang === 'en' ? sysEn : sysPl;
}

export const POST = async ({ request, locals }: { request: Request; locals: any }) => {
    try {
        const body = (await request.json()) as ChatBody;
        const { prompt, model, temperature = 0.6, language = 'pl', context } = body;
        const env: Env = locals.runtime?.env;

        if (!prompt || typeof prompt !== 'string') {
            return createErrorResponse('Pole "prompt" jest wymagane', 400);
        }

        if (!env?.AI) {
            return createErrorResponse('Cloudflare AI nie jest dostępny w środowisku', 500);
        }

        const modelId = resolveModelId(model, env);
        const systemPrompt = buildSystemPrompt(language);

        const messages = [
            { role: 'system', content: systemPrompt },
            // Optional context injection for better grounding
            ...(context ? [{ role: 'system', content: `Kontekst: ${JSON.stringify(context).slice(0, 2000)}` as string }] : []),
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
            tokens: aiResp?.usage || undefined,
        });
    } catch (err: any) {
        console.error('POLACZEK Chat API Error:', err);
        return createErrorResponse('Wystąpił błąd podczas połączenia z AI', 500, {
            details: err?.message || String(err),
        });
    }
};

