import type { APIRoute } from 'astro';
import type { CloudflareEnv, FinanceDashboardResponse, RentownoscResponse } from '../types/finanse';

// ================================================================
// ASYSTENT FINANSOWY MYBONZO — RAG endpoint (step_14)
// POST /api/asystent-finanse
// Pełny kontekst finansowy + GPT-4o + odpowiedź po polsku
// ================================================================

const FINANSE_SYSTEM_PROMPT = `Jesteś Asystentem Finansowym MyBonzo ERP. Odpowiadasz WYŁĄCZNIE po polsku.

TWOJA ROLA:
• Analizujesz dane finansowe firmy meblarskiej (meble, sofy, stoły, krzesła)
• Identyfikujesz ryzyka, trendy i możliwości optymalizacji
• Dajesz konkretne, operacyjne rekomendacje — nie ogólniki

DOSTĘP DO DANYCH (RAG context w wiadomości użytkownika):
• Dashboard KPI: przychody, koszty, zysk netto, marża brutto, cashflow
• Rentowność per kategoria produktów (top kategorie + alerty < 35% marży)
• Dokumenty wysokiego ryzyka (faktury przeterminowane, podejrzani kontrahenci)
• Ostatnie transakcje i koszty operacyjne
• Historia sesji (kontekst poprzednich pytań)

STYL ODPOWIEDZI:
1. Krótko i konkretnie — max 250 słów, chyba że pytanie wymaga szczegółów
2. Używaj list wypunktowanych (•) i konkretnych liczb z PLN/%
3. Zawsze wskaż źródło danych (Dashboard, Rentowność, Dokumenty itp.)
4. Kiedy pyta o ryzyko → podaj: numer dokumentu, kwotę, kontrahenta, score
5. Kiedy pyta o marże → top 3 kategorie + alerty < 35%
6. Kiedy pyta o cashflow → saldo, przychody vs koszty, trend
7. Kiedy pyta o koszty → breakdown per kategoria + najdroższy dostawca
8. Na końcu: 2–3 konkretne rekomendacje działań z priorytetem

FORMAT ODPOWIEDZI:
- Odpowiedź główna
- Źródła użyte do analizy
- Następne kroki (lista 2-3 działań)
- Potrzebne akcje w systemie (opcjonalnie — tylko gdy konieczne)`;

interface AsystentInput {
  pytanie: string;
  tenant_id?: string;
  kontekst_sesji?: Array<{ rola: 'user' | 'asystent'; tresc: string }>;
  zakres?: { od: string; do: string };
}

interface AsystentResponse {
  odpowiedz: string;
  zrodla: string[];
  nastepne_kroki: string[];
  potrzebne_akcje: string[];
  model: string;
  tokens_uzyte?: number;
}

interface DokumentApiItem {
  numer: string;
  kontrahent: string;
  kwota_brutto: number;
  ryzyko_punktowe: number;
  poziom_ryzyka: string;
  termin_platnosci?: string;
}

interface RecentCostItem {
  category: string;
  counterparty: string;
  amount: number;
  date: string;
  status: string;
}

function buildDemoResponse(pytanie: string): AsystentResponse {
  return {
    odpowiedz: `Tryb demonstracyjny — brak połączenia z bazą danych.\n\nOtrzymałem pytanie: "${pytanie}"\n\nAby uzyskać pełną analizę finansową, skonfiguruj zmienne środowiskowe OPENAI_API_KEY i D1 w Cloudflare Pages.`,
    zrodla: ['Demo mode'],
    nastepne_kroki: [
      'Skonfiguruj OPENAI_API_KEY w Cloudflare Pages',
      'Upewnij się, że binding D1 "D1" jest aktywny',
    ],
    potrzebne_akcje: [],
    model: 'demo',
  };
}

