globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_HpSis98d.mjs';
import { $ as $$BackroomInterface } from '../../../chunks/BackroomInterface_DxdwxM_T.mjs';
import { T as TavilyWidget } from '../../../chunks/TavilyWidget_BcPo9a33.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$2 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Tavily AI Search" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">🔍 Tavily AI Search & Research</h1> <p class="text-cyber-text-dim mt-4">
Zaawansowane wyszukiwanie internetowe z AI insights i analizą trendów. 
      System łączy się z Tavily API dla kompleksowej analizy informacji.
</p> <div class="mt-8 bg-cyber-dark p-6 border border-cyber-border rounded"> ${renderComponent($$result2, "TavilyWidget", TavilyWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/TavilyWidget.svelte", "client:component-export": "default" })} </div> <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"> <div class="bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">🎯 Funkcje:</h3> <ul class="text-sm text-cyber-text-dim space-y-1"> <li>• Wyszukiwanie z AI insights</li> <li>• Analiza wiarygodności źródeł</li> <li>• Kategoryzacja treści</li> <li>• Historia wyszukiwań</li> </ul> </div> <div class="bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">⚙️ Parametry:</h3> <ul class="text-sm text-cyber-text-dim space-y-1"> <li>• Głębokość wyszukiwania</li> <li>• Dołączanie obrazów</li> <li>• Filtrowanie domen</li> <li>• Liczba wyników</li> </ul> </div> <div class="bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">📊 Analytics:</h3> <ul class="text-sm text-cyber-text-dim space-y-1"> <li>• Wykrywanie trendów</li> <li>• Metryki wydajności</li> <li>• Analiza źródeł</li> <li>• Raportowanie</li> </ul> </div> </div> <div class="mt-8"> <a class="text-cyber-blue hover:text-cyber-blue-bright" href="/hub/functions">← Powrót do listy funkcji</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/2.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/2.astro";
const $$url = "/hub/functions/2";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$2,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
