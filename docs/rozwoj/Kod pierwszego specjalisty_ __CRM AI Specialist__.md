<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Kod pierwszego specjalisty: **CRM AI Specialist** + testy


***

## 1. `/api/crm/ai-specialist.ts` – kompletny kod

```typescript
// src/api/crm/ai-specialist.ts
interface Env {
  D1: D1Database;
}

interface CrmSpecialistRequest {
  zadanie: string;
  kontekst?: any;     // dane klienta, pipeline itp.
  klient_id?: string;
  firma_id: string;
  company_prompt?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: CrmSpecialistRequest = await request.json();

    // Faza 1: Pobierz kontekst z bazy (jeśli klient_id)
    let enrichedContext = body.kontekst || {};
    if (body.klient_id) {
      const klient = await env.D1.prepare(`
        SELECT * FROM klienci WHERE id = ? AND firma_id = ?
      `).bind(body.klient_id, body.firma_id).first();

      const interakcje = await env.D1.prepare(`
        SELECT typ, opis, data, wynik 
        FROM interakcje_klientow 
        WHERE klient_id = ? ORDER BY data DESC LIMIT 5
      `).bind(body.klient_id).all();

      enrichedContext = {
        klient,
        ostatnie_interakcje: interakcje.results,
        ...body.kontekst
      };
    }

    // Faza 2: Specjalistyczny prompt CRM
    const specialistPrompt = `
JESTEŚ **CRM_SPECIALIST** – NAJLEPSZYM EKSPERTEM ZARZĄDZANIA KLIENTAMI B2B.

**TWOJA SPECJALIZACJA (rób TYLKO to):**
• Lead scoring (0-100) + uzasadnienie
• Analiza pipeline i prognozowanie
• Rekomendacje next steps (max 3 konkretne)
• Personalizacja ofert/comms
• Segmentacja klientów
• Lifetime Value (LTV) szacunek

**ZADANIE:** "${body.zadanie}"

**KONTEKST:**
${JSON.stringify(enrichedContext, null, 2)}

**INSTRUKCJE:**
- Zawsze dawaj konkretne liczby (score, LTV, szansa %)
- Next steps: kto, kiedy, co powiedzieć
- Uzasadnij decyzje danymi z kontekstu
- Krótkie, konkretne odpowiedzi

**FORMAT JSON:**
{
  "crm_score": 0-100,
  "ltv_szacunek": 0,
  "szansa_sprzedazy": "%",
  "rekomendacje": [
    "KROK 1: co zrobić (kto, kiedy)",
    "KROK 2: ...",
    "KROK 3: ..."
  ],
  "uzasadnienie": "dlaczego te rekomendacje",
  "segment": "lead/gorący klient/VIP"
}
`;

    // Faza 3: Wywołaj dedykowany model
    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'crm_ai_specialist',
        model: 'gpt-4o-mini',  // OPTYMALNY dla CRM
        temperature: 0.3,      // precyzja > kreatywność
        core_prompt: specialistPrompt,
        company_prompt: body.company_prompt || '',
        payload: {
          zadanie: body.zadanie,
          kontekst: enrichedContext
        }
      })
    });

    const data = await aiRes.json();
    const result = JSON.parse(data.wynik);

    // Faza 4: Opcjonalnie zapisz do bazy (audyt)
    await env.D1.prepare(`
      INSERT INTO crm_ai_sessions (firma_id, zadanie, wynik, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(
      body.firma_id, body.zadanie, JSON.stringify(result),
      new Date().toISOString()
    ).run();

    return Response.json({
      specialist: 'CRM_AI_SPECIALIST',
      model_used: 'gpt-4o-mini',
      result,
      raw_ai: data.wynik,
      context_enriched: enrichedContext
    });
  }
};
```


***

## 2. Testy curl – krok po kroku

### **Test 1: Prosty routing (bez kontekstu)**

```bash
curl -X POST http://localhost:8787/api/mega-agent \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "jaki klient ma największą szansę sprzedaży?",
    "moduł": "crm"
  }'
```

**Oczekiwany wynik:**

```json
{
  "orchestrator": "Gemini 2.0 Flash",
  "decision": {
    "selected_agents": [{"name": "CRM_AGENT", "endpoint": "/api/crm/ai-specialist"}],
    "reasoning": "Zadanie dotyczy szansy sprzedaży → CRM specialist",
    "confidence": 98
  },
  "final_answer": "Klient X: 92% szansy, LTV 45k PLN"
}
```


### **Test 2: Z kontekstem (klient_id)**

```bash
curl -X POST http://localhost:8787/api/mega-agent \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "analizuj tego klienta i zaproponuj next steps",
    "moduł": "crm",
    "kontekst": {"klient_id": "klient_123"}
  }'
```

**Co się dzieje:**

1. Gemini Flash → wybiera CRM_AGENT
2. CRM Specialist → pobiera z D1: klient + 5 interakcji
3. GPT-4o-mini → lead score + rekomendacje
4. Gemini agreguje → final answer

### **Test 3: Złożone zadanie (multi-agent)**

```bash
curl -X POST http://localhost:8787/api/mega-agent \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "klient X chce projekt, sprawdź magazyn i zaproponuj ofertę",
    "moduł": "crm"
  }'
```

**Wynik:**

```json
{
  "selected_agents": [
    {"name": "CRM_AGENT", "model": "gpt-4o-mini"},
    {"name": "MAGAZYN_AGENT", "model": "gemini-1.5-pro"}
  ],
  "final_answer": "Klient gorący (92%). Projekt możliwy, ale brak 2 produktów w magazynie."
}
```


***

## 3. **Szybkie wdrożenie – 3 endpointy do deploy:**

### 1. `/api/mega-agent.ts` (orchestrator)

- Gemini Flash routing
- Promise.all() agentów
- Agregacja wyników


### 2. `/api/crm/ai-specialist.ts` (pierwszy specjalista)

- Pobiera kontekst z D1
- GPT-4o-mini + specialist prompt
- Zapisuje sesję do audytu


### 3. `/api/magazyn/ai-specialist.ts` (drugi specjalista)

```typescript
// src/api/magazyn/ai-specialist.ts (skrócony przykład)
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json();
    
    const specialistPrompt = `
JESTEŚ MAGAZYN_SPECIALIST – ekspert logistyki.

ZADANIE: "${body.zadanie}"
KONTEKST: ${JSON.stringify(body.kontekst)}

Specjalizacja: stany magazynowe, reorder, ABC analiza.
`;

    // Ten sam pattern co CRM
    return specialistExecute('magazyn_ai_specialist', 'gemini-1.5-pro', specialistPrompt, body, env);
  }
};
```


***

## 4. **UI Button gotowy do wklejenia**

```tsx
// W każdym module (CRMKlienci.tsx itp.)
const useMegaAgent = () => {
  const megaAgent = async (prompt: string, kontekst?: any) => {
    const res = await fetch('/api/mega-agent', {
      method: 'POST',
      body: JSON.stringify({ zadanie: prompt, moduł: 'crm', kontekst })
    });
    return res.json();
  };
  return megaAgent;
};

// Użycie:
const megaAgent = useMegaAgent();
await megaAgent('jaki lead jest najlepszy?', { klienci });
```

**Przycisk:**

```tsx
<button 
  onClick={() => megaAgent('analizuj pipeline sprzedaży')}
  className="fixed bottom-20 right-6 btn-mega-ai"
>
  🧠 MEGA AGENT
</button>
```


***

**🚀 Kolejność wdrożenia:**

1. **Deploy `/api/mega-agent.ts`** (5min)
2. **Deploy `/api/crm/ai-specialist.ts`** (3min)
3. **Test curl \#1** (sprawdź routing)
4. **Przycisk MEGA AGENT** w CRM UI
5. **Test z UI** → działa!

**Chcesz:** curl test skryptu czy **kolejny specjalista** (magazyn)?

