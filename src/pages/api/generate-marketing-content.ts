import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from '../../utils/corsUtils';

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
