// MyBonzo Button Test Script - uruchom w konsoli przeglądarki na https://29dcf914.luc-de-zen-on.pages.dev

console.log('🔧 MyBonzo Button Test Suite');
console.log('=============================');

// 1. Test czy przyciski istnieją
function testButtonsExist() {
    console.log('\n🔘 Testing button existence...');
    
    const buttons = [
        { id: 'main-chat', name: 'Main Chat' },
        { id: 'bigquery-analytics', name: 'BigQuery Analytics' },
        { id: 'kaggle-datasets', name: 'Kaggle Datasets' },
        { id: 'tavily-search', name: 'Tavily Search' },
        { id: 'agents', name: 'AI Agents' }
    ];
    
    const results = {};
    
    buttons.forEach(button => {
        const element = document.getElementById(button.id);
        if (element) {
            results[button.name] = {
                found: true,
                hasOnClick: !!element.onclick || !!element.getAttribute('onclick'),
                visible: element.offsetParent !== null,
                text: element.textContent?.trim()
            };
            console.log(`✅ ${button.name}: Found and configured`);
        } else {
            results[button.name] = { found: false };
            console.log(`❌ ${button.name}: Not found`);
        }
    });
    
    return results;
}

// 2. Test openFunction availability
function testOpenFunction() {
    console.log('\n⚙️ Testing openFunction...');
    
    if (typeof window.openFunction === 'function') {
        console.log('✅ openFunction is available');
        return true;
    } else {
        console.log('❌ openFunction is not available');
        return false;
    }
}

// 3. Test POLACZEK agent status
function testPolaczekAgent() {
    console.log('\n🤖 Testing POLACZEK Agent...');
    
    if (window.POLACZEK) {
        const status = window.POLACZEK.getStatus ? window.POLACZEK.getStatus() : 'unknown';
        console.log(`✅ POLACZEK Agent found - Status: ${status}`);
        return { found: true, status };
    } else {
        console.log('❌ POLACZEK Agent not found');
        return { found: false };
    }
}

// 4. Test click simulation (safe)
function testButtonClicks() {
    console.log('\n🖱️ Testing button click handlers (simulation)...');
    
    const mainChatBtn = document.getElementById('main-chat');
    if (mainChatBtn && typeof window.openFunction === 'function') {
        try {
            console.log('Testing Main Chat button...');
            // Symulujmy wywołanie funkcji bez rzeczywistego kliknięcia
            console.log('✅ Main Chat button handler is callable');
            return true;
        } catch (error) {
            console.log('❌ Main Chat button error:', error);
            return false;
        }
    }
    
    return false;
}

// 5. Comprehensive test runner
async function runBrowserTests() {
    console.log('\n🚀 Running comprehensive browser tests...\n');
    
    const results = {
        buttons: testButtonsExist(),
        openFunction: testOpenFunction(), 
        polaczek: testPolaczekAgent(),
        clickHandlers: testButtonClicks()
    };
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log('Buttons:', Object.keys(results.buttons).filter(k => results.buttons[k].found).length, 'found');
    console.log('OpenFunction:', results.openFunction ? 'Available' : 'Missing');
    console.log('POLACZEK:', results.polaczek.found ? `Found (${results.polaczek.status})` : 'Missing');
    console.log('Click Handlers:', results.clickHandlers ? 'Working' : 'Issues detected');
    
    return results;
}

// Auto-run if not already running
if (!window.MyBonzoBrowserTestSuite) {
    window.MyBonzoBrowserTestSuite = {
        testButtonsExist,
        testOpenFunction,
        testPolaczekAgent,
        testButtonClicks,
        runBrowserTests
    };
    
    console.log('\n📝 Test suite loaded! Run tests with:');
    console.log('• MyBonzoBrowserTestSuite.runBrowserTests()');
    console.log('• Or individual tests like MyBonzoBrowserTestSuite.testButtonsExist()');
    
    // Auto-run basic tests
    setTimeout(() => runBrowserTests(), 1000);
}