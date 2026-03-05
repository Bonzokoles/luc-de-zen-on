<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Tabela `dokumenty_finansowe` + analiza Gemini

Struktura D1 + automatyczna analiza ryzyka po imporcie PDF z Gemini (docelowo wymienisz model). Wszystko Cloudflare‑native.[^1]

### 1. Tabela `dokumenty_finansowe` w D1

```sql
-- wrangler d1 execute mybonzo --local --command="..."
CREATE TABLE dokumenty_finansowe (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'meblepumo',
  numer TEXT NOT NULL,                    -- FV/03/2026/0012
  typ TEXT NOT NULL CHECK (typ IN ('FAKTURA', 'PROFORMA', 'UMOWA', 'OFERTA', 'ZWROT')), -- polskie nazwy
  data_wystawienia DATE NOT NULL,
  termin_platnosci DATE,
  waluta TEXT DEFAULT 'PLN',
  kwota_netto DECIMAL(18,2),
  kwota_brutto DECIMAL(18,2),
  stawka_vat_srednia DECIMAL(5,2),
  kontrahent TEXT NOT NULL,
  kontrahent_id TEXT,                    -- z CRM
  projekt_id TEXT,                       -- z modulu projekty
  status TEXT DEFAULT 'Wysłana' CHECK (status IN ('Szkic', 'Wysłana', 'Zapłacona', 'Przeterminowana', 'Anulowana')),
  plik_url TEXT,                         -- klucz R2: dokumenty/FV_03_2026_0012.pdf
  zrodlo TEXT DEFAULT 'Upload',          -- 'Upload', 'GeneratorFaktur', 'Integracja',

  -- Wyniki analizy ryzyka (Gemini)
  ryzyko_punktowe INTEGER CHECK (ryzyko_punktowe BETWEEN 0 AND 100),
  poziom_ryzyka TEXT CHECK (poziom_ryzyka IN ('Niskie', 'Średnie', 'Wysokie')), -- polskie
  tagi_ryzyka TEXT,                      -- JSON: ["nowy_klient", "duza_kwota"]
  podsumowanie_ryzyka TEXT,              -- "Nowy kontrahent, wysoka kwota..."
  model_ai_uzyty TEXT DEFAULT 'gemini-2.5-flash',
  data_analizy DATETIME,

  uwagi TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexy
CREATE INDEX idx_dokumenty_tenant_data ON dokumenty_finansowe(tenant_id, data_wystawienia);
CREATE INDEX idx_dokumenty_ryzyko ON dokumenty_finansowe(tenant_id, poziom_ryzyka);
CREATE INDEX idx_dokumenty_status ON dokumenty_finansowe(tenant_id, status);
CREATE INDEX idx_dokumenty_kontrahent ON dokumenty_finansowe(tenant_id, kontrahent);
```


### 2. Worker automatycznej analizy po imporcie

```ts
// src/api/import-dokumentu.ts
export default {
  async fetch(request: Request, env: Env) {
    if (request.method !== 'POST') {
      return new Response('Tylko POST', { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get('plik') as File;
    const { numer, kwota_brutto, kontrahent, data_wystawienia } = Object.fromEntries(formData);

    if (!file || !numer || !kwota_brutto || !kontrahent) {
      return Response.json({ error: 'Brak wymaganych danych' }, { status: 400 });
    }

    // 1. Zapisz PDF do R2
    const pdfKey = `dokumenty/${Date.now()}-${file.name}`;
    await env.R2_FINANSE.put(pdfKey, file.stream());

    // 2. Wstaw szkielet do D1
    const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await env.D1.prepare(`
      INSERT INTO dokumenty_finansowe 
      (id, numer, typ, data_wystawienia, kwota_brutto, kontrahent, plik_url, status)
      VALUES (?, ?, 'FAKTURA', ?, ?, ?, ?, 'Do analizy')
    `).bind(
      docId,
      numer,
      data_wystawienia,
      parseFloat(kwota_brutto),
      kontrahent,
      pdfKey
    ).run();

    // 3. Uruchom analizę Gemini
    const analiza = await analyzeWithGemini({
      numer,
      kwota_brutto: parseFloat(kwota_brutto),
      kontrahent,
      data_wystawienia,
      plik_url: pdfKey
    }, env);

    // 4. Zapisz wyniki analizy
    await env.D1.prepare(`
      UPDATE dokumenty_finansowe 
      SET ryzyko_punktowe = ?, poziom_ryzyka = ?, tagi_ryzyka = ?, 
          podsumowanie_ryzyka = ?, model_ai_uzyty = ?, data_analizy = ?,
          status = 'Analizowana'
      WHERE id = ?
    `).bind(
      analiza.ryzyko_punktowe,
      analiza.poziom_ryzyka,
      JSON.stringify(analiza.tagi_ryzyka),
      analiza.podsumowanie_ryzyka,
      'gemini-2.5-flash',
      new Date().toISOString(),
      docId
    ).run();

    return Response.json({
      id: docId,
      status: 'Zimportowany i przeanalizowany',
      analiza: analiza
    });
  }
};
```


