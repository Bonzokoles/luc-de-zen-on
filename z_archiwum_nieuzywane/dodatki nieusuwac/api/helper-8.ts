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
        message: 'AI Helper 8 - Business & Marketing Assistant API is running',
        status: 'active',
        methods: ['GET', 'POST', 'OPTIONS'],
        description: 'POST { message || prompt, temperature? }',
        features: ['Business Strategy', 'Marketing Content', 'SEO Optimization'],
        model: 'Gemini 1.5 Flash via AI Gateway',
        specialization: 'Business development and marketing'
    });
};

export const POST = async ({ request }: { request: Request }) => {
    try {
        const body = (await request.json()) as ChatBody;
        const { message, prompt, temperature = 0.7 } = body;

        const userInput = message || prompt;
        if (!userInput || typeof userInput !== 'string') {
            return createErrorResponse('Pole "message" lub "prompt" jest wymagane', 400);
        }

        // AI Gateway URL zgodnie z INSTR_4
        const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/${process.env.CLOUDFLARE_AI_GATEWAY_ID}/google-ai-studio/v1/models/gemini-1.5-flash:generateContent`;

        const systemPrompt = `Jesteś AI Helper 8 - asystentem biznesowym i marketingowym specjalizującym się w:
• Strategii biznesowej i rozwoju
• Tworzeniu treści marketingowych
• Optymalizacji SEO i copywritingu
• Analizie konkurencji i rynku
• Social media marketing
• E-commerce i sprzedaży online

Odpowiadaj profesjonalnie, strategicznie i zorientowanie na wyniki biznesowe.`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUżytkownik: ${userInput}`
                }]
            }],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: 1000,
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
            model: 'gemini-1.5-flash',
            service: 'Google AI Studio via AI Gateway',
            assistant: 'AI Helper 8 - Business & Marketing',
            temperature: temperature
        });

    } catch (error) {
        console.error('AI Helper 8 error:', error);
        return createErrorResponse('Błąd serwera', 500);
    }
};