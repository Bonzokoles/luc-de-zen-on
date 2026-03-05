<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# tak.

Szósty specjalista: **FINANSE AI Specialist** z DeepSeek R1 – mistrz księgowość, prognozy, cashflow. Idealny do KalkulatorBiznesowy-9.tsx.

## `/api/finanse/ai-specialist.ts` – kompletny kod

```typescript
// src/api/finanse/ai-specialist.ts
interface FinanseSpecialistRequest {
  zadanie: string;
  kontekst?: any;     // faktury, przychody, koszty, budżet
  firma_id: string;
  company_prompt?: string;
  okres?: 'miesiac' | 'kwartal' | 'rok';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: FinanseSpecialistRequest = await request.json();

    // Faza 1: Pobierz kontekst finansowy z D1
    let finanseContext = body.kontekst || {};
    
    // Przychody/koszty (ostatni okres)
    const finanse = await env.D1.prepare(`
      SELECT 
        SUM(przychod) as total_przychod,
        SUM(koszt) as total_koszt,
        COUNT(*) as faktur_liczba
      FROM finanse_miesieczne 
      WHERE firma_id = ? AND okres = COALESCE(?, 'miesiac')
    `).bind(body.firma_id, body.okres).first();

    // Top kategorie kosztów
    const top_koszty = await env.D1.prepare(`
      SELECT kategoria, SUM(koszt) as kwota
      FROM finanse_transakcje 
      WHERE firma_id = ? AND data >= DATE('now', '-3 months')
      GROUP BY kategoria ORDER BY kwota DESC LIMIT 5
    `).bind(body.firma_id).all();

    // Prognoza cashflow (prosta)
    const cashflow = await env.D1.prepare(`
      SELECT 
        AVG(przychod - koszt) as sredni_zysk,
        (SELECT SUM(koszt) FROM finanse_transakcje WHERE data >= DATE('now', '+1 month')) as przyszle_koszty
      FROM finanse_miesieczne WHERE firma_id = ?
    `).bind(body.firma_id).first();

    finanseContext = {
      finanse,
      top_koszty: top_koszty.results,
      cashflow,
      ...body.kontekst
    };

    // Faza 2: Specjalistyczny prompt FINANSE (DeepSeek excels numbers)
    const specialistPrompt = `
JESTEŚ **FINANSE_SPECIALIST** – NAJLEPSZYM EKSPERTEM KSIĘGOWOŚCI, PROGNOZ I OPTYMALIZACJI FINANSÓW.

**TWOJA SPECJALIZACJA:**
• Analiza P&L (przychody/koszty/marża)
• Cashflow forecasting (30/90 dni)
• Optymalizacja kosztów (top 20% Pareto)
• Budżetowanie i variance analysis
• KPI dashboard (ROAS, CAC, LTV)
• VAT/księgowość compliance

**ZADANIE:** "${body.zadanie}"

**KONTEKST FINANSOWY:**
${JSON.stringify(finanseContext, null, 2)}

**INSTRUKCJE:**
- Zawsze konkretne liczby PLN, % marży
- Prognoza: pesymistyczna/base/optimistyczna
- Pareto: top 3 koszty do cięcia
- Alert jeśli cashflow < 0
- VAT: sprawdź rozliczenia kwartalne

