const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/BgAnimation.D8DzOMfe.js","_astro/preload-helper.BlTxHScW.js","_astro/disclose-version.DsnmJJEf.js","_astro/legacy.kkaBD5aU.js","_astro/index.DIeogL5L.js","_astro/index-client.CI4zVHyS.js","_astro/template.BqTI6ysn.js","_astro/this.zW9sjCU0.js","_astro/lifecycle.CZxN27Pe.js","_astro/AIWorkersManager.t-EEUQCp.js","_astro/render.DLtPj5hE.js","_astro/if.CL3_9eW_.js","_astro/each.BgQDu70D.js","_astro/attributes.CMoobVFc.js","_astro/class.Cwo7PGLY.js","_astro/attributes.BJtm3mOD.js","_astro/input.BDyfk_mK.js","_astro/select.CpkoEXAE.js","_astro/event-modifiers.D4Caz1gY.js","_astro/ai-workers-manager.CBIZ3SFR.css"])))=>i.map(i=>d[i]);
import{_ as c}from"./preload-helper.BlTxHScW.js";window.openMCPModal=function(e){const o=document.getElementById("mcpModal"),n=document.getElementById("mcpModalTitle"),a=document.getElementById("mcpModalDescription"),t=document.getElementById("mcpModalCode"),l={duckdb:{title:"🗄️ DuckDB MCP Server",description:`
              <p><strong>DuckDB</strong> to zaawansowana baza danych analityczna w pamięci.</p>
              <p>🔹 <strong>Funkcje:</strong> SQL queries, analityka danych, zarządzanie tabelami</p>
              <p>🔹 <strong>Endpoint:</strong> <code>/api/mcp/duckdb</code></p>
              <p>🔹 <strong>Status:</strong> <span style="color: #00ff00">Połączony</span></p>
            `,code:`// Przykład zapytania DuckDB MCP
fetch('/api/mcp/duckdb', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'query',
    query: 'SELECT * FROM users LIMIT 5'
  })
})
.then(res => res.json())
.then(data => console.log(data));`},paypal:{title:"💳 PayPal MCP Server",description:`
              <p><strong>PayPal MCP</strong> do zarządzania płatnościami i fakturami.</p>
              <p>🔹 <strong>Funkcje:</strong> Tworzenie faktur, historia transakcji, płatności</p>
              <p>🔹 <strong>Endpoint:</strong> <code>/api/mcp/paypal</code></p>
              <p>🔹 <strong>Status:</strong> <span style="color: #ff9900">Wymaga konfiguracji</span></p>
            `,code:`// Przykład tworzenia faktury PayPal
fetch('/api/mcp/paypal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'create_invoice',
    amount: '100.00',
    currency: 'USD',
    business_email: 'your@email.com'
  })
})
.then(res => res.json())
.then(data => console.log(data));`},huggingface:{title:"🤗 HuggingFace MCP Server",description:`
              <p><strong>HuggingFace MCP</strong> do dostępu do modeli AI i zasobów.</p>
              <p>🔹 <strong>Funkcje:</strong> Modele AI, datasety, publikacje, aplikacje</p>
              <p>🔹 <strong>Endpoint:</strong> <code>/api/mcp/huggingface</code></p>
              <p>🔹 <strong>Status:</strong> <span style="color: #00ff00">Połączony</span></p>
            `,code:`// Przykład wyszukiwania modeli HuggingFace
fetch('/api/mcp/huggingface', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'search_models',
    query: 'text-generation',
    limit: 5
  })
})
.then(res => res.json())
.then(data => console.log(data));`},memory:{title:"🧠 Memory MCP Server",description:`
              <p><strong>Memory MCP</strong> to system grafu wiedzy do przechowywania kontekstu.</p>
              <p>🔹 <strong>Funkcje:</strong> Encje, relacje, wyszukiwanie, graf wiedzy</p>
              <p>🔹 <strong>Endpoint:</strong> <code>/api/mcp/memory</code></p>
              <p>🔹 <strong>Status:</strong> <span style="color: #00ff00">Połączony</span></p>
            `,code:`// Przykład tworzenia encji Memory
fetch('/api/mcp/memory', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operation: 'create_entity',
    entity_name: 'AI Technology',
    entity_type: 'concept',
    observations: ['Emerging field', 'Transformative impact']
  })
})
.then(res => res.json())
.then(data => console.log(data));`}}[e];l&&(n.textContent=l.title,a.innerHTML=l.description,t.textContent=l.code,o.classList.add("active"))};window.closeMCPModal=function(){document.getElementById("mcpModal").classList.remove("active")};document.addEventListener("keydown",function(e){e.key==="Escape"&&closeMCPModal()});(async function(){if("serviceWorker"in navigator)try{await navigator.serviceWorker.register("/sw.js"),console.log("✅ Service Worker registered")}catch(t){console.warn("⚠️ Service Worker registration failed:",t)}["/api/auth/status","/api/workers/status"].forEach(t=>{fetch(t,{method:"HEAD"}).catch(()=>{})});const n={".bg-animation":()=>c(()=>import("./BgAnimation.D8DzOMfe.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8])),".ai-workers-manager":()=>c(()=>import("./AIWorkersManager.t-EEUQCp.js"),__vite__mapDeps([9,2,3,4,5,6,10,11,12,13,14,15,16,17,18,8,19]))},a=new IntersectionObserver(t=>{t.forEach(async s=>{if(s.isIntersecting){const l=s.target.className.split(" ")[0],i=n[`.${l}`];if(i)try{await i(),a.unobserve(s.target)}catch(d){console.warn("Failed to lazy load component:",d)}}})},{threshold:.1,rootMargin:"50px"});Object.keys(n).forEach(t=>{document.querySelectorAll(t).forEach(l=>a.observe(l))}),window.addEventListener("load",()=>{setTimeout(()=>{const t=performance.now();console.log(`📊 Page load time: ${t.toFixed(2)}ms`),t>3e3&&console.warn("⚠️ Page load time exceeded 3 seconds")},0)}),window.addEventListener("beforeunload",()=>{a.disconnect()})})();window.toggleQuickWidgets=function(){console.log("🚀 Toggling Quick Widgets Panel");const e=document.getElementById("quick-widgets-panel"),o=document.getElementById("toggle-widgets");e&&o&&(o.style.transform="scale(1.1) translateY(-2px)",setTimeout(()=>{o.style.transform=""},200),e.classList.contains("hidden")?(e.classList.remove("hidden"),localStorage.setItem("quickWidgetsOpen","true"),console.log("🚀 Quick Widgets Panel opened - state saved")):(e.classList.add("hidden"),localStorage.setItem("quickWidgetsOpen","false"),console.log("🚀 Quick Widgets Panel closed - state saved")))};window.toggleGlobalMusicPlayer=function(){console.log("🎵 Toggling Global Music Player");const e=document.getElementById("globalMusicPlayerBtn"),o=document.getElementById("globalMusicPlayerWidget");e&&o&&(e.style.transform="scale(1.1) translateY(-2px)",setTimeout(()=>{e.style.transform=""},200),o.classList.contains("hidden")?(o.classList.remove("hidden"),localStorage.setItem("globalMusicPlayerOpen","true"),console.log("🎵 Global Music Player opened - state saved")):(o.classList.add("hidden"),localStorage.setItem("globalMusicPlayerOpen","false"),console.log("🎵 Global Music Player closed - state saved")))};window.toggleGlobalPolaczekAssistant=function(){console.log("🤖 Toggling Global AI Assistant");const e=document.getElementById("globalPolaczekBtn"),o=document.getElementById("globalPolaczekWidget");e&&o&&(e.style.transform="scale(1.1) translateY(-2px)",setTimeout(()=>{e.style.transform=""},200),o.classList.contains("hidden")?(o.classList.remove("hidden"),localStorage.setItem("globalPolaczekAssistantOpen","true"),console.log("🤖 Global AI Assistant opened - state saved")):(o.classList.add("hidden"),localStorage.setItem("globalPolaczekAssistantOpen","false"),console.log("🤖 Global AI Assistant closed - state saved")))};window.openGlobalMainChat=function(){console.log("💬 Opening Global Main Chat"),window.open("/chatbot","_blank")};window.openGlobalRefresh=function(){console.log("🔄 Global Refreshing page"),window.location.reload()};window.openGlobalFolder=function(){console.log("📂 Global Opening folder"),alert("Otwieranie lokalnego folderu jest zablokowane przez przeglądarki ze względów bezpieczeństwa.")};window.openGlobalClose=function(){console.log("❌ Global Closing tab");try{window.close()}catch{alert("Zamykanie karty może być zablokowane przez przeglądarkę.")}};window.restoreGlobalPanelStates=function(){console.log("🔄 Restoring global floating panel states from localStorage");const e=localStorage.getItem("quickWidgetsOpen")==="true",o=localStorage.getItem("globalMusicPlayerOpen")==="true",n=localStorage.getItem("globalPolaczekAssistantOpen")==="true";console.log("🚀 Quick Widgets Panel should be open:",e),console.log("🎵 Global Music Player should be open:",o),console.log("🤖 Global AI Assistant should be open:",n);const a=document.getElementById("quick-widgets-panel");a&&(e?(a.classList.remove("hidden"),console.log("🚀 Quick Widgets Panel restored to open state")):(a.classList.add("hidden"),console.log("🚀 Quick Widgets Panel restored to closed state")));const t=document.getElementById("globalMusicPlayerWidget");t&&(o?(t.classList.remove("hidden"),console.log("🎵 Global Music Player restored to open state")):(t.classList.add("hidden"),console.log("🎵 Global Music Player restored to closed state")));const s=document.getElementById("globalPolaczekWidget");s&&(n?(s.classList.remove("hidden"),console.log("🤖 Global AI Assistant restored to open state")):(s.classList.add("hidden"),console.log("🤖 Global AI Assistant restored to closed state")))};window.closeModal=function(){const e=document.getElementById("main-modal");e&&(e.style.display="none")};document.addEventListener("DOMContentLoaded",function(){console.log("🌐 Initializing global floating panels");const e=document.getElementById("globalMusicPlayerWidget"),o=document.getElementById("globalPolaczekWidget");e&&!e.classList.contains("hidden")&&e.classList.add("hidden"),o&&!o.classList.contains("hidden")&&o.classList.add("hidden"),setTimeout(()=>{typeof window.restoreGlobalPanelStates=="function"&&window.restoreGlobalPanelStates()},100),document.addEventListener("keydown",function(n){if(n.key==="Escape"){const a=document.getElementById("main-modal");a&&a.style.display!=="none"&&window.closeModal()}})});
