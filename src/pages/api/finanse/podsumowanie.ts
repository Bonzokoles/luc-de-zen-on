import type { APIRoute } from 'astro';
import type { CloudflareEnv, PodsumowanieRequest, PodsumowanieResponse, FinanceDashboardResponse, RentownoscResponse } from '../../../types/finanse';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;

  const body = await request.json() as PodsumowanieRequest;
  const { pytanie, zakres, tenant_id } = body;

  if (!pytanie || !zakres?.od || !zakres?.do) {
    return Response.json({ error: 'Wymagane: pytanie, zakres.od, zakres.do' }, { status: 400 });
  }

  const apiKey = env?.GOOGLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Brak GOOGLE_API_KEY' }, { status: 503 });
  }

  try {
    // 1. Pobierz dane finansowe (równolegle)
    const baseUrl = new URL(request.url).origin;
    const tenantId = tenant_id ?? env?.TENANT_ID ?? 'meblepumo';

    const [dashboardRes, rentownoscRes] = await Promise.all([
      fetch(`${baseUrl}/api/finanse/dashboard?from=${zakres.od}&to=${zakres.do}`),
      fetch(`${baseUrl}/api/finanse/rentownosc?from=${zakres.od}&to=${zakres.do}`),
    ]);

    let dashboard: FinanceDashboardResponse | null = null;
    let rentownosc: RentownoscResponse | null = null;
    if (dashboardRes.ok) dashboard = await dashboardRes.json() as unknown as FinanceDashboardResponse;
    if (rentownoscRes.ok) rentownosc = await rentownoscRes.json() as unknown as RentownoscResponse;

    // 2. Ryzykowne dokumenty z D1
    let ryzyka = { wysokiego_ryzyka: 0, kwota_ryzyka: 0 };
    if (env?.D1) {
      const r = await env.D1.prepare(`
        SELECT COUNT(*) as wysokiego_ryzyka, SUM(kwota_brutto) as kwota_ryzyka
        FROM dokumenty_finansowe
        WHERE tenant_id = ? AND poziom_ryzyka = 'Wysokie'
          AND status NOT IN ('Zapłacona','Anulowana')
      `).bind(tenantId).first<{ wysokiego_ryzyka: number; kwota_ryzyka: number }>();
      ryzyka = { wysokiego_ryzyka: r?.wysokiego_ryzyka ?? 0, kwota_ryzyka: r?.kwota_ryzyka ?? 0 };
    }

    // 3. Zbuduj prompt
    const prompt = `Jesteś analitykiem finansowym MyBonzo ERP. Napisz profesjonalny raport finansowy po polsku.

DANE FINANSOWE (${zakres.od} – ${zakres.do}):
Przychody: ${dashboard?.kpi_cards?.total_revenue ?? 0} PLN
Koszty: ${dashboard?.kpi_cards?.total_costs ?? 0} PLN
Zysk netto: ${dashboard?.kpi_cards?.net_profit ?? 0} PLN
Marża brutto: ${dashboard?.kpi_cards?.gross_margin_pct ?? 0}%
Liczba transakcji: ${dashboard?.kpi_cards?.total_orders ?? 0}
Najlepsza kategoria: ${rentownosc?.top_margin?.category ?? '-'} (marża: ${rentownosc?.top_margin?.margin_pct ?? 0}%)
Dokumenty wysokiego ryzyka: ${ryzyka.wysokiego_ryzyka} szt. (${ryzyka.kwota_ryzyka.toLocaleString('pl-PL')} PLN)

PYTANIE UŻYTKOWNIKA: ${pytanie}

STYL ODPOWIEDZI:
- Zacznij od kluczowych wniosków (2–3 zdania)
- Używaj list z •
- Podawaj konkretne liczby i %
- Na końcu: 2–3 konkretne rekomendacje działań
- Odpowiedź max 250 słów, po polsku`;

    const t0 = Date.now();
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const aiData = await aiRes.json() as { candidates?: Array<{ content: { parts: Array<{ text: string }> } }>; usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number } };
    const czas = `${((Date.now() - t0) / 1000).toFixed(1)}s`;

    const raport = aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Brak odpowiedzi AI.';

    const response: PodsumowanieResponse = {
      raport,
      zrodlo_modelu: 'gemini-2.5-flash',
      czas_obliczen: czas,
      tokeny: {
        input: aiData.usageMetadata?.promptTokenCount ?? 0,
        output: aiData.usageMetadata?.candidatesTokenCount ?? 0,
      },
      zrodla: ['dashboard-finanse', 'rentownosc', 'dokumenty-finansowe (ryzyko)'],
    };

    return Response.json(response);
  } catch (err) {
    console.error('[podsumowanie-finansowe]', err);
    return Response.json({ error: String(err), raport: '', zrodlo_modelu: '', czas_obliczen: '0s', tokeny: { input: 0, output: 0 }, zrodla: [] } as PodsumowanieResponse, { status: 500 });
  }
};
