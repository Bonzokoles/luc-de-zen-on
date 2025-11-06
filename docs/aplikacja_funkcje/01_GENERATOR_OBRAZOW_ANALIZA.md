# 🎨 ANALIZA GENERATORA OBRAZÓW - KOMPLETNA DOKUMENTACJA

## 📁 STRUKTURA PLIKÓW I ZALEŻNOŚCI

### **Główne Pliki Systemu**

#### 🎯 **Frontend Interface**
- **`src/pages/image-generator.astro`** (1623 linie)
  - Główny interfejs użytkownika
  - Wszystkie funkcje JavaScript
  - HTML struktura z elementami UI
  - Event handlers i logika frontendowa

#### 🔗 **Backend API Endpoints**
- **`src/pages/api/enhanced-generator.ts`** (613 linii)
  - Główny endpoint generowania `/api/enhanced-generator`
  - Multi-modal AI generator z POLACZEK_T
  - Obsługa wszystkich typów modeli AI
  
- **`src/pages/api/generate-image.ts`** (284 linie)
  - Alternatywny endpoint `/api/generate-image`
  - Obsługa modeli zewnętrznych
  - CORS utils i error handling

- **`src/pages/api/image-generator/generate.ts`** (382 linie)
  - Specjalistyczny endpoint `/api/image-generator/generate`
  - Historia generacji i analytics
  - Batch generation i quality analysis

#### 🌐 **Tłumaczenia i Wsparcie**
- **`src/pages/api/polaczek-t.ts`** (172 linie)
  - Endpoint tłumaczeń `/api/polaczek-t`
  - Auto-translacja polskich promptów
  - Cloudflare AI i fallback systems

#### 🆓 **Darmowe Modele AI**
- **`src/pages/api/free-ai-models/image-video.ts`** (333 linie)
  - Together AI, Stability AI, HuggingFace
  - OpenAI Sora dla video

---

## 🔧 PRZYCISK I FUNKCJONALNOŚĆI

### **Główne Przyciski Akcji**

#### 1. **Przycisk Generuj Obraz** 
```javascript
// ID: generateBtn
// Event: enhancedGenerateImage()
// Endpoint: /api/enhanced-generator
```

#### 2. **Losowy Prompt** 
```javascript
// ID: randomPromptBtn  
// Function: generateRandomPrompt()
```

#### 3. **Zapisz Preset**
```javascript
// ID: savePresetBtn
// Function: saveCurrentPreset()
```

#### 4. **Tłumacz Prompt**
```javascript
// ID: translateBtn
// Function: translatePrompt()
// Endpoint: /api/translate
```

#### 5. **Ulepszanie Promptu (Magic)**
```javascript
// ID: enhanceBtn  
// Function: enhancePrompt()
// Endpoint: /api/enhance-prompt
```

### **Przyciski Preset Kategorii**
```javascript
loadPreset('portrait')    // 👤 Portret
loadPreset('landscape')   // 🏞️ Krajobraz  
loadPreset('abstract')    // 🎭 Abstrakcja
loadPreset('scifi')       // 🚀 Sci-Fi
loadPreset('anime')       // 🎌 Anime
loadPreset('vintage')     // 📷 Vintage
loadPreset('cyberpunk')   // 🌆 Cyberpunk
loadPreset('nature')      // 🌿 Natura
```

### **Zarządzanie Historią**
```javascript
clearHistory()      // 🗑️ Wyczyść historię
exportHistory()     // 📤 Eksportuj JSON
openHistoryPanel()  // 📚 Otwórz panel
closeHistory()      // ✕ Zamknij panel
```

---

## 🤖 MODELE AI I POŁĄCZENIA

### **🔥 Cloudflare AI Models (Darmowe)**
```javascript
"@cf/stabilityai/stable-diffusion-xl-base-1.0"    // Stable Diffusion XL
"@cf/lykon/dreamshaper-8-lcm"                     // DreamShaper 8 LCM  
"@cf/black-forest-labs/flux-1-schnell"            // Flux-1 Schnell
"@cf/runwayml/stable-diffusion-v1-5-inpainting"   // SD 1.5 Inpainting
"@cf/runwayml/stable-video-diffusion"             // Stable Video Diffusion
"@cf/meta/llama-mesh"                            // LLaMA Mesh 3D
```

### **🌐 OpenRouter Models**
```javascript
"openrouter/stabilityai/stable-diffusion-3-medium"  // SD 3 Medium
"openrouter/black-forest-labs/flux-1-schnell"       // FLUX.1 Schnell
"openrouter/minimax/video-01"                       // MiniMax Video-01
"openrouter/stability/3d-model"                     // Stability 3D
"openrouter/stability/controlnet"                   // ControlNet
```

### **🆓 Externí Free Models**
```javascript
"together_flux"           // Together AI - FLUX.1-schnell  
"hf_playground"          // HuggingFace - Playground v2.5
"stability_sdxl"         // Stability AI - SDXL
"openai_sora"           // OpenAI - Sora (Video)
"stabilityai/stable-diffusion-3-medium"   // SD 3 Medium
"black-forest-labs/flux-1.1-pro"         // FLUX 1.1 Pro
```

---

## 💾 ZAPISYWANIE OBRAZÓW I PLIKÓW

