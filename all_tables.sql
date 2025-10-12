-- Music System Tables
CREATE TABLE music_tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT DEFAULT 'Unknown Album',
  genre TEXT DEFAULT 'Unknown',
  duration INTEGER DEFAULT 0, -- in seconds
  url TEXT NOT NULL,
  artwork TEXT, -- URL to artwork image
  file_size INTEGER,
  play_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0, -- Average rating
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  active INTEGER DEFAULT 1
);

-- Playlists Table
CREATE TABLE music_playlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  track_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  active INTEGER DEFAULT 1
);

-- Playlist Tracks Junction Table
CREATE TABLE playlist_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id TEXT NOT NULL,
  track_id TEXT NOT NULL,
  position INTEGER,
  added_at INTEGER NOT NULL,
  FOREIGN KEY (playlist_id) REFERENCES music_playlists(id),
  FOREIGN KEY (track_id) REFERENCES music_tracks(id),
  UNIQUE(playlist_id, track_id)
);

-- Play History Table
CREATE TABLE music_play_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  track_id TEXT NOT NULL,
  played_at INTEGER NOT NULL,
  duration_played INTEGER, -- How long was played
  completed INTEGER DEFAULT 0, -- 1 if track was played to end
  source TEXT, -- 'library', 'playlist', 'search', etc.
  FOREIGN KEY (track_id) REFERENCES music_tracks(id)
);

-- User Preferences Table
CREATE TABLE music_user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT DEFAULT 'default',
  volume REAL DEFAULT 0.7,
  repeat_mode TEXT DEFAULT 'none',
  shuffle_mode INTEGER DEFAULT 0,
  last_played_track TEXT,
  updated_at INTEGER
);

-- Track Ratings Table
CREATE TABLE music_track_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  track_id TEXT NOT NULL,
  user_id TEXT DEFAULT 'default',
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  rated_at INTEGER NOT NULL,
  FOREIGN KEY (track_id) REFERENCES music_tracks(id),
  UNIQUE(track_id, user_id)
);

-- POLACZEK Agents Tables
CREATE TABLE polaczek_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template TEXT,
  system_prompt TEXT NOT NULL,
  capabilities TEXT, -- JSON array
  icon TEXT DEFAULT '🤖',
  category TEXT DEFAULT 'general',
  created INTEGER NOT NULL,
  active INTEGER DEFAULT 1,
  performance TEXT, -- JSON object
  custom_settings TEXT, -- JSON object
  conversations TEXT DEFAULT '[]' -- JSON array
);

-- Agent Conversations Table
CREATE TABLE agent_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  agent_response TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (agent_id) REFERENCES polaczek_agents(id)
);

-- Agent Templates Table
CREATE TABLE agent_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  capabilities TEXT, -- JSON array
  icon TEXT DEFAULT '🤖',
  category TEXT DEFAULT 'general',
  is_default INTEGER DEFAULT 0
);

-- System Monitoring Table
CREATE TABLE system_monitoring (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  timestamp INTEGER NOT NULL,
  agent_id TEXT DEFAULT 'system'
);

-- Voice System Logs
CREATE TABLE voice_system_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  input_text TEXT,
  output_text TEXT,
  duration INTEGER,
  timestamp INTEGER NOT NULL
);

-- Security Logs
CREATE TABLE security_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  ip_address TEXT,
  timestamp INTEGER NOT NULL
);

-- Crawl Results
CREATE TABLE crawl_results (
  id INTEGER PRIMARY KEY,
  url TEXT,
  title TEXT,
  content TEXT,
  score REAL,
  timestamp INTEGER
);

-- Email Log
CREATE TABLE email_log (
  id INTEGER PRIMARY KEY,
  to_email TEXT,
  subject TEXT,
  status TEXT,
  timestamp INTEGER,
  message_id TEXT
);

-- Business Metrics
CREATE TABLE business_metrics (
  id INTEGER PRIMARY KEY,
  category TEXT,
  data TEXT,
  timestamp INTEGER
);

-- Voice Settings
CREATE TABLE voice_settings (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  transformations TEXT,
  current_voice TEXT,
  command_history TEXT,
  updated_at INTEGER
);

-- Generated Images
CREATE TABLE generated_images (
  id TEXT PRIMARY KEY,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  options TEXT,
  image_data TEXT
);