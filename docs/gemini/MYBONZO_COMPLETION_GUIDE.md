# 🚀 MyBonzo Completion Guide

This document provides a complete guide to getting the MyBonzo application fully functional. It includes instructions for setting up the database, configuring the application, and implementing the remaining features.

## 🎯 1. D1 Database Setup

### 1.1. Create a New D1 Database

First, you need to create a new D1 database named `mybonzo-app-db`. You can do this by running the following command in your terminal:

```bash
wrangler d1 create mybonzo-app-db
```

### 1.2. Create the Database Schema

Next, you need to create a new SQL file named `mybonzo_schema.sql` with the following content:

```sql
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
```

### 1.3. Execute the SQL Schema

Once you have created the `mybonzo_schema.sql` file, you can execute it to create the tables in the new D1 database by running the following command:

```bash
wrangler d1 execute mybonzo-app-db --file=mybonzo_schema.sql
```

## ⚙️ 2. `wrangler.toml` Configuration

Next, you need to update the `wrangler.toml` file to use the new D1 database. Replace the existing `[[d1_databases]]` section with the following:

```toml
[[d1_databases]]
binding = "DB"
database_name = "mybonzo-app-db"
database_id = "<YOUR_DATABASE_ID>"
```

Replace `<YOUR_DATABASE_ID>` with the actual ID of the `mybonzo-app-db` database, which you can get from the output of the `wrangler d1 create` command.

## 🎵 3. Music Player Implementation

To implement the `localStorage` persistence for the music player, you need to modify the `public/scripts/floating-buttons-real.js` file. Add the following functions to the `MyBonzoFloatingButtons` class:

```javascript
  saveMusicPlayerSettings(musicPlayer) {
    localStorage.setItem('musicPlayerSettings', JSON.stringify({
      volume: musicPlayer.volume,
      isShuffle: musicPlayer.isShuffle,
      isRepeat: musicPlayer.isRepeat,
    }));
  }

  loadMusicPlayerSettings(musicPlayer) {
    const savedSettings = JSON.parse(localStorage.getItem('musicPlayerSettings'));
    if (savedSettings) {
      musicPlayer.volume = savedSettings.volume || 0.7;
      musicPlayer.isShuffle = savedSettings.isShuffle || false;
      musicPlayer.isRepeat = savedSettings.isRepeat || false;
    }
  }
```

Then, call `loadMusicPlayerSettings` in the `initMusicPlayer` function, and call `saveMusicPlayerSettings` whenever a setting is changed.

## 🖼️ 4. Output Windows and Data Persistence

This is a checklist of all the functions and agents that need to be verified for output windows and data persistence:

- [ ] **Agent 01 - Voice Command:** The voice command agent should have a clear output window that displays the recognized command and the AI's response.
- [ ] **Agent 02 - Music Player:** The music player should have a persistent playlist and user settings.
- [ ] **Agent 03 - System Monitor:** The system monitor should have a real-time display of the system metrics.
- [ ] **Agent 04 - Web Crawler:** The web crawler should display the crawled results in a clear and organized way.
- [ ] **Agent 05 - Email Manager:** The email manager should have an inbox and outbox view, and it should be able to save email templates.
- [ ] **Agent 06 - Database Query:** The database query agent should have a query editor, a results view, and a query history.
- [ ] **Agent 07 - Content Creator:** The content creator should have a content editor and a list of generated content.
- [ ] **Agent 08 - Security Guard:** The security guard should have a real-time log of security events and a list of detected threats.
- [ ] **Agent 09 - Business Director:** The business director should have a dashboard with business metrics, KPIs, and reports.
- [ ] **POLACZEK 23 Agents:** The agent builder should be able to create, edit, and delete agents, and the agents should be persisted in the D1 database.

## 🧪 5. Testing

Finally, you need to test all the functionality of the application to ensure that everything is working correctly. Here's a comprehensive testing plan:

- **Floating Buttons:** Click on each floating button and verify that it opens the correct widget or performs the correct action.
- **Agents:** Test each agent individually to ensure that it is functioning correctly.
- **Image Generator:** Test all the image generation models and verify that they are generating real images.
- **Voice System:** Test the voice recognition and synthesis, as well as the voice commands.
- **Music Player:** Test the music player's functionality, including the playlist, user settings, and D1 integration.
- **Admin Dashboard:** Test all the features of the admin dashboard, including the user management, agent management, and system monitoring.
