<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Czwarty specjalista: **PROJEKTY AI Specialist** (Llama 3.1 70B)


***

## `/api/projekty/ai-specialist.ts` – kompletny kod

```typescript
// src/api/projekty/ai-specialist.ts
interface ProjektySpecialistRequest {
  zadanie: string;
  kontekst?: any;     // lista projektów, zadania, pracownicy
  projekt_id?: string;
  firma_id: string;
  company_prompt?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: ProjektySpecialistRequest = await request.json();

    // Faza 1: Pobierz kontekst projektów z D1
    let projektyContext = body.kontekst || {};
    
    if (body.projekt_id) {
      const projekt = await env.D1.prepare(`
        SELECT * FROM projekty WHERE id = ? AND firma_id = ?
      `).bind(body.projekt_id, body.firma_id).first();

      const zadania = await env.D1.prepare(`
        SELECT * FROM zadania_projektow 
        WHERE projekt_id = ? ORDER BY priorytet DESC, deadline ASC
      `).bind(body.projekt_id).all();

      const pracownicy = await env.D1.prepare(`
        SELECT u.imie, u.role, SUM(t.godziny) as obciazenie
        FROM uzytkownicy u LEFT JOIN zadania_projektow t ON u.id = t.pracownik_id
        WHERE t.projekt_id = ? GROUP BY u.id
      `).bind(body.projekt_id).all();

      projektyContext = {
        projekt,
        zadania: zadania.results,
        pracownicy: pracownicy.results,
        ...body.kontekst
      };
    } else {
      // Top projekty (jeśli brak ID)
      const top_projekty = await env.D1.prepare(`
        SELECT * FROM projekty 
        WHERE firma_id = ? AND status != 'zakończony'
        ORDER BY deadline ASC LIMIT 5
      `).bind(body.firma_id).all();
      projektyContext.top_projekty = top_projekty.results;
    }

    // Faza 2: Specjalistyczny prompt PROJEKTY (Llama excels planning)
    const specialistPrompt = `
JESTEŚ **PROJEKTY_SPECIALIST** – NAJLEPSZYM EKSPERTEM ZARZĄDZANIA PROJEKTAMI I TEAMOWYM WORKFLOW.

**TWOJA SPECJALIZACJA:**
• Priorytetyzacja zadań (Critical Path Method)
• Alokacja zasobów (pracownicy → zadania)
• Prognozowanie opóźnień (risk analysis)
• Sprint planning i velocity
• Bottleneck detection
• Gantt chart recommendations

**ZADANIE:** "${body.zadanie}"

**KONTEKST PROJEKTÓW:**
${JSON.stringify(projektyContext, null, 2)}

**INSTRUKCJE:**
- Zawsze konkretne: "Przypisz Jan do ZadaniaX (poniedziałek)"
- Critical Path: najważniejsze zadania najpierw
- Obciążenie pracowników: max 80% capacity
- Risk score (0-100) dla deadline
- Proste Gantt: tydzień 1, tydzień 2...

**FORMAT JSON:**
{
  "risk_score": 0-100,
  "critical_path": ["zad1", "zad2", "zad3"],
  "alokacja": [
    {"pracownik": "Jan", "zadanie": "X", "start": "2026-03-10", "godziny": 12}
  ],
  "bottlenecks": ["brak zasobów na frontend"],
  "rekomendacje": [
    "1. Przyspiesz zadanie X (dodaj pracownika)",
    "2. Przenieś Y na przyszły tydzień"
  ],
  "gantt_simple": {
    "tydzien1": ["zad1", "zad2"],
    "tydzien2": ["zad3"]
  },
  "uzasadnienie": "..."
}
`;

    // Faza 3: Llama 3.1 70B – KRÓL LOGISTYKI PLANOWANIA
    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'projekty_ai_specialist',
        model: 'llama-3.1-70b-instruct',  // LOKALNY / Groq – planning master
        temperature: 0.1,         // PRECYZJA planowania
        max_tokens: 2500,
        core_prompt: specialistPrompt,
        company_prompt: body.company_prompt || '',
        payload: {
          zadanie: body.zadanie,
          kontekst: projektyContext
        }
      })
    });

    const data = await aiRes.json();
    const result = JSON.parse(data.wynik);

    // Faza 4: Automatycznie aktualizuj priorytety w bazie
    if (body.projekt_id && result.alokacja) {
      for (const alloc of result.alokacja.slice(0, 10)) {
        await env.D1.prepare(`
          UPDATE zadania_projektow 
          SET pracownik_id = (SELECT id FROM uzytkownicy WHERE imie = ?),
              priorytet = 1, deadline = ?
          WHERE nazwa LIKE ?
        `).bind(alloc.pracownik.split(' ')[0], alloc.start, `%${alloc.zadanie}%`).run();
      }
    }

    return Response.json({
      specialist: 'PROJEKTY_AI_SPECIALIST',
      model_used: 'llama-3.1-70b-instruct',
      result,
      projekty_context: projektyContext
    });
  }
};
```


***

## **Test curl dla PROJEKTY**

```bash
# Test 5: Projekty specialist
echo -e "\n=== TEST 5: Projekty Analysis ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "jakie zadania zrobić najpierw w projekcie Kuchnia2026?",
    "moduł": "projekty",
    "kontekst": {
      "projekt_id": "projekt_456",
      "pracownicy": ["Jan (dev)", "Anna (design)", "Piotr (PM)"]
    }
  }' | jq '.final_answer'
```

**Oczekiwany:**

```json
{
  "risk_score": 45,
  "critical_path": ["Wireframes", "Design approval", "Frontend"],
  "alokacja": [
    {"pracownik": "Anna", "zadanie": "Wireframes", "start": "2026-03-10", "godziny": 16}
  ],
  "gantt_simple": {
    "tydzien1": ["Wireframes", "Design"], 
    "tydzien2": ["Frontend", "Backend"]
  }
}
```


***

## **UI Dashboard dla Projekty** (copy-paste)

```tsx
// ProjektyDashboard.tsx
const ProjektyMegaAgent = () => {
  const [megaResult, setMegaResult] = useState(null);

  const analyzeProject = async () => {
    const res = await megaAgent(
      'zoptymalizuj alokację w projekcie Kuchnia2026', 
      'projekty',
      { projekt_id: currentProject.id }
    );
    setMegaResult(res);
    
    // Automatycznie aktualizuj widok
    refetchProjects();
  };

  return (
    <div className="mega-ai-panel">
      <button onClick={analyzeProject} className="btn-mega-projects">
        🚀 OPTYMALIZUJ PROJEKT AI
      </button>
      
      {megaResult && (
        <div className="mega-results mt-4 p-4 bg-green-50 rounded-xl">
          <h4>AI Rekomendacje:</h4>
          <ul>
            {megaResult.result.rekomendacje.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```


***

## **Status Mega Agent (4/7 specjalistów):**

✅ **CRM** (GPT-4o-mini) – lead scoring + LTV
✅ **MAGAZYN** (Gemini Pro) – reorder + ABC
✅ **SEO** (Claude Sonnet) – title/meta/keywords
✅ **PROJEKTY** (Llama 70B) – critical path + alokacja

**Pozostałe (3):**
5. **CONTENT** (Mistral Large 123B)
6. **FINANSE** (DeepSeek R1)
7. **WORKFLOW** (Grok 4)

**Następny:** **CONTENT AI Specialist** dla blogów/produktów?

