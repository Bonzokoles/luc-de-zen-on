<script>
  import { onMount } from 'svelte';

  let audio;
  let playlist = [];
  let currentTrack = 0;
  let isPlaying = false;
  let isMinimized = false;
  let volume = 0.5;
  let currentTime = 0;
  let duration = 0;
  let showPlaylist = false;
  let trackName = "No track selected";
  let currentTrackFile = null;
  let isLoading = false;
  
  // Audio context for visualization
  let audioContext = null;
  let analyser = null;
  let dataArray = null;
  let source = null;
  let visualizerCanvas;
  let animationId;
  let visualizerReady = true; // Always ready now
  let canShowControls = true;
  
  // Panel dragging
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let panelX = 20; // Default position
  let panelY = 20;

  onMount(() => {
    loadBestTracks();
    
    // Clear any previous instances to prevent conflicts
    if (typeof window !== "undefined") {
      delete window.MUSIC;

      // Re-create fresh API with POLACZEK integration
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
        getState: () => ({ 
          isPlaying, 
          trackName, 
          volume, 
          currentTime, 
          duration,
          canShowControls,
          visualizerReady 
        }),
        ensureLoaded: () => {
          console.log('🎵 Music player ensureLoaded called');
          if (!playlist.length) loadBestTracks();
          else updateTrackInfo();
        },
        getAnalyser: () => analyser || window.MUSIC_ANALYSER || null,
        openFolderPicker: () => {
          try {
            const el = document.getElementById('music-folder-revived');
            if (el && typeof el.click === 'function') el.click();
          } catch (e) {
            console.warn('Folder picker not available:', e);
          }
        }
      };

      console.log('🎵 MUSIC API registered and ready with POLACZEK integration');
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });

  function loadBestTracks() {
    // Najlepsze, sprawdzone linki + lokalne pliki audio
    playlist = [
      {
        name: "MERKABA",
        url: "https://assets.codepen.io/7558/Merkaba.mp3",
        artist: "AI Generated",
        working: true
      },
      {
        name: "DHAMIKA", 
        url: "https://assets.codepen.io/7558/Dhamika.mp3",
        artist: "AI Generated",
        working: true
      },
      {
        name: "VACANT",
        url: "https://assets.codepen.io/7558/Vacant.mp3", 
        artist: "AI Generated",
        working: true
      },
      {
        name: "LXSTNGHT",
        url: "https://assets.codepen.io/7558/lxstnght-back_1.mp3",
        artist: "AI Generated", 
        working: true
      },
      // Backup tracks
      { 
        name: "Neony - Miuosh", 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        artist: "Miuosh",
        working: false // CORS blocked
      },
      { 
        name: "White Flag - Dido", 
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        artist: "Dido",
        working: false // CORS blocked
      }
    ];
    updateTrackInfo();
  }

  function updateTrackInfo() {
    if (playlist[currentTrack]) {
      trackName = playlist[currentTrack].name;
      if (playlist[currentTrack].url) {
        currentTrackFile = playlist[currentTrack].url;
      } else if (playlist[currentTrack].file) {
        currentTrackFile = URL.createObjectURL(playlist[currentTrack].file);
      }
    }
  }

  function setupAudioContext() {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        if (!source && audio) {
          source = audioContext.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          
          // Make analyser available globally for main page visualizer
          window.MUSIC_ANALYSER = analyser;
          window.dispatchEvent(new CustomEvent('music-analyser-ready'));
        }
      } catch (error) {
        console.warn('Audio visualization not available:', error);
      }
    }
  }

  function startVisualization() {
    if (!analyser || !visualizerCanvas) return;
    
    const ctx = visualizerCanvas.getContext('2d');
    
    function animate() {
      if (!isPlaying) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
      
      const barWidth = visualizerCanvas.width / dataArray.length * 2;
      let x = 0;
      
      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * visualizerCanvas.height * 0.8;
        const intensity = dataArray[i] / 255;
        
        ctx.fillStyle = `rgba(0, 217, 255, ${0.3 + intensity * 0.7})`;
        ctx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
  }

  function togglePlay() {
    if (!canShowControls) {
      alert('Poczekaj na uruchomienie wizualizatorów muzyki...');
      return;
    }

    if (!playlist[currentTrack]) {
      loadBestTracks();
      return;
    }

    if (!audio.src) {
      updateTrackInfo();
      audio.src = currentTrackFile;
      audio.volume = volume;
    }

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      isLoading = true;
      setupAudioContext();
      audio.play().then(() => {
        isPlaying = true;
        isLoading = false;
        startVisualization();
        // Dispatch event for main page visualizer
        window.dispatchEvent(new CustomEvent('music-started', {
          detail: { analyser, audioContext, source }
        }));
      }).catch((error) => {
        console.error('Play error:', error);
        isLoading = false;
        isPlaying = false;
        
        // Try next working track
        const nextWorkingTrack = playlist.findIndex((track, index) => 
          index > currentTrack && track.working
        );
        
        if (nextWorkingTrack !== -1) {
          currentTrack = nextWorkingTrack;
          setTimeout(() => {
            updateTrackInfo();
            setTimeout(togglePlay, 500);
          }, 1000);
        }
      });
    }
  }

  function selectTrack(index) {
    if (!canShowControls) return;
    
    if (index >= 0 && index < playlist.length) {
      const wasPlaying = isPlaying;
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      }
      
      currentTrack = index;
      updateTrackInfo();
      audio.src = currentTrackFile;
      audio.volume = volume;
      
      if (wasPlaying) {
        setTimeout(() => {
          togglePlay();
        }, 300);
      }
    }
  }

  function previousTrack() {
    if (!canShowControls) return;
    
    if (playlist.length > 0) {
      currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
      selectTrack(currentTrack);
    }
  }

  function nextTrack() {
    if (!canShowControls) return;
    
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
    if (!canShowControls) return;
    
    volume = e.target.value / 100;
    if (audio) {
      audio.volume = volume;
    }
  }

  function handleSeek(e) {
    if (!canShowControls) return;
    
    if (audio && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * duration;
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleFolderSelect(event) {
    if (!canShowControls) return;
    
    const files = Array.from(event.target.files).filter(file => 
      file.type.startsWith('audio/')
    );
    
    playlist = files.map(file => ({
      name: file.name.replace(/\.[^/.]+$/, ""),
      file: file,
      working: true
    }));
    
    currentTrack = 0;
    updateTrackInfo();
    showPlaylist = true;
  }

  function togglePlaylist() {
    if (!canShowControls) return;
    showPlaylist = !showPlaylist;
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
  }

  // Dragging functionality
  function handleMouseDown(e) {
    isDragging = true;
    dragOffsetX = e.clientX - panelX;
    dragOffsetY = e.clientY - panelY;
  }

  function handleMouseMove(e) {
    if (isDragging) {
      panelX = e.clientX - dragOffsetX;
      panelY = e.clientY - dragOffsetY;
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  // Emergency fix function - reload with working tracks
  function emergencyFix() {
    console.log("🚨 Emergency fix - reloading working tracks");
    isPlaying = false;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    loadBestTracks();
    setTimeout(() => {
      updateTrackInfo();
    }, 500);
  }
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<!-- Background Music Player -->
<div class="background-music-player" 
     style="transform: translate({panelX}px, {panelY}px)">
  
  <!-- Audio Element -->
  <audio bind:this={audio} 
         on:timeupdate={handleTimeUpdate} 
         on:ended={handleEnded}
         preload="metadata" 
         crossorigin="anonymous">
  </audio>
  
  <!-- Floating Music Control Panel -->
  <div class="music-control-panel">
    <div class="panel-header" on:mousedown={handleMouseDown}>
      <span>🎵 MUSIC • POLACZEK {isLoading ? '(Loading...)' : ''}</span>
      <button class="minimize-btn" on:click={toggleMinimize}>
        {isMinimized ? '+' : '−'}
      </button>
    </div>
    
    {#if !canShowControls}
    <div class="panel-loading">
      <div class="loading-message">
        <div class="loading-icon">🎛️</div>
        <div class="loading-text">Oczekiwanie na wizualizatory muzyki...</div>
        <div class="loading-subtext">Przycisk zostanie odblokowany po uruchomieniu</div>
        <div class="loading-dots">
          <span>●</span><span>●</span><span>●</span>
        </div>
      </div>
    </div>
    {:else if !isMinimized}
    <div class="panel-content">
      <!-- Now Playing Info -->
      <div class="now-playing">
        <div class="track-info">
          <div class="track-name">{trackName}</div>
          <div class="track-time">{formatTime(currentTime)} / {formatTime(duration)}</div>
          {#if playlist[currentTrack]?.working}
            <div class="track-status">✅ Working</div>
          {:else if playlist[currentTrack]?.working === false}
            <div class="track-status">⚠️ CORS Blocked</div>
          {/if}
        </div>
      </div>
      
      <!-- Controls -->
      <div class="player-controls">
        <button class="control-btn" on:click={previousTrack}>⏮</button>
        <button class="control-btn play-pause" on:click={togglePlay} disabled={isLoading}>
          {#if isLoading}
            ⏳
          {:else}
            {isPlaying ? '⏸' : '▶'}
          {/if}
        </button>
        <button class="control-btn" on:click={nextTrack}>⏭</button>
        <button class="control-btn" on:click={togglePlaylist}>📋</button>
        <button class="control-btn emergency" on:click={emergencyFix} title="Emergency Fix">🚨</button>
      </div>
      
      <!-- Volume Control -->
      <div class="volume-control">
        <span>🔊</span>
        <input type="range" min="0" max="100" 
               value={volume * 100} 
               on:input={handleVolumeChange} 
               class="volume-slider">
        <span class="volume-value">{Math.round(volume * 100)}%</span>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar" on:click={handleSeek}>
          <div class="progress-fill" 
               style="width: {duration ? (currentTime / duration) * 100 : 0}%">
          </div>
        </div>
      </div>

      <!-- Quick Status -->
      <div class="status-info">
        <div class="status-item">
          <span class="status-label">Status:</span>
          <span class="status-value {isPlaying ? 'playing' : 'paused'}">
            {isLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">Track:</span>
          <span class="status-value">{currentTrack + 1}/{playlist.length}</span>
        </div>
      </div>
    </div>
    {/if}
  </div>
  
  <!-- Playlist Panel -->
  {#if showPlaylist && canShowControls}
  <div class="playlist-panel">
    <div class="playlist-header">
      <span>🎵 PLAYLIST ({playlist.length} tracks)</span>
      <button class="close-btn" on:click={() => showPlaylist = false}>×</button>
    </div>
    <div class="playlist-content">
      {#if playlist.length === 0}
        <div class="playlist-empty">No tracks loaded</div>
      {:else}
        {#each playlist as track, index}
          <button class="playlist-item" 
                  class:active={index === currentTrack}
                  on:click={() => selectTrack(index)}>
            <div class="track-title">{track.name}</div>
            <div class="track-artist">{track.artist || 'Unknown'}</div>
            {#if track.working}
              <div class="track-status-indicator">✅</div>
            {:else if track.working === false}
              <div class="track-status-indicator">⚠️</div>
            {/if}
          </button>
        {/each}
      {/if}
    </div>
    <div class="playlist-actions">
      <input type="file" 
             webkitdirectory 
             multiple 
             accept="audio/*" 
             on:change={handleFolderSelect}
             style="display: none;"
             bind:this={undefined}
             id="music-folder-revived">
      <button class="action-btn" on:click={() => document.getElementById('music-folder-revived').click()}>
        📁 Load Folder
      </button>
      <button class="action-btn" on:click={loadBestTracks}>🎵 Demo Tracks</button>
      <button class="action-btn" on:click={emergencyFix}>🚨 Emergency Fix</button>
    </div>
  </div>
  {/if}
  
  <!-- Mini Audio Visualizer -->
  {#if isPlaying && canShowControls}
  <canvas bind:this={visualizerCanvas} 
          class="mini-visualizer" 
          width="200" 
          height="60">
  </canvas>
  {/if}
</div>

<style>
.background-music-player {
  position: fixed; /* Fixed position for free dragging across screen */
  bottom: 120px;
  right: 20px;
  z-index: 99999; /* Maximum z-index to stay on top */
  font-family: 'Rajdhani', sans-serif;
}

.music-control-panel {
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid rgba(0, 217, 255, 0.6);
  border-radius: 8px;
  backdrop-filter: blur(12px);
  min-width: 320px;
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.4);
  transition: all 0.3s ease;
  overflow: hidden; /* Ukryj scrollbary */
  resize: none; /* Wyłącz resize handles */
}

/* Ukryj wszystkie scrollbary i resize handles w całym panelu */
.music-control-panel *::-webkit-scrollbar {
  display: none;
}

.music-control-panel * {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  resize: none; /* Wyłącz resize handles */
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.9), rgba(0, 217, 255, 0.1));
  border-bottom: 2px solid rgba(0, 217, 255, 0.5);
  border-radius: 6px 6px 0 0;
  color: #00d7ef;
  font-size: 14px;
  font-weight: 600;
  cursor: move;
  user-select: none;
}

.minimize-btn, .close-btn {
  background: none;
  border: none;
  color: #00d7ef;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 16px;
}

.minimize-btn:hover, .close-btn:hover {
  background-color: rgba(0, 217, 255, 0.2);
}

.panel-loading {
  padding: 24px;
  text-align: center;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-icon {
  font-size: 2rem;
  color: #00d7ef;
  animation: pulse 2s ease-in-out infinite;
}

.loading-text {
  color: #00d7ef;
  font-size: 14px;
  font-weight: 600;
}

.loading-subtext {
  color: rgba(0, 217, 255, 0.7);
  font-size: 12px;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  color: #00d7ef;
  animation: blink 1.5s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.5s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.panel-content {
  padding: 15px;
  transition: all 0.3s ease;
}

.now-playing {
  margin-bottom: 15px;
}

.track-info {
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 217, 255, 0.3);
}

.track-name {
  color: #00d7ef;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-time {
  color: rgba(0, 217, 255, 0.7);
  font-size: 12px;
  margin-bottom: 3px;
}

.track-status {
  color: #00ff00;
  font-size: 10px;
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
}

.control-btn {
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(0, 217, 255, 0.5);
  color: #00d7ef;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  min-width: 40px;
}

.control-btn:hover:not(:disabled) {
  background: rgba(0, 217, 255, 0.2);
  border-color: #00d7ef;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.4);
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-pause {
  background: rgba(0, 217, 255, 0.1);
  border-color: #00d7ef;
  font-size: 18px;
}

.play-pause:hover:not(:disabled) {
  background: rgba(0, 217, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.6);
}

.emergency {
  background: rgba(255, 0, 0, 0.2);
  border-color: #ff0000;
  color: #ff0000;
  font-size: 14px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.volume-control span {
  color: #00d7ef;
  font-size: 14px;
}

.volume-value {
  color: rgba(0, 217, 255, 0.7);
  font-size: 12px;
  min-width: 35px;
}

.volume-slider {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  appearance: none;
  border: 1px solid rgba(0, 217, 255, 0.3);
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00d7ef;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 5px rgba(0, 217, 255, 0.6);
}

.progress-container {
  margin-top: 10px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(0, 217, 255, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d7ef, rgba(0, 217, 255, 0.8));
  transition: width 0.1s ease;
}

.status-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.status-item {
  display: flex;
  gap: 5px;
}

.status-label {
  color: rgba(0, 217, 255, 0.6);
}

.status-value {
  color: #fff;
}

.status-value.playing {
  color: #00ff00;
}

.status-value.paused {
  color: #ff9500;
}

.playlist-panel {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  width: 350px;
  max-height: 450px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid rgba(0, 217, 255, 0.6);
  border-radius: 8px;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.4);
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.9), rgba(0, 217, 255, 0.1));
  border-bottom: 1px solid rgba(0, 217, 255, 0.5);
  border-radius: 6px 6px 0 0;
  color: #00d7ef;
  font-size: 14px;
  font-weight: 600;
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
  background: rgba(0, 217, 255, 0.1);
}

.playlist-content::-webkit-scrollbar-thumb {
  background: rgba(0, 217, 255, 0.5);
  border-radius: 4px;
}

.playlist-empty {
  text-align: center;
  color: rgba(0, 217, 255, 0.5);
  padding: 30px;
  font-size: 14px;
}

.playlist-item {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 217, 255, 0.3);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  position: relative;
}

.playlist-item:hover {
  background: rgba(0, 217, 255, 0.1);
  border-color: rgba(0, 217, 255, 0.6);
}

.playlist-item.active {
  background: rgba(0, 217, 255, 0.2);
  border-color: #00d7ef;
  color: #00d7ef;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.4);
}

.track-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
}

.track-artist {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.track-status-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 10px;
}

.playlist-actions {
  padding: 10px;
  border-top: 1px solid rgba(0, 217, 255, 0.4);
  display: flex;
  gap: 5px;
}

.action-btn {
  flex: 1;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 217, 255, 0.4);
  color: #00d7ef;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(0, 217, 255, 0.2);
  border-color: #00d7ef;
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
}

.mini-visualizer {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.4);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .background-music-player {
    bottom: 80px;
    right: 10px;
  }
  
  .music-control-panel {
    min-width: 280px;
  }
  
  .playlist-panel {
    width: 300px;
  }
}
</style>
