-- ========================================================
-- MYBONZO FINANSE — Kompletny schema D1
-- 2026-03-03 | Cloudflare D1 + R2
-- Deploy: wrangler d1 execute mybonzo --file=src/db/d1-finanse-schema.sql --remote
-- ========================================================
-- Tabela 1: Transakcje finansowe (przychody / koszty)
CREATE TABLE IF NOT EXISTS transakcje_finansowe (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'meblepumo',
    data DATE NOT NULL,
    kwota DECIMAL(18, 2) NOT NULL,
    waluta TEXT DEFAULT 'PLN',
    kierunek TEXT NOT NULL CHECK (
        kierunek IN ('PRZYCHÓD', 'KOSZT', 'PRZENIESIENIE')
    ),
    kategoria TEXT NOT NULL,
    -- SPRZEDAZ, MARKETING, LOGISTYKA
    podkategoria TEXT,
    -- FB Ads, InPost, ZUS
    kontrahent TEXT,
    kontrahent_id TEXT,
    -- ID z CRM
    projekt_id TEXT,
    -- powiązanie z modułem projekty
    dokument_id TEXT,
    -- powiązanie z dokumenty_finansowe
    status TEXT DEFAULT 'Planowane' CHECK (
        status IN (
            'Planowane',
            'Oczekujące',
            'Zaksięgowano',
            'Anulowane'
        )
    ),
    sposob_platnosci TEXT,
    -- Przelew, Karta, Gotówka, Bramka
    zrodlo_systemu TEXT DEFAULT 'Ręczny',
    -- IdoSell, CSV, Integracja, Ręczny
    opis TEXT,
    meta TEXT,
    -- JSON: dodatkowe pola
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Tabela 2: Dokumenty finansowe z analizą ryzyka Gemini
CREATE TABLE IF NOT EXISTS dokumenty_finansowe (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'meblepumo',
    numer TEXT UNIQUE NOT NULL,
    typ TEXT NOT NULL CHECK (
        typ IN (
            'Faktura',
            'Proforma',
            'Umowa',
            'Oferta',
            'Zwrot',
            'Nota'
        )
    ),
    data_wystawienia DATE NOT NULL,
    termin_platnosci DATE,
    waluta TEXT DEFAULT 'PLN',
    kwota_netto DECIMAL(18, 2),
    kwota_brutto DECIMAL(18, 2),
    stawka_vat DECIMAL(5, 2),
    kontrahent TEXT NOT NULL,
    kontrahent_id TEXT,
    -- z CRM
    projekt_id TEXT,
    status TEXT DEFAULT 'Wysłana' CHECK (
        status IN (
            'Szkic',
            'Wysłana',
            'Zapłacona',
            'Przeterminowana',
            'Anulowana'
        )
    ),
    plik_url TEXT,
    -- R2 key: dokumenty/FV_001.pdf
    zrodlo TEXT DEFAULT 'Upload',
    -- Upload, GeneratorFaktur, Integracja
    -- Analiza ryzyka AI (Gemini)
    ryzyko_punktowe INTEGER CHECK (
        ryzyko_punktowe BETWEEN 0 AND 100
    ),
    poziom_ryzyka TEXT CHECK (
        poziom_ryzyka IN ('Niskie', 'Średnie', 'Wysokie')
    ),
    tagi_ryzyka TEXT,
    -- JSON array: ["nowy_klient","duza_kwota"]
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
    kwota DECIMAL(18, 2) NOT NULL,
    waluta TEXT DEFAULT 'PLN',
    typ TEXT DEFAULT 'Zmienne' CHECK (typ IN ('Stałe', 'Zmienne')),
    kategoria TEXT NOT NULL CHECK (
        kategoria IN (
            'Marketing',
            'Logistyka',
            'Pracownicy',
            'Dostawcy',
            'Administracja'
        )
    ),
    podkategoria TEXT,
    -- FB Ads, InPost, ZUS
    kontrahent TEXT,
    kontrahent_id TEXT,
    projekt_id TEXT,
    opis TEXT,
    zrodlo_systemu TEXT DEFAULT 'Ręczny',
    status TEXT DEFAULT 'Oczekujące' CHECK (
        status IN ('Planowane', 'Zapłacone', 'Oczekujące')
    ),
    stawka_vat DECIMAL(5, 2),
    kwota_netto DECIMAL(18, 2),
    meta TEXT,
    -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Tabela 4: Snapshoty KPI (cache agregacji)
CREATE TABLE IF NOT EXISTS kpi_snapshots (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL DEFAULT 'meblepumo',
    data_snapshot DATE NOT NULL,
    granulacja TEXT DEFAULT 'DZIEN' CHECK (granulacja IN ('DZIEN', 'TYDZIEN', 'MIESIAC')),
    nazwa_kpi TEXT NOT NULL,
    -- cashflow, przychody, koszty, marza
    wartosc DECIMAL(18, 2) NOT NULL,
    waluta TEXT DEFAULT 'PLN',
    dodatkowy_json TEXT,
    -- rozbicie per kanał, kategoria
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- ========== INDEXY WYDAJNOŚCIOWE ==========
CREATE INDEX IF NOT EXISTS idx_transakcje_tenant_data ON transakcje_finansowe(tenant_id, data);
CREATE INDEX IF NOT EXISTS idx_transakcje_kierunek ON transakcje_finansowe(tenant_id, kierunek);
CREATE INDEX IF NOT EXISTS idx_transakcje_kategoria ON transakcje_finansowe(tenant_id, kategoria);
CREATE INDEX IF NOT EXISTS idx_transakcje_status ON transakcje_finansowe(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_dokumenty_tenant_data ON dokumenty_finansowe(tenant_id, data_wystawienia);
CREATE INDEX IF NOT EXISTS idx_dokumenty_ryzyko ON dokumenty_finansowe(tenant_id, poziom_ryzyka);
CREATE INDEX IF NOT EXISTS idx_dokumenty_status ON dokumenty_finansowe(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_dokumenty_kontrahent ON dokumenty_finansowe(tenant_id, kontrahent);
CREATE INDEX IF NOT EXISTS idx_koszty_kategoria ON koszty(tenant_id, kategoria);
CREATE INDEX IF NOT EXISTS idx_koszty_data ON koszty(tenant_id, data);
CREATE INDEX IF NOT EXISTS idx_koszty_status ON koszty(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_kpi_tenant_data ON kpi_snapshots(tenant_id, data_snapshot);
-- ========== WIDOKI POMOCNICZE ==========
CREATE VIEW IF NOT EXISTS v_kpi_miesieczne AS
SELECT strftime('%Y-%m', data) as miesiac,
    tenant_id,
    SUM(
        CASE
            WHEN kierunek = 'PRZYCHÓD' THEN kwota
            ELSE 0
        END
    ) as przychody,
    SUM(
        CASE
            WHEN kierunek = 'KOSZT' THEN kwota
            ELSE 0
        END
    ) as koszty,
    SUM(
        CASE
            WHEN kierunek = 'PRZYCHÓD' THEN kwota
            ELSE - kwota
        END
    ) as cashflow,
    COUNT(*) as liczba_transakcji
FROM transakcje_finansowe
GROUP BY miesiac,
    tenant_id
ORDER BY miesiac DESC;
CREATE VIEW IF NOT EXISTS v_ryzykowne_dokumenty AS
SELECT *,
    CASE
        WHEN termin_platnosci < date('now') THEN CAST(
            julianday('now') - julianday(termin_platnosci) AS INTEGER
        )
        ELSE 0
    END as dni_przeterminowania
FROM dokumenty_finansowe
WHERE poziom_ryzyka IN ('Wysokie', 'Średnie')
    AND status IN ('Wysłana', 'Przeterminowana')
ORDER BY dni_przeterminowania DESC,
    ryzyko_punktowe DESC;
-- ========== DANE STARTOWE (seed) ==========
INSERT
    OR IGNORE INTO transakcje_finansowe (
        id,
        data,
        kwota,
        kierunek,
        kategoria,
        kontrahent,
        status
    )
VALUES (
        'trx_001',
        '2026-03-01',
        2499.99,
        'PRZYCHÓD',
        'Sprzedaż',
        'Jan Kowalski',
        'Zaksięgowano'
    ),
    (
        'trx_002',
        '2026-03-01',
        1500.00,
        'KOSZT',
        'Marketing',
        'Meta Platforms',
        'Zaksięgowano'
    ),
    (
        'trx_003',
        '2026-03-02',
        1800.50,
        'PRZYCHÓD',
        'Sprzedaż',
        'Anna Nowak',
        'Zaksięgowano'
    ),
    (
        'trx_004',
        '2026-03-02',
        800.00,
        'KOSZT',
        'Logistyka',
        'InPost',
        'Zaksięgowano'
    ),
    (
        'trx_005',
        '2026-03-03',
        3200.00,
        'PRZYCHÓD',
        'Sprzedaż',
        'Firma ABC Sp.z o.o.',
        'Zaksięgowano'
    ),
    (
        'trx_006',
        '2026-03-03',
        950.00,
        'KOSZT',
        'Dostawcy',
        'Hurtownia Mebli XYZ',
        'Zaksięgowano'
    );
INSERT
    OR IGNORE INTO koszty (id, data, kwota, kategoria, kontrahent, status)
VALUES (
        'cost_001',
        '2026-03-01',
        1200.00,
        'Logistyka',
        'InPost',
        'Zapłacone'
    ),
    (
        'cost_002',
        '2026-03-01',
        1500.00,
        'Marketing',
        'Meta Platforms',
        'Zapłacone'
    ),
    (
        'cost_003',
        '2026-03-02',
        300.00,
        'Dostawcy',
        'Hurtownia Mebli XYZ',
        'Zapłacone'
    ),
    (
        'cost_004',
        '2026-03-02',
        4000.00,
        'Pracownicy',
        'Pracownicy',
        'Zapłacone'
    );
INSERT
    OR IGNORE INTO dokumenty_finansowe (
        id,
        numer,
        typ,
        data_wystawienia,
        termin_platnosci,
        kwota_brutto,
        kwota_netto,
        kontrahent,
        status,
        ryzyko_punktowe,
        poziom_ryzyka,
        podsumowanie_ryzyka
    )
VALUES (
        'doc_001',
        'FV/03/2026/0012',
        'Faktura',
        '2026-03-01',
        '2026-03-15',
        2499.99,
        2032.51,
        'Jan Kowalski',
        'Wysłana',
        72,
        'Średnie',
        'Nowy klient, wysoka kwota, termin 14 dni.'
    ),
    (
        'doc_002',
        'FV/03/2026/0013',
        'Faktura',
        '2026-03-02',
        '2026-03-30',
        1800.50,
        1463.00,
        'Anna Nowak',
        'Zapłacona',
        15,
        'Niskie',
        'Stały klient, dobra historia płatności.'
    ),
    (
        'doc_003',
        'OF/03/2026/0005',
        'Oferta',
        '2026-03-03',
        NULL,
        12000.00,
        9756.10,
        'Firma XYZ Sp.z o.o.',
        'Wysłana',
        85,
        'Wysokie',
        'Brak historii, bardzo wysoka kwota, brak NIP.'
    );