globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, a as renderTemplate, d as renderHead, b as renderScript } from '../chunks/astro/server_DFvGEJvU.mjs';
/* empty css                                                */
export { r as renderers } from '../chunks/_@astro-renderers_Ba3qNCWV.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$AiIntegrationsTest = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="pl" data-astro-cid-mluvns3u> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AI Integrations Test - Tavily + DeepSeek + Kaggle</title>', "", `</head> <body class="bg-gray-100 min-h-screen" data-astro-cid-mluvns3u> <div class="gradient-bg text-white py-8" data-astro-cid-mluvns3u> <div class="container mx-auto px-4" data-astro-cid-mluvns3u> <h1 class="text-4xl font-bold text-center mb-4" data-astro-cid-mluvns3u>\u0111\u017A\xA4\u2013 AI Integrations Test</h1> <p class="text-center text-lg opacity-90" data-astro-cid-mluvns3u>Tavily Search + DeepSeek AI + Kaggle Datasets</p> </div> </div> <div class="container mx-auto px-4 py-8" data-astro-cid-mluvns3u> <!-- Status Panel --> <div class="bg-white rounded-lg shadow-lg p-6 mb-8" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\u0111\u017A\u201D\xA7 Connection Status</h2> <div class="grid md:grid-cols-3 gap-4" data-astro-cid-mluvns3u> <div class="text-center p-4 bg-green-50 rounded-lg" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\xE2\u015B\u2026</div> <h3 class="font-semibold text-green-800" data-astro-cid-mluvns3u>Tavily Search</h3> <p class="text-sm text-green-600" data-astro-cid-mluvns3u>Connected & Working</p> </div> <div class="text-center p-4 bg-yellow-50 rounded-lg" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\xE2\u0161\u2122\u010F\xB8\u0179</div> <h3 class="font-semibold text-yellow-800" data-astro-cid-mluvns3u>DeepSeek AI</h3> <p class="text-sm text-yellow-600" data-astro-cid-mluvns3u>Ready for Testing</p> </div> <div class="text-center p-4 bg-blue-50 rounded-lg" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\u0160</div> <h3 class="font-semibold text-blue-800" data-astro-cid-mluvns3u>Kaggle API</h3> <p class="text-sm text-blue-600" data-astro-cid-mluvns3u>Ready for Testing</p> </div> </div> </div> <!-- Tavily Search Test --> <div class="bg-white rounded-lg shadow-lg p-6 mb-8 card-hover" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\u0111\u017A\u201D\u0164 Tavily Search Test</h2> <div class="mb-4" data-astro-cid-mluvns3u> <input type="text" id="tavilyQuery" placeholder="Enter search query..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="latest AI developments 2024" data-astro-cid-mluvns3u> </div> <button onclick="testTavily()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors" data-astro-cid-mluvns3u>
\u0111\u017A\u201D\u0164 Search with Tavily
</button> <div id="tavilyResults" class="mt-4 p-4 bg-gray-50 rounded-lg hidden" data-astro-cid-mluvns3u> <h3 class="font-semibold mb-2" data-astro-cid-mluvns3u>Search Results:</h3> <div id="tavilyContent" data-astro-cid-mluvns3u></div> </div> </div> <!-- DeepSeek + Kaggle Test --> <div class="bg-white rounded-lg shadow-lg p-6 mb-8 card-hover" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\u0111\u017A\xA7\xA0 DeepSeek + Kaggle Integration Test</h2> <div class="grid md:grid-cols-2 gap-4 mb-4" data-astro-cid-mluvns3u> <div data-astro-cid-mluvns3u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-mluvns3u>Dataset Search:</label> <input type="text" id="datasetQuery" placeholder="e.g., titanic, housing, covid..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="titanic" data-astro-cid-mluvns3u> </div> <div data-astro-cid-mluvns3u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-mluvns3u>Analysis Type:</label> <select id="analysisType" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" data-astro-cid-mluvns3u> <option value="quick" data-astro-cid-mluvns3u>Quick Analysis</option> <option value="detailed" data-astro-cid-mluvns3u>Detailed Analysis</option> <option value="ml" data-astro-cid-mluvns3u>ML Potential</option> <option value="custom" data-astro-cid-mluvns3u>Custom Prompt</option> </select> </div> </div> <div class="mb-4" data-astro-cid-mluvns3u> <textarea id="customPrompt" placeholder="Custom analysis prompt (only for Custom type)..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 hidden" data-astro-cid-mluvns3u></textarea> </div> <div class="flex gap-4" data-astro-cid-mluvns3u> <button onclick="testDeepSeekKaggle()" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors" data-astro-cid-mluvns3u>
\u0111\u017A\xA7\xA0 Analyze with DeepSeek
</button> <button onclick="testConnections()" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors" data-astro-cid-mluvns3u>
\u0111\u017A\u201D\xA7 Test Connections
</button> </div> <div id="deepseekResults" class="mt-4 p-4 bg-gray-50 rounded-lg hidden" data-astro-cid-mluvns3u> <h3 class="font-semibold mb-2" data-astro-cid-mluvns3u>Analysis Results:</h3> <div id="deepseekContent" data-astro-cid-mluvns3u></div> </div> </div> <!-- Quick Actions --> <div class="bg-white rounded-lg shadow-lg p-6 card-hover" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\xE2\u0161\u02C7 Quick Actions</h2> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4" data-astro-cid-mluvns3u> <button onclick="quickDemo('popular-datasets')" class="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\u0160</div> <div class="font-semibold text-indigo-800" data-astro-cid-mluvns3u>Popular Datasets</div> </button> <button onclick="quickDemo('ai-news')" class="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\xB0</div> <div class="font-semibold text-green-800" data-astro-cid-mluvns3u>AI News</div> </button> <button onclick="quickDemo('ml-trends')" class="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\x88</div> <div class="font-semibold text-orange-800" data-astro-cid-mluvns3u>ML Trends</div> </button> <button onclick="quickDemo('test-all')" class="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u0161\u20AC</div> <div class="font-semibold text-red-800" data-astro-cid-mluvns3u>Test All</div> </button> </div> </div> </div> <script type="module">
        import DeepSeekKaggleIntegration from '/src/utils/deepseek-kaggle-integration.js';

        // Initialize DeepSeek integration
        const deepseekIntegration = new DeepSeekKaggleIntegration();

        // Make functions global
        window.testTavily = testTavily;
        window.testDeepSeekKaggle = testDeepSeekKaggle;
        window.testConnections = testConnections;
        window.quickDemo = quickDemo;

        // Show/hide custom prompt based on analysis type
        document.getElementById('analysisType').addEventListener('change', function() {
            const customPrompt = document.getElementById('customPrompt');
            if (this.value === 'custom') {
                customPrompt.classList.remove('hidden');
            } else {
                customPrompt.classList.add('hidden');
            }
        });

        async function testTavily() {
            const query = document.getElementById('tavilyQuery').value;
            const resultsDiv = document.getElementById('tavilyResults');
            const contentDiv = document.getElementById('tavilyContent');
            
            resultsDiv.classList.remove('hidden');
            contentDiv.innerHTML = '<div class="text-center py-4">\u0111\u017A\u201D\u0164 Searching...</div>';

            try {
                const response = await fetch('/api/test-tavily', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                const data = await response.json();
                
                if (data.success) {
                    contentDiv.innerHTML = \`
                        <div class="space-y-4">
                            \${data.results.map(result => \`
                                <div class="border-l-4 border-blue-500 pl-4">
                                    <h4 class="font-semibold text-blue-800">\${result.title}</h4>
                                    <p class="text-sm text-gray-600 mb-2">\${result.url}</p>
                                    <p class="text-gray-700">\${result.content.substring(0, 200)}...</p>
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                } else {
                    contentDiv.innerHTML = \`<div class="text-red-600">Error: \${data.error}</div>\`;
                }
            } catch (error) {
                contentDiv.innerHTML = \`<div class="text-red-600">Error: \${error.message}</div>\`;
            }
        }

        async function testDeepSeekKaggle() {
            const dataset = document.getElementById('datasetQuery').value;
            const analysisType = document.getElementById('analysisType').value;
            const customPrompt = document.getElementById('customPrompt').value;
            const resultsDiv = document.getElementById('deepseekResults');
            const contentDiv = document.getElementById('deepseekContent');
            
            resultsDiv.classList.remove('hidden');
            contentDiv.innerHTML = '<div class="text-center py-4">\u0111\u017A\xA7\xA0 Analyzing...</div>';

            try {
                const response = await fetch('/api/test-deepseek-kaggle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dataset, analysisType, customPrompt })
                });

                const data = await response.json();
                
                if (data.success) {
                    contentDiv.innerHTML = \`
                        <div class="space-y-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-blue-800 mb-2">Dataset Info:</h4>
                                <p><strong>Name:</strong> \${data.dataset?.title || 'N/A'}</p>
                                <p><strong>Owner:</strong> \${data.dataset?.ownerName || 'N/A'}</p>
                                <p><strong>Size:</strong> \${data.dataset?.totalBytes || 'N/A'} bytes</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-purple-800 mb-2">DeepSeek Analysis:</h4>
                                <div class="whitespace-pre-wrap text-gray-700">\${data.analysis}</div>
                            </div>
                        </div>
                    \`;
                } else {
                    contentDiv.innerHTML = \`<div class="text-red-600">Error: \${data.error}</div>\`;
                }
            } catch (error) {
                contentDiv.innerHTML = \`<div class="text-red-600">Error: \${error.message}</div>\`;
            }
        }

        async function testConnections() {
            const resultsDiv = document.getElementById('deepseekResults');
            const contentDiv = document.getElementById('deepseekContent');
            
            resultsDiv.classList.remove('hidden');
            contentDiv.innerHTML = '<div class="text-center py-4">\u0111\u017A\u201D\xA7 Testing connections...</div>';

            try {
                const response = await fetch('/api/test-connections', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                
                contentDiv.innerHTML = \`
                    <div class="space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="p-4 rounded-lg \${data.deepseek ? 'bg-green-50' : 'bg-red-50'}">
                                <h4 class="font-semibold \${data.deepseek ? 'text-green-800' : 'text-red-800'} mb-2">
                                    \${data.deepseek ? '\xE2\u015B\u2026' : '\xE2\u0165\u015A'} DeepSeek AI
                                </h4>
                                <p class="text-sm">\${data.deepseekResponse || data.deepseekError || 'No response'}</p>
                            </div>
                            <div class="p-4 rounded-lg \${data.kaggle ? 'bg-green-50' : 'bg-red-50'}">
                                <h4 class="font-semibold \${data.kaggle ? 'text-green-800' : 'text-red-800'} mb-2">
                                    \${data.kaggle ? '\xE2\u015B\u2026' : '\xE2\u0165\u015A'} Kaggle API
                                </h4>
                                <p class="text-sm">\${data.kaggle ? 'Connection successful' : (data.kaggleError || 'Connection failed')}</p>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500">
                            Test completed at: \${data.timestamp}
                        </div>
                    </div>
                \`;
            } catch (error) {
                contentDiv.innerHTML = \`<div class="text-red-600">Error: \${error.message}</div>\`;
            }
        }

        async function quickDemo(type) {
            switch(type) {
                case 'popular-datasets':
                    document.getElementById('datasetQuery').value = 'popular';
                    document.getElementById('analysisType').value = 'quick';
                    await testDeepSeekKaggle();
                    break;
                case 'ai-news':
                    document.getElementById('tavilyQuery').value = 'latest AI breakthroughs 2024';
                    await testTavily();
                    break;
                case 'ml-trends':
                    document.getElementById('tavilyQuery').value = 'machine learning trends 2024';
                    await testTavily();
                    break;
                case 'test-all':
                    await testConnections();
                    setTimeout(async () => {
                        document.getElementById('tavilyQuery').value = 'AI integration test';
                        await testTavily();
                    }, 2000);
                    setTimeout(async () => {
                        document.getElementById('datasetQuery').value = 'titanic';
                        await testDeepSeekKaggle();
                    }, 4000);
                    break;
            }
        }
    <\/script> </body> </html>`], ['<html lang="pl" data-astro-cid-mluvns3u> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AI Integrations Test - Tavily + DeepSeek + Kaggle</title>', "", `</head> <body class="bg-gray-100 min-h-screen" data-astro-cid-mluvns3u> <div class="gradient-bg text-white py-8" data-astro-cid-mluvns3u> <div class="container mx-auto px-4" data-astro-cid-mluvns3u> <h1 class="text-4xl font-bold text-center mb-4" data-astro-cid-mluvns3u>\u0111\u017A\xA4\u2013 AI Integrations Test</h1> <p class="text-center text-lg opacity-90" data-astro-cid-mluvns3u>Tavily Search + DeepSeek AI + Kaggle Datasets</p> </div> </div> <div class="container mx-auto px-4 py-8" data-astro-cid-mluvns3u> <!-- Status Panel --> <div class="bg-white rounded-lg shadow-lg p-6 mb-8" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\u0111\u017A\u201D\xA7 Connection Status</h2> <div class="grid md:grid-cols-3 gap-4" data-astro-cid-mluvns3u> <div class="text-center p-4 bg-green-50 rounded-lg" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\xE2\u015B\u2026</div> <h3 class="font-semibold text-green-800" data-astro-cid-mluvns3u>Tavily Search</h3> <p class="text-sm text-green-600" data-astro-cid-mluvns3u>Connected & Working</p> </div> <div class="text-center p-4 bg-yellow-50 rounded-lg" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\xE2\u0161\u2122\u010F\xB8\u0179</div> <h3 class="font-semibold text-yellow-800" data-astro-cid-mluvns3u>DeepSeek AI</h3> <p class="text-sm text-yellow-600" data-astro-cid-mluvns3u>Ready for Testing</p> </div> <div class="text-center p-4 bg-blue-50 rounded-lg" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\u0160</div> <h3 class="font-semibold text-blue-800" data-astro-cid-mluvns3u>Kaggle API</h3> <p class="text-sm text-blue-600" data-astro-cid-mluvns3u>Ready for Testing</p> </div> </div> </div> <!-- Tavily Search Test --> <div class="bg-white rounded-lg shadow-lg p-6 mb-8 card-hover" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\u0111\u017A\u201D\u0164 Tavily Search Test</h2> <div class="mb-4" data-astro-cid-mluvns3u> <input type="text" id="tavilyQuery" placeholder="Enter search query..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="latest AI developments 2024" data-astro-cid-mluvns3u> </div> <button onclick="testTavily()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors" data-astro-cid-mluvns3u>
\u0111\u017A\u201D\u0164 Search with Tavily
</button> <div id="tavilyResults" class="mt-4 p-4 bg-gray-50 rounded-lg hidden" data-astro-cid-mluvns3u> <h3 class="font-semibold mb-2" data-astro-cid-mluvns3u>Search Results:</h3> <div id="tavilyContent" data-astro-cid-mluvns3u></div> </div> </div> <!-- DeepSeek + Kaggle Test --> <div class="bg-white rounded-lg shadow-lg p-6 mb-8 card-hover" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\u0111\u017A\xA7\xA0 DeepSeek + Kaggle Integration Test</h2> <div class="grid md:grid-cols-2 gap-4 mb-4" data-astro-cid-mluvns3u> <div data-astro-cid-mluvns3u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-mluvns3u>Dataset Search:</label> <input type="text" id="datasetQuery" placeholder="e.g., titanic, housing, covid..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" value="titanic" data-astro-cid-mluvns3u> </div> <div data-astro-cid-mluvns3u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-mluvns3u>Analysis Type:</label> <select id="analysisType" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" data-astro-cid-mluvns3u> <option value="quick" data-astro-cid-mluvns3u>Quick Analysis</option> <option value="detailed" data-astro-cid-mluvns3u>Detailed Analysis</option> <option value="ml" data-astro-cid-mluvns3u>ML Potential</option> <option value="custom" data-astro-cid-mluvns3u>Custom Prompt</option> </select> </div> </div> <div class="mb-4" data-astro-cid-mluvns3u> <textarea id="customPrompt" placeholder="Custom analysis prompt (only for Custom type)..." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 hidden" data-astro-cid-mluvns3u></textarea> </div> <div class="flex gap-4" data-astro-cid-mluvns3u> <button onclick="testDeepSeekKaggle()" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors" data-astro-cid-mluvns3u>
\u0111\u017A\xA7\xA0 Analyze with DeepSeek
</button> <button onclick="testConnections()" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors" data-astro-cid-mluvns3u>
\u0111\u017A\u201D\xA7 Test Connections
</button> </div> <div id="deepseekResults" class="mt-4 p-4 bg-gray-50 rounded-lg hidden" data-astro-cid-mluvns3u> <h3 class="font-semibold mb-2" data-astro-cid-mluvns3u>Analysis Results:</h3> <div id="deepseekContent" data-astro-cid-mluvns3u></div> </div> </div> <!-- Quick Actions --> <div class="bg-white rounded-lg shadow-lg p-6 card-hover" data-astro-cid-mluvns3u> <h2 class="text-2xl font-bold mb-4 text-gray-800" data-astro-cid-mluvns3u>\xE2\u0161\u02C7 Quick Actions</h2> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4" data-astro-cid-mluvns3u> <button onclick="quickDemo('popular-datasets')" class="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\u0160</div> <div class="font-semibold text-indigo-800" data-astro-cid-mluvns3u>Popular Datasets</div> </button> <button onclick="quickDemo('ai-news')" class="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\xB0</div> <div class="font-semibold text-green-800" data-astro-cid-mluvns3u>AI News</div> </button> <button onclick="quickDemo('ml-trends')" class="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u201C\x88</div> <div class="font-semibold text-orange-800" data-astro-cid-mluvns3u>ML Trends</div> </button> <button onclick="quickDemo('test-all')" class="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors" data-astro-cid-mluvns3u> <div class="text-2xl mb-2" data-astro-cid-mluvns3u>\u0111\u017A\u0161\u20AC</div> <div class="font-semibold text-red-800" data-astro-cid-mluvns3u>Test All</div> </button> </div> </div> </div> <script type="module">
        import DeepSeekKaggleIntegration from '/src/utils/deepseek-kaggle-integration.js';

        // Initialize DeepSeek integration
        const deepseekIntegration = new DeepSeekKaggleIntegration();

        // Make functions global
        window.testTavily = testTavily;
        window.testDeepSeekKaggle = testDeepSeekKaggle;
        window.testConnections = testConnections;
        window.quickDemo = quickDemo;

        // Show/hide custom prompt based on analysis type
        document.getElementById('analysisType').addEventListener('change', function() {
            const customPrompt = document.getElementById('customPrompt');
            if (this.value === 'custom') {
                customPrompt.classList.remove('hidden');
            } else {
                customPrompt.classList.add('hidden');
            }
        });

        async function testTavily() {
            const query = document.getElementById('tavilyQuery').value;
            const resultsDiv = document.getElementById('tavilyResults');
            const contentDiv = document.getElementById('tavilyContent');
            
            resultsDiv.classList.remove('hidden');
            contentDiv.innerHTML = '<div class="text-center py-4">\u0111\u017A\u201D\u0164 Searching...</div>';

            try {
                const response = await fetch('/api/test-tavily', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                const data = await response.json();
                
                if (data.success) {
                    contentDiv.innerHTML = \\\`
                        <div class="space-y-4">
                            \\\${data.results.map(result => \\\`
                                <div class="border-l-4 border-blue-500 pl-4">
                                    <h4 class="font-semibold text-blue-800">\\\${result.title}</h4>
                                    <p class="text-sm text-gray-600 mb-2">\\\${result.url}</p>
                                    <p class="text-gray-700">\\\${result.content.substring(0, 200)}...</p>
                                </div>
                            \\\`).join('')}
                        </div>
                    \\\`;
                } else {
                    contentDiv.innerHTML = \\\`<div class="text-red-600">Error: \\\${data.error}</div>\\\`;
                }
            } catch (error) {
                contentDiv.innerHTML = \\\`<div class="text-red-600">Error: \\\${error.message}</div>\\\`;
            }
        }

        async function testDeepSeekKaggle() {
            const dataset = document.getElementById('datasetQuery').value;
            const analysisType = document.getElementById('analysisType').value;
            const customPrompt = document.getElementById('customPrompt').value;
            const resultsDiv = document.getElementById('deepseekResults');
            const contentDiv = document.getElementById('deepseekContent');
            
            resultsDiv.classList.remove('hidden');
            contentDiv.innerHTML = '<div class="text-center py-4">\u0111\u017A\xA7\xA0 Analyzing...</div>';

            try {
                const response = await fetch('/api/test-deepseek-kaggle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dataset, analysisType, customPrompt })
                });

                const data = await response.json();
                
                if (data.success) {
                    contentDiv.innerHTML = \\\`
                        <div class="space-y-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-blue-800 mb-2">Dataset Info:</h4>
                                <p><strong>Name:</strong> \\\${data.dataset?.title || 'N/A'}</p>
                                <p><strong>Owner:</strong> \\\${data.dataset?.ownerName || 'N/A'}</p>
                                <p><strong>Size:</strong> \\\${data.dataset?.totalBytes || 'N/A'} bytes</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-purple-800 mb-2">DeepSeek Analysis:</h4>
                                <div class="whitespace-pre-wrap text-gray-700">\\\${data.analysis}</div>
                            </div>
                        </div>
                    \\\`;
                } else {
                    contentDiv.innerHTML = \\\`<div class="text-red-600">Error: \\\${data.error}</div>\\\`;
                }
            } catch (error) {
                contentDiv.innerHTML = \\\`<div class="text-red-600">Error: \\\${error.message}</div>\\\`;
            }
        }

        async function testConnections() {
            const resultsDiv = document.getElementById('deepseekResults');
            const contentDiv = document.getElementById('deepseekContent');
            
            resultsDiv.classList.remove('hidden');
            contentDiv.innerHTML = '<div class="text-center py-4">\u0111\u017A\u201D\xA7 Testing connections...</div>';

            try {
                const response = await fetch('/api/test-connections', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();
                
                contentDiv.innerHTML = \\\`
                    <div class="space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="p-4 rounded-lg \\\${data.deepseek ? 'bg-green-50' : 'bg-red-50'}">
                                <h4 class="font-semibold \\\${data.deepseek ? 'text-green-800' : 'text-red-800'} mb-2">
                                    \\\${data.deepseek ? '\xE2\u015B\u2026' : '\xE2\u0165\u015A'} DeepSeek AI
                                </h4>
                                <p class="text-sm">\\\${data.deepseekResponse || data.deepseekError || 'No response'}</p>
                            </div>
                            <div class="p-4 rounded-lg \\\${data.kaggle ? 'bg-green-50' : 'bg-red-50'}">
                                <h4 class="font-semibold \\\${data.kaggle ? 'text-green-800' : 'text-red-800'} mb-2">
                                    \\\${data.kaggle ? '\xE2\u015B\u2026' : '\xE2\u0165\u015A'} Kaggle API
                                </h4>
                                <p class="text-sm">\\\${data.kaggle ? 'Connection successful' : (data.kaggleError || 'Connection failed')}</p>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500">
                            Test completed at: \\\${data.timestamp}
                        </div>
                    </div>
                \\\`;
            } catch (error) {
                contentDiv.innerHTML = \\\`<div class="text-red-600">Error: \\\${error.message}</div>\\\`;
            }
        }

        async function quickDemo(type) {
            switch(type) {
                case 'popular-datasets':
                    document.getElementById('datasetQuery').value = 'popular';
                    document.getElementById('analysisType').value = 'quick';
                    await testDeepSeekKaggle();
                    break;
                case 'ai-news':
                    document.getElementById('tavilyQuery').value = 'latest AI breakthroughs 2024';
                    await testTavily();
                    break;
                case 'ml-trends':
                    document.getElementById('tavilyQuery').value = 'machine learning trends 2024';
                    await testTavily();
                    break;
                case 'test-all':
                    await testConnections();
                    setTimeout(async () => {
                        document.getElementById('tavilyQuery').value = 'AI integration test';
                        await testTavily();
                    }, 2000);
                    setTimeout(async () => {
                        document.getElementById('datasetQuery').value = 'titanic';
                        await testDeepSeekKaggle();
                    }, 4000);
                    break;
            }
        }
    <\/script> </body> </html>`])), renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-integrations-test.astro?astro&type=script&index=0&lang.ts"), renderHead());
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-integrations-test.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-integrations-test.astro";
const $$url = "/ai-integrations-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$AiIntegrationsTest,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
