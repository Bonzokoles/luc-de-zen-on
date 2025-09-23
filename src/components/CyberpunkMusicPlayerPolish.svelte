<script>
  import { onMount } from "svelte";

  let audio;
  let audioCtx;
  let analyserNode;
  let mediaSource;
  let playlist = [];
  let libraries = [];
  let currentTrack = 0;
  let currentLibrary = 0;
  let isPlaying = false;
  let volume = 0.5;
  let currentTime = 0;
  let duration = 0;
  let showPlaylist = false;
  let showLibraries = false;
  let trackName = "Nie wybrano utworu";
  let libraryName = "Główna Biblioteka";
  let isLoading = false;

  // Visualizer variables
  let visualizerCanvas;
  let visualizerCtx;
  let animationId;
  let dataArray;
  let bufferLength;
  let layer1Active = false;
  let layer2Active = false;
  let layer3Active = false;
  let layerActivationTimer;

  onMount(() => {
    loadLibraries();
    setupVisualizer();

    // Global API with Polish commands
    if (typeof window !== "undefined") {
      delete window.CYBER_MUSIC_PL;

      window.CYBER_MUSIC_PL = {
        graj: () => {
          if (!isPlaying) togglePlay();
        },
        pauza: () => {
          if (isPlaying) togglePlay();
        },
        przelacz: () => togglePlay(),
        nastepny: () => nextTrack(),
        poprzedni: () => previousTrack(),
        pokaz_biblioteki: () => toggleLibraries(),
        pokaz_playliste: () => togglePlaylist(),
        ustaw_glosnosc: (v) => {
          const nv = Math.max(0, Math.min(1, Number(v)));
          volume = nv;
          if (audio) audio.volume = volume;
        },
        stan: () => ({ isPlaying, trackName, libraryName, volume }),
        analizator: () => analyserNode || null,
      };

      console.log("🎵 CYBER MUSIC POLSKA API zarejestrowany");
    }
  });

  function setupVisualizer() {
    if (!visualizerCanvas) return;
    
    visualizerCtx = visualizerCanvas.getContext('2d');
    visualizerCanvas.width = 300;
    visualizerCanvas.height = 150;
  }

  function setupAnalyser() {
    try {
      if (!audio || analyserNode) return;
      
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      
      audioCtx = new Ctx();
      
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }
      
      mediaSource = audioCtx.createMediaElementSource(audio);
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.8;
      
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      mediaSource.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);
      
      window.dispatchEvent(new CustomEvent("cyber-music-analyser-ready"));
      
    } catch (e) {
      console.warn("setupAnalyser failed", e);
    }
  }

  function loadLibraries() {
    libraries = [
      {
        name: "Główna Biblioteka",
        description: "Podstawowa kolekcja muzyki cyberpunk",
        tracks: [
          { 
            name: "Cyber Puls", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            artist: "Cyfrowe Marzenia",
            working: true,
            genre: "Synthwave"
          },
          { 
            name: "Neonowe Noce", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            artist: "Fala Synth",
            working: true,
            genre: "Darksynth"
          },
          { 
            name: "Przepływ Matrix", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            artist: "Biegacz Kodu",
            working: true,
            genre: "Cyberpunk"
          }
        ]
      },
      {
        name: "Biblioteka R1",
        description: "Zaawansowana kolekcja elektroniczna",
        tracks: [
          { 
            name: "Elektryczne Sny", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            artist: "Future Bass",
            working: true,
            genre: "Electronic"
          },
          { 
            name: "Strumień Danych", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            artist: "Binarna Dusza",
            working: true,
            genre: "IDM"
          },
          { 
            name: "Neon Grid", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            artist: "Hologram",
            working: true,
            genre: "Retrowave"
          }
        ]
      },
      {
        name: "Polska Cyberpunk",
        description: "Polskie utwory w stylu cyberpunk",
        tracks: [
          { 
            name: "Warszawa 2077", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
            artist: "Cyber Polska",
            working: true,
            genre: "Polish Cyber"
          },
          { 
            name: "Krakowski Neon", 
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            artist: "Retro Pierogi",
            working: true,
            genre: "Polish Synth"
          }
        ]
      }
    ];
    
    playlist = libraries[0].tracks;
    libraryName = libraries[0].name;
    updateTrackInfo();
  }

  function updateTrackInfo() {
    if (playlist[currentTrack]) {
      trackName = playlist[currentTrack].name;
      if (audio && playlist[currentTrack].url) {
        isLoading = true;
        audio.src = playlist[currentTrack].url;
        audio.volume = volume;
        
        audio.addEventListener('loadeddata', () => {
          isLoading = false;
          setupAnalyser();
        });
        
        audio.addEventListener('error', (e) => {
          isLoading = false;
          console.error('Audio load error:', e);
          if (currentTrack < playlist.length - 1) {
            nextTrack();
          }
        });
      }
    }
  }

  function togglePlay() {
    if (!playlist[currentTrack]) {
      loadLibraries();
      return;
    }
    
    if (!audio.src) {
      updateTrackInfo();
    }
    
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      stopVisualizerLayers();
    } else {
      isLoading = true;
      setupAnalyser();
      
      audio.play()
        .then(() => {
          isPlaying = true;
          isLoading = false;
          startVisualizerLayers();
          animate();
          try {
            if (audioCtx && audioCtx.state === "suspended") {
              audioCtx.resume();
            }
          } catch {}
        })
        .catch((error) => {
          console.error('Play error:', error);
          isLoading = false;
          isPlaying = false;
          stopVisualizerLayers();
        });
    }
  }

  function startVisualizerLayers() {
    clearTimeout(layerActivationTimer);
    layer1Active = false;
    layer2Active = false;
    layer3Active = false;
    
    setTimeout(() => { layer1Active = true; }, 100);
    setTimeout(() => { layer2Active = true; }, 800);
    setTimeout(() => { layer3Active = true; }, 1600);
  }

  function stopVisualizerLayers() {
    clearTimeout(layerActivationTimer);
    layer1Active = false;
    layer2Active = false;
    layer3Active = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  function animate() {
    if (!isPlaying || !analyserNode || !visualizerCtx) return;
    
    analyserNode.getByteFrequencyData(dataArray);
    visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    
    const barWidth = visualizerCanvas.width / bufferLength * 2.5;
    let barHeight;
    let x = 0;
    
    // Enhanced 3-layer visualization
    if (layer3Active) {
      visualizerCtx.globalAlpha = 0.4;
      for (let i = 0; i < bufferLength; i += 3) {
        barHeight = (dataArray[i] / 255) * visualizerCanvas.height * 0.8;
        const gradient = visualizerCtx.createLinearGradient(0, visualizerCanvas.height - barHeight, 0, visualizerCanvas.height);
        gradient.addColorStop(0, `rgba(0, 255, 255, 0.6)`);
        gradient.addColorStop(1, `rgba(0, 150, 255, 0.4)`);
        visualizerCtx.fillStyle = gradient;
        visualizerCtx.fillRect(x - barWidth * 0.5, visualizerCanvas.height - barHeight, barWidth * 2, barHeight);
        x += barWidth + 2;
      }
    }
    
    if (layer2Active) {
      visualizerCtx.globalAlpha = 0.7;
      x = 0;
      for (let i = 0; i < bufferLength; i += 2) {
        barHeight = (dataArray[i] / 255) * visualizerCanvas.height * 0.9;
        const gradient = visualizerCtx.createLinearGradient(0, visualizerCanvas.height - barHeight, 0, visualizerCanvas.height);
        gradient.addColorStop(0, `rgba(0, 217, 255, 0.8)`);
        gradient.addColorStop(1, `rgba(0, 100, 200, 0.5)`);
        visualizerCtx.fillStyle = gradient;
        visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth * 1.2, barHeight);
        x += barWidth + 1;
      }
    }
    
    if (layer1Active) {
      visualizerCtx.globalAlpha = 1.0;
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * visualizerCanvas.height;
        const gradient = visualizerCtx.createLinearGradient(0, visualizerCanvas.height - barHeight, 0, visualizerCanvas.height);
        gradient.addColorStop(0, `rgba(0, 255, 255, 1)`);
        gradient.addColorStop(0.5, `rgba(0, 217, 255, 0.9)`);
        gradient.addColorStop(1, `rgba(0, 150, 255, 0.7)`);
        visualizerCtx.fillStyle = gradient;
        visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }
    
    animationId = requestAnimationFrame(animate);
  }

  function selectTrack(index) {
    if (index >= 0 && index < playlist.length) {
      const wasPlaying = isPlaying;
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        stopVisualizerLayers();
      }
      
      currentTrack = index;
      updateTrackInfo();
      
      if (wasPlaying) {
        setTimeout(() => togglePlay(), 500);
      }
    }
    showPlaylist = false;
  }

  function selectLibrary(index) {
    if (index >= 0 && index < libraries.length) {
      const wasPlaying = isPlaying;
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        stopVisualizerLayers();
      }
      
      currentLibrary = index;
      playlist = libraries[index].tracks;
      libraryName = libraries[index].name;
      currentTrack = 0;
      updateTrackInfo();
      
      if (wasPlaying) {
        setTimeout(() => togglePlay(), 500);
      }
    }
    showLibraries = false;
  }

  function previousTrack() {
    if (playlist.length > 0) {
      currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
      selectTrack(currentTrack);
    }
  }

  function nextTrack() {
    if (playlist.length > 0) {
      currentTrack = (currentTrack + 1) % playlist.length;
      selectTrack(currentTrack);
    }
  }

  function handleTimeUpdate() {
    if (audio) {
      currentTime = audio.currentTime;
      duration = audio.duration || 0;
    }
  }

  function handleEnded() {
    nextTrack();
  }

  function handleVolumeChange(e) {
    volume = e.target.value / 100;
    if (audio) audio.volume = volume;
  }

  function handleSeek(e) {
    if (audio && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * duration;
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function togglePlaylist() {
    showPlaylist = !showPlaylist;
    if (showPlaylist) showLibraries = false;
  }

  function toggleLibraries() {
    showLibraries = !showLibraries;
    if (showLibraries) showPlaylist = false;
  }
</script>

<!-- Audio Element -->
<audio
  bind:this={audio}
  on:timeupdate={handleTimeUpdate}
  on:ended={handleEnded}
  preload="auto"
  crossorigin="anonymous"
>
</audio>

<!-- Polish Cyberpunk Music Player -->
<div class="cyberpunk-music-player">
  <!-- Main Player Panel -->
  <div class="player-panel">
    <!-- Header with Polish Fonts -->
    <div class="player-header">
      <div class="player-title">
        <span class="title-text">SYSTEM MUZYKI CYBER</span>
        <div class="status-indicators">
          <span class="indicator {layer1Active ? 'active' : ''}">L1</span>
          <span class="indicator {layer2Active ? 'active' : ''}">L2</span>
          <span class="indicator {layer3Active ? 'active' : ''}">L3</span>
        </div>
      </div>
      <div class="library-info">
        <span class="library-name">{libraryName}</span>
      </div>
    </div>

    <!-- Visualizer -->
    <div class="visualizer-container">
      <canvas 
        bind:this={visualizerCanvas}
        class="visualizer-canvas"
      ></canvas>
      <div class="visualizer-overlay">
        {#if !isPlaying}
          <div class="visualizer-idle">
            <span>MACIERZ AUDIO NIEAKTYWNA</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Track Info -->
    <div class="track-info-section">
      <div class="track-details">
        <div class="track-name">{trackName}</div>
        <div class="track-artist">
          {playlist[currentTrack]?.artist || "Nieznany Wykonawca"}
        </div>
        <div class="track-genre">
          {playlist[currentTrack]?.genre || "Nieznany Gatunek"}
        </div>
        <div class="track-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>

    <!-- Polish Controls -->
    <div class="player-controls">
      <button class="control-btn" on:click={previousTrack} title="Poprzedni">
        <span class="btn-text">POPRZ</span>
      </button>
      
      <button class="control-btn play-btn" on:click={togglePlay} disabled={isLoading} title="{isPlaying ? 'Pauza' : 'Graj'}">
        {#if isLoading}
          <span class="btn-text loading">ŁADUJ</span>
        {:else}
          <span class="btn-text">{isPlaying ? "PAUZA" : "GRAJ"}</span>
        {/if}
      </button>
      
      <button class="control-btn" on:click={nextTrack} title="Następny">
        <span class="btn-text">NAST</span>
      </button>
      
      <button class="control-btn library-btn" on:click={toggleLibraries} title="Biblioteki">
        <span class="btn-text">R1</span>
      </button>
      
      <button class="control-btn playlist-btn" on:click={togglePlaylist} title="Playlista">
        <span class="btn-text">LISTA</span>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="progress-section">
      <div
        class="progress-bar"
        role="slider"
        tabindex="0"
        aria-label="Przewijaj"
        on:click={handleSeek}
      >
        <div
          class="progress-fill"
          style="width: {duration ? (currentTime / duration) * 100 : 0}%"
        ></div>
        <div class="progress-glow" style="left: {duration ? (currentTime / duration) * 100 : 0}%"></div>
      </div>
    </div>

    <!-- Volume Control -->
    <div class="volume-section">
      <div class="volume-control">
        <span class="volume-icon">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          on:input={handleVolumeChange}
          class="volume-slider"
        />
        <span class="volume-value">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  </div>

  <!-- Libraries Dropdown (R1 System) -->
  {#if showLibraries}
    <div class="libraries-dropdown">
      <div class="libraries-header">
        <span class="libraries-title">BIBLIOTEKI R1 ({libraries.length})</span>
        <button class="close-btn" on:click={() => (showLibraries = false)}>✕</button>
      </div>
      
      <div class="libraries-content">
        {#each libraries as library, index}
          <button
            class="library-item {index === currentLibrary ? 'active' : ''}"
            on:click={() => selectLibrary(index)}
          >
            <div class="library-info">
              <div class="library-title">{library.name}</div>
              <div class="library-subtitle">{library.description}</div>
              <div class="library-count">{library.tracks.length} utworów</div>
            </div>
            <div class="library-indicators">
              {#if index === currentLibrary}
                <span class="current-indicator">♫</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Playlist Dropdown -->
  {#if showPlaylist}
    <div class="playlist-dropdown">
      <div class="playlist-header">
        <span class="playlist-title">LISTA UTWORÓW ({playlist.length})</span>
        <button class="close-btn" on:click={() => (showPlaylist = false)}>✕</button>
      </div>
      
      <div class="playlist-content">
        {#each playlist as track, index}
          <button
            class="playlist-item {index === currentTrack ? 'active' : ''}"
            on:click={() => selectTrack(index)}
          >
            <div class="track-info">
              <div class="track-title">{track.name}</div>
              <div class="track-subtitle">{track.artist}</div>
              <div class="track-genre">{track.genre}</div>
            </div>
            <div class="track-indicators">
              {#if track.working}
                <span class="working-indicator">●</span>
              {/if}
              {#if index === currentTrack}
                <span class="current-indicator">♪</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* POLSKIE FRONTY ZNAKÓW Integration */
  .cyberpunk-music-player {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    position: relative;
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }

  .player-panel {
    background: rgba(0, 0, 0, 0.85);
    border: 2px solid var(--cyber-blue);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.3),
      inset 0 0 20px rgba(0, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }

  .player-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      var(--cyber-blue) 50%, 
      transparent 100%);
    animation: scan 3s linear infinite;
  }

  @keyframes scan {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
  }

  .player-header {
    margin-bottom: 15px;
  }

  .player-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .title-text {
    font-family: 'Neuropol X', 'Rajdhani', system-ui, sans-serif;
    color: var(--cyber-blue);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 0 10px currentColor;
  }

  .library-info {
    text-align: center;
  }

  .library-name {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    color: rgba(0, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .status-indicators {
    display: flex;
    gap: 8px;
  }

  .indicator {
    font-family: 'Fledgling SB', 'Rajdhani', system-ui, sans-serif;
    padding: 2px 6px;
    font-size: 10px;
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 3px;
    color: rgba(0, 255, 255, 0.5);
    transition: all 0.3s ease;
    font-weight: 600;
  }

  .indicator.active {
    color: var(--cyber-blue);
    border-color: var(--cyber-blue);
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
  }

  .visualizer-container {
    position: relative;
    height: 150px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .visualizer-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .visualizer-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .visualizer-idle {
    font-family: 'Fledgling SB', 'Rajdhani', system-ui, sans-serif;
    color: rgba(0, 255, 255, 0.6);
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .track-info-section {
    margin-bottom: 20px;
  }

  .track-details {
    text-align: center;
    padding: 15px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 8px;
  }

  .track-name {
    font-family: 'Neuropol X', 'Rajdhani', system-ui, sans-serif;
    color: var(--cyber-blue);
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 8px currentColor;
  }

  .track-artist {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-bottom: 4px;
  }

  .track-genre {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    color: rgba(0, 255, 255, 0.6);
    font-size: 12px;
    margin-bottom: 8px;
    font-style: italic;
  }

  .track-time {
    font-family: 'Fledgling SB', 'Rajdhani', system-ui, sans-serif;
    color: rgba(0, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 500;
  }

  .player-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .control-btn {
    font-family: 'Fledgling SB', 'Rajdhani', system-ui, sans-serif !important;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(0, 255, 255, 0.5);
    color: var(--cyber-blue);
    min-width: 60px;
    height: 45px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 8px;
  }

  .control-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  .control-btn:hover::before {
    transform: translateX(100%);
  }

  .control-btn:hover:not(:disabled) {
    border-color: var(--cyber-blue);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
    background: rgba(0, 255, 255, 0.1);
  }

  .control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .play-btn {
    min-width: 80px;
    height: 55px;
    background: rgba(0, 255, 255, 0.1);
    border-color: var(--cyber-blue);
    font-size: 13px;
  }

  .library-btn {
    background: rgba(255, 0, 255, 0.1);
    border-color: rgba(255, 0, 255, 0.5);
    color: #ff00ff;
  }

  .library-btn:hover {
    border-color: #ff00ff;
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
  }

  .btn-text {
    font-size: 11px;
    z-index: 1;
    position: relative;
    font-weight: 700;
  }

  .btn-text.loading {
    animation: rotate 2s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .progress-section {
    margin-bottom: 20px;
  }

  .progress-bar {
    height: 8px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(0, 255, 255, 0.8) 0%, 
      rgba(0, 217, 255, 1) 100%);
    transition: width 0.1s ease;
    position: relative;
  }

  .progress-glow {
    position: absolute;
    top: -2px;
    bottom: -2px;
    width: 4px;
    background: var(--cyber-blue);
    border-radius: 2px;
    box-shadow: 0 0 8px var(--cyber-blue);
    transform: translateX(-50%);
  }

  .volume-section {
    margin-bottom: 10px;
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .volume-icon {
    color: var(--cyber-blue);
    font-size: 16px;
    min-width: 20px;
  }

  .volume-slider {
    flex: 1;
    height: 6px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    appearance: none;
  }

  .volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cyber-blue);
    cursor: pointer;
    box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
    border: none;
  }

  .volume-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cyber-blue);
    cursor: pointer;
    border: none;
    box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
  }

  .volume-value {
    font-family: 'Fledgling SB', 'Rajdhani', system-ui, sans-serif;
    color: rgba(0, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 600;
    min-width: 35px;
    text-align: right;
  }

  /* Libraries Dropdown - R1 System */
  .libraries-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 10px;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid #ff00ff;
    border-radius: 12px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(255, 0, 255, 0.3);
    max-height: 400px;
    z-index: 1000;
    animation: slideDown 0.3s ease;
  }

  .libraries-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.8);
    border-bottom: 1px solid rgba(255, 0, 255, 0.3);
    border-radius: 10px 10px 0 0;
  }

  .libraries-title {
    font-family: 'Neuropol X', 'Rajdhani', system-ui, sans-serif;
    color: #ff00ff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-shadow: 0 0 8px currentColor;
  }

  .libraries-content {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
  }

  .library-item {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px;
    margin-bottom: 10px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 0, 255, 0.2);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .library-item:hover {
    border-color: rgba(255, 0, 255, 0.5);
    background: rgba(255, 0, 255, 0.05);
    box-shadow: 0 2px 8px rgba(255, 0, 255, 0.2);
  }

  .library-item.active {
    border-color: #ff00ff;
    background: rgba(255, 0, 255, 0.1);
    box-shadow: 0 0 12px rgba(255, 0, 255, 0.3);
  }

  .library-title {
    font-family: 'Neuropol X', 'Rajdhani', system-ui, sans-serif;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .library-item.active .library-title {
    color: #ff00ff;
    text-shadow: 0 0 8px currentColor;
  }

  .library-subtitle {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin-bottom: 3px;
  }

  .library-count {
    font-family: 'Fledgling SB', 'Rajdhani', system-ui, sans-serif;
    color: rgba(255, 0, 255, 0.7);
    font-size: 11px;
    font-weight: 600;
  }

  /* Standard Playlist Dropdown */
  .playlist-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 10px;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--cyber-blue);
    border-radius: 12px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(0, 255, 255, 0.3);
    max-height: 400px;
    z-index: 1000;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.8);
    border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 10px 10px 0 0;
  }

  .playlist-title {
    font-family: 'Neuropol X', 'Rajdhani', system-ui, sans-serif;
    color: var(--cyber-blue);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-shadow: 0 0 8px currentColor;
  }

  .close-btn {
    font-family: 'Fledgling SB', 'Rajdhani', system-ui, sans-serif;
    background: none;
    border: 1px solid rgba(0, 255, 255, 0.3);
    color: var(--cyber-blue);
    width: 30px;
    height: 30px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  .close-btn:hover {
    border-color: var(--cyber-blue);
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
  }

  .playlist-content {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
  }

  .playlist-content::-webkit-scrollbar {
    width: 8px;
  }

  .playlist-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }

  .playlist-content::-webkit-scrollbar-thumb {
    background: var(--cyber-blue);
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }

  .playlist-item {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 12px 15px;
    margin-bottom: 8px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .playlist-item:hover {
    border-color: rgba(0, 255, 255, 0.5);
    background: rgba(0, 255, 255, 0.05);
    box-shadow: 0 2px 8px rgba(0, 255, 255, 0.2);
  }

  .playlist-item.active {
    border-color: var(--cyber-blue);
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 12px rgba(0, 255, 255, 0.3);
  }

  .track-title {
    font-family: 'Neuropol X', 'Rajdhani', system-ui, sans-serif;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .playlist-item.active .track-title {
    color: var(--cyber-blue);
    text-shadow: 0 0 8px currentColor;
  }

  .track-subtitle {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin-bottom: 2px;
  }

  .track-genre {
    font-family: 'Kenyan Coffee', 'Rajdhani', system-ui, sans-serif;
    color: rgba(0, 255, 255, 0.5);
    font-size: 11px;
    font-style: italic;
  }

  .track-indicators {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .working-indicator {
    color: #22c55e;
    font-size: 12px;
  }

  .current-indicator {
    color: var(--cyber-blue);
    font-size: 14px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .cyberpunk-music-player {
      max-width: 100%;
    }

    .player-panel {
      padding: 15px;
    }

    .control-btn {
      min-width: 50px;
      height: 40px;
    }

    .play-btn {
      min-width: 70px;
      height: 50px;
    }

    .btn-text {
      font-size: 10px;
    }

    .title-text {
      font-size: 14px;
    }

    .track-name {
      font-size: 14px;
    }

    .player-controls {
      gap: 8px;
    }
  }
</style>
