// KOMPLETNY TEST PRZYCISKÓW PO NAPRAWIE AUDIOCONTEXT
// Wklej ten kod w konsoli przeglądarki na https://luc-de-zen-on.pages.dev

console.log("🔍 KOMPLETNY TEST PO NAPRAWIE AUDIOCONTEXT");
console.log("⏰", new Date().toLocaleString());
console.log("🌐 URL:", window.location.href);
console.log("=====================================\n");

// KROK 1: Sprawdź czy AudioContext błąd zniknął
function checkAudioContext() {
  console.log("🎵 SPRAWDZAM AUDIOCONTEXT:");
  
  try {
    // Sprawdź globalny manager
    if (window.GLOBAL_AUDIO_CONTEXT) {
      console.log("✅ GLOBAL_AUDIO_CONTEXT istnieje");
      console.log("   Stan:", window.GLOBAL_AUDIO_CONTEXT.state);
    } else {
      console.log("⚠️ GLOBAL_AUDIO_CONTEXT nie istnieje");
    }
    
    // Sprawdź czy można utworzyć nowy context
    const testContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log("✅ Można utworzyć AudioContext");
    console.log("   Stan:", testContext.state);
    testContext.close();
    
  } catch (e) {
    console.log("❌ BŁĄD AudioContext:", e.message);
    return false;
  }
  
  return true;
}

// KROK 2: Test przycisków floating
function testFloatingButtons() {
  console.log("\n🔹 TESTOWANIE PRZYCISKÓW FLOATING:");
  
  const buttons = [
    { id: "geminiProBtn", name: "Gemini Pro", widgetId: "geminiProWidget", toggle: "toggleGeminiPro" },
    { id: "codeBisonBtn", name: "Code Bison", widgetId: "codeBisonWidget", toggle: "toggleCodeBison" },
    { id: "textBisonBtn", name: "Text Bison", widgetId: "textBisonWidget", toggle: "toggleTextBison" },
    { id: "googleBardBtn", name: "Google Bard", widgetId: "googleBardWidget", toggle: "toggleGoogleBard" }
  ];
  
  let workingButtons = 0;
  let totalButtons = buttons.length;
  
  buttons.forEach((button, index) => {
    console.log(`\n--- PRZYCISK ${index + 2}: ${button.name} ---`);
    
    // Sprawdź elementy DOM
    const btn = document.getElementById(button.id);
    const widget = document.getElementById(button.widgetId);
    const toggleFunc = window[button.toggle];
    
    console.log(`DOM Element: ${btn ? "✅" : "❌"}`);
    console.log(`Widget: ${widget ? "✅" : "❌"}`);
    console.log(`Funkcja: ${typeof toggleFunc === 'function' ? "✅" : "❌"}`);
    
    if (!btn) {
      console.log(`❌ PRZYCISK NIEZNALEZIONY`);
      return;
    }
    
    // Sprawdź widoczność
    const rect = btn.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    console.log(`Widoczność: ${isVisible ? "✅" : "❌"}`);
    
    // Sprawdź onclick
    const onclickAttr = btn.getAttribute("onclick");
    console.log(`Onclick: ${onclickAttr ? "✅" : "❌"} ${onclickAttr || ""}`);
    
    // Test funkcji toggle (jeśli istnieje)
    if (typeof toggleFunc === 'function' && widget) {
      console.log(`🚀 TESTUJE FUNKCJĘ ${button.toggle}:`);
      
      try {
        const hiddenBefore = widget.classList.contains("hidden");
        console.log(`   Widget przed: ${hiddenBefore ? "UKRYTY" : "WIDOCZNY"}`);
        
        // Wywołaj funkcję
        toggleFunc(true);
        
        setTimeout(() => {
          const hiddenAfter = widget.classList.contains("hidden");
          console.log(`   Widget po: ${hiddenAfter ? "UKRYTY" : "WIDOCZNY"}`);
          
          const functionWorks = hiddenBefore !== hiddenAfter;
          console.log(`   Funkcja działa: ${functionWorks ? "✅" : "❌"}`);
          
          if (functionWorks) {
            workingButtons++;
            // Przywróć stan
            if (!hiddenBefore) {
              toggleFunc(true);
            }
          }
        }, 100);
        
      } catch (e) {
        console.log(`   ❌ BŁĄD funkcji:`, e.message);
      }
    }
    
    // Test kliknięcia (jeśli widoczny)
    if (isVisible) {
      console.log(`🖱️ TESTUJE KLIKNIĘCIE:`);
      
      setTimeout(() => {
        try {
          if (widget) {
            const hiddenBefore = widget.classList.contains("hidden");
            
            // Kliknij przycisk
            btn.click();
            
            setTimeout(() => {
              const hiddenAfter = widget.classList.contains("hidden");
              const clickWorks = hiddenBefore !== hiddenAfter;
              console.log(`   Kliknięcie działa: ${clickWorks ? "✅" : "❌"}`);
              
              // Przywróć stan
              if (clickWorks && !hiddenBefore) {
                btn.click();
              }
            }, 100);
            
          } else {
            btn.click(); // Test samego kliknięcia
            console.log(`   ✅ Kliknięcie wykonane (brak widget do testu)`);
          }
        } catch (e) {
          console.log(`   ❌ BŁĄD kliknięcia:`, e.message);
        }
      }, 200 + (index * 100));
    } else {
      console.log(`⚠️ PRZYCISK NIEWIDOCZNY - pomijam test kliknięcia`);
    }
  });
  
  // Podsumowanie po testach
  setTimeout(() => {
    console.log(`\n📊 PODSUMOWANIE TESTÓW:`);
    console.log(`   Działające przyciski: ${workingButtons}/${totalButtons}`);
    console.log(`   Procent sukcesu: ${Math.round((workingButtons/totalButtons) * 100)}%`);
    
    if (workingButtons === totalButtons) {
      console.log(`🎉 WSZYSTKIE PRZYCISKI DZIAŁAJĄ!`);
    } else if (workingButtons > 0) {
      console.log(`⚠️ CZĘŚCIOWY SUKCES - niektóre przyciski działają`);
    } else {
      console.log(`❌ ŻADEN PRZYCISK NIE DZIAŁA`);
    }
  }, 2000);
}

