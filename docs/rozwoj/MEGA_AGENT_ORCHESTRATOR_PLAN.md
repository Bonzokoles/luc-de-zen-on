<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## MEGA_AGENT_ORCHESTRATOR v2.1 – **bez Bielika** (optymalne modele)

**Centralny orchestrator:** **Gemini 2.0 Flash** (szybki routing + rozumowanie).

***

## 🎯 Architektura (optymalna pod zadania)

```
👤 Użytkownik → /api/mega-agent
         ↓
🧠 GEMINI 2.0 FLASH (Orchestrator)
  ├── Analizuje: zadanie + moduł → wybiera 1-3 specjalistów
  ├── Koordynuje: Promise.all() równolegle
  └── Agreguje: Final Answer + confidence

Specjaliści (dedykowane modele):
├── CRM_AGENT → GPT-4o (lead scoring, relacje)
├── MAGAZYN_AGENT → Gemini Pro (logistyka, stany)
├── PROJEKTY_AGENT → Llama 3.1 405B (zarządzanie zadaniami)
├── SEO_AGENT → Claude 3.5 Sonnet (SEO, content)
├── CONTENT_AGENT → Mistral Large (copywriting)
├── FINANSE_AGENT → DeepSeek R1 (precyzja finansowa)
└── WORKFLOW_AGENT → Grok 4 (automatyzacja)
```


***

## 1. Endpoint centralny: `POST /api/mega-agent` (Gemini Flash)

```typescript
// src/api/mega-agent.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      zadanie: string;
      moduł?: string;     // 'crm', 'magazyn', 'projekty', 'seo'
      kontekst?: any;
      priorytet?: 'szybki' | 'dokładny';
    }>();

    // Faza 1: GEMINI FLASH routing
    const routingDecision = await geminiOrchestrator(body, env);

    // Faza 2: Równoległe wykonanie
    const agentResults = await Promise.allSettled(
      routingDecision.selected_agents.map(agentConfig => 
        executeSpecialist(agentConfig, body, env)
      )
    );

    // Faza 3: Agregacja przez Gemini Pro
    const finalAnswer = await geminiAggregate(agentResults, routingDecision, env);

    return Response.json({
      orchestrator: 'Gemini 2.0 Flash',
      decision: routingDecision,
      agents_used: routingDecision.selected_agents.length,
      results: agentResults,
      final_answer: finalAnswer,
      confidence: routingDecision.confidence
    });
  }
};
```


### Gemini Orchestrator (routing):

```typescript
async function geminiOrchestrator(body: any, env: Env) {
  const corePrompt = `
Jesteś GEMINI ORCHESTRATOR – routingujesz zadania do specjalistów.

ZADANIE: "${body.zadanie}"
MODUŁ: ${body.moduł || 'ogólny'}
KONTEKST: ${JSON.stringify(body.kontekst || {})}

**SPECJALIŚCI (wybierz MAX 3):**
1. CRM_AGENT (GPT-4o-mini) – lead scoring, klienci, pipeline
2. MAGAZYN_AGENT (Gemini-1.5-pro) – stany, alerty, logistyka
3. PROJEKTY_AGENT (llama-3.1-70b) – zadania, time tracking
4. SEO_AGENT (claude-3-5-sonnet) – SEO, crawling, GEO  
5. CONTENT_AGENT (mistral-large) – copywriting, email, treści
6. FINANSE_AGENT (deepseek-r1) – faktury, kalkulacje, księgowość
7. WORKFLOW_AGENT (grok-4) – automatyzacja, workflows

**WYBIERZ NA PODSTAWIE:**
- moduł (jeśli podany)
- słowa kluczowe w zadaniu
- złożoność (1-2 dla prostych, 3 dla złożonych)

FORMAT JSON:
{
  "selected_agents": [
    {"name": "CRM_AGENT", "endpoint": "/api/crm/ai-specialist", "model": "gpt-4o-mini"},
    ...
  ],
  "reasoning": "krótko dlaczego",
  "confidence": 85
}
`;

  const res = await fetch(`${request.url.origin}/api/ai/execute`, {
    method: 'POST',
    body: JSON.stringify({
      firma_id: 'firma_123',
      narzedzie: 'gemini_orchestrator',
      model: 'gemini-2.0-flash',  // SZYBKI routing
      core_prompt: corePrompt,
      payload: body
    })
  });

  return JSON.parse((await res.json()).wynik);
}
```


***

## 2. Specjaliści AI – **optymalne modele pod zadania**

### **CRM_AGENT** `/api/crm/ai-specialist`

```
Model: GPT-4o-mini
Dlaczego: Najlepszy do relacji, lead scoring, natural language
Specjalizacja: "Analizuj pipeline, rekomenduj next steps"
```


### **MAGAZYN_AGENT** `/api/magazyn/ai-specialist`