function parseGptResponse(raw: string): Omit<AsystentResponse, 'model' | 'tokens_uzyte'> {
  // Próbujemy znaleźć JSON w odpowiedzi
  const jsonMatch = raw.match(/```json\s*([\s\S]+?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch {
      // fallback
    }
  }

  // Brak JSON – zbuduj strukturę z surowego tekstu
  const lines = raw.split('\n').filter(Boolean);
  const nastepneKroki: string[] = [];
  const potrzebneAkcje: string[] = [];

  let inNastepne = false;
  let inAkcje = false;
  const odpowiedzLines: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('następne kroki') || lower.includes('nastepne kroki')) { inNastepne = true; inAkcje = false; continue; }
    if (lower.includes('potrzebne akcje') || lower.includes('akcje w systemie')) { inAkcje = true; inNastepne = false; continue; }

    if (inNastepne) nastepneKroki.push(line.replace(/^[•\-\d\.]+\s*/, '').trim());
    else if (inAkcje) potrzebneAkcje.push(line.replace(/^[•\-\d\.]+\s*/, '').trim());
    else odpowiedzLines.push(line);
  }

  return {
    odpowiedz: odpowiedzLines.join('\n').trim() || raw,
    zrodla: ['Dashboard KPI', 'Rentowność', 'Dokumenty finansowe'],
    nastepne_kroki: nastepneKroki.length > 0 ? nastepneKroki.slice(0, 3) : ['Sprawdź aktualne dane w Dashboard'],
    potrzebne_akcje: potrzebneAkcje.slice(0, 3),
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

  const baseUrl = new URL(request.url).origin;
  const tenantId = tenant_id ?? env?.TENANT_ID ?? 'meblepumo';
  const od = zakres?.od ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const do_ = zakres?.do ?? new Date().toISOString().split('T')[0];

  try {
    // ---- 1. RAG: pobierz kontekst finansowy równolegle ----
    const [dashRes, rentRes, docsRes, costsRes] = await Promise.all([
      fetch(`${baseUrl}/api/finanse/dashboard?from=${od}&to=${do_}`).catch(() => null),
      fetch(`${baseUrl}/api/finanse/rentownosc?from=${od}&to=${do_}`).catch(() => null),
      fetch(`${baseUrl}/api/finanse/dokumenty-finansowe?ryzyko=Wysokie&limit=5`).catch(() => null),
      fetch(`${baseUrl}/api/finanse/costs?from=${od}&to=${do_}`).catch(() => null),
    ]);

    const [dashboard, rentownosc, dokumenty, costs] = await Promise.all([
      dashRes?.ok ? dashRes.json() as Promise<FinanceDashboardResponse> : Promise.resolve(null),
      rentRes?.ok ? rentRes.json() as Promise<RentownoscResponse> : Promise.resolve(null),
      docsRes?.ok ? docsRes.json() as Promise<{ items: DokumentApiItem[] }> : Promise.resolve(null),
      costsRes?.ok ? costsRes.json().catch(() => null) : Promise.resolve(null),
    ]);

    // ---- 2. Zbuduj kontekst RAG ----
    const usedSources: string[] = [];

    let ragKontekst = `KONTEKST FINANSOWY (${od} – ${do_}) dla firmy: ${tenantId}\n\n`;

    if (dashboard) {
      usedSources.push('Dashboard KPI');
      const k = (dashboard as FinanceDashboardResponse).kpi_cards;
      ragKontekst += `## DASHBOARD KPI:\n`;
      ragKontekst += `• Przychody: ${k?.total_revenue?.toLocaleString('pl-PL') ?? 0} PLN\n`;
      ragKontekst += `• Koszty: ${k?.total_costs?.toLocaleString('pl-PL') ?? 0} PLN\n`;
      ragKontekst += `• Zysk netto: ${k?.net_profit?.toLocaleString('pl-PL') ?? 0} PLN\n`;
      ragKontekst += `• Marża brutto: ${k?.gross_margin_pct ?? 0}%\n`;
      ragKontekst += `• Liczba transakcji: ${k?.total_orders ?? 0} szt.\n\n`;
    }

    if (rentownosc) {
      usedSources.push('Rentowność kategorii');
      const r = rentownosc as RentownoscResponse;
      ragKontekst += `## RENTOWNOŚĆ:\n`;
      if (r.top_margin) ragKontekst += `• Najlepsza kategoria: ${r.top_margin.category} (${r.top_margin.margin_pct}%)\n`;
      if (r.low_margin_alerts?.length) {
        ragKontekst += `• ALERTY (marża < 35%): ${r.low_margin_alerts.map((a: { category: string; margin_pct: number }) => `${a.category} ${a.margin_pct}%`).join(', ')}\n`;
      }
      ragKontekst += '\n';
    }

    if (dokumenty?.items?.length) {
      usedSources.push('Dokumenty wysokiego ryzyka');
      ragKontekst += `## DOKUMENTY WYSOKIEGO RYZYKA:\n`;
      dokumenty.items.slice(0, 4).forEach((d: DokumentApiItem) => {
        ragKontekst += `• ${d.numer} | ${d.kontrahent} | ${d.kwota_brutto?.toLocaleString('pl-PL') ?? 0} PLN | Score: ${d.ryzyko_punktowe}/100 | ${d.poziom_ryzyka}\n`;
      });
      ragKontekst += '\n';
    }

    if (costs) {
      usedSources.push('Koszty operacyjne');
      const c = costs as { kpi_cards?: { total_costs: number; marketing: number; employees: number; suppliers: number }; profitability?: { top_expensive_supplier: string } };
      if (c.kpi_cards) {
        ragKontekst += `## KOSZTY OPERACYJNE:\n`;
        ragKontekst += `• Łączne: ${c.kpi_cards.total_costs?.toLocaleString('pl-PL') ?? 0} PLN\n`;
        ragKontekst += `• Marketing: ${c.kpi_cards.marketing?.toLocaleString('pl-PL') ?? 0} PLN\n`;
        ragKontekst += `• Pracownicy: ${c.kpi_cards.employees?.toLocaleString('pl-PL') ?? 0} PLN\n`;
        ragKontekst += `• Dostawcy: ${c.kpi_cards.suppliers?.toLocaleString('pl-PL') ?? 0} PLN\n`;
        if (c.profitability?.top_expensive_supplier) {
          ragKontekst += `• Najdroższy dostawca: ${c.profitability.top_expensive_supplier}\n`;
        }
        ragKontekst += '\n';
      }
    }

    // ---- 3. Zbuduj historię sesji ----
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: FINANSE_SYSTEM_PROMPT },
    ];

    // Dodaj historię konwersacji (max 6 ostatnich wymian)
    const recentHistory = kontekst_sesji.slice(-6);
    for (const turn of recentHistory) {
      messages.push({ role: turn.rola === 'asystent' ? 'assistant' : 'user', content: turn.tresc });
    }

    // Aktualne pytanie z kontekstem RAG
    messages.push({
      role: 'user',
      content: `${ragKontekst}\n---\nPYTANIE: ${pytanie}\n\nOdpowiedz w formacie:\n1. Odpowiedź główna (analiza + liczby)\n2. Następne kroki: (lista 2-3 działań)\n3. Potrzebne akcje w systemie: (opcjonalnie)`,
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
      console.error('OpenAI error:', err);
      return Response.json({ error: 'Błąd OpenAI API', details: err }, { status: 502 });
    }

    const gptJson = await gptRes.json() as {
      choices: Array<{ message: { content: string } }>;
      usage: { total_tokens: number };
      model: string;
    };

    const rawAnswer = gptJson.choices?.[0]?.message?.content ?? '';
    const parsed = parseGptResponse(rawAnswer);

    return Response.json({
      ...parsed,
      zrodla: usedSources,
      model: gptJson.model ?? 'gpt-4o',
      tokens_uzyte: gptJson.usage?.total_tokens,
    } satisfies AsystentResponse);

  } catch (e) {
    console.error('/api/asystent-finanse error:', e);
    return Response.json(buildDemoResponse(pytanie));
  }
};
