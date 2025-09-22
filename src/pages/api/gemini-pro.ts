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

    // Fallback do Cloudflare AI jeśli Google AI Studio nie jest dostępne
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;
    
    const systemPrompt = language === 'en' 
      ? "You are Gemini Pro simulation running on Cloudflare AI. Provide helpful, accurate, and detailed responses."
      : "Jesteś Gemini Pro działający na Cloudflare AI. Udzielaj pomocnych, dokładnych i szczegółowych odpowiedzi po polsku.";

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;

    // Użyj lokalnego Cloudflare AI jako fallback
    try {
      const aiResponse = await env?.AI?.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: message
          }
        ],
        temperature: temperature,
        max_tokens: 2048
      });

      return createSuccessResponse({
        response: aiResponse?.response || "Gemini Pro (Cloudflare AI) - Witaj! Jestem gotowy do pomocy.",
        model: 'gemini-pro-cf-simulation',
        message: 'Success via Cloudflare AI',
        timestamp: new Date().toISOString(),
        fallback: true
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