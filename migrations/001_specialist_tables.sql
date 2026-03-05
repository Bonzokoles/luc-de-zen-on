-- ============================================================
-- MYBONZO D1 Migration 001: Specialist AI Tables
-- 18 nowych tabel wymaganych przez AI Specialist endpointy
-- Utworzono: 2026-02-16
-- ============================================================
-- ─── CRM ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS klienci (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    nazwa TEXT NOT NULL,
    email TEXT,
    telefon TEXT,
    typ TEXT DEFAULT 'lead',
    -- 'lead' | 'klient' | 'vip' | 'churned'
    segment TEXT,
    wartosc_zyciowa REAL DEFAULT 0,
    ostatni_kontakt TEXT,
    notatki TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_klienci_firma ON klienci(firma_id);
CREATE INDEX IF NOT EXISTS idx_klienci_typ ON klienci(firma_id, typ);
CREATE TABLE IF NOT EXISTS interakcje_klientow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    klient_id TEXT NOT NULL,
    firma_id TEXT NOT NULL,
    typ TEXT NOT NULL,
    -- 'email' | 'telefon' | 'spotkanie' | 'oferta' | 'notatka'
    opis TEXT,
    data TEXT DEFAULT (datetime('now')),
    wynik TEXT,
    pracownik TEXT,
    FOREIGN KEY (klient_id) REFERENCES klienci(id)
);
CREATE INDEX IF NOT EXISTS idx_interakcje_klient ON interakcje_klientow(klient_id);
CREATE INDEX IF NOT EXISTS idx_interakcje_firma ON interakcje_klientow(firma_id);
CREATE TABLE IF NOT EXISTS crm_ai_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id TEXT NOT NULL,
    klient_id TEXT,
    zadanie TEXT NOT NULL,
    wynik TEXT,
    model_used TEXT,
    tokens_used INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_crm_sessions_firma ON crm_ai_sessions(firma_id);
-- ─── MAGAZYN ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produkty_magazyn (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    nazwa TEXT NOT NULL,
    kod TEXT,
    kategoria TEXT,
    jednostka TEXT DEFAULT 'szt',
    cena_jednostkowa REAL DEFAULT 0,
    minimalny_stan INTEGER DEFAULT 0,
    aktualny_stan INTEGER DEFAULT 0,
    dostawca TEXT,
    lead_time_dni INTEGER DEFAULT 7,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_produkty_mag_firma ON produkty_magazyn(firma_id);
CREATE INDEX IF NOT EXISTS idx_produkty_mag_kod ON produkty_magazyn(firma_id, kod);
CREATE TABLE IF NOT EXISTS ruchy_magazynowe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produkt_id TEXT NOT NULL,
    firma_id TEXT NOT NULL,
    typ TEXT NOT NULL,
    -- 'przyjecie' | 'wydanie' | 'korekta' | 'inwentaryzacja'
    ilosc INTEGER NOT NULL,
    wartosc REAL,
    dokument TEXT,
    notatki TEXT,
    data TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (produkt_id) REFERENCES produkty_magazyn(id)
);
CREATE INDEX IF NOT EXISTS idx_ruchy_produkt ON ruchy_magazynowe(produkt_id);
CREATE INDEX IF NOT EXISTS idx_ruchy_firma ON ruchy_magazynowe(firma_id);
CREATE TABLE IF NOT EXISTS magazyn_ai_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id TEXT NOT NULL,
    zadanie TEXT NOT NULL,
    wynik TEXT,
    model_used TEXT,
    tokens_used INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mag_sessions_firma ON magazyn_ai_sessions(firma_id);
