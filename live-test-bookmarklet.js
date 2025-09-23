// Bezpośredni test floating buttons na live stronie - wykonaj w console przeglądarki
javascript: (function() {
    console.clear();
    console.log('🧪 LIVE TEST FLOATING BUTTONS');
    console.log('==============================');
    
    // Test 1: Sprawdź czy buttons istnieją
    console.log('\n🔍 SPRAWDZANIE PRZYCISKÓW:');
    const buttonTests = [
        { id: 'geminiProBtn', name: 'Gemini Pro', toggleFunc: 'toggleGeminiPro', sendFunc: 'sendToGeminiPro' },
        { id: 'codeBisonBtn', name: 'Code Bison', toggleFunc: 'toggleCodeBison', sendFunc: 'sendToCodeBison' },
        { id: 'textBisonBtn', name: 'Text Bison', toggleFunc: 'toggleTextBison', sendFunc: 'sendToTextBison' },
        { id: 'googleBardBtn', name: 'Google Bard', toggleFunc: 'toggleGoogleBard', sendFunc: 'sendToGoogleBard' }
    ];
    
    buttonTests.forEach(test => {
        const btn = document.getElementById(test.id);
        console.log(`\n📋 ${test.name}:`);
        
        if (btn) {
            console.log(`✅ Button znaleziony: "${btn.textContent.trim()}"`);
            console.log(`   Visible: ${btn.offsetParent !== null}`);
            console.log(`   Onclick: ${btn.onclick ? 'OK' : 'BRAK'}`);
            
            // Test toggle function
            if (typeof window[test.toggleFunc] === 'function') {
                console.log(`✅ ${test.toggleFunc}(): dostępna`);
            } else {
                console.log(`❌ ${test.toggleFunc}(): BRAK!`);
            }
            
            // Test send function
            if (typeof window[test.sendFunc] === 'function') {
                console.log(`✅ ${test.sendFunc}(): dostępna`);
            } else {
                console.log(`❌ ${test.sendFunc}(): BRAK!`);
            }
        } else {
            console.log(`❌ Button NIE ZNALEZIONY!`);
        }
    });
    
    // Test 2: Spróbuj kliknąć pierwszy button
    console.log('\n🖱️  TEST KLIKNIĘCIA:');
    const geminiBtn = document.getElementById('geminiProBtn');
    if (geminiBtn) {
        console.log('Klikam Gemini Pro button...');
        geminiBtn.click();
        
        setTimeout(() => {
            const widget = document.getElementById('geminiProWidget');
            if (widget) {
                const isVisible = !widget.classList.contains('hidden');
                console.log(`📱 Gemini Pro Widget: ${isVisible ? 'WIDOCZNY' : 'UKRYTY'}`);
                if (isVisible) {
                    console.log('✅ SUKCES - Widget się otworzył!');
                } else {
                    console.log('❌ PROBLEM - Widget pozostaje ukryty');
                }
            } else {
                console.log('❌ Widget element nie istnieje');
            }
        }, 500);
    }
    
    // Test 3: Manual API call test  
    console.log('\n📡 TEST BEZPOŚREDNIEGO API:');
    console.log('Testuję /api/gemini-pro...');
    
    fetch('/api/gemini-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'Test z konsoli - czy działasz?',
            language: 'pl'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ API Response otrzymany:');
        console.log(data);
    })
    .catch(error => {
        console.log('❌ API Error:');
        console.log(error);
    });
    
    // Test 4: Sprawdzenie stanu przycisków po resize
    console.log('\n🔄 TEST STANU PRZYCISKÓW PO RESIZE:');
    async function testButtonStateAfterResize() {
        const buttonTests = [
            { id: 'geminiProBtn', name: 'Gemini Pro', toggleFunc: 'toggleGeminiPro', sendFunc: 'sendToGeminiPro' },
            { id: 'codeBisonBtn', name: 'Code Bison', toggleFunc: 'toggleCodeBison', sendFunc: 'sendToCodeBison' },
            { id: 'textBisonBtn', name: 'Text Bison', toggleFunc: 'toggleTextBison', sendFunc: 'sendToTextBison' },
            { id: 'googleBardBtn', name: 'Google Bard', toggleFunc: 'toggleGoogleBard', sendFunc: 'sendToGoogleBard' }
        ];
        
        // Store initial button states
        const initialStates = {};
        buttonTests.forEach(test => {
            const btn = document.getElementById(test.id);
            if (btn) {
                initialStates[test.id] = {
                    visible: btn.offsetParent !== null,
                    hasOnclick: btn.onclick !== null,
                    hasToggleFunc: typeof window[test.toggleFunc] === 'function',
                    hasSendFunc: typeof window[test.sendFunc] === 'function',
                    textContent: btn.textContent.trim()
                };
            }
        });
        
        // Simulate window resize
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;
        Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
        window.dispatchEvent(new Event('resize'));
        
        // Wait for potential DOM updates
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Verify states remain consistent
        buttonTests.forEach(test => {
            const btn = document.getElementById(test.id);
            const initial = initialStates[test.id];
            
            if (btn && initial) {
                console.log(`✅ ${test.name} - Stan zachowany po resize:`);
                console.log(`   Widoczność: ${btn.offsetParent !== null === initial.visible ? 'OK' : 'BŁĄD'}`);
                console.log(`   Onclick handler: ${(btn.onclick !== null) === initial.hasOnclick ? 'OK' : 'BŁĄD'}`);
                console.log(`   Funkcja toggle: ${(typeof window[test.toggleFunc] === 'function') === initial.hasToggleFunc ? 'OK' : 'BŁĄD'}`);
                console.log(`   Funkcja send: ${(typeof window[test.sendFunc] === 'function') === initial.hasSendFunc ? 'OK' : 'BŁĄD'}`);
                console.log(`   Tekst: ${btn.textContent.trim() === initial.textContent ? 'OK' : 'BŁĄD'}`);
            }
        });
        
        // Restore original dimensions
        Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: originalHeight, configurable: true });
        window.dispatchEvent(new Event('resize'));
    }
    
    // Run the resize test
    testButtonStateAfterResize().then(() => {
        console.log('\n✅ Test stanu przycisków po resize zakończony');
    }).catch(err => {
        console.error('❌ Błąd podczas testu resize:', err);
    });
    
    // Test 5: Testowanie jednoczesnego toggle wielu przycisków
    async function testMultipleButtonsToggleSimultaneously() {
        const buttonTests = [
            { id: 'geminiProBtn', name: 'Gemini Pro', toggleFunc: 'toggleGeminiPro', sendFunc: 'sendToGeminiPro' },
            { id: 'codeBisonBtn', name: 'Code Bison', toggleFunc: 'toggleCodeBison', sendFunc: 'sendToCodeBison' },
            { id: 'textBisonBtn', name: 'Text Bison', toggleFunc: 'toggleTextBison', sendFunc: 'sendToTextBison' },
            { id: 'googleBardBtn', name: 'Google Bard', toggleFunc: 'toggleGoogleBard', sendFunc: 'sendToGoogleBard' }
        ];
        
        console.log('\n🔄 TEST JEDNOCZESNEGO TOGGLE WIELU PRZYCISKÓW:');
        
        // Store initial states
        const initialStates = buttonTests.map(test => {
            const btn = document.getElementById(test.id);
            const widget = document.getElementById(test.id.replace('Btn', 'Widget'));
            return {
                id: test.id,
                name: test.name,
                button: btn,
                widget: widget,
                initiallyVisible: widget && !widget.classList.contains('hidden')
            };
        });
        
        // Toggle all buttons simultaneously
        console.log('Klikam wszystkie przyciski jednocześnie...');
        initialStates.forEach(state => {
            if (state.button) {
                state.button.click();
            }
        });
        
        // Wait for DOM updates
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Verify each widget state changed appropriately
        let successCount = 0;
        initialStates.forEach(state => {
            if (state.widget) {
                const nowVisible = !state.widget.classList.contains('hidden');
                const stateChanged = nowVisible !== state.initiallyVisible;
                
                console.log(`📋 ${state.name}:`);
                console.log(`   Początkowy stan: ${state.initiallyVisible ? 'WIDOCZNY' : 'UKRYTY'}`);
                console.log(`   Obecny stan: ${nowVisible ? 'WIDOCZNY' : 'UKRYTY'}`);
                console.log(`   Stan się zmienił: ${stateChanged ? 'TAK' : 'NIE'}`);
                
                if (stateChanged) {
                    successCount++;
                    console.log(`✅ ${state.name} - Toggle zakończony sukcesem`);
                } else {
                    console.log(`❌ ${state.name} - Toggle nie zadziałał`);
                }
            } else {
                console.log(`❌ ${state.name} - Widget nie istnieje`);
            }
        });
        
        const allButtonsWorking = successCount === buttonTests.length;
        console.log(`\n📊 Wynik: ${successCount}/${buttonTests.length} przycisków działa poprawnie`);
        
        if (allButtonsWorking) {
            console.log('✅ SUKCES - Wszystkie przyciski reagują na jednoczesny toggle');
        } else {
            console.log('❌ PROBLEM - Niektóre przyciski nie reagują poprawnie');
        }
        
        return { successCount, totalButtons: buttonTests.length, allWorking: allButtonsWorking };
    }
    
    // Run the multiple buttons toggle test
    testMultipleButtonsToggleSimultaneously().then(result => {
        console.log('\n✅ Test jednoczesnego toggle wielu przycisków zakończony');
    }).catch(err => {
        console.error('❌ Błąd podczas testu jednoczesnego toggle:', err);
    });
    
    // Test 5: Sprawdź czy widgety istnieją
    console.log('\n📱 TEST WIDGETÓW:');
    const widgets = [
        'geminiProWidget',
        'geminiVisionWidget', 
        'codeBisonWidget',
        'textBisonWidget',
        'googleBardWidget'
    ];
    
    widgets.forEach(widgetId => {
        const widget = document.getElementById(widgetId);
        if (widget) {
            console.log(`✅ ${widgetId}: znaleziony`);
            console.log(`   Klasy: ${widget.className}`);
            console.log(`   Ukryty: ${widget.classList.contains('hidden') ? 'TAK' : 'NIE'}`);
            console.log(`   Display: ${window.getComputedStyle(widget).display}`);
        } else {
            console.log(`❌ ${widgetId}: BRAK!`);
        }
    });
    
    console.log('\n🎯 INSTRUKCJE:');
    console.log('1. Sprawdź wyniki powyżej');
    console.log('2. Kliknij ręcznie przyciski po prawej stronie');
    console.log('3. Obserwuj czy floating widgets się otwierają');
    console.log('4. Jeśli widget się otworzy, wpisz wiadomość i kliknij Wyślij');
    
})();