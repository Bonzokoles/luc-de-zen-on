import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

// Google Bard endpoint (note: this is a conceptual endpoint as Bard doesn't have direct API)
export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Google Bard API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { message: "your question" }',
    model: 'google-bard'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, temperature = 0.9, language = 'pl' } = body;

    if (!message?.trim()) {
      return createErrorResponse('Message is required', 400);
    }

    // Tymczasowe rozwiązanie - używamy Cloudflare AI jako fallback
    const runtime = (locals as any)?.runtime;
    if (!runtime?.env?.AI) {
      return createErrorResponse('AI service not available', 500);
    }

    const systemPrompt = language === 'en' 
      ? `You are Google Bard, an experimental conversational AI service.
         Provide creative, helpful, and informative responses with a friendly tone.
         Be curious and helpful, offering multiple perspectives when appropriate.`
      : `Jesteś Google Bard, eksperymentalnym usługą konwersacyjnego AI.
         Udzielaj kreatywnych, pomocnych i informacyjnych odpowiedzi w przyjaznym tonie.
         Bądź ciekawski i pomocny, oferując różne perspektywy gdy to właściwe.`;

    try {
      const aiResponse = await runtime.env.AI.run('@cf/google/gemma-3-12b-it', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature
      });

      const response = aiResponse.response || 'Brak odpowiedzi od modelu AI.';

      return createSuccessResponse({
        response,
        model: 'google-bard-fallback',
        message: 'Success',
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('AI Error:', aiError);
      return createErrorResponse('Failed to process AI request', 500, {
        details: aiError instanceof Error ? aiError.message : 'Unknown AI error'
      });
    }

  } catch (error) {
    console.error('Google Bard API error:', error);
    return createErrorResponse('Internal server error', 500, {
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};