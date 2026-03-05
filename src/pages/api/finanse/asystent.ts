import type { APIRoute } from 'astro';
import type { CloudflareEnv } from '../../../types/finanse';
import { getDashboardKPI, getRentownoscSummary, getHighRiskDocuments, getCostsSummary } from '../../../lib/finanse-service';

// ================================================================
// ASYSTENT FINANSOWY MYBONZO — RAG endpoint (step_14)
// POST /api/finanse/asystent
// Bezpośrednie zapytania D1 (4 źródła) + GPT-4o + odpowiedź po polsku
// ================================================================

interface AsystentInput {
  pytanie: string;
  tenant_id?: string;
  kontekst_sesji?: Array<{ rola: 'user' | 'asystent'; tresc: string }>;
  zakres?: { od: string; do: string };
}

const SYSTEM_PROMPT = `Jesteś Asystentem Finansowym MyBonzo ERP. Odpowiadasz WYŁĄCZNIE po polsku.

TWOJA ROLA:
• Analizujesz dane finansowe firmy meblarskiej (meble, sofy, stoły, krzesła)
• Identyfikujesz ryzyka, trendy i możliwości optymalizacji
• Dajesz konkretne, operacyjne rekomendacje — nie ogólniki

DOSTĘP DO DANYCH (RAG context w wiadomości użytkownika):
• Dashboard KPI: przychody, koszty, zysk netto, marża brutto, cashflow
• Rentowność per kategoria produktów (top kategorie + alerty < 35% marży)
• Dokumenty wysokiego ryzyka (faktury przeterminowane, podejrzani kontrahenci)
• Koszty operacyjne: marketing, pracownicy, dostawcy

STYL ODPOWIEDZI:
1. Krótko i konkretnie — max 250 słów, chyba że pytanie wymaga szczegółów
2. Używaj list wypunktowanych (•) i konkretnych liczb z PLN/%
3. Zawsze wskaż źródło danych (Dashboard, Rentowność, Dokumenty itp.)
4. Kiedy pyta o ryzyko → podaj: numer dokumentu, kwotę, kontrahenta, score
5. Kiedy pyta o marże → top 3 kategorie + alerty < 35%
6. Kiedy pyta o cashflow → saldo, przychody vs koszty, trend
7. Kiedy pyta o koszty → breakdown per kategoria + najdroższy dostawca
8. Na końcu: 2–3 konkretne rekomendacje działań z priorytetem`;

