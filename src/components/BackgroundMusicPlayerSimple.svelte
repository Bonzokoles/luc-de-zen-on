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
    try {
      console.log("📁 Processing selected files...");

      if (!event.target.files || event.target.files.length === 0) {
        console.warn("❌ No files selected");
        alert("⚠️ Nie wybrano żadnych plików");
        return;
      }

      const allFiles = Array.from(event.target.files);
      console.log(`📁 Total files found: ${allFiles.length}`);

      const audioFiles = allFiles.filter((file) => {
        const isAudio =
          file.type.startsWith("audio/") ||
          /\.(mp3|mp4|wav|ogg|m4a|aac|flac|wma|opus|webm|3gp|amr|ape|dts|ac3|mka|mpc|ra|tta|wv|au|aiff|snd|voc|8svx|iff|nist|sphere|vox|w64|mat|pvf|fap|caf|sd2|irca|w64|mat|bwf|rf64)$/i.test(
            file.name
          );
        if (!isAudio) {
          console.log(
            `⚠️ Skipping non-audio file: ${file.name} (${file.type})`
          );
        }
        return isAudio;
      });

      console.log(`🎵 Audio files found: ${audioFiles.length}`);

      if (audioFiles.length === 0) {
        alert("❌ Nie znaleziono plików audio w wybranej lokalizacji");
        return;
      }

      playlist = audioFiles
        .map((file, index) => {
          try {
            const url = URL.createObjectURL(file);
            console.log(`✅ Created URL for: ${file.name}`);
            return {
              name: file.name.replace(/\.[^/.]+$/, ""),
              file: file,
              url: url,
              size: file.size,
              source: "local",
            };
          } catch (urlError) {
            console.error(
              `❌ Failed to create URL for ${file.name}:`,
              urlError
            );
            return null;
          }
        })
        .filter((track) => track !== null);

      if (playlist.length === 0) {
        alert("❌ Nie udało się załadować żadnego pliku audio");
        return;
      }

      currentTrack = 0;
      updateTrackInfo();
      showPlaylist = true;

      console.log(`✅ Successfully loaded ${playlist.length} tracks`);
      alert(`🎵 Załadowano ${playlist.length} utworów z lokalnych plików!`);

      // Reset input aby można było wybrać te same pliki ponownie
      event.target.value = "";
    } catch (error) {
      console.error("❌ Error in handleFolderSelect:", error);
      alert(`❌ Błąd ładowania plików: ${error.message}`);
    }
  }

  function togglePlaylist() {
    showPlaylist = !showPlaylist;
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
    </div>
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
        <button
          class="control-btn"
          class:active={showPlaylist}
          on:click={togglePlaylist}
        >
          {showPlaylist ? "📋✓" : "📋"}
        </button>
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

      <!-- Inline Playlist Panel -->
      {#if showPlaylist}
        <div class="inline-playlist-panel">
          <div class="playlist-header-inline">
            <span>🎵 BIBLIOTEKA MUZYKI</span>
          </div>
          <div class="playlist-content-inline">
            {#if playlist.length === 0}
              <div class="playlist-empty">Brak załadowanych utworów</div>
            {:else}
              {#each playlist as track, index}
                <button
                  class="playlist-item-inline"
                  class:active={index === currentTrack}
                  on:click={() => selectTrack(index)}
                >
                  <span class="track-number">{index + 1}</span>
                  <span class="track-title">{track.name}</span>
                </button>
              {/each}
            {/if}
          </div>
          <div class="playlist-actions-inline">
            <input
              type="file"
              webkitdirectory
              multiple
              accept="audio/*,video/mp4,.mp3,.mp4,.wav,.ogg,.m4a,.aac,.flac,.wma,.opus,.webm,.3gp"
              on:change={handleFolderSelect}
              style="display: none;"
              id="music-folder"
            />
            <button
              class="action-btn-inline"
              on:click={() => document.getElementById("music-folder").click()}
            >
              📁 Folder
            </button>
            <button class="action-btn-inline" on:click={loadDemoTracks}
              >🎵 Demo</button
            >
          </div>
        </div>
      {/if}
    </div>
  </div>
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
    background: linear-gradient(
      135deg,
      rgba(15, 56, 70, 0.98),
      rgba(0, 0, 0, 0.95)
    );
    border: 2px solid #1be1ff;
    border-radius: 0;
    backdrop-filter: blur(15px);
    min-width: 480px;
    max-width: 520px;
    box-shadow:
      0 0 12px rgba(27, 225, 255, 0.2),
      0 0 25px rgba(27, 225, 255, 0.08),
      inset 0 1px 0 rgba(27, 225, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1000;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: linear-gradient(90deg, #0f3846, #1be1ff);
    border-bottom: 2px solid #1be1ff;
    border-radius: 0;
    color: #000;
    font-size: 12px;
    font-weight: 700;
    text-shadow: 0 0 2px rgba(27, 225, 255, 0.4);
    user-select: none;
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

  /* Control button active state */
  .control-btn.active {
    background: linear-gradient(
      135deg,
      rgba(27, 225, 255, 0.3),
      rgba(15, 56, 70, 0.9)
    );
    border-color: #1be1ff;
    box-shadow:
      0 0 15px rgba(27, 225, 255, 0.6),
      inset 0 2px 4px rgba(27, 225, 255, 0.2);
    color: #fff;
  }

  /* Inline Playlist Styles */
  .inline-playlist-panel {
    margin-top: 15px;
    border-top: 1px solid rgba(27, 225, 255, 0.3);
    padding-top: 15px;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      padding-top: 0;
    }
    to {
      opacity: 1;
      max-height: 400px;
      padding-top: 15px;
    }
  }

  .playlist-header-inline {
    text-align: center;
    color: #1be1ff;
    font-size: 11px;
    font-weight: 700;
    text-shadow: 0 0 5px rgba(27, 225, 255, 0.6);
    margin-bottom: 10px;
    padding: 5px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(27, 225, 255, 0.1),
      transparent
    );
    border-radius: 4px;
  }

  .playlist-content-inline {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 12px;
  }

  .playlist-content-inline::-webkit-scrollbar {
    width: 6px;
  }

  .playlist-content-inline::-webkit-scrollbar-track {
    background: rgba(15, 56, 70, 0.3);
    border-radius: 3px;
  }

  .playlist-content-inline::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #1be1ff, #164e63);
    border-radius: 3px;
    border: 1px solid rgba(27, 225, 255, 0.5);
  }

  .playlist-item-inline {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 10px;
    margin-bottom: 2px;
    background: linear-gradient(
      135deg,
      rgba(15, 56, 70, 0.4),
      rgba(27, 225, 255, 0.05)
    );
    border: 1px solid rgba(27, 225, 255, 0.2);
    color: #1be1ff;
    font-size: 11px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.25s ease;
    text-shadow: 0 0 3px rgba(27, 225, 255, 0.3);
  }

  .playlist-item-inline:hover {
    background: linear-gradient(
      135deg,
      rgba(27, 225, 255, 0.15),
      rgba(15, 56, 70, 0.6)
    );
    border-color: #1be1ff;
    box-shadow: 0 0 8px rgba(27, 225, 255, 0.3);
    transform: translateX(3px);
  }

  .playlist-item-inline.active {
    background: linear-gradient(
      135deg,
      rgba(27, 225, 255, 0.25),
      rgba(15, 56, 70, 0.8)
    );
    border-color: #1be1ff;
    box-shadow:
      0 0 12px rgba(27, 225, 255, 0.4),
      inset 0 1px 0 rgba(27, 225, 255, 0.3);
    color: #fff;
  }

  .track-number {
    min-width: 20px;
    text-align: center;
    color: rgba(27, 225, 255, 0.7);
    font-size: 10px;
    margin-right: 8px;
  }

  .track-title {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .playlist-actions-inline {
    display: flex;
    gap: 6px;
    justify-content: center;
    padding: 8px 0;
    border-top: 1px solid rgba(27, 225, 255, 0.2);
  }

  .action-btn-inline {
    background: linear-gradient(
      135deg,
      rgba(15, 56, 70, 0.6),
      rgba(27, 225, 255, 0.1)
    );
    border: 1px solid rgba(27, 225, 255, 0.3);
    padding: 6px 12px;
    color: #1be1ff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    font-weight: 600;
    transition: all 0.25s ease;
    text-shadow: 0 0 3px rgba(27, 225, 255, 0.3);
    flex: 1;
  }

  .action-btn-inline:hover {
    background: linear-gradient(
      135deg,
      rgba(27, 225, 255, 0.2),
      rgba(15, 56, 70, 0.8)
    );
    border-color: #1be1ff;
    box-shadow: 0 0 8px rgba(27, 225, 255, 0.4);
    transform: translateY(-1px);
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
