# 🎯 FLOATING BUTTONS - PRAWDZIWE IMPLEMENTACJE AGENTÓW 01-09

**Akcja**: Implementacja funkcjonalnych agentów floating buttons z prawdziwymi funkcjami  
**Powód**: Wszystkie przyciski muszą działać z realnymi funkcjami zamiast fake data  
**Dalej**: Jeden agent na plik dla przejrzystości i łatwego rozwoju

---

## 🎤 AGENT 01 - VOICE COMMAND SYSTEM

### Istniejący Kod (Linie 780-782 index.astro)

```astro
<button onclick="toggleVoiceAgent()" class="right-btn" id="voiceAgentBtn" title="Agent 01 - Voice Command Agent">
  🎤 AGENT 01 - VOICE
</button>
```

### REAL IMPLEMENTATION - Cloudflare Web Speech API

```javascript
// public/scripts/voice-agent-real.js
class VoiceAgent01 {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.init();
  }

  init() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = "pl-PL";
      this.recognition.onresult = (e) => this.handleVoiceResult(e);
      this.recognition.onend = () => (this.isListening = false);
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
      this.updateStatus("🎤 Słucham...");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateStatus("⏹️ Zatrzymano");
    }
  }

  async handleVoiceResult(event) {
    const transcript =
      event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log(`Rozpoznano: ${transcript}`);

    // Przetwarzanie komend głosowych
    if (transcript.includes("otwórz agent")) {
      const agentNumber = this.extractAgentNumber(transcript);
      if (agentNumber) await this.openAgent(agentNumber);
    } else if (transcript.includes("generuj obraz")) {
      await this.generateImage(transcript);
    } else if (transcript.includes("play muzyka")) {
      await this.playMusic();
    } else if (transcript.includes("system status")) {
      await this.checkSystemStatus();
    }

    this.speak(`Wykonuję: ${transcript}`);
  }

  speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    this.synthesis.speak(utterance);
  }

  async openAgent(number) {
    const agentMap = {
      2: "toggleMusicAgent",
      3: "toggleSystemAgent",
      4: "toggleCrawlerAgent",
      5: "toggleEmailAgent",
      6: "toggleDatabaseAgent",
      7: "toggleContentAgent",
      8: "toggleSecurityAgent",
      9: "toggleAgent09Dyrektor",
    };

    if (agentMap[number] && window[agentMap[number]]) {
      window[agentMap[number]]();
      this.speak(`Otwierając agenta ${number}`);
    }
  }

  extractAgentNumber(text) {
    const matches = text.match(/agent (\d+)|(\d+)/);
    return matches ? matches[1] || matches[2] : null;
  }

  updateStatus(status) {
    const statusEl = document.getElementById("voiceAgentStatus");
    if (statusEl) statusEl.textContent = status;
  }
}

// Global instance
window.voiceAgent01 = new VoiceAgent01();
```

### Widget HTML (Floating Panel)

```html
<div id="voiceAgentWidget" class="floating-widget hidden">
  <div class="floating-widget-template">
    <div class="panel-header">
      <span>🎤 VOICE AGENT 01</span>
      <button onclick="toggleVoiceAgent()">×</button>
    </div>
    <div class="panel-content">
      <div id="voiceAgentStatus">🔇 Gotowy</div>
      <div class="voice-controls">
        <button
          onclick="window.voiceAgent01.startListening()"
          class="voice-btn"
        >
          ▶️ Start
        </button>
        <button onclick="window.voiceAgent01.stopListening()" class="voice-btn">
          ⏹️ Stop
        </button>
      </div>
      <textarea
        id="voiceCommands"
        placeholder="Komendy głosowe pojawią się tutaj..."
        readonly
      ></textarea>
    </div>
  </div>
</div>
```

---

## 🎵 AGENT 02 - MUSIC PLAYER D1 INTEGRATION

### Istniejący Kod (Linie 784-786 index.astro)

