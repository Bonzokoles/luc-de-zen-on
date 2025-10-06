globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_HpSis98d.mjs';
import { $ as $$BackroomInterface } from '../../../chunks/BackroomInterface_4leLu3ax.mjs';
import { K as KaggleWidget } from '../../../chunks/KaggleWidget_C9AKlbgR.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$3 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Kaggle Dataset Explorer" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">📈 Kaggle Dataset Explorer</h1> <p class="text-cyber-text-dim mt-4">
Przeglądaj i analizuj zbiory danych z ekosystemu Google Analytics Hub. 
      System pozwala na wyszukiwanie, filtrowanie i eksplorację zbiorów danych.
</p> <div class="mt-8 bg-cyber-dark p-6 border border-cyber-border rounded"> ${renderComponent($$result2, "KaggleWidget", KaggleWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/KaggleWidget.svelte", "client:component-export": "default" })} </div> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">🎯 Dostępne zbiory:</h3> <ul class="text-sm text-cyber-text-dim space-y-1"> <li>• Titanic Dataset - klasyfikacja</li> <li>• House Prices - regresja</li> <li>• COVID-19 Global Data</li> <li>• E-commerce Sales Data</li> </ul> </div> <div class="bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">⚙️ Funkcje systemu:</h3> <ul class="text-sm text-cyber-text-dim space-y-1"> <li>• Wyszukiwanie po kategorii</li> <li>• Filtrowanie po tagach</li> <li>• Statystyki popularności</li> <li>• Integracja z GCP Analytics Hub</li> </ul> </div> </div> <div class="mt-8 bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">💡 Przykłady zastosowań:</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3"> <div class="text-sm"> <strong class="text-cyber-blue">Machine Learning:</strong> <p class="text-cyber-text-dim">Trenowanie modeli na zbiorach klasyfikacji i regresji</p> </div> <div class="text-sm"> <strong class="text-cyber-blue">Analiza Biznesowa:</strong> <p class="text-cyber-text-dim">Badanie trendów sprzedaży i zachowań klientów</p> </div> <div class="text-sm"> <strong class="text-cyber-blue">Research:</strong> <p class="text-cyber-text-dim">Analiza danych medycznych, społecznych i naukowych</p> </div> </div> </div> <div class="mt-8"> <a class="text-cyber-blue hover:text-cyber-blue-bright" href="/hub/functions">← Powrót do listy funkcji</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/3.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/3.astro";
const $$url = "/hub/functions/3";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$3,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
