globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_HpSis98d.mjs';
import { $ as $$BackroomInterface } from '../../../chunks/BackroomInterface_DxdwxM_T.mjs';
import { B as BigQueryWidget } from '../../../chunks/BigQueryWidget_CgXuQaYR.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "BigQuery SQL Analytics" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">📊 BigQuery SQL Analytics</h1> <p class="text-cyber-text-dim mt-4">
Wykonuj zapytania SQL na zbiorach danych Google BigQuery. 
      System jest połączony z Google Cloud i pozwala na analizę publicznych zbiorów danych.
</p> <div class="mt-8 bg-cyber-dark p-6 border border-cyber-border rounded"> ${renderComponent($$result2, "BigQueryWidget", BigQueryWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BigQueryWidget.svelte", "client:component-export": "default" })} </div> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">Przykładowe zapytania:</h3> <ul class="text-sm text-cyber-text-dim space-y-1"> <li>• SELECT 1 as test_column</li> <li>• Analiza repozytoriów GitHub</li> <li>• Statystyki języków programowania</li> <li>• Dane o commitach i autorach</li> </ul> </div> <div class="bg-cyber-dark p-4 border border-cyber-border rounded"> <h3 class="text-cyber-blue font-semibold mb-2">Możliwości:</h3> <ul class="text-sm text-cyber-text-dim space-y-1"> <li>• Publiczne zbiory Google</li> <li>• Przykładowe dane demo</li> <li>• Analiza wydajności zapytań</li> <li>• Integracja z GCP</li> </ul> </div> </div> <div class="mt-8"> <a class="text-cyber-blue hover:text-cyber-blue-bright" href="/hub/functions">← Powrót do listy funkcji</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/1.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/1.astro";
const $$url = "/hub/functions/1";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$1,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
