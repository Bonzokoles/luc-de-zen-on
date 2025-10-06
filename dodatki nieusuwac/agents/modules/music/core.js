// music-functions.js - Funkcje dla Music Agent
// Zarządzanie odtwarzaczem muzyki i kontrolą dźwięku

class MusicAgentFunctions {
  constructor() {
    this.isPlaying = false;
    this.currentTrack = null;
    this.playlist = [];
    this.currentIndex = 0;
    this.audioContext = null;
    this.audioElement = null;
    this.init();
  }

  init() {
    console.log("🎵 Initializing Music Agent Functions...");
    this.setupAudioContext();
    this.createAudioElement();
    
    // Integracja z przyciskami po prawej stronie
    this.bindToRightPanel();
  }

  bindToRightPanel() {
    // Podłącz funkcje do global scope dla prawego panelu
    window.musicAgent = this;
    
    // Toggle music agent functions
    window.toggleMusicAgent = () => this.toggleWidget();
    window.playMusic = () => this.play();
    window.pauseMusic = () => this.pause();
    window.nextTrack = () => this.nextTrack();
    window.searchMusic = () => this.searchMusic();
    window.generatePlaylist = () => this.generatePlaylist();
    window.clearMusicAgent = () => this.clearAgent();
    
    console.log("🎵 Music Agent bound to right panel");
  }

  toggleWidget() {
    console.log("🎵 Toggle Music Agent Widget");
    
    // Znajdź lub stwórz widget
    let widget = document.getElementById('musicAgentPanel');
    const button = document.getElementById('musicAgentBtn');
    
    if (!widget) {
      // Stwórz nowy widget
      widget = this.createWidget();
      document.body.appendChild(widget);
    }
    
    // Toggle widoczności
    if (widget.style.display === 'none' || !widget.style.display) {
      widget.style.display = 'block';
      if (button) button.style.background = 'linear-gradient(45deg, #9333ea, #4ade80)';
      console.log("🎵 Music Agent Panel opened");
    } else {
      widget.style.display = 'none';
      if (button) button.style.background = '';
      console.log("🎵 Music Agent Panel closed");
    }
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.id = 'musicAgentPanel';
    widget.className = 'agent-panel';
    widget.innerHTML = `
      <div class="agent-panel-header">
        <span>🎵 MUSIC CONTROL AGENT</span>
        <button onclick="window.musicAgent.toggleWidget()" class="close-btn">×</button>
      </div>
      <div class="agent-panel-content">
        <div class="agent-controls">
          <button onclick="window.musicAgent.play()" class="agent-btn primary">▶ Play</button>
          <button onclick="window.musicAgent.pause()" class="agent-btn secondary">⏸ Pause</button>
          <button onclick="window.musicAgent.nextTrack()" class="agent-btn accent">⏭ Next</button>
        </div>
        <textarea id="musicInput" placeholder="Wpisz nazwę utworu, artystę lub gatunek..." class="agent-input"></textarea>
        <div class="agent-actions">
          <button onclick="window.musicAgent.searchMusic()" class="agent-btn primary">🔍 Szukaj</button>
          <button onclick="window.musicAgent.generatePlaylist()" class="agent-btn accent">📜 Playlista</button>
          <button onclick="window.musicAgent.clearAgent()" class="agent-btn secondary">🧹 Wyczyść</button>
        </div>
        <div id="musicResponse" class="agent-response" style="display:none;"></div>
      </div>
    `;
    
    // Style inline dla widgetu
    widget.style.cssText = `
      position: fixed;
      right: 20px;
      top: 120px;
      width: 350px;
      max-height: 500px;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid #9333ea;
      border-radius: 8px;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 8px 32px rgba(147, 51, 234, 0.3);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: none;
      overflow-y: auto;
    `;
    
    return widget;
  }

  play() {
    console.log("🎵 Playing music");
    this.isPlaying = true;
    const response = document.getElementById('musicResponse');
    if (response) {
      response.style.display = 'block';
      response.innerHTML = '<strong>▶ Odtwarzanie:</strong><br>🎵 Muzyka włączona<br>Status: Playing';
    }
  }

