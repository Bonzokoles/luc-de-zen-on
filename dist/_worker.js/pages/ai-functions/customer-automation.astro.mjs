globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { L as LeadQualificationForm } from '../../chunks/LeadQualificationForm_hLLLUt5K.mjs';
/* empty css                                                  */
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$CustomerAutomation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Automatyzacja Obs\u0139\u201Augi Klienta | MyBonzo AI", "data-astro-cid-mfbpbfh5": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" data-astro-cid-mfbpbfh5> <div class="container mx-auto px-4 py-8" data-astro-cid-mfbpbfh5> <div class="text-center mb-8" data-astro-cid-mfbpbfh5> <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-4" data-astro-cid-mfbpbfh5>
đź“ž Automatyzacja ObsĹ‚ugi Klienta
</h1> <p class="text-xl text-slate-300 max-w-3xl mx-auto" data-astro-cid-mfbpbfh5>
AI do kwalifikacji leadĂłw i automatycznych odpowiedzi z integracjÄ… CRM
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-astro-cid-mfbpbfh5> <!-- Main Content --> <div class="lg:col-span-2 space-y-6" data-astro-cid-mfbpbfh5> <!-- Lead Qualification Form --> ${renderComponent($$result2, "LeadQualificationForm", LeadQualificationForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/LeadQualificationForm.svelte", "client:component-export": "default", "data-astro-cid-mfbpbfh5": true })} <!-- Demo Chat Interface --> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-mfbpbfh5> <h3 class="text-xl font-semibold mb-4 text-pink-400" data-astro-cid-mfbpbfh5>AI Chat Support</h3> <div class="bg-slate-900 rounded-lg p-4 h-80 overflow-y-auto mb-4" id="chatContainer" data-astro-cid-mfbpbfh5> <div class="space-y-3" data-astro-cid-mfbpbfh5> <div class="flex justify-start" data-astro-cid-mfbpbfh5> <div class="bg-blue-600 rounded-lg px-4 py-2 max-w-xs" data-astro-cid-mfbpbfh5> <p class="text-sm" data-astro-cid-mfbpbfh5>Witam! Jak mogÄ™ PaĹ„stwu pomĂłc?</p> </div> </div> <div class="flex justify-end" data-astro-cid-mfbpbfh5> <div class="bg-slate-600 rounded-lg px-4 py-2 max-w-xs" data-astro-cid-mfbpbfh5> <p class="text-sm" data-astro-cid-mfbpbfh5>Interesuje mnie PaĹ„stwa oferta AI</p> </div> </div> <div class="flex justify-start" data-astro-cid-mfbpbfh5> <div class="bg-blue-600 rounded-lg px-4 py-2 max-w-xs" data-astro-cid-mfbpbfh5> <p class="text-sm" data-astro-cid-mfbpbfh5>Ĺšwietnie! Nasza platforma AI oferuje kompleksowe rozwiÄ…zania automatyzacji. Czy mogÄ™ poznaÄ‡ specyfikÄ™ PaĹ„stwa potrzeb?</p> </div> </div> </div> </div> <div class="flex gap-2" data-astro-cid-mfbpbfh5> <input type="text" placeholder="Wpisz wiadomoĹ›Ä‡..." class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400" id="chatInput" data-astro-cid-mfbpbfh5> <button class="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg font-semibold transition-colors" data-astro-cid-mfbpbfh5>
WyĹ›lij
</button> </div> </div> </div> <!-- Sidebar --> <div class="space-y-6" data-astro-cid-mfbpbfh5> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-mfbpbfh5> <h3 class="text-xl font-semibold mb-4 text-pink-400" data-astro-cid-mfbpbfh5>Automatyzacja</h3> <ul class="space-y-3 text-slate-300" data-astro-cid-mfbpbfh5> <li class="flex items-center gap-3" data-astro-cid-mfbpbfh5> <span class="w-2 h-2 bg-pink-400 rounded-full" data-astro-cid-mfbpbfh5></span>
Kwalifikacja leadĂłw
</li> <li class="flex items-center gap-3" data-astro-cid-mfbpbfh5> <span class="w-2 h-2 bg-pink-400 rounded-full" data-astro-cid-mfbpbfh5></span>
Auto-odpowiedzi
</li> <li class="flex items-center gap-3" data-astro-cid-mfbpbfh5> <span class="w-2 h-2 bg-pink-400 rounded-full" data-astro-cid-mfbpbfh5></span>
Integracja CRM
</li> <li class="flex items-center gap-3" data-astro-cid-mfbpbfh5> <span class="w-2 h-2 bg-pink-400 rounded-full" data-astro-cid-mfbpbfh5></span>
Analytics
</li> </ul> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-mfbpbfh5> <h3 class="text-xl font-semibold mb-4 text-pink-400" data-astro-cid-mfbpbfh5>Statystyki</h3> <div class="space-y-3" data-astro-cid-mfbpbfh5> <div class="flex justify-between" data-astro-cid-mfbpbfh5> <span class="text-slate-300" data-astro-cid-mfbpbfh5>Konwersja leadĂłw:</span> <span class="text-green-400 font-semibold" data-astro-cid-mfbpbfh5>85%</span> </div> <div class="flex justify-between" data-astro-cid-mfbpbfh5> <span class="text-slate-300" data-astro-cid-mfbpbfh5>Czas odpowiedzi:</span> <span class="text-blue-400 font-semibold" data-astro-cid-mfbpbfh5>&lt; 2s</span> </div> <div class="flex justify-between" data-astro-cid-mfbpbfh5> <span class="text-slate-300" data-astro-cid-mfbpbfh5>Satysfakcja:</span> <span class="text-yellow-400 font-semibold" data-astro-cid-mfbpbfh5>4.9/5</span> </div> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-mfbpbfh5> <h3 class="text-xl font-semibold mb-4 text-pink-400" data-astro-cid-mfbpbfh5>Integracje</h3> <ul class="space-y-2 text-slate-300 text-sm" data-astro-cid-mfbpbfh5> <li data-astro-cid-mfbpbfh5>đź”— Salesforce</li> <li data-astro-cid-mfbpbfh5>đź”— HubSpot</li> <li data-astro-cid-mfbpbfh5>đź”— Pipedrive</li> <li data-astro-cid-mfbpbfh5>đź”— Zapier</li> <li data-astro-cid-mfbpbfh5>đź”— ActivePieces</li> </ul> </div> </div> </div> </div> </main> ` })} ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/customer-automation.astro?astro&type=script&index=0&lang.ts")} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/customer-automation.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/customer-automation.astro";
const $$url = "/ai-functions/customer-automation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CustomerAutomation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
