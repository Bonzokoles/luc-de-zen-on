// ULTIMATE COMPREHENSIVE LIVE TEST - Przyciski 2-5 floating buttons
// Wklej ten kod w konsoli przeglądarki na https://luc-de-zen-on.pages.dev

console.log("🔍 ULTIMATE TEST PRZYCISKÓW 2-5 NA ŻYWEJ STRONIE");
console.log("⏰", new Date().toLocaleString());
console.log("🌐 URL:", window.location.href);

function ultimateButtonTest() {
  const buttonsToTest = [
    { id: "geminiProBtn", name: "Gemini Pro", widgetId: "geminiProWidget", toggle: "toggleGeminiPro" },
    { id: "codeBisonBtn", name: "Code Bison", widgetId: "codeBisonWidget", toggle: "toggleCodeBison" },
    { id: "textBisonBtn", name: "Text Bison", widgetId: "textBisonWidget", toggle: "toggleTextBison" },
    { id: "googleBardBtn", name: "Google Bard", widgetId: "googleBardWidget", toggle: "toggleGoogleBard" }
  ];

  console.log("📋 TESTOWANE PRZYCISKI:", buttonsToTest.map(b => b.name).join(", "));

  buttonsToTest.forEach((button, index) => {
    console.log(`\n${"=".repeat(20)} TEST ${index + 2}: ${button.name} ${"=".repeat(20)}`);
    
    // KROK 1: Sprawdź istnienie w DOM
    const btn = document.getElementById(button.id);
    const widget = document.getElementById(button.widgetId);
    
    console.log(`🔹 ELEMENT DOM:`);
    console.log(`   Przycisk ${button.id}:`, btn ? "✅ ISTNIEJE" : "❌ BRAK");
    console.log(`   Widget ${button.widgetId}:`, widget ? "✅ ISTNIEJE" : "❌ BRAK");
    
    if (!btn) {
      console.log(`   ❌ PRZYCISK NIE ISTNIEJE - KONIEC TESTU DLA ${button.name}`);
      return;
    }
    
    // KROK 2: Analiza HTML
    console.log(`\n🔹 ANALIZA HTML:`);
    console.log(`   Onclick handler:`, btn.getAttribute("onclick") || "❌ BRAK");
    console.log(`   Classes:`, btn.className || "❌ BRAK");
    console.log(`   ID:`, btn.id);
    console.log(`   Title:`, btn.title || "BRAK");
    console.log(`   Disabled:`, btn.disabled ? "❌ TAK" : "✅ NIE");
    
    // KROK 3: Analiza CSS
    console.log(`\n🔹 ANALIZA CSS:`);
    const style = window.getComputedStyle(btn);
    const rect = btn.getBoundingClientRect();
    
    console.log(`   Display:`, style.display);
    console.log(`   Visibility:`, style.visibility);
    console.log(`   Opacity:`, style.opacity);
    console.log(`   Z-index:`, style.zIndex);
    console.log(`   Position:`, style.position);
    console.log(`   Pointer-events:`, style.pointerEvents);
    console.log(`   Pozycja: x=${Math.round(rect.x)}, y=${Math.round(rect.y)}`);
    console.log(`   Rozmiar: w=${Math.round(rect.width)}, h=${Math.round(rect.height)}`);
    
    // KROK 4: Test widoczności
    const isVisible = rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    console.log(`   Widoczny:`, isVisible ? "✅ TAK" : "❌ NIE");
    
    // KROK 5: Test funkcji JavaScript
    console.log(`\n🔹 TEST FUNKCJI JS:`);
    const toggleFunc = window[button.toggle];
    console.log(`   Funkcja ${button.toggle}:`, typeof toggleFunc === 'function' ? "✅ ISTNIEJE" : "❌ BRAK");
    
    if (typeof toggleFunc === 'function') {
      console.log(`   🚀 BEZPOŚREDNIE WYWOŁANIE FUNKCJI:`);
      
      if (widget) {
        try {
          // Stan przed
          const hiddenBefore = widget.classList.contains("hidden");
          console.log(`   Widget przed: ${hiddenBefore ? "UKRYTY" : "WIDOCZNY"}`);
          
          // Wywołaj funkcję
          console.log(`   Wywołuję ${button.toggle}(true)...`);
          toggleFunc(true);
          
          // Stan po
          setTimeout(() => {
            const hiddenAfter = widget.classList.contains("hidden");
            console.log(`   Widget po: ${hiddenAfter ? "UKRYTY" : "WIDOCZNY"}`);
            
            const changed = hiddenBefore !== hiddenAfter;
            console.log(`   Funkcja działa: ${changed ? "✅ TAK" : "❌ NIE"}`);
            
            // Przywróć stan
            if (changed && !hiddenBefore) {
              console.log(`   Przywracam poprzedni stan...`);
              toggleFunc(true);
            }
          }, 150);
          
        } catch (error) {
          console.log(`   ❌ BŁĄD funkcji:`, error.message);
        }
      } else {
        console.log(`   ⚠️ Brak widget - nie mogę przetestować funkcji`);
      }
    }
    
    // KROK 6: Test event listeners
    console.log(`\n🔹 TEST EVENT LISTENERS:`);
    
    // Sprawdź czy są jakieś event listeners
    const listeners = getEventListeners ? getEventListeners(btn) : "Funkcja getEventListeners niedostępna";
    console.log(`   Event listeners:`, listeners);
    
    // KROK 7: Test kliknięcia
    if (isVisible) {
      console.log(`\n🔹 TEST KLIKNIĘCIA:`);
      
      setTimeout(() => {
        try {
          if (widget) {
            const hiddenBefore = widget.classList.contains("hidden");
            console.log(`   Widget przed kliknięciem: ${hiddenBefore ? "UKRYTY" : "WIDOCZNY"}`);
            
            // Test .click()
            console.log(`   Wywołuję btn.click()...`);
            btn.click();
            
            setTimeout(() => {
              const hiddenAfter = widget.classList.contains("hidden");
              console.log(`   Widget po kliknięciu: ${hiddenAfter ? "UKRYTY" : "WIDOCZNY"}`);
              
              const clickWorked = hiddenBefore !== hiddenAfter;
              console.log(`   Kliknięcie działa: ${clickWorked ? "✅ TAK" : "❌ NIE"}`);
              
              // Jeśli nie działa, próbuj MouseEvent
              if (!clickWorked) {
                console.log(`   Próbuję MouseEvent...`);
                
                const event = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window
                });
                
                btn.dispatchEvent(event);
                
                setTimeout(() => {
                  const hiddenAfterEvent = widget.classList.contains("hidden");
                  const eventWorked = hiddenAfter !== hiddenAfterEvent;
                  console.log(`   MouseEvent działa: ${eventWorked ? "✅ TAK" : "❌ NIE"}`);
                }, 100);
              }
            }, 200);
            
          } else {
            console.log(`   ⚠️ Brak widget - nie mogę przetestować kliknięcia`);
          }
        } catch (error) {
          console.log(`   ❌ BŁĄD kliknięcia:`, error.message);
        }
      }, 500);
    } else {
      console.log(`\n🔹 KLIKNIĘCIE: ⚠️ PRZYCISK NIEWIDOCZNY - pomijam test`);
    }
  });
  
  // PODSUMOWANIE
  setTimeout(() => {
    console.log(`\n${"=".repeat(60)}`);
    console.log("🏁 PODSUMOWANIE ULTIMATE TEST");
    console.log(`${"=".repeat(60)}`);
    
    // Porównanie z działającym przyciskiem
    console.log("\n🔄 PORÓWNANIE Z DZIAŁAJĄCYM PRZYCISKIEM:");
    const workingBtn = document.getElementById("polaczekBtn");
    if (workingBtn) {
      console.log("✅ POLACZEK (działający przykład):");
      console.log("   Onclick:", workingBtn.getAttribute("onclick"));
      console.log("   Classes:", workingBtn.className);
      const workingStyle = window.getComputedStyle(workingBtn);
      console.log("   Display:", workingStyle.display);
      console.log("   Visibility:", workingStyle.visibility);
    }
    
    // Szybkie podsumowanie
    console.log("\n📊 SZYBKIE WYNIKI:");
    buttonsToTest.forEach((button, i) => {
      const btn = document.getElementById(button.id);
      const exists = !!btn;
      const visible = btn ? btn.getBoundingClientRect().width > 0 : false;
      const hasOnclick = btn ? !!btn.getAttribute("onclick") : false;
      const hasFunction = typeof window[button.toggle] === 'function';
      
      console.log(`${i + 2}. ${button.name}:`);
      console.log(`   DOM: ${exists ? "✅" : "❌"} | Widoczny: ${visible ? "✅" : "❌"} | Onclick: ${hasOnclick ? "✅" : "❌"} | Funkcja: ${hasFunction ? "✅" : "❌"}`);
    });
    
    console.log("\n💡 NASTĘPNE KROKI:");
    console.log("1. Sprawdź console.log powyżej dla szczegółów każdego przycisku");
    console.log("2. Porównaj różnice z działającym przyciskiem POLACZEK");
    console.log("3. Jeśli funkcje istnieją ale nie działają - problem z event handlerami");
    console.log("4. Jeśli przyciski niewidoczne - problem z CSS");
    
  }, 3000);
}

// Funkcja pomocnicza - szybki test
function quickCheck() {
  console.log("⚡ QUICK CHECK:");
  const buttons = ["geminiProBtn", "codeBisonBtn", "textBisonBtn", "googleBardBtn"];
  buttons.forEach((id, i) => {
    const btn = document.getElementById(id);
    console.log(`${i+2}. ${id}: ${btn ? "✅ EXISTS" : "❌ MISSING"}`);
  });
}

// URUCHOM TEST
console.log("🎬 Uruchamiam Ultimate Test...");
ultimateButtonTest();

// Dodatkowe funkcje pomocnicze dostępne w konsoli
console.log("\n🛠️ DOSTĘPNE FUNKCJE:");
console.log("- ultimateButtonTest() - pełny test diagnostyczny");
console.log("- quickCheck() - szybkie sprawdzenie istnienia przycisków");

// Auto quick check
setTimeout(() => {
  console.log("\n" + "=".repeat(30));
  quickCheck();
}, 4000);