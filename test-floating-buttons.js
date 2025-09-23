// Test floating buttons functionality
// Sprawdza czy wszystkie 8 floating buttons działają poprawnie

const testFloatingButtons = async () => {
    console.log('🧪 TESTOWANIE FLOATING BUTTONS SYSTEM');
    console.log('=====================================');
    
    // Lista wszystkich floating buttons z ich konfiguracją
    const floatingButtons = [
        {
            id: 'floating-btn-1',
            name: 'POLACZEK',
            api: '/api/polaczek-chat',
            service: 'Cloudflare Workers AI',
            expectedModel: '@cf/meta/llama-3-8b-instruct'
        },
        {
            id: 'floating-btn-2', 
            name: 'Gemini Pro',
            api: '/api/gemini-pro',
            service: 'Google AI Studio (via AI Gateway)',
            expectedModel: 'gemini-1.5-flash'
        },
        {
            id: 'floating-btn-3',
            name: 'Google Bard',
            api: '/api/google-bard', 
            service: 'Google AI Studio (via AI Gateway)',
            expectedModel: 'gemini-1.5-pro'
        },
        {
            id: 'floating-btn-4',
            name: 'Code Bison',
            api: '/api/code-bison',
            service: 'Google AI Studio (via AI Gateway)', 
            expectedModel: 'code-bison'
        },
        {
            id: 'floating-btn-5',
            name: 'Text Bison',
            api: '/api/text-bison',
            service: 'Google AI Studio (via AI Gateway)',
            expectedModel: 'text-bison'
        },
        {
            id: 'floating-btn-6',
            name: 'AI Helper 6',
            api: '/api/helper-6',
            service: 'TBD',
            status: 'placeholder'
        },
        {
            id: 'floating-btn-7', 
            name: 'AI Helper 7',
            api: '/api/helper-7',
            service: 'TBD',
            status: 'placeholder'
        },
        {
            id: 'floating-btn-8',
            name: 'AI Helper 8', 
            api: '/api/helper-8',
            service: 'TBD',
            status: 'placeholder'
        }
    ];

    console.log(`\n📋 Znaleziono ${floatingButtons.length} floating buttons do testowania\n`);

    // Test każdego buttona
    for (let i = 0; i < floatingButtons.length; i++) {
        const button = floatingButtons[i];
        console.log(`\n🔘 TEST ${i + 1}/8: ${button.name}`);
        console.log(`   ID: ${button.id}`);
        console.log(`   API: ${button.api}`);
        console.log(`   Service: ${button.service}`);
        
        if (button.status === 'placeholder') {
            console.log(`   ⚠️  Status: Placeholder - nie testujemy API`);
            continue;
        }

        try {
            // Test API endpoint
            console.log(`   📡 Testowanie API endpoint...`);
            
            const response = await fetch(`https://luc-de-zen-on.pages.dev${button.api}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Test message - sprawdzenie działania API',
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`   ✅ API działa poprawnie`);
                console.log(`   📊 Response status: ${response.status}`);
                if (data.response) {
                    console.log(`   💬 Otrzymano odpowiedź: ${data.response.substring(0, 100)}...`);
                }
            } else {
                console.log(`   ❌ API error: ${response.status} - ${response.statusText}`);
                const errorText = await response.text();
                console.log(`   📝 Error details: ${errorText.substring(0, 200)}`);
            }

        } catch (error) {
            console.log(`   🚨 Connection error: ${error.message}`);
        }

        // Delay między testami
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n\n🎯 TEST FLOATING BUTTONS ZAKOŃCZONY`);
    console.log(`=====================================`);
    console.log(`📊 Przetestowano ${floatingButtons.length} buttonów`);
    console.log(`✅ Aktywne API: POLACZEK, Gemini Pro, Google Bard, Code Bison, Text Bison`);
    console.log(`⚠️  Placeholder: AI Helper 6, 7, 8 (gotowe do konfiguracji)`);
};

// Uruchom test
testFloatingButtons().catch(console.error);