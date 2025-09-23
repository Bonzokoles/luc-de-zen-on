let s=[],o=null;async function i(){try{document.getElementById("loading-message").textContent="Ĺadowanie agentĂłw...";const n=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/list")).json();if(n.success)s=n.agents||[],d(),x(),o=new Date,document.getElementById("last-update").textContent=o.toLocaleTimeString();else throw new Error(n.error||"BĹ‚Ä…d Ĺ‚adowania agentĂłw")}catch(t){console.error("Error loading agents:",t),document.getElementById("agents-container").innerHTML=`
          <div class="text-center text-red-400 py-8">
            âťŚ BĹ‚Ä…d Ĺ‚adowania agentĂłw: ${t.message}
            <br><button onclick="loadAgents()" class="mt-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500" style="border-radius: 0;">SprĂłbuj ponownie</button>
          </div>
        `}}function d(){const t=document.getElementById("agents-container");if(s.length===0){t.innerHTML=`
          <div class="text-center text-gray-400 py-8">
            đź“­ Brak aktywnych agentĂłw
            <br><a href="/POLACZEK_AGENT_SYS_23/agents/create" class="mt-2 inline-block px-4 py-2 bg-green-600 text-white hover:bg-green-500" style="border-radius: 0;">StwĂłrz pierwszego agenta</a>
          </div>
        `;return}const n=s.map(e=>`
        <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid white; border-radius: 0; padding: 1rem; margin-bottom: 1rem;">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg font-bold text-white">${e.name}</span>
                <span class="px-2 py-1 text-xs font-bold ${l(e.status)}" style="border-radius: 0;">
                  ${g(e.status)}
                </span>
                <span class="px-2 py-1 text-xs bg-gray-600 text-white" style="border-radius: 0;">
                  ${e.type}
                </span>
              </div>
              <p class="text-gray-300 text-sm mb-2">${e.description}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div class="text-gray-400">CPU: <span class="text-white">${e.cpu_usage}%</span></div>
                <div class="text-gray-400">RAM: <span class="text-white">${e.memory_usage}MB</span></div>
                <div class="text-gray-400">WiadomoĹ›ci: <span class="text-white">${e.messages_processed}</span></div>
                <div class="text-gray-400">BĹ‚Ä™dy: <span class="text-white">${e.errors_count}</span></div>
              </div>
            </div>
            <div class="flex gap-2 ml-4">
              ${u(e)}
            </div>
          </div>
        </div>
      `).join("");t.innerHTML=n}function l(t){switch(t){case"running":return"bg-green-600 text-white";case"stopped":return"bg-red-600 text-white";case"starting":return"bg-yellow-600 text-white";case"error":return"bg-red-700 text-white";default:return"bg-gray-600 text-white"}}function g(t){switch(t){case"running":return"DZIAĹA";case"stopped":return"ZATRZYMANY";case"starting":return"URUCHAMIA";case"error":return"BĹÄ„D";default:return t.toUpperCase()}}function u(t){return t.status==="running"?`
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
                  style="border-radius: 0;">USUĹ</button>
        `}function x(){const t=s.filter(r=>r.status==="running").length,n=s.reduce((r,a)=>r+(a.messages_processed||0),0),e=s.reduce((r,a)=>r+(a.errors_count||0),0),c=s.length>0?Math.round(t/s.length*100):100;document.getElementById("active-agents").textContent=t,document.getElementById("total-messages").textContent=n.toLocaleString(),document.getElementById("error-count").textContent=e,document.getElementById("system-health").textContent=c+"%"}function p(){setInterval(()=>{document.visibilityState==="visible"&&i()},3e4)}document.addEventListener("DOMContentLoaded",function(){i(),p()});
