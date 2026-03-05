<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Kompletny SQL schema dla D1 – wszystkie tabele finansowe

Kopiuj-wklej do `wrangler d1 execute mybonzo --file=d1-finanse-schema.sql --remote`.[^1]

```sql
-- ========== MYBONZO FINANSE - kompletny schema D1 ==========
-- 2026-03-03 | Cloudflare D1 + R2

-- Tabela 1: Transakcje (przychody/koszty)
CREATE TABLE IF NOT EXISTS transakcje_finansowe (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'meblepumo',
  data DATE NOT NULL,
  kwota DECIMAL(18,2) NOT NULL,
  waluta TEXT DEFAULT 'PLN',
  kierunek TEXT CHECK (kierunek IN ('PRZYCHÓD', 'KOSZT', 'PRZENIESIENIE')),
  kategoria TEXT NOT NULL,               -- SPRZEDAZ, MARKETING, LOGISTYKA
  podkategoria TEXT,                     -- FB Ads, InPost, ZUS
  kontrahent TEXT,
  kontrahent_id TEXT,
  projekt_id TEXT,
  status TEXT DEFAULT 'Planowane' CHECK (status IN ('Planowane', 'Oczekujące', 'Zaksięgowano', 'Anulowane')),
  sposob_platnosci TEXT,
  zrodlo_systemu TEXT DEFAULT 'Ręczny',  -- IdoSell, CSV, Integracja
  opis TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 2: Dokumenty finansowe z analizą ryzyka
CREATE TABLE IF NOT EXISTS dokumenty_finansowe (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'meblepumo',
  numer TEXT UNIQUE NOT NULL,
  typ TEXT NOT NULL CHECK (typ IN ('Faktura', 'Proforma', 'Umowa', 'Oferta', 'Zwrot')),
  data_wystawienia DATE NOT NULL,
  termin_platnosci DATE,
  waluta TEXT DEFAULT 'PLN',
  kwota_netto DECIMAL(18,2),
  kwota_brutto DECIMAL(18,2),
  stawka_vat DECIMAL(5,2),
  kontrahent TEXT NOT NULL,
  kontrahent_id TEXT,
  projekt_id TEXT,
  status TEXT DEFAULT 'Wysłana' CHECK (status IN ('Szkic', 'Wysłana', 'Zapłacona', 'Przeterminowana', 'Anulowana')),
  plik_url TEXT,                         -- R2: dokumenty/FV_001.pdf
  zrodlo TEXT DEFAULT 'Upload',
  
  -- Analiza ryzyka AI
  ryzyko_punktowe INTEGER CHECK (ryzyko_punktowe BETWEEN 0 AND 100),
  poziom_ryzyka TEXT CHECK (poziom_ryzyka IN ('Niskie', 'Średnie', 'Wysokie')),
  tagi_ryzyka TEXT,                      -- JSON array
  podsumowanie_ryzyka TEXT,
  model_ai TEXT DEFAULT 'gemini-2.5-flash',
  data_analizy DATETIME,
  
  uwagi TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 3: Koszty szczegółowe
CREATE TABLE IF NOT EXISTS koszty (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'meblepumo',
  data DATE NOT NULL,
  kwota DECIMAL(18,2) NOT NULL,
  waluta TEXT DEFAULT 'PLN',
  typ TEXT DEFAULT 'Zmienne' CHECK (typ IN ('Stałe', 'Zmienne')),
  kategoria TEXT NOT NULL CHECK (kategoria IN ('Marketing', 'Logistyka', 'Pracownicy', 'Dostawcy', 'Administracja')),
  podkategoria TEXT,
  kontrahent TEXT,
  kontrahent_id TEXT,
  projekt_id TEXT,
  opis TEXT,
  zrodlo_systemu TEXT DEFAULT 'Ręczny',
  status TEXT DEFAULT 'Oczekujące' CHECK (status IN ('Planowane', 'Zapłacone', 'Oczekujące')),
  stawka_vat DECIMAL(5,2),
  kwota_netto DECIMAL(18,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexy wydajnościowe
CREATE INDEX IF NOT EXISTS idx_transakcje_tenant_data ON transakcje_finansowe(tenant_id, data);
CREATE INDEX IF NOT EXISTS idx_transakcje_kategoria ON transakcje_finansowe(tenant_id, kategoria);
CREATE INDEX IF NOT EXISTS idx_dokumenty_ryzyko ON dokumenty_finansowe(tenant_id, poziom_ryzyka);
CREATE INDEX IF NOT EXISTS idx_dokumenty_status ON dokumenty_finansowe(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_koszty_kategoria ON koszty(tenant_id, kategoria);
CREATE INDEX IF NOT EXISTS idx_koszty_data ON koszty(tenant_id, data);

-- Widoki pomocnicze
CREATE VIEW IF NOT EXISTS v_kpi_miesieczne AS
SELECT 
  strftime('%Y-%m', data) as miesiac,
  SUM(CASE WHEN kierunek = 'PRZYCHÓD' THEN kwota ELSE 0 END) as przychody,
  SUM(CASE WHEN kierunek = 'KOSZT' THEN kwota ELSE 0 END) as koszty,
  SUM(CASE WHEN kierunek = 'PRZYCHÓD' THEN kwota ELSE -kwota END) as cashflow
FROM transakcje_finansowe 
WHERE tenant_id = 'meblepumo'
GROUP BY miesiac
ORDER BY miesiac DESC;

CREATE VIEW IF NOT EXISTS v_ryzykowne_dokumenty AS
SELECT *,
  CASE 
    WHEN termin_platnosci < date('now') THEN 
      julianday('now') - julianday(termin_platnosci)
    ELSE 0 
  END as dni_przeterminowania
FROM dokumenty_finansowe 
WHERE tenant_id = 'meblepumo' 
  AND poziom_ryzyka IN ('Wysokie', 'Średnie')
  AND status IN ('Wysłana', 'Przeterminowana')
ORDER BY dni_przeterminowania DESC, ryzyko_punktowe DESC;
```


