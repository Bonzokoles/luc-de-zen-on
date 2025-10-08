# Plan Refaktoryzacji Systemów Głosowych - Voice UI Restructuring

## 📋 Informacje o Zadaniu

**Data utworzenia**: 7 października 2025  
**Wersja aplikacji**: MyBonzo Platform v2.0 (commit: 43f0279e)  
**Cel główny**: Refaktoryzacja architektury interfejsu głosowego zgodnie z wymaganiami użytkownika  
**Status**: W planowaniu → Implementacja

---

## 🎯 Wymagania Użytkownika

> "chcialbym przenies funkcje z górnego floating buttons na główne okno w aplikacji a floating buttons niech tylko uruchamia mozliwość porozumiewania głosowego globalnie i wizualizator dzwięku"

> "jedna warstaw jest przeznaczona dla voice funkcje a dwie w tle są podłączone do music player .wiec mamy jedną dla voice"

### Interpretacja Wymagań

1. **Przeniesienie funkcji**: Z floating buttons → główne okno aplikacji
2. **Uproszczenie floating buttons**: Tylko globalna aktywacja + audio visualizer
3. **Separacja warstw audio**:
   - Warstwa 1: Voice functions (priorytet)
   - Warstwa 2-3: Music player (background)

---

## 🔍 Analiza Obecnej Architektury

### Aktualna Struktura (index.astro)

#### 1. Główne Okno

```astro
<!-- Linia 388-389 -->
<div id="globalVoiceWidget" class="floating-widget hidden">
  <GoogleVoiceAgent client:load />
</div>
```

#### 2. Floating Buttons z Voice Controls (Duplikacja funkcji)

- **Gemini Pro Voice** (linie 404-416)
- **Gemini Vision Voice** (linie 450-462)
- **Code Bison Voice** (linie 488-500)
- **Text Bison Voice** (linie 538-550)
- **Google Bard Voice** (linie 590-602)
- **PaLM API Voice** (linie 642-654)
- **Vertex AI Voice** (linie 694-706)
- **AI Studio Voice** (linie 746-758)

#### 3. Globalny System Kontroli

```javascript
function toggleGlobalVoice() {
  // Kontrola wszystkich instancji głosowych
  // Management voiceRecognitionInstances
}
```

---

## 🏗️ Docelowa Architektura

### 1. **Główne Okno** - Pełna Funkcjonalność Voice

#### GoogleVoiceAgent Enhancement:

- **Multi-Agent Support**: Obsługa wszystkich AI agentów z jednego miejsca
- **Unified Voice Interface**: Jeden interfejs dla wszystkich funkcji głosowych
- **Agent Selector**: Dropdown do wyboru aktywnego agenta
- **Advanced Controls**:
  - Language selection (pl-PL, en-US, de-DE)
  - Voice recognition settings
  - Response mode selection
  - Audio quality controls

#### Funkcje do przeniesienia:

```typescript
interface VoiceAgentFunctions {
  geminiPro: {
    start: () => void;
    stop: () => void;
    toggle: () => void;
  };
  geminiVision: {
    /* same interface */
  };
  codeBison: {
    /* same interface */
  };
  textBison: {
    /* same interface */
  };
  googleBard: {
    /* same interface */
  };
  palmAPI: {
    /* same interface */
  };
  vertexAI: {
    /* same interface */
  };
  aiStudio: {
    /* same interface */
  };
}
```

### 2. **Floating Buttons** - Tylko Globalna Kontrola

#### Uproszczony Interfejs:

```astro
<!-- Globalna Aktywacja Głosu -->
<button id="globalVoiceActivator" class="voice-global-btn">
  🎤 VOICE SYSTEM
</button>

<!-- Audio Visualizer Widget -->
<div id="audioVisualizerWidget" class="floating-widget hidden">
  <canvas id="audioVisualizerCanvas"></canvas>
  <div class="audio-controls">
    <button id="muteToggle">🔇</button>
    <input type="range" id="volumeControl" min="0" max="100" value="70">
    <div id="audioLevels">📊</div>
  </div>
</div>
```

### 3. **Audio Layer Separation** - Trójwarstwowa Architektura

```typescript
interface AudioLayerManager {
  layers: {
    voice: {
      priority: 1;
      channels: ["speech_recognition", "tts_output"];
      volume: number;
    };
    musicPrimary: {
      priority: 2;
      channels: ["music_main", "ambient_sounds"];
      volume: number;
    };
    musicSecondary: {
      priority: 3;
      channels: ["background_music", "system_sounds"];
      volume: number;
    };
  };
}
```

---

## 📝 Plan Implementacji

### Faza 1: Backup i Przygotowanie

- [x] ✅ Analiza obecnej struktury
- [x] ✅ Dokumentacja planu
- [ ] 🔄 Backup aktualnego kodu
- [ ] 🔄 Przygotowanie środowiska testowego

### Faza 2: Refaktoryzacja GoogleVoiceAgent

- [ ] 📋 Enhancement komponentu GoogleVoiceAgent.svelte
- [ ] 📋 Dodanie obsługi multi-agent
- [ ] 📋 Implementacja agent selector
- [ ] 📋 Unified voice controls interface

### Faza 3: Uproszczenie Floating Buttons