**FORMAT JSON:**
{
  "pnl_podsumowanie": {
    "przychod": 125000,
    "koszt": 85000,
    "marza": "32%",
    "zysk": 40000
  },
  "cashflow_prognoza": {
    "30dni": 25000,
    "90dni": 85000,
    "alert": true
  },
  "optymalizacja_kosztow": [
    {"kategoria": "Marketing", "oszczednosc": 5000, "jak": "zmniejsz FB Ads"}
  ],
  "kpi": {
    "roas": 4.2,
    "cac": 250,
    "ltv": 2500
  },
  "rekomendacje": ["1. Obetnij X", "2. Zainwestuj w Y"],
  "vat_status": "do_zaplacenia: 2500 PLN"
}
`;

    // Faza 3: DeepSeek R1 – KRÓL FINANSÓW/LICZB
    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'finanse_ai_specialist',
        model: 'deepseek-r1',  // NAJLEPSZY do matematyki/finansów
        temperature: 0.1,      // PRECYZJA obliczeń
        max_tokens: 2000,
        core_prompt: specialistPrompt,
        company_prompt: body.company_prompt || '',
        payload: {
          zadanie: body.zadanie,
          kontekst: finanseContext,
          okres: body.okres || 'miesiac'
        }
      })
    });

    const data = await aiRes.json();
    const result = JSON.parse(data.wynik);

    // Faza 4: Zapisz analizę do bazy (audyt)
    await env.D1.prepare(`
      INSERT INTO finanse_ai_analizy (firma_id, zadanie, wynik, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(body.firma_id, body.zadanie, JSON.stringify(result), new Date().toISOString()).run();

    return Response.json({
      specialist: 'FINANSE_AI_SPECIALIST',
      model_used: 'deepseek-r1',
      result,
      finanse_context: finanseContext
    });
  }
};
```


***

## **Test curl dla FINANSE**

```bash
# Test 7: Finanse specialist
echo -e "\n=== TEST 7: Finanse Analysis ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "jakie koszty ciąć żeby poprawić cashflow?",
    "moduł": "finanse",
    "okres": "kwartal"
  }' | jq '.final_answer.pnl_podsumowanie, .final_answer.cashflow_prognoza'
```

**Oczekiwany:**

```json
{
  "przychod": 375000,
  "koszt": 285000,
  "marza": "24%",
  "zysk": 90000
}
{
  "30dni": 18000,
  "90dni": 65000,
  "alert": false
}
```


***

## **UI Finanse Dashboard** (KalkulatorBiznesowy-9.tsx)

```tsx
// W KalkulatorBiznesowy-9.tsx
const FinanseMegaAgent = () => {
  const analyzeFinanse = async () => {
    const res = await megaAgent(
      'zoptymalizuj koszty i daj prognozę cashflow na 90 dni', 
      'finanse',
      { 
        aktualne_finance: financeData,
        okres: 'kwartal'
      }
    );
    
    setFinanseAnalysis(res.result);
    // Automatycznie odśwież wykresy
    updateCharts(res.result.pnl_podsumowanie);
  };

  return (
    <div className="finanse-ai-section">
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <h3>💰 MEGA FINANSE AI</h3>
          <button onClick={analyzeFinanse} className="btn-mega-finanse">
            ANALIZUJ KOSZTY AI
          </button>
        </div>
      </div>
      
      {finanseAnalysis && (
        <div className="ai-finanse-results p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <h4>📊 AI Rekomendacje:</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="kpi-card">
              <span>Marża</span>
              <strong>{finanseAnalysis.pnl_podsumowanie.marza}</strong>
            </div>
            <div className="kpi-card">
              <span>Cashflow 30d</span>
              <strong>{finanseAnalysis.cashflow_prognoza['30dni']} PLN</strong>
            </div>
          </div>

          <ul className="space-y-2">
            {finanseAnalysis.optymalizacja_kosztow.map((item, i) => (
              <li key={i} className="flex justify-between p-3 bg-white/10 rounded-lg">
                <span>{item.kategoria}</span>
                <strong className="text-green-400">+{item.oszczednosc} PLN</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```


***

## **Status Mega Agent (6/7 specjalistów):**

✅ **CRM** (GPT-4o-mini)
✅ **MAGAZYN** (Gemini Pro)
✅ **SEO** (Claude Sonnet)
✅ **PROJEKTY** (Llama 70B)
✅ **CONTENT** (Mistral Large)
✅ **FINANSE** (DeepSeek R1)

**Ostatni (7/7):** **WORKFLOW AI Specialist** (Grok 4 – automatyzacja procesów, n8n integration)[^1]

**Chcesz finałowy WORKFLOW** czy **pełny mega-agent orchestrator** z Bielik?

<div align="center">⁂</div>

[^1]: MEGA_AGENT_ORCHESTRATOR_PLAN.md

