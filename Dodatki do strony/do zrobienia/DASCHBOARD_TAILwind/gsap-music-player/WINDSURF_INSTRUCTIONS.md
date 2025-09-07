# WINDSURF - ZADANIE: GSAP Music Player

## INSTRUKCJE REALIZACJI:

### 🎯 CEL: Przekształć audio visualizer w folder music player

### 📁 AKTUALNE PLIKI:
- `dist/index.html` - główny interface
- `dist/script.js` - logika audio (1525 linii)  
- `dist/style.css` - styling sci-fi

### ⚡ ZADANIA DO WYKONANIA:

## 1. FOLDER BROWSER (START HERE)
**Plik:** `dist/index.html` linia ~185
**Zmień:**
```html
<!-- PRZED -->
<input type="file" id="audio-file-input" class="audio-file-input" accept="audio/*">

<!-- PO -->
<input type="file" id="folder-input" class="audio-file-input" webkitdirectory multiple accept="audio/*">
<button class="audio-file-btn" id="folder-btn">SELECT MUSIC FOLDER</button>
```

**Plik:** `dist/script.js` linia ~1456
**Dodaj nową funkcję:**
```javascript
function loadMusicFolder(files) {
  const audioFiles = Array.from(files).filter(file => 
    file.type.startsWith('audio/') || 
    /\.(mp3|wav|ogg|m4a|flac)$/i.test(file.name)
  );
  
  currentPlaylist = audioFiles.map((file, index) => ({
    file: file,
    name: file.name,
    url: URL.createObjectURL(file),
    index: index
  }));
  
  updatePlaylistDisplay();
  if (currentPlaylist.length > 0) {
    loadTrack(0);
  }
}
```

## 2. PLAYLIST WIDGET  
**Plik:** `dist/index.html` - dodaj PRZED zamykającym `</body>`:
```html
<div class="playlist-panel">
  <div class="playlist-header">
    <span>PLAYLIST</span>
    <span id="track-count">0 TRACKS</span>
  </div>
  <div class="playlist-content" id="playlist-content">
    <!-- Generated dynamically -->
  </div>
</div>
```

**Plik:** `dist/style.css` - dodaj na końcu:
```css
.playlist-panel {
  position: fixed;
  right: 20px;
  top: 300px;
  width: 300px;
  background: rgba(0, 20, 30, 0.9);
  border: 1px solid #00ff41;
  border-radius: 4px;
  max-height: 400px;
  overflow: hidden;
}

.playlist-header {
  padding: 10px;
  background: rgba(0, 255, 65, 0.1);
  border-bottom: 1px solid #00ff41;
  display: flex;
  justify-content: space-between;
  font-family: monospace;
  color: #00ff41;
  font-size: 12px;
}

.playlist-content {
  max-height: 350px;
  overflow-y: auto;
}

.playlist-item {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(0, 255, 65, 0.2);
  cursor: pointer;
  font-family: monospace;
  font-size: 11px;
  color: #ccc;
  transition: all 0.2s;
}

.playlist-item:hover {
  background: rgba(0, 255, 65, 0.1);
  color: #00ff41;
}

.playlist-item.active {
  background: rgba(255, 78, 66, 0.2);
  color: #ff4e42;
  box-shadow: inset 0 0 10px rgba(255, 78, 66, 0.3);
}
```

## 3. NAVIGATION CONTROLS
**Plik:** `dist/index.html` - znajdź audio-controls i dodaj przyciski:
```html
<div class="navigation-controls">
  <button class="nav-btn" id="prev-btn">◀◀ PREV</button>
  <button class="nav-btn" id="next-btn">NEXT ▶▶</button>
</div>
```

**Plik:** `dist/script.js` - dodaj funkcje navigation:
```javascript
let currentPlaylist = [];
let currentTrackIndex = 0;

function nextTrack() {
  if (currentPlaylist.length === 0) return;
  currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
  loadTrack(currentTrackIndex);
}

function prevTrack() {
  if (currentPlaylist.length === 0) return;
  currentTrackIndex = currentTrackIndex === 0 ? currentPlaylist.length - 1 : currentTrackIndex - 1;
  loadTrack(currentTrackIndex);
}

function loadTrack(index) {
  if (!currentPlaylist[index]) return;
  const track = currentPlaylist[index];
  currentTrackIndex = index;
  
  // Update audio player
  const audioPlayer = document.getElementById('audio-player');
  audioPlayer.src = track.url;
  
  // Update UI
  updatePlaylistDisplay();
  updateNowPlaying(track.name);
}
```

## 4. EVENT LISTENERS
**Plik:** `dist/script.js` - zamień istniejące event listenery:
```javascript
// Zamień folder input event
document.getElementById("folder-btn").addEventListener("click", function() {
  document.getElementById("folder-input").click();
});

document.getElementById("folder-input").addEventListener("change", function(e) {
  if (e.target.files.length > 0) {
    loadMusicFolder(e.target.files);
  }
});

// Dodaj navigation events
document.getElementById("prev-btn").addEventListener("click", prevTrack);
document.getElementById("next-btn").addEventListener("click", nextTrack);

// Auto-next po zakończeniu utworu
document.getElementById("audio-player").addEventListener("ended", function() {
  nextTrack();
});
```

### 🎨 STYLE REQUIREMENTS:
- Zachowaj sci-fi terminal aesthetic
- Użyj istniejących kolorów: #00ff41 (zielony), #ff4e42 (czerwony)
- Font: monospace
- Glow effects dla aktywnych elementów

### ✅ KRYTERIA SUKCESU:
1. Możliwość wyboru folderu z muzyką
2. Lista utworów w playlist panelu
3. Klik na utwór = zmiana utworu
4. Previous/Next buttons działają
5. Wizualizacja 3D nadal reaguje na audio

### 🚀 START TERAZ!
Zacznij od punktu 1 (Folder Browser) i kontynuuj sekwencyjnie.
