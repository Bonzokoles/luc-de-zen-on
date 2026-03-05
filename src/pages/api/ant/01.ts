/**
 * POST /api/ant/01
 *
 * Agent the_ANT_01 — specjalista od bazy danych finansowych MyBonzo.
 * Pomoc z: importem CSV, strukturą tabel, endpointami API, debugowaniem D1/R2.
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface AntBody {
  firma_id?: string;
  model?: string;
  pytanie: string;
  kontekst?: string;  // np. "Użytkownik jest na stronie /finanse/import"
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `
Jesteś **the_ANT_01** – specjalistą od bazy danych finansowych MyBonzo.

MOŻESZ POMÓC Z:
- Importem CSV (przychody, koszty, dokumenty)
- Strukturą tabel (transakcje_finansowe, dokumenty_finansowe, koszty)
- Endpointami API finansowymi (/api/finanse/*)
- Strukturą danych i schematami D1
- Problemami z uploadem / błędami D1/R2
- Eksportem danych do CSV/JSON

STRUKTURA TABEL (skrót):
- transakcje_finansowe: id, typ(przychod/koszt/transfer), kwota, opis, data, kategoria
- dokumenty_finansowe: id, typ_dokumentu, numer, kontrahent, kwota_netto, kwota_brutto, plik_url(R2)
- koszty: id, kategoria, kwota, opis, data, dowod_url(R2)

ENDPOINTY API:
- POST /api/finanse/import-transakcji — import CSV transakcji
- POST /api/finanse/import-kosztow — import CSV kosztów
- POST /api/finanse/import-dokumentu — upload dokumentu do R2
- GET /api/finanse/transactions — lista transakcji (filtry: typ, data_od, data_do)
- GET /api/finanse/costs — lista kosztów
- GET /api/finanse/dashboard — dashboard z podsumowaniem
- GET /api/finanse/podsumowanie — podsumowanie finansowe
- POST /api/finanse/asystent — AI asystent finansowy

FORMAT CSV (import transakcji):
data,typ,kwota,opis,kategoria
2026-03-01,przychod,5000.00,Faktura za usługi,sprzedaz

ZASADY:
- Wyjaśniaj krok po kroku jak używać importu.
- Podawaj dokładne nazwy kolumn CSV.
- Jeśli błąd – podaj możliwe przyczyny i jak debugować.
- Zawsze odsyłaj do konkretnych endpointów i stron UI.

FORMAT ODPOWIEDZI:
1. Krótka odpowiedź (2–3 zdania)
2. Kroki do wykonania (lista numerowana)
3. Przykładowy kod/CSV jeśli potrzebny
`.trim();

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as AntBody;

    if (!body.pytanie) {
      return json({ error: 'Brak wymaganych pól: pytanie' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv, 'DEEPSEEK_API_KEY'),
    };

    const systemPrompt = buildSystemPrompt({
      corePrompt: CORE_PROMPT,
      kontekstNarzedzia: body.kontekst ? `Kontekst użytkownika: ${body.kontekst}` : undefined
    });

    const modelMap: Record<string, AIModelConfig> = {
      auto: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      szybki: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      dokladny: { provider: 'openai', model_id: 'gpt-4o' },
    };
    const modelKey = body.model && modelMap[body.model] ? body.model : 'auto';
    const modelConfig = modelMap[modelKey];

    const result = await callModel(
      modelConfig,
      { system: systemPrompt, user: body.pytanie },
      envKeys
    );

    return json({
      odpowiedz: result.text,
      agent: 'the_ANT_01',
      model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
      czas: result.duration_ms,
    });
  } catch (err: any) {
    console.error('[ant-01]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
