/**
 * KREATOR DOKUMENTÓW BIZNESOWYCH
 *
 * 🤖 MODEL AI: GEMINI 2.5 FLASH
 * • API: Google Generative AI SDK
 * • Model: gemini-2.5-flash
 * • Env: GOOGLE_API_KEY
 *
 * 🎯 Zastosowanie:
 * - Umowy: świadczenia usług, zlecenie, współpraca B2B
 * - Dokumenty prawne: NDA, Oświadczenie RODO
 * - Polityki: Prywatności (RODO), Regulamin sklepu
 * - Oferty handlowe
 *
 * ⚠️ UWAGA PRAWNA:
 * Wygenerowane dokumenty są SZABLONAMI.
 * Zawsze skonsultuj z prawnikiem przed użyciem!
 *
 * 💡 Cechy:
 * - Zgodne z polskim prawem (szablony)
 * - Długie dokumenty (max 8000 tokens)
 * - Niska temperatura (0.3) = konserwatywne generowanie
 * - Safety settings: wyłączone (dokumenty prawne)
 * - Format: Markdown z sekcjami
 */
import type { APIRoute } from 'astro';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { documentType, prompt } = await request.json();

    // Walidacja
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt jest wymagany' }),
        { status: 400 }
      );
    }

    // Pobierz klucz API
    const env = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const apiKey = env['GOOGLE_API_KEY'] || env[' GOOGLE_API_KEY'] ||
      Object.entries(env).find(([k]) => k.trim() === 'GOOGLE_API_KEY')?.[1];

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Brak klucza API dla Gemini' }),
        { status: 500 }
      );
    }

    // Inicjalizuj Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3, // Niższa temperatura dla dokumentów prawnych = bardziej konserwatywne
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8000, // Dokumenty mogą być długie
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // System context dla dokumentów prawnych
    const systemContext = `Jesteś ekspertem w tworzeniu dokumentów biznesowych i prawnych w Polsce.

Twoja specjalizacja:
- Polskie prawo gospodarcze i cywilne (aktualny stan prawny 2025)
- Dokumenty zgodne z RODO i innymi regulacjami UE
- Profesjonalny język prawniczy, ale zrozumiały
- Wszystkie niezbędne klauzule i postanowienia
- Dokumenty gotowe do użycia

Format dokumentów:
- Markdown z czytelnymi nagłówkami (##, ###)
- Numeracja sekcji gdzie stosowne
- [PLACEHOLDERY] dla danych do wypełnienia (jeśli nie podano)
- Czytelna struktura z podziałem na sekcje
- Na końcu zawsze: "⚠️ **UWAGA:** To szablon dokumentu. Przed użyciem skonsultuj z prawnikiem lub radcą prawnym."

WAŻNE:
- Pisz WYŁĄCZNIE po polsku
- Używaj aktualnego prawa polskiego
- Bądź konkretny i precyzyjny
- Nie dodawaj fikcyjnych danych - używaj [PLACEHOLDERÓW]
- Dokumenty muszą być profesjonalne i gotowe do użycia`;

    // Generuj dokument
    const fullPrompt = `${systemContext}\n\n---\n\nZadanie: Wygeneruj ${documentType}\n\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedText = response.text();

    return new Response(
      JSON.stringify({
        content: generatedText,
        model: 'gemini-2.0-flash-exp',
        documentType: documentType
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error: any) {
    console.error('Błąd generowania dokumentu (Gemini):', error);
    return new Response(
      JSON.stringify({
        error: 'Wystąpił błąd podczas generowania dokumentu',
        details: error.message
      }),
      { status: 500 }
    );
  }
};