```astro
<button onclick="toggleMusicAgent()" class="right-btn" id="musicAgentBtn" title="Agent 02 - Music Control Agent">
  🎵 AGENT 02 - MUSIC
</button>
```

### REAL IMPLEMENTATION - Cloudflare D1 + Audio API

```javascript
// public/scripts/music-agent-real.js
class MusicAgent02 {
  constructor() {
    this.currentAudio = null;
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.volume = 0.7;
    this.init();
  }

  async init() {
    await this.loadPlaylistFromD1();
    this.setupAudioControls();
  }

  async loadPlaylistFromD1() {
    try {
      const response = await fetch("/api/music/playlist", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        this.playlist = data.tracks || [];
        this.updatePlaylistDisplay();
      }
    } catch (error) {
      console.error("Błąd ładowania playlisty z D1:", error);
      // Fallback playlist
      this.playlist = [
        {
          id: 1,
          title: "Ambient Coding",
          url: "/audio/ambient-coding.mp3",
          artist: "AI Generated",
        },
        {
          id: 2,
          title: "Focus Flow",
          url: "/audio/focus-flow.mp3",
          artist: "Synthetic Beats",
        },
      ];
    }
  }

  async play(trackIndex = null) {
    if (trackIndex !== null) this.currentIndex = trackIndex;

    const track = this.playlist[this.currentIndex];
    if (!track) return;

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    this.currentAudio = new Audio(track.url);
    this.currentAudio.volume = this.volume;
    this.currentAudio.onended = () => this.next();

    try {
      await this.currentAudio.play();
      this.isPlaying = true;
      this.updatePlayerDisplay(track);
      await this.logPlayToD1(track.id);
    } catch (error) {
      console.error("Błąd odtwarzania:", error);
    }
  }

  pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.updatePlayerDisplay();
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.play();
  }

  previous() {
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
    this.play();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudio) this.currentAudio.volume = this.volume;
  }

  async logPlayToD1(trackId) {
    try {
      await fetch("/api/music/log-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, timestamp: Date.now() }),
      });
    } catch (error) {
      console.error("Błąd logowania do D1:", error);
    }
  }

  updatePlayerDisplay(track) {
    const display = document.getElementById("musicPlayerDisplay");
    if (display && track) {
      display.innerHTML = `
        <div class="now-playing">
          <div class="track-info">
            <div class="track-title">${track.title}</div>
            <div class="track-artist">${track.artist}</div>
          </div>
          <div class="play-status">${this.isPlaying ? "▶️" : "⏸️"}</div>
        </div>
      `;
    }
  }

  updatePlaylistDisplay() {
    const playlistEl = document.getElementById("musicPlaylist");
    if (playlistEl) {
      playlistEl.innerHTML = this.playlist
        .map(
          (track, i) => `
        <div class="playlist-item ${i === this.currentIndex ? "active" : ""}" 
             onclick="window.musicAgent02.play(${i})">
          <span class="track-title">${track.title}</span>
          <span class="track-artist">${track.artist}</span>
        </div>
      `
        )
        .join("");
    }
  }
}

// Global instance
window.musicAgent02 = new MusicAgent02();
```

### API Endpoint dla D1 Database

```typescript
// src/pages/api/music/playlist.ts
export async function GET({ locals }) {
  try {
    const db = (locals as any)?.runtime?.env?.DB;
    if (!db) throw new Error("D1 Database not available");

    const tracks = await db
      .prepare(
        `
      SELECT id, title, url, artist, duration, created_at 
      FROM music_tracks 
      WHERE active = 1 
      ORDER BY play_count DESC, created_at DESC
    `
      )
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        tracks: tracks.results,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
```

---

## 🤖 AGENT 03 - SYSTEM MONITOR REAL-TIME

### Istniejący Kod (Linie 788-790 index.astro)

```astro
<button onclick="toggleSystemAgent()" class="right-btn" id="systemAgentBtn" title="Agent 03 - System Monitor Agent">
  🤖 AGENT 03 - SYSTEM
</button>
```

