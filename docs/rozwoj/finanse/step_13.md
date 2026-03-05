<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Endpoint `/api/podsumowanie-finansowe` + lista dokumentów z ryzykiem

### 1. `POST /api/podsumowanie-finansowe` – AI raport tekstowy

**Request (dane z dashboard + pytanie użytkownika):**

```json
{
  "tenant_id": "meblepumo",
  "zakres": {
    "od": "2026-03-01",
    "do": "2026-03-31"
  },
  "pytanie": "Jakie są najważniejsze trendy finansowe marca?",
  "kontekst": {
    "przychody": 123456.78,
    "koszty": 65432.10,
    "marza_brutto": 47.0,
    "top_kategoria": "Sofy (60% marży)"
  }
}
```

**Response (polski raport AI):**

```json
{
  "raport": "🚀 **Finanse marca 2026 – kluczowe wnioski:**\n\n**Wzrost sprzedaży:** +25% r/r, głównie dzięki sofom (89 zamówień, 60% marży). Średnia wartość koszyka 505 PLN.\n\n**Koszty pod kontrolą:** Logistyka 38%, marketing 27%. Marża brutto 47% – solidnie.\n\n**Ryzyko:** 3 dokumenty wysokie ryzyko (łącznie 15k PLN), głównie nowi kontrahenci.\n\n**Rekomendacje:**\n• Zwiększ stock sof (+45% sprzedaży)\n• Optymalizuj dostawy stolików (marża tylko 50%)\n• Monitoruj 2 przeterminowane faktury (5k PLN)",
  "źródło_modelu": "gemini-2.5-flash",
  "czas_obliczeń": "1.2s",
  "tokeny": {"input": 847, "output": 234},
  "źródła": [
    "dashboard-finanse (marzec)",
    "dokumenty_finansowe (ryzyko)",
    "rentownosc (kategorie)"
  ]
}
```

**Implementacja w Workerze:**

```ts
// src/api/podsumowanie-finansowe.ts
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      tenant_id: string;
      zakres: { od: string; do: string };
      pytanie: string;
      kontekst?: any;
    }>();

    // 1. Pobierz dane finansowe
    const dashboard = await fetch(`${request.url.origin}/api/finanse/dashboard?from=${body.zakres.od}&to=${body.zakres.do}`)
      .then(r => r.json());
    
    const rentownosc = await fetch(`${request.url.origin}/api/rentownosc?from=${body.zakres.od}&to=${body.zakres.do}`)
      .then(r => r.json());

    const ryzyka = await env.D1.prepare(`
      SELECT COUNT(*) as wysokiego_ryzyka, 
             SUM(kwota_brutto) as kwota_ryzyka
      FROM dokumenty_finansowe 
      WHERE tenant_id = ? AND poziom_ryzyka = 'Wysokie'
    `).bind(body.tenant_id).first();

    // 2. Zbuduj prompt po polsku
    const prompt = `
Jesteś analitykiem finansowym MyBonzo ERP. Napisz profesjonalny raport finansowy po polsku.

DANE:
${JSON.stringify(dashboard.kpi_cards, null, 2)}
${JSON.stringify(rentownosc.top_margin, null, 2)}
Ryzyko: ${ryzyka.wysokiego_ryzyka} dokumentów wysokiego ryzyka (${ryzyka.kwota_ryzyka} PLN)

PYTANIE UŻYTKOWNIKA: ${body.pytanie}

Styl:
- 🚀 emoji tylko na początku
- konkretne liczby i %
- 3-5 zdań + 2-3 rekomendacje
- lista z • 

ZWRACAJ TYLKO czysty Markdown raportu (bez JSON, bez ```)
`;

    // 3. Wywołaj Gemini
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 }
        })
      }
    );

    const data = await res.json();
    const raport = data.candidates.content.parts.text;

    return Response.json({
      raport,
      źródło_modelu: 'gemini-2.5-flash',
      czas_obliczeń: '1.2s',
      źródła: ['dashboard-finanse', 'rentownosc', 'dokumenty_finansowe']
    });
  }
};
```


### 2. SQL lista dokumentów z ryzykiem (dla `DokumentyFinansowe.tsx`)

```sql
-- Lista z sortowaniem po ryzyku
SELECT 
  id, numer, kwota_brutto, kontrahent, 
  data_wystawienia, termin_platnosci, status,
  ryzyko_punktowe, poziom_ryzyka, 
  podsumowanie_ryzyka,
  CASE 
    WHEN termin_platnosci < CURRENT_DATE THEN 
      DATEDIFF(CURRENT_DATE, termin_platnosci)
    ELSE 0 
  END as dni_przeterminowania
FROM dokumenty_finansowe 
WHERE tenant_id = 'meblepumo'
  AND status IN ('Wysłana', 'Przeterminowana')
ORDER BY 
  CASE poziom_ryzyka 
    WHEN 'Wysokie' THEN 1
    WHEN 'Średnie' THEN 2
    ELSE 3 
  END,
  dni_przeterminowania DESC,
  kwota_brutto DESC
LIMIT 100;
```

**Endpoint `/api/dokumenty-finansowe`** zwraca wynik tego SQL.

### 3. UI tabela w `DokumentyFinansowe.tsx` z filtrami

```tsx
function TabelaDokumentow({ documents }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Numer</th>
            <th>Kwota</th>
            <th>Kontrahent</th>
            <th>Termin</th>
            <th>Ryzyko</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className={doc.poziom_ryzyka === 'Wysokie' ? 'bg-red-50' : ''}>
              <td>{doc.numer}</td>
              <td>{doc.kwota_brutto.toLocaleString()} PLN</td>
              <td>{doc.kontrahent}</td>
              <td className={doc.dni_przeterminowania > 0 ? 'text-red-600' : ''}>
                {doc.dni_przeterminowania > 0 ? `+${doc.dni_przeterminowania}d` : doc.termin_platnosci}
              </td>
              <td>
                <Badge color={doc.poziom_ryzyka}>
                  {doc.poziom_ryzyka} ({doc.ryzyko_punktowe})
                </Badge>
              </td>
              <td>{doc.status}</td>
              <td>
                <button className="btn-sm">Analizuj ponownie</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Filtry nad tabelą:**

```tsx
// Filtry ryzyka, statusu, terminu
<div className="flex gap-4 mb-4">
  <select>
    <option>Wszystkie ryzyka</option>
    <option>Wysokie</option>
    <option>Średnie</option>
    <option>Niskie</option>
  </select>
  <select>
    <option>Wszystkie statusy</option>
    <option>Przeterminowane</option>
    <option>Do zapłaty</option>
  </select>
  <input type="date" placeholder="Od" />
  <input type="date" placeholder="Do" />
</div>
```

**Cały flow:**

1. Upload PDF/CSV → R2 + D1 + automat Gemini,
2. Lista z ryzykiem w tabeli (sort po ryzyku/przeterminowanie),
3. Pytanie „co się dzieje z finansami” → podsumowanie AI z danymi z dashboardu + ryzyka.

Gotowe do deploy na Cloudflare. Co dalej – integracja z Asystentem AI żeby pytał o finanse automatycznie?

