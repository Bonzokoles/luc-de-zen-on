if(typeof MessageChannel>"u"){class o{constructor(){this.onmessage=null}postMessage(t){const s={data:t};(typeof queueMicrotask=="function"?queueMicrotask:n=>setTimeout(n,0))(()=>this.onmessage&&this.onmessage(s))}start(){}close(){}}class e{constructor(){this.port1=new o,this.port2=new o;const t=(s,n)=>{const i={data:n};(typeof queueMicrotask=="function"?queueMicrotask:r=>setTimeout(r,0))(()=>s.onmessage&&s.onmessage(i))};this.port1.postMessage=s=>t(this.port2,s),this.port2.postMessage=s=>t(this.port1,s)}}globalThis.MessageChannel=e}class c{constructor(){this.agents=new Map,this.websocket=null,this.init()}async init(){this.setupEventListeners(),await this.connectWebSocket(),await this.loadAgents(),this.startStatusUpdates()}setupEventListeners(){document.getElementById("refresh-agents")?.addEventListener("click",()=>{this.loadAgents()}),document.getElementById("close-modal")?.addEventListener("click",()=>{this.hideModal()}),document.getElementById("modal-cancel")?.addEventListener("click",()=>{this.hideModal()})}async connectWebSocket(){try{const a=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/api/agents/websocket`;this.websocket=new WebSocket(a),this.websocket.onopen=()=>{console.log("WebSocket connected to agent system")},this.websocket.onmessage=t=>{const s=JSON.parse(t.data);this.handleWebSocketMessage(s)},this.websocket.onclose=()=>{console.log("WebSocket disconnected, retrying..."),setTimeout(()=>this.connectWebSocket(),5e3)}}catch(e){console.error("WebSocket connection error:",e)}}handleWebSocketMessage(e){switch(e.type){case"agent_status_update":this.updateAgentStatus(e.agent_name,e.status);break;case"system_stats":this.updateSystemStats(e.stats);break;case"agent_log":console.log(`[${e.agent_name}]`,e.message);break}}async loadAgents(){try{const a=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/list")).json();a.success&&(this.renderAgents(a.agents),this.updateSystemStats(a.system_stats))}catch(e){console.error("Error loading agents:",e)}}renderAgents(e){const a=document.getElementById("agents-grid");a&&(a.innerHTML=e.map(t=>`
          <div class="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full ${this.getStatusColor(t.status)}"></div>
                <h3 class="text-lg font-semibold text-white">${t.name}</h3>
              </div>
              <span class="text-xs px-2 py-1 rounded-full ${this.getTypeColor(t.type)}">${t.type}</span>
            </div>
            <p class="text-sm text-gray-400 mb-3">${t.description||"Brak opisu"}</p>
            <div class="text-xs text-gray-500 mb-3">
              <div>Status: ${t.status}</div>
              <div>Ostatnia aktywność: ${this.formatTime(t.last_activity)}</div>
              ${t.cpu_usage?`<div>CPU: ${t.cpu_usage}%</div>`:""}
            </div>
            <div class="flex space-x-2">
              <button 
                onclick="dashboard.controlAgent('${t.name}', '${t.status==="running"?"stop":"start"}')"
                class="flex-1 py-2 px-3 rounded text-xs font-medium transition-colors
                       ${t.status==="running"?"bg-red-600 hover:bg-red-500 text-white":"bg-green-600 hover:bg-green-500 text-white"}"
              >
                ${t.status==="running"?"⏹️ Stop":"▶️ Start"}
              </button>
              <button 
                onclick="dashboard.showAgentDetails('${t.name}')"
                class="py-2 px-3 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium text-white transition-colors"
              >
                📊 Szczegóły
              </button>
            </div>
          </div>
        `).join(""),this.updateSystemStats({total_agents:e.length,active_agents:e.filter(t=>t.status==="running").length}))}updateSystemStats(e){e.total_agents!==void 0&&(document.getElementById("total-agents").textContent=e.total_agents),e.active_agents!==void 0&&(document.getElementById("active-agents").textContent=e.active_agents),e.pending_tasks!==void 0&&(document.getElementById("pending-tasks").textContent=e.pending_tasks),e.system_health!==void 0&&(document.getElementById("system-health").textContent=`${e.system_health}%`)}async controlAgent(e,a){try{const s=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_name:e,action:a})})).json();s.success?(console.log(`Agent ${e} ${a} successful`),await this.loadAgents()):console.error(`Failed to ${a} agent ${e}:`,s.error)}catch(t){console.error(`Error controlling agent ${e}:`,t)}}showAgentDetails(e){this.showModal(`Szczegóły agenta: ${e}`,`
          <div class="space-y-3">
            <div>Ładowanie szczegółów agenta...</div>
            <div class="animate-pulse bg-gray-700 h-4 rounded w-3/4"></div>
            <div class="animate-pulse bg-gray-700 h-4 rounded w-1/2"></div>
          </div>
        `),this.loadAgentDetails(e)}async loadAgentDetails(e){try{const t=await(await fetch(`/POLACZEK_AGENT_SYS_23/api/agents/details/${e}`)).json();if(t.success){const s=t.agent;document.getElementById("modal-content").innerHTML=`
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-400">Nazwa:</label>
                  <div class="text-white">${s.name}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-400">Typ:</label>
                  <div class="text-white">${s.type}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-400">Status:</label>
                  <div class="text-white">${s.status}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-400">Ostatnia aktywność:</label>
                  <div class="text-white">${this.formatTime(s.last_activity)}</div>
                </div>
                ${s.memory_usage?`
                <div>
                  <label class="text-sm font-medium text-gray-400">Użycie pamięci:</label>
                  <div class="text-white">${s.memory_usage} MB</div>
                </div>
                `:""}
                ${s.messages_processed?`
                <div>
                  <label class="text-sm font-medium text-gray-400">Przetworzonych wiadomości:</label>
                  <div class="text-white">${s.messages_processed}</div>
                </div>
                `:""}
              </div>
            `}}catch(a){console.error("Error loading agent details:",a)}}showModal(e,a){document.getElementById("modal-title").textContent=e,document.getElementById("modal-content").innerHTML=a,document.getElementById("agent-modal").classList.remove("hidden")}hideModal(){document.getElementById("agent-modal").classList.add("hidden")}getStatusColor(e){switch(e){case"running":return"bg-green-500";case"stopped":return"bg-red-500";case"error":return"bg-orange-500";default:return"bg-gray-500"}}getTypeColor(e){switch(e){case"monitor":return"bg-red-500/20 text-red-300";case"translator":return"bg-blue-500/20 text-blue-300";case"searcher":return"bg-green-500/20 text-green-300";case"dashboard":return"bg-purple-500/20 text-purple-300";default:return"bg-gray-500/20 text-gray-300"}}formatTime(e){if(!e)return"Nieznany";try{return new Date(e).toLocaleString("pl-PL")}catch{return"Nieprawidłowy czas"}}startStatusUpdates(){setInterval(()=>{this.loadAgents()},3e4)}updateAgentStatus(e,a){const t=document.querySelector(`[data-agent="${e}"]`);if(t){const s=t.querySelector(".status-dot");s&&(s.className=`w-3 h-3 rounded-full ${this.getStatusColor(a)}`)}}}const d=new c;window.dashboard=d;
