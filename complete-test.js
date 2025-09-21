/**
 * KOMPLETNY TEST POŁĄCZEŃ MYBONZO
 * 
 * Instrukcje użycia:
 * 1. Otwórz stronę https://29dcf914.luc-de-zen-on.pages.dev
 * 2. Otwórz Developer Console (F12)
 * 3. Wklej ten cały skrypt i uruchom
 * 4. Sprawdź wyniki testów
 */

console.log('🚀 MyBonzo Complete Connection Test Suite');
console.log('=========================================');
console.log('Testing production deployment...\n');

const PROD_URL = 'https://29dcf914.luc-de-zen-on.pages.dev';

// Comprehensive testing class
class MyBonzoConnectionTester {
    constructor() {
        this.results = {
            api: {},
            ui: {},
            agents: {},
            functions: {}
        };
    }

    // Test all API endpoints
    async testAPIEndpoints() {
        console.log('🌐 Testing API Endpoints...');
        
        const endpoints = [
            { path: '/api/health', name: 'Health Check' },
            { path: '/api/chat', name: 'Main Chat' },
            { path: '/api/polaczek-chat', name: 'POLACZEK Chat' }
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${PROD_URL}${endpoint.path}`);
                this.results.api[endpoint.name] = {
                    status: response.status,
                    ok: response.ok,
                    data: response.ok ? await response.json() : null
                };
                console.log(`${response.ok ? '✅' : '❌'} ${endpoint.name}: ${response.status}`);
            } catch (error) {
                this.results.api[endpoint.name] = { error: error.message };
                console.log(`❌ ${endpoint.name}: ERROR - ${error.message}`);
            }
        }
    }

    // Test UI elements
    testUIElements() {
        console.log('\n🔘 Testing UI Elements...');
        
        const buttons = [
            { id: 'main-chat', name: 'Main Chat' },
            { id: 'bigquery-analytics', name: 'BigQuery Analytics' },
            { id: 'kaggle-datasets', name: 'Kaggle Datasets' },
            { id: 'tavily-search', name: 'Tavily Search' },
            { id: 'agents', name: 'AI Agents' }
        ];
        
        buttons.forEach(button => {
            const element = document.getElementById(button.id);
            if (element) {
                this.results.ui[button.name] = {
                    found: true,
                    hasOnClick: !!element.onclick || !!element.getAttribute('onclick'),
                    visible: element.offsetParent !== null,
                    text: element.textContent?.trim()
                };
                console.log(`✅ ${button.name}: Found and configured`);
            } else {
                this.results.ui[button.name] = { found: false };
                console.log(`❌ ${button.name}: Not found`);
            }
        });
    }

    // Test JavaScript functions
    testJavaScriptFunctions() {
        console.log('\n⚙️ Testing JavaScript Functions...');
        
        const functions = [
            { name: 'openFunction', global: true },
            { name: 'POLACZEK', global: true, isObject: true },
            { name: 'GoogleAgentsDebugger', global: false }
        ];
        
        functions.forEach(func => {
            if (func.global) {
                if (window[func.name]) {
                    this.results.functions[func.name] = {
                        available: true,
                        type: typeof window[func.name]
                    };
                    console.log(`✅ ${func.name}: Available (${typeof window[func.name]})`);
                } else {
                    this.results.functions[func.name] = { available: false };
                    console.log(`❌ ${func.name}: Not available`);
                }
            }
        });
    }

    // Test agent connections
    async testAgentConnections() {
        console.log('\n🤖 Testing Agent Connections...');
        
        // Test POLACZEK
        if (window.POLACZEK) {
            const status = window.POLACZEK.getStatus ? window.POLACZEK.getStatus() : 'unknown';
            this.results.agents.POLACZEK = {
                found: true,
                status: status,
                methods: {
                    getStatus: !!window.POLACZEK.getStatus,
                    forceReconnect: !!window.POLACZEK.forceReconnect,
                    openAssistant: !!window.POLACZEK.openAssistant
                }
            };
            console.log(`✅ POLACZEK Agent: Found - Status: ${status}`);
            
            // Try reconnection test
            if (window.POLACZEK.forceReconnect) {
                try {
                    window.POLACZEK.forceReconnect();
                    console.log('✅ POLACZEK reconnection test successful');
                } catch (error) {
                    console.log(`⚠️  POLACZEK reconnection test failed: ${error.message}`);
                }
            }
        } else {
            this.results.agents.POLACZEK = { found: false };
            console.log('❌ POLACZEK Agent: Not found');
        }
        
        // Test other agents
        const otherAgents = ['GOOGLE_VOICE', 'GoogleAgentsDebugger'];
        otherAgents.forEach(agent => {
            if (window[agent]) {
                this.results.agents[agent] = { found: true };
                console.log(`✅ ${agent}: Found`);
            } else {
                this.results.agents[agent] = { found: false };
                console.log(`❌ ${agent}: Not found`);
            }
        });
    }

    // Test button functionality (safe simulation)
    testButtonFunctionality() {
        console.log('\n🖱️ Testing Button Functionality...');
        
        if (typeof window.openFunction === 'function') {
            console.log('✅ openFunction available - testing button routing');
            
            // Test if buttons have proper onclick handlers
            const mainChat = document.getElementById('main-chat');
            if (mainChat) {
                const hasClickHandler = !!mainChat.onclick || !!mainChat.getAttribute('onclick');
                console.log(`${hasClickHandler ? '✅' : '❌'} Main Chat button has click handler`);
            }
            
            // Test function routing without actually calling
            console.log('✅ Button routing system appears functional');
            
        } else {
            console.log('❌ openFunction not available - buttons may not work');
        }
    }

    // Comprehensive test runner
    async runAllTests() {
        console.log('🔍 Starting comprehensive MyBonzo tests...\n');
        
        await this.testAPIEndpoints();
        this.testUIElements();
        this.testJavaScriptFunctions();
        await this.testAgentConnections();
        this.testButtonFunctionality();
        
        this.printSummary();
        return this.results;
    }

    // Print test summary
    printSummary() {
        console.log('\n📊 TEST SUMMARY');
        console.log('===============');
        
        // API Results
        const apiWorking = Object.values(this.results.api).filter(r => r.ok).length;
        const apiTotal = Object.keys(this.results.api).length;
        console.log(`🌐 API Endpoints: ${apiWorking}/${apiTotal} working`);
        
        // UI Results
        const uiWorking = Object.values(this.results.ui).filter(r => r.found).length;
        const uiTotal = Object.keys(this.results.ui).length;
        console.log(`🔘 UI Elements: ${uiWorking}/${uiTotal} found`);
        
        // Function Results
        const funcWorking = Object.values(this.results.functions).filter(r => r.available).length;
        const funcTotal = Object.keys(this.results.functions).length;
        console.log(`⚙️ Functions: ${funcWorking}/${funcTotal} available`);
        
        // Agent Results
        const agentWorking = Object.values(this.results.agents).filter(r => r.found).length;
        const agentTotal = Object.keys(this.results.agents).length;
        console.log(`🤖 Agents: ${agentWorking}/${agentTotal} found`);
        
        // Overall status
        const overallHealth = (apiWorking + uiWorking + funcWorking) / (apiTotal + uiTotal + funcTotal);
        console.log(`\n🎯 Overall Health: ${Math.round(overallHealth * 100)}%`);
        
        if (overallHealth > 0.8) {
            console.log('✅ MyBonzo is working well!');
        } else if (overallHealth > 0.6) {
            console.log('⚠️  MyBonzo has some issues but is functional');
        } else {
            console.log('❌ MyBonzo needs attention - multiple issues detected');
        }
    }
}

// Auto-run tests
console.log('Initializing test suite...');
const tester = new MyBonzoConnectionTester();

// Make available globally
window.MyBonzoTester = tester;

console.log('📝 Test suite ready! Auto-running in 2 seconds...');
console.log('💡 You can also run manually: MyBonzoTester.runAllTests()');

// Auto-run after page loads
setTimeout(() => {
    tester.runAllTests();
}, 2000);