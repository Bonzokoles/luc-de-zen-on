import type { APIRoute } from 'astro';

/**
 * Content Generator API
 * Generates various types of content using Gemini AI
 */

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { contentType, topic, length, tone, keywords } = await request.json();

    if (!topic?.trim()) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Temat jest wymagany'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Access environment - Cloudflare runtime
    const env = import.meta.env.DEV ? process.env : (locals as any)?.runtime?.env || {};
    const deepseekApiKey = env.DEEPSEEK_API_KEY;

    if (!deepseekApiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Brak konfiguracji API (DEEPSEEK_API_KEY)'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build prompt based on content type and parameters
    const lengthMap: Record<string, string> = {
      short: '200-400 słów',
      medium: '400-800 słów', 
      long: '800-1500 słów'
    };

    const toneMap: Record<string, string> = {
      professional: 'profesjonalny i formalny',
      casual: 'swobodny i nieformalny',
      friendly: 'przyjazny i ciepły',
      authoritative: 'autorytatywny i eksperci',
      creative: 'kreatywny i nietypowy'
    };

    const contentTypeMap: Record<string, string> = {
      article: 'artykuł informacyjny',
      description: 'opis produktu lub usługi',
      'blog-post': 'post na blog',
      'social-media': 'post na social media',
      email: 'e-mail marketingowy',
      'press-release': 'komunikat prasowy'
    };

    let prompt = `Napisz ${contentTypeMap[contentType] || 'treść'} na temat: "${topic}".

Wymagania:
- Długość: ${lengthMap[length] || '400-800 słów'}
- Ton: ${toneMap[tone] || 'profesjonalny'}
- Język: polski`;

    if (keywords && keywords.length > 0) {
      prompt += `\n- Słowa kluczowe do uwzględnienia: ${keywords.join(', ')}`;
    }

    prompt += `\n\nUtwórz wysokiej jakości treść, która jest angażująca, informatywna i odpowiada na potrzeby czytelnika. Używaj naturalnego języka polskiego.`;

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Jesteś ekspertem w tworzeniu różnorodnych treści marketingowych i edukacyjnych. Tworzysz wysokiej jakości treści w języku polskim, które są angażujące i profesjonalne.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('Brak odpowiedzi z API');
    }

    return new Response(JSON.stringify({
      success: true,
      content: generatedContent,
      metadata: {
        contentType,
        topic,
        length,
        tone,
        keywords,
        wordCount: generatedContent.split(' ').length,
        generatedAt: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Content generation error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Nieznany błąd podczas generowania treści'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};