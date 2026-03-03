import type { APIRoute } from 'astro';
import type { CloudflareEnv, FinanceDashboardResponse, RentownoscResponse } from '../../../types/finanse';

interface DokumentApiItem {
  numer: string;
  kontrahent: string;
  kwota_brutto: number;
  ryzyko_punktowe: number;
}

const SYSTEM_PROMPT = `Jesteś Asystentem Finansowym MyBonzo ERP. Odpowiadasz WYŁĄCZNIE po polsku.

MASZ DOSTĘP DO:
• Dashboard finansowy (przychody, koszty, cashflow, marże)
• Dokumenty finansowe z analizą ryzyka Gemini
• Rentowność po kategoriach produktów

STYL ODPOWIEDZI:
1. Krótko i konkretnie — max 200 słów
2. Używaj • list i konkretnych liczb z %
3. Zawsze wskaż źródło danych
4. Kiedy pyta o ryzyko → podaj konkrety: numer dokumentu, kwotę, kontrahenta, score
5. Kiedy pyta o marże → top3 kategorie + alerty < 35%
6. Kiedy pyta o cashflow → saldo, przychody, koszty w podanym zakresie
7. Na końcu: max 2 konkretne rekomendacje działań`;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;

  const { pytanie, zakres, tenant_id } = await request.json() as {
    pytanie: string;
    zakres?: { od: string; do: string };
    tenant_id?: string;
  };

  if (!pytanie) {
    return Response.json({ error: 'Pole pytanie jest wymagane' }, { status: 400 });
  }

  const apiKey = env?.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Brak OPENAI_API_KEY' }, { status: 503 });
  }

  const baseUrl = new URL(request.url).origin;
  const tenantId = tenant_id ?? env?.TENANT_ID ?? 'meblepumo';
  const od = zakres?.od ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const do_ = zakres?.do ?? new Date().toISOString().split('T')[0];

  try {
    // Pobierz kontekst finansowy równolegle
    const [dashRes, rentRes, docsRes] = await Promise.all([
      fetch(`${baseUrl}/api/finanse/dashboard?from=${od}&to=${do_}`),
      fetch(`${baseUrl}/api/finanse/rentownosc?from=${od}&to=${do_}`),
      fetch(`${baseUrl}/api/finanse/dokumenty-finansowe?ryzyko=Wysokie&limit=5`),
    ]);

    const [dashboard, rentownosc, dokumenty] = await Promise.all([
      dashRes.ok ? dashRes.json() as Promise<FinanceDashboardResponse> : Promise.resolve(null),
      rentRes.ok ? rentRes.json() as Promise<RentownoscResponse> : Promise.resolve(null),
      docsRes.ok ? docsRes.json() as Promise<{ items: DokumentApiItem[] }> : Promise.resolve(null),
    ]) as unknown as [FinanceDashboardResponse | null, RentownoscResponse | null, { items: DokumentApiItem[] } | null];

    // Zbuduj kontekst dla GPT-4o
    const kontekst = `
KONTEKST FINANSOWY (${od} – ${do_}) dla ${tenantId}:

DASHBOARD KPI:
- Przychody: ${dashboard?.kpi_cards?.total_revenue ?? 0} PLN
- Koszty: ${dashboard?.kpi_cards?.total_costs ?? 0} PLN
- Zysk netto: ${dashboard?.kpi_cards?.net_profit ?? 0} PLN
- Marża brutto: ${dashboard?.kpi_cards?.gross_margin_pct ?? 0}%
- Transakcje: ${dashboard?.kpi_cards?.total_orders ?? 0} szt.

RENTOWNOŚĆ:
- Najlepsza: ${rentownosc?.top_margin?.category ?? '-'} (${rentownosc?.top_margin?.margin_pct ?? 0}%)
- Alerty marży: ${rentownosc?.low_margin_alerts?.map((a: { category: string; margin_pct: number }) => `${a.category} ${a.margin_pct}%`).join(', ') || 'brak'}

DOKUMENTY WYSOKIEGO RYZYKA:
${(dokumenty?.items ?? []).slice(0, 3).map((d: DokumentApiItem) =>
  `• ${d.numer} | ${d.kontrahent} | ${d.kwota_brutto} PLN | score: ${d.ryzyko_punktowe}/100`
).join('\n') || '• brak dokumentów wysokiego ryzyka'}

PYTANIE: ${pytanie}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: kontekst },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number };
      error?: { message: string };
    };

    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 500 });
    }

    const odpowiedz = data.choices?.[0]?.message?.content ?? 'Brak odpowiedzi.';

    return Response.json({
      odpowiedz,
      zrodla: ['dashboard-finanse', 'rentownosc', 'dokumenty-finansowe'],
      tokeny: {
        input: data.usage?.prompt_tokens ?? 0,
        output: data.usage?.completion_tokens ?? 0,
      },
    });
  } catch (err) {
    console.error('[asystent-finanse]', err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
