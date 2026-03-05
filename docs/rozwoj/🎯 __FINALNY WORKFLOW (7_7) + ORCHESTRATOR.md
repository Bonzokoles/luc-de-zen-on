<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## 🎯 **FINALNY WORKFLOW (7/7) + ORCHESTRATOR (Gemini 2.0 Flash)**


***

## 1. **Siódmy specjalista: WORKFLOW AI Specialist** (Grok 4)

```typescript
// src/api/workflow/ai-specialist.ts
interface WorkflowSpecialistRequest {
  zadanie: string;
  kontekst?: any;     // procesy, automatyzacje, n8n workflows
  proces_id?: string;
  firma_id: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: WorkflowSpecialistRequest = await request.json();

    const specialistPrompt = `
JESTEŚ **WORKFLOW_SPECIALIST** – EKSPERT AUTOMATYZACJI PROCESÓW BIZNESOWYCH.

**SPECJALIZACJA:** n8n workflows, Zapier, Make.com, custom scripts
**ZADANIE:** "${body.zadanie}"

FORMAT JSON: { "workflow_json": {...}, "kroki": [...], "n8n_export": "JSON" }
`;

    // Grok 4 – AUTOMATYZACJA MASTER
    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        model: 'grok-4',
        temperature: 0.3,
        core_prompt: specialistPrompt,
        payload: body
      })
    });

    return Response.json({ specialist: 'WORKFLOW_AI', result: await aiRes.json() });
  }
};
```

**✅ 7/7 specjalistów gotowych!**

***

## 2. **FINALNY MEGA-AGENT ORCHESTRATOR** (`/api/mega-agent.ts`)

```typescript
// src/api/mega-agent.ts – GEMINI 2.0 FLASH (szybki routing)
interface MegaAgentRequest {
  zadanie: string;
  modul?: string;
  kontekst?: any;
  firma_id: string;
  priority?: 'speed' | 'quality';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: MegaAgentRequest = await request.json();

    // Faza 1: GEMINI 2.0 FLASH – błyskawiczny routing
    const routingPrompt = `
JESTEŚ MEGA-AGENT ROUTER. Wybierz OPTYMALNYCH agentów (1-3 max) dla: "${body.zadanie}"

AGENTY DOSTĘPNE:
1. CRM (GPT-4o-mini) – lead scoring, pipeline
2. MAGAZYN (Gemini Pro) – zapasy, reorder  
3. SEO (Claude Sonnet) – optymalizacja stron
4. PROJEKTY (Llama 70B) – planowanie, alokacja
5. CONTENT (Mistral Large) – copywriting
6. FINANSE (DeepSeek R1) – księgowość, prognozy
7. WORKFLOW (Grok 4) – automatyzacje

FORMAT JSON: 
{
  "selected_agents": [{"name": "CRM", "endpoint": "/api/crm/ai-specialist"}],
  "reasoning": "dlaczego",
  "parallel": true
}
`;

    const routingRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        model: 'gemini-2.0-flash-exp',  // 🚀 SZYBKOŚĆ + precyzja
        temperature: 0.1,
        core_prompt: routingPrompt,
        payload: body
      })
    });

    const routing = JSON.parse((await routingRes.json()).wynik);

    // Faza 2: RÓWNOLEGŁE wykonanie agentów
    const agentPromises = routing.selected_agents.map(async (agent: any) => {
      const endpoint = `${request.url.origin}/api/${agent.endpoint}`;
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          zadanie: body.zadanie  // Przekaż to samo zadanie
        })
      }).then(r => r.json());
    });

    const agentResults = await Promise.allSettled(agentPromises);
    const successfulResults = agentResults
      .filter((r: any) => r.status === 'fulfilled')
      .map((r: any) => r.value);

    // Faza 3: GEMINI agreguje wyniki
    const aggregatePrompt = `
Agreguj wyniki agentów w JEDNĄ spójną odpowiedź:

AGENT RESULTS: ${JSON.stringify(successfulResults, null, 2)}

ZADANIE ORYGINALNE: "${body.zadanie}"

