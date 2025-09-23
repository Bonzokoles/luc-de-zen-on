// Manual inspection - sprawdź strukturę floating buttons
// Uruchom w console na https://luc-de-zen-on.pages.dev

console.log('🔍 MANUAL INSPECTION FLOATING BUTTONS');
console.log('=====================================');

// 1. Znajdź wszystkie .right-btn
console.log('\n📋 WSZYSTKIE .right-btn:');
const rightBtns = document.querySelectorAll('.right-btn');
console.log(`Znaleziono ${rightBtns.length} przycisków .right-btn`);

rightBtns.forEach((btn, index) => {
    console.log(`${index + 1}. ID: "${btn.id}" | Text: "${btn.textContent.trim()}" | Onclick: ${btn.onclick ? 'TAK' : 'BRAK'}`);
});

// 2. Sprawdź floating-widget-container
console.log('\n📦 FLOATING WIDGET CONTAINERS:');
const containers = document.querySelectorAll('.floating-widget-container');
console.log(`Znaleziono ${containers.length} kontenerów`);

containers.forEach((container, index) => {
    const button = container.querySelector('.right-btn');
    const widget = container.querySelector('.floating-widget');
    console.log(`${index + 1}. Button: ${button ? button.id : 'BRAK'} | Widget: ${widget ? widget.id : 'BRAK'}`);
});

// 3. Test ręcznego kliknięcia
console.log('\n🖱️ RĘCZNE TESTY KLIKNIĘĆ:');
const testButtons = ['geminiProBtn', 'codeBisonBtn', 'textBisonBtn', 'googleBardBtn'];

testButtons.forEach((btnId, index) => {
    const btn = document.getElementById(btnId);
    if (btn) {
        console.log(`${index + 1}. ${btnId}: Dostępny do kliknięcia`);
        
        // Dodaj temporary event listener
        const originalOnclick = btn.onclick;
        btn.addEventListener('click', function tempListener(e) {
            console.log(`🔔 ${btnId} KLIKNIĘTY!`);
            btn.removeEventListener('click', tempListener);
        });
    } else {
        console.log(`${index + 1}. ${btnId}: ❌ NIEDOSTĘPNY`);
    }
});

// 4. Sprawdź CSS visibility
console.log('\n👁️ CSS VISIBILITY CHECK:');
testButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        const styles = window.getComputedStyle(btn);
        console.log(`${btnId}:`);
        console.log(`   Display: ${styles.display}`);
        console.log(`   Visibility: ${styles.visibility}`);
        console.log(`   Opacity: ${styles.opacity}`);
        console.log(`   Position: ${styles.position}`);
    }
});

console.log('\n🎯 KOLEJNE KROKI:');
console.log('1. Kliknij ręcznie przyciski po prawej stronie ekranu');
console.log('2. Sprawdź czy floating widgets się otwierają');
console.log('3. Jeśli tak, przetestuj wpisanie tekstu i kliknięcie "Wyślij"');
console.log('4. Raportuj wyniki w console!');