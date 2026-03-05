<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Narzędzie 7: Organizer Zadań

### Lokalny endpoint: `POST /api/narzedzia/organizer-zadan`

```typescript
// src/api/narzedzia/organizer-zadan.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      model: string;
      company_prompt?: string;
      akcja: string;        // 'rozbij_na_zadania', 'priorytetyzuj', 'planuj_tydzien'
      opis: string;
      ramy_czasowe?: string; // 'dzisiaj', 'ten_tydzien', 'ten_miesiac'
      istniejace_zadania?: Array<{
        title: string;
        priority?: string;
      }>;
    }>();

    let corePrompt = '';

    switch (body.akcja) {
      case 'rozbij_na_zadania':
        corePrompt = `
Jesteś asystentem produktywności. ROZBICZ opis na konkretne zadania.

OPIS: ${body.opis}
RAMY CZASOWE: ${body.ramy_czasowe || 'brak'}

ZASADY:
- Stwórz 3–8 zadań z listy.
- Każde zadanie: krótki tytuł (max 1 linia), priorytet (wysoki/średni/niski), termin (jeśli podano ramy).
- Nie wymyślaj rzeczy spoza opisu.

FORMAT JSON:
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
Jesteś menedżerem projektów. PRIORYTETYZUJEJ listę zadań.

ZADANIA: ${JSON.stringify(body.existing_zadania, null, 2)}

ZASADY:
- Oceń każde zadanie pod kątem wpływu biznesowego i pilności.
- Zaproponuj kolejność wykonania.
- Dodaj uzasadnienie dla top 3.

FORMAT JSON:
{
  "posortowane": [...],
  "top3": ["zadanie1", "zadanie2", "zadanie3"],
  "uzasadnienie": "krótki opis"
}
`;
        break;

      case 'planuj_tydzien':
        corePrompt = `
Jesteś organizatorem pracy. STWÓRZ plan tygodnia.

CELE: ${body.opis}
RAMY: ${body.ramy_czasowe}

ZASADY:
- Podziel tydzień na dni (poniedziałek → piątek).
- Maks 3–5 zadań dziennie.
- Uwzględnij spotkania, importy danych, analizy.

FORMAT:
**Plan tygodnia:**
- Poniedziałek: zadanie1, zadanie2
- Wtorek: ...
```

        break;
    }
    
    // Wyślij do routera AI
    const aiResponse = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'organizer_zadan',
        model: body.model,
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: body
      })
    });
    
    const data = await aiResponse.json();
    
    // Parsuj JSON jeśli akcja wymaga (rozbij_na_zadania, priorytetyzuj)
    let parsedResult = data.wynik;
    if (body.akcja === 'rozbij_na_zadania' || body.akcja === 'priorytetyzuj') {
      try {
        parsedResult = JSON.parse(data.wynik);
      } catch (e) {
        // fallback do raw text
      }
    }
    
    return Response.json({
      wynik: parsedResult,
      model_uzyty: data.model_uzyty,
      czas: data.czas
    });
    }
};

```

### UI `OrganizerZadan-3.tsx` – rozbudowa

Masz już listę zadań z localStorage. Dodaj:

1. **Panel AI na górze (obok dodawania zadań):**
```tsx
<div className="ai-panel mb-6 p-4 bg-purple-50 rounded-lg">
  <h4>🤖 Asystent AI</h4>
  
  <div className="flex gap-3 mb-3">
    <select value={aiAkcja} onChange={e => setAiAkcja(e.target.value)}>
      <option value="rozbij_na_zadania">Rozbij opis na zadania</option>
      <option value="priorytetyzuj">Priorytetyzuj moją listę</option>
      <option value="planuj_tydzien">Zaplanuj tydzień</option>
    </select>
    
    <select value={aiModel} onChange={e => setAiModel(e.target.value)}>
      <option value="auto">Auto</option>
      <option value="szybki">Szybki</option>
    </select>
  </div>
  
  <textarea 
    value={aiOpis} 
    onChange={e => setAiOpis(e.target.value)}
    placeholder="Wpisz opis (np. 'Muszę ogarnąć faktury, zadzwonić do klientów i przygotować raport tygodniowy')"
    rows={3}
  />
  
  <button onClick={runAIAgent} className="btn-primary mt-2 w-full">
    🚀 Wykonaj
  </button>
</div>
```

2. **Wynik AI pod listą zadań:**
```tsx
{aiWynik && (
  <div className="ai-result mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
    <div className="flex justify-between items-center mb-4">
      <h4>🤖 Wynik AI ({aiAkcja})</h4>
      <div className="text-sm text-gray-500">
        {usedModel} -  {aiCzas}ms
      </div>
    </div>
    
    {aiAkcja === 'rozbij_na_zadania' && (
      <div className="space-y-2">
        {aiWynik.map((zadanie: any, i: number) => (
          <div key={i} className="task-ai flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
            <input 
              type="checkbox" 
              onChange={() => dodajZadanieZAI(zadanie)}
              className="w-5 h-5 rounded"
            />
            <div>
              <div className={`font-medium ${getPriorityColor(zadanie.priority)}`}>
                {getPriorityIcon(zadanie.priority)} {zadanie.title}
              </div>
              {zadanie.dueDate && (
                <div className="text-sm text-gray-500">
                  📅 {new Date(zadanie.dueDate).toLocaleDateString('pl-PL')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
    
    {aiAkcja === 'planuj_tydzien' && (
      <div className="prose max-w-none" 
           dangerouslySetInnerHTML={{ __html: aiWynik }} />
    )}
    
    {aiAkcja === 'priorytetyzuj' && (
      <>
        <div className="mb-4">
          <h5>Top 3 do zrobienia najpierw:</h5>
          <ol className="mt-2 space-y-1">
            {aiWynik.top3.map((zadanie: string, i: number) => (
              <li key={i} className="text-lg font-semibold text-primary-600">
                {i+1}. {zadanie}
              </li>
            ))}
          </ol>
        </div>
        <div dangerouslySetInnerHTML={{ __html: aiWynik.uzasadnienie }} />
      </>
    )}
  </div>
)}
```

3. **Funkcja `runAIAgent`:**
```tsx
const runAIAgent = async () => {
  const res = await fetch('/api/narzedzia/organizer-zadan', {
    method: 'POST',
    body: JSON.stringify({
      firma_id: 'firma_123',
      model: aiModel,
      company_prompt: companyPrompt, // opcjonalne z UI
      akcja: aiAkcja,
      opis: aiOpis,
      ramy_czasowe: 'ten_tydzien',
      existing_zadania: tasks // aktualna lista z localStorage
    })
  });
  
  const data = await res.json();
  setAiWynik(data.wynik);
  setUsedModel(data.model_uzyty);
  setAiCzas(data.czas);
};
```

4. **Funkcja `dodajZadanieZAI`:**
```tsx
const dodajZadanieZAI = (zadanie: any) => {
  const newTask = {
    id: Date.now().toString(),
    title: zadanie.title,
    priority: zadanie.priority,
    completed: false,
    dueDate: zadanie.dueDate
  };
  setTasks([newTask, ...tasks]);
};
```

**Co to daje Organizerowi Zadań:**

- ✅ 3 tryby AI: „Rozbij na zadania”, „Priorytetyzuj listę”, „Zaplanuj tydzień”,
- ✅ Zadania z AI automatycznie dodawane do listy jednym klikiem (checkbox),
- ✅ Plan tygodniowy w ładnym formacie,
- ✅ Priorytetyzacja z uzasadnieniem top 3,
- ✅ Wspólny router `/api/ai/execute`.

**Następne narzędzie:** Semantic Search Demo?

