# 🚨 GENERATOR OBRAZÓW - MAPA PROBLEMÓW I NAPRAW

## 🔍 ZIDENTYFIKOWANE PROBLEMY

### **🚩 KRYTYCZNE PROBLEMY**

#### 1. **Event Handler Conflicts**
```
LOKALIZACJA: src/pages/image-generator.astro:273
PROBLEM: Potencjalny konflikt między inline onclick a addEventListener
SYMPTOM: Przyciski mogą nie działać lub działać nieprzewidywalnie
PRIORYTET: WYSOKI
```

#### 2. **Memory Leaks - Blob URLs**  
```
LOKALIZACJA: src/pages/image-generator.astro:838-847
PROBLEM: URL.createObjectURL() bez odpowiadającego URL.revokeObjectURL()
SYMPTOM: Narastająca konsumpcja pamięci przy wielokrotnym użyciu
PRIORYTET: WYSOKI
```

#### 3. **LocalStorage Overflow**
```
LOKALIZACJA: src/pages/image-generator.astro:967, 1523
PROBLEM: Brak limitów rozmiaru dla Base64 images w localStorage  
SYMPTOM: Błędy "QuotaExceededError" przy dużych ilościach obrazów
PRIORYTET: ŚREDNI
```

### **⚠️ FUNKCJONALNE PROBLEMY**

#### 4. **Race Conditions**
```
LOKALIZACJA: src/pages/image-generator.astro:849-1010
PROBLEM: Brak debouncing dla szybkich kliknięć przycisków
SYMPTOM: Wielokrotne równoczesne requesty API
PRIORYTET: ŚREDNI
```

#### 5. **Error Handling Gaps**
```
LOKALIZACJA: Multiple API endpoints
PROBLEM: Niepełna obsługa błędów sieciowych i timeout
SYMPTOM: Zawieszone requesty bez informacji zwrotnej
PRIORYTET: ŚREDNI
```

#### 6. **NSFW Detection Inconsistency**
```
LOKALIZACJA: src/pages/api/enhanced-generator.ts:140-155
PROBLEM: Niespójne działanie detekcji NSFW między modelami
SYMPTOM: Niektóre nieodpowiednie treści przechodą przez filtr
PRIORYTET: ŚREDNI
```

### **🎨 UI/UX PROBLEMY**

#### 7. **Mobile Responsiveness**
```
LOKALIZACJA: src/pages/image-generator.astro (CSS)
PROBLEM: UI elements za małe na urządzeniach dotykowych
SYMPTOM: Trudności z obsługą na telefonach
PRIORYTET: NISKI
```

#### 8. **Loading States Incomplete**
```
LOKALIZACJA: src/pages/image-generator.astro:849-1010
PROBLEM: Brak progress indicators dla długich generacji
SYMPTOM: Użytkownicy nie wiedzą czy proces trwa
PRIORYTET: NISKI
```

---

## 🔧 PLAN NAPRAW DLA GEMINI CLI

### **FAZA 1: KRYTYCZNE NAPRAWY**

#### **Fix 1: Event Handler Cleanup**
```typescript
// PRZED (problematyczne):
<button onclick="someFunction()">

// PO (poprawne):
// W JavaScript:
document.getElementById('btn').addEventListener('click', someFunction);
```

#### **Fix 2: Memory Management**
```javascript
// DODAĆ: Cleanup system dla blob URLs
function cleanupBlobUrl(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

// ZASTOSOWAĆ: Po użyciu każdego blob URL
cleanupBlobUrl(previousImageUrl);
```

#### **Fix 3: Storage Limits**
```javascript
// DODAĆ: Size checking przed zapisem
function saveToHistory(item) {
  const historySize = JSON.stringify(generationHistory).length;
  const maxSize = 5 * 1024 * 1024; // 5MB limit
  
  if (historySize > maxSize) {
    // Remove oldest items
    generationHistory = generationHistory.slice(-10);
  }
  
  generationHistory.unshift(item);
  localStorage.setItem("imageHistory", JSON.stringify(generationHistory));
}
```

### **FAZA 2: FUNKCJONALNE ULEPSZENIA**

