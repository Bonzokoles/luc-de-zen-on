-- Cloudflare D1 Database Schema for mybonzo.com
-- Utworzono: 2025-11-06
-- Tabela: Użytkownicy / Sesje
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Tabela: Kalkulacje biznesowe
CREATE TABLE IF NOT EXISTS calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT NOT NULL,
  -- 'margin', 'vat', 'roi', 'profit'
  input_data TEXT NOT NULL,
  -- JSON z danymi wejściowymi
  result_data TEXT NOT NULL,
  -- JSON z wynikami
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Tabela: Generowane treści (AI)
CREATE TABLE IF NOT EXISTS generated_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  content_type TEXT NOT NULL,
  -- 'post', 'email', 'document'
  prompt TEXT NOT NULL,
  generated_text TEXT NOT NULL,
  model TEXT DEFAULT 'gemini-pro',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Tabela: Zadania (Organizer)
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'pending',
  -- 'pending', 'completed'
  due_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Tabela: Faktury
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  invoice_number TEXT NOT NULL,
  seller_data TEXT NOT NULL,
  -- JSON
  buyer_data TEXT NOT NULL,
  -- JSON
  items TEXT NOT NULL,
  -- JSON array
  total_net REAL NOT NULL,
  total_vat REAL NOT NULL,
  total_gross REAL NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'draft',
  -- 'draft', 'sent', 'paid'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Tabela: Chat history z AI
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  role TEXT NOT NULL,
  -- 'user', 'assistant'
  content TEXT NOT NULL,
  model TEXT DEFAULT 'gemini-pro',
  tokens_used INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_calculations_user ON calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_user ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_id);
-- ============================================================
-- SPECIALIST AI TABLES (dodane 2026-02-16)
-- Pełna migracja: migrations/001_specialist_tables.sql
-- ============================================================
-- CRM
CREATE TABLE IF NOT EXISTS klienci (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  nazwa TEXT NOT NULL,
  email TEXT,
  telefon TEXT,
  typ TEXT DEFAULT 'lead',
  segment TEXT,
  wartosc_zyciowa REAL DEFAULT 0,
  ostatni_kontakt TEXT,
  notatki TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS interakcje_klientow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  klient_id TEXT NOT NULL,
  firma_id TEXT NOT NULL,
  typ TEXT NOT NULL,
  opis TEXT,
  data TEXT DEFAULT (datetime('now')),
  wynik TEXT,
  pracownik TEXT
);
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
-- MAGAZYN
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
CREATE TABLE IF NOT EXISTS ruchy_magazynowe (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produkt_id TEXT NOT NULL,
  firma_id TEXT NOT NULL,
  typ TEXT NOT NULL,
  ilosc INTEGER NOT NULL,
  wartosc REAL,
  dokument TEXT,
  notatki TEXT,
  data TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS magazyn_ai_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firma_id TEXT NOT NULL,
  zadanie TEXT NOT NULL,
  wynik TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);
-- SEO
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
CREATE TABLE IF NOT EXISTS rekomendacje_seo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  strona_id TEXT NOT NULL,
  firma_id TEXT NOT NULL,
  priorytet TEXT DEFAULT 'WAŻNE',
  kategoria TEXT,
  opis TEXT NOT NULL,
  propozycja TEXT,
  impact TEXT DEFAULT 'średni',
  status TEXT DEFAULT 'nowa',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS crawle_seo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  strona_id TEXT NOT NULL,
  firma_id TEXT NOT NULL,
  crawl_data TEXT,
  seo_score INTEGER,
  content_hash TEXT,
  crawl_time TEXT DEFAULT (datetime('now'))
);
-- PROJEKTY
CREATE TABLE IF NOT EXISTS projekty (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  nazwa TEXT NOT NULL,
  opis TEXT,
  status TEXT DEFAULT 'aktywny',
  priorytet TEXT DEFAULT 'normalny',
  deadline TEXT,
  budzet REAL,
  klient_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS zadania_projektow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projekt_id TEXT NOT NULL,
  firma_id TEXT NOT NULL,
  nazwa TEXT NOT NULL,
  opis TEXT,
  pracownik_id TEXT,
  priorytet INTEGER DEFAULT 2,
  status TEXT DEFAULT 'todo',
  deadline TEXT,
  godziny_szacowane REAL,
  godziny_faktyczne REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS uzytkownicy (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  imie TEXT NOT NULL,
  email TEXT,
  rola TEXT DEFAULT 'pracownik',
  stanowisko TEXT,
  aktywny INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
-- CONTENT
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
CREATE TABLE IF NOT EXISTS opisy_produktow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produkt_id TEXT NOT NULL,
  firma_id TEXT NOT NULL,
  jezyk TEXT DEFAULT 'pl',
  tytul TEXT,
  tresc TEXT,
  meta_description TEXT,
  keywords TEXT,
  tone TEXT DEFAULT 'sprzedazowy',
  ai_model TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
-- FINANSE
CREATE TABLE IF NOT EXISTS finanse_miesieczne (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firma_id TEXT NOT NULL,
  okres TEXT NOT NULL,
  rok INTEGER NOT NULL,
  miesiac INTEGER,
  kwartal INTEGER,
  przychod REAL DEFAULT 0,
  koszt REAL DEFAULT 0,
  zysk REAL DEFAULT 0,
  marza_proc REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS finanse_transakcje (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firma_id TEXT NOT NULL,
  typ TEXT NOT NULL,
  kategoria TEXT,
  kwota REAL NOT NULL,
  opis TEXT,
  kontrahent TEXT,
  data TEXT NOT NULL,
  dokument_nr TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
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
-- MEGA-AGENT
CREATE TABLE IF NOT EXISTS mega_agent_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firma_id TEXT NOT NULL,
  zadanie TEXT NOT NULL,
  routing TEXT,
  agents_used TEXT,
  final_answer TEXT,
  processing_time_ms INTEGER,
  model_used TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);