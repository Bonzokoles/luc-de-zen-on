globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_DdWhmxse.mjs';
import { W as WorkersStatusDashboard } from '../chunks/WorkersStatusDashboard_BEflDN07.mjs';
/* empty css                                          */
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$StatusWorkers = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "STATUS WORKERS - Monitoring Dashboard | KAROL LISSON", "data-astro-cid-2ciyz5ox": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh" data-astro-cid-2ciyz5ox> <!-- Header Section --> <section class="border border-edge" data-astro-cid-2ciyz5ox> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-2ciyz5ox> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-2ciyz5ox> <div class="mt-auto" data-astro-cid-2ciyz5ox> <span style="writing-mode: vertical-lr;" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-2ciyz5ox>
STATUS
</span> </div> <span class="mt-auto" data-astro-cid-2ciyz5ox> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-2ciyz5ox>
WORKERS
</span> </span> </div> </div> </section> <!-- Navigation Section --> <section class="border border-edge" data-astro-cid-2ciyz5ox> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-2ciyz5ox> <div class="flex flex-row p-2" data-astro-cid-2ciyz5ox> <a class="hover:brightness-125" href="/" data-astro-cid-2ciyz5ox> <h1 class="text-4xl sm:text-5xl" data-astro-cid-2ciyz5ox>STATUS WORKERS</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-2ciyz5ox>
Zaawansowany System Monitorowania
</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-2ciyz5ox> <a class="ml-auto hover:brightness-125 duration-200" href="/" data-astro-cid-2ciyz5ox>
← Powrót do strony głównej
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-2ciyz5ox> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-2ciyz5ox></path> </svg> </a> </div> </div> </div> </section> <!-- Workers Status Dashboard Section --> <section class="ai-workers-section flex items-center justify-center py-16" style="background: rgba(0, 0, 0, 0.5);" id="status-workers" data-astro-cid-2ciyz5ox> <div class="section-container max-w-7xl mx-auto" data-astro-cid-2ciyz5ox> <h2 class="section-title" data-astro-cid-2ciyz5ox>WORKERS STATUS DASHBOARD</h2> <p class="section-description" data-astro-cid-2ciyz5ox>
Kompleksowy system monitorowania statusu wszystkich Cloudflare
          Workers, API endpoints, oraz zasobów systemowych w czasie
          rzeczywistym.
