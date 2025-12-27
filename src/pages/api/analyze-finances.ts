/**
 * ANALIZA FINANSOWA AI - KALKULATOR BIZNESOWY
 * 
 * 🤖 MODEL AI: GEMINI 2.5 FLASH
 * • API: Google Generative Language API
 * • Model: gemini-2.5-flash
 * • Authentication: x-goog-api-key header
 * • Env: GOOGLE_API_KEY
 * 
 * 🎯 Zastosowanie:
 * - Analiza obliczeń brutto/netto
 * - Wyjaśnienie rzeczywistego zysku dla firmy
 * - Uwzględnienie kosztów stałych, ZUS, podatków
 * - Rekomendacje biznesowe
 * 
 * 💡 Cechy:
 * - Kontekst polskiego biznesu
 * - Praktyczne wskazówki
 * - Uwzględnia ZUS, VAT, PIT/CIT
 */
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { calculationType, data } = await request.json();

        if (!calculationType || !data) {
            return new Response(
                JSON.stringify({ error: 'Brak wymaganych danych' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 🔑 Pobieranie klucza API z Cloudflare env (obsługa spacji)
        const env = locals.runtime?.env || {};
        const apiKey = env['GOOGLE_API_KEY'] || env[' GOOGLE_API_KEY'] ||
            Object.entries(env).find(([k]) => k.trim() === 'GOOGLE_API_KEY')?.[1];

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'Brak klucza API' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Przygotowanie promptu w zależności od typu kalkulacji
        let userPrompt = '';

        switch (calculationType) {
            case 'margin':
                userPrompt = `Przeanalizuj obliczenia marży dla małej firmy w Polsce:
        
Dane:
- Cena zakupu (netto): ${data.costPrice} PLN
- Cena sprzedaży (netto): ${data.sellPrice} PLN
- Obliczona marża: ${data.marginPercent}%
- Zysk na sztuce: ${data.profitAmount} PLN

Proszę o:
1. Oceń czy marża jest odpowiednia dla tego typu produktu/usługi
2. Wyjaśnij ile RZECZYWIŚCIE zostanie właścicielowi firmy po odliczeniu:
   - VAT (23%)
   - ZUS (przedsiębiorca: ~1400-1500 PLN/mc)
   - Podatek dochodowy (skala podatkowa lub ryczałt)
   - Koszty stałe firmy (szacunkowo)
3. Podaj konkretne kwoty - ile realnie zarobi właściciel na tej transakcji
4. Czy warto? Jakie korzyści/ryzyka?

Odpowiedź w formacie:
📊 OCENA MARŻY: [ocena]
💰 RZECZYWISTY ZYSK DLA WŁAŚCICIELA: [kwota] PLN
🎯 REKOMENDACJA: [rada]`;
                break;

            case 'vat':
                userPrompt = `Wyjaśnij obliczenia VAT dla polskiego przedsiębiorcy:

Dane:
- Kwota netto: ${data.net} PLN
- Stawka VAT: ${data.vatRate}%
- Kwota VAT: ${data.vatAmount} PLN
- Kwota brutto: ${data.gross} PLN

Proszę o:
1. Prostym językiem wyjaśnij różnicę między netto, VAT i brutto
2. Ile z tej kwoty brutto FAKTYCZNIE zostanie firmie?
3. Kiedy i jak płaci się VAT do urzędu skarbowego?
4. Jakie pułapki czyhają na początkującego przedsiębiorcę?

Odpowiedź praktyczna, z przykładami.`;
                break;

            case 'roi':
                userPrompt = `Oceń opłacalność inwestycji dla małej firmy:

Dane:
- Inwestycja początkowa: ${data.investment} PLN
- Przewidywany zysk roczny: ${data.profit} PLN
- Obliczony ROI: ${data.roiPercent}%
- Zwrot po: ${data.paybackMonths} miesiącach

Proszę o:
1. Czy to dobra inwestycja dla małej firmy w Polsce?
2. Jakie ryzyka mogą opóźnić zwrot?
3. Czy są lepsze alternatywy (lokata, obligacje, inne inwestycje)?
4. Co zrobić aby przyspieszyć zwrot z inwestycji?

Konkretne porady.`;
                break;

            case 'profit':
                userPrompt = `Przeanalizuj rentowność małej firmy w Polsce:

Dane:
- Przychód (sprzedaż): ${data.revenue} PLN
- Koszty całkowite: ${data.costs} PLN
- Zysk netto: ${data.netProfit} PLN
- Marża zysku: ${data.profitMargin}%

Proszę o:
1. Oceń rentowność - czy to dobry wynik?
2. RZECZYWISTY zysk dla właściciela po:
   - Odliczeniu ZUS (~1400-1500 PLN/mc)
   - Podatku (19% liniowy lub skala podatkowa)
   - Rezerwie na nieprzewidziane (10-15%)
3. Ile realnie może wypłacić sobie właściciel?
4. Gdzie szukać oszczędności w kosztach?
5. Jak zwiększyć rentowność?

Konkretne kwoty i porady.`;
                break;

            default:
                userPrompt = 'Analiza biznesowa dla polskiego przedsiębiorcy.';
        }

        const systemPrompt = `Jesteś ekspertem od finansów dla małych firm w Polsce.
Znasz realia polskiego biznesu: ZUS, VAT, podatki, koszty prowadzenia działalności.
Mówisz prostym językiem, bez żargonu. Podajesz konkretne kwoty i praktyczne rady.
Zawsze uwzględniaj:
- ZUS składki (~1400-1500 PLN/mc dla małego przedsiębiorcy)
- VAT 23% (do oddania do urzędu)
- Podatek dochodowy (skala lub 19% liniowy)
- Koszty stałe firmy

Odpowiadaj KRÓTKO (max 200 słów) ale KONKRETNIE.`;

        // 🤖 Wywołanie Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\n${userPrompt}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.4,
                    topK: 40,
                    topP: 0.8,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', errorData);
            return new Response(
                JSON.stringify({ error: 'Błąd API Gemini', details: errorData }),
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const result = await response.json();
        const aiAnalysis = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Brak analizy';

        return new Response(
            JSON.stringify({ analysis: aiAnalysis }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error in analyze-finances:', error);
        return new Response(
            JSON.stringify({ error: 'Błąd serwera', details: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
