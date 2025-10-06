globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_HpSis98d.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_DxdwxM_T.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "AI Analytics Functions" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">🚀 AI Analytics Functions</h1> <p class="text-cyber-text-dim mt-4">Zaawansowane funkcje analityczne z integracją AI i zewnętrznymi API</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"> <a class="block p-6 border border-cyber-border hover:border-cyber-blue transition-colors bg-cyber-dark" href="/hub/functions/1"> <div class="text-cyber-blue text-2xl mb-3">📊</div> <h3 class="text-lg font-semibold text-cyber-blue mb-2">BigQuery SQL Analytics</h3> <p class="text-sm text-cyber-text-dim">Wykonuj zaawansowane zapytania SQL na zbiorach Google BigQuery</p> <div class="mt-3 text-xs text-cyber-blue">Google Cloud • SQL • Analytics</div> </a> <a class="block p-6 border border-cyber-border hover:border-cyber-blue transition-colors bg-cyber-dark" href="/hub/functions/2"> <div class="text-cyber-blue text-2xl mb-3">🔍</div> <h3 class="text-lg font-semibold text-cyber-blue mb-2">Tavily AI Search</h3> <p class="text-sm text-cyber-text-dim">Inteligentne wyszukiwanie internetowe z AI insights</p> <div class="mt-3 text-xs text-cyber-blue">AI Search • Research • Trends</div> </a> <a class="block p-6 border border-cyber-border hover:border-cyber-blue transition-colors bg-cyber-dark" href="/hub/functions/3"> <div class="text-cyber-blue text-2xl mb-3">📈</div> <h3 class="text-lg font-semibold text-cyber-blue mb-2">Kaggle Dataset Explorer</h3> <p class="text-sm text-cyber-text-dim">Przeglądaj zbiory danych z Google Analytics Hub</p> <div class="mt-3 text-xs text-cyber-blue">Datasets • ML • Analytics</div> </a> </div> <div class="mt-12 bg-cyber-dark p-6 border border-cyber-border rounded"> <h2 class="text-xl font-bold text-cyber-blue mb-4">🎯 Status Implementacji</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> <div class="bg-black p-4 rounded border border-green-600"> <div class="text-green-400 font-semibold">✅ BigQuery</div> <div class="text-sm text-gray-400">Przykładowe dane + API ready</div> </div> <div class="bg-black p-4 rounded border border-green-600"> <div class="text-green-400 font-semibold">✅ Tavily Search</div> <div class="text-sm text-gray-400">Demo data + AI integration</div> </div> <div class="bg-black p-4 rounded border border-green-600"> <div class="text-green-400 font-semibold">✅ Kaggle Explorer</div> <div class="text-sm text-gray-400">Sample datasets + GCP ready</div> </div> </div> </div> <div class="mt-8"> <a class="text-cyber-blue hover:text-cyber-blue-bright" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/index.astro";
const $$url = "/hub/functions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
