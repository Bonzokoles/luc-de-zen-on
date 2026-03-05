-- ========================================================
-- MYBONZO NARZĘDZIA — Schema D1 (konfiguracja AI)
-- 2026-06-16 | Cloudflare D1
-- Deploy: wrangler d1 execute mybonzo --file=src/db/d1-narzedzia-schema.sql --remote
-- ========================================================
-- Tabela 1: Firmy (tenant/company context)
CREATE TABLE IF NOT EXISTS firmy (
    id TEXT PRIMARY KEY,
    nazwa TEXT NOT NULL,
    opis TEXT,
    -- ogólny opis firmy (do promptów AI)
    branza TEXT,
    -- branża (e-commerce, usługi IT, produkcja...)
    jezyk_domyslny TEXT DEFAULT 'pl',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Tabela 2: Modele AI przypisane do firmy
CREATE TABLE IF NOT EXISTS firmy_modele_ai (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    nazwa_logiczna TEXT NOT NULL,
    -- 'domyslny', 'szybki', 'dokladny', 'ekonomiczny'
    provider TEXT NOT NULL,
    -- 'openai', 'google', 'deepseek', 'cloudflare'
    model_id TEXT NOT NULL,
    -- np. 'gpt-4o', 'gemini-2.5-flash', 'deepseek-chat'
    aktywny INTEGER DEFAULT 1,
    kolejnosc INTEGER DEFAULT 0,
    -- priorytet przy model='auto'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(firma_id) REFERENCES firmy(id)
);
-- Tabela 3: Kontekst narzędzia dla firmy
CREATE TABLE IF NOT EXISTS firmy_narzedzia_kontekst (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    narzedzie TEXT NOT NULL,
    -- 'generator_tresci', 'asystent_email', 'kreator_dokumentow', ...
    system_prompt TEXT,
    -- nadpisanie / rozszerzenie core promptu
    ustawienia TEXT,
    -- JSON: preferowany model, ton, język, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(firma_id) REFERENCES firmy(id)
);
-- Indeksy
CREATE INDEX IF NOT EXISTS idx_firmy_modele_firma ON firmy_modele_ai(firma_id, aktywny);
CREATE INDEX IF NOT EXISTS idx_firmy_kontekst_firma ON firmy_narzedzia_kontekst(firma_id, narzedzie);
-- ========================================================
-- Domyślna firma (tenant: meblepumo)
-- ========================================================
INSERT
    OR IGNORE INTO firmy (id, nazwa, opis, branza, jezyk_domyslny)
VALUES (
        'meblepumo',
        'Meble PUMO',
        'Polska firma meblowa — e-commerce, produkcja mebli tapicerowanych i skrzyniowych.',
        'e-commerce / meble',
        'pl'
    );
-- Domyślne modele AI
INSERT
    OR IGNORE INTO firmy_modele_ai (
        id,
        firma_id,
        nazwa_logiczna,
        provider,
        model_id,
        kolejnosc
    )
VALUES (
        'm_pumo_1',
        'meblepumo',
        'domyslny',
        'google',
        'gemini-2.5-flash',
        0
    ),
    (
        'm_pumo_2',
        'meblepumo',
        'szybki',
        'google',
        'gemini-2.5-flash',
        1
    ),
    (
        'm_pumo_3',
        'meblepumo',
        'dokladny',
        'openai',
        'gpt-4o',
        2
    ),
    (
        'm_pumo_4',
        'meblepumo',
        'ekonomiczny',
        'deepseek',
        'deepseek-chat',
        3
    );