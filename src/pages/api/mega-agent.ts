/**
 * POST /api/mega-agent
 *
 * MEGA-AGENT ORCHESTRATOR — Gemini 2.0 Flash
 * 3-fazowy routing: routing → parallel exec → aggregation
 * Koordynuje 7 specjalistów: CRM, Magazyn, SEO, Projekty, Content, Finanse, Workflow
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../lib/ai-models';

interface MegaAgentRequest {
  zadanie: string;
  modul?: string;
  kontekst?: Record<string, unknown>;
  firma_id: string;
  priority?: 'speed' | 'quality';
}

interface RoutingDecision {
  selected_agents: Array<{
    name: string;
    endpoint: string;
    reason: string;
  }>;
  reasoning: string;
  parallel: boolean;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// ─── Konfiguracja modeli ────────────────────────────────
const ROUTING_MODEL: AIModelConfig = {
  provider: 'google',
  model_id: 'gemini-2.0-flash-exp',
  nazwa_logiczna: 'MEGA_AGENT_ROUTER',
  temperature: 0.1,
  max_tokens: 500,
};

const AGGREGATION_MODEL: AIModelConfig = {
  provider: 'google',
  model_id: 'gemini-2.0-flash-exp',
  nazwa_logiczna: 'MEGA_AGENT_AGGREGATOR',
  temperature: 0.2,
  max_tokens: 3000,
};

// ─── Mapa specjalistów ──────────────────────────────────
const SPECIALISTS = [
  { name: 'CRM', endpoint: '/api/crm/ai-specialist', model: 'GPT-4o-mini', desc: 'lead scoring, pipeline, segmentacja, LTV' },
  { name: 'MAGAZYN', endpoint: '/api/magazyn/ai-specialist', model: 'Gemini Pro', desc: 'zapasy, reorder, ABC analiza, logistyka' },
  { name: 'SEO', endpoint: '/api/seo/ai-specialist', model: 'Claude Sonnet', desc: 'optymalizacja stron, keywords, GEO, Core Web Vitals' },
  { name: 'PROJEKTY', endpoint: '/api/projekty/ai-specialist', model: 'Llama 70B', desc: 'planowanie, alokacja, CPM, sprint, Gantt' },
  { name: 'CONTENT', endpoint: '/api/content/ai-specialist', model: 'Mistral Large', desc: 'copywriting, opisy produktów, blog, SEO copy' },
  { name: 'FINANSE', endpoint: '/api/finanse/ai-specialist', model: 'DeepSeek R1', desc: 'księgowość, P&L, cashflow, prognozy, VAT' },
  { name: 'WORKFLOW', endpoint: '/api/workflow/ai-specialist', model: 'Grok 4', desc: 'automatyzacje, n8n, Zapier, custom scripts' },
];

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as MegaAgentRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
      DEEPSEEK_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'DEEPSEEK_API_KEY'),
      ANTHROPIC_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'ANTHROPIC_API_KEY'),
      GROQ_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GROQ_API_KEY'),
      MISTRAL_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'MISTRAL_API_KEY'),
      XAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'XAI_API_KEY'),
    };

    const d1 = (cfEnv as Record<string, unknown>).D1 as D1Database | undefined;

    // ═══════════════════════════════════════════════════════
    // FAZA 1: ROUTING — wybór specjalistów
    // ═══════════════════════════════════════════════════════
    const specialistsList = SPECIALISTS.map(
      (s, i) => `${i + 1}. ${s.name} (${s.model}) – ${s.desc}`
    ).join('\n');

    const routingPrompt = `JESTEŚ MEGA-AGENT ROUTER. Wybierz OPTYMALNYCH agentów (1-3 max) dla zadania.

ZADANIE: "${body.zadanie}"
${body.modul ? `SUGEROWANY MODUŁ: ${body.modul}` : ''}

DOSTĘPNI AGENCI:
${specialistsList}

PRIORYTET: ${body.priority === 'quality' ? 'jakość (więcej agentów)' : 'szybkość (min agentów)'}

ODPOWIEDZ WYŁĄCZNIE w JSON:
{
  "selected_agents": [{"name": "NAZWA", "endpoint": "/api/.../ai-specialist", "reason": "dlaczego"}],
  "reasoning": "uzasadnienie wyboru",
  "parallel": true
}`;

    const routingResult = await callModel(
      ROUTING_MODEL,
      { system: 'Jesteś routerem AI. Odpowiadaj TYLKO w JSON.', user: routingPrompt },
      envKeys
    );

    // Parsowanie routing decision
    let routing: RoutingDecision;
    try {
      const jsonMatch = routingResult.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Brak JSON w odpowiedzi routera');
      routing = JSON.parse(jsonMatch[0]);
    } catch {
      // Fallback: jeśli router nie zwrócił JSON, wybierz najbardziej pasującego
      const zadanieLower = body.zadanie.toLowerCase();
      const fallbackAgent = SPECIALISTS.find((s) => {
        const keywords: Record<string, string[]> = {
          CRM: ['klient', 'lead', 'pipeline', 'crm', 'sprzedaż'],
          MAGAZYN: ['magazyn', 'zapas', 'stan', 'reorder', 'abc'],
          SEO: ['seo', 'pozycjonowanie', 'keyword', 'strona', 'meta'],
          PROJEKTY: ['projekt', 'zadani', 'sprint', 'gantt', 'zespół'],
          CONTENT: ['treść', 'opis', 'blog', 'copy', 'content'],
          FINANSE: ['finans', 'koszty', 'przychod', 'cashflow', 'vat', 'budżet'],
          WORKFLOW: ['workflow', 'automatyzac', 'n8n', 'zapier', 'webhook'],
        };
        return keywords[s.name]?.some((kw) => zadanieLower.includes(kw));
      }) || SPECIALISTS[0];

      routing = {
        selected_agents: [{ name: fallbackAgent.name, endpoint: fallbackAgent.endpoint, reason: 'Keyword match fallback' }],
        reasoning: 'Router fallback — keyword matching',
        parallel: false,
      };
    }

    // ═══════════════════════════════════════════════════════
    // FAZA 2: PARALLEL EXECUTION — wywołanie specjalistów
    // ═══════════════════════════════════════════════════════
    const baseUrl = new URL(request.url).origin;

    const agentPromises = routing.selected_agents.map(async (agent) => {
      try {
        const specialist = SPECIALISTS.find((s) => s.name === agent.name);
        if (!specialist) return { agent: agent.name, error: `Nieznany agent: ${agent.name}` };

        const res = await fetch(`${baseUrl}${specialist.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            zadanie: body.zadanie,
            firma_id: body.firma_id,
            kontekst: body.kontekst,
          }),
        });

        if (!res.ok) {
          return { agent: agent.name, error: `HTTP ${res.status}` };
        }

        return { agent: agent.name, ...(await res.json()) };
      } catch (err) {
        return { agent: agent.name, error: err instanceof Error ? err.message : 'Unknown error' };
      }
    });

    const agentResults = routing.parallel
      ? await Promise.all(agentPromises)
      : await sequentialExec(agentPromises);

    // ═══════════════════════════════════════════════════════
    // FAZA 3: AGGREGATION — synteza wyników
    // ═══════════════════════════════════════════════════════
    const aggregationPrompt = `Jesteś MEGA-AGENT AGGREGATOR. Syntetyzuj wyniki ${agentResults.length} specjalistów w jedną spójną odpowiedź.

ORYGINALNE ZADANIE: "${body.zadanie}"

WYNIKI AGENTÓW:
${agentResults.map((r) => `--- ${r.agent} ---\n${JSON.stringify(r.result || r.error || r, null, 2)}`).join('\n\n')}

INSTRUKCJE:
1. Połącz wyniki w jedną logiczną odpowiedź po polsku
2. Wyciągnij najważniejsze wnioski
3. Podsumuj rekomendacje z priorytetami
4. Wskaż konflikty między agentami (jeśli są)
5. Zaproponuj kolejne kroki

FORMAT: Czytelna odpowiedź po polsku z nagłówkami ##`;

    const aggregation = await callModel(
      AGGREGATION_MODEL,
      { system: 'Jesteś syntetyzatorem wyników multi-agent. Odpowiadaj po polsku.', user: aggregationPrompt },
      envKeys
    );

    // ─── Zapis sesji do D1 ──────────────────────────────────
    if (d1) {
      try {
        await d1
          .prepare('INSERT INTO mega_agent_sessions (firma_id, zadanie, routing, agents_used, final_answer, processing_time_ms, model_used) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(
            body.firma_id,
            body.zadanie,
            JSON.stringify(routing),
            JSON.stringify(routing.selected_agents.map((a) => a.name)),
            aggregation.text,
            Date.now() - startTime,
            ROUTING_MODEL.model_id
          )
          .run();
      } catch (saveErr) {
        console.warn('[mega-agent] Session save failed:', saveErr);
      }
    }

    return json({
      orchestrator: 'Gemini 2.0 Flash',
      routing_decision: routing,
      agents_used: routing.selected_agents.map((a) => a.name),
      agent_results: agentResults,
      final_answer: aggregation.text,
      processing_time_ms: Date.now() - startTime,
      tokens: {
        routing: routingResult.tokens_used,
        aggregation: aggregation.tokens_used,
      },
    });
  } catch (err) {
    console.error('[mega-agent]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, orchestrator: 'MEGA_AGENT' }, 500);
  }
};

// ─── Helper: sekwencyjne wykonanie ──────────────────────
async function sequentialExec<T>(promises: Promise<T>[]): Promise<T[]> {
  const results: T[] = [];
  for (const p of promises) {
    results.push(await p);
  }
  return results;
}
