const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/BgAnimation.DWmXBUkD.js","_astro/babylon-core.25e42Jml.js","_astro/ClientRouter.astro_astro_type_script_index_0_lang.DtH6aRN_.js","_astro/react.BKEw5ZbO.js","_astro/AIWorkersManager.oeOKwmPF.js","_astro/ai-workers-manager.CBIZ3SFR.css"])))=>i.map(i=>d[i]);
import{_ as c}from"./babylon-core.25e42Jml.js";if(typeof MessageChannel>"u"){class a{constructor(){this.onmessage=null}postMessage(o){const e={data:o};(typeof queueMicrotask=="function"?queueMicrotask:n=>setTimeout(n,0))(()=>this.onmessage&&this.onmessage(e))}start(){}close(){}}class r{constructor(){this.port1=new a,this.port2=new a;const o=(e,n)=>{const t={data:n};(typeof queueMicrotask=="function"?queueMicrotask:i=>setTimeout(i,0))(()=>e.onmessage&&e.onmessage(t))};this.port1.postMessage=e=>o(this.port2,e),this.port2.postMessage=e=>o(this.port1,e)}}globalThis.MessageChannel=r}window.openMCPModal=function(a){const r=document.getElementById("mcpModal"),s=document.getElementById("mcpModalTitle"),o=document.getElementById("mcpModalDescription"),e=document.getElementById("mcpModalCode"),t={duckdb:{title:"🗄️ DuckDB MCP Server",description:`
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
.then(data => console.log(data));`}}[a];t&&(s.textContent=t.title,o.innerHTML=t.description,e.textContent=t.code,r.classList.add("active"))};window.closeMCPModal=function(){document.getElementById("mcpModal").classList.remove("active")};document.addEventListener("keydown",function(a){a.key==="Escape"&&closeMCPModal()});(async function(){if("serviceWorker"in navigator)try{await navigator.serviceWorker.register("/sw.js"),console.log("✅ Service Worker registered")}catch(e){console.warn("⚠️ Service Worker registration failed:",e)}["/api/auth/status","/api/workers/status"].forEach(e=>{fetch(e,{method:"HEAD"}).catch(()=>{})});const s={".bg-animation":()=>c(()=>import("./BgAnimation.DWmXBUkD.js"),__vite__mapDeps([0,1,2,3])),".ai-workers-manager":()=>c(()=>import("./AIWorkersManager.oeOKwmPF.js"),__vite__mapDeps([4,2,3,5]))},o=new IntersectionObserver(e=>{e.forEach(async n=>{if(n.isIntersecting){const t=n.target.className.split(" ")[0],i=s[`.${t}`];if(i)try{await i(),o.unobserve(n.target)}catch(p){console.warn("Failed to lazy load component:",p)}}})},{threshold:.1,rootMargin:"50px"});Object.keys(s).forEach(e=>{document.querySelectorAll(e).forEach(t=>o.observe(t))}),window.addEventListener("load",()=>{setTimeout(()=>{const e=performance.now();console.log(`📊 Page load time: ${e.toFixed(2)}ms`),e>3e3&&console.warn("⚠️ Page load time exceeded 3 seconds")},0)}),window.addEventListener("beforeunload",()=>{o.disconnect()})})();
