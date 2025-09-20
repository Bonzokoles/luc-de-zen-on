<script>
  import { onMount } from "svelte";

  let audio;
  // Added audio context + analyser related refs (parity with richer version in RULEZ_&_INSTUCT)
  let audioCtx;
  let analyserNode;
  let mediaSource;
  let playlist = [];
  let currentTrack = 0;
  let isPlaying = false;
  let isMinimized = false;
  let volume = 0.5;
  let currentTime = 0;
  let duration = 0;
  let showPlaylist = false;
  let trackName = "No track selected";

  onMount(() => {
    loadDemoTracks();

    // Clear any previous instances to prevent conflicts
    if (typeof window !== "undefined") {
      // Force clean state
      delete window.MUSIC;

      // Re-create fresh API
      window.MUSIC = {
        play: () => {
          if (!isPlaying) togglePlay();
        },
        pause: () => {
          if (isPlaying) togglePlay();
        },
        toggle: () => togglePlay(),
        next: () => nextTrack(),
        prev: () => previousTrack(),
        togglePlaylist: () => togglePlaylist(),
        setVolume: (v) => {
          const nv = Math.max(0, Math.min(1, Number(v)));
          volume = nv;
          if (audio) audio.volume = volume;
        },
        getState: () => ({ isPlaying, trackName, volume }),
        ensureLoaded: () => {
          if (!playlist.length) loadDemoTracks();
          else updateTrackInfo();
        },
        getAnalyser: () => analyserNode || window.MUSIC_ANALYSER || null,
        openFolderPicker: () => {
          console.log("🎵 Opening music library folder picker...");
          try {
            const el = document.getElementById("music-folder");
            if (el && typeof el.click === "function") {
              el.click();
              console.log("✅ Music library folder picker opened successfully");
            } else {
              console.warn("❌ Music folder picker element not found");
              alert("Błąd: Nie można otworzyć selektora folderów z muzyką");
            }
          } catch (e) {
            console.warn("Folder picker not available:", e);
            alert("Błąd: Selektor folderów niedostępny - " + e.message);
          }
        },
      };

      console.log("🎵 MUSIC API registered and ready");
    }
  });

  function setupAnalyser() {
    try {
      if (!audio) return;
      if (analyserNode) return; // already initialized
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = window.MUSIC_AUDIO_CTX || new Ctx();
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }
      if (!window.MUSIC_MEDIA_SOURCE) {
        mediaSource = audioCtx.createMediaElementSource(audio);
        window.MUSIC_MEDIA_SOURCE = mediaSource;
      } else {
        mediaSource = window.MUSIC_MEDIA_SOURCE;
      }
      analyserNode = window.MUSIC_ANALYSER || audioCtx.createAnalyser();
      analyserNode.fftSize = 1024;
      analyserNode.smoothingTimeConstant = 0.85;
      try {
        mediaSource.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);
      } catch {}
      window.MUSIC_AUDIO_CTX = audioCtx;
      window.MUSIC_ANALYSER = analyserNode;
      window.dispatchEvent(new CustomEvent("music-analyser-ready"));
      // If mic context exists and is suspended attempt resume (helps unify visuals)
      try {
        const micCtx = window.MIC_AUDIO_CTX;
        if (micCtx && micCtx.state === "suspended")
          micCtx.resume().catch(() => {});
      } catch {}
    } catch (e) {
      console.warn("setupAnalyser failed", e);
    }
  }

  function loadDemoTracks() {
    playlist = [
      { name: "MERKABA", url: "https://assets.codepen.io/7558/Merkaba.mp3" },
      { name: "DHAMIKA", url: "https://assets.codepen.io/7558/Dhamika.mp3" },
      { name: "VACANT", url: "https://assets.codepen.io/7558/Vacant.mp3" },
      {
        name: "LXSTNGHT",
        url: "https://assets.codepen.io/7558/lxstnght-back_1.mp3",
      },
    ];
    updateTrackInfo();
  }

  function updateTrackInfo() {
    if (playlist[currentTrack]) {
      trackName = playlist[currentTrack].name;
      if (audio && playlist[currentTrack].url) {
        audio.src = playlist[currentTrack].url;
        audio.volume = volume;
        setupAnalyser();
      }
    }
  }

  function togglePlay() {
    if (!playlist[currentTrack]) {
      loadDemoTracks();
      return;
    }
    if (!audio.src) {
      updateTrackInfo();
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      setupAnalyser();
      audio
        .play()
        .then(() => {
          isPlaying = true;
          try {
            if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
          } catch {}
        })
        .catch(console.error);
    }
  }

  function selectTrack(index) {
    if (index >= 0 && index < playlist.length) {
      currentTrack = index;
      updateTrackInfo();
      if (isPlaying) {
        audio.play();
      }
    }
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
    if (audio) {
      audio.volume = volume;
    }
  }

  function handleSeek(e) {
    if (audio && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * duration;
    }
  }

  // Keyboard accessibility for seeking
  function handleSeekKey(e) {
    if (!audio || !duration) return;
    const step = 5; // seconds
    if (e.key === "ArrowRight") {
      audio.currentTime = Math.min(duration, audio.currentTime + step);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      audio.currentTime = Math.max(0, audio.currentTime - step);
      e.preventDefault();
    } else if (e.key === "Home") {
      audio.currentTime = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      audio.currentTime = duration;
      e.preventDefault();
    } else if (e.key === "Enter" || e.key === " ") {
      // Treat Enter/Space like a click roughly at current filled position (no-op)
      e.preventDefault();
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function handleFolderSelect(event) {
    const files = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("audio/"),
    );

    playlist = files.map((file) => ({
      name: file.name.replace(/\.[^/.]+$/, ""),
      file: file,
      url: URL.createObjectURL(file),
    }));

    currentTrack = 0;
    updateTrackInfo();
    showPlaylist = true;
  }

  function togglePlaylist() {
    showPlaylist = !showPlaylist;
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
  }
</script>

<!-- Background Music Player -->
<div class="background-music-player in-flow">
  <!-- Audio Element -->
  <audio
    bind:this={audio}
    on:timeupdate={handleTimeUpdate}
    on:ended={handleEnded}
    preload="metadata"
    crossorigin="anonymous"
  >
  </audio>

  <!-- Floating Music Control Panel -->
  <div class="music-control-panel">
    <div class="panel-header">
      <span>🎵 MUSIC • POLACZEK</span>
      <button class="minimize-btn" on:click={toggleMinimize}>
        {isMinimized ? "+" : "−"}
      </button>
    </div>

    {#if !isMinimized}
      <div class="panel-content">
        <!-- Now Playing Info -->
        <div class="now-playing">
          <div class="track-info">
            <div class="track-name">{trackName}</div>
            <div class="track-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="player-controls">
          <button class="control-btn" on:click={previousTrack}>⏮</button>
          <button class="control-btn play-pause" on:click={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button class="control-btn" on:click={nextTrack}>⏭</button>
          <button class="control-btn" on:click={togglePlaylist}>📋</button>
        </div>

        <!-- Volume Control -->
        <div class="volume-control">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            on:input={handleVolumeChange}
            class="volume-slider"
          />
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div
            class="progress-bar"
            role="slider"
            tabindex="0"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime || 0}
            on:click={handleSeek}
            on:keydown={handleSeekKey}
          >
            <div
              class="progress-fill"
              style="width: {duration ? (currentTime / duration) * 100 : 0}%"
            ></div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Playlist Panel -->
  {#if showPlaylist}
    <div class="playlist-panel">
      <div class="playlist-header">
        <span>🎵 PLAYLIST</span>
        <button class="close-btn" on:click={() => (showPlaylist = false)}
          >×</button
        >
      </div>
      <div class="playlist-content">
        {#if playlist.length === 0}
          <div class="playlist-empty">No tracks loaded</div>
        {:else}
          {#each playlist as track, index}
            <button
              class="playlist-item"
              class:active={index === currentTrack}
              on:click={() => selectTrack(index)}
            >
              {track.name}
            </button>
          {/each}
        {/if}
      </div>
      <div class="playlist-actions">
        <input
          type="file"
          webkitdirectory
          multiple
          accept="audio/*"
          on:change={handleFolderSelect}
          style="display: none;"
          id="music-folder"
        />
        <button
          class="action-btn"
          on:click={() => document.getElementById("music-folder").click()}
        >
          📁 Load Folder
        </button>
        <button class="action-btn" on:click={loadDemoTracks}
          >🎵 Demo Tracks</button
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .background-music-player {
    font-family: "Rajdhani", sans-serif;
  }
  .background-music-player.in-flow {
    position: static;
    z-index: auto;
  }

  .music-control-panel {
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid #8b0000;
    border-radius: 0;
    backdrop-filter: blur(10px);
    min-width: 280px;
    box-shadow: 0 0 30px rgba(139, 0, 0, 0.4);
    transition: all 0.3s ease;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #111;
    border-bottom: 2px solid #8b0000;
    border-radius: 0;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    user-select: none;
  }

  .minimize-btn,
  .close-btn {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    transition: background-color 0.2s;
  }

  .minimize-btn:hover,
  .close-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .panel-content {
    padding: 12px;
    transition: all 0.3s ease;
  }

  .now-playing {
    margin-bottom: 12px;
  }

  .track-info {
    text-align: center;
  }

  .track-name {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-time {
    color: #888;
    font-size: 11px;
  }

  .player-controls {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 12px 0;
  }

  .control-btn {
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid #8b0000;
    color: #fff;
    border-radius: 0;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #555;
  }

  .play-pause {
    background: rgba(0, 231, 255, 0.08);
    border-color: #00e7ff;
    color: #00e7ff;
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
  }

  .volume-control span {
    color: #fff;
    font-size: 12px;
  }

  .volume-slider {
    flex: 1;
    height: 4px;
    background: #333;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    appearance: none;
  }

  .volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }

  .progress-container {
    margin-top: 8px;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #333;
    border-radius: 2px;
    cursor: pointer;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #81c784);
    transition: width 0.1s ease;
  }

  .playlist-panel {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 8px;
    width: 300px;
    max-height: 400px;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid #333;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    border-bottom: 1px solid #333;
    border-radius: 7px 7px 0 0;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
  }

  .playlist-content {
    max-height: 280px;
    overflow-y: auto;
    padding: 8px;
  }

  .playlist-content::-webkit-scrollbar {
    width: 6px;
  }

  .playlist-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  .playlist-content::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }

  .playlist-empty {
    text-align: center;
    color: #666;
    padding: 20px;
    font-size: 12px;
  }

  .playlist-item {
    display: block;
    width: 100%;
    padding: 6px 8px;
    margin-bottom: 2px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid transparent;
    color: #fff;
    font-size: 11px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .playlist-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #555;
  }

  .playlist-item.active {
    background: rgba(76, 175, 80, 0.3);
    border-color: #4caf50;
    color: #fff;
  }

  .playlist-actions {
    padding: 8px;
    border-top: 1px solid #333;
    display: flex;
    gap: 4px;
  }

  .action-btn {
    flex: 1;
    padding: 6px 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #333;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    font-size: 10px;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #555;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .background-music-player {
      bottom: 10px;
      right: 10px;
    }

    .music-control-panel {
      min-width: 250px;
    }

    .playlist-panel {
      width: 280px;
    }
  }
</style>
