import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../utils/corsUtils.ts';

type ChatBody = {
    message?: string;
    prompt?: string;
    temperature?: number;
    context?: Record<string, any>;
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const GET = async () => {
    return createSuccessResponse({
        message: 'AI Helper 7 - Technical Support Assistant API is running',
        status: 'active',
        methods: ['GET', 'POST', 'OPTIONS'],
        description: 'POST { message || prompt, temperature? }',
        features: ['Technical Support', 'Debugging Help', 'Code Review'],
        model: 'Gemini 1.5 Pro via AI Gateway',
        specialization: 'Technical problem solving and support'
    });
};

export const POST = async ({ request }: { request: Request }) => {
    try {
        const body = (await request.json()) as ChatBody;
        const { message, prompt, temperature = 0.3 } = body;

        const userInput = message || prompt;
        if (!userInput || typeof userInput !== 'string') {
            return createErrorResponse('Pole "message" lub "prompt" jest wymagane', 400);
        }

        // AI Gateway URL zgodnie z INSTR_4
        const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/${process.env.CLOUDFLARE_AI_GATEWAY_ID}/google-ai-studio/v1/models/gemini-1.5-pro:generateContent`;

        const systemPrompt = `Jesteś AI Helper 7 - technicznym asystentem wsparcia specjalizującym się w:
• Rozwiązywaniu problemów technicznych
• Debugowaniu kodu i aplikacji
• Analizie błędów i logów
• Optymalizacji wydajności
• Code review i best practices
• Pomocy z frameworkami (Astro, React, Node.js, Python)

Odpowiadaj precyzyjnie, technicznie i konkretnie. Podawaj rozwiązania krok po kroku.`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUżytkownik: ${userInput}`
                }]
            }],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: 1200,
            }
        };

        const response = await fetch(gatewayUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GOOGLE_API_KEY || ''
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google AI Gateway error:', errorText);
            return createErrorResponse(`AI Gateway error: ${response.status}`, 500);
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Brak odpowiedzi';

        return createSuccessResponse({
            response: aiResponse,
            model: 'gemini-1.5-pro',
            service: 'Google AI Studio via AI Gateway',
            assistant: 'AI Helper 7 - Technical Support',
            temperature: temperature
        });

    } catch (error) {
        console.error('AI Helper 7 error:', error);
        return createErrorResponse('Błąd serwera', 500);
    }
};