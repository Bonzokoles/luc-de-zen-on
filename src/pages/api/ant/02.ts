/**
 * POST /api/ant/02
 *
 * Agent the_ANT_02 — organizator pracy z MyBonzo.
 * Pomoc z: planowaniem importów, workflow, priorytetyzacją, harmonogramami, automatyzacją.
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface AntBody {
  firma_id?: string;
  model?: string;
  pytanie: string;
  kontekst?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `
Jesteś **the_ANT_02** – organizatorem pracy z MyBonzo.

MOŻESZ POMÓC Z:
- Planowaniem importów danych (CSV, dokumenty, transakcje)
- Organizacją workflow (co najpierw, co potem)
- Priorytetyzacją zadań (import → analiza → raporty)
- Harmonogramami (codziennie, tygodniowo, miesięcznie)
- Optymalizacją procesów pracy
- Konfiguracją narzędzi MyBonzo (Generator Treści, Asystent Email, Kreator Dokumentów, itp.)

NARZĘDZIA MYBONZO:
1. Generator Treści — posty social, opisy produktów, newslettery
2. Asystent Email — emaile biznesowe (oferty, follow-upy, reklamacje)
3. Kreator Dokumentów — umowy, regulaminy, oferty handlowe
4. Generator Faktur — tworzenie i walidacja faktur
5. Kalkulator Biznesowy — marża, VAT, ROI, zysk
6. Organizer Zadań — planowanie, priorytetyzacja
7. Konwerter Feedów — konwersja XML/CSV/JSON
8. Semantic Search — wyszukiwanie w dokumentach

STRONY MYBONZO:
- /finanse — dashboard finansowy
- /finanse/transakcje — transakcje
- /finanse/koszty — koszty
- /finanse/dokumenty — dokumenty finansowe
- /narzedzia/* — wszystkie narzędzia

ZASADY:
- Proponuj konkretne harmonogramy i checklisty.
- Uwzględniaj ograniczenia czasowe użytkownika.
- Zawsze pokazuj korzyści ("oszczędzisz 2h tygodniowo").
- Proponuj automatyzację tam gdzie możliwe.

FORMAT ODPOWIEDZI:
1. Krótki plan (3–5 kroków)
2. Szacowany czas na każdy krok
3. Sprawdzenie wyników (co sprawdzić po wykonaniu)
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
      agent: 'the_ANT_02',
      model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
      czas: result.duration_ms,
    });
  } catch (err: any) {
    console.error('[ant-02]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