### 3. Funkcja analizy Gemini

```ts
// src/ai/geminiRiskAnalyzer.ts
async function analyzeWithGemini(payload: {
  numer: string;
  kwota_brutto: number;
  kontrahent: string;
  data_wystawienia: string;
  plik_url?: string;
}, env: Env) {
  
  const prompt = `
Analizuj ryzyko finansowe dokumentu:

Numer: ${payload.numer}
Kwota brutto: ${payload.kwota_brutto.toLocaleString()} PLN
Kontrahent: ${payload.kontrahent}
Data wystawienia: ${payload.data_wystawienia}

Zwracaj TYLKO JSON:
{
  "ryzyko_punktowe": 0-100,
  "poziom_ryzyka": "Niskie" | "Średnie" | "Wysokie",
  "tagi_ryzyka": ["tag1", "tag2"],
  "podsumowanie_ryzyka": "krótki opis 1-2 zdania"
}

Reguły punktacji:
- 0-30: Niskie (stały kontrahent, niska kwota)
- 31-70: Średnie (nowy klient lub średnia kwota)
- 71-100: Wysokie (duża kwota, nieznany kontrahent)
`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + env.GOOGLE_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.1
      }
    })
  });

  const data = await res.json();
  return JSON.parse(data.candidates[^0].content.parts[^0].text);
}
```


### 4. UI uploader w `DokumentyFinansowe.tsx`

```tsx
function UploaderFaktur() {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[^0];
    if (!file) return;

    const formData = new FormData();
    formData.append('plik', file);
    formData.append('numer', 'FV/03/2026/0012');
    formData.append('kwota_brutto', '2499.99');
    formData.append('kontrahent', 'Jan Kowalski');
    formData.append('data_wystawienia', '2026-03-01');

    const res = await fetch('/api/import-dokumentu', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    toast.success(`Faktura ${result.id} przeanalizowana przez Gemini`);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
      <p>📄 Przeciągnij fakturę PDF/CSV lub</p>
      <input 
        type="file" 
        accept=".pdf,.csv"
        onChange={handleUpload}
        className="mt-2"
      />
      <p className="text-sm text-gray-500 mt-2">
        Automatyczna analiza ryzyka przez Gemini
      </p>
    </div>
  );
}
```

**Przepływ pracy:**

1. Użytkownik wrzuca PDF faktury przez drag \& drop,
2. Worker zapisuje do R2 + szkielet do D1,
3. Automatycznie woła Gemini z danymi dokumentu,
4. Zapisuje wyniki ryzyka do D1,
5. Frontend dostaje gotowy dokument z analizą.

**Docelowo wymienisz Gemini** na lepszy model – wystarczy zmienić `analyzeWithGemini` na `analyzeWithCohere` i pole `model_ai_uzyty`.

Następny krok: endpoint `/api/podsumowanie-finansowe` który bierze dane z dashboard + wysyła do Asystenta AI po polski raport tekstowy?

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

