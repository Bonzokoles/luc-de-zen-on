globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { F as FAQGeneratorWidget } from '../../chunks/FAQGeneratorWidget_BtrZPV4I.mjs';
/* empty css                                          */
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$DynamicFaq = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Generator FAQ Dynamiczny | MyBonzo AI", "data-astro-cid-upcmgyo4": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" data-astro-cid-upcmgyo4> <div class="container mx-auto px-4 py-8" data-astro-cid-upcmgyo4> <div class="text-center mb-8" data-astro-cid-upcmgyo4> <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4" data-astro-cid-upcmgyo4>
âť“ Generator FAQ Dynamiczny
</h1> <p class="text-xl text-slate-300 max-w-3xl mx-auto" data-astro-cid-upcmgyo4>
AI generujÄ…cy dynamicznie pytania i odpowiedzi na podstawie bazy wiedzy
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-astro-cid-upcmgyo4> <!-- Main FAQ Generator --> <div class="lg:col-span-2" data-astro-cid-upcmgyo4> ${renderComponent($$result2, "FAQGeneratorWidget", FAQGeneratorWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/FAQGeneratorWidget.svelte", "client:component-export": "default", "data-astro-cid-upcmgyo4": true })} <!-- Generated FAQ Display --> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-6" data-astro-cid-upcmgyo4> <h3 class="text-xl font-semibold mb-4 text-purple-400" data-astro-cid-upcmgyo4>Wygenerowane FAQ</h3> <div class="space-y-4" data-astro-cid-upcmgyo4> <div class="border-l-4 border-purple-400 pl-4" data-astro-cid-upcmgyo4> <h4 class="font-semibold text-white mb-2" data-astro-cid-upcmgyo4>Q: Jak dziaĹ‚a system AI MyBonzo?</h4> <p class="text-slate-300 text-sm" data-astro-cid-upcmgyo4>
A: System MyBonzo wykorzystuje zaawansowane modele AI do automatyzacji procesĂłw biznesowych. 
                  Integruje multiple providery jak OpenAI, Anthropic, Google AI, oferujÄ…c kompleksowe rozwiÄ…zania.
</p> </div> <div class="border-l-4 border-purple-400 pl-4" data-astro-cid-upcmgyo4> <h4 class="font-semibold text-white mb-2" data-astro-cid-upcmgyo4>Q: Jakie sÄ… koszty korzystania z platformy?</h4> <p class="text-slate-300 text-sm" data-astro-cid-upcmgyo4>
A: Oferujemy elastyczne pakiety cenowe dostosowane do potrzeb. Podstawowy plan startuje od 99zĹ‚/miesiÄ…c 
                  z moĹĽliwoĹ›ciÄ… skalowania w zaleĹĽnoĹ›ci od uĹĽycia.
</p> </div> <div class="border-l-4 border-purple-400 pl-4" data-astro-cid-upcmgyo4> <h4 class="font-semibold text-white mb-2" data-astro-cid-upcmgyo4>Q: Czy oferujecie wsparcie techniczne?</h4> <p class="text-slate-300 text-sm" data-astro-cid-upcmgyo4>
A: Tak, zapewniamy peĹ‚ne wsparcie techniczne 24/7 poprzez chat, email i telefon. 
                  Dodatkowo oferujemy onboarding i szkolenia dla zespoĹ‚Ăłw.
</p> </div> <div class="border-l-4 border-purple-400 pl-4" data-astro-cid-upcmgyo4> <h4 class="font-semibold text-white mb-2" data-astro-cid-upcmgyo4>Q: Jak bezpieczne sÄ… dane w systemie?</h4> <p class="text-slate-300 text-sm" data-astro-cid-upcmgyo4>
A: BezpieczeĹ„stwo to nasz priorytet. Wykorzystujemy szyfrowanie end-to-end, 
                  certyfikaty SSL, oraz compliance z RODO i SOC 2.
</p> </div> </div> <div class="mt-6 flex gap-3" data-astro-cid-upcmgyo4> <button class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition-colors" data-astro-cid-upcmgyo4>
đź”„ Regeneruj FAQ
</button> <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors" data-astro-cid-upcmgyo4>
đź“‹ Eksportuj
</button> <button class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors" data-astro-cid-upcmgyo4>
đźŚ Publikuj na stronie
</button> </div> </div> </div> <!-- Sidebar --> <div class="space-y-6" data-astro-cid-upcmgyo4> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-upcmgyo4> <h3 class="text-xl font-semibold mb-4 text-purple-400" data-astro-cid-upcmgyo4>AI Configuration</h3> <div class="space-y-3" data-astro-cid-upcmgyo4> <div data-astro-cid-upcmgyo4> <label class="block text-sm font-medium text-slate-300 mb-2" data-astro-cid-upcmgyo4>Model AI</label> <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" data-astro-cid-upcmgyo4> <option value="gpt-4" data-astro-cid-upcmgyo4>GPT-4</option> <option value="claude" data-astro-cid-upcmgyo4>Claude 3.5</option> <option value="gemini" data-astro-cid-upcmgyo4>Gemini Pro</option> </select> </div> <div data-astro-cid-upcmgyo4> <label class="block text-sm font-medium text-slate-300 mb-2" data-astro-cid-upcmgyo4>Ton odpowiedzi</label> <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" data-astro-cid-upcmgyo4> <option value="professional" data-astro-cid-upcmgyo4>Profesjonalny</option> <option value="friendly" data-astro-cid-upcmgyo4>Przyjazny</option> <option value="technical" data-astro-cid-upcmgyo4>Techniczny</option> <option value="casual" data-astro-cid-upcmgyo4>Swobodny</option> </select> </div> <div data-astro-cid-upcmgyo4> <label class="block text-sm font-medium text-slate-300 mb-2" data-astro-cid-upcmgyo4>DĹ‚ugoĹ›Ä‡ odpowiedzi</label> <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" data-astro-cid-upcmgyo4> <option value="short" data-astro-cid-upcmgyo4>KrĂłtkie</option> <option value="medium" data-astro-cid-upcmgyo4>Ĺšrednie</option> <option value="detailed" data-astro-cid-upcmgyo4>SzczegĂłĹ‚owe</option> </select> </div> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-upcmgyo4> <h3 class="text-xl font-semibold mb-4 text-purple-400" data-astro-cid-upcmgyo4>Statystyki</h3> <div class="space-y-3" data-astro-cid-upcmgyo4> <div class="flex justify-between" data-astro-cid-upcmgyo4> <span class="text-slate-300" data-astro-cid-upcmgyo4>FAQ wygenerowane:</span> <span class="text-green-400 font-semibold" data-astro-cid-upcmgyo4>156</span> </div> <div class="flex justify-between" data-astro-cid-upcmgyo4> <span class="text-slate-300" data-astro-cid-upcmgyo4>Pytania dzisiaj:</span> <span class="text-blue-400 font-semibold" data-astro-cid-upcmgyo4>23</span> </div> <div class="flex justify-between" data-astro-cid-upcmgyo4> <span class="text-slate-300" data-astro-cid-upcmgyo4>TrafnoĹ›Ä‡ AI:</span> <span class="text-yellow-400 font-semibold" data-astro-cid-upcmgyo4>94%</span> </div> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-upcmgyo4> <h3 class="text-xl font-semibold mb-4 text-purple-400" data-astro-cid-upcmgyo4>Funkcje</h3> <ul class="space-y-2 text-slate-300 text-sm" data-astro-cid-upcmgyo4> <li data-astro-cid-upcmgyo4>đź¤– Auto-generowanie FAQ</li> <li data-astro-cid-upcmgyo4>đź”Ť Analiza czÄ™sto zadawanych pytaĹ„</li> <li data-astro-cid-upcmgyo4>đź“ť Multiple output formats</li> <li data-astro-cid-upcmgyo4>đźŚ Direct website integration</li> <li data-astro-cid-upcmgyo4>đź“Š Usage analytics</li> <li data-astro-cid-upcmgyo4>đź”„ Auto-updates</li> </ul> </div> </div> </div> </div> </main> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/dynamic-faq.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/dynamic-faq.astro";
const $$url = "/ai-functions/dynamic-faq";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DynamicFaq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
