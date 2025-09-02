import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt, contentType } = await request.json();
    
    if (!prompt || !contentType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize OpenAI with API key from environment
    const openai = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY,
    });

    const systemMessage = {
      role: "system" as const,
      content: "Jesteś ekspertem marketingu tworzącym angażujące teksty w stylu nowoczesnym i profesjonalnym. Używaj dynamicznego, przystępnego stylu z wyraźnym CTA zachęcającym do działania."
    };

    const userMessage = {
      role: "user" as const,
      content: `Napisz ${contentType} na temat: ${prompt}. Użyj stylu: dynamiczny, przystępny, z CTA zachęcającym do działania. Tekst powinien być profesjonalny ale przyjazny.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, userMessage],
      max_tokens: 500,
      temperature: 0.7,
    });

    const generatedText = response.choices[0].message.content;

    return new Response(JSON.stringify({ 
      success: true,
      text: generatedText,
      contentType: contentType,
      prompt: prompt 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating marketing content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate marketing content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
