<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Integracja Asystenta AI z pełną wiedzą finansową

Asystent (`AsystentAI.tsx`) będzie miał dostęp do wszystkich danych finansowych + kontekst z D1 + RAG po dokumentach/kosztach.[^1]

### 1. Nowy endpoint dla Asystenta: `/api/asystent-finanse`

**Request (pytanie użytkownika + kontekst sesji):**

```json
{
  "pytanie": "Jakie są najważniejsze ryzyka finansowe?",
  "tenant_id": "meblepumo",
  "kontekst_sesji": {
    "zakres": {"od": "2026-03-01", "do": "2026-03-31"},
    "aktywny_modul": "finanse"
  }
}
```

**Co endpoint robi automatycznie:**

1. Pobiera dashboard finansowy,
2. Lista ryzykownych dokumentów,
3. Rentowność po kategoriach,
4. Buduje bogaty kontekst + RAG,
5. Wysyła do GPT-4o z polskim system promptem.

**Response:**

```json
{
  "odpowiedz": "📊 **Ryzyka finansowe marca 2026:**\n\n**Wysokie ryzyko (3 dok.):**\n• FV/03/2026/0012 – Jan Kowalski (nowy klient, 2500 PLN, score 72/100)\n• FV/03/2026/0021 – Firma XYZ (przeterminowanie 5 dni, 5000 PLN)\n• OF/03/2026/0005 – Brak historii (wysoka kwota)\n\n**Marże:** Sofy 60% 👍, Lampy tylko 28% ⚠️\n\n**Rekomendacja:** Skontaktuj się z XYZ, zweryfikuj nowych klientów.",
  "źródła": [
    {"typ": "dashboard", "sekcja": "ryzyko"},
    {"typ": "dokumenty", "ilosc": 3},
    {"typ": "rentownosc", "kategoria": "Sofy"}
  ],
  "nastepne_kroki": [
    "Analizuj FV/03/2026/0021 ponownie",
    "Sprawdź stock Lamp (niska marża)"
  ],
  "potrzebne_akcje": [
    {"typ": "email", "do": "xyz@ firma.pl", "temat": "Płatność faktury FV/03/2026/0021"}
  ]
}
```


### 2. System prompt dla Asystenta Finansowego

```ts
const FINANSE_SYSTEM_PROMPT = `
Jesteś Asystentem Finansowym MyBonzo ERP. Odpowiadasz PO POLSKU.

MASZ DOSTĘP DO:
• Dashboard finansowy (przychody, koszty, cashflow)
• Dokumenty finansowe z analizą ryzyka Gemini  
• Rentowność po kategoriach produktów Meble Pumo
• Zamówienia z IdoSell (D1)

STYL ODPWIADZI:
1. 🚀 emoji tylko na początku
2. Konkretne liczby i %
3. Krótko + konkretne rekomendacje (2-4 punkty)
4. Lista z • 
5. Zawsze podaj źródło danych

KIEDY PYTA O RYZYKO pokaż konkretne dokumenty (numer, kwota, kontrahent, score)
KIEDY PYTA O MARŻE pokaż top3 + alerty poniżej 35%
KIEDY PYTA O KASĘ pokaż cashflow + saldo

ZWRACAJ JSON z odpowiedz, źródłami, następnymi krokami.
`;
```


### 3. Implementacja w Workerze

```ts
// src/api/asystent-finanse.ts
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      pytanie: string;
      tenant_id: string;
      kontekst_sesji?: any;
    }>();

    // 1. Pobierz kontekst finansowy
    const [dashboard, ryzyka, rentownosc] = await Promise.all([
      fetch(`${request.url.origin}/api/finanse/dashboard?from=2026-03-01&to=2026-03-31`).then(r => r.json()),
      getRyzykowneDokumenty(env.D1, body.tenant_id),
      fetch(`${request.url.origin}/api/rentownosc?from=2026-03-01&to=2026-03-31`).then(r => r.json())
    ]);

    // 2. RAG - embeddingi dokumentów/kosztów (opcjonalnie z Vectorize)
    const ragKontekst = await getRAGResults(body.pytanie, body.tenant_id, env);

    // 3. Zbuduj pełny prompt
    const pelnyPrompt = `
