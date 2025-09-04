# GSAP Music Player - Plan Adaptacji

## Cel: Przekształcenie Audio Visualizer w Folder Music Player

### Aktualne funkcje (już gotowe):
- ✅ Web Audio API + spectrum analyzer
- ✅ 3D wizualizacja Three.js reagująca na audio 
- ✅ Upload pojedynczych plików audio
- ✅ Audio controls (play/pause/volume)
- ✅ Sensitivity slider
- ✅ Demo tracki online

### ZADANIA DO REALIZACJI:

## 1. FOLDER BROWSER (Priorytet 1)
**Lokalizacja:** Zamienić input[type="file"] w HTML
**Zadanie:** 
- Dodać `webkitdirectory` attribute do input
- Funkcja `loadMusicFolder()` w script.js
- Skanowanie obsługiwanych formatów (.mp3, .wav, .ogg, .m4a)

**Kod do dodania:**
```html
<input type="file" id="folder-input" webkitdirectory multiple accept="audio/*">
<button class="audio-file-btn" id="folder-btn">SELECT MUSIC FOLDER</button>
```

## 2. PLAYLIST WIDGET (Priorytet 1)
**Lokalizacja:** Nowy panel po prawej stronie
**Zadanie:**
- Panel z listą utworów
- Aktualnie grający utwór highlighted
- Click = zmiana utworu
- Auto-scroll do aktualnego

**Struktura HTML:**
```html
<div class="playlist-panel">
  <div class="playlist-header">PLAYLIST</div>
  <div class="playlist-content" id="playlist-content">
    <!-- Lista utworów generowana dynamicznie -->
  </div>
</div>
```

## 3. NAVIGATION CONTROLS (Priorytet 2)
**Lokalizacja:** Rozszerzenie audio-controls sekcji
**Zadanie:**
- Previous track button
- Next track button  
- Shuffle mode toggle
- Repeat mode toggle

**Funkcje JS:**
```javascript
function nextTrack()
function prevTrack() 
function toggleShuffle()
function toggleRepeat()
```

## 4. NOW PLAYING INFO (Priorytet 2)
**Lokalizacja:** Górny panel (zamienić timestamp)
**Zadanie:**
- Nazwa aktualnego pliku
- Progress bar
- Time elapsed / total time

## 5. VOLUME CONTROL (Priorytet 3)
**Lokalizacja:** Audio controls panel
**Zadanie:**
- Volume slider (0-100%)
- Mute button

---

## INSTRUKCJE DLA WINDSURF:

### Krok 1: Analiza istniejącego kodu
1. Przeanalizuj `dist/script.js` - znajdź funkcje audio handling
2. Zidentyfikuj gdzie jest `audio-file-input` event listener
3. Sprawdź jak działa `initAudioFile(file)` function

### Krok 2: Implementacja folder browser
1. Zmień HTML input na `webkitdirectory`
2. Modyfikuj event listener dla folder selection
3. Dodaj funkcję `loadMusicFolder(files)` do przetwarzania listy plików

### Krok 3: Playlist widget
1. Dodaj HTML panel po prawej stronie
2. CSS styling w klimacie sci-fi (pasujący do reszty)
3. JavaScript dla generowania listy i handling click events

### Krok 4: Navigation
1. Dodaj previous/next buttons
2. Logika przechodzenia między utworami w playliście
3. Auto-load następnego utworu po zakończeniu

### Krok 5: Testy
1. Test z folderem muzyki
2. Sprawdź czy wizualizacja nadal działa
3. Test navigation controls

---

## STYLE GUIDE:
- Zachować sci-fi terminal aesthetic
- Kolory: zielone akcenty (#00ff41), czerwone błędy (#ff4e42)
- Font: monospace
- Panel borders: cienkie linie
- Glow effects dla aktywnych elementów

## PLIKI DO MODYFIKACJI:
1. `dist/index.html` - dodać playlist panel + zmienić input
2. `dist/script.js` - główna logika folder browsing + playlist
3. `dist/style.css` - styling dla nowych elementów

## OCZEKIWANY REZULTAT:
Kompletny music player z:
- Folder browsing ✅
- Playlist ✅  
- Navigation controls ✅
- Spektakularną wizualizacją 3D ✅
- Wszystko w jednym komponencie ✅

## GOTOWE DO PRACY W WINDSURF!
