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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../../chunks/vendor_QZhDtzeH.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_UkYhPfz2.mjs';
import { R as RecommendationsWidget } from '../../chunks/RecommendationsWidget_DYUzN469.mjs';
/* empty css                                                           */

const $$PersonalizedRecommendations = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Personalizowane Rekomendacje | MyBonzo AI", "data-astro-cid-hxhlperb": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" data-astro-cid-hxhlperb> <div class="container mx-auto px-4 py-8" data-astro-cid-hxhlperb> <div class="text-center mb-8" data-astro-cid-hxhlperb> <h1 class="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4" data-astro-cid-hxhlperb>
🎯 Personalizowane Rekomendacje
</h1> <p class="text-xl text-slate-300 max-w-3xl mx-auto" data-astro-cid-hxhlperb>
System rekomendacyjny produktów i usług z analizą preferencji użytkowników
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-astro-cid-hxhlperb> <!-- Main Widget --> <div class="lg:col-span-2" data-astro-cid-hxhlperb> ${renderComponent($$result2, "RecommendationsWidget", RecommendationsWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/RecommendationsWidget.svelte", "client:component-export": "default", "data-astro-cid-hxhlperb": true })} </div> <!-- Sidebar Info --> <div class="space-y-6" data-astro-cid-hxhlperb> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-hxhlperb> <h3 class="text-xl font-semibold mb-4 text-cyan-400" data-astro-cid-hxhlperb>Jak to działa</h3> <ul class="space-y-3 text-slate-300" data-astro-cid-hxhlperb> <li class="flex items-center gap-3" data-astro-cid-hxhlperb> <span class="w-2 h-2 bg-cyan-400 rounded-full" data-astro-cid-hxhlperb></span>
Analiza preferencji użytkownika
</li> <li class="flex items-center gap-3" data-astro-cid-hxhlperb> <span class="w-2 h-2 bg-cyan-400 rounded-full" data-astro-cid-hxhlperb></span>
Machine Learning algorithms
</li> <li class="flex items-center gap-3" data-astro-cid-hxhlperb> <span class="w-2 h-2 bg-cyan-400 rounded-full" data-astro-cid-hxhlperb></span>
Personalizowane propozycje
</li> <li class="flex items-center gap-3" data-astro-cid-hxhlperb> <span class="w-2 h-2 bg-cyan-400 rounded-full" data-astro-cid-hxhlperb></span>
Continuous learning
</li> </ul> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-hxhlperb> <h3 class="text-xl font-semibold mb-4 text-cyan-400" data-astro-cid-hxhlperb>Funkcje</h3> <ul class="space-y-3 text-slate-300" data-astro-cid-hxhlperb> <li data-astro-cid-hxhlperb>✨ AI-powered recommendations</li> <li data-astro-cid-hxhlperb>📊 Real-time analytics</li> <li data-astro-cid-hxhlperb>🎯 Targeted suggestions</li> <li data-astro-cid-hxhlperb>📈 Performance tracking</li> </ul> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-hxhlperb> <h3 class="text-xl font-semibold mb-4 text-cyan-400" data-astro-cid-hxhlperb>Status</h3> <div class="flex items-center gap-3" data-astro-cid-hxhlperb> <span class="w-3 h-3 bg-green-400 rounded-full animate-pulse" data-astro-cid-hxhlperb></span> <span class="text-green-400" data-astro-cid-hxhlperb>Aktywny</span> </div> </div> </div> </div> </div> </main> ` })} `;
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
