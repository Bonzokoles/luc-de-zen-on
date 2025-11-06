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
  type TEXT NOT NULL, -- 'margin', 'vat', 'roi', 'profit'
  input_data TEXT NOT NULL, -- JSON z danymi wejściowymi
  result_data TEXT NOT NULL, -- JSON z wynikami
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela: Generowane treści (AI)
CREATE TABLE IF NOT EXISTS generated_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  content_type TEXT NOT NULL, -- 'post', 'email', 'document'
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
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'pending', -- 'pending', 'completed'
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
  seller_data TEXT NOT NULL, -- JSON
  buyer_data TEXT NOT NULL, -- JSON
  items TEXT NOT NULL, -- JSON array
  total_net REAL NOT NULL,
  total_vat REAL NOT NULL,
  total_gross REAL NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'paid'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela: Chat history z AI
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  role TEXT NOT NULL, -- 'user', 'assistant'
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
