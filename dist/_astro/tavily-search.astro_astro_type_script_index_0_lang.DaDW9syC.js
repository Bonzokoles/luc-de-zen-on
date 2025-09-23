let m=JSON.parse(localStorage.getItem("tavilySearchHistory")||"[]"),o=JSON.parse(localStorage.getItem("tavilySearchStats")||"{ totalSearches: 0, totalResults: 0, totalTime: 0, domains: {} }"),x=[],p=null;async function E(){const t=document.getElementById("searchQuery").value.trim();if(!t){alert("ProszÄ™ wprowadziÄ‡ zapytanie");return}const e=document.getElementById("searchBtn"),s=document.getElementById("loadingSection"),a=document.getElementById("resultsSection"),i=document.getElementById("summarySection"),n=document.getElementById("searchStatus");e.disabled=!0,e.textContent="Wyszukiwanie...",s.classList.remove("hidden"),a.classList.add("hidden"),i.classList.add("hidden"),p=Date.now();const u=["Inicjalizacja wyszukiwania...","Przeszukiwanie stron internetowych...","Analizowanie treĹ›ci...","WyciÄ…ganie kluczowych informacji...","Generowanie podsumowania AI...","Finalizowanie wynikĂłw..."];let c=0;const y=setInterval(()=>{c<u.length&&(n.textContent=u[c],c++)},1e3);try{const d=document.getElementById("searchDepth").value,I=parseInt(document.getElementById("maxResults").value),w=document.getElementById("language").value,f=document.getElementById("contentType").value,g=document.getElementById("includeDomains").value,h=document.getElementById("excludeDomains").value,r=await(await fetch("/api/tavi",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,searchDepth:d,maxResults:I,language:w,contentType:f,includeDomains:g?g.split(",").map(l=>l.trim()):[],excludeDomains:h?h.split(",").map(l=>l.trim()):[]})})).json();if(clearInterval(y),r.success){const l=(Date.now()-p)/1e3;x=r.results,r.summary&&B(r.summary),L(r.results,l),T(t,r.results.length,l,r.results),b(t,r.results.length,l)}else throw new Error(r.error||"BĹ‚Ä…d wyszukiwania")}catch(d){clearInterval(y),console.error("Search error:",d),k(d.message)}finally{e.disabled=!1,e.textContent="đź”Ť Szukaj",s.classList.add("hidden")}}function B(t){const e=document.getElementById("summarySection"),s=document.getElementById("aiSummary");s.innerHTML=`
      <div class="ai-summary-content">
        <p class="text-lg leading-relaxed">${t}</p>
        <div class="mt-4 text-sm text-gray-400">
          <em>Podsumowanie wygenerowane przez AI na podstawie znalezionych wynikĂłw</em>
        </div>
      </div>
    `,e.classList.remove("hidden")}function L(t,e){const s=document.getElementById("resultsSection"),a=document.getElementById("resultsList"),i=document.getElementById("resultsInfo");i.textContent=`Znaleziono ${t.length} wynikĂłw w ${e.toFixed(2)} sekund`,t.length===0?a.innerHTML='<div class="text-gray-400 text-center py-8">Brak wynikĂłw dla tego zapytania</div>':(a.innerHTML="",t.forEach((n,u)=>{const c=document.createElement("div");c.className="search-result",c.onclick=()=>window.open(n.url,"_blank");const y=new URL(n.url).hostname,d=n.score||100-u*5;c.innerHTML=`
          <div class="result-header mb-3">
            <a href="${n.url}" target="_blank" class="result-title">${n.title}</a>
            <div class="result-url">${n.url}</div>
          </div>
          <div class="result-snippet mb-3">${n.content||n.snippet||"Brak opisu dostÄ™pnego"}</div>
          <div class="result-meta">
            <span class="meta-tag">đźŚ ${y}</span>
            <span class="meta-tag">đź“Š ${d.toFixed(0)}% trafnoĹ›Ä‡</span>
            <span class="meta-tag">đź“… ${n.published_date||"Nieznana data"}</span>
            ${n.language?`<span class="meta-tag">đź—Łď¸Ź ${n.language}</span>`:""}
            ${n.content_type?`<span class="meta-tag">đź“„ ${n.content_type}</span>`:""}
          </div>
        `,a.appendChild(c)})),s.classList.remove("hidden")}function k(t){const e=document.getElementById("resultsSection"),s=document.getElementById("resultsList"),a=document.getElementById("resultsInfo");a.textContent="BĹ‚Ä…d wyszukiwania",s.innerHTML=`<div class="bg-red-600/20 border border-red-400/30 rounded p-4">
      <div class="text-red-400 font-semibold mb-2">BĹ‚Ä…d wyszukiwania:</div>
      <div class="text-primary-foreground">${t}</div>
    </div>`,e.classList.remove("hidden")}function T(t,e,s,a){o.totalSearches++,o.totalResults+=e,o.totalTime+=s,a.forEach(i=>{try{const n=new URL(i.url).hostname;o.domains[n]=(o.domains[n]||0)+1}catch{}}),localStorage.setItem("tavilySearchStats",JSON.stringify(o)),S()}function S(){document.getElementById("totalSearches").textContent=o.totalSearches;const t=o.totalSearches>0?(o.totalResults/o.totalSearches).toFixed(1):"0";document.getElementById("avgResults").textContent=t;const e=o.totalSearches>0?(o.totalTime/o.totalSearches).toFixed(1)+"s":"0s";document.getElementById("avgTime").textContent=e;const s=Object.entries(o.domains);if(s.length>0){const a=s.sort((i,n)=>n[1]-i[1])[0][0];document.getElementById("topDomain").textContent=a}}function b(t,e,s){const a={id:Date.now(),query:t,resultCount:e,searchTime:s.toFixed(2),timestamp:new Date().toISOString()};m.unshift(a),m.length>20&&(m=m.slice(0,20)),localStorage.setItem("tavilySearchHistory",JSON.stringify(m)),v()}function v(){const t=document.getElementById("searchHistoryList");t.innerHTML="",m.forEach(e=>{const s=document.createElement("div");s.className="history-item bg-black/20 border border-edge rounded-lg p-3 cursor-pointer hover:border-green-400 transition-colors";const a=new Date(e.timestamp).toLocaleDateString("pl-PL"),i=new Date(e.timestamp).toLocaleTimeString("pl-PL");s.innerHTML=`
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="text-primary-foreground text-sm font-medium">${e.query}</p>
            <p class="text-gray-400 text-xs">${a} ${i} â€˘ ${e.resultCount} wynikĂłw â€˘ ${e.searchTime}s</p>
          </div>
          <button onclick="deleteFromSearchHistory(${e.id})" class="text-red-400 hover:text-red-300 text-xs ml-2">âś•</button>
        </div>
      `,s.onclick=n=>{n.target.tagName!=="BUTTON"&&(document.getElementById("searchQuery").value=e.query)},t.appendChild(s)})}document.addEventListener("DOMContentLoaded",()=>{v(),S();const t=localStorage.getItem("quickTavilySearch");t&&(document.getElementById("searchQuery").value=t,localStorage.removeItem("quickTavilySearch")),document.getElementById("searchQuery").addEventListener("keypress",e=>{e.key==="Enter"&&E()})});
