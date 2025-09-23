globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
/* empty css                                         */
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$TavilySearch = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "title": "Tavily Search | AI Workers", "data-astro-cid-viyex4t6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh" data-astro-cid-viyex4t6> <!-- Header Section --> <section class="border border-edge" data-astro-cid-viyex4t6> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-viyex4t6> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-viyex4t6> <div class="mt-auto" data-astro-cid-viyex4t6> <span style="writing-mode: vertical-lr;" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-viyex4t6>
TAVILY
</span> </div> <span class="mt-auto" data-astro-cid-viyex4t6> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-viyex4t6>
SEARCH
</span> </span> </div> </div> </section> <!-- Navigation Section --> <section class="border border-edge" data-astro-cid-viyex4t6> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-viyex4t6> <div class="flex flex-row p-2" data-astro-cid-viyex4t6> <a class="hover:brightness-125" href="/" data-astro-cid-viyex4t6> <h1 class="text-4xl sm:text-5xl" data-astro-cid-viyex4t6>TAVILY SEARCH</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-viyex4t6>AI-Powered Web Search</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-viyex4t6> <a class="ml-auto hover:brightness-125 duration-200" href="/" data-astro-cid-viyex4t6>
â† PowrĂłt do strony gĹ‚Ăłwnej
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-viyex4t6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-viyex4t6></path> </svg> </a> </div> </div> </div> </section> <!-- Tavily Search Section --> <section class="ai-workers-section flex items-center justify-center py-16" style="background: rgba(0, 0, 0, 0.5);" id="tavily" data-astro-cid-viyex4t6> <div class="section-container max-w-6xl mx-auto" data-astro-cid-viyex4t6> <h2 class="section-title" data-astro-cid-viyex4t6>TAVILY SEARCH</h2> <p class="section-description" data-astro-cid-viyex4t6>
Zaawansowane wyszukiwanie internetowe z AI, wyciÄ…ganie treĹ›ci i
          analiza wynikĂłw
