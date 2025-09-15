if(typeof MessageChannel>"u"){class t{constructor(){this.onmessage=null}postMessage(a){const s={data:a};(typeof queueMicrotask=="function"?queueMicrotask:o=>setTimeout(o,0))(()=>this.onmessage&&this.onmessage(s))}start(){}close(){}}class n{constructor(){this.port1=new t,this.port2=new t;const a=(s,o)=>{const l={data:o};(typeof queueMicrotask=="function"?queueMicrotask:d=>setTimeout(d,0))(()=>s.onmessage&&s.onmessage(l))};this.port1.postMessage=s=>a(this.port2,s),this.port2.postMessage=s=>a(this.port1,s)}}globalThis.MessageChannel=n}let r=[],i=null;async function c(){try{document.getElementById("loading-message").textContent="Ładowanie agentów...";const n=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/list")).json();if(n.success)r=n.agents||[],u(),m(),i=new Date,document.getElementById("last-update").textContent=i.toLocaleTimeString();else throw new Error(n.error||"Błąd ładowania agentów")}catch(t){console.error("Error loading agents:",t),document.getElementById("agents-container").innerHTML=`
          <div class="text-center text-red-400 py-8">
            ❌ Błąd ładowania agentów: ${t.message}
            <br><button onclick="loadAgents()" class="mt-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500" style="border-radius: 0;">Spróbuj ponownie</button>
          </div>
        `}}function u(){const t=document.getElementById("agents-container");if(r.length===0){t.innerHTML=`
          <div class="text-center text-gray-400 py-8">
            📭 Brak aktywnych agentów
            <br><a href="/POLACZEK_AGENT_SYS_23/agents/create" class="mt-2 inline-block px-4 py-2 bg-green-600 text-white hover:bg-green-500" style="border-radius: 0;">Stwórz pierwszego agenta</a>
          </div>
        `;return}const n=r.map(e=>`
        <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid white; border-radius: 0; padding: 1rem; margin-bottom: 1rem;">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg font-bold text-white">${e.name}</span>
                <span class="px-2 py-1 text-xs font-bold ${g(e.status)}" style="border-radius: 0;">
                  ${p(e.status)}
                </span>
                <span class="px-2 py-1 text-xs bg-gray-600 text-white" style="border-radius: 0;">
                  ${e.type}
                </span>
              </div>
              <p class="text-gray-300 text-sm mb-2">${e.description}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div class="text-gray-400">CPU: <span class="text-white">${e.cpu_usage}%</span></div>
                <div class="text-gray-400">RAM: <span class="text-white">${e.memory_usage}MB</span></div>
                <div class="text-gray-400">Wiadomości: <span class="text-white">${e.messages_processed}</span></div>
                <div class="text-gray-400">Błędy: <span class="text-white">${e.errors_count}</span></div>
              </div>
            </div>
            <div class="flex gap-2 ml-4">
              ${x(e)}
            </div>
          </div>
        </div>
      `).join("");t.innerHTML=n}function g(t){switch(t){case"running":return"bg-green-600 text-white";case"stopped":return"bg-red-600 text-white";case"starting":return"bg-yellow-600 text-white";case"error":return"bg-red-700 text-white";default:return"bg-gray-600 text-white"}}function p(t){switch(t){case"running":return"DZIAŁA";case"stopped":return"ZATRZYMANY";case"starting":return"URUCHAMIA";case"error":return"BŁĄD";default:return t.toUpperCase()}}function x(t){return t.status==="running"?`
          <button onclick="controlAgent('${t.name}', 'stop')" 
                  class="px-3 py-1 bg-red-600 text-white hover:bg-red-500 text-xs" 
                  style="border-radius: 0;">STOP</button>
          <button onclick="controlAgent('${t.name}', 'restart')" 
                  class="px-3 py-1 bg-yellow-600 text-white hover:bg-yellow-500 text-xs" 
                  style="border-radius: 0;">RESTART</button>
        `:`
          <button onclick="controlAgent('${t.name}', 'start')" 
                  class="px-3 py-1 bg-green-600 text-white hover:bg-green-500 text-xs" 
                  style="border-radius: 0;">START</button>
          <button onclick="controlAgent('${t.name}', 'kill')" 
                  class="px-3 py-1 bg-red-700 text-white hover:bg-red-600 text-xs" 
                  style="border-radius: 0;">USUŃ</button>
        `}function m(){const t=r.filter(s=>s.status==="running").length,n=r.reduce((s,o)=>s+(o.messages_processed||0),0),e=r.reduce((s,o)=>s+(o.errors_count||0),0),a=r.length>0?Math.round(t/r.length*100):100;document.getElementById("active-agents").textContent=t,document.getElementById("total-messages").textContent=n.toLocaleString(),document.getElementById("error-count").textContent=e,document.getElementById("system-health").textContent=a+"%"}function b(){setInterval(()=>{document.visibilityState==="visible"&&c()},3e4)}document.addEventListener("DOMContentLoaded",function(){c(),b()});