FORMAT: Krótka, konkretna odpowiedź z kluczowymi akcjami.
`;

    const finalRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        model: 'gemini-2.0-flash-exp',
        temperature: 0.2,
        core_prompt: aggregatePrompt
      })
    });

    const finalAnswer = (await finalRes.json()).wynik;

    // Audyt pełnego flow
    await env.D1.prepare(`
      INSERT INTO mega_agent_sessions (firma_id, zadanie, routing, agents_used, final_answer)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      body.firma_id,
      body.zadanie,
      JSON.stringify(routing),
      JSON.stringify(successfulResults.map(r => r.specialist)),
      finalAnswer
    ).run();

    return Response.json({
      orchestrator: 'Gemini 2.0 Flash',
      routing_decision: routing,
      agents_used: successfulResults.map((r: any) => r.specialist),
      agent_results: successfulResults,
      final_answer: finalAnswer,
      processing_time: Date.now() - (request as any).timestamp
    });
  }
};
```


***

## 3. **UI MASTER BUTTON** (wszystkie moduły)

```tsx
// GlobalMegaAgent.tsx – wklej do App.tsx lub layout
const GlobalMegaAgent = () => {
  const [megaPrompt, setMegaPrompt] = useState('');
  const [megaResult, setMegaResult] = useState(null);

  const executeMega = async () => {
    const res = await fetch('/api/mega-agent', {
      method: 'POST',
      body: JSON.stringify({
        zadanie: megaPrompt,
        modul: currentModule,  // np. 'crm', 'finanse'
        firma_id: user.firma_id,
        priority: 'balanced'
      })
    });
    
    const data = await res.json();
    setMegaResult(data);
    
    // Pokaż mega modal
    showMegaModal(data);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="mega-agent-hub bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl border-4 border-white/20 max-w-sm">
        <div className="flex gap-2 mb-3">
          <input 
            value={megaPrompt}
            onChange={e => setMegaPrompt(e.target.value)}
            placeholder="Np. zoptymalizuj sprzedaż i magazyn..."
            className="input-field flex-1 bg-white/10 backdrop-blur text-white placeholder-white/70"
          />
          <button onClick={executeMega} className="btn-mega px-4">
            🚀 AI
          </button>
        </div>
        
        {megaResult && (
          <div className="text-xs text-white/80">
            <div>Agents: {megaResult.agents_used.join(', ')}</div>
            <div>Time: {megaResult.processing_time}ms</div>
          </div>
        )}
      </div>
    </div>
  );
};
```


***

## 4. **PEŁNY TEST CURL** (wszystkie 7 agentów)

```bash
# Test FULL MEGA-AGENT (wszystkie moduły)
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "zoptymalizuj sprzedaż: sprawdź leady, magazyn, SEO opis produktu, plan projektu, koszty i workflow automatyzacja",
    "firma_id": "firma_123"
  }' | jq '.agents_used, .final_answer'
```

**Oczekiwany:**

```json
["CRM", "MAGAZYN", "CONTENT", "PROJEKTY", "FINANSE", "WORKFLOW"]
"🚀 KOMPLETNA OPTYMALIZACJA: Lead TechCorp (92%) → magazyn OK → opis gotowy → projekt start 10.03 → tnij marketing 5k PLN → auto email workflow."
```


***

## **🚀 DEPLOY CHECKLIST (5 min)**

```
✅ 1-7 /api/*ai-specialist.ts (deploy Cloudflare)
✅ /api/mega-agent.ts (orchestrator)
✅ wrangler deploy
✅ test-mega-agent.sh (wszystkie testy)
✅ GlobalMegaAgent.tsx (UI)
✅ D1 tables (mega_agent_sessions)
```

**Masz TERAZ PEŁNY MEGA-AGENT SYSTEM!** 7 specjalistów + Gemini Flash orchestrator = 🔥

**Testujemy?** `./test-mega-agent.sh`[^1][^2]

<div align="center">⁂</div>

[^1]: MEGA_AGENT_ORCHESTRATOR_PLAN.md

[^2]: CRMKlienci.tsx