### 2. Quick start – dane testowe (realistyczne dla Pumo)

```sql
-- Przykładowe dane startowe (możesz usunąć po pierwszym imporcie)
INSERT INTO transakcje_finansowe (id, data, kwota, kierunek, kategoria, kontrahent, status) VALUES
('trx_001', '2026-03-01', 2499.99, 'PRZYCHÓD', 'Sprzedaż', 'Jan Kowalski', 'Zaksięgowano'),
('trx_002', '2026-03-01', 1500.00, 'KOSZT', 'Marketing', 'Meta Platforms', 'Zaksięgowano'),
('trx_003', '2026-03-02', 1800.50, 'PRZYCHÓD', 'Sprzedaż', 'Anna Nowak', 'Zaksięgowano');

INSERT INTO koszty (id, data, kwota, kategoria, kontrahent, status) VALUES
('cost_001', '2026-03-01', 1200.00, 'Logistyka', 'InPost', 'Zapłacone'),
('cost_002', '2026-03-01', 300.00, 'Dostawcy', 'Hurtownia Mebli XYZ', 'Zapłacone');

INSERT INTO dokumenty_finansowe (id, numer, data_wystawienia, kwota_brutto, kontrahent, status, ryzyko_punktowe, poziom_ryzyka) VALUES
('doc_001', 'FV/03/2026/0012', '2026-03-01', 2499.99, 'Jan Kowalski', 'Wysłana', 72, 'Średnie');
```


### 3. Sprawdzanie – kluczowe zapytania

```sql
-- Dashboard KPI (ostatnie 30 dni)
SELECT 
  COUNT(*) as liczba_transakcji,
  SUM(CASE WHEN kierunek='PRZYCHÓD' THEN kwota ELSE 0 END) as przychody,
  SUM(CASE WHEN kierunek='KOSZT' THEN kwota ELSE 0 END) as koszty
FROM transakcje_finansowe 
WHERE date(data) >= date('now', '-30 days');

-- Ryzykowne dokumenty
SELECT * FROM v_ryzykowne_dokumenty LIMIT 5;

-- Koszty po kategoriach
SELECT kategoria, SUM(kwota) as total 
FROM koszty WHERE status='Zapłacone' 
GROUP BY kategoria ORDER BY total DESC;
```

**Masz komplet:**

- ✅ 3 główne tabele + widoki,
- ✅ Indexy wydajności,
- ✅ Przykładowe dane startowe,
- ✅ Kluczowe zapytania testowe.

**Deploy:**

```bash
wrangler d1 execute mybonzo --file=d1-finanse-schema.sql --remote
```

Wszystkie endpointy (`/api/finanse/dashboard`, `/api/dokumenty-finansowe`, `/api/rentownosc`) będą działać od razu po tej strukturze. Powodzenia z wdrożeniem – daj znać jak poszło! 🚀

<div align="center">⁂</div>

[^1]: MODULY_I_NARZEDZIA.md

