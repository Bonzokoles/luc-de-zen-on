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
import { e as createAstro, c as createComponent, h as addAttribute, f as renderHead, r as renderComponent, b as renderScript, a as renderTemplate } from '../chunks/vendor_DCrrhcp4.mjs';
export { d as renderers } from '../chunks/vendor_DCrrhcp4.mjs';
import { M as MarketingContentGenerator } from '../chunks/MarketingContentGenerator_DVevOwbq.mjs';
import { R as RecommendationsWidget } from '../chunks/RecommendationsWidget_TnnvOk3a.mjs';
import { L as LeadQualificationForm } from '../chunks/LeadQualificationForm_DFV2Bjbi.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$ZaawansowaneFunkcjeAi = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ZaawansowaneFunkcjeAi;
  return renderTemplate`<html lang="pl"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Zaawansowane Funkcje AI - MyBonzo</title><meta name="description" content="System zaawansowanej automatyzacji AI - Generator treści marketingowych, Personalizowane rekomendacje, Automatyzacja obsługi klienta">${renderHead()}</head> <body class="bg-black text-white min-h-screen"> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-black"> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black"></div> <div class="absolute inset-0" style="background-image: 
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;"></div> </div> <main class="relative z-10 min-h-screen"> <!-- Header Section --> <section class="border-b border-cyan-500/30"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-4xl md:text-5xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">
Zaawansowane Funkcje AI
</h1> <p class="text-gray-400 text-lg">
System zaawansowanej automatyzacji z wykorzystaniem sztucznej inteligencji
</p> </div> <div class="text-right text-sm text-gray-500 font-mono"> <div class="mb-1">SYSTEM STATUS: <span class="text-green-400">ONLINE</span></div> <div>AI MODELS: <span class="text-cyan-400">ACTIVE</span></div> </div> </div> <!-- Quote --> <div class="p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 mb-8"> <blockquote class="text-cyan-300 italic font-mono text-center">
"Życie to nie problem do rozwiązania, lecz rzeczywistość do doświadczenia." - Søren Kierkegaard
</blockquote> <div class="text-right text-gray-400 text-sm mt-2 font-mono uppercase tracking-wide">
AUG 2025
</div> </div> <!-- Navigation Cards --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> <a href="#marketing" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
🎯 Generator Treści
</div> <div class="text-gray-400 text-sm font-mono">
Automatyczne generowanie profesjonalnych treści marketingowych
</div> </a> <a href="#recommendations" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
📊 Rekomendacje
</div> <div class="text-gray-400 text-sm font-mono">
System rekomendacji produktów i usług z analizą preferencji
</div> </a> <a href="#leads" class="block p-4 border border-cyan-500/30 rounded-lg bg-gray-900/20 hover:bg-gray-800/30 transition-all duration-300 group"> <div class="text-cyan-300 text-lg font-semibold uppercase tracking-wide mb-2 group-hover:text-cyan-200">
🤖 Obsługa Klienta
</div> <div class="text-gray-400 text-sm font-mono">
AI do kwalifikacji leadów i automatycznych odpowiedzi
</div> </a> </div> </div> </section> <!-- Functions Section --> <section class="py-12"> <div class="max-w-7xl mx-auto px-4 space-y-16"> <!-- Marketing Content Generator --> <div id="marketing" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">1</span>
Automatyczne generowanie treści marketingowych
</h2> <p class="text-gray-400 font-mono max-w-3xl">
Wykorzystuje zaawansowane modele językowe AI do tworzenia profesjonalnych treści marketingowych na podstawie podanego tematu. 
                            System generuje różne rodzaje treści: posty na social media, e-maile marketingowe, opisy produktów i więcej.
</p> </div> ${renderComponent($$result, "MarketingContentGenerator", MarketingContentGenerator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/MarketingContentGenerator.svelte", "client:component-export": "default" })} </div> <!-- Recommendations Widget --> <div id="recommendations" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">2</span>
Personalizowane rekomendacje produktów/usług
</h2> <p class="text-gray-400 font-mono max-w-3xl">
System rekomendacyjny analizuje preferencje użytkownika i historię, aby wygenerować spersonalizowane propozycje produktów i usług. 
                            Wykorzystuje AI do zrozumienia potrzeb klienta i dopasowania najlepszych rozwiązań.
</p> </div> ${renderComponent($$result, "RecommendationsWidget", RecommendationsWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/RecommendationsWidget.svelte", "client:component-export": "default" })} </div> <!-- Lead Qualification Form --> <div id="leads" class="scroll-mt-8"> <div class="mb-8"> <h2 class="text-3xl font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center"> <span class="w-8 h-8 bg-cyan-500 rounded mr-4 flex items-center justify-center text-black font-bold">3</span>
Automatyzacja obsługi klienta i leadów
</h2> <p class="text-gray-400 font-mono max-w-3xl">
Inteligentny system kwalifikacji leadów który automatycznie analizuje zapytania klientów, ocenia ich wartość biznesową 
                            i generuje profesjonalne odpowiedzi. Integruje się z systemami CRM dla pełnej automatyzacji procesów sprzedażowych.
</p> </div> ${renderComponent($$result, "LeadQualificationForm", LeadQualificationForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/LeadQualificationForm.svelte", "client:component-export": "default" })} </div> </div> </section> <!-- Footer --> <footer class="border-t border-cyan-500/30 mt-16"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex justify-between items-center"> <div class="text-gray-400 font-mono text-sm">
© 2025 MyBonzo AI System - Zaawansowane funkcje AI
</div> <div class="text-cyan-400 font-mono text-sm uppercase tracking-wide">
Powered by OpenAI GPT-4
</div> </div> </div> </footer> </main> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/zaawansowane-funkcje-ai.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/zaawansowane-funkcje-ai.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/zaawansowane-funkcje-ai.astro";
const $$url = "/zaawansowane-funkcje-ai";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ZaawansowaneFunkcjeAi,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
