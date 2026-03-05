/**
 * POST /api/workflow/ai-specialist
 *
 * Workflow AI Specialist — Grok 4 (xAI)
 * n8n workflows, automatyzacja procesów, Zapier/Make.com, custom scripts
 */
import type { APIRoute } from 'astro';
import { callModel, getEnvKey, type AIEnvKeys, type AIModelConfig } from '../../../lib/ai-models';
import { buildSystemPrompt } from '../../../lib/ai-prompts';

interface WorkflowSpecialistRequest {
  zadanie: string;
  kontekst?: Record<string, unknown>;
  proces_id?: string;
  firma_id: string;
  company_prompt?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const CORE_PROMPT = `JESTEŚ **WORKFLOW_SPECIALIST** – EKSPERT AUTOMATYZACJI PROCESÓW BIZNESOWYCH.

**SPECJALIZACJA:**
• n8n workflows — generowanie workflow JSON
• Zapier / Make.com — rekomendacje integracji
• Custom scripts — Cloudflare Workers, cron jobs
• Automatyzacja email, CRM, fakturowanie
• Webhook-based event processing
• ETL pipelines (import → transform → load)

**INSTRUKCJE:**
- Generuj gotowe n8n workflow JSON (nodes, connections, parameters)
- Dla każdego workflow opisz: trigger → action → output
- Podaj szacowany czas oszczędzony przez automatyzację
- Uwzględnij error handling i retry logic
- Proponuj monitoring (Slack/email alerts)

**FORMAT ODPOWIEDZI (JSON):**
{
  "workflow_name": "nazwa_automatyzacji",
  "workflow_json": {
    "nodes": [
      {"type": "n8n-nodes-base.webhook", "name": "Trigger", "parameters": {}},
      {"type": "n8n-nodes-base.httpRequest", "name": "Action", "parameters": {}}
    ],
    "connections": {}
  },
  "kroki": ["1. Ustaw webhook na...", "2. Skonfiguruj...", "3. Testuj..."],
  "oszczednosc_czasu": "~5h/tydzień",
  "n8n_export": "gotowy JSON do importu",
  "rekomendacje": ["Dodaj alert Slack", "Monitoruj błędy"]
}`.trim();

const MODEL_CONFIG: AIModelConfig = {
  provider: 'xai',
  model_id: 'grok-4',
  nazwa_logiczna: 'WORKFLOW_SPECIALIST',
  temperature: 0.3,
};

export const POST: APIRoute = async ({ request, locals }) => {
  const startTime = Date.now();

  try {
    const body = (await request.json()) as WorkflowSpecialistRequest;

    if (!body.zadanie || !body.firma_id) {
      return json({ error: 'Brak wymaganych pól: zadanie, firma_id' }, 400);
    }

    const cfEnv = (locals.runtime?.env || {}) as Record<string, unknown>;
    const envKeys: AIEnvKeys = {
      XAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'XAI_API_KEY'),
      GOOGLE_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'GOOGLE_API_KEY'),
      OPENAI_API_KEY: getEnvKey(cfEnv as Record<string, string | undefined>, 'OPENAI_API_KEY'),
    };

    const systemPrompt = buildSystemPrompt({
      corePrompt: CORE_PROMPT,
      companyPrompt: body.company_prompt,
      kontekstNarzedzia: body.kontekst ? JSON.stringify(body.kontekst) : undefined,
    });

    const userPrompt = JSON.stringify({
      zadanie: body.zadanie,
      kontekst: body.kontekst || {},
      proces_id: body.proces_id,
    });

    // ─── Fallback: jeśli brak xAI, użyj Google ─────────────
    let modelConfig = MODEL_CONFIG;
    if (!envKeys.XAI_API_KEY) {
      modelConfig = { ...MODEL_CONFIG, provider: 'google', model_id: 'gemini-2.5-flash' };
    }

    const result = await callModel(modelConfig, { system: systemPrompt, user: userPrompt }, envKeys);

    let parsedResult: unknown = result.text;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch { /* fallback */ }

    return json({
      specialist: 'WORKFLOW_AI_SPECIALIST',
      model_used: modelConfig.model_id,
      result: parsedResult,
      raw_ai: result.text,
      processing_time_ms: Date.now() - startTime,
      tokens: result.tokens_used,
    });
  } catch (err) {
    console.error('[workflow/ai-specialist]', err);
    const message = err instanceof Error ? err.message : 'Nieznany błąd';
    return json({ error: message, specialist: 'WORKFLOW_AI_SPECIALIST' }, 500);
  }
};
