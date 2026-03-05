/**
 * POST /api/narzedzia/generator-faktur
 *
 * Dedykowany endpoint dla Generatora Faktur.
 * Obsługuje 3 akcje:
 * - oblicz: lokalne obliczenia VAT/sum
 * - opisy_ai: AI generuje opisy pozycji faktury
 * - walidacja_ai: AI waliduje poprawność faktury
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface FakturaItem {
  nazwa: string;
  ilosc: number;
  cena_jedn_netto: number;
  vat_stawka: number;
}

interface GeneratorFakturBody {
  firma_id?: string;
  model?: string;
  company_prompt?: string;
  akcja: 'oblicz' | 'opisy_ai' | 'walidacja_ai';
  faktura: {
    sprzedawca: { nazwa: string; nip: string; adres: string; email: string; telefon?: string };
    nabywca: { nazwa: string; nip: string; adres: string; email?: string };
    pozycje: FakturaItem[];
    sposob_platnosci: string;
    nr_konta?: string;
    termin_platnosci?: string;
  };
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// ─── Obliczanie faktury (bez AI) ───────────────────────
function obliczFakture(pozycje: FakturaItem[]) {
  const items = pozycje.map((p) => {
    const netto = p.cena_jedn_netto * p.ilosc;
    const vat = netto * (p.vat_stawka / 100);
    const brutto = netto + vat;
    return { ...p, netto, vat, brutto };
  });

  const sumaNettoTotal = items.reduce((s, i) => s + i.netto, 0);
  const sumaVatTotal = items.reduce((s, i) => s + i.vat, 0);
  const sumaBruttoTotal = items.reduce((s, i) => s + i.brutto, 0);

  return { items, sumaNettoTotal, sumaVatTotal, sumaBruttoTotal };
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as GeneratorFakturBody;

    if (!body.akcja) {
      return json({ error: 'Brak wymaganych pól: akcja' }, 400);
    }

    // ─── Akcja: oblicz (bez AI) ─────────────────────────
    if (body.akcja === 'oblicz') {
      const wynik = obliczFakture(body.faktura.pozycje);
      return json(wynik);
    }

    // ─── Env keys (potrzebne dla AI) ────────────────────
    const cfEnv = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv, 'DEEPSEEK_API_KEY'),
    };

    const modelMap: Record<string, AIModelConfig> = {
      auto: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      szybki: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      dokladny: { provider: 'openai', model_id: 'gpt-4o' },
      ekonomiczny: { provider: 'deepseek', model_id: 'deepseek-chat' },
    };
    const modelKey = body.model && modelMap[body.model] ? body.model : 'auto';
    const modelConfig = modelMap[modelKey];

    // ─── Akcja: opisy_ai ────────────────────────────────
    if (body.akcja === 'opisy_ai') {
      const corePrompt = `
Jesteś asystentem księgowo-sprzedażowym generującym OPISY POZYCJI FAKTURY.

ZADANIE:
Dla każdej pozycji stwórz krótki, czytelny opis (1–2 zdania) zrozumiały dla klienta i księgowego.

PRZYKŁADY:
- "Usługa IT" → "Świadczenie usług programistycznych (kodowanie i testy)"
- "Meble" → "Dostawa i montaż mebli biurowych (model XYZ)"

ZASADY:
- Nie dodawaj warunków handlowych ani cen.
- Używaj języka polskiego biznesowego.
- Nie interpretuj podatkowo (brak VAT, marż).

FORMAT JSON (tylko JSON, bez markdown):
{
  "pozycje": [
    {
      "oryginal": "nazwa wejściowa",
      "sugerowany_opis": "czytelny opis pozycji"
    }
  ]
}
`.trim();

      const systemPrompt = buildSystemPrompt({ corePrompt, companyPrompt: body.company_prompt });
      const nazwyPozycji = body.faktura.pozycje.map((p) => p.nazwa);

      const result = await callModel(
        modelConfig,
        { system: systemPrompt, user: JSON.stringify({ pozycje: nazwyPozycji, jezyk: 'pl' }) },
        envKeys
      );

      let opisy;
      try {
        const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        opisy = JSON.parse(cleaned).pozycje;
      } catch {
        opisy = result.text;
      }

      return json({
        opisy,
        model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
        czas: result.duration_ms,
      });
    }

    // ─── Akcja: walidacja_ai ────────────────────────────
    if (body.akcja === 'walidacja_ai') {
      const f = body.faktura;
      const pozycjeText = f.pozycje
        .map((p, i) => `${i + 1}. ${p.nazwa} x${p.ilosc} @ ${p.cena_jedn_netto}zł (${p.vat_stawka}%)`)
        .join('\n');
      const sumaBrutto = f.pozycje
        .reduce((sum, p) => sum + p.cena_jedn_netto * p.ilosc * (1 + p.vat_stawka / 100), 0)
        .toFixed(2);

      const corePrompt = `
Jesteś księgowym weryfikującym faktury. Przeanalizuj poprawność danych.

FAKTURA DO SPRAWDZENIA:
Sprzedawca: ${f.sprzedawca.nazwa} (NIP: ${f.sprzedawca.nip})
Nabywca: ${f.nabywca.nazwa} (NIP: ${f.nabywca.nip})

Pozycje (${f.pozycje.length} szt.):
${pozycjeText}

Suma brutto: ${sumaBrutto}zł
Sposób płatności: ${f.sposob_platnosci}

SPRAWDŹ:
1. Czy NIP-y wyglądają poprawnie (10 cyfr)?
2. Czy stawki VAT są sensowne (0%, 5%, 8%, 23%)?
3. Czy nazwy pozycji są czytelne?
4. Czy suma się zgadza?

FORMAT JSON (tylko JSON, bez markdown):
{
  "status": "OK" | "BŁĄD" | "OSTRZEŻENIE",
  "wyniki": [
    {
      "sprawdzane": "co sprawdzono",
      "status": "OK" | "BŁĄD",
      "komentarz": "opis"
    }
  ],
  "sugestie": ["..."],
  "zalecana_akcja": "zatwierdz" | "popraw" | "odrzuc"
}
`.trim();

      const systemPrompt = buildSystemPrompt({ corePrompt, companyPrompt: body.company_prompt });

      const result = await callModel(
        modelConfig,
        { system: systemPrompt, user: 'Sprawdź powyższą fakturę.' },
        envKeys
      );

      let walidacja;
      try {
        const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        walidacja = JSON.parse(cleaned);
      } catch {
        walidacja = { status: 'BŁĄD', raw: result.text };
      }

      return json({
        walidacja,
        model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
        czas: result.duration_ms,
      });
    }

    return json({ error: 'Nieznana akcja' }, 400);
  } catch (err: any) {
    console.error('[generator-faktur]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