- [ ] 📋 Usunięcie duplicate voice controls z każdego agenta
- [ ] 📋 Implementacja globalnego przycisku aktywacji
- [ ] 📋 Utworzenie audio visualizer widget
- [ ] 📋 Zachowanie podstawowych funkcji agentów (bez voice controls)

### Faza 4: Audio Layer Management

- [ ] 📋 Implementacja AudioLayerManager
- [ ] 📋 Separacja kanałów audio (voice vs music)
- [ ] 📋 Priority management system
- [ ] 📋 Volume control per layer

### Faza 5: Testing i Optymalizacja

- [ ] 📋 Testy funkcjonalności głosowych
- [ ] 📋 Testy audio layer separation
- [ ] 📋 Performance optimization
- [ ] 📋 Browser compatibility check

### Faza 6: Deployment

- [ ] 📋 Build i test na luc-de-zen-on.pages.dev
- [ ] 📋 Validation na środowisku produkcyjnym
- [ ] 📋 Deploy to production (mybonzo.com)

---

## 🛠️ Szczegóły Techniczne

### Pliki do Modyfikacji:

#### 1. **src/pages/index.astro**

- Usunięcie voice controls z floating widgets (linie 404-758)
- Modyfikacja globalVoiceWidget integration
- Dodanie globalnego audio visualizer

#### 2. **src/components/GoogleVoiceAgent.svelte**

- Enhancement do obsługi multi-agent
- Dodanie agent selector UI
- Implementacja unified voice interface
- Integration z wszystkimi AI agents

#### 3. **Nowe pliki**:

- `src/components/AudioVisualizer.svelte` - Real-time audio visualization
- `src/utils/AudioLayerManager.ts` - Audio layer management
- `src/types/VoiceTypes.ts` - TypeScript definitions

### API Endpoints do Zachowania:

- `/api/voice?action=status` ✅ (aktualnie działa)
- `/api/gemini-pro-voice`
- `/api/gemini-vision-voice`
- `/api/code-bison-voice`
- Wszystkie pozostałe voice endpoints

### JavaScript Functions do Refaktoryzacji:

```javascript
// REMOVE: Individual voice functions
-toggleGeminiProVoice() -
  toggleGeminiVisionVoice() -
  toggleCodeBisonVoice() -
  toggleTextBisonVoice() -
  toggleBardVoice() -
  togglePaLMVoice() -
  toggleVertexVoice() -
  toggleAIStudioVoice() +
  // ENHANCE: Global voice management
  enhancedToggleGlobalVoice() +
  switchVoiceAgent(agentName) +
  getAudioVisualizationData() +
  manageAudioLayers();
```

---

## 🎨 UI/UX Improvements

### Główne Okno - Enhanced Voice Interface:

```
┌─────────────────────────────────────┐
│ 🎤 VOICE SYSTEM - MyBonzo Platform  │
├─────────────────────────────────────┤
│ Agent: [Gemini Pro ▼]               │
│ Language: [🇵🇱 Polish ▼]              │
│ ┌─────────────────────────────────┐ │
│ │ ▶️ Start   ⏸️ Pause   ⏹️ Stop    │ │
│ └─────────────────────────────────┘ │
│ 📊 [████████████████] 85% Vol      │
│ Status: 🟢 Ready                    │
│ Last Command: "Opisz obraz..."      │
└─────────────────────────────────────┘
```

### Floating Button - Simplified:

```
┌─────────────────┐
│ 🎤 VOICE SYSTEM │ ← Global Activation Only
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ 📊 🔊 ████████  │ ← Audio Visualizer
│ Vol: 70% 🔇     │
└─────────────────┘
```

---

## ⚠️ Uwagi i Considerations

### Zachowanie Backward Compatibility:

- Wszystkie istniejące API endpoints muszą działać
- Existing JavaScript functions powinny mieć graceful degradation
- User preferences i settings zachowane w localStorage

### Performance Considerations:

- Audio visualization nie może wpływać na performance voice recognition
- Lazy loading komponentów głosowych
- Efficient memory management dla audio streams

### Browser Support:

- Web Speech API compatibility
- Audio Context support
- WebRTC considerations dla realtime audio

### Security:

- Microphone permissions handling
- Audio data privacy
- Secure API communications

---

## 📊 Success Metrics

### Funkcjonalne:

- [x] ✅ Voice API status check: `success` (verified)
- [ ] 📋 Wszystkie agenty dostępne z głównego okna
- [ ] 📋 Floating buttons tylko do globalnej kontroli
- [ ] 📋 Audio layers properly separated

### Performance:

- [ ] 📋 < 2s voice recognition startup time
- [ ] 📋 < 100ms audio layer switching
- [ ] 📋 60fps audio visualization
- [ ] 📋 < 50MB memory usage increase

### User Experience:

- [ ] 📋 Intuitive single voice interface
- [ ] 📋 Clear visual feedback
- [ ] 📋 Responsive audio controls
- [ ] 📋 Seamless agent switching

---

## 🚀 Post-Implementation

### Documentation Updates:

- Update AGENT_BRIEFING.md
- Update component documentation
- User guide dla nowego voice interface

### Future Enhancements:

- Voice commands dla switching agents
- Custom voice training
- Multi-language TTS
- Advanced audio visualization modes

---

**Autor**: GitHub Copilot  
**Reviewer**: MyBonzo Development Team  
**Status**: Ready for Implementation  
**Next Action**: Rozpoczęcie Fazy 1 - Backup i Przygotowanie
