import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { contentType, description, tone, length, additionalInfo } = await request.json();

    // Walidacja
    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Opis jest wymagany' }),
        { status: 400 }
      );
    }

    // Pobierz klucz API z zmiennych środowiskowych
    const apiKey = locals.runtime?.env?.GOOGLE_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Brak klucza API dla Gemini' }),
        { status: 500 }
      );
    }

    // Inicjalizuj Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: tone === 'formalny' ? 0.3 : tone === 'entuzjastyczny' ? 0.9 : 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: length === 'krótka' ? 500 : length === 'długa' ? 2000 : 1000,
      }
    });

    // System prompt
    const systemPrompt = `Jesteś profesjonalnym copywriterem i specjalistą od marketingu w Polsce.
Tworzysz wysokiej jakości treści marketingowe po polsku, które są:
- Angażujące i skuteczne
- Dostosowane do polskiego rynku
- Zgodne z najlepszymi praktykami marketingowymi
- Wolne od błędów językowych

Zawsze piszesz w odpowiednim tonie i stylu. Twoje treści są gotowe do natychmiastowego użycia.`;

    // User prompt
    const lengthGuide = length === 'krótka'
      ? '1-2 krótkie zdania lub jeden akapit'
      : length === 'długa'
      ? '3-5 akapitów z rozwinięciem tematu'
      : '2-3 akapity';

    const userPrompt = `Utwórz ${contentType} o następującej tematyce:

${description}

Ton: ${tone}
Długość: ${lengthGuide}

${additionalInfo ? `Dodatkowe informacje:\n${additionalInfo}` : ''}

WAŻNE:
- Pisz po polsku
- Używaj naturalnego języka
- Dla social media: dodaj odpowiednie emoji i hashtagi na końcu
- Dla opisów produktów: podkreśl korzyści dla klienta
- Dla newsletterów: dodaj wyraźne call-to-action`;

    // Generuj treść
    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const response = await result.response;
    const generatedText = response.text();

    return new Response(
      JSON.stringify({
        content: generatedText,
        model: 'gemini-2.0-flash-exp'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error: any) {
    console.error('Błąd generowania treści (Gemini):', error);
    return new Response(
      JSON.stringify({
        error: 'Wystąpił błąd podczas generowania treści',
        details: error.message
      }),
      { status: 500 }
    );
  }
};
