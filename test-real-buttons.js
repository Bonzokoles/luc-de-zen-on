// Bezpośredni test przycisków przez symulację kliknięć
const testRealButtons = async () => {
    console.log('🧪 TEST RZECZYWISTYCH PRZYCISKÓW');
    console.log('===============================');
    
    // Lista przycisków do przetestowania
    const buttonTests = [
        { id: 'geminiProBtn', widgetId: 'geminiProWidget', name: 'Gemini Pro' },
        { id: 'codeBisonBtn', widgetId: 'codeBisonWidget', name: 'Code Bison' },
        { id: 'textBisonBtn', widgetId: 'textBisonWidget', name: 'Text Bison' },
        { id: 'googleBardBtn', widgetId: 'googleBardWidget', name: 'Google Bard' }
    ];
    
    for (const test of buttonTests) {
        console.log(`\n🔘 TESTOWANIE: ${test.name}`);
        
        // 1. Sprawdź czy button istnieje
        const button = document.getElementById(test.id);
        if (!button) {
            console.log(`❌ Button ${test.id} nie istnieje`);
            continue;
        }
        console.log(`✅ Button znaleziony: ${button.textContent.trim()}`);
        
        // 2. Sprawdź widget przed kliknięciem
        const widget = document.getElementById(test.widgetId);
        if (!widget) {
            console.log(`❌ Widget ${test.widgetId} nie istnieje`);
            continue;
        }
        
        const wasHidden = widget.classList.contains('hidden');
        console.log(`📦 Widget przed kliknięciem: ${wasHidden ? 'UKRYTY' : 'WIDOCZNY'}`);
        
        // 3. Symuluj kliknięcie
        console.log(`🖱️  Symuluje kliknięcie...`);
        button.click();
        
        // 4. Sprawdź stan po kliknięciu (delay dla animacji)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const isHiddenAfter = widget.classList.contains('hidden');
        console.log(`📦 Widget po kliknięciu: ${isHiddenAfter ? 'UKRYTY' : 'WIDOCZNY'}`);
        
        if (wasHidden && !isHiddenAfter) {
            console.log(`✅ SUKCES - Widget się otworzył!`);
            
            // 5. Test API call jeśli widget jest otwarty
            console.log(`📡 Testuję API call...`);
            try {
                const apiEndpoint = `/api/${test.id.replace('Btn', '').toLowerCase().replace('gemini-pro', 'gemini-pro').replace('code-bison', 'code-bison').replace('text-bison', 'text-bison').replace('google-bard', 'google-bard')}`;
                
                // Znajdź input w widget
                const input = widget.querySelector('textarea');
                if (input) {
                    input.value = `Test ${test.name} - czy API działa?`;
                    
                    // Znajdź i kliknij przycisk wyślij
                    const sendButton = widget.querySelector('button[onclick*="sendTo"]');
                    if (sendButton) {
                        console.log(`📤 Klikam przycisk wyślij...`);
                        sendButton.click();
                        
                        // Sprawdź odpowiedź po 3 sekundach
                        setTimeout(() => {
                            const responseDiv = widget.querySelector('[id*="Response"]');
                            if (responseDiv && responseDiv.style.display !== 'none') {
                                console.log(`💬 Odpowiedź: ${responseDiv.textContent.substring(0, 100)}...`);
                            } else {
                                console.log(`⏳ Brak odpowiedzi lub jeszcze się ładuje...`);
                            }
                        }, 3000);
                    } else {
                        console.log(`❌ Przycisk wyślij nie znaleziony`);
                    }
                } else {
                    console.log(`❌ Textarea nie znaleziona w widget`);
                }
            } catch (error) {
                console.log(`❌ Błąd API call: ${error.message}`);
            }
            
            // 6. Zamknij widget
            setTimeout(() => {
                console.log(`🔒 Zamykam widget...`);
                button.click();
            }, 5000);
            
        } else if (!wasHidden && isHiddenAfter) {
            console.log(`✅ SUKCES - Widget się zamknął!`);
        } else {
            console.log(`❌ PROBLEM - Widget nie zareagował na kliknięcie`);
        }
        
        // Delay między testami
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎯 TEST ZAKOŃCZONY');
    console.log('==================');
    console.log('Sprawdź wyniki powyżej i obserwuj przyciski na stronie!');
};

// Export dla użycia w console
if (typeof window !== 'undefined') {
    window.testRealButtons = testRealButtons;
    console.log('🚀 Funkcja testRealButtons() gotowa - uruchom: testRealButtons()');
} else {
    testRealButtons();
}