### REAL IMPLEMENTATION - Performance API + Workers Monitoring

```javascript
// public/scripts/system-agent-real.js
class SystemAgent03 {
  constructor() {
    this.metrics = {
      memory: { used: 0, total: 0 },
      performance: { fps: 0, timing: 0 },
      network: { requests: 0, errors: 0 },
      workers: { active: 0, total: 0 },
    };
    this.monitoringInterval = null;
    this.init();
  }

  init() {
    this.startMonitoring();
    this.setupHealthChecks();
  }

  startMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.updateDisplay();
    }, 2000);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  collectMetrics() {
    // Memory usage (if available)
    if (performance.memory) {
      this.metrics.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      };
    }

    // Performance timing
    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation) {
      this.metrics.performance.timing = Math.round(
        navigation.loadEventEnd - navigation.fetchStart
      );
    }

    // FPS calculation
    this.calculateFPS();

    // Network requests monitoring
    this.monitorNetworkRequests();
  }

  calculateFPS() {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        this.metrics.performance.fps = Math.round(
          (frameCount * 1000) / (currentTime - lastTime)
        );
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  async monitorNetworkRequests() {
    try {
      const response = await fetch("/api/system/status");
      if (response.ok) {
        const data = await response.json();
        this.metrics.workers = data.workers;
        this.metrics.network.requests++;
      }
    } catch (error) {
      this.metrics.network.errors++;
      console.error("System status error:", error);
    }
  }

  async setupHealthChecks() {
    const endpoints = [
      "/api/health-check",
      "/api/polaczek-chat",
      "/api/image-generator/flux",
      "/api/music/playlist",
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const status = response.ok ? "✅" : "❌";
        this.updateEndpointStatus(endpoint, status);
      } catch (error) {
        this.updateEndpointStatus(endpoint, "❌");
      }
    }
  }

  updateEndpointStatus(endpoint, status) {
    const statusEl = document.getElementById(
      `status-${endpoint.replace(/[^a-zA-Z0-9]/g, "")}`
    );
    if (statusEl) statusEl.textContent = status;
  }

  updateDisplay() {
    const displayEl = document.getElementById("systemMetricsDisplay");
    if (!displayEl) return;

    displayEl.innerHTML = `
      <div class="metrics-grid">
        <div class="metric-item">
          <div class="metric-label">Pamięć</div>
          <div class="metric-value">${this.metrics.memory.used}MB / ${this.metrics.memory.total}MB</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">FPS</div>
          <div class="metric-value">${this.metrics.performance.fps}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Load Time</div>
          <div class="metric-value">${this.metrics.performance.timing}ms</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Network</div>
          <div class="metric-value">${this.metrics.network.requests} req, ${this.metrics.network.errors} err</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Workers</div>
          <div class="metric-value">${this.metrics.workers.active}/${this.metrics.workers.total}</div>
        </div>
      </div>
    `;
  }

  async generateSystemReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
      },
      performance: {
        entries: performance.getEntries().length,
        timing: performance.timing,
      },
    };

    try {
      await fetch("/api/system/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });

      console.log("Raport systemu wysłany:", report);
    } catch (error) {
      console.error("Błąd wysyłania raportu:", error);
    }
  }
}

// Global instance
window.systemAgent03 = new SystemAgent03();
```

---

## ✅ IMPLEMENTACJA W PROJEKCIE

### 1. Dodaj skrypty do index.astro

```astro
<script src="/scripts/voice-agent-real.js"></script>
<script src="/scripts/music-agent-real.js"></script>
<script src="/scripts/system-agent-real.js"></script>
```

### 2. Dodaj widgety do AgentsFloatingManager.astro

### 3. Stwórz API endpoints w src/pages/api/

### 4. Dodaj CSS dla real-time metrics display

**Status**: ✅ GOTOWY DO IMPLEMENTACJI  
**Następnie**: Agenci 04-06 w osobnym pliku
