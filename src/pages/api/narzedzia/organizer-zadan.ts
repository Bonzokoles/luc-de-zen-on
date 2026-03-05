/**
 * POST /api/narzedzia/organizer-zadan
 *
 * Dedykowany endpoint dla Organizera Zadań.
 * Akcje: rozbij_na_zadania, priorytetyzuj, planuj_tydzien
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface OrganizerBody {
  firma_id?: string;
  model?: string;
  company_prompt?: string;
  akcja: 'rozbij_na_zadania' | 'priorytetyzuj' | 'planuj_tydzien';
  opis: string;
  ramy_czasowe?: string;
  istniejace_zadania?: Array<{ title: string; priority?: string; completed?: boolean }>;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as OrganizerBody;

    if (!body.akcja) {
      return json({ error: 'Brak wymaganych pól: akcja' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, string | undefined>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv, 'DEEPSEEK_API_KEY'),
    };

    let corePrompt = '';

    switch (body.akcja) {
      case 'rozbij_na_zadania':
        corePrompt = `
Jesteś asystentem produktywności. ROZBIJ opis na konkretne zadania.

OPIS: ${body.opis}
RAMY CZASOWE: ${body.ramy_czasowe || 'brak'}

ZASADY:
- Stwórz 3–8 zadań z listy.
- Każde zadanie: krótki tytuł (max 1 linia), priorytet (wysoki/średni/niski), termin (jeśli podano ramy).
- Nie wymyślaj rzeczy spoza opisu.

FORMAT JSON (tylko JSON, bez markdown):
[
  {
    "title": "Konkretne zadanie",
    "priority": "wysoki",
    "dueDate": "2026-03-10"
  }
]
`;
        break;

      case 'priorytetyzuj':
        corePrompt = `
Jesteś menedżerem projektów. PRIORYTETYZUJ listę zadań.

ZADANIA: ${JSON.stringify(body.istniejace_zadania, null, 2)}

ZASADY:
- Oceń każde zadanie pod kątem wpływu biznesowego i pilności.
- Zaproponuj kolejność wykonania.
- Dodaj uzasadnienie dla top 3.

FORMAT JSON (tylko JSON, bez markdown):
{
  "posortowane": [{"title": "...", "priority": "..."}],
  "top3": ["zadanie1", "zadanie2", "zadanie3"],
  "uzasadnienie": "krótki opis dlaczego ta kolejność"
}
`;
        break;

      case 'planuj_tydzien':
        corePrompt = `
Jesteś organizatorem pracy. STWÓRZ plan tygodnia.

CELE: ${body.opis}
RAMY: ${body.ramy_czasowe || 'ten tydzień'}
${body.istniejace_zadania?.length ? `ISTNIEJĄCE ZADANIA:\n${body.istniejace_zadania.map(t => `- ${t.title} (${t.priority || 'brak priorytetu'})`).join('\n')}` : ''}

ZASADY:
- Podziel tydzień na dni (poniedziałek → piątek).
- Maks 3–5 zadań dziennie.
- Uwzględnij spotkania, importy danych, analizy.

FORMAT:
**Plan tygodnia:**
- Poniedziałek: zadanie1, zadanie2
- Wtorek: ...
- Środa: ...
- Czwartek: ...
- Piątek: ...
`;
        break;
    }

    const systemPrompt = buildSystemPrompt({ corePrompt, companyPrompt: body.company_prompt });

    const modelMap: Record<string, AIModelConfig> = {
      auto: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      szybki: { provider: 'google', model_id: 'gemini-2.5-flash-preview-05-20' },
      dokladny: { provider: 'openai', model_id: 'gpt-4o' },
      ekonomiczny: { provider: 'deepseek', model_id: 'deepseek-chat' },
    };
    const modelKey = body.model && modelMap[body.model] ? body.model : 'auto';
    const modelConfig = modelMap[modelKey];

    const result = await callModel(
      modelConfig,
      { system: systemPrompt, user: body.opis || JSON.stringify(body.istniejace_zadania) },
      envKeys
    );

    // Parsuj JSON dla rozbij i priorytetyzuj
    let wynik: unknown = result.text;
    if (body.akcja === 'rozbij_na_zadania' || body.akcja === 'priorytetyzuj') {
      try {
        const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        wynik = JSON.parse(cleaned);
      } catch {
        // fallback do raw text
      }
    }

    return json({
      wynik,
      model_uzyty: { ...modelConfig, nazwa_logiczna: modelKey },
      czas: result.duration_ms,
      tokeny: result.tokens_used,
    });
  } catch (err: any) {
    console.error('[organizer-zadan]', err);
    return json({ error: err.message || 'Błąd serwera' }, 500);
  }
};
