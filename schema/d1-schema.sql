-- MyBonzo Agents Database Schema
-- Baza danych dla systemu agentów z pełną integracją

-- Tabela piosenek/utworów dla Music Assistant
CREATE TABLE IF NOT EXISTS music_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  genre TEXT,
  duration INTEGER, -- w sekundach
  file_path TEXT,
  url TEXT,
  source TEXT DEFAULT 'manual', -- manual, youtube, spotify, etc.
  added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  play_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE,
  metadata TEXT -- JSON z dodatkowymi danymi
);

-- Tabela playlist
CREATE TABLE IF NOT EXISTS playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  agent_id TEXT -- który agent stworzył
);

-- Relacja playlist - utwory
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id INTEGER,
  track_id INTEGER,
  position INTEGER,
  added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id),
  FOREIGN KEY (track_id) REFERENCES music_library(id)
);

-- Tabela dla Voice Commands history
CREATE TABLE IF NOT EXISTS voice_commands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  command TEXT NOT NULL,
  recognized_text TEXT,
  action_taken TEXT,
  target_agent TEXT,
  success BOOLEAN DEFAULT TRUE,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  language TEXT DEFAULT 'pl-PL'
);

-- Tabela dla System Monitoring logs
CREATE TABLE IF NOT EXISTS system_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL,
  log_level TEXT DEFAULT 'INFO', -- DEBUG, INFO, WARN, ERROR
  message TEXT NOT NULL,
  data TEXT, -- JSON z dodatkowymi danymi
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela dla Web Crawler results
CREATE TABLE IF NOT EXISTS crawl_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  extracted_data TEXT, -- JSON
  status INTEGER DEFAULT 200,
  crawl_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_config TEXT -- JSON z konfiguracją crawlera
);

-- Tabela dla File Manager operations
CREATE TABLE IF NOT EXISTS file_operations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation_type TEXT NOT NULL, -- upload, delete, move, etc.
  file_path TEXT NOT NULL,
  destination_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id TEXT
);

-- Tabela dla Database queries history
CREATE TABLE IF NOT EXISTS query_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_text TEXT NOT NULL,
  database_name TEXT DEFAULT 'default',
  execution_time INTEGER, -- w milisekundach
  rows_affected INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id TEXT
);

-- Tabela dla Email operations
CREATE TABLE IF NOT EXISTS email_operations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation_type TEXT NOT NULL, -- send, receive, process
  recipient TEXT,
  sender TEXT,
  subject TEXT,
  body_preview TEXT, -- pierwsze 200 znaków
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id TEXT
);

-- Tabela dla Security events
CREATE TABLE IF NOT EXISTS security_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL, -- threat_detected, auth_failure, scan_completed
  severity TEXT DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
  description TEXT NOT NULL,
  source_ip TEXT,
  user_agent TEXT,
  blocked BOOLEAN DEFAULT FALSE,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id TEXT
);

-- Tabela dla SEO/Webmaster data
CREATE TABLE IF NOT EXISTS seo_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  page_title TEXT,
  meta_description TEXT,
  keywords TEXT, -- JSON array
  performance_score INTEGER, -- 0-100
  seo_score INTEGER, -- 0-100
  issues TEXT, -- JSON array
  recommendations TEXT, -- JSON array
  analysis_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id TEXT
);

-- Tabela dla Analytics data
CREATE TABLE IF NOT EXISTS analytics_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_source TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  dimensions TEXT, -- JSON z dodatkowymi wymiarami
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  agent_id TEXT
);

-- Tabela dla Polish NLP/Translation cache
CREATE TABLE IF NOT EXISTS translation_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_text TEXT NOT NULL,
  target_language TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  confidence REAL DEFAULT 1.0,
  translation_engine TEXT DEFAULT 'polaczek',
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  usage_count INTEGER DEFAULT 1
);

-- Tabela dla Agent orchestration logs
CREATE TABLE IF NOT EXISTS agent_communications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_agent TEXT NOT NULL,
  target_agent TEXT NOT NULL,
  message_type TEXT NOT NULL, -- delegation, response, error
  payload TEXT, -- JSON
  success BOOLEAN DEFAULT TRUE,
  response_time INTEGER, -- w milisekundach
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_music_library_artist ON music_library(artist);
CREATE INDEX IF NOT EXISTS idx_music_library_genre ON music_library(genre);
CREATE INDEX IF NOT EXISTS idx_voice_commands_timestamp ON voice_commands(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_agent ON system_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_crawl_results_url ON crawl_results(url);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_translation_cache_source ON translation_cache(source_text);

-- Wstawianie przykładowych danych dla Music Library
INSERT OR IGNORE INTO music_library (title, artist, album, genre, duration, source) VALUES
('Chill Beats #1', 'AI Generated', 'Background Music', 'Electronic', 180, 'ai_generated'),
('Focus Music', 'Ambient Sounds', 'Productivity', 'Ambient', 240, 'ai_generated'),
('Morning Energy', 'Upbeat AI', 'Daily Rhythms', 'Pop', 200, 'ai_generated'),
('Night Relax', 'Calm AI', 'Sleep Collection', 'Ambient', 300, 'ai_generated');

-- Wstawianie przykładowej playlisty
INSERT OR IGNORE INTO playlists (name, description, agent_id) VALUES
('Default Coding Playlist', 'Muzyka do programowania', 'music-control'),
('Focus Session', 'Muzyka do koncentracji', 'music-control'),
('Relax Time', 'Muzyka relaksacyjna', 'music-control');

-- Przypisanie utworów do domyślnej playlisty
INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_id, position) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 2, 1),
(2, 4, 2),
(3, 4, 1);

-- Przykładowe logi systemu
INSERT OR IGNORE INTO system_logs (agent_id, log_level, message) VALUES
('voice-command', 'INFO', 'Voice recognition initialized'),
('music-control', 'INFO', 'Music library loaded'),
('system-monitor', 'INFO', 'System monitoring started'),
('polaczek', 'INFO', 'Polish NLP engine initialized');