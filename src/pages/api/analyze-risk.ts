import type { APIRoute } from 'astro';

/**
 * AI Risk Assessment Endpoint
 * 
 * Model: Gemini 2.5 Flash
 * Token Limit: 8000
 * Purpose: Analiza ryzyka finansowego dla dokumentów
 */

export const POST: APIRoute = async ({ request }) => {
  try {
    const { numbers, text } = await request.json();

    const apiKey = import.meta.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const kwota = numbers.kwota || numbers.brutto || 0;
    const vat = numbers.vat || 23;
    const netto = numbers.netto || 0;

    const systemPrompt = `Jesteś ekspertem finansowym specjalizującym się w ocenie ryzyka biznesowego.
Analizujesz dokumenty finansowe i transakcje pod kątem:
- Wysokości kwot i potencjalnego ryzyka finansowego
- Zgodności z przepisami VAT w Polsce
- Płynności finansowej
- Rekomendacji bezpieczeństwa

Odpowiadaj TYLKO w formacie JSON:
{
  "score": number (0-100, gdzie 100 = najwyższe ryzyko),
  "level": "low" | "medium" | "high",
  "analysis": "szczegółowa analiza po polsku",
  "recommendations": ["rekomendacja 1", "rekomendacja 2", ...]
}`;

    const userPrompt = `Oceń ryzyko finansowe dla następującej transakcji/dokumentu:

Kwota brutto: ${kwota} PLN
VAT: ${vat}%
Netto: ${netto} PLN

Dodatkowy kontekst z dokumentu:
${text.substring(0, 500)}

Przeanalizuj i zwróć JSON z oceną ryzyka.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8000,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || '{}';

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = aiResponse.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    try {
      const risk = JSON.parse(jsonStr);
      
      // Validate response structure
      if (!risk.score || !risk.level || !risk.analysis) {
        throw new Error('Invalid AI response structure');
      }

      return new Response(JSON.stringify({ risk }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', jsonStr);
      
      // Fallback risk assessment
      const fallbackRisk = {
        score: kwota > 10000 ? 70 : kwota > 5000 ? 50 : 30,
        level: kwota > 10000 ? 'high' : kwota > 5000 ? 'medium' : 'low',
        analysis: `Automatyczna ocena dla kwoty ${kwota} PLN. ${kwota > 10000 ? 'Wysoka kwota - wymaga weryfikacji.' : kwota > 5000 ? 'Średnia kwota - standardowa kontrola.' : 'Niska kwota - niskie ryzyko.'}`,
        recommendations: [
          'Sprawdź dane kontrahenta',
          'Zweryfikuj warunki płatności',
          kwota > 5000 ? 'Rozważ ubezpieczenie transakcji' : 'Zachowaj dokumentację'
        ]
      };

      return new Response(JSON.stringify({ risk: fallbackRisk }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Risk analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Risk analysis failed',
        risk: {
          score: 50,
          level: 'medium',
          analysis: 'Nie udało się przeprowadzić pełnej analizy AI. Stosuj standardowe procedury bezpieczeństwa.',
          recommendations: ['Zweryfikuj dokument ręcznie', 'Sprawdź dane kontrahenta']
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
