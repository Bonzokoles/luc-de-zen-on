<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Test curl skrypt + **kolejny specjalista MAGAZYN**


***

## 1. **Test curl – kompletny skrypt bash**

Zapisz jako `test-mega-agent.sh`:

```bash
#!/bin/bash

echo "🧠 Test MEGA AGENT ORCHESTRATOR"

BASE_URL="http://localhost:8787"  # Zmień na swój
FIRMA_ID="firma_123"

# Test 1: Prosty CRM
echo "=== TEST 1: CRM Lead Analysis ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d "{
    \"zadanie\": \"który klient ma największą szansę sprzedaży?\",
    \"moduł\": \"crm\"
  }" | jq '.final_answer, .decision'

echo -e "\n=== TEST 2: Złożone (CRM + Magazyn) ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d "{
    \"zadanie\": \"klient TechCorp chce 50 szt. ProduktX – sprawdź dostępność i zaproponuj ofertę\",
    \"moduł\": \"crm\",
    \"kontekst\": {\"klient_id\": \"klient_123\"}
  }" | jq '.final_answer, .decision.selected_agents[] | .name'

echo -e "\n=== TEST 3: SEO + Content ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d "{
    \"zadanie\": \"zoptymalizuj stronę główną pod SEO i napisz nowy title + meta\",
    \"moduł\": \"seo\"
  }" | jq '.final_answer'

echo -e "\n✅ Testy zakończone!"
```

**Uruchom:**

```bash
chmod +x test-mega-agent.sh
./test-mega-agent.sh
```

**Oczekiwany output:**

```
=== TEST 1: CRM Lead Analysis ===
"Klient TechSolutions: 92% szansy sprzedaży"
{
  "selected_agents": [{"name": "CRM_AGENT"}],
  "confidence": 98
}

=== TEST 2: Złożone (CRM + Magazyn) ===
"Klient gotowy do zakupu, ale brak 30szt. ProduktX w magazynie. Proponuję: 20szt. od ręki + 30szt. w 3 dni."
["CRM_AGENT", "MAGAZYN_AGENT"]
```


***

## 2. **Drugi specjalista: MAGAZYN AI Specialist**

```typescript
// src/api/magazyn/ai-specialist.ts
interface MagazynSpecialistRequest {
  zadanie: string;
  kontekst?: any;     // stany magazynowe, alerty itp.
  firma_id: string;
  company_prompt?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body: MagazynSpecialistRequest = await request.json();

    // Faza 1: Pobierz kontekst magazynu
    let magazynContext = body.kontekst || {};
    
    // Alerty (jeśli brakujące)
    const alerty = await env.D1.prepare(`
      SELECT p.nazwa, p.kod, COALESCE(r.stan, 0) as stan, p.minimalny_stan
      FROM produkty_magazyn p
      LEFT JOIN (
        SELECT produkt_id, SUM(CASE typ WHEN 'przyjście' THEN ilosc ELSE -ilosc END) as stan
        FROM ruchy_magazynowe WHERE firma_id = ?
        GROUP BY produkt_id
      ) r ON p.id = r.produkt_id
      WHERE p.firma_id = ? AND COALESCE(r.stan, 0) <= p.minimalny_stan
      LIMIT 5
    `).bind(body.firma_id, body.firma_id).all();

    // Top obroty (ostatni tydzień)
    const top_obroty = await env.D1.prepare(`
      SELECT p.nazwa, SUM(r.ilosc) as wydane 
      FROM ruchy_magazynowe r JOIN produkty_magazyn p ON r.produkt_id = p.id
      WHERE r.firma_id = ? AND r.typ = 'wydanie' AND r.data >= DATE('now', '-7 days')
      GROUP BY p.id ORDER BY wydane DESC LIMIT 5
    `).bind(body.firma_id).all();

    magazynContext = {
      alerty: alerty.results,
      top_obroty: top_obroty.results,
      ...body.kontekst
    };

    // Faza 2: Specjalistyczny prompt MAGAZYN
    const specialistPrompt = `