#### **Fix 4: Request Debouncing**
```javascript
// DODAĆ: Debouncing dla przycisków
let isGenerating = false;
const DEBOUNCE_DELAY = 1000; // 1 sekunda

async function debouncedGenerate() {
  if (isGenerating) return;
  
  isGenerating = true;
  try {
    await generateImage();
  } finally {
    setTimeout(() => { isGenerating = false; }, DEBOUNCE_DELAY);
  }
}
```

#### **Fix 5: Enhanced Error Handling**
```typescript
// DODAĆ: Comprehensive error handling
async function handleAPIRequest(endpoint, data) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - spróbuj ponownie');
    }
    
    throw error;
  }
}
```

#### **Fix 6: NSFW Detection Standardization**
```typescript
// USTANDARYZOWAĆ: NSFW detection across all models
async function standardNSFWCheck(prompt, imageData) {
  const nsfwKeywords = ['explicit', 'nude', 'nsfw', 'adult'];
  const promptCheck = nsfwKeywords.some(word => 
    prompt.toLowerCase().includes(word)
  );
  
  // TODO: Add image content analysis
  // const imageCheck = await analyzeImageContent(imageData);
  
  return promptCheck; // || imageCheck;
}
```

### **FAZA 3: UI/UX ENHANCEMENTS**

#### **Fix 7: Mobile Optimization** 
```css
/* DODAĆ: Better mobile styles */
@media (max-width: 768px) {
  .preset-btn {
    min-height: 44px;  /* Touch target minimum */
    font-size: 14px;
    padding: 8px 12px;
  }
  
  #imagePrompt {
    min-height: 120px;  /* Larger text area */
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
}
```

#### **Fix 8: Progress Indicators**
```javascript
// DODAĆ: Progress tracking
function showProgress(message, percentage = 0) {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = message;
  
  document.getElementById('progressContainer').classList.remove('hidden');
}

// UŻYCIE:
showProgress('Tłumaczenie promptu...', 20);
showProgress('Generowanie obrazu...', 60);
showProgress('Zapisywanie rezultatu...', 90);
```

---

## 📋 TESTING CHECKLIST

### **Pre-Deploy Tests**
- [ ] **Event Handlers**: Wszystkie przyciski działają bez konfliktów
- [ ] **Memory**: Brak memory leaks przy wielokrotnym użyciu  
- [ ] **Storage**: Proper handling of localStorage limits
- [ ] **API**: Error handling dla wszystkich endpoints
- [ ] **Mobile**: UI działa na iOS/Android
- [ ] **Cross-browser**: Testy na Chrome/Firefox/Safari
- [ ] **Performance**: Czas ładowania < 3s
- [ ] **Accessibility**: Screen reader compatibility

### **Regression Tests**
- [ ] **Basic Generation**: Standardowa generacja obrazów
- [ ] **Translation**: POLACZEK_T tłumaczenia PL→EN
- [ ] **Enhancement**: AI prompt improvement  
- [ ] **History**: Save/load/export history
- [ ] **Presets**: Quick preset loading
- [ ] **Batch**: Multiple image generation
- [ ] **External Models**: Together AI, HuggingFace, etc.
- [ ] **NSFW Filter**: Appropriate content filtering

---

## 🚀 DEPLOYMENT STRATEGY

### **Etapowe Wdrażanie**
1. **FAZA 1**: Krytyczne naprawy → Immediate deploy
2. **FAZA 2**: Funkcjonalne ulepszenia → Staged rollout
3. **FAZA 3**: UI improvements → Feature flags

### **Rollback Plan**
```bash
# Przygotuj backup przed zmianami
git tag backup-before-generator-fixes
git push origin backup-before-generator-fixes

# W przypadku problemów:
git reset --hard backup-before-generator-fixes
git push --force-with-lease origin main
```

### **Monitoring Post-Deploy**
- [ ] Console errors tracking
- [ ] API response times
- [ ] localStorage usage metrics  
- [ ] User error reports
- [ ] Mobile performance metrics

---

*Kompletna mapa problemów przygotowana dla systematycznych napraw przez Gemini CLI*