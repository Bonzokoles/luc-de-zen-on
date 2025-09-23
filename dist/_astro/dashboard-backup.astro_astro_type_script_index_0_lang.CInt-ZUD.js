class n{constructor(){this.agents=new Map,this.websocket=null,this.init()}async init(){this.setupEventListeners(),await this.connectWebSocket(),await this.loadAgents(),this.startStatusUpdates()}setupEventListeners(){document.getElementById("refresh-agents")?.addEventListener("click",()=>{this.loadAgents()}),document.getElementById("close-modal")?.addEventListener("click",()=>{this.hideModal()}),document.getElementById("modal-cancel")?.addEventListener("click",()=>{this.hideModal()})}async connectWebSocket(){try{const s=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/api/agents/websocket`;this.websocket=new WebSocket(s),this.websocket.onopen=()=>{console.log("WebSocket connected to agent system")},this.websocket.onmessage=e=>{const a=JSON.parse(e.data);this.handleWebSocketMessage(a)},this.websocket.onclose=()=>{console.log("WebSocket disconnected, retrying..."),setTimeout(()=>this.connectWebSocket(),5e3)}}catch(t){console.error("WebSocket connection error:",t)}}handleWebSocketMessage(t){switch(t.type){case"agent_status_update":this.updateAgentStatus(t.agent_name,t.status);break;case"system_stats":this.updateSystemStats(t.stats);break;case"agent_log":console.log(`[${t.agent_name}]`,t.message);break}}async loadAgents(){try{const s=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/list")).json();s.success&&(this.renderAgents(s.agents),this.updateSystemStats(s.system_stats))}catch(t){console.error("Error loading agents:",t)}}renderAgents(t){const s=document.getElementById("agents-grid");s&&(s.innerHTML=t.map(e=>`
          <div class="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full ${this.getStatusColor(e.status)}"></div>
                <h3 class="text-lg font-semibold text-white">${e.name}</h3>
              </div>
              <span class="text-xs px-2 py-1 rounded-full ${this.getTypeColor(e.type)}">${e.type}</span>
            </div>
            <p class="text-sm text-gray-400 mb-3">${e.description||"Brak opisu"}</p>
            <div class="text-xs text-gray-500 mb-3">
              <div>Status: ${e.status}</div>
              <div>Ostatnia aktywnoĹ›Ä‡: ${this.formatTime(e.last_activity)}</div>
              ${e.cpu_usage?`<div>CPU: ${e.cpu_usage}%</div>`:""}
            </div>
            <div class="flex space-x-2">
              <button 
                onclick="dashboard.controlAgent('${e.name}', '${e.status==="running"?"stop":"start"}')"
                class="flex-1 py-2 px-3 rounded text-xs font-medium transition-colors
                       ${e.status==="running"?"bg-red-600 hover:bg-red-500 text-white":"bg-green-600 hover:bg-green-500 text-white"}"
              >
                ${e.status==="running"?"âŹąď¸Ź Stop":"â–¶ď¸Ź Start"}
              </button>
              <button 
                onclick="dashboard.showAgentDetails('${e.name}')"
                class="py-2 px-3 bg-blue-600 hover:bg-blue-500 rounded text-xs font-medium text-white transition-colors"
              >
                đź“Š SzczegĂłĹ‚y
              </button>
            </div>
          </div>
        `).join(""),this.updateSystemStats({total_agents:t.length,active_agents:t.filter(e=>e.status==="running").length}))}updateSystemStats(t){t.total_agents!==void 0&&(document.getElementById("total-agents").textContent=t.total_agents),t.active_agents!==void 0&&(document.getElementById("active-agents").textContent=t.active_agents),t.pending_tasks!==void 0&&(document.getElementById("pending-tasks").textContent=t.pending_tasks),t.system_health!==void 0&&(document.getElementById("system-health").textContent=`${t.system_health}%`)}async controlAgent(t,s){try{const a=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({agent_name:t,action:s})})).json();a.success?(console.log(`Agent ${t} ${s} successful`),await this.loadAgents()):console.error(`Failed to ${s} agent ${t}:`,a.error)}catch(e){console.error(`Error controlling agent ${t}:`,e)}}showAgentDetails(t){this.showModal(`SzczegĂłĹ‚y agenta: ${t}`,`
          <div class="space-y-3">
            <div>Ĺadowanie szczegĂłĹ‚Ăłw agenta...</div>
            <div class="animate-pulse bg-gray-700 h-4 rounded w-3/4"></div>
            <div class="animate-pulse bg-gray-700 h-4 rounded w-1/2"></div>
          </div>
        `),this.loadAgentDetails(t)}async loadAgentDetails(t){try{const e=await(await fetch(`/POLACZEK_AGENT_SYS_23/api/agents/details/${t}`)).json();if(e.success){const a=e.agent;document.getElementById("modal-content").innerHTML=`
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-400">Nazwa:</label>
                  <div class="text-white">${a.name}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-400">Typ:</label>
                  <div class="text-white">${a.type}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-400">Status:</label>
                  <div class="text-white">${a.status}</div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-400">Ostatnia aktywnoĹ›Ä‡:</label>
                  <div class="text-white">${this.formatTime(a.last_activity)}</div>
                </div>
                ${a.memory_usage?`
                <div>
                  <label class="text-sm font-medium text-gray-400">UĹĽycie pamiÄ™ci:</label>
                  <div class="text-white">${a.memory_usage} MB</div>
                </div>
                `:""}
                ${a.messages_processed?`
                <div>
                  <label class="text-sm font-medium text-gray-400">Przetworzonych wiadomoĹ›ci:</label>
                  <div class="text-white">${a.messages_processed}</div>
                </div>
                `:""}
              </div>
            `}}catch(s){console.error("Error loading agent details:",s)}}showModal(t,s){document.getElementById("modal-title").textContent=t,document.getElementById("modal-content").innerHTML=s,document.getElementById("agent-modal").classList.remove("hidden")}hideModal(){document.getElementById("agent-modal").classList.add("hidden")}getStatusColor(t){switch(t){case"running":return"bg-green-500";case"stopped":return"bg-red-500";case"error":return"bg-orange-500";default:return"bg-gray-500"}}getTypeColor(t){switch(t){case"monitor":return"bg-red-500/20 text-red-300";case"translator":return"bg-blue-500/20 text-blue-300";case"searcher":return"bg-green-500/20 text-green-300";case"dashboard":return"bg-purple-500/20 text-purple-300";default:return"bg-gray-500/20 text-gray-300"}}formatTime(t){if(!t)return"Nieznany";try{return new Date(t).toLocaleString("pl-PL")}catch{return"NieprawidĹ‚owy czas"}}startStatusUpdates(){setInterval(()=>{this.loadAgents()},3e4)}updateAgentStatus(t,s){const e=document.querySelector(`[data-agent="${t}"]`);if(e){const a=e.querySelector(".status-dot");a&&(a.className=`w-3 h-3 rounded-full ${this.getStatusColor(s)}`)}}}const o=new n;window.dashboard=o;