// KROK 3: Porównanie z działającym przyciskiem
function compareWithWorkingButton() {
  console.log("\n🔄 PORÓWNANIE Z DZIAŁAJĄCYM PRZYCISKIEM:");
  
  const workingBtn = document.getElementById("polaczekBtn");
  if (workingBtn) {
    console.log("✅ POLACZEK (wzorzec działającego przycisku):");
    console.log("   ID:", workingBtn.id);
    console.log("   Onclick:", workingBtn.getAttribute("onclick"));
    console.log("   Classes:", workingBtn.className);
    console.log("   Disabled:", workingBtn.disabled);
    
    const rect = workingBtn.getBoundingClientRect();
    console.log("   Widoczny:", rect.width > 0 && rect.height > 0 ? "✅" : "❌");
    
    const style = window.getComputedStyle(workingBtn);
    console.log("   Display:", style.display);
    console.log("   Visibility:", style.visibility);
    console.log("   Pointer-events:", style.pointerEvents);
  } else {
    console.log("❌ POLACZEK przycisk nie znaleziony");
  }
}

// GŁÓWNA FUNKCJA TESTOWA
function runCompleteTest() {
  console.log("🎬 URUCHAMIAM KOMPLETNY TEST...");
  
  // Sprawdź AudioContext
  const audioOK = checkAudioContext();
  
  if (audioOK) {
    console.log("✅ AudioContext naprawiony - kontynuuję testy");
  } else {
    console.log("⚠️ Problem z AudioContext - ale testuję dalej");
  }
  
  // Test przycisków
  setTimeout(() => {
    testFloatingButtons();
  }, 500);
  
  // Porównanie
  setTimeout(() => {
    compareWithWorkingButton();
  }, 3000);
  
  // Finalne podsumowanie
  setTimeout(() => {
    console.log("\n" + "=".repeat(50));
    console.log("🏁 TEST ZAKOŃCZONY");
    console.log("=".repeat(50));
    console.log("💡 NASTĘPNE KROKI:");
    console.log("1. Sprawdź wyniki testów powyżej");
    console.log("2. Jeśli przyciski nadal nie działają - problem może być w CSS lub JS");
    console.log("3. Porównaj różnice z działającym przyciskiem POLACZEK");
    console.log("4. Użyj F12 > Elements aby sprawdzić DOM structure");
    
  }, 4000);
}

// Funkcje pomocnicze dostępne w konsoli
window.testFloatingButtons = testFloatingButtons;
window.checkAudioContext = checkAudioContext;
window.compareWithWorkingButton = compareWithWorkingButton;

console.log("💡 DOSTĘPNE FUNKCJE:");
console.log("- runCompleteTest() - pełny test");
console.log("- testFloatingButtons() - tylko test przycisków");
console.log("- checkAudioContext() - sprawdź audio");
console.log("- compareWithWorkingButton() - porównaj z POLACZEK");

// URUCHOM AUTOMATYCZNIE
runCompleteTest();