</p> <!-- Search Interface --> <div class="search-container border border-edge rounded-lg mt-8" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-viyex4t6> <!-- Search Header --> <div class="search-header border-b border-edge p-4 flex items-center justify-between" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-viyex4t6> <div class="flex items-center gap-3" data-astro-cid-viyex4t6> <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse" data-astro-cid-viyex4t6></div> <span class="text-primary-foreground font-semibold" data-astro-cid-viyex4t6>Tavily AI Search Engine</span> </div> <div class="flex gap-2" data-astro-cid-viyex4t6> <button onclick="saveSearch()" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm" data-astro-cid-viyex4t6>
Zapisz
</button> <button onclick="exportResults()" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm" data-astro-cid-viyex4t6>
Export
</button> <button onclick="clearResults()" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm" data-astro-cid-viyex4t6>
WyczyĹ›Ä‡
</button> </div> </div> <!-- Main Search Form --> <div class="search-form p-6" data-astro-cid-viyex4t6> <div class="main-search mb-6" data-astro-cid-viyex4t6> <label for="searchQuery" class="block text-lg font-semibold mb-3 text-primary-foreground" data-astro-cid-viyex4t6>
Wyszukaj w internecie:
</label> <div class="search-input-group flex gap-3" data-astro-cid-viyex4t6> <input id="searchQuery" type="text" placeholder="WprowadĹş zapytanie... np. 'najnowsze wiadomoĹ›ci o AI', 'jak dziaĹ‚ajÄ… LLM'" class="flex-1 p-4 bg-black/40 border border-edge rounded-lg text-primary-foreground placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-lg" data-astro-cid-viyex4t6> <button id="searchBtn" onclick="performSearch()" class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:opacity-50" data-astro-cid-viyex4t6>
đź”Ť Szukaj
</button> </div> </div> <!-- Advanced Options --> <div class="advanced-options border-t border-edge pt-6" data-astro-cid-viyex4t6> <h4 class="text-lg font-semibold mb-4 text-primary-foreground" data-astro-cid-viyex4t6>
Opcje zaawansowane:
</h4> <div class="grid grid-cols-1 md:grid-cols-4 gap-4" data-astro-cid-viyex4t6> <div data-astro-cid-viyex4t6> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-viyex4t6>GĹ‚Ä™bokoĹ›Ä‡ wyszukiwania:</label> <select id="searchDepth" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-viyex4t6> <option value="basic" data-astro-cid-viyex4t6>Podstawowa</option> <option value="advanced" selected data-astro-cid-viyex4t6>Zaawansowana</option> <option value="deep" data-astro-cid-viyex4t6>GĹ‚Ä™boka</option> </select> </div> <div data-astro-cid-viyex4t6> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-viyex4t6>Maksymalna liczba wynikĂłw:</label> <select id="maxResults" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-viyex4t6> <option value="5" data-astro-cid-viyex4t6>5 wynikĂłw</option> <option value="10" selected data-astro-cid-viyex4t6>10 wynikĂłw</option> <option value="20" data-astro-cid-viyex4t6>20 wynikĂłw</option> <option value="50" data-astro-cid-viyex4t6>50 wynikĂłw</option> </select> </div> <div data-astro-cid-viyex4t6> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-viyex4t6>JÄ™zyk wynikĂłw:</label> <select id="language" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-viyex4t6> <option value="auto" data-astro-cid-viyex4t6>Automatyczny</option> <option value="pl" data-astro-cid-viyex4t6>Polski</option> <option value="en" data-astro-cid-viyex4t6>Angielski</option> <option value="de" data-astro-cid-viyex4t6>Niemiecki</option> <option value="fr" data-astro-cid-viyex4t6>Francuski</option> </select> </div> <div data-astro-cid-viyex4t6> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-viyex4t6>Typ treĹ›ci:</label> <select id="contentType" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-viyex4t6> <option value="all" data-astro-cid-viyex4t6>Wszystkie</option> <option value="news" data-astro-cid-viyex4t6>WiadomoĹ›ci</option> <option value="academic" data-astro-cid-viyex4t6>Akademickie</option> <option value="technical" data-astro-cid-viyex4t6>Techniczne</option> <option value="social" data-astro-cid-viyex4t6>Media spoĹ‚ecznoĹ›ciowe</option> </select> </div> </div> <!-- Include/Exclude Domains --> <div class="domains-filter mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" data-astro-cid-viyex4t6> <div data-astro-cid-viyex4t6> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-viyex4t6>UwzglÄ™dnij domeny:</label> <input id="includeDomains" type="text" placeholder="google.com, wikipedia.org, github.com" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground placeholder-gray-400" data-astro-cid-viyex4t6> </div> <div data-astro-cid-viyex4t6> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-viyex4t6>Wyklucz domeny:</label> <input id="excludeDomains" type="text" placeholder="facebook.com, twitter.com" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground placeholder-gray-400" data-astro-cid-viyex4t6> </div> </div> </div> </div> <!-- Loading Section --> <div id="loadingSection" class="loading-section hidden p-4 border-t border-edge" data-astro-cid-viyex4t6> <div class="bg-black/40 border border-edge rounded-lg p-4" data-astro-cid-viyex4t6> <div class="flex items-center justify-center gap-3 mb-3" data-astro-cid-viyex4t6> <div class="w-4 h-4 bg-green-400 rounded-full animate-bounce" data-astro-cid-viyex4t6></div> <div class="w-4 h-4 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s" data-astro-cid-viyex4t6></div> <div class="w-4 h-4 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s" data-astro-cid-viyex4t6></div> <span class="text-primary-foreground ml-3" data-astro-cid-viyex4t6>Przeszukiwanie internetu...</span> </div> <div class="text-center" data-astro-cid-viyex4t6> <div id="searchStatus" class="text-gray-400 text-sm" data-astro-cid-viyex4t6>
Inicjalizacja wyszukiwania...
</div> </div> </div> </div> </div> <!-- AI Summary Section --> <div id="summarySection" class="summary-section hidden mt-8" data-astro-cid-viyex4t6> <div class="bg-black/20 border border-edge rounded-lg" data-astro-cid-viyex4t6> <div class="summary-header bg-black/40 border-b border-edge p-4" data-astro-cid-viyex4t6> <h3 class="text-xl font-semibold text-green-400" data-astro-cid-viyex4t6>
đź¤– Podsumowanie AI
</h3> </div> <div id="aiSummary" class="summary-content p-6 text-primary-foreground" data-astro-cid-viyex4t6> <!-- AI summary will be populated here --> </div> </div> </div> <!-- Results Section --> <div id="resultsSection" class="results-section hidden mt-8" data-astro-cid-viyex4t6> <div class="bg-black/20 border border-edge rounded-lg" data-astro-cid-viyex4t6> <!-- Results Header --> <div class="results-header bg-black/40 border-b border-edge p-4 flex items-center justify-between" data-astro-cid-viyex4t6> <div data-astro-cid-viyex4t6> <h3 class="text-xl font-semibold text-primary-foreground" data-astro-cid-viyex4t6>
Wyniki wyszukiwania
</h3> <p id="resultsInfo" class="text-gray-400 text-sm" data-astro-cid-viyex4t6></p> </div> <div class="flex gap-2" data-astro-cid-viyex4t6> <button onclick="generateReport()" class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm" data-astro-cid-viyex4t6>
Raport
</button> <button onclick="analyzeResults()" class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm" data-astro-cid-viyex4t6>
Analiza
</button> </div> </div> <!-- Results List --> <div id="resultsList" class="results-list p-4" data-astro-cid-viyex4t6> <!-- Results will be populated here --> </div> </div> </div> <!-- Quick Searches --> <div class="quick-searches mt-8" data-astro-cid-viyex4t6> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-viyex4t6>
Popularne wyszukiwania:
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-3" data-astro-cid-viyex4t6> <button class="quick-search-btn" onclick="quickSearch('najnowsze wiadomoĹ›ci AI')" data-astro-cid-viyex4t6>
đź¤– WiadomoĹ›ci AI
</button> <button class="quick-search-btn" onclick="quickSearch('jak dziaĹ‚a ChatGPT')" data-astro-cid-viyex4t6>
đź’­ Jak dziaĹ‚a AI
</button> <button class="quick-search-btn" onclick="quickSearch('machine learning tutorial 2024')" data-astro-cid-viyex4t6>
đź“š ML Tutorial
</button> <button class="quick-search-btn" onclick="quickSearch('najnowsze technologie programowanie')" data-astro-cid-viyex4t6>
đź’» Tech News
</button> <button class="quick-search-btn" onclick="quickSearch('cryptocurrency bitcoin ethereum')" data-astro-cid-viyex4t6>
đź’° Krypto
</button> <button class="quick-search-btn" onclick="quickSearch('klimat zmiany Ĺ›rodowisko')" data-astro-cid-viyex4t6>
đźŚŤ Klimat
</button> <button class="quick-search-btn" onclick="quickSearch('przestrzeĹ„ kosmiczna NASA')" data-astro-cid-viyex4t6>
đźš€ Kosmos
</button> <button class="quick-search-btn" onclick="quickSearch('zdrowie medycyna badania')" data-astro-cid-viyex4t6>
đźŹĄ Medycyna
</button> </div> </div> <!-- Search Analytics --> <div class="search-analytics mt-8 bg-black/20 border border-edge rounded-lg p-6" data-astro-cid-viyex4t6> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-viyex4t6>
Analityka wyszukiwaĹ„:
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-astro-cid-viyex4t6> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-viyex4t6> <div id="totalSearches" class="text-2xl font-bold text-green-400" data-astro-cid-viyex4t6>
0
</div> <div class="text-sm text-gray-400" data-astro-cid-viyex4t6>Wszystkich wyszukiwaĹ„</div> </div> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-viyex4t6> <div id="avgResults" class="text-2xl font-bold text-blue-400" data-astro-cid-viyex4t6>
0
</div> <div class="text-sm text-gray-400" data-astro-cid-viyex4t6>Ĺšrednio wynikĂłw</div> </div> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-viyex4t6> <div id="avgTime" class="text-2xl font-bold text-purple-400" data-astro-cid-viyex4t6>
0s
</div> <div class="text-sm text-gray-400" data-astro-cid-viyex4t6>Ĺšredni czas</div> </div> <div class="stat-card bg-black/40 border border-edge rounded p-4 text-center" data-astro-cid-viyex4t6> <div id="topDomain" class="text-2xl font-bold text-orange-400" data-astro-cid-viyex4t6>
-
</div> <div class="text-sm text-gray-400" data-astro-cid-viyex4t6>NajczÄ™stsza domena</div> </div> </div> </div> <!-- Search History --> <div class="search-history mt-8" data-astro-cid-viyex4t6> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-viyex4t6>
Historia wyszukiwaĹ„:
</h3> <div id="searchHistoryList" class="space-y-2" data-astro-cid-viyex4t6> <!-- History items will be populated here --> </div> </div> </div> </section> </main>  ` })}  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/tavily-search.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/tavily-search.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/tavily-search.astro";
const $$url = "/tavily-search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TavilySearch,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
