// AUDIO CONTEXT FIX - rozwiązanie błędu AudioContext
// Wklej ten kod w konsoli przeglądarki na https://luc-de-zen-on.pages.dev

console.log("🎵 NAPRAWIAM BŁĄD AUDIOCONTEXT...");

// 1. Zatrzymaj wszystkie istniejące AudioContext
if (window.GLOBAL_AUDIO_CONTEXT) {
  try {
    window.GLOBAL_AUDIO_CONTEXT.close();
    console.log("✅ Zamknięto stary AudioContext");
  } catch (e) {
    console.warn("⚠️ Nie można zamknąć AudioContext:", e.message);
  }
}

// 2. Wyczyść globalne zmienne audio
window.GLOBAL_AUDIO_CONTEXT = null;
window.MUSIC_ANALYSER = null;

// 3. Stwórz nowy, bezpieczny AudioContext manager
window.SAFE_AUDIO_MANAGER = {
  context: null,
  initialized: false,
  
  init() {
    if (this.initialized) return this.context;
    
    try {
      if (typeof AudioContext !== 'undefined') {
        this.context = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        this.context = new webkitAudioContext();
      } else {
        console.warn("🚫 AudioContext nie jest obsługiwany");
        return null;
      }
      
      console.log("✅ Bezpieczny AudioContext utworzony");
      this.initialized = true;
      
      // Auto-resume jeśli suspended
      if (this.context.state === 'suspended') {
        this.resume();
      }
      
      return this.context;
    } catch (e) {
      console.error("❌ Błąd tworzenia AudioContext:", e.message);
      return null;
    }
  },
  
  resume() {
    if (this.context && this.context.state === 'suspended') {
      return this.context.resume().then(() => {
        console.log("🎵 AudioContext wznowiony");
      }).catch(e => {
        console.error("❌ Nie można wznowić AudioContext:", e.message);
      });
    }
  },
  
  close() {
    if (this.context && this.context.state !== 'closed') {
      return this.context.close().then(() => {
        console.log("🔇 AudioContext zamknięty");
        this.context = null;
        this.initialized = false;
      }).catch(e => {
        console.error("❌ Błąd zamykania AudioContext:", e.message);
      });
    }
  }
};

// 4. Inicjalizuj bezpieczny AudioContext
const safeContext = window.SAFE_AUDIO_MANAGER.init();

if (safeContext) {
  console.log("🎵 AudioContext naprawiony!");
  console.log("   Stan:", safeContext.state);
  console.log("   Sample rate:", safeContext.sampleRate);
  
  // 5. Test przycisków po naprawie audio
  setTimeout(() => {
    console.log("\n🔄 TESTUJĘ PRZYCISKI PO NAPRAWIE AUDIO...");
    
    const buttons = [
      { id: "geminiProBtn", name: "Gemini Pro" },
      { id: "codeBisonBtn", name: "Code Bison" },
      { id: "textBisonBtn", name: "Text Bison" },
      { id: "googleBardBtn", name: "Google Bard" }
    ];
    
    buttons.forEach((button, i) => {
      const btn = document.getElementById(button.id);
      if (btn) {
        console.log(`${i+2}. ${button.name}: ✅ ISTNIEJE`);
        
        // Test kliknięcia
        try {
          const rect = btn.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          console.log(`   Widoczny: ${isVisible ? "✅" : "❌"}`);
          
          if (isVisible) {
            console.log(`   🖱️ TESTUJĘ KLIKNIĘCIE...`);
            btn.click();
            console.log(`   ✅ Kliknięcie wykonane`);
          }
        } catch (e) {
          console.log(`   ❌ Błąd kliknięcia:`, e.message);
        }
      } else {
        console.log(`${i+2}. ${button.name}: ❌ BRAK`);
      }
    });
    
  }, 1000);
  
} else {
  console.error("❌ Nie można naprawić AudioContext");
}

// 6. Dodaj event listener dla bezpiecznego resume
document.addEventListener('click', () => {
  if (window.SAFE_AUDIO_MANAGER) {
    window.SAFE_AUDIO_MANAGER.resume();
  }
}, { once: true });

console.log("\n💡 DOSTĘPNE FUNKCJE:");
console.log("- window.SAFE_AUDIO_MANAGER.init() - inicjalizuj audio");
console.log("- window.SAFE_AUDIO_MANAGER.resume() - wznów audio");
console.log("- window.SAFE_AUDIO_MANAGER.close() - zamknij audio");

console.log("\n🎯 AudioContext naprawiony! Spróbuj teraz kliknąć przyciski 2-5.");