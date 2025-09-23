class s{constructor(){this.init()}init(){this.setupEventListeners(),this.setupFormValidation()}setupEventListeners(){document.getElementById("agent-creation-form").addEventListener("submit",t=>{t.preventDefault(),this.createAgent()}),document.getElementById("preview-agent").addEventListener("click",()=>{this.showPreview()}),document.getElementById("close-preview").addEventListener("click",()=>{this.hideModal("preview-modal")}),document.getElementById("close-preview-btn").addEventListener("click",()=>{this.hideModal("preview-modal")}),document.getElementById("goto-dashboard").addEventListener("click",()=>{window.location.href="/POLACZEK_AGENT_SYS_23/dashboard"}),document.getElementById("create-another").addEventListener("click",()=>{this.hideModal("success-modal"),this.resetForm()});const e=document.getElementById("temperature"),a=document.getElementById("temp-value");e?.addEventListener("input",()=>{a.textContent=e.value}),document.getElementById("agent-type").addEventListener("change",t=>{this.updateConfigForType(t.target.value)})}setupFormValidation(){document.getElementById("agent-name")?.addEventListener("input",t=>{t.target.value=t.target.value.replace(/[^a-zA-Z0-9_-]/g,"")}),document.getElementById("agent-port")?.addEventListener("input",t=>{const n=parseInt(t.target.value);n&&(n<3e3||n>9999)?t.target.setCustomValidity("Port musi byÄ‡ miÄ™dzy 3000 a 9999"):t.target.setCustomValidity("")})}updateConfigForType(e){const a=document.getElementById("system-prompt"),t={chatbot:"JesteĹ› przyjaznym i pomocnym asystentem AI. Odpowiadaj w sposĂłb naturalny i profesjonalny. Zawsze staraj siÄ™ byÄ‡ pomocny i dokĹ‚adny.",translator:"JesteĹ› ekspertem w tĹ‚umaczeniu jÄ™zykĂłw. TĹ‚umacz tekst dokĹ‚adnie zachowujÄ…c kontekst i ton wypowiedzi.",searcher:"JesteĹ› specjalistÄ… od wyszukiwania informacji. ZnajdĹş najbardziej aktualne i wiarygodne informacje na zadany temat.",monitor:"JesteĹ› agentem monitorujÄ…cym system. Analizuj metryki i alarmuj o problemach. BÄ…dĹş precyzyjny w raportowaniu.",artist:"JesteĹ› kreatywnym asystentem AI specjalizujÄ…cym siÄ™ w generowaniu obrazĂłw i sztuki. TwĂłrz szczegĂłĹ‚owe prompty dla AI.",analyst:"JesteĹ› analitykiem danych. Analizuj informacje, twĂłrz raporty i wyciÄ…gaj wnioski z dostÄ™pnych danych.",writer:"JesteĹ› profesjonalnym pisarzem. TwĂłrz wysokiej jakoĹ›ci treĹ›ci dopasowane do stylu i celu.",coder:"JesteĹ› doĹ›wiadczonym programistÄ…. Pomagaj w pisaniu, debugowaniu i optymalizacji kodu.",scheduler:"JesteĹ› zarzÄ…dcÄ… zadaĹ„ i harmonogramĂłw. Organizuj i planuj dziaĹ‚ania w sposĂłb efektywny."};t[e]&&(a.value=t[e]);const n=document.getElementById("agent-port"),o={chatbot:3011,translator:3012,searcher:3013,monitor:3014,artist:3015,analyst:3016,writer:3017,coder:3018,scheduler:3019,custom:3020};o[e]&&(n.placeholder=o[e].toString())}getFormData(){const e=document.getElementById("agent-creation-form"),a=new FormData(e),t={};for(let[n,o]of a.entries())n==="capabilities"?(t.capabilities||(t.capabilities=[]),t.capabilities.push(o)):t[n]=o;return t.auto_start=e.querySelector('[name="auto_start"]')?.checked||!1,t.logging_enabled=e.querySelector('[name="logging_enabled"]')?.checked||!1,t.monitoring_enabled=e.querySelector('[name="monitoring_enabled"]')?.checked||!1,t.port=t.port||this.generatePortFromName(t.name),t.max_memory=t.max_memory||"512",t.timeout=t.timeout||"30",t.temperature=parseFloat(t.temperature||"0.7"),t}generatePortFromName(e){let a=0;for(let t=0;t<e.length;t++){const n=e.charCodeAt(t);a=(a<<5)-a+n,a=a&a}return Math.abs(a%1e3)+3e3}showPreview(){const e=this.getFormData(),a=document.getElementById("preview-content");a.innerHTML=`
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
                <strong class="text-cyan-400">JÄ™zyk:</strong>
                <div>${e.language||"python"}</div>
              </div>
            </div>

            ${e.capabilities&&e.capabilities.length>0?`
            <div>
              <strong class="text-cyan-400">MoĹĽliwoĹ›ci:</strong>
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
                <div>${e.auto_start?"âś… Tak":"âťŚ Nie"}</div>
              </div>
              <div>
                <strong class="text-cyan-400">Logowanie:</strong>
                <div>${e.logging_enabled?"âś… Tak":"âťŚ Nie"}</div>
              </div>
              <div>
                <strong class="text-cyan-400">Monitoring:</strong>
                <div>${e.monitoring_enabled?"âś… Tak":"âťŚ Nie"}</div>
              </div>
            </div>
          </div>
        `,this.showModal("preview-modal")}async createAgent(){const e=this.getFormData();if(!e.name||!e.type||!e.description){alert("WypeĹ‚nij wszystkie wymagane pola!");return}try{const t=await(await fetch("/POLACZEK_AGENT_SYS_23/api/agents/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json();t.success?this.showSuccess(t):alert(`BĹ‚Ä…d podczas tworzenia agenta: ${t.error||t.message}`)}catch(a){console.error("Error creating agent:",a),alert("WystÄ…piĹ‚ bĹ‚Ä…d podczas tworzenia agenta. SprĂłbuj ponownie.")}}showSuccess(e){const a=document.getElementById("success-content");a.innerHTML=`
          <div class="text-left space-y-2">
            <p><strong>Nazwa:</strong> ${e.agent_name}</p>
            <p><strong>Typ:</strong> ${e.agent_type}</p>
            <p><strong>Port:</strong> ${e.port}</p>
            ${e.config_file?`<p><strong>Plik konfiguracyjny:</strong> ${e.config_file}</p>`:""}
          </div>
        `,this.showModal("success-modal")}showModal(e){document.getElementById(e).classList.remove("hidden")}hideModal(e){document.getElementById(e).classList.add("hidden")}resetForm(){document.getElementById("agent-creation-form").reset(),document.getElementById("temp-value").textContent="0.7"}}new s;
