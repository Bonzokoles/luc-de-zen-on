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
  
  // Audio context for visualization
  let audioContext = null;
  let analyser = null;
  let dataArray = null;
  let source = null;
  let visualizerCanvas;
  let animationId;
  let visualizerReady = false;
  let canShowControls = false;
  
  // Panel dragging
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let panelX = 0;
  let panelY = 0;

  onMount(() => {
    loadDemoTracks();
    
    // Listen for visualizer ready event
    window.addEventListener('cyber-music-analyser-ready', handleVisualizerReady);
    window.addEventListener('music-analyser-ready', handleVisualizerReady);
    
    // Check if visualizers are already ready
    setTimeout(checkVisualizersStatus, 1000);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('cyber-music-analyser-ready', handleVisualizerReady);
      window.removeEventListener('music-analyser-ready', handleVisualizerReady);
    };
  });

  function handleVisualizerReady() {
    console.log('🎵 Visualizer ready event received!');
    visualizerReady = true;
    canShowControls = true;
  }

  function checkVisualizersStatus() {
    // Check if visualizers are already initialized
    if (window.MUSIC_ANALYSER || window.CYBER_MUSIC) {
      console.log('🎵 Visualizers already ready!');
      visualizerReady = true;
      canShowControls = true;
    }
  }

  function loadDemoTracks() {
    playlist = [
      { name: "MERKABA", url: "https://assets.codepen.io/7558/Merkaba.mp3" },
      { name: "DHAMIKA", url: "https://assets.codepen.io/7558/Dhamika.mp3" },
      { name: "VACANT", url: "https://assets.codepen.io/7558/Vacant.mp3" },
      { name: "LXSTNGHT", url: "https://assets.codepen.io/7558/lxstnght-back_1.mp3" }
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

  function togglePlay() {
    if (!canShowControls) {
      alert('Poczekaj na uruchomienie wizualizatorów muzyki...');
      return;
    }

    if (!playlist[currentTrack]) {
      loadDemoTracks();
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
      setupAudioContext();
      audio.play().then(() => {
        isPlaying = true;
        startVisualization();
        // Dispatch event for main page visualizer
        window.dispatchEvent(new CustomEvent('music-started', {
          detail: { analyser, audioContext, source }
        }));
      }).catch(console.error);
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

  function selectTrack(index) {
    if (!canShowControls) return;
    
    if (index >= 0 && index < playlist.length) {
      currentTrack = index;
      updateTrackInfo();
      if (audio) {
        audio.src = currentTrackFile;
        audio.volume = volume;
        if (isPlaying) {
          audio.play();
        }
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
      file: file
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

  // Global API - compatible with main page and POLACZEK worker
  if (typeof window !== 'undefined') {
    // Clear any previous instances to prevent conflicts
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
        if (!playlist.length) loadDemoTracks();
        else updateTrackInfo();
        if (!visualizerReady) {
          setTimeout(checkVisualizersStatus, 100);
        }
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
      <span>🎵 MUSIC • POLACZEK</span>
      <button class="minimize-btn" on:click={toggleMinimize}>
        {isMinimized ? '+' : '−'}
      </button>
    </div>
    
    {#if !canShowControls}
    <div class="panel-loading">
      <div class="loading-message">
        <div class="loading-icon">🎛️</div>
        <div class="loading-text">Oczekiwanie na wizualizatory muzyki...</div>
        <div class="loading-subtext">Przycisk zostanie odbloqkowany po uruchomieniu</div>
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
        </div>
      </div>
      
      <!-- Controls -->
      <div class="player-controls">
        <button class="control-btn" on:click={previousTrack}>⏮</button>
        <button class="control-btn play-pause" on:click={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button class="control-btn" on:click={nextTrack}>⏭</button>
        <button class="control-btn" on:click={togglePlaylist}>📋</button>
      </div>
      
      <!-- Volume Control -->
      <div class="volume-control">
        <span>🔊</span>
        <input type="range" min="0" max="100" 
               value={volume * 100} 
               on:input={handleVolumeChange} 
               class="volume-slider">
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar" on:click={handleSeek}>
          <div class="progress-fill" 
               style="width: {duration ? (currentTime / duration) * 100 : 0}%">
          </div>
        </div>
      </div>
    </div>
    {/if}
  </div>
  
  <!-- Playlist Panel -->
  {#if showPlaylist && canShowControls}
  <div class="playlist-panel">
    <div class="playlist-header">
      <span>🎵 PLAYLIST</span>
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
            {track.name}
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
      <button class="action-btn" on:click={loadDemoTracks}>🎵 Demo Tracks</button>
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
  position: fixed;
  bottom: 120px;
  right: 20px;
  z-index: 1000;
  font-family: 'Rajdhani', sans-serif;
}

.music-control-panel {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 217, 255, 0.4);
  border-radius: 0px;
  backdrop-filter: blur(10px);
  min-width: 280px;
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.3);
  transition: all 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(0, 217, 255, 0.1));
  border-bottom: 1px solid rgba(0, 217, 255, 0.4);
  border-radius: 0px;
  color: #00d7ef;
  font-size: 12px;
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
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px;
  transition: background-color 0.2s;
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
  color: #00d7ef;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-time {
  color: rgba(0, 217, 255, 0.7);
  font-size: 11px;
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 12px 0;
}

.control-btn {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 217, 255, 0.4);
  color: #00d7ef;
  border-radius: 0px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(0, 217, 255, 0.2);
  border-color: #00d7ef;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.4);
}

.play-pause {
  background: rgba(0, 217, 255, 0.1);
  border-color: #00d7ef;
}

.play-pause:hover {
  background: rgba(0, 217, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.6);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.volume-control span {
  color: #00d7ef;
  font-size: 12px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 0px;
  background: #00d7ef;
  cursor: pointer;
  border: none;
}

.progress-container {
  margin-top: 8px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px;
  cursor: pointer;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d7ef, rgba(0, 217, 255, 0.8));
  transition: width 0.1s ease;
}

.playlist-panel {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  width: 300px;
  max-height: 400px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.4);
  border-radius: 0px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.3);
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8), rgba(0, 217, 255, 0.1));
  border-bottom: 1px solid rgba(0, 217, 255, 0.4);
  border-radius: 0px;
  color: #00d7ef;
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
  background: rgba(0, 217, 255, 0.1);
}

.playlist-content::-webkit-scrollbar-thumb {
  background: rgba(0, 217, 255, 0.5);
  border-radius: 0px;
}

.playlist-empty {
  text-align: center;
  color: rgba(0, 217, 255, 0.5);
  padding: 20px;
  font-size: 12px;
}

.playlist-item {
  display: block;
  width: 100%;
  padding: 6px 8px;
  margin-bottom: 2px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  color: #00d7ef;
  font-size: 11px;
  border-radius: 0px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-item:hover {
  background: rgba(0, 217, 255, 0.2);
  border-color: rgba(0, 217, 255, 0.5);
}

.playlist-item.active {
  background: rgba(0, 217, 255, 0.3);
  border-color: #00d7ef;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.4);
}

.playlist-actions {
  padding: 8px;
  border-top: 1px solid rgba(0, 217, 255, 0.4);
  display: flex;
  gap: 4px;
}

.action-btn {
  flex: 1;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 217, 255, 0.4);
  color: #00d7ef;
  border-radius: 0px;
  cursor: pointer;
  font-size: 10px;
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
  border-radius: 0px;
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
    min-width: 250px;
  }
  
  .playlist-panel {
    width: 280px;
  }
}
</style>