-- ─── SEO ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS strony_seo (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    url TEXT NOT NULL,
    tytul TEXT,
    meta_opis TEXT,
    seo_score INTEGER DEFAULT 0,
    ostatni_crawl TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_strony_firma ON strony_seo(firma_id);
CREATE INDEX IF NOT EXISTS idx_strony_url ON strony_seo(firma_id, url);
CREATE TABLE IF NOT EXISTS rekomendacje_seo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strona_id TEXT NOT NULL,
    firma_id TEXT NOT NULL,
    priorytet TEXT DEFAULT 'WAŻNE',
    -- 'PILNE' | 'WAŻNE' | 'OPC'
    kategoria TEXT,
    -- 'title' | 'meta' | 'content' | 'speed' | 'mobile' | 'geo' | 'tech'
    opis TEXT NOT NULL,
    propozycja TEXT,
    impact TEXT DEFAULT 'średni',
    -- 'wysoki' | 'średni' | 'niski'
    status TEXT DEFAULT 'nowa',
    -- 'nowa' | 'wdrozona' | 'odrzucona'
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (strona_id) REFERENCES strony_seo(id)
);
CREATE INDEX IF NOT EXISTS idx_rekom_strona ON rekomendacje_seo(strona_id);
CREATE INDEX IF NOT EXISTS idx_rekom_firma ON rekomendacje_seo(firma_id);
CREATE TABLE IF NOT EXISTS crawle_seo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strona_id TEXT NOT NULL,
    firma_id TEXT NOT NULL,
    crawl_data TEXT,
    -- JSON: wyniki crawla
    seo_score INTEGER,
    content_hash TEXT,
    crawl_time TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (strona_id) REFERENCES strony_seo(id)
);
CREATE INDEX IF NOT EXISTS idx_crawle_strona ON crawle_seo(strona_id);
-- ─── PROJEKTY ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projekty (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    nazwa TEXT NOT NULL,
    opis TEXT,
    status TEXT DEFAULT 'aktywny',
    -- 'planowanie' | 'aktywny' | 'testy' | 'zamrozony' | 'zakonczony'
    priorytet TEXT DEFAULT 'normalny',
    -- 'niski' | 'normalny' | 'wysoki' | 'pilny'
    deadline TEXT,
    budzet REAL,
    klient_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_projekty_firma ON projekty(firma_id);
CREATE INDEX IF NOT EXISTS idx_projekty_status ON projekty(firma_id, status);
CREATE TABLE IF NOT EXISTS zadania_projektow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projekt_id TEXT NOT NULL,
    firma_id TEXT NOT NULL,
    nazwa TEXT NOT NULL,
    opis TEXT,
    pracownik_id TEXT,
    priorytet INTEGER DEFAULT 2,
    -- 1=pilny, 2=normalny, 3=niski
    status TEXT DEFAULT 'todo',
    -- 'todo' | 'in_progress' | 'review' | 'done'
    deadline TEXT,
    godziny_szacowane REAL,
    godziny_faktyczne REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (projekt_id) REFERENCES projekty(id)
);
CREATE INDEX IF NOT EXISTS idx_zadania_projekt ON zadania_projektow(projekt_id);
CREATE INDEX IF NOT EXISTS idx_zadania_pracownik ON zadania_projektow(pracownik_id);
CREATE TABLE IF NOT EXISTS uzytkownicy (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    imie TEXT NOT NULL,
    email TEXT,
    rola TEXT DEFAULT 'pracownik',
    -- 'admin' | 'manager' | 'pracownik'
    stanowisko TEXT,
    aktywny INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_uzytkownicy_firma ON uzytkownicy(firma_id);
-- ─── CONTENT ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produkty (
    id TEXT PRIMARY KEY,
    firma_id TEXT NOT NULL,
    nazwa TEXT NOT NULL,
    kategoria TEXT,
    cena REAL,
    opis_krotki TEXT,
    zdjecie_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_produkty_firma ON produkty(firma_id);
CREATE TABLE IF NOT EXISTS opisy_produktow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produkt_id TEXT NOT NULL,
    firma_id TEXT NOT NULL,
    jezyk TEXT DEFAULT 'pl',
    tytul TEXT,
    tresc TEXT,
    meta_description TEXT,
    keywords TEXT,
    -- JSON array
    tone TEXT DEFAULT 'sprzedazowy',
    ai_model TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (produkt_id) REFERENCES produkty(id)
);
CREATE INDEX IF NOT EXISTS idx_opisy_produkt ON opisy_produktow(produkt_id);
CREATE INDEX IF NOT EXISTS idx_opisy_firma ON opisy_produktow(firma_id);
-- ─── FINANSE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finanse_miesieczne (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id TEXT NOT NULL,
    okres TEXT NOT NULL,
    -- 'miesiac' | 'kwartal' | 'rok'
    rok INTEGER NOT NULL,
    miesiac INTEGER,
    -- 1-12 (null dla rocznych)
    kwartal INTEGER,
    -- 1-4 (null dla miesięcznych)
    przychod REAL DEFAULT 0,
    koszt REAL DEFAULT 0,
    zysk REAL DEFAULT 0,
    marza_proc REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fin_mies_firma ON finanse_miesieczne(firma_id);
CREATE INDEX IF NOT EXISTS idx_fin_mies_okres ON finanse_miesieczne(firma_id, rok, miesiac);
CREATE TABLE IF NOT EXISTS finanse_transakcje (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id TEXT NOT NULL,
    typ TEXT NOT NULL,
    -- 'przychod' | 'koszt' | 'transfer'
    kategoria TEXT,
    kwota REAL NOT NULL,
    opis TEXT,
    kontrahent TEXT,
    data TEXT NOT NULL,
    dokument_nr TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fin_trans_firma ON finanse_transakcje(firma_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_data ON finanse_transakcje(firma_id, data);
CREATE INDEX IF NOT EXISTS idx_fin_trans_kat ON finanse_transakcje(firma_id, kategoria);
CREATE TABLE IF NOT EXISTS finanse_ai_analizy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id TEXT NOT NULL,
    zadanie TEXT NOT NULL,
    okres TEXT,
    wynik TEXT,
    model_used TEXT,
    tokens_used INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fin_analizy_firma ON finanse_ai_analizy(firma_id);
-- ─── MEGA-AGENT ORCHESTRATOR ────────────────────────────
CREATE TABLE IF NOT EXISTS mega_agent_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firma_id TEXT NOT NULL,
    zadanie TEXT NOT NULL,
    routing TEXT,
    -- JSON: routing decision
    agents_used TEXT,
    -- JSON array: specialist names
    final_answer TEXT,
    processing_time_ms INTEGER,
    model_used TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mega_firma ON mega_agent_sessions(firma_id);