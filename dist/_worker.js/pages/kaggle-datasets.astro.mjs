if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/vendor_DlPT8CWO.mjs';
export { d as renderers } from '../chunks/vendor_DlPT8CWO.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_CINJPwTU.mjs';
/* empty css                                           */

const $$KaggleDatasets = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "title": "Kaggle Datasets | AI Workers", "data-astro-cid-3dzqupyy": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh" data-astro-cid-3dzqupyy> <!-- Header Section --> <section class="border border-edge" data-astro-cid-3dzqupyy> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-3dzqupyy> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-3dzqupyy> <div class="mt-auto" data-astro-cid-3dzqupyy> <span style="writing-mode: vertical-lr;" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-3dzqupyy>
KAGGLE
</span> </div> <span class="mt-auto" data-astro-cid-3dzqupyy> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-3dzqupyy>
DATASETS
</span> </span> </div> </div> </section> <!-- Navigation Section --> <section class="border border-edge" data-astro-cid-3dzqupyy> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-3dzqupyy> <div class="flex flex-row p-2" data-astro-cid-3dzqupyy> <a class="hover:brightness-125" href="/" data-astro-cid-3dzqupyy> <h1 class="text-4xl sm:text-5xl" data-astro-cid-3dzqupyy>KAGGLE DATASETS</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-3dzqupyy>Machine Learning Data Explorer</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-3dzqupyy> <a class="ml-auto hover:brightness-125 duration-200" href="/" data-astro-cid-3dzqupyy>
← Powrót do strony głównej
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-3dzqupyy> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-3dzqupyy></path> </svg> </a> </div> </div> </div> </section> <!-- Kaggle Section --> <section class="ai-workers-section flex items-center justify-center py-16" style="background: rgba(0, 0, 0, 0.5);" id="kaggle" data-astro-cid-3dzqupyy> <div class="section-container max-w-6xl mx-auto" data-astro-cid-3dzqupyy> <h2 class="section-title" data-astro-cid-3dzqupyy>KAGGLE DATASETS</h2> <p class="section-description" data-astro-cid-3dzqupyy>
Przeszukuj zbiory danych, konkursy i profile na platformie Kaggle
</p> <!-- Search Interface --> <div class="search-container border border-edge rounded-lg mt-8" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-3dzqupyy> <!-- Search Header --> <div class="search-header border-b border-edge p-4 flex items-center justify-between" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-3dzqupyy> <div class="flex items-center gap-3" data-astro-cid-3dzqupyy> <div class="w-3 h-3 bg-orange-400 rounded-full animate-pulse" data-astro-cid-3dzqupyy></div> <span class="text-primary-foreground font-semibold" data-astro-cid-3dzqupyy>Kaggle Explorer</span> </div> <div class="flex gap-2" data-astro-cid-3dzqupyy> <button onclick="saveSearch()" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm" data-astro-cid-3dzqupyy>
Zapisz
</button> <button onclick="clearResults()" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm" data-astro-cid-3dzqupyy>
Wyczyść
</button> </div> </div> <!-- Search Form --> <div class="search-form p-4" data-astro-cid-3dzqupyy> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-astro-cid-3dzqupyy> <div data-astro-cid-3dzqupyy> <label for="searchQuery" class="block text-lg font-semibold mb-3 text-primary-foreground" data-astro-cid-3dzqupyy>
Wyszukaj:
</label> <input id="searchQuery" type="text" placeholder="machine learning, image classification, covid-19..." class="w-full p-3 border border-edge rounded-lg text-primary-foreground placeholder-gray-400 focus:border-cyan-400 focus:outline-none" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-3dzqupyy> </div> <div data-astro-cid-3dzqupyy> <label for="searchType" class="block text-lg font-semibold mb-3 text-primary-foreground" data-astro-cid-3dzqupyy>
Typ wyszukiwania:
</label> <select id="searchType" class="w-full p-3 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-3dzqupyy> <option value="datasets" data-astro-cid-3dzqupyy>Zbiory danych</option> <option value="competitions" data-astro-cid-3dzqupyy>Konkursy</option> <option value="kernels" data-astro-cid-3dzqupyy>Kernels/Notebooks</option> <option value="users" data-astro-cid-3dzqupyy>Użytkownicy</option> </select> </div> </div> <!-- Advanced Filters --> <div class="advanced-filters border-t border-edge pt-4" data-astro-cid-3dzqupyy> <h4 class="text-lg font-semibold mb-3 text-primary-foreground" data-astro-cid-3dzqupyy>
Filtry zaawansowane:
</h4> <div class="grid grid-cols-1 md:grid-cols-4 gap-3" data-astro-cid-3dzqupyy> <div data-astro-cid-3dzqupyy> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-3dzqupyy>Kategoria:</label> <select id="category" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-3dzqupyy> <option value="" data-astro-cid-3dzqupyy>Wszystkie</option> <option value="computer-science" data-astro-cid-3dzqupyy>Informatyka</option> <option value="health" data-astro-cid-3dzqupyy>Zdrowie</option> <option value="business" data-astro-cid-3dzqupyy>Biznes</option> <option value="earth-and-nature" data-astro-cid-3dzqupyy>Przyroda</option> <option value="social-science" data-astro-cid-3dzqupyy>Nauki społeczne</option> <option value="education" data-astro-cid-3dzqupyy>Edukacja</option> </select> </div> <div data-astro-cid-3dzqupyy> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-3dzqupyy>Rozmiar:</label> <select id="fileSize" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-3dzqupyy> <option value="" data-astro-cid-3dzqupyy>Dowolny</option> <option value="small" data-astro-cid-3dzqupyy>< 100 MB</option> <option value="medium" data-astro-cid-3dzqupyy>100 MB - 1 GB</option> <option value="large" data-astro-cid-3dzqupyy>1 GB - 10 GB</option> <option value="huge" data-astro-cid-3dzqupyy>> 10 GB</option> </select> </div> <div data-astro-cid-3dzqupyy> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-3dzqupyy>Format:</label> <select id="fileType" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-3dzqupyy> <option value="" data-astro-cid-3dzqupyy>Wszystkie</option> <option value="csv" data-astro-cid-3dzqupyy>CSV</option> <option value="json" data-astro-cid-3dzqupyy>JSON</option> <option value="sqlite" data-astro-cid-3dzqupyy>SQLite</option> <option value="zip" data-astro-cid-3dzqupyy>ZIP</option> <option value="images" data-astro-cid-3dzqupyy>Obrazy</option> </select> </div> <div data-astro-cid-3dzqupyy> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-3dzqupyy>Sortuj:</label> <select id="sortBy" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-3dzqupyy> <option value="relevance" data-astro-cid-3dzqupyy>Trafność</option> <option value="newest" data-astro-cid-3dzqupyy>Najnowsze</option> <option value="votes" data-astro-cid-3dzqupyy>Głosy</option> <option value="downloads" data-astro-cid-3dzqupyy>Pobrania</option> <option value="size" data-astro-cid-3dzqupyy>Rozmiar</option> </select> </div> </div> </div> <!-- Search Button --> <div class="search-action mt-4" data-astro-cid-3dzqupyy> <button id="searchBtn" onclick="performSearch()" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:opacity-50" data-astro-cid-3dzqupyy>
🔍 Wyszukaj na Kaggle
</button> </div> </div> <!-- Loading Section --> <div id="loadingSection" class="loading-section hidden p-4 border-t border-edge" data-astro-cid-3dzqupyy> <div class="bg-black/40 border border-edge rounded-lg p-4" data-astro-cid-3dzqupyy> <div class="flex items-center justify-center gap-3" data-astro-cid-3dzqupyy> <div class="w-4 h-4 bg-orange-400 rounded-full animate-bounce" data-astro-cid-3dzqupyy></div> <div class="w-4 h-4 bg-orange-400 rounded-full animate-bounce" style="animation-delay: 0.1s" data-astro-cid-3dzqupyy></div> <div class="w-4 h-4 bg-orange-400 rounded-full animate-bounce" style="animation-delay: 0.2s" data-astro-cid-3dzqupyy></div> <span class="text-primary-foreground ml-3" data-astro-cid-3dzqupyy>Wyszukiwanie na Kaggle...</span> </div> </div> </div> </div> <!-- Results Section --> <div id="resultsSection" class="results-section hidden mt-8" data-astro-cid-3dzqupyy> <div class="bg-black/20 border border-edge rounded-lg" data-astro-cid-3dzqupyy> <!-- Results Header --> <div class="results-header bg-black/40 border-b border-edge p-4 flex items-center justify-between" data-astro-cid-3dzqupyy> <div data-astro-cid-3dzqupyy> <h3 class="text-xl font-semibold text-primary-foreground" data-astro-cid-3dzqupyy>
Wyniki wyszukiwania
</h3> <p id="resultsInfo" class="text-gray-400 text-sm" data-astro-cid-3dzqupyy></p> </div> <div class="flex gap-2" data-astro-cid-3dzqupyy> <button onclick="exportResults()" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm" data-astro-cid-3dzqupyy>
Export CSV
</button> <button onclick="viewFavorites()" class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm" data-astro-cid-3dzqupyy>
Ulubione
</button> </div> </div> <!-- Results Grid --> <div id="resultsGrid" class="results-grid p-4" data-astro-cid-3dzqupyy> <!-- Results will be populated here --> </div> <!-- Pagination --> <div id="paginationSection" class="pagination-section hidden border-t border-edge p-4" data-astro-cid-3dzqupyy> <div class="flex items-center justify-between" data-astro-cid-3dzqupyy> <button id="prevPage" onclick="changePage(-1)" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50" data-astro-cid-3dzqupyy>
← Poprzednia
</button> <span id="pageInfo" class="text-primary-foreground" data-astro-cid-3dzqupyy></span> <button id="nextPage" onclick="changePage(1)" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded disabled:opacity-50" data-astro-cid-3dzqupyy>
Następna →
</button> </div> </div> </div> </div> <!-- Quick Searches --> <div class="quick-searches mt-8" data-astro-cid-3dzqupyy> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-3dzqupyy>
Popularne wyszukiwania:
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-3" data-astro-cid-3dzqupyy> <button class="quick-search-btn" onclick="quickSearch('machine learning')" data-astro-cid-3dzqupyy>
🤖 Machine Learning
</button> <button class="quick-search-btn" onclick="quickSearch('image classification')" data-astro-cid-3dzqupyy>
🖼️ Klasyfikacja obrazów
</button> <button class="quick-search-btn" onclick="quickSearch('nlp natural language')" data-astro-cid-3dzqupyy>
💬 NLP
</button> <button class="quick-search-btn" onclick="quickSearch('covid coronavirus')" data-astro-cid-3dzqupyy>
🦠 COVID-19
</button> <button class="quick-search-btn" onclick="quickSearch('stock market finance')" data-astro-cid-3dzqupyy>
📈 Finanse
</button> <button class="quick-search-btn" onclick="quickSearch('climate weather')" data-astro-cid-3dzqupyy>
🌡️ Klimat
</button> <button class="quick-search-btn" onclick="quickSearch('house prices real estate')" data-astro-cid-3dzqupyy>
🏠 Nieruchomości
</button> <button class="quick-search-btn" onclick="quickSearch('sports football soccer')" data-astro-cid-3dzqupyy>
⚽ Sport
</button> </div> </div> <!-- Statistics Dashboard --> <div class="stats-dashboard mt-8 bg-black/20 border border-edge rounded-lg p-6" data-astro-cid-3dzqupyy> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-3dzqupyy>
Statystyki Kaggle:
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-astro-cid-3dzqupyy> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-3dzqupyy> <div class="text-2xl font-bold text-orange-400" data-astro-cid-3dzqupyy>2.5M+</div> <div class="text-sm text-gray-400" data-astro-cid-3dzqupyy>Zbiory danych</div> </div> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-3dzqupyy> <div class="text-2xl font-bold text-blue-400" data-astro-cid-3dzqupyy>150K+</div> <div class="text-sm text-gray-400" data-astro-cid-3dzqupyy>Konkursy</div> </div> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-3dzqupyy> <div class="text-2xl font-bold text-green-400" data-astro-cid-3dzqupyy>8M+</div> <div class="text-sm text-gray-400" data-astro-cid-3dzqupyy>Użytkowników</div> </div> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-3dzqupyy> <div class="text-2xl font-bold text-purple-400" data-astro-cid-3dzqupyy>500K+</div> <div class="text-sm text-gray-400" data-astro-cid-3dzqupyy>Notebooks</div> </div> </div> </div> <!-- Search History --> <div class="search-history mt-8" data-astro-cid-3dzqupyy> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-3dzqupyy>
Historia wyszukiwań:
</h3> <div id="searchHistoryList" class="space-y-2" data-astro-cid-3dzqupyy> <!-- History items will be populated here --> </div> </div> </div> </section> </main>  ` })}  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/kaggle-datasets.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/kaggle-datasets.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/kaggle-datasets.astro";
const $$url = "/kaggle-datasets";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$KaggleDatasets,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
