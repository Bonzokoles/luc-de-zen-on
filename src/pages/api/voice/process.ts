import type { APIRoute } from 'astro';

// Using the same knowledge base as POLACZEK for consistency
import { PolaczekKnowledgeBase } from '../../../utils/polaczekKnowledge.js';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { text, context } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ success: false, error: 'No text provided' }), { status: 400 });
    }

    const env = (locals as any)?.runtime?.env;

    if (!env?.AI) {
      return new Response(JSON.stringify({
        success: true,
        response: `System głosowy działa, ale AI jest niedostępne. Odebrano: "${text}"`,
        ai_available: false,
      }));
    }

    // Build a comprehensive system prompt
    const knowledgeContext = PolaczekKnowledgeBase.getContext(text);
    const systemPrompt = `Jesteś POLACZEK, zaawansowanym asystentem AI dla platformy MyBonzo.
    Twoim zadaniem jest przetwarzanie komend głosowych i odpowiadanie na nie po polsku.
    Masz dostęp do następujących informacji o systemie:
    ${knowledgeContext}
    Odpowiadaj zwięźle i na temat, wykonując polecenia użytkownika.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Przetwórz następującą komendę głosową: "${text}"` },
    ];

    try {
      const aiResponse = await env.AI.run('@cf/qwen/qwen1.5-7b-chat-awq', {
        messages,
        temperature: 0.5,
      });

      const responseText = aiResponse.response || `Przetworzono: "${text}". Brak dalszych akcji.`;

      return new Response(JSON.stringify({
        success: true,
        response: responseText,
        ai_available: true,
        model: 'Qwen 1.5 7B Chat',
      }));

    } catch (aiError) {
      console.error('AI Processing Error:', aiError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Błąd przetwarzania AI',
        details: aiError.message,
      }), { status: 500 });
    }

  } catch (error) {
    console.error('Voice API Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Wewnętrzny błąd serwera' }), { status: 500 });
  }
};