function buildDemoResponse(pytanie: string) {
  return {
    odpowiedz: `Tryb demonstracyjny — brak połączenia z bazą danych.\n\nOtrzymałem pytanie: "${pytanie}"\n\nAby uzyskać pełną analizę finansową, skonfiguruj zmienne środowiskowe OPENAI_API_KEY i D1 w Cloudflare Pages.`,
    zrodla: ['Demo mode'],
    tokeny: { input: 0, output: 0 },
  };
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;

  let body: AsystentInput;
  try {
    body = await request.json() as AsystentInput;
  } catch {
    return Response.json({ error: 'Nieprawidłowy format JSON' }, { status: 400 });
  }

  const { pytanie, tenant_id, kontekst_sesji = [], zakres } = body;

  if (!pytanie?.trim()) {
    return Response.json({ error: 'Pole "pytanie" jest wymagane' }, { status: 400 });
  }

  const apiKey = env?.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(buildDemoResponse(pytanie));
  }

  const tenantId = tenant_id ?? env?.TENANT_ID ?? 'meblepumo';
  const od = zakres?.od ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const do_ = zakres?.do ?? new Date().toISOString().split('T')[0];

  // Brak D1 → demo mode
  if (!env?.D1) {
    return Response.json(buildDemoResponse(pytanie));
  }

  try {
    const db = env.D1;

    // ---- 1. RAG: pobierz kontekst finansowy bezpośrednio z D1 (4 źródła równolegle) ----
    const [dashboard, rentownosc, dokumenty, costs] = await Promise.all([
      getDashboardKPI(db, tenantId, od, do_).catch(() => null),
      getRentownoscSummary(db, tenantId, od, do_).catch(() => null),
      getHighRiskDocuments(db, tenantId, 5).catch(() => null),
      getCostsSummary(db, tenantId, od, do_).catch(() => null),
    ]);

    // ---- 2. Zbuduj kontekst RAG ----
    const usedSources: string[] = [];
    let ragKontekst = `KONTEKST FINANSOWY (${od} – ${do_}) dla firmy: ${tenantId}\n\n`;

    if (dashboard) {
      usedSources.push('Dashboard KPI');
      ragKontekst += `## DASHBOARD KPI:\n`;
      ragKontekst += `• Przychody: ${dashboard.total_revenue.toLocaleString('pl-PL')} PLN\n`;
      ragKontekst += `• Koszty: ${dashboard.total_costs.toLocaleString('pl-PL')} PLN\n`;
      ragKontekst += `• Zysk netto: ${dashboard.net_profit.toLocaleString('pl-PL')} PLN\n`;
      ragKontekst += `• Marża brutto: ${dashboard.gross_margin_pct}%\n`;
      ragKontekst += `• Liczba transakcji: ${dashboard.total_orders} szt.\n\n`;
    }

    if (rentownosc) {
      usedSources.push('Rentowność kategorii');
      ragKontekst += `## RENTOWNOŚĆ:\n`;
      if (rentownosc.top_margin) {
        ragKontekst += `• Najlepsza kategoria: ${rentownosc.top_margin.category} (${rentownosc.top_margin.margin_pct}%)\n`;
      }
      if (rentownosc.low_margin_alerts.length) {
        ragKontekst += `• ALERTY (marża < 35%): ${rentownosc.low_margin_alerts.map(a => `${a.category} ${a.margin_pct}%`).join(', ')}\n`;
      }
      ragKontekst += '\n';
    }

    if (dokumenty?.length) {
      usedSources.push('Dokumenty wysokiego ryzyka');
      ragKontekst += `## DOKUMENTY WYSOKIEGO RYZYKA:\n`;
      dokumenty.slice(0, 4).forEach(d => {
        ragKontekst += `• ${d.numer} | ${d.kontrahent} | ${d.kwota_brutto?.toLocaleString('pl-PL') ?? 0} PLN | Score: ${d.ryzyko_punktowe}/100 | ${d.poziom_ryzyka}\n`;
      });
      ragKontekst += '\n';
    }

    if (costs) {
      usedSources.push('Koszty operacyjne');
      ragKontekst += `## KOSZTY OPERACYJNE:\n`;
      ragKontekst += `• Łączne: ${costs.total_costs.toLocaleString('pl-PL')} PLN\n`;
      ragKontekst += `• Marketing: ${costs.marketing.toLocaleString('pl-PL')} PLN\n`;
      ragKontekst += `• Pracownicy: ${costs.employees.toLocaleString('pl-PL')} PLN\n`;
      ragKontekst += `• Dostawcy: ${costs.suppliers.toLocaleString('pl-PL')} PLN\n`;
      ragKontekst += `• Najdroższy dostawca: ${costs.top_expensive_supplier}\n\n`;
    }

    // ---- 3. Zbuduj historię sesji ----
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    const recentHistory = kontekst_sesji.slice(-6);
    for (const turn of recentHistory) {
      messages.push({ role: turn.rola === 'asystent' ? 'assistant' : 'user', content: turn.tresc });
    }

    messages.push({
      role: 'user',
      content: `${ragKontekst}\n---\nPYTANIE: ${pytanie}`,
    });

    // ---- 4. Wywołanie GPT-4o ----
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!gptRes.ok) {
      const err = await gptRes.text();
      console.error('[asystent-finanse] OpenAI error:', err);
      return Response.json({ error: 'Błąd OpenAI API', details: err }, { status: 502 });
    }

    const gptJson = await gptRes.json() as {
      choices: Array<{ message: { content: string } }>;
      usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
      model: string;
    };

    const odpowiedz = gptJson.choices?.[0]?.message?.content ?? 'Brak odpowiedzi.';

    return Response.json({
      odpowiedz,
      zrodla: usedSources,
      tokeny: {
        input: gptJson.usage?.prompt_tokens ?? 0,
        output: gptJson.usage?.completion_tokens ?? 0,
      },
    });
  } catch (err) {
    console.error('[asystent-finanse]', err);
    return Response.json(buildDemoResponse(pytanie));
  }
};
