
## Nowy moduł: CRM Klienci

**Ścieżka:** `/crm-klienci`

**Cel:** Lista klientów, historia interakcji, analiza szans sprzedaży, AI‑lead scoring.

***

### 1. Struktura bazy D1 (CRM)

```sql
-- Klienci
CREATE TABLE klienci (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  nazwa TEXT NOT NULL,
  nip TEXT UNIQUE,
  email TEXT,
  telefon TEXT,
  adres TEXT,
  www TEXT,
  status TEXT CHECK (status IN ('lead', 'konsultacja', 'negocjacje', 'klient', 'nieaktywny')),
  wartosc_potencjalna DECIMAL(12,2) DEFAULT 0,
  szansa_sprzedazy INTEGER DEFAULT 50 CHECK (szansa_sprzedazy BETWEEN 0 AND 100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Interakcje z klientami
CREATE TABLE interakcje_klientow (
  id TEXT PRIMARY KEY,
  klient_id TEXT NOT NULL,
  typ TEXT CHECK (typ IN ('email', 'telefon', 'spotkanie', 'oferta', 'faktura')),
  opis TEXT,
  data DATE NOT NULL,
  wynik TEXT,  -- 'pozytywny', 'negatywny', 'neutralny'
  nastepne_kroki TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(klient_id) REFERENCES klienci(id)
);

-- Oferty handlowe
CREATE TABLE oferty (
  id TEXT PRIMARY KEY,
  klient_id TEXT NOT NULL,
  numer TEXT UNIQUE,
  data DATE NOT NULL,
  wartosc_netto DECIMAL(12,2),
  status TEXT CHECK (status IN ('wyslana', 'zaakceptowana', 'odrzucona', 'w trakcie')),
  plik_pdf TEXT,  -- klucz R2
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(klient_id) REFERENCES klienci(id)
);
```


***

### 2. Endpointy CRM

#### a) `GET /api/crm/klienci`

Lista klientów z metrykami:

```json
{
  "klienci": [
    {
      "id": "klient_123",
      "nazwa": "TechSolutions Sp. z o.o.",
      "status": "negocjacje",
      "wartosc_potencjalna": 25000,
      "szansa_sprzedazy": 75,
      "ostatnia_interakcja": "2026-03-04",
      "liczba_interakcji": 5,
      "lead_score": 82  // AI
    }
  ],
  "statystyki": {
    "lead": 12,
    "klient": 8,
    "wartosc_pipeline": 125000
  }
}
```


#### b) `POST /api/crm/klient/dodaj`

```json
{
  "nazwa": "Nowa Firma Sp. z o.o.",
  "nip": "1234567890",
  "email": "kontakt@firma.pl",
  "status": "lead"
}
```


#### c) `POST /api/crm/ai/lead-scoring`

AI‑analiza szansy sprzedaży:

```json
{
  "klient_id": "klient_123",
  "historia_interakcji": [...],
  "lead_score": 82,
  "rekomendacje": ["Zadzwoń w tym tygodniu", "Wyślij ofertę"],
  "szacowana_wartosc": 25000
}
```


***

### 3. UI `/crm-klienci` – layout

```
Nagłówek: "CRM – Klienci i pipeline sprzedaży"

1. KPI cards (4 szt.):
   • Liczba leadów
   • Aktywni klienci  
   • Wartość pipeline
   • Szansa konwersji (%)

2. Tabela klientów (sortable):
   | Nazwa | Status | Wartość pot. | Szansa % | Ostatnia aktywność | Lead Score | Akcje |
   |-------|--------|--------------|----------|-------------------|------------|-------|

3. Panel prawy – szczegóły klienta (kliknięcie wiersza):
   • Dane kontaktowe
   • Historia interakcji (timeline)
   • Oferty wysłane
   • AI Lead Score + rekomendacje

4. Szybkie akcje:
   [+ Nowy klient] [Import CSV] [AI analiza pipeline]
```


### 4. Kluczowe funkcje AI w CRM

#### a) Lead Scoring (`POST /api/crm/ai/lead-scoring`)

**Core prompt:**

```text
Jesteś specjalistą ds. sprzedaży B2B. Oceń szansę konwersji klienta.

DANE KLIENTA:
${JSON.stringify(klient_data)}

HISTORIA INTERAKCJI (${interakcje.length}):
${interakcje.map(i => `${i.data}: ${i.typ} - ${i.wynik}`).join('\n')}

ZADANIE:
1. Lead Score 0–100 (0 = martwy lead, 100 = podpisze jutro)
2. 3 rekomendacje następnych kroków
3. Szacowana wartość kontraktu

FORMAT JSON:
{
  "lead_score": 82,
  "rekomendacje": ["Zadzwoń", "Wyślij ofertę", "Umów demo"],
  "szacowana_wartosc": 25000,
  "uzasadnienie": "krótkie wyjaśnienie"
}
```


#### b) Generator wiadomości do klienta

**Używa `/api/ai/execute`** z core promptem „asystent sprzedaży”.

#### c) Analiza pipeline (`POST /api/crm/ai/pipeline`)

```json
{
  "wartosc_pipeline": 125000,
  "srednia_szansa": 45,
  "rekomendacje": ["Skup się na 3 dużych leadach", "Zautomatyzuj follow-upy"]
}
```


***

### 5. Endpointy szczegółowe

#### Lista klientów + paginacja

```
GET /api/crm/klienci?page=1&limit=20&status=lead&sort=lead_score
```


#### Historia interakcji

```
GET /api/crm/klient/:id/interakcje
POST /api/crm/klient/:id/interakcja  // dodaj telefon/email
```


#### AI analiza klienta

```
POST /api/crm/klient/:id/ai-analiza
```


***

### 6. UI komponenty

#### a) `KlienciLista.tsx`

```tsx
// Sortable table z lead score kolorami
<tr className={`lead-row ${leadScore > 80 ? 'bg-green-50' : ''}`}>
  <td>{klient.nazwa}</td>
  <td><Badge status={klient.status} /></td>
  <td>{formatPLN(klient.wartosc_potencjalna)}</td>
  <td><Progress value={klient.szansa_sprzedazy} /></td>
  <td>{klient.ostatnia_interakcja}</td>
  <td className="lead-score font-bold">
    {klient.lead_score}/100
  </td>
  <td>
    <button>✏️ Edytuj</button>
    <button>📞 Zadzwoń</button>
    <button>🤖 AI analiza</button>
  </td>
</tr>
```


#### b) `KlientSzczegoly.tsx` (prawy panel)

```
Dane kontaktowe ↑

📈 Lead Score: 82/100 [🔥 gorący lead]

📋 Historia interakcji:
• 2026-03-04: Email oferta → pozytywny
• 2026-03-02: Telefon → zainteresowany demo

💰 Oferty:
• OF/03/2026/001 → 25k PLN → w trakcie

🤖 AI rekomendacje:
• Zadzwoń w poniedziałek
• Wyślij personalizowaną ofertę
• Umów 30min demo
```


#### c) Szybkie akcje (top bar)

```
[+ Nowy klient] [Import z CSV] [Eksport pipeline] [AI analiza wszystkich leadów]
```


***

**Co daje moduł CRM:**

- ✅ Lista klientów z lead scoring AI,
- ✅ Historia interakcji (timeline),
- ✅ Pipeline sprzedaży z wartościami i szansami,
- ✅ Generator wiadomości i ofert przez `/api/ai/execute`,
- ✅ Automatyczne rekomendacje następnych kroków.

**Chcesz kod konkretnego endpointu** (`/api/crm/ai/lead-scoring`) czy **UI layout** `KlienciLista.tsx`?

