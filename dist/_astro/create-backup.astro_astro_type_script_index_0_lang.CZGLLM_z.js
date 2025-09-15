if(typeof MessageChannel>"u"){class o{constructor(){this.onmessage=null}postMessage(t){const s={data:t};(typeof queueMicrotask=="function"?queueMicrotask:n=>setTimeout(n,0))(()=>this.onmessage&&this.onmessage(s))}start(){}close(){}}class e{constructor(){this.port1=new o,this.port2=new o;const t=(s,n)=>{const i={data:n};(typeof queueMicrotask=="function"?queueMicrotask:r=>setTimeout(r,0))(()=>s.onmessage&&s.onmessage(i))};this.port1.postMessage=s=>t(this.port2,s),this.port2.postMessage=s=>t(this.port1,s)}}globalThis.MessageChannel=e}class d{constructor(){this.init()}init(){this.setupEventListeners(),this.setupFormValidation()}setupEventListeners(){document.getElementById("agent-creation-form").addEventListener("submit",t=>{t.preventDefault(),this.createAgent()}),document.getElementById("preview-agent").addEventListener("click",()=>{this.showPreview()}),document.getElementById("close-preview").addEventListener("click",()=>{this.hideModal("preview-modal")}),document.getElementById("close-preview-btn").addEventListener("click",()=>{this.hideModal("preview-modal")}),document.getElementById("goto-dashboard").addEventListener("click",()=>{window.location.href="/POLACZEK_AGENT_SYS_23/dashboard"}),document.getElementById("create-another").addEventListener("click",()=>{this.hideModal("success-modal"),this.resetForm()});const e=document.getElementById("temperature"),a=document.getElementById("temp-value");e?.addEventListener("input",()=>{a.textContent=e.value}),document.getElementById("agent-type").addEventListener("change",t=>{this.updateConfigForType(t.target.value)})}setupFormValidation(){document.getElementById("agent-name")?.addEventListener("input",t=>{t.target.value=t.target.value.replace(/[^a-zA-Z0-9_-]/g,"")}),document.getElementById("agent-port")?.addEventListener("input",t=>{const s=parseInt(t.target.value);s&&(s<3e3||s>9999)?t.target.setCustomValidity("Port musi być między 3000 a 9999"):t.target.setCustomValidity("")})}updateConfigForType(e){const a=document.getElementById("system-prompt"),t={chatbot:"Jesteś przyjaznym i pomocnym asystentem AI. Odpowiadaj w sposób naturalny i profesjonalny. Zawsze staraj się być pomocny i dokładny.",translator:"Jesteś ekspertem w tłumaczeniu języków. Tłumacz tekst dokładnie zachowując kontekst i ton wypowiedzi.",searcher:"Jesteś specjalistą od wyszukiwania informacji. Znajdź najbardziej aktualne i wiarygodne informacje na zadany temat.",monitor:"Jesteś agentem monitorującym system. Analizuj metryki i alarmuj o problemach. Bądź precyzyjny w raportowaniu.",artist:"Jesteś kreatywnym asystentem AI specjalizującym się w generowaniu obrazów i sztuki. Twórz szczegółowe prompty dla AI.",analyst:"Jesteś analitykiem danych. Analizuj informacje, twórz raporty i wyciągaj wnioski z dostępnych danych.",writer:"Jesteś profesjonalnym pisarzem. Twórz wysokiej jakości treści dopasowane do stylu i celu.",coder:"Jesteś doświadczonym programistą. Pomagaj w pisaniu, debugowaniu i optymalizacji kodu.",scheduler:"Jesteś zarządcą zadań i harmonogramów. Organizuj i planuj działania w sposób efektywny."};t[e]&&(a.value=t[e]);const s=document.getElementById("agent-port"),n={chatbot:3011,translator:3012,searcher:3013,monitor:3014,artist:3015,analyst:3016,writer:3017,coder:3018,scheduler:3019,custom:3020};n[e]&&(s.placeholder=n[e].toString())}getFormData(){const e=document.getElementById("agent-creation-form"),a=new FormData(e),t={};for(let[s,n]of a.entries())s==="capabilities"?(t.capabilities||(t.capabilities=[]),t.capabilities.push(n)):t[s]=n;return t.auto_start=e.querySelector('[name="auto_start"]')?.checked||!1,t.logging_enabled=e.querySelector('[name="logging_enabled"]')?.checked||!1,t.monitoring_enabled=e.querySelector('[name="monitoring_enabled"]')?.checked||!1,t.port=t.port||this.generatePortFromName(t.name),t.max_memory=t.max_memory||"512",t.timeout=t.timeout||"30",t.temperature=parseFloat(t.temperature||"0.7"),t}generatePortFromName(e){let a=0;for(let t=0;t<e.length;t++){const s=e.charCodeAt(t);a=(a<<5)-a+s,a=a&a}return Math.abs(a%1e3)+3e3}showPreview(){const e=this.getFormData(),a=document.getElementById("preview-content");a.innerHTML=`
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong class="text-cyan-400">Nazwa:</strong>
                <div>${e.name||"Nie podano"}</div>
              </div>
              <div>
                <strong class="text-cyan-400">Typ:</strong>
                <div>${e.type||"Nie wybrano"}</div>
              </div>
            </div>
            
            <div>
              <strong class="text-cyan-400">Opis:</strong>
              <div>${e.description||"Brak opisu"}</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong class="text-cyan-400">Port:</strong>
                <div>${e.port}</div>
              </div>
              <div>
                <strong class="text-cyan-400">Język:</strong>
                <div>${e.language||"python"}</div>
              </div>
            </div>

            ${e.capabilities&&e.capabilities.length>0?`
            <div>
              <strong class="text-cyan-400">Możliwości:</strong>
              <div class="flex flex-wrap gap-2 mt-1">
                ${e.capabilities.map(t=>`<span class="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">${t.replace("_"," ")}</span>`).join("")}
              </div>
            </div>
            `:""}

            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong class="text-cyan-400">Model AI:</strong>
                <div>${e.ai_model||"gpt-4"}</div>
              </div>
              <div>
                <strong class="text-cyan-400">Temperatura:</strong>
                <div>${e.temperature}</div>
              </div>
            </div>

            ${e.system_prompt?`
            <div>
              <strong class="text-cyan-400">System Prompt:</strong>
              <div class="bg-gray-800 p-3 rounded mt-1 text-sm">${e.system_prompt}</div>
            </div>
            `:""}

            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <strong class="text-cyan-400">Auto Start:</strong>
                <div>${e.auto_start?"✅ Tak":"❌ Nie"}</div>
              </div>
              <div>
                <strong class="text-cyan-400">Logowanie:</strong>
                <div>${e.logging_enabled?"✅ Tak":"❌ Nie"}</div>
              </div>
              <div>
                <strong class="text-cyan-400">Monitoring:</strong>
                <div>${e.monitoring_enabled?"✅ Tak":"❌ Nie"}</div>
              </div>
            </div>
          </div>
        `,this.showModal("preview-modal")}async createAgent(){const e=this.getFormData();if(!e.name||!e.type||!e.description){alert("Wypełnij wszystkie wymagane pola!");return}try{const t=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();t.success?this.showSuccess(t):alert(`Błąd podczas tworzenia agenta: ${t.error||t.message}`)}catch(a){console.error("Error creating agent:",a),alert("Wystąpił błąd podczas tworzenia agenta. Spróbuj ponownie.")}}showSuccess(e){const a=document.getElementById("success-content");a.innerHTML=`
          <div class="text-left space-y-2">
            <p><strong>Nazwa:</strong> ${e.agent_name}</p>
            <p><strong>Typ:</strong> ${e.agent_type}</p>
            <p><strong>Port:</strong> ${e.port}</p>
            ${e.config_file?`<p><strong>Plik konfiguracyjny:</strong> ${e.config_file}</p>`:""}
          </div>
        `,this.showModal("success-modal")}showModal(e){document.getElementById(e).classList.remove("hidden")}hideModal(e){document.getElementById(e).classList.add("hidden")}resetForm(){document.getElementById("agent-creation-form").reset(),document.getElementById("temp-value").textContent="0.7"}}new d;
