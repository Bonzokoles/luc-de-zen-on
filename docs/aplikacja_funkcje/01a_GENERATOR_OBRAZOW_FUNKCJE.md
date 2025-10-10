# 🔧 GENERATOR OBRAZÓW - SZCZEGÓŁOWE FUNKCJE I DEPENDENCIES

## 📦 JAVASCRIPT FUNCTIONS MAPPING

### **Core Functions (image-generator.astro)**

#### **Utility Functions**
```javascript
parseSize(size)                    // Parsowanie rozmiaru obrazu
setTemplate(type)                  // Ustawianie szablonu promptu  
setPrompt(p)                      // Ustawianie tekstu promptu
blobToDataUrl(blob)               // Konwersja blob → data URL
```

#### **AI Processing Functions** 
```javascript
translatePrompt()                 // Tłumaczenie PL→EN via POLACZEK_T
enhancePrompt()                   // Ulepszanie promptu przez AI
generateImage()                   // Główna funkcja generacji
enhancedGenerateImage()           // Rozszerzona funkcja generacji
```

#### **Preset Management**
```javascript
loadPreset(category)              // Ładowanie predefiniowanych ustawień
saveCurrentPreset()               // Zapisywanie aktualnych ustawień
generateRandomPrompt()            // Generowanie losowego promptu
randomizeSeed()                   // Randomizacja seed dla generacji
```

#### **Batch Operations**
```javascript
generateBatch()                   // Generowanie wielu obrazów
addToResults(imageUrl, prompt, settings)  // Dodawanie do wyników
```

#### **History Management**
```javascript
updateHistoryDisplay()            // Aktualizacja wyświetlania historii
openHistoryPanel()               // Otwieranie panelu historii
closeHistory()                   // Zamykanie panelu historii
exportHistory()                  // Eksport historii do JSON
clearHistory()                   // Czyszczenie całej historii
```

#### **User Actions**
```javascript
downloadResult(imageUrl)         // Pobieranie obrazu
copyPromptFromResult(prompt)     // Kopiowanie promptu
toggleFavorite(button)           // Przełączanie ulubionych
clearResults()                   // Czyszczenie wyników
```

---

## 🌐 API ENDPOINTS MAPPING

### **Primary Generation Endpoints**
```
POST /api/enhanced-generator      → enhanced-generator.ts
POST /api/generate-image         → generate-image.ts  
POST /api/image-generator/generate → image-generator/generate.ts
```

### **Support Services**
```
POST /api/polaczek-t            → Auto-translation service
POST /api/translate             → Basic translation
POST /api/enhance-prompt        → AI prompt enhancement
POST /api/free-ai-models/image-video → External models
```

### **Utility Endpoints**
```
GET  /api/image-generator/styles    → Available styles
GET  /api/image-generator/history   → Generation history
GET  /api/images/[id]              → Image retrieval
```

---

## 🔗 DEPENDENCIES TREE

### **External Libraries** 
```json
// package.json dependencies używane przez generator
{
  "@astrojs/cloudflare": "^12.0.0",
  "@cloudflare/workers-types": "^4.20241022.0",
  "astro": "^5.14.1"
}
```

### **Runtime Dependencies**
```typescript
// Cloudflare Workers Runtime
locals.runtime.env.AI                 // Cloudflare AI binding
locals.runtime.env.OPENROUTER_API_KEY // OpenRouter access
locals.runtime.env.STABILITY_API_KEY  // Stability AI
locals.runtime.env.TOGETHER_API_KEY   // Together AI
locals.runtime.env.HUGGINGFACE_API_KEY // HuggingFace
locals.runtime.env.DEEPSEEK_API_KEY   // DeepSeek for enhancement
```

### **Internal Utils**
```typescript
import { createOPTIONSHandler, createErrorResponse, createSuccessResponse } from "../../utils/corsUtils";
import { ALLOWED_IMAGE_MODELS, enhancePromptIfRequested, selectModel, buildAIInputs } from "../../utils/imageGeneration";
```

---

## 💾 DATA FLOW & STORAGE

### **LocalStorage Schema**
```javascript
// Klucz: "imageHistory"
// Wartość: JSON Array[Object]
[{
  id: number,                    // Timestamp ID
  prompt: string,                // Oryginalny prompt
  imageUrl: string,              // Data URL base64
  ts: string,                    // ISO timestamp
  settings: {
    model: string,               // Użyty model AI
    style: string,               // Styl wizualny
    width: number,               // Szerokość px
    height: number,              // Wysokość px  
    steps: number                // Kroki generacji
  }
}]
```

### **Memory Management**
```javascript
// Limits & Cleanup
MAX_HISTORY_ITEMS = 20           // Hardcoded limit
generationHistory.slice(0, 20)  // Automatic trimming
URL.createObjectURL(blob)       // Blob URL creation
// BRAK: URL.revokeObjectURL()   // ⚠️ Memory leak potential
```

---

## 🎛️ UI ELEMENTS & IDs

### **Input Controls**
```html
#imagePrompt        → textarea (prompt input)
#imageModel         → select (model selection)  
#imageStyle         → select (style selection)
#imageSize          → select (size selection)
#imageSteps         → select (steps selection)
#nsfwBlur          → checkbox (NSFW blur)
#autoTranslate     → checkbox (auto-translation)
#sourceImageFile   → file input (photo2photo)
```

### **Action Buttons**
```html  
#generateBtn       → Main generation button
#randomPromptBtn   → Random prompt generator
#savePresetBtn     → Preset saver
#translateBtn      → Translation trigger
#enhanceBtn        → AI prompt enhancer
```

