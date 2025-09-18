if(typeof MessageChannel>"u"){class e{constructor(){this.onmessage=null}postMessage(o){const t={data:o};(typeof queueMicrotask=="function"?queueMicrotask:n=>setTimeout(n,0))(()=>this.onmessage&&this.onmessage(t))}start(){}close(){}}class s{constructor(){this.port1=new e,this.port2=new e;const o=(t,n)=>{const r={data:n};(typeof queueMicrotask=="function"?queueMicrotask:i=>setTimeout(i,0))(()=>t.onmessage&&t.onmessage(r))};this.port1.postMessage=t=>o(this.port2,t),this.port2.postMessage=t=>o(this.port1,t)}}globalThis.MessageChannel=s}let c={},l;document.addEventListener("DOMContentLoaded",()=>{u(),w()});async function u(){try{c={artists:{name:"Artyści",icon:"🎨",items:["Greg Rutkowski","Artgerm","Charlie Bowater","Makoto Shinkai","Studio Ghibli","Boris Vallejo","Frank Frazetta","H.R. Giger","Salvador Dali","Van Gogh","Leonardo da Vinci","Picasso"]},creatures:{name:"Stworzenia",icon:"🐉",items:["dragon","phoenix","unicorn","griffin","wolf","eagle","tiger","lion","bear","shark","whale","dolphin"]},castle:{name:"Zamki i Budynki",icon:"🏰",items:["medieval castle","gothic cathedral","ancient temple","fortress","tower","palace","ruins","monastery","citadel","stronghold"]}},g()}catch(e){console.error("Error loading wildcards:",e),v("Nie udało się załadować wildcards")}}function g(){const e=document.getElementById("categoriesGrid"),s=Object.values(c).reduce((a,o)=>a+o.items.length,0);document.querySelector("h3").textContent=`Wybierz kategorię (${Object.keys(c).length} dostępnych):`,e.innerHTML=`
      <div class="category-card glossy-black rounded-lg p-4 cursor-pointer transition-glossy hover:border-cyan-400/50" onclick="showCategory('all')">
        <div class="flex items-center gap-3">
          <span class="text-2xl">📁</span>
          <div>
            <h4 class="neon-cyan font-semibold">Wszystkie (${s})</h4>
            <p class="text-gray-400 text-sm">Wszystkie dostępne wildcards</p>
          </div>
        </div>
      </div>
    `,Object.entries(c).forEach(([a,o])=>{const t=document.createElement("div");t.className="category-card glossy-black rounded-lg p-4 cursor-pointer transition-glossy hover:border-cyan-400/50",t.onclick=()=>d(a),t.innerHTML=`
        <div class="flex items-center gap-3">
          <span class="text-2xl">${o.icon}</span>
          <div>
            <h4 class="neon-cyan font-semibold">${o.name} (${o.items.length})</h4>
            <p class="text-gray-400 text-sm">Kategoria ${o.name.toLowerCase()}</p>
          </div>
        </div>
      `,e.appendChild(t)})}function d(e){const s=document.getElementById("categoriesGrid"),a=document.getElementById("categoryContent"),o=document.getElementById("categoryTitle"),t=document.getElementById("wildcardsList");s.style.display="none",a.classList.remove("hidden");let n=[],r="";if(e==="all")n=Object.values(c).flatMap(i=>i.items),r=`Pokazuję ${n.length} ze wszystkich wildcards`;else{const i=c[e];n=i.items,r=`Pokazuję ${n.length} z kategorii ${i.name}`}o.textContent=r,t.innerHTML=n.map(i=>`
      <div class="wildcard-item glossy-black rounded-lg p-3 cursor-pointer transition-glossy hover:border-cyan-400/50 group" onclick="selectWildcard('${i}')">
        <div class="flex items-center justify-between">
          <span class="text-white group-hover:text-cyan-400 transition-colors">${i}</span>
          <button class="opacity-0 group-hover:opacity-100 text-cyan-400 text-sm transition-opacity">+</button>
        </div>
      </div>
    `).join("")}function m(){const e=document.getElementById("categoriesGrid"),s=document.getElementById("categoryContent");e.style.display="grid",s.classList.add("hidden")}function y(e){window.dispatchEvent(new CustomEvent("wildcardSelected",{detail:{wildcard:e}}));const s=event.target.closest(".wildcard-item");s.style.background="rgba(0, 255, 255, 0.2)",setTimeout(()=>{s.style.background=""},500),console.log("Selected wildcard:",e)}function p(e){document.querySelectorAll(".wildcard-tab").forEach(s=>{s.classList.remove("active"),s.dataset.category===e&&s.classList.add("active")}),document.querySelectorAll(".wildcard-section").forEach(s=>{s.classList.remove("active")}),document.getElementById(`${e}-section`).classList.add("active")}function h(){const e=document.getElementById("searchInput").value.toLowerCase(),s=document.getElementById("searchResults");l&&clearTimeout(l),l=setTimeout(()=>{if(!e){s.innerHTML=`
          <div class="text-center text-gray-400 py-8 col-span-full">
            Wprowadź tekst aby wyszukać wildcards
          </div>
        `;return}const o=Object.values(c).flatMap(t=>t.items).filter(t=>t.toLowerCase().includes(e));o.length===0?s.innerHTML=`
          <div class="text-center text-gray-400 py-8 col-span-full">
            Nie znaleziono wildcards dla "${e}"
          </div>
        `:s.innerHTML=o.map(t=>`
          <div class="wildcard-item glossy-black rounded-lg p-3 cursor-pointer transition-glossy hover:border-cyan-400/50 group" onclick="selectWildcard('${t}')">
            <div class="flex items-center justify-between">
              <span class="text-white group-hover:text-cyan-400 transition-colors">${t}</span>
              <button class="opacity-0 group-hover:opacity-100 text-cyan-400 text-sm transition-opacity">+</button>
            </div>
          </div>
        `).join("")},300)}function w(){window.addEventListener("sectionChange",e=>{e.detail.section==="wildcards"&&document.getElementById("wildcardsBrowser").scrollIntoView({behavior:"smooth"})})}function v(e){console.error(e)}window.switchWildcardTab=p;window.showCategory=d;window.goBackToCategories=m;window.selectWildcard=y;window.searchWildcards=h;