  pause() {
    console.log("⏸ Pausing music");
    this.isPlaying = false;
    const response = document.getElementById('musicResponse');
    if (response) {
      response.style.display = 'block';
      response.innerHTML = '<strong>⏸ Pauza:</strong><br>🎵 Muzyka zatrzymana<br>Status: Paused';
    }
  }

  nextTrack() {
    console.log("⏭ Next track");
    const response = document.getElementById('musicResponse');
    if (response) {
      response.style.display = 'block';
      response.innerHTML = '<strong>⏭ Następny utwór:</strong><br>🎵 Przełączanie...<br>Status: Loading next track';
    }
  }

  searchMusic() {
    console.log("🔍 Searching music");
    const input = document.getElementById('musicInput');
    const response = document.getElementById('musicResponse');
    
    if (input && response) {
      const query = input.value.trim();
      if (query) {
        response.style.display = 'block';
        response.innerHTML = `<strong>🔍 Wyszukiwanie:</strong><br>"${query}"<br><br>🎵 Szukam utworów...`;
      }
    }
  }

  generatePlaylist() {
    console.log("📜 Generating playlist");
    const input = document.getElementById('musicInput');
    const response = document.getElementById('musicResponse');
    
    if (input && response) {
      const genre = input.value.trim() || 'Mixed';
      response.style.display = 'block';
      response.innerHTML = `<strong>📜 Generuję playlistę:</strong><br>Gatunek: ${genre}<br><br>🎵 Tworzenie playlisty w toku...`;
    }
  }

  clearAgent() {
    console.log("🧹 Clearing music agent");
    const input = document.getElementById('musicInput');
    const response = document.getElementById('musicResponse');
    
    if (input) input.value = '';
    if (response) {
      response.innerHTML = '';
      response.style.display = 'none';
    }
  }

  setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log("🎶 Audio context created");
    } catch (error) {
      console.warn("⚠️ Could not create audio context:", error);
    }
  }

  createAudioElement() {
    this.audioElement = document.createElement('audio');
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.preload = 'metadata';
    
    this.audioElement.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.audioElement.addEventListener('loadstart', () => {
      this.updateMusicStatus("Ładowanie...");
    });

    this.audioElement.addEventListener('canplay', () => {
      this.updateMusicStatus("Gotowy");
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error("❌ Audio error:", e);
      this.showMusicError("Błąd odtwarzania");
    });

    console.log("🎧 Audio element created");
  }

  // Główne funkcje kontroli muzyki
  playMusic() {
    console.log("▶ Play music...");
    
    if (!this.currentTrack && this.playlist.length === 0) {
      this.showMusicError("Brak utworów do odtworzenia");
      return;
    }

    if (!this.currentTrack && this.playlist.length > 0) {
      this.loadTrack(this.playlist[0]);
    }

    if (this.audioElement && this.currentTrack) {
      this.audioElement.play()
        .then(() => {
          this.isPlaying = true;
          this.updateMusicStatus("Odtwarza");
          this.displayMusicResult(`▶ Odtwarzanie: ${this.currentTrack.title || 'Nieznany utwór'}`);
        })
        .catch(error => {
          console.error("❌ Play error:", error);
          this.showMusicError("Nie można odtworzyć");
        });
    }
  }

  pauseMusic() {
    console.log("⏸ Pause music...");
    
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
      this.updateMusicStatus("Wstrzymany");
      this.displayMusicResult("⏸ Muzyka wstrzymana");
    }
  }

  nextTrack() {
    console.log("⏭ Next track...");
    
    if (this.playlist.length === 0) {
      this.showMusicError("Brak playlisty");
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadTrack(this.playlist[this.currentIndex]);
    
    if (this.isPlaying) {
      this.playMusic();
    }
  }

  searchMusic() {
    const query = document.getElementById('musicAgentInput').value.trim();
    
    if (!query) {
      this.showMusicError("Wpisz nazwę utworu lub artystę");
      return;
    }

    console.log("🔍 Searching music:", query);
    this.displayMusicResult(`🔍 Szukam: "${query}"`);

    // Symulacja wyszukiwania (można podłączyć prawdziwe API)
    setTimeout(() => {
      const mockResults = [
        { title: `${query} - Mix 1`, artist: "Various Artists", duration: "3:42", url: null },
        { title: `${query} - Remix`, artist: "DJ Unknown", duration: "4:18", url: null },
        { title: `${query} - Cover`, artist: "Indie Band", duration: "3:25", url: null }
      ];

      this.displaySearchResults(mockResults);
    }, 1500);
  }

  generatePlaylist() {
    const query = document.getElementById('musicAgentInput').value.trim();
    
    console.log("📝 Generating playlist for:", query || "random");
    this.displayMusicResult("🎵 Generowanie playlisty...");

    // Symulacja generowania playlisty
    setTimeout(() => {
      const mockPlaylist = [
        { title: "Ambient Chill", artist: "Relaxing Sounds", duration: "5:32", url: null },
        { title: "Focus Flow", artist: "Study Music", duration: "4:15", url: null },
        { title: "Deep Work", artist: "Concentration", duration: "6:20", url: null },
        { title: "Calm Waves", artist: "Nature Mix", duration: "4:45", url: null }
      ];

      this.playlist = mockPlaylist;
      this.currentIndex = 0;
      this.displayMusicResult(`📝 Playlista utworzona: ${mockPlaylist.length} utworów`);
    }, 2000);
  }

  clearMusicAgent() {
    console.log("🧹 Clearing music agent...");
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    this.isPlaying = false;
    this.currentTrack = null;
    this.playlist = [];
    this.currentIndex = 0;

    document.getElementById('musicAgentInput').value = '';
    
    const response = document.getElementById('musicAgentResponse');
    if (response) {
      response.textContent = '';
      response.style.display = 'none';
    }

    this.updateMusicStatus("Gotowy");
  }

  toggleMusicMode() {
    const modes = ['Gotowy', 'Shuffle', 'Repeat', 'Radio'];
    const currentBtn = document.getElementById('musicStatusBtn');
    
    if (currentBtn) {
      const currentMode = currentBtn.textContent;
      const currentIndex = modes.indexOf(currentMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      currentBtn.textContent = modes[nextIndex];
      
      console.log(`🔄 Music mode changed to: ${modes[nextIndex]}`);
      this.displayMusicResult(`🎵 Tryb: ${modes[nextIndex]}`);
    }
  }

  // Pomocnicze funkcje
  loadTrack(track) {
    if (!track || !this.audioElement) return;

    this.currentTrack = track;
    
    if (track.url) {
      this.audioElement.src = track.url;
      this.audioElement.load();
    }

    console.log("🎵 Track loaded:", track.title);
  }

  displaySearchResults(results) {
    let resultsHTML = "🔍 Wyniki wyszukiwania:<br>";
    results.forEach((track, index) => {
      resultsHTML += `${index + 1}. ${track.title} - ${track.artist} (${track.duration})<br>`;
    });

    this.displayMusicResult(resultsHTML);
    
    // Dodaj pierwszy wynik do aktualnego utworu dla testów
    if (results.length > 0) {
      this.currentTrack = results[0];
    }
  }

  updateMusicStatus(status) {
    const statusBtn = document.getElementById('musicStatusBtn');
    if (statusBtn) {
      statusBtn.textContent = status;
    }
  }

  displayMusicResult(text) {
    const response = document.getElementById('musicAgentResponse');
    if (response) {
      response.innerHTML = text;
      response.style.display = 'block';
    }
  }

  showMusicError(message) {
    console.error("❌ Music Agent Error:", message);
    this.displayMusicResult(`❌ Błąd: ${message}`);
  }
}

// Inicjalizacja i export
const musicAgent = new MusicAgentFunctions();

// Export funkcji do globalnego scope
window.playMusic = () => musicAgent.playMusic();
window.pauseMusic = () => musicAgent.pauseMusic();
window.nextTrack = () => musicAgent.nextTrack();
window.searchMusic = () => musicAgent.searchMusic();
window.generatePlaylist = () => musicAgent.generatePlaylist();
window.clearMusicAgent = () => musicAgent.clearMusicAgent();
window.toggleMusicMode = () => musicAgent.toggleMusicMode();

console.log("✅ Music Agent Functions loaded and exported globally");

export { MusicAgentFunctions };
export default MusicAgentFunctions;