if(typeof MessageChannel>"u"){class t{constructor(){this.onmessage=null}postMessage(a){const o={data:a};(typeof queueMicrotask=="function"?queueMicrotask:n=>setTimeout(n,0))(()=>this.onmessage&&this.onmessage(o))}start(){}close(){}}class i{constructor(){this.port1=new t,this.port2=new t;const a=(o,n)=>{const s={data:n};(typeof queueMicrotask=="function"?queueMicrotask:c=>setTimeout(c,0))(()=>o.onmessage&&o.onmessage(s))};this.port1.postMessage=o=>a(this.port2,o),this.port2.postMessage=o=>a(this.port1,o)}}globalThis.MessageChannel=i}let l=[];async function u(){console.log("Refreshing all workers status...");try{const t=await fetch("/api/workers-status");if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);l=await t.json(),console.log("Workers data loaded:",l),p(),g()}catch(t){console.error("Failed to refresh workers status:",t),m("Nie udało się odświeżyć statusu workerów")}}function p(){const t=document.getElementById("workersContainer"),i=document.getElementById("loadingIndicator");t&&(i&&(i.style.display="none"),t.innerHTML="",l.forEach((e,a)=>{const o=document.createElement("div");o.className="worker-detailed-card";let n="⚙️";const s=e.name.toLowerCase();s.includes("image")||s.includes("flux")?n="🎨":s.includes("ai")||s.includes("bot")||s.includes("chatbot")?n="🤖":s.includes("bigquery")||s.includes("analytics")?n="📊":s.includes("kaggle")?n="🏆":s.includes("tavily")||s.includes("search")?n="🔍":s.includes("pdf")?n="📄":s.includes("news")?n="📰":s.includes("google")&&(n="🔍"),o.innerHTML=`
        <div class="worker-main-info">
          <div class="worker-icon">${n}</div>
          <div class="worker-details">
            <h3 class="worker-name">${e.name}</h3>
            <p class="worker-description">${e.description||"AI Worker"}</p>
            <div class="worker-endpoints">
              <span class="endpoint-tag">${e.endpoint}</span>
            </div>
          </div>
          <div class="worker-status-indicator">
            <div class="status-badge ${e.status}">${e.status.toUpperCase()}</div>
            <div class="uptime">${e.uptime}</div>
          </div>
        </div>

        <div class="worker-metrics">
          <div class="metric">
            <label>CPU:</label>
            <span>${e.cpu}%</span>
          </div>
          <div class="metric">
            <label>RAM:</label>
            <span>${e.ram}%</span>
          </div>
          <div class="metric">
            <label>Requests (24h):</label>
            <span>${e.requests}</span>
          </div>
          <div class="metric">
            <label>Avg. Response:</label>
            <span>${e.responseMs}ms</span>
          </div>
        </div>

        <div class="worker-actions">
          <button onclick="buyWorkerTokens('${e.name}')" class="btn-primary">
            Kup tokeny
          </button>
          <button onclick="configureWorker('${e.name}')" class="btn-secondary">
            Konfiguruj
          </button>
          <button onclick="viewWorkerLogs('${e.name}')" class="btn-tertiary">
            Logi
          </button>
        </div>
      `,t.appendChild(o)}))}function g(){const t=l.length,i=l.filter(r=>r.status==="online").length,e=Math.round(l.reduce((r,d)=>r+(d.responseMs||0),0)/t),a=l.reduce((r,d)=>r+d.requests,0),o=document.getElementById("totalWorkers"),n=document.getElementById("onlineWorkers"),s=document.getElementById("avgResponse"),c=document.getElementById("totalRequests");o&&(o.textContent=t.toString()),n&&(n.textContent=i.toString()),s&&(s.textContent=`${e}ms`),c&&(c.textContent=a.toString())}function m(t){const i=document.createElement("div");i.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `,i.textContent=t,document.body.appendChild(i),setTimeout(()=>{document.body.removeChild(i)},5e3)}document.addEventListener("DOMContentLoaded",async()=>{console.log("Workers Status page loaded"),await u(),setInterval(u,3e4)});
