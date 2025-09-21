import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

// Google AI / Vertex AI Gemini Pro endpoint
export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Gemini Pro API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { message: "your prompt" }',
    model: 'gemini-pro'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, temperature = 0.7, language = 'pl' } = body;

    if (!message?.trim()) {
      return createErrorResponse('Message is required', 400);
    }

    // Tymczasowe rozwiązanie - używamy Cloudflare AI jako fallback
    // TODO: Implementacja Google Vertex AI Gemini Pro
    const runtime = (locals as any)?.runtime;
    if (!runtime?.env?.AI) {
      return createErrorResponse('AI service not available', 500);
    }

    const systemPrompt = language === 'en' 
      ? "You are Gemini Pro, Google's advanced AI model. Provide helpful, accurate, and detailed responses."
      : "Jesteś Gemini Pro, zaawansowanym modelem AI Google. Udzielaj pomocnych, dokładnych i szczegółowych odpowiedzi po polsku.";

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
        model: 'gemini-pro-fallback',
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
    console.error('Gemini Pro API error:', error);
    return createErrorResponse('Internal server error', 500, {
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};