JESTEŚ **MAGAZYN_SPECIALIST** – NAJLEPSZYM EKSPERTEM LOGISTYKI I ZARZĄDZANIA ZAPASAMI.

**TWOJA SPECJALIZACJA:**
• Analiza stanów magazynowych i alertów
• Obliczanie reorder points i ilości domówień
• ABC analiza (top produkty do kontroli)
• Optymalizacja rotacji zapasów
• Planowanie zakupów grupowych

**ZADANIE:** "${body.zadanie}"

**KONTEKST MAGAZynu:**
${JSON.stringify(magazynContext, null, 2)}

**INSTRUKCJE:**
- Zawsze konkretne liczby: ile domówić, kiedy, od kogo
- ABC analiza: A (top 20% wartości), B, C
- Reorder point = średnie dzienne zużycie × lead time
- Priorytetyzuj alerty (najbliżej zera)

**FORMAT JSON:**
{
  "alerty_priorytet": [
    {"produkt": "nazwa", "do_doomowic": 50, "dostawca": "X"}
  ],
  "abc_analiza": {"A": ["prod1"], "B": [...], "C": [...]},
  "reorder_plan": {
    "caly_koszt": 12500,
    "rekomendacja": "zamów w poniedziałek"
  },
  "rekomendacje": ["1. Zamów X", "2. Zoptymalizuj Y"],
  "uzasadnienie": "..."
}
`;

    // Faza 3: Dedykowany model dla magazynu
    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'magazyn_ai_specialist',
        model: 'gemini-1.5-pro',  // OPTYMALNY dla logistyki/liczb
        temperature: 0.2,         // PRECYZJA
        core_prompt: specialistPrompt,
        company_prompt: body.company_prompt || '',
        payload: {
          zadanie: body.zadanie,
          kontekst: magazynContext
        }
      })
    });

    const data = await aiRes.json();
    const result = JSON.parse(data.wynik);

    // Audyt
    await env.D1.prepare(`
      INSERT INTO magazyn_ai_sessions (firma_id, zadanie, wynik)
      VALUES (?, ?, ?)
    `).bind(body.firma_id, body.zadanie, JSON.stringify(result)).run();

    return Response.json({
      specialist: 'MAGAZYN_AI_SPECIALIST',
      model_used: 'gemini-1.5-pro',
      result,
      magazyn_context: magazynContext
    });
  }
};
```


***

## 3. **Zaktualizowany test curl** (z 2 specialistami)

```bash
# Test 3: Magazyn specialist
echo -e "\n=== TEST 3: Magazyn Analysis ==="
curl -s -X POST "$BASE_URL/api/mega-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "zadanie": "które produkty domówić w pierwszej kolejności?",
    "moduł": "magazyn"
  }' | jq '.final_answer'
```

**Oczekiwany:**

```json
{
  "alerty_priorytet": [
    {"produkt": "Laptop Dell", "do_doomowic": 25, "dostawca": "ABC"},
    ...
  ],
  "reorder_plan": {"caly_koszt": 12500}
}
```


***

## 4. **UI Button dla Magazynu** (gotowy kod)

```tsx
// W module Magazyn
const megaAgent = useMegaAgent();

<button 
  onClick={() => megaAgent('sprawdź alerty i zaproponuj zakupy')}
  className="btn-mega-ai bg-gradient-to-r from-emerald-600 to-teal-600"
>
  🧠 MAGAZYN MEGA AGENT
</button>
```


***

**✅ Masz teraz:**

1. **`/api/mega-agent`** – centralny (Gemini Flash)
2. **`/api/crm/ai-specialist`** – CRM (GPT-4o-mini)
3. **`/api/magazyn/ai-specialist`** – Magazyn (Gemini Pro)
4. **Test curl skrypt** – 3 testy gotowe
5. **UI przyciski** – copy-paste

**Deploy kolejność:**

```
1. mega-agent.ts
2. crm/ai-specialist.ts  
3. magazyn/ai-specialist.ts
4. ./test-mega-agent.sh → test
5. UI przyciski
```

**Następny specjalista:** **SEO** (`/api/seo/ai-specialist`)?