### **Display Elements**
```html
#totalGenerated    → Stats: total images
#avgTime          → Stats: average time  
#activeModel      → Stats: current model
#savedImages      → Stats: saved count
#generationResults → Results container
#historyGrid      → History display grid
#historyPanel     → History modal panel
```

### **Loading & Status**
```html
#loading          → Loading indicator
#error-box        → Error message display
#result           → Generated image container
```

---

## 🤖 AI MODEL CONFIGURATIONS

### **Cloudflare AI Models**
```typescript
const CLOUDFLARE_MODELS = {
  "@cf/stabilityai/stable-diffusion-xl-base-1.0": {
    name: "Stable Diffusion XL",
    provider: "Cloudflare", 
    cost: "Free",
    supports: ["image"],
    params: { guidance: 7.5, num_steps: 20 }
  },
  "@cf/lykon/dreamshaper-8-lcm": {
    name: "DreamShaper 8 LCM",
    provider: "Cloudflare",
    cost: "Free", 
    supports: ["image"],
    params: { guidance: 1.0, num_steps: 4 }
  },
  "@cf/black-forest-labs/flux-1-schnell": {
    name: "Flux-1 Schnell", 
    provider: "Cloudflare",
    cost: "Free",
    supports: ["image"],
    params: { num_steps: 4 }
  }
}
```

### **External Models Config**
```typescript
const EXTERNAL_MODELS = {
  "together_flux": {
    endpoint: "https://api.together.xyz/v1/images/generations",
    model: "black-forest-labs/FLUX.1-schnell-Free",
    auth: "Bearer ${TOGETHER_API_KEY}",
    params: { width: 1024, height: 1024, steps: 4, n: 1 }
  },
  "hf_playground": {
    endpoint: "https://api-inference.huggingface.co/models/playgroundai/playground-v2.5-1024px-aesthetic", 
    auth: "Bearer ${HUGGINGFACE_API_KEY}",
    params: { wait_for_model: true }
  }
}
```

---

## ⚙️ CONFIGURATION CONSTANTS

### **Size Presets**
```javascript
const SIZE_OPTIONS = [
  "512x512",      // Square standard
  "768x512",      // Landscape  
  "512x768",      // Portrait
  "1024x1024"     // Large square
];
```

### **Style Presets** 
```javascript
const STYLE_OPTIONS = [
  "realistic",    // Photographic
  "artistic",     // Artistic
  "digital",      // Digital art
  "anime",        // Anime style
  "abstract",     // Abstract
  "cinematic",    // Cinematic
  "fantasy",      // Fantasy
  "cyberpunk"     // Cyberpunk
];
```

### **Generation Steps**
```javascript
const STEPS_OPTIONS = [15, 25, 35, 50];
```

---

## 🔄 REQUEST/RESPONSE FLOW

### **Standard Generation Request**
```typescript
// Request Format
{
  prompt: string,
  model: string,
  type: "image" | "video" | "3d" | "photo2photo",
  style?: string,
  size?: string, 
  steps?: number,
  auto_translate?: boolean,
  nsfw_blur?: boolean,
  source_image?: string
}

// Response Format  
{
  success: boolean,
  type: string,
  original_prompt: string,
  translated_prompt: string | null,
  enhanced_prompt: string,
  nsfw_detected: boolean,
  nsfw_blur_applied: boolean,
  translation_used: boolean,
  model_used: string,
  timestamp: string,
  image?: string,        // Base64 or blob
  error?: string
}
```

---

## 🛡️ ERROR HANDLING MATRIX

### **Frontend Error Handling**
```javascript
// Network Errors
fetch('/api/enhanced-generator').catch(err => {
  console.error("Generation error:", err);
  errorBox.textContent = err.message;
});

// Validation Errors  
if (!prompt.trim()) {
  alert("Wprowadź tekst do generacji");
  return;
}

// API Response Errors
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
```

### **Backend Error Responses**
```typescript
// 400 - Bad Request
{ success: false, error: "Brak prompt do generowania" }

// 500 - Internal Server Error  
{ success: false, error: "AI service unavailable" }

// 429 - Rate Limited
{ success: false, error: "Zbyt wiele requestów" }
```

---

## 📱 MOBILE RESPONSIVENESS

### **CSS Breakpoints**
```css
/* Mobile First Design */
.grid-cols-1              /* Mobile: 1 column */
.md:grid-cols-3          /* Tablet: 3 columns */
.lg:grid-cols-6          /* Desktop: 6 columns */

/* Button Sizing */
.py-3.px-6               /* Standard padding */ 
.text-lg                 /* Large text for touch */
```

### **Touch Interactions**
```javascript
// Touch-friendly buttons
.transition-colors        /* Smooth hover states */
.hover:bg-blue-700       /* Touch feedback */
.disabled:opacity-50     /* Disabled states */
```

---

## 📊 PERFORMANCE METRICS

### **Current Limitations**
- **Max History**: 20 items (hardcoded)
- **LocalStorage**: No size limits (potential overflow)
- **Memory**: Blob URLs not cleaned up
- **Network**: No request timeout/retry
- **UI**: No lazy loading for large histories

### **Optimization Opportunities**
1. Implement request debouncing
2. Add image compression before storage
3. Lazy load history items
4. Clean up blob URLs after use  
5. Add progress indicators for long generations
6. Implement request caching
7. Add batch delete for history

---

*Kompletna dokumentacja techniczna przygotowana dla napraw Gemini CLI*