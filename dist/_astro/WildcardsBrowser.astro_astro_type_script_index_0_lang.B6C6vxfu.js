let n={},l;document.addEventListener("DOMContentLoaded",()=>{g(),h()});async function g(){try{n={artists:{name:"Arty┼Ťci",icon:"🎨",items:["Greg Rutkowski","Artgerm","Charlie Bowater","Makoto Shinkai","Studio Ghibli","Boris Vallejo","Frank Frazetta","H.R. Giger","Salvador Dali","Van Gogh","Leonardo da Vinci","Picasso"]},creatures:{name:"Stworzenia",icon:"­čÉë",items:["dragon","phoenix","unicorn","griffin","wolf","eagle","tiger","lion","bear","shark","whale","dolphin"]},castle:{name:"Zamki i Budynki",icon:"🏰",items:["medieval castle","gothic cathedral","ancient temple","fortress","tower","palace","ruins","monastery","citadel","stronghold"]}},u()}catch(e){console.error("Error loading wildcards:",e),v("Nie uda┼éo si─Ö za┼éadowa─ç wildcards")}}function u(){const e=document.getElementById("categoriesGrid"),t=Object.values(n).reduce((a,s)=>a+s.items.length,0);document.querySelector("h3").textContent=`Wybierz kategori─Ö (${Object.keys(n).length} dost─Öpnych):`,e.innerHTML=`
      <div class="category-card glossy-black rounded-lg p-4 cursor-pointer transition-glossy hover:border-cyan-400/50" onclick="showCategory('all')">
        <div class="flex items-center gap-3">
          <span class="text-2xl">­čôü</span>
          <div>
            <h4 class="neon-cyan font-semibold">Wszystkie (${t})</h4>
            <p class="text-gray-400 text-sm">Wszystkie dost─Öpne wildcards</p>
          </div>
        </div>
      </div>
    `,Object.entries(n).forEach(([a,s])=>{const o=document.createElement("div");o.className="category-card glossy-black rounded-lg p-4 cursor-pointer transition-glossy hover:border-cyan-400/50",o.onclick=()=>d(a),o.innerHTML=`
        <div class="flex items-center gap-3">
          <span class="text-2xl">${s.icon}</span>
          <div>
            <h4 class="neon-cyan font-semibold">${s.name} (${s.items.length})</h4>
            <p class="text-gray-400 text-sm">Kategoria ${s.name.toLowerCase()}</p>
          </div>
        </div>
      `,e.appendChild(o)})}function d(e){const t=document.getElementById("categoriesGrid"),a=document.getElementById("categoryContent"),s=document.getElementById("categoryTitle"),o=document.getElementById("wildcardsList");t.style.display="none",a.classList.remove("hidden");let c=[],r="";if(e==="all")c=Object.values(n).flatMap(i=>i.items),r=`Pokazuj─Ö ${c.length} ze wszystkich wildcards`;else{const i=n[e];c=i.items,r=`Pokazuj─Ö ${c.length} z kategorii ${i.name}`}s.textContent=r,o.innerHTML=c.map(i=>`
      <div class="wildcard-item glossy-black rounded-lg p-3 cursor-pointer transition-glossy hover:border-cyan-400/50 group" onclick="selectWildcard('${i}')">
        <div class="flex items-center justify-between">
          <span class="text-white group-hover:text-cyan-400 transition-colors">${i}</span>
          <button class="opacity-0 group-hover:opacity-100 text-cyan-400 text-sm transition-opacity">+</button>
        </div>
      </div>
    `).join("")}function y(){const e=document.getElementById("categoriesGrid"),t=document.getElementById("categoryContent");e.style.display="grid",t.classList.add("hidden")}function m(e){window.dispatchEvent(new CustomEvent("wildcardSelected",{detail:{wildcard:e}}));const t=event.target.closest(".wildcard-item");t.style.background="rgba(0, 255, 255, 0.2)",setTimeout(()=>{t.style.background=""},500),console.log("Selected wildcard:",e)}function p(e){document.querySelectorAll(".wildcard-tab").forEach(t=>{t.classList.remove("active"),t.dataset.category===e&&t.classList.add("active")}),document.querySelectorAll(".wildcard-section").forEach(t=>{t.classList.remove("active")}),document.getElementById(`${e}-section`).classList.add("active")}function w(){const e=document.getElementById("searchInput").value.toLowerCase(),t=document.getElementById("searchResults");l&&clearTimeout(l),l=setTimeout(()=>{if(!e){t.innerHTML=`
          <div class="text-center text-gray-400 py-8 col-span-full">
            Wprowad┼║ tekst aby wyszuka─ç wildcards
          </div>
        `;return}const s=Object.values(n).flatMap(o=>o.items).filter(o=>o.toLowerCase().includes(e));s.length===0?t.innerHTML=`
          <div class="text-center text-gray-400 py-8 col-span-full">
            Nie znaleziono wildcards dla "${e}"
          </div>
        `:t.innerHTML=s.map(o=>`
          <div class="wildcard-item glossy-black rounded-lg p-3 cursor-pointer transition-glossy hover:border-cyan-400/50 group" onclick="selectWildcard('${o}')">
            <div class="flex items-center justify-between">
              <span class="text-white group-hover:text-cyan-400 transition-colors">${o}</span>
              <button class="opacity-0 group-hover:opacity-100 text-cyan-400 text-sm transition-opacity">+</button>
            </div>
          </div>
        `).join("")},300)}function h(){window.addEventListener("sectionChange",e=>{e.detail.section==="wildcards"&&document.getElementById("wildcardsBrowser").scrollIntoView({behavior:"smooth"})})}function v(e){console.error(e)}window.switchWildcardTab=p;window.showCategory=d;window.goBackToCategories=y;window.selectWildcard=m;window.searchWildcards=w;
