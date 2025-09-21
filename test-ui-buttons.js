// Test interfejsu floating buttons na stronie
const testFloatingButtonsUI = async () => {
    console.log('🧪 TEST INTERFEJSU FLOATING BUTTONS');
    console.log('===================================');
    
    // Sprawdź czy buttons istnieją
    const buttons = [
        { id: 'geminiProBtn', name: 'Gemini Pro', expectedText: 'GEMINI PRO' },
        { id: 'codeBisonBtn', name: 'Code Bison', expectedText: 'CODE BISON' },
        { id: 'textBisonBtn', name: 'Text Bison', expectedText: 'TEXT BISON' },
        { id: 'googleBardBtn', name: 'Google Bard', expectedText: 'GOOGLE BARD' },
    ];
    
    console.log('🔍 Sprawdzanie obecności przycisków:');
    buttons.forEach(btn => {
        const element = document.getElementById(btn.id);
        if (element) {
            console.log(`✅ ${btn.name}: Znaleziony`);
            console.log(`   Text: "${element.textContent.trim()}"`);
            console.log(`   Onclick: ${element.onclick ? 'Przypisany' : 'BRAK!'}`);
            console.log(`   Visible: ${element.offsetParent !== null ? 'TAK' : 'NIE'}`);
        } else {
            console.log(`❌ ${btn.name}: BRAK ELEMENTU!`);
        }
    });
    
    // Test toggle functions
    console.log('\n🔧 Test funkcji toggle:');
    const toggleFunctions = ['toggleGeminiPro', 'toggleCodeBison', 'toggleTextBison', 'toggleGoogleBard'];
    
    toggleFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName}: Funkcja istnieje`);
        } else {
            console.log(`❌ ${funcName}: BRAK FUNKCJI!`);
        }
    });
    
    // Test send functions  
    console.log('\n📡 Test funkcji send:');
    const sendFunctions = ['sendToGeminiPro', 'sendToCodeBison', 'sendToTextBison', 'sendToGoogleBard'];
    
    sendFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName}: Funkcja istnieje`);
        } else {
            console.log(`❌ ${funcName}: BRAK FUNKCJI!`);
        }
    });
    
    // Test widgetów
    console.log('\n🖥️  Test floating widgets:');
    const widgets = ['geminiProWidget', 'codeBisonWidget', 'textBisonWidget', 'googleBardWidget'];
    
    widgets.forEach(widgetId => {
        const widget = document.getElementById(widgetId);
        if (widget) {
            console.log(`✅ ${widgetId}: Widget istnieje`);
            console.log(`   Classes: ${widget.className}`);
            console.log(`   Hidden: ${widget.classList.contains('hidden') ? 'TAK' : 'NIE'}`);
        } else {
            console.log(`❌ ${widgetId}: BRAK WIDGET!`);
        }
    });
    
    console.log('\n🎯 REKOMENDACJE:');
    console.log('1. Kliknij przycisk aby otworzyć floating widget');
    console.log('2. Wpisz wiadomość w textarea');  
    console.log('3. Kliknij "Wyślij" aby przetestować API');
    console.log('4. Sprawdź odpowiedź w response area');
};

// Uruchom test po załadowaniu strony
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testFloatingButtonsUI);
} else {
    testFloatingButtonsUI();
}

console.log('🚀 Test floating buttons UI załadowany - sprawdź konsolę na stronie!');