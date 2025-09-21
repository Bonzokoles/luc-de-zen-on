// Test struktury floating buttons w kodzie źródłowym
import fs from 'fs';
import path from 'path';

const analyzeFloatingButtons = () => {
    console.log('🔍 ANALIZA STRUKTURY FLOATING BUTTONS');
    console.log('=====================================');
    
    // Ścieżka do głównego pliku index.astro
    const indexPath = path.join(process.cwd(), 'src', 'pages', 'index.astro');
    
    try {
        const content = fs.readFileSync(indexPath, 'utf8');
        
        // Sprawdź przyciski floating
        console.log('\n🔍 PRZYCISKI FLOATING:');
        const buttonMatches = content.match(/onclick="toggle\w+\(\)"/g);
        if (buttonMatches) {
            console.log(`✅ Znaleziono ${buttonMatches.length} przycisków toggle:`);
            buttonMatches.forEach(match => console.log(`   ${match}`));
        } else {
            console.log('❌ BRAK przycisków toggle!');
        }
        
        // Sprawdź ID przycisków
        console.log('\n🆔 ID PRZYCISKÓW:');
        const idMatches = content.match(/id="(geminiProBtn|codeBisonBtn|textBisonBtn|googleBardBtn)"/g);
        if (idMatches) {
            idMatches.forEach(match => console.log(`✅ ${match}`));
        } else {
            console.log('❌ BRAK ID przycisków!');
        }
        
        // Sprawdź funkcje toggle
        console.log('\n🔧 FUNKCJE TOGGLE:');
        const toggleFunctions = ['toggleGeminiPro', 'toggleCodeBison', 'toggleTextBison', 'toggleGoogleBard'];
        toggleFunctions.forEach(func => {
            if (content.includes(`function ${func}`)) {
                console.log(`✅ ${func}: ZDEFINIOWANA`);
            } else {
                console.log(`❌ ${func}: BRAK!`);
            }
        });
        
        // Sprawdź funkcje send
        console.log('\n📡 FUNKCJE SEND:');
        const sendFunctions = ['sendToGeminiPro', 'sendToCodeBison', 'sendToTextBison', 'sendToGoogleBard'];
        sendFunctions.forEach(func => {
            if (content.includes(`function ${func}`)) {
                console.log(`✅ ${func}: ZDEFINIOWANA`);
            } else {
                console.log(`❌ ${func}: BRAK!`);
            }
        });
        
        // Sprawdź API endpoints w funkcjach send
        console.log('\n🌐 API ENDPOINTS W KODZIE:');
        const apiEndpoints = ['/api/gemini-pro', '/api/code-bison', '/api/text-bison', '/api/google-bard'];
        apiEndpoints.forEach(endpoint => {
            if (content.includes(`"${endpoint}"`)) {
                console.log(`✅ ${endpoint}: UŻYWANY W KODZIE`);
            } else {
                console.log(`❌ ${endpoint}: BRAK W KODZIE!`);
            }
        });
        
        // Sprawdź CSS classes
        console.log('\n🎨 CSS CLASSES:');
        const cssClasses = ['.right-btn', '.floating-widget', '.floating-widget-container'];
        cssClasses.forEach(cls => {
            if (content.includes(cls)) {
                console.log(`✅ ${cls}: ISTNIEJE`);
            } else {
                console.log(`❌ ${cls}: BRAK!`);
            }
        });
        
        console.log('\n📋 PODSUMOWANIE:');
        console.log('Sprawdzam czy struktura floating buttons jest kompletna...');
        
    } catch (error) {
        console.error('❌ Błąd odczytu pliku:', error.message);
    }
};

// Uruchom analizę
analyzeFloatingButtons();