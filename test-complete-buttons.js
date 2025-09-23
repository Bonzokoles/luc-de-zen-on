// Kompletny test wszystkich 8 floating buttons po naprawach
const testAllFloatingButtons = async () => {
    console.log('🧪 KOMPLETNY TEST WSZYSTKICH 8 FLOATING BUTTONS');
    console.log('================================================');
    
    const floatingButtons = [
        {
            id: 'floating-btn-1',
            name: 'POLACZEK',
            api: '/api/polaczek-chat',
            service: 'Cloudflare Workers AI',
            testPayload: { message: 'Test POLACZEK - czy działasz?' }
        },
        {
            id: 'floating-btn-2', 
            name: 'Gemini Pro',
            api: '/api/gemini-pro',
            service: 'Google AI Studio (via AI Gateway)',
            testPayload: { message: 'Test Gemini Pro - sprawdzenie API' }
        },
        {
            id: 'floating-btn-3',
            name: 'Google Bard',
            api: '/api/google-bard', 
            service: 'Google AI Studio (via AI Gateway)',
            testPayload: { message: 'Test Google Bard - funkcjonalność' }
        },
        {
            id: 'floating-btn-4',
            name: 'Code Bison',
            api: '/api/code-bison',
            service: 'Google AI Studio (via AI Gateway)',
            testPayload: { message: 'Test Code Bison - czy mogę pomóc z kodem?' }
        },
        {
            id: 'floating-btn-5',
            name: 'Text Bison',
            api: '/api/text-bison',
            service: 'Google AI Studio (via AI Gateway)',
            testPayload: { message: 'Test Text Bison - generowanie tekstu' }
        },
        {
            id: 'floating-btn-6',
            name: 'AI Helper 6 - Creative Writing',
            api: '/api/helper-6',
            service: 'Google AI Studio (via AI Gateway)',
            testPayload: { message: 'Test AI Helper 6 - napisz krótką historię' }
        },
        {
            id: 'floating-btn-7', 
            name: 'AI Helper 7 - Technical Support',
            api: '/api/helper-7',
            service: 'Google AI Studio (via AI Gateway)',
            testPayload: { message: 'Test AI Helper 7 - pomoc techniczna działa?' }
        },
        {
            id: 'floating-btn-8',
            name: 'AI Helper 8 - Business & Marketing',
            api: '/api/helper-8',
            service: 'Google AI Studio (via AI Gateway)',
            testPayload: { message: 'Test AI Helper 8 - strategia marketingowa' }
        }
    ];

    console.log(`\n📋 Testowanie ${floatingButtons.length}/8 floating buttons\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < floatingButtons.length; i++) {
        const button = floatingButtons[i];
        console.log(`\n🔘 TEST ${i + 1}/8: ${button.name}`);
        console.log(`   Service: ${button.service}`);
        console.log(`   API: ${button.api}`);

        try {
            console.log(`   📡 Wysyłanie test payload...`);
            
            const response = await fetch(`https://luc-de-zen-on.pages.dev${button.api}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(button.testPayload)
            });

            console.log(`   📊 Status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`   ✅ SUCCESS - API działa poprawnie`);
                
                const responseText = data.response || data.answer || data.message || 'Brak odpowiedzi';
                console.log(`   💬 Odpowiedź: ${responseText.substring(0, 80)}...`);
                
                if (data.model || data.modelUsed) {
                    console.log(`   🤖 Model: ${data.model || data.modelUsed}`);
                }
                
                successCount++;
            } else {
                console.log(`   ❌ FAILED - Status: ${response.status}`);
                const errorText = await response.text();
                console.log(`   📝 Error: ${errorText.substring(0, 100)}...`);
                errorCount++;
            }

        } catch (error) {
            console.log(`   🚨 CONNECTION ERROR: ${error.message}`);
            errorCount++;
        }

        // Delay między testami
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n\n🎯 WYNIKI TESTÓW FLOATING BUTTONS`);
    console.log(`==================================`);
    console.log(`📊 Total: ${floatingButtons.length} buttonów`);
    console.log(`✅ Success: ${successCount} działa`);
    console.log(`❌ Errors: ${errorCount} problemów`);
    console.log(`📈 Success Rate: ${((successCount/floatingButtons.length)*100).toFixed(1)}%`);
    
    if (successCount === floatingButtons.length) {
        console.log(`\n🎉 PERFEKCYJNY WYNIK - WSZYSTKIE 8 FLOATING BUTTONS DZIAŁAJĄ!`);
        console.log(`🚀 System gotowy do użytku`);
    } else if (successCount >= 6) {
        console.log(`\n✨ DOBRY WYNIK - Większość buttonów działa poprawnie`);
    } else {
        console.log(`\n⚠️  WYMAGANE NAPRAWY - Kilka buttonów wymaga uwagi`);
    }
};

// Uruchom kompletny test
testAllFloatingButtons().catch(console.error);