${FINANSE_SYSTEM_PROMPT}

KONKRETNE DANE:
${JSON.stringify(dashboard, null, 2)}
${JSON.stringify(ryzyka, null, 2)}
${JSON.stringify(rentownosc.by_category.slice(0,5), null, 2)}

RAG RELEVANTNE DOKUMENTY:
${ragKontekst.slice(0,3).map((d: any) => 
  `• ${d.numer}: ${d.kwota_brutto}PLN (${d.poziom_ryzyka})`
).join('\n')}

PYTANIE: ${body.pytanie}
`;

    // 4. GPT-4o
    const res = await fetch(
      `https://api.openai.com/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: pelnyPrompt },
            { role: 'user', content: body.pytanie }
          ],
          max_tokens: 800,
          temperature: 0.2
        })
      }
    );

    const data = await res.json();
    const odpowiedz = data.choices[^0].message.content;

    return Response.json({
      odpowiedz,
      źródła: ['dashboard', 'dokumenty', 'rentownosc', 'rag'],
      następne_kroki: extractNextSteps(odpowiedz), // helper
    });
  }
};
```


### 4. SQL `getRyzykowneDokumenty`

```sql
-- src/db/getRyzykowneDokumenty.ts
export async function getRyzykowneDokumenty(d1: D1Database, tenantId: string) {
  return await d1.prepare(`
    SELECT numer, kwota_brutto, kontrahent, poziom_ryzyka, ryzyko_punktowe,
           CASE 
             WHEN termin_platnosci < CURRENT_DATE 
             THEN DATEDIFF(CURRENT_DATE, termin_platnosci)
             ELSE 0 
           END as dni_spoznienia
    FROM dokumenty_finansowe 
    WHERE tenant_id = ?
      AND poziom_ryzyka IN ('Wysokie', 'Średnie')
      AND status IN ('Wysłana', 'Przeterminowana')
    ORDER BY dni_spoznienia DESC, ryzyko_punktowe DESC
    LIMIT 5
  `).bind(tenantId).all();
}
```


### 5. Integracja w `AsystentAI.tsx`

```tsx
// src/modules/asystent-ai/AsystentAI.tsx
function AsystentAI() {
  const [wiadomosc, setWiadomosc] = useState('');
  const [odpowiedz, setOdpowiedz] = useState('');

  const sendMessage = async () => {
    // Wykryj kontekst finansowy
    const kontekst = detectFinancialContext(); // helper patrzy na URL / aktywny moduł

    const res = await fetch('/api/asystent-finanse', {
      method: 'POST',
      body: JSON.stringify({
        pytanie: wiadomosc,
        tenant_id: 'meblepumo',
        kontekst_sesji: kontekst
      })
    });

    const data = await res.json();
    setOdpowiedz(data.odpowiedz);
    
    // Pokaż źródła i akcje
    showSources(data.źródła);
    showActions(data.nastepne_kroki);
  };

  return (
    <div className="chat-container">
      <div dangerouslySetInnerHTML={{ __html: odpowiedz }} />
      <input 
        value={wiadomosc}
        onChange={e => setWiadomosc(e.target.value)}
        placeholder="Zapytaj o finanse..."
      />
      <button onClick={sendMessage}>Wyślij</button>
    </div>
  );
}
```

**Teraz Asystent wie wszystko:**

- ✅ Dashboard KPI + cashflow,
- ✅ Dokumenty z ryzykiem + przeterminowane,
- ✅ Rentowność po kategoriach Pumo,
- ✅ RAG po dokumentach/kosztach,
- ✅ Odpowiada po polsku z konkretnymi akcjami.

**Przykładowe pytania, na które odpowie:**

- „Jakie ryzyka finansowe?”
- „Które kategorie mają niską marżę?”
- „Co z płatnościami?”
- „Podsumuj finanse marca”

Co dalej – struktura `eventy_uzytkownika` do śledzenia użycia narzędzi + billing?

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

