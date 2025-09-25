// Test połączeń API z wykorzystaniem secrets
const testApiConnections = async () => {
    console.log('🚀 Rozpoczynam test połączeń API z Cloudflare Secrets...\n');
    
    const baseUrl = 'http://127.0.0.1:8787';
    
    // Test 1: BigQuery API
    console.log('📊 Testowanie BigQuery API...');
    try {
        const bigQueryResponse = await fetch(`${baseUrl}/api/bigquery?action=test`);
        console.log(`BigQuery Status: ${bigQueryResponse.status}`);
        if (bigQueryResponse.ok) {
            const data = await bigQueryResponse.json();
            console.log('✅ BigQuery API działa:', data);
        } else {
            const error = await bigQueryResponse.text();
            console.log('❌ BigQuery API błąd:', error);
        }
    } catch (error) {
        console.log('❌ BigQuery API error:', error.message);
    }
    
    // Test 2: Kaggle API
    console.log('\n📊 Testowanie Kaggle API...');
    try {
        const kaggleResponse = await fetch(`${baseUrl}/api/kaggle?action=test`);
        console.log(`Kaggle Status: ${kaggleResponse.status}`);
        if (kaggleResponse.ok) {
            const data = await kaggleResponse.json();
            console.log('✅ Kaggle API działa:', data);
        } else {
            const error = await kaggleResponse.text();
            console.log('❌ Kaggle API błąd:', error);
        }
    } catch (error) {
        console.log('❌ Kaggle API error:', error.message);
    }
    
    // Test 3: Voice AI API
    console.log('\n🎤 Testowanie Voice AI API...');
    try {
        const voiceResponse = await fetch(`${baseUrl}/api/voice?action=test`);
        console.log(`Voice AI Status: ${voiceResponse.status}`);
        if (voiceResponse.ok) {
            const data = await voiceResponse.json();
            console.log('✅ Voice AI API działa:', data);
        } else {
            const error = await voiceResponse.text();
            console.log('❌ Voice AI API błąd:', error);
        }
    } catch (error) {
        console.log('❌ Voice AI API error:', error.message);
    }
    
    // Test 4: Sprawdzenie plików utility
    console.log('\n📁 Testowanie plików utility...');
    const utilityFiles = [
        '/utils/bigQueryAPI.js',
        '/utils/kaggleAPI.js', 
        '/utils/voiceAiAPI.js'
    ];
    
    for (const file of utilityFiles) {
        try {
            const response = await fetch(`${baseUrl}${file}`);
            console.log(`${file}: ${response.status === 200 ? '✅ Dostępny' : '❌ Niedostępny (' + response.status + ')'}`);
        } catch (error) {
            console.log(`${file}: ❌ Error - ${error.message}`);
        }
    }
    
    // Test 5: Sprawdzenie dostępnych secrets
    console.log('\n🔐 Testowanie dostępu do secrets...');
    try {
        const secretsResponse = await fetch(`${baseUrl}/api/test-secrets`);
        console.log(`Secrets test Status: ${secretsResponse.status}`);
        if (secretsResponse.ok) {
            const data = await secretsResponse.json();
            console.log('✅ Secrets dostępne:', Object.keys(data));
        } else {
            console.log('❌ Secrets test - endpoint może nie istnieć');
        }
    } catch (error) {
        console.log('❌ Secrets test error:', error.message);
    }
    
    console.log('\n🎯 Test zakończony!');
};

// Uruchomienie testów
testApiConnections();