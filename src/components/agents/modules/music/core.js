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

export default musicAgent;