```
Model: Gemini-1.5-pro  
Dlaczego: Świetny do logistyki, liczb, optymalizacji zapasów
Specjalizacja: "Oblicz reorder points, analizuj rotację"
```


### **PROJEKTY_AGENT** `/api/projekty/ai-specialist`

```
Model: llama-3.1-70b
Dlaczego: Zaawansowane planowanie, Gantt, priorytetyzacja
Specjalizacja: "Stwórz plan projektu, przypisz zadania"
```


### **SEO_AGENT** `/api/seo/ai-specialist`

```
Model: claude-3-5-sonnet
Dlaczego: Najlepszy do content/SEO analysis, kreatywne rekomendacje
Specjalizacja: "Analizuj stronę SEO, zaproponuj title/meta"
```


### **CONTENT_AGENT** `/api/content/ai-specialist`

```
Model: mistral-large
Dlaczego: Szybki copywriting, email, social media
Specjalizacja: "Napisz post LinkedIn, email sprzedażowy"
```


### **FINANSE_AGENT** `/api/finanse/ai-specialist`

```
Model: deepseek-r1
Dlaczego: Precyzja finansowa, kalkulacje, compliance
Specjalizacja: "Zweryfikuj fakturę, oblicz VAT/marzę"
```


### **WORKFLOW_AGENT** `/api/workflow/ai-specialist`

```
Model: grok-4 (xAI)
Dlaczego: Automatyzacja, chaining narzędzi, logika biznesowa
Specjalizacja: "Stwórz workflow: klient → projekt → faktura"
```


***

## 3. Implementacja specjalisty (przykład CRM)

```typescript
// src/api/crm/ai-specialist.ts
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json();

    const specialistPrompt = `
Jesteś CRM_SPECIALIST – najlepszym ekspertem zarządzania klientami.

**TWOJA SPECJALIZACJA:**
- Lead scoring i kwalifikacja
- Analiza pipeline sprzedaży  
- Rekomendacje next steps
- Personalizacja ofert
- Prognozowanie LTV

ZADANIE: "${body.zadanie}"
KONTEKST: ${JSON.stringify(body.kontekst)}

**ODPOWIEDZ JAK SPECJALISTA** – konkretnie, z liczbami, rekomendacjami.
`;

    const res = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'crm_specialist',
        model: 'gpt-4o-mini',  // dedykowany model
        core_prompt: specialistPrompt,
        payload: body
      })
    });

    return res;  // zwraca wynik specjalisty
  }
};
```


***

## 4. UI – przycisk MEGA AGENT wszędzie

**Globalny helper (w App.tsx):**

```tsx
const MegaAgentButton = ({ moduł, kontekst }) => (
  <button 
    onClick={() => megaAgent('coś', moduł, kontekst)}
    className="btn-mega fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl"
  >
    🧠
  </button>
);
```

**`megaAgent` (uniwersalny):**

```tsx
const megaAgent = async (zadanie: string, moduł?: string, kontekst?: any) => {
  const res = await fetch('/api/mega-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zadanie, moduł, kontekst })
  });
  
  const data = await res.json();
  
  // Pokaż mega modal:
  showMegaModal({
    orchestrator: data.orchestrator,
    decision: data.decision.reasoning,
    agents: data.agents_used,
    answer: data.final_answer,
    confidence: data.confidence
  });
};
```


***

## 5. **Dlaczego te modele?** (optymalizacja kosztów/jakości)

| Specjalista | Model | Koszt/1M tokenów | Mocne strony |
| :-- | :-- | :-- | :-- |
| CRM | GPT-4o-mini | \$0.15/\$0.60 | Relacje, NL, lead scoring |
| Magazyn | Gemini Pro | \$0.35/\$1.05 | Liczby, logistyka |
| Projekty | Llama 3.1 70B | \$0.59/\$0.79 | Planowanie złożone |
| SEO | Claude 3.5 Sonnet | \$3/\$15 | Content/SEO kreatywność |
| Content | Mistral Large | \$2/\$6 | Szybki copywriting |
| Finanse | DeepSeek R1 | \$0.14/\$0.28 | Precyzja finansowa |
| Workflow | Grok 4 | \$5/\$15 | Automatyzacja logika |

**Orchestrator:** Gemini Flash (\$0.075/\$0.30) – **najszybszy routing**.

***

**🚀 Wdrożenie krok po kroku:**

1. **Deploy `/api/mega-agent`** (centralny)
2. **Dodaj 1 specjalistę** (`/api/crm/ai-specialist`)
3. **Test:** `curl /api/mega-agent '{"zadanie": "analizuj klienta X"}'`
4. **Przycisk 🧠 MEGA AGENT** w CRM
5. **Powtórz** dla pozostałych modułów

**Chcesz kod pierwszego specjalisty** (`crm/ai-specialist.ts`) czy **testowy curl** dla mega-agent?