### **LocalStorage System**
```javascript
// Historia generacji
localStorage.setItem("imageHistory", JSON.stringify(generationHistory))
localStorage.getItem("imageHistory") || "[]"
localStorage.removeItem("imageHistory")

// Struktura zapisywanego obiektu:
{
  id: Date.now(),
  prompt: prompt,
  imageUrl: dataUrl,        // Base64 data URL
  ts: new Date().toISOString(),
  settings: {
    model: model,
    style: style, 
    width: dims.width,
    height: dims.height,
    steps: steps
  }
}
```

### **Formaty Zapisu Obrazów**
- **Data URLs**: `data:image/png;base64,[base64data]`
- **Blob URLs**: `blob:http://localhost/[uuid]`
- **Download Links**: Automatyczne pobieranie przez `<a download>`

### **Export/Import System**
```javascript
// Eksport historii do JSON
function exportHistory() {
  const dataStr = JSON.stringify(generationHistory, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  // Auto-download jako image-history.json
}
```

---

## 🔄 WORKFLOW GENERACJI

### **Proces Generacji Obrazu**
```mermaid
1. Wprowadzenie promptu
2. Auto-translacja (POLACZEK_T) jeśli polski tekst
3. AI Enhancement promptu (opcjonalne)  
4. NSFW Detection i blur (opcjonalne)
5. Wybór modelu AI
6. Wywołanie API endpoint
7. Generacja obrazu
8. Konwersja do Data URL
9. Zapis do localStorage
10. Wyświetlenie w UI
```

### **API Flow**
```
Frontend → /api/enhanced-generator → AI Models → Response
        ↓
    localStorage ← Blob/DataURL ← Binary Image
```

---

## 📊 ANALYTICS I STATYSTYKI

### **Live Stats Display**
```javascript
#totalGenerated    // Liczba wygenerowanych obrazów
#avgTime          // Średni czas generacji  
#activeModel      // Aktualnie wybrany model
#savedImages      // Liczba zapisanych obrazów
```

### **Historia Tracking**
```javascript
// Tracking danych generacji
generationHistory = [{
  id, prompt, imageUrl, timestamp, 
  settings: {model, style, width, height, steps}
}]

// Statystyki historii
#historyTotal     // Łącznie obrazów
#historyToday     // Dzisiaj
#historyWeek      // Ten tydzień  
#historyFavorites // Ulubione
```

---

## 🎨 STYLE I PARAMETRY

### **Dostępne Style**
```javascript
"realistic"     // 📸 Fotograficzny
"artistic"      // 🎨 Artystyczny  
"digital"       // 💻 Cyfrowy
"anime"         // 🎭 Anime
"abstract"      // 🌈 Abstrakcyjny
"cinematic"     // 🎬 Kinowy
"fantasy"       // 🧙 Fantasy
"cyberpunk"     // 🤖 Cyberpunk
```

### **Rozmiary Obrazów**
```javascript
"512x512"       // Kwadrat standardowy
"768x512"       // Poziomo  
"512x768"       // Pionowo
"1024x1024"     // Duży kwadrat
```

### **Kroki Generacji**
```javascript
15, 25, 35, 50  // Więcej kroków = lepsza jakość
```

---

## 🔒 ZABEZPIECZENIA

### **NSFW Content Protection**
```javascript
// Auto-blur system
nsfwBlur: checked          // Automatyczne rozmywanie
nsfw_detected: boolean     // Detekcja przez AI
nsfw_blur_applied: boolean // Status zastosowania blur
```

### **CORS Headers**
```javascript
"Access-Control-Allow-Origin": "*"
"Access-Control-Allow-Methods": "POST, GET, OPTIONS"  
"Access-Control-Allow-Headers": "Content-Type, Authorization"
```

---

## 🔑 ZMIENNE ŚRODOWISKOWE

### **API Keys Requirements**
```bash
# Cloudflare Runtime
AI                    # Cloudflare AI binding
OPENROUTER_API_KEY   # OpenRouter access
STABILITY_API_KEY    # Stability AI access
DEEPSEEK_API_KEY     # DeepSeek for enhancement
TOGETHER_API_KEY     # Together AI access
HUGGINGFACE_API_KEY  # HuggingFace access
OPENAI_API_KEY       # OpenAI access
```

---

## 🐛 POTENCJALNE PROBLEMY DO NAPRAW

### **Zidentyfikowane Issues**
1. **Konflikty Event Handlerów** - Inline onclick vs addEventListener
2. **Memory Leaks** - Blob URLs nie są zwalniane  
3. **Error Handling** - Niepełna obsługa błędów API
4. **Race Conditions** - Współbieżne requesty
5. **LocalStorage Limits** - Brak limitów rozmiaru
6. **NSFW Detection** - Niespójne działanie
7. **Mobile Responsiveness** - UI issues na małych ekranach
8. **Loading States** - Niepełne loading indicators

### **Performance Issues**
- Duże Base64 strings w localStorage
- Brak lazy loading dla historii
- Excessive DOM manipulation
- Missing request debouncing

---

## 📈 METRYKI WYDAJNOŚCI

### **Obecne Ograniczenia**
- Historia max 20 obrazów (hardcoded)
- Timeout requestów nie ustawiony
- Brak retry logic dla failed requests
- Nie ma progress bars dla długich generacji

---

*Dokumentacja przygotowana dla napraw Gemini CLI - zawiera wszystkie kluczowe elementy systemu generatora obrazów.*