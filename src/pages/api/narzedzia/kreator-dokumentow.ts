/**
 * POST /api/narzedzia/kreator-dokumentow
 *
 * Dedykowany endpoint dla Kreatora Dokumentów.
 * Generuje szablony dokumentów biznesowych (umowy, regulaminy, oferty).
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface KreatorDokumentowBody {
  firma_id?: string;
  model?: string;
  company_prompt?: string;
  rodzaj: string;              // umowa_uslug, umowa_sprzedazy, umowa_zlecenia, regulamin, polityka_prywatnosci, oferta
  poziom_szczegolowosci: string; // prosty, sredni, pelny
  jezyk?: string;
  dane: {
    strona_A?: string;
    strona_B?: string;
    przedmiot: string;
    okres?: string;
    wynagrodzenie?: string;
    miejsce?: string;
    inne_punkty?: string[];
  };
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as KreatorDokumentowBody;

    if (!body.rodzaj || !body.dane?.przedmiot) {
      return json({ error: 'Brak wymaganych pól: rodzaj, dane.przedmiot' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv, 'DEEPSEEK_API_KEY'),
    };

    const corePrompt = `
Jesteś asystentem prawnym generującym SZABLONY dokumentów biznesowych.

RODZAJ DOKUMENTU: ${body.rodzaj}
POZIOM SZCZEGÓŁOWOŚCI: ${body.poziom_szczegolowosci}

DANE:
${JSON.stringify(body.dane, null, 2)}

ZASADY:
- Twórz SZABLONY do dalszej edycji, NIE gotowe dokumenty prawne.
- Na początku dodaj OSTRZEŻENIE: "Ten dokument jest szablonem wygenerowanym przez AI. Przed użyciem skonsultuj z prawnikiem."
- Struktura: Strony, Przedmiot, Wynagrodzenie/Cena, Obowiązki stron, Termin, Odpowiedzialność, Postanowienia końcowe.
- Gdzie brakuje danych: wstaw [UZUPEŁNIJ: ...].
- Język: ${body.jezyk || 'pl'} (polski standard biznesowy).

FORMAT:
Zwróć pełny tekst dokumentu z paragrafami i numeracją §1, §2 itd.
Bez dodatkowych komentarzy poza ostrzeżeniem na górze.
`.trim();

    const systemPrompt = buildSystemPrompt({ corePrompt, companyPrompt: body.company_prompt });

    // GPT-4o jest lepszy dla precyzji prawniczej
    const modelMap: Record<string, AIModelConfig> = {
      auto: { provider: 'openai', model_id: 'gpt-4o' },
      szybki: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      dokladny: { provider: 'openai', model_id: 'gpt-4o' },
      ekonomiczny: { provider: 'deepseek', model_id: 'deepseek-chat' },
    };

    const modelKey = body.model && modelMap[body.model] ? body.model : 'auto';
    const modelConfig = modelMap[modelKey];

    const result = await callModel(
      modelConfig,
      { system: systemPrompt, user: JSON.stringify(body.dane) },
      envKeys
    );

    return json({
      dokument: result.text,
      model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
      czas: result.duration_ms,
      tokeny: result.tokens_used,
      ostrzezenie: 'Ten dokument jest szablonem AI. Skonsultuj z prawnikiem przed użyciem.',
    });
  } catch (err: any) {
    console.error('[kreator-dokumentow]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
