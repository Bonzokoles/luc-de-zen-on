import"https://cdn.tailwindcss.com";document.addEventListener("DOMContentLoaded",()=>{u()});function u(){console.log("🎨 ZENON Stable Diffusion Generator initialized"),g(),E()}function g(){window.addEventListener("wildcardSelected",e=>{const n=e.detail.wildcard;y(n)});const t=document.getElementById("generateBtn");t&&t.addEventListener("click",p)}function y(t){const e=document.getElementById("mainPrompt");if(e){const n=e.value,o=n?`${n}, ${t}`:t;e.value=o,e.focus(),e.scrollIntoView({behavior:"smooth",block:"center"}),e.style.borderColor="rgba(0, 255, 255, 0.8)",setTimeout(()=>{e.style.borderColor=""},1e3)}}async function p(){const t=document.getElementById("mainPrompt")?.value?.trim();if(!t){l("Wprowadź opis obrazu w polu prompt");return}const e=document.getElementById("loadingModal"),n=document.getElementById("generateBtn");try{e&&e.classList.remove("hidden"),n&&(n.disabled=!0,n.innerHTML='<span class="neon-cyan">GENEROWANIE...</span>'),await new Promise(o=>setTimeout(o,3e3)),w("https://picsum.photos/512/512?random="+Date.now(),t),v("Obraz wygenerowany pomyślnie!")}catch(o){l("Błąd podczas generowania: "+o.message)}finally{e&&e.classList.add("hidden"),n&&(n.disabled=!1,n.innerHTML='<span class="neon-cyan">🎨 GENERUJ OBRAZ</span>')}}function w(t,e){const n=document.getElementById("imageDisplay"),o=document.getElementById("imageControls");n&&o&&(n.innerHTML=`
          <img src="${t}" alt="Generated image" class="w-full h-auto rounded-lg cursor-pointer hover:scale-105 transition-transform" onclick="openImageModal('${t}', '${e}')"/>
        `,o.classList.remove("hidden"))}function h(t,e){console.log("Opening modal for:",t,e)}function l(t){const e=document.getElementById("errorNotification"),n=document.getElementById("errorMessage");e&&n&&(n.textContent=t,e.classList.remove("hidden"),setTimeout(()=>{e.classList.add("hidden")},5e3))}function v(t){const e=document.createElement("div");e.className="fixed top-4 right-4 bg-green-900/80 border border-green-500/50 rounded-lg p-4 text-green-200 z-50",e.innerHTML=`
        <div class="flex items-center gap-2">
          <span class="text-green-400">✅</span>
          <span>${t}</span>
        </div>
      `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}function f(){const t=document.getElementById("errorNotification");t&&t.classList.add("hidden")}function E(){console.log("Loading initial data...")}window.hideError=f;window.openImageModal=h;function b(t){console.log(`Switching to section: ${t}`),document.querySelectorAll(".btn-glossy-black").forEach(e=>{e.classList.remove("active")}),window.dispatchEvent(new CustomEvent("sectionChange",{detail:{section:t}}))}window.showSection=b;document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".btn-glossy-black").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".btn-glossy-black").forEach(e=>{e.classList.remove("active")}),t.classList.add("active")})})});let a={},d;document.addEventListener("DOMContentLoaded",()=>{L(),T()});async function L(){try{a={artists:{name:"Artyści",icon:"🎨",items:["Greg Rutkowski","Artgerm","Charlie Bowater","Makoto Shinkai","Studio Ghibli","Boris Vallejo","Frank Frazetta","H.R. Giger","Salvador Dali","Van Gogh","Leonardo da Vinci","Picasso"]},creatures:{name:"Stworzenia",icon:"🐉",items:["dragon","phoenix","unicorn","griffin","wolf","eagle","tiger","lion","bear","shark","whale","dolphin"]},castle:{name:"Zamki i Budynki",icon:"🏰",items:["medieval castle","gothic cathedral","ancient temple","fortress","tower","palace","ruins","monastery","citadel","stronghold"]}},k()}catch(t){console.error("Error loading wildcards:",t),$("Nie udało się załadować wildcards")}}function k(){const t=document.getElementById("categoriesGrid"),e=Object.values(a).reduce((n,o)=>n+o.items.length,0);document.querySelector("h3").textContent=`Wybierz kategorię (${Object.keys(a).length} dostępnych):`,t.innerHTML=`
      <div class="category-card glossy-black rounded-lg p-4 cursor-pointer transition-glossy hover:border-cyan-400/50" onclick="showCategory('all')">
        <div class="flex items-center gap-3">
          <span class="text-2xl">📁</span>
          <div>
            <h4 class="neon-cyan font-semibold">Wszystkie (${e})</h4>
            <p class="text-gray-400 text-sm">Wszystkie dostępne wildcards</p>
          </div>
        </div>
      </div>
    `,Object.entries(a).forEach(([n,o])=>{const i=document.createElement("div");i.className="category-card glossy-black rounded-lg p-4 cursor-pointer transition-glossy hover:border-cyan-400/50",i.onclick=()=>m(n),i.innerHTML=`
        <div class="flex items-center gap-3">
          <span class="text-2xl">${o.icon}</span>
          <div>
            <h4 class="neon-cyan font-semibold">${o.name} (${o.items.length})</h4>
            <p class="text-gray-400 text-sm">Kategoria ${o.name.toLowerCase()}</p>
          </div>
        </div>
      `,t.appendChild(i)})}function m(t){const e=document.getElementById("categoriesGrid"),n=document.getElementById("categoryContent"),o=document.getElementById("categoryTitle"),i=document.getElementById("wildcardsList");e.style.display="none",n.classList.remove("hidden");let r=[],c="";if(t==="all")r=Object.values(a).flatMap(s=>s.items),c=`Pokazuję ${r.length} ze wszystkich wildcards`;else{const s=a[t];r=s.items,c=`Pokazuję ${r.length} z kategorii ${s.name}`}o.textContent=c,i.innerHTML=r.map(s=>`
      <div class="wildcard-item glossy-black rounded-lg p-3 cursor-pointer transition-glossy hover:border-cyan-400/50 group" onclick="selectWildcard('${s}')">
        <div class="flex items-center justify-between">
          <span class="text-white group-hover:text-cyan-400 transition-colors">${s}</span>
          <button class="opacity-0 group-hover:opacity-100 text-cyan-400 text-sm transition-opacity">+</button>
        </div>
      </div>
    `).join("")}function I(){const t=document.getElementById("categoriesGrid"),e=document.getElementById("categoryContent");t.style.display="grid",e.classList.add("hidden")}function x(t){window.dispatchEvent(new CustomEvent("wildcardSelected",{detail:{wildcard:t}}));const e=event.target.closest(".wildcard-item");e.style.background="rgba(0, 255, 255, 0.2)",setTimeout(()=>{e.style.background=""},500),console.log("Selected wildcard:",t)}function B(t){document.querySelectorAll(".wildcard-tab").forEach(e=>{e.classList.remove("active"),e.dataset.category===t&&e.classList.add("active")}),document.querySelectorAll(".wildcard-section").forEach(e=>{e.classList.remove("active")}),document.getElementById(`${t}-section`).classList.add("active")}function C(){const t=document.getElementById("searchInput").value.toLowerCase(),e=document.getElementById("searchResults");d&&clearTimeout(d),d=setTimeout(()=>{if(!t){e.innerHTML=`
          <div class="text-center text-gray-400 py-8 col-span-full">
            Wprowadź tekst aby wyszukać wildcards
          </div>
        `;return}const o=Object.values(a).flatMap(i=>i.items).filter(i=>i.toLowerCase().includes(t));o.length===0?e.innerHTML=`
          <div class="text-center text-gray-400 py-8 col-span-full">
            Nie znaleziono wildcards dla "${t}"
          </div>
        `:e.innerHTML=o.map(i=>`
          <div class="wildcard-item glossy-black rounded-lg p-3 cursor-pointer transition-glossy hover:border-cyan-400/50 group" onclick="selectWildcard('${i}')">
            <div class="flex items-center justify-between">
              <span class="text-white group-hover:text-cyan-400 transition-colors">${i}</span>
              <button class="opacity-0 group-hover:opacity-100 text-cyan-400 text-sm transition-opacity">+</button>
            </div>
          </div>
        `).join("")},300)}function T(){window.addEventListener("sectionChange",t=>{t.detail.section==="wildcards"&&document.getElementById("wildcardsBrowser").scrollIntoView({behavior:"smooth"})})}function $(t){console.error(t)}window.switchWildcardTab=B;window.showCategory=m;window.goBackToCategories=I;window.selectWildcard=x;window.searchWildcards=C;
