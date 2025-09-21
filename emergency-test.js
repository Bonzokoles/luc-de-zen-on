/**
 * EMERGENCY BROWSER TEST dla MyBonzo
 * 
 * Co zrobić:
 * 1. Otwórz https://29dcf914.luc-de-zen-on.pages.dev
 * 2. Otwórz Developer Console (F12)
 * 3. Wklej i uruchom ten kod
 * 4. Sprawdź wyniki w konsoli
 */

console.clear();
console.log('🚨 EMERGENCY MyBonzo Diagnostic Test');
console.log('====================================\n');

// Test 1: Check if basic functions exist
console.log('1️⃣ Testing basic JavaScript functions...');
console.log('typeof openFunction:', typeof openFunction);
console.log('typeof window.openFunction:', typeof window.openFunction);

// Test 2: Check buttons
console.log('\n2️⃣ Testing button elements...');
const testButtons = [
    'main-chat',
    'bigquery-analytics', 
    'kaggle-datasets',
    'tavily-search',
    'agents'
];

testButtons.forEach(id => {
    const btn = document.getElementById(id);
    console.log(`Button #${id}:`, btn ? 'FOUND' : 'MISSING');
    if (btn) {
        console.log(`  - onclick:`, btn.onclick ? 'HAS HANDLER' : 'NO HANDLER');
        console.log(`  - onclick attr:`, btn.getAttribute('onclick') || 'NONE');
    }
});

// Test 3: Check POLACZEK agent
console.log('\n3️⃣ Testing POLACZEK Agent...');
if (window.POLACZEK) {
    console.log('✅ POLACZEK found');
    console.log('Status:', window.POLACZEK.getStatus ? window.POLACZEK.getStatus() : 'NO STATUS');
} else {
    console.log('❌ POLACZEK not found');
}

// Test 4: Check for JavaScript errors
console.log('\n4️⃣ Testing for errors...');
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript Error detected:', e.message, 'at', e.filename + ':' + e.lineno);
});

// Test 5: Manual button test
console.log('\n5️⃣ Manual button tests available:');
console.log('Run these commands to test buttons:');
console.log('• testButton("main-chat")');
console.log('• testButton("bigquery-analytics")');
console.log('• testButton("agents")');

window.testButton = function(buttonId) {
    console.log(`\n🔧 Testing button: ${buttonId}`);
    const btn = document.getElementById(buttonId);
    if (!btn) {
        console.error(`❌ Button #${buttonId} not found!`);
        return;
    }
    
    console.log('✅ Button found:', btn.textContent?.trim());
    
    // Try to trigger click
    try {
        console.log('🖱️ Attempting to click...');
        btn.click();
        console.log('✅ Click executed successfully');
    } catch (error) {
        console.error('❌ Click failed:', error.message);
    }
};

// Test 6: Check if openFunction works manually
console.log('\n6️⃣ Manual openFunction test:');
console.log('Run: testOpenFunction()');

window.testOpenFunction = function() {
    console.log('\n🔧 Testing openFunction manually...');
    
    if (typeof openFunction === 'function') {
        try {
            console.log('🧪 Calling openFunction("rekomendacje")...');
            openFunction('rekomendacje');
            console.log('✅ openFunction call completed');
        } catch (error) {
            console.error('❌ openFunction error:', error.message);
        }
    } else if (typeof window.openFunction === 'function') {
        try {
            console.log('🧪 Calling window.openFunction("rekomendacje")...');
            window.openFunction('rekomendacje');
            console.log('✅ window.openFunction call completed');
        } catch (error) {
            console.error('❌ window.openFunction error:', error.message);
        }
    } else {
        console.error('❌ openFunction not available in any scope');
    }
};

console.log('\n📊 Diagnostic test loaded successfully!');
console.log('💡 Use the test functions above to debug specific issues.');
console.log('📋 Check above for any missing elements or errors.');

// Auto-run basic diagnostics
setTimeout(() => {
    console.log('\n🔍 Auto-running basic diagnostics...');
    
    // Test if any major issues are immediately visible
    const issues = [];
    
    if (typeof openFunction !== 'function' && typeof window.openFunction !== 'function') {
        issues.push('openFunction not available');
    }
    
    if (!document.getElementById('main-chat')) {
        issues.push('main-chat button missing');
    }
    
    if (!window.POLACZEK) {
        issues.push('POLACZEK agent missing');
    }
    
    if (issues.length === 0) {
        console.log('✅ No major issues detected - everything looks good!');
    } else {
        console.log('⚠️  Issues detected:', issues.join(', '));
    }
}, 1000);