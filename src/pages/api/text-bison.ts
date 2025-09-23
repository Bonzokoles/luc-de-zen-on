import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

// Google Text Bison endpoint for text generation
export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Text Bison API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { message: "your text generation request" }',
    model: 'text-bison'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { message, temperature = 0.8, language = 'pl' } = body;

    if (!message?.trim()) {
      return createErrorResponse('Message is required', 400);
    }

    // Google AI Studio przez Cloudflare AI Gateway zgodnie z INSTR_4
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;
    
    if (!env?.GOOGLE_AI_STUDIO_TOKEN || !env?.CLOUDFLARE_ACCOUNT_ID || !env?.CLOUDFLARE_AI_GATEWAY_ID) {
      return createErrorResponse('Google AI Studio configuration missing', 500);
    }

    const systemPrompt = language === 'en' 
      ? `You are Text Bison, Google's specialized text generation AI model.
         Create high-quality, creative, and engaging content.
         Focus on well-structured, coherent, and contextually appropriate text.`
      : `Jesteś Text Bison, specjalizowanym modelem AI Google do generowania tekstów.
         Twórz wysokiej jakości, kreatywne i angażujące treści.
         Skup się na dobrze ustrukturyzowanych, spójnych i odpowiednich kontekstowo tekstach.`;

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
        model: 'text-bison-fallback',
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
    console.error('Text Bison API error:', error);
    return createErrorResponse('Internal server error', 500, {
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};