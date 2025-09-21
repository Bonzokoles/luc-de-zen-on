import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

// Google Code Bison endpoint for programming assistance
export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Code Bison API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { message: "your coding question" }',
    model: 'code-bison'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, temperature = 0.2, language = 'pl' } = body;

    if (!message?.trim()) {
      return createErrorResponse('Message is required', 400);
    }

    // Tymczasowe rozwiązanie - używamy Cloudflare AI jako fallback
    const runtime = (locals as any)?.runtime;
    if (!runtime?.env?.AI) {
      return createErrorResponse('AI service not available', 500);
    }

    const systemPrompt = language === 'en' 
      ? `You are Code Bison, Google's specialized programming AI assistant. 
         Provide accurate code examples, explanations, and programming solutions.
         Focus on best practices, clean code, and detailed explanations.`
      : `Jesteś Code Bison, specjalizowanym asystentem programistycznym AI Google.
         Udzielaj dokładnych przykładów kodu, wyjaśnień i rozwiązań programistycznych.
         Skup się na najlepszych praktykach, czystym kodzie i szczegółowych wyjaśnieniach.`;

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
        model: 'code-bison-fallback',
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
    console.error('Code Bison API error:', error);
    return createErrorResponse('Internal server error', 500, {
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};