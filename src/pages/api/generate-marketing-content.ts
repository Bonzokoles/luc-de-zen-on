import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

<<<<<<< HEAD
// Cloudflare AI - Gemma endpoint (przykład: @cf/meta/gemma-7b-it)
export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Gemma Marketing Content API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { prompt: "...", contentType: "..." }',
    model: 'gemma-cloudflare'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { prompt, contentType = 'post na social media', temperature = 0.7, language = 'pl' } = body;

    if (!prompt?.trim()) {
      return createErrorResponse('Prompt is required', 400);
    }

    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;

    const systemPrompt = language === 'en'
      ? `You are an expert AI marketing content generator (type: ${contentType}). Create engaging, professional, and original content.`
      : `Jesteś ekspertem AI od generowania treści marketingowych (typ: ${contentType}). Twórz angażujące, profesjonalne i oryginalne treści po polsku.`;

    // Wywołanie modelu Gemma przez Cloudflare AI
    try {
      const aiResponse = await env?.AI?.run('@cf/meta/gemma-7b-it', {
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: 2048
      });

      return createSuccessResponse({
        text: aiResponse?.response || "Brak odpowiedzi z modelu Gemma.",
        model: 'gemma-cloudflare',
        message: 'Success via Cloudflare AI',
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('Gemma AI Error:', aiError);
      return createErrorResponse('Failed to process AI request', 500, {
        details: aiError instanceof Error ? aiError.message : 'Unknown AI error'
      });
    }

  } catch (error) {
    console.error('Gemma Marketing Content API error:', error);
    return createErrorResponse('Internal server error', 500, {
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
=======
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { prompt, contentType } = await request.json();
    const env = locals.runtime.env;
    
    if (!prompt || !contentType) {
      return createErrorResponse('Missing required fields', 400);
    }

    if (!env.AI) {
      return createErrorResponse('Cloudflare AI nie jest dostępny', 500);
    }

    const systemPrompt = "Jesteś ekspertem marketingu tworzącym angażujące teksty w stylu nowoczesnym i profesjonalnym. Używaj dynamicznego, przystępnego stylu z wyraźnym CTA zachęcającym do działania.";
    const userPrompt = `Napisz ${contentType} na temat: ${prompt}. Użyj stylu: dynamiczny, przystępny, z CTA zachęcającym do działania. Tekst powinien być profesjonalny ale przyjazny.`;

    // Użyj Cloudflare Workers AI
    const response = await env.AI.run(env.ADVANCED_TEXT_MODEL || '@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    });

    const generatedText = response.response;

    return createSuccessResponse({ 
      success: true,
      text: generatedText,
      contentType: contentType,
      prompt: prompt 
    });

  } catch (error) {
    console.error('Error generating marketing content:', error);
    return createErrorResponse('Failed to generate marketing content', 500);
  }
};

export const OPTIONS = createOPTIONSHandler(['POST', 'OPTIONS']);
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