</p> <!-- Dashboard Container --> <div class="dashboard-container border border-edge rounded-lg overflow-hidden mt-8" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-2ciyz5ox> <!-- Dashboard Header --> <div class="dashboard-header border-b border-edge p-4 flex items-center justify-between" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-2ciyz5ox> <div class="flex items-center gap-3" data-astro-cid-2ciyz5ox> <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse" data-astro-cid-2ciyz5ox></div> <span class="text-primary-foreground font-semibold" data-astro-cid-2ciyz5ox>Monitoring Online</span> </div> <div class="flex gap-2" data-astro-cid-2ciyz5ox> <button onclick="refreshDashboard()" class="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm" data-astro-cid-2ciyz5ox>
Odśwież
</button> <button onclick="exportData()" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm" data-astro-cid-2ciyz5ox>
Eksport
</button> </div> </div> <!-- Full Dashboard --> <div class="p-6" data-astro-cid-2ciyz5ox> ${renderComponent($$result2, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-2ciyz5ox": true })} </div> </div> <!-- Additional Information Section --> <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-2ciyz5ox> <!-- Monitoring Features --> <div class="bg-black/40 border border-[#00d7ef]/20 p-6" data-astro-cid-2ciyz5ox> <h3 class="text-xl font-bold text-[#00d7ef] mb-4" data-astro-cid-2ciyz5ox>
📊 Funkcje Monitorowania
</h3> <ul class="space-y-2 text-gray-300" data-astro-cid-2ciyz5ox> <li data-astro-cid-2ciyz5ox>• Status wszystkich Workers w czasie rzeczywistym</li> <li data-astro-cid-2ciyz5ox>• Monitoring API endpoints i połączeń</li> <li data-astro-cid-2ciyz5ox>• Wykrywanie błędów i anomalii</li> <li data-astro-cid-2ciyz5ox>• Historia aktywności i logów</li> <li data-astro-cid-2ciyz5ox>• Alerty o nieprawidłowościach</li> </ul> </div> <!-- Performance Metrics --> <div class="bg-black/40 border border-[#00d7ef]/20 p-6" data-astro-cid-2ciyz5ox> <h3 class="text-xl font-bold text-[#00d7ef] mb-4" data-astro-cid-2ciyz5ox>
⚡ Metryki Wydajności
</h3> <ul class="space-y-2 text-gray-300" data-astro-cid-2ciyz5ox> <li data-astro-cid-2ciyz5ox>• Czas odpowiedzi API</li> <li data-astro-cid-2ciyz5ox>• Wykorzystanie zasobów CPU/RAM</li> <li data-astro-cid-2ciyz5ox>• Przepustowość sieciowa</li> <li data-astro-cid-2ciyz5ox>• Liczba aktywnych połączeń</li> <li data-astro-cid-2ciyz5ox>• Statystyki błędów i powodzeń</li> </ul> </div> <!-- System Integration --> <div class="bg-black/40 border border-[#00d7ef]/20 p-6" data-astro-cid-2ciyz5ox> <h3 class="text-xl font-bold text-[#00d7ef] mb-4" data-astro-cid-2ciyz5ox>
🔗 Integracje Systemowe
</h3> <ul class="space-y-2 text-gray-300" data-astro-cid-2ciyz5ox> <li data-astro-cid-2ciyz5ox>• Cloudflare Workers Analytics</li> <li data-astro-cid-2ciyz5ox>• GitHub Actions deployment</li> <li data-astro-cid-2ciyz5ox>• Slack/Discord notifications</li> <li data-astro-cid-2ciyz5ox>• Email alerts system</li> <li data-astro-cid-2ciyz5ox>• Custom webhooks support</li> </ul> </div> </div> <!-- Quick Actions Panel --> <div class="mt-12 bg-black/40 border border-[#00d7ef]/30 p-8" data-astro-cid-2ciyz5ox> <h3 class="text-2xl font-bold text-[#00d7ef] mb-6 text-center" data-astro-cid-2ciyz5ox>
🛠️ Szybkie Akcje Systemowe
</h3> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-astro-cid-2ciyz5ox> <button onclick="refreshAllWorkers()" class="bg-[#164e63] hover:bg-[#1be1ff] hover:text-black text-white font-semibold py-3 px-6 border border-[#00d7ef]/50 transition-all duration-200 transform hover:-translate-y-1" data-astro-cid-2ciyz5ox>
🔄 Odśwież Status
</button> <button onclick="testAllConnections()" class="bg-[#164e63] hover:bg-[#1be1ff] hover:text-black text-white font-semibold py-3 px-6 border border-[#00d7ef]/50 transition-all duration-200 transform hover:-translate-y-1" data-astro-cid-2ciyz5ox>
🧪 Test Połączeń
</button> <button onclick="downloadLogs()" class="bg-[#164e63] hover:bg-[#1be1ff] hover:text-black text-white font-semibold py-3 px-6 border border-[#00d7ef]/50 transition-all duration-200 transform hover:-translate-y-1" data-astro-cid-2ciyz5ox>
📋 Pobierz Logi
</button> <button onclick="generateReport()" class="bg-[#164e63] hover:bg-[#1be1ff] hover:text-black text-white font-semibold py-3 px-6 border border-[#00d7ef]/50 transition-all duration-200 transform hover:-translate-y-1" data-astro-cid-2ciyz5ox>
📊 Generuj Raport
</button> </div> </div> <!-- Technical Documentation --> <div class="mt-12 bg-black/40 border border-[#00d7ef]/20 p-8" data-astro-cid-2ciyz5ox> <h3 class="text-2xl font-bold text-[#00d7ef] mb-6" data-astro-cid-2ciyz5ox>
📚 Dokumentacja Techniczna
</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300" data-astro-cid-2ciyz5ox> <div data-astro-cid-2ciyz5ox> <h4 class="text-lg font-semibold text-[#1be1ff] mb-3" data-astro-cid-2ciyz5ox>
API Endpoints Monitoring:
</h4> <ul class="space-y-1 text-sm" data-astro-cid-2ciyz5ox> <li data-astro-cid-2ciyz5ox>
• <code class="text-[#00d7ef]" data-astro-cid-2ciyz5ox>/api/workers-status</code> - Status
                  wszystkich workerów
</li> <li data-astro-cid-2ciyz5ox>
• <code class="text-[#00d7ef]" data-astro-cid-2ciyz5ox>/api/generate-image</code> - Generator
                  obrazów Flux
</li> <li data-astro-cid-2ciyz5ox>
• <code class="text-[#00d7ef]" data-astro-cid-2ciyz5ox>/api/chat</code> - OpenAI Chat API
</li> <li data-astro-cid-2ciyz5ox>
• <code class="text-[#00d7ef]" data-astro-cid-2ciyz5ox>/api/bigquery</code> - Google BigQuery
                  integration
</li> <li data-astro-cid-2ciyz5ox>
• <code class="text-[#00d7ef]" data-astro-cid-2ciyz5ox>/api/kaggle</code> - Kaggle datasets
                  API
</li> <li data-astro-cid-2ciyz5ox>
• <code class="text-[#00d7ef]" data-astro-cid-2ciyz5ox>/api/tavi</code> - Tavily search
                  API
</li> </ul> </div> <div data-astro-cid-2ciyz5ox> <h4 class="text-lg font-semibold text-[#1be1ff] mb-3" data-astro-cid-2ciyz5ox>
Worker Services:
</h4> <ul class="space-y-1 text-sm" data-astro-cid-2ciyz5ox> <li data-astro-cid-2ciyz5ox>
• <strong data-astro-cid-2ciyz5ox>Image Worker</strong> - Flux-1 Schnell AI image generation
</li> <li data-astro-cid-2ciyz5ox>
• <strong data-astro-cid-2ciyz5ox>Chat Worker</strong> - OpenAI GPT conversational AI
</li> <li data-astro-cid-2ciyz5ox>
• <strong data-astro-cid-2ciyz5ox>Analytics Worker</strong> - BigQuery data processing
</li> <li data-astro-cid-2ciyz5ox>
• <strong data-astro-cid-2ciyz5ox>Search Worker</strong> - Kaggle & Tavily integration
</li> <li data-astro-cid-2ciyz5ox>
• <strong data-astro-cid-2ciyz5ox>Status Worker</strong> - System monitoring & health checks
</li> </ul> </div> </div> </div> </div> </section> <!-- Footer Navigation --> <section class="border border-edge mt-16" data-astro-cid-2ciyz5ox> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-2ciyz5ox> <div class="flex flex-row justify-between items-center py-8 px-8" data-astro-cid-2ciyz5ox> <div class="text-left" data-astro-cid-2ciyz5ox> <div class="text-gray-400 text-sm italic max-w-md" data-astro-cid-2ciyz5ox>
System monitorowania STATUS WORKERS zapewnia pełną kontrolę nad
              infrastrukturą Cloudflare Workers i związanymi z nią usługami AI.
</div> </div> <div class="flex gap-4" data-astro-cid-2ciyz5ox> <a href="/ai-workers-manager" class="hover:brightness-125 duration-200 text-[#00d7ef]" data-astro-cid-2ciyz5ox>
AI Workers Manager →
</a> <a href="/api-demo" class="hover:brightness-125 duration-200 text-[#00d7ef]" data-astro-cid-2ciyz5ox>
API Demo →
</a> </div> </div> </div> </section> </main> ` })} ${renderScript($$result, "Q:/mybonzo/mybonzo-github/src/pages/status-workers.astro?astro&type=script&index=0&lang.ts")} `;
}, "Q:/mybonzo/mybonzo-github/src/pages/status-workers.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/status-workers.astro";
const $$url = "/status-workers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$StatusWorkers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
