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
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_xZvTY01m.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_BhpsI7E-.mjs';
import { R as RecommendationsWidget } from '../../chunks/RecommendationsWidget_Bnh8d4qx.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_1dOwT_HE.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const $$PersonalizedRecommendations = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Personalizowane Rekomendacje | AI Functions | KAROL LISSON" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, {})} ${maybeRenderHead()}<main class="min-h-svh relative z-10"> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-[#0a0a0a]"> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black"></div> <div class="cyber-grid absolute inset-0"></div> </div> <!-- Header Section --> <section class="relative z-20 border-b border-[#333333] pt-20"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-4xl md:text-5xl font-bold text-[#00ffff] mb-2 uppercase tracking-wider font-['Neuropol']">
Personalizowane Rekomendacje
</h1> <p class="text-[#a0a0a0] text-lg font-['Kenyan_Coffee']">
System rekomendacyjny produktów i usług z analizą preferencji użytkowników
</p> </div> <div class="text-right text-sm text-[#a0a0a0] font-mono"> <div class="mb-1">
STATUS: <span class="text-[#00ffff]">ANALYZING</span> </div> <div>ML ACCURACY: <span class="text-[#00ffff]">97.2%</span></div> </div> </div> <!-- Navigation --> <div class="flex gap-4 mb-8"> <a href="/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm">
← Powrót do głównej
</a> <a href="/zaawansowane-funkcje-ai" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm">
Wszystkie funkcje AI
</a> </div> </div> </section> <!-- Main Content --> <section class="relative z-20 py-12"> <div class="max-w-4xl mx-auto px-4"> <!-- Recommendations Widget --> ${renderComponent($$result2, "RecommendationsWidget", RecommendationsWidget, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/RecommendationsWidget.svelte", "client:component-export": "default" })} <!-- Features Description --> <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect"> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']">Jak to działa</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']"> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Analiza preferencji użytkownika
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Machine Learning algorithms
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Personalizowane propozycje
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Continuous learning
</li> </ul> </div> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect"> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']">Funkcje</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']"> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
AI-powered recommendations
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Real-time analytics
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Targeted suggestions
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Performance tracking
</li> </ul> </div> </div> </div> </section> </main> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/personalized-recommendations.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/personalized-recommendations.astro";
const $$url = "/ai-functions/personalized-recommendations";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PersonalizedRecommendations,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
