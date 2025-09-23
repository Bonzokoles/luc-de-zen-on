// Szybki test - skopiuj i wklej do console przeglądarki na https://luc-de-zen-on.pages.dev

console.clear();
console.log('🧪 QUICK FLOATING BUTTONS TEST');
console.log('===============================');

// Test przycisków
const buttons = ['geminiProBtn', 'codeBisonBtn', 'textBisonBtn', 'googleBardBtn'];
console.log('\n🔍 PRZYCISKI:');
buttons.forEach(id => {
    const btn = document.getElementById(id);
    console.log(`${id}: ${btn ? '✅ JEST' : '❌ BRAK'}`);
    if (btn) console.log(`   Text: "${btn.textContent.trim()}" | Visible: ${btn.offsetParent !== null}`);
});

// Test funkcji
const functions = ['toggleGeminiPro', 'sendToGeminiPro', 'toggleCodeBison', 'sendToCodeBison'];
console.log('\n🔧 FUNKCJE:');
functions.forEach(func => {
    console.log(`${func}: ${typeof window[func] === 'function' ? '✅ OK' : '❌ BRAK'}`);
});

// Test kliknięcia Gemini Pro
console.log('\n🖱️ TEST KLIKNIĘCIA:');
const geminiBtn = document.getElementById('geminiProBtn');
if (geminiBtn) {
    console.log('Klikam Gemini Pro...');
    geminiBtn.click();
    
    setTimeout(() => {
        const widget = document.getElementById('geminiProWidget');
        if (widget) {
            const visible = !widget.classList.contains('hidden');
            console.log(`Widget: ${visible ? '✅ WIDOCZNY' : '❌ UKRYTY'}`);
        } else {
            console.log('Widget: ❌ BRAK ELEMENTU');
        }
    }, 1000);
} else {
    console.log('❌ Gemini Pro button nie istnieje');
}

// Test bezpośredniego API call
console.log('\n📡 TEST API:');
fetch('/api/gemini-pro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Test konsoli', language: 'pl' })
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.log('API Error:', e));

console.log('\n📋 SPRAWDŹ WYNIKI I KLIKNIJ RĘCZNIE PRZYCISKI PO PRAWEJ STRONIE!');