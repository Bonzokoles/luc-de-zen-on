import type { APIRoute } from 'astro';

/**
 * Blog Generator API
 * Generates blog posts using AI based on user parameters
 */

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { topic, category, length, tone, instructions } = await request.json();

    if (!topic?.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Topic is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get DeepSeek API key from environment
    const env = import.meta.env.DEV ? process.env : (locals as any)?.runtime?.env || {};
    const apiKey = env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'DeepSeek API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the prompt based on parameters
    const lengthMap: { [key: string]: string } = {
      'short': '500-800 słów',
      'medium': '800-1500 słów', 
      'long': '1500+ słów'
    };

    const prompt = `
Napisz profesjonalny artykuł blogowy na temat: "${topic}"

Parametry:
- Kategoria: ${category || 'ogólna'}
- Długość: ${lengthMap[length] || '800-1500 słów'}
- Ton: ${tone || 'profesjonalny'}
${instructions ? `- Dodatkowe instrukcje: ${instructions}` : ''}

Struktura artykułu powinna zawierać:
1. Przyciągający tytuł
2. Wprowadzenie (hook + opis problemu)
3. Główną treść podzieloną na sekcje z nagłówkami
4. Praktyczne przykłady lub wskazówki
5. Podsumowanie i wnioski
6. Call-to-action

Artykuł powinien być:
- Zoptymalizowany pod SEO
- Napisany w języku polskim
- Zawierać wartościowe informacje
- Być angażujący dla czytelnika
- Zawierać nagłówki H2 i H3 dla lepszej struktury

Formatuj artykuł w HTML z odpowiednimi tagami (h1, h2, h3, p, ul, li, strong, em).
`;

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Jesteś ekspertem w tworzeniu wysokiej jakości treści blogowych. Tworzysz angażujące, wartościowe i zoptymalizowane pod SEO artykuły w języku polskim.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Store the generated blog post (you could save to database here)
    const blogPost = {
      id: Date.now().toString(),
      topic,
      category,
      length,
      tone,
      instructions,
      content: generatedContent,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    return new Response(JSON.stringify({
      success: true,
      content: generatedContent,
      metadata: {
        topic,
        category,
        length,
        tone,
        wordCount: generatedContent.split(' ').length,
        createdAt: blogPost.createdAt
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to generate blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};