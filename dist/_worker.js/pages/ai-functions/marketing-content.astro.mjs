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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/vendor_BHZTJLV0.mjs';
export { d as renderers } from '../../chunks/vendor_BHZTJLV0.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_DH5CUiol.mjs';
import { M as MarketingContentGenerator } from '../../chunks/MarketingContentGenerator_BsHM6yJT.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_CfAAnw2w.mjs';
/* empty css                                                */

const $$MarketingContent = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Generator tre\u015Bci marketingowych | AI Functions | KAROL LISSON", "data-astro-cid-yw4jxik4": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-yw4jxik4": true })} ${maybeRenderHead()}<main class="min-h-svh relative z-10" data-astro-cid-yw4jxik4> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-[#0a0a0a]" data-astro-cid-yw4jxik4> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black" data-astro-cid-yw4jxik4></div> <div class="cyber-grid absolute inset-0" data-astro-cid-yw4jxik4></div> </div> <!-- Header Section --> <section class="relative z-20 border-b border-[#333333] pt-20" data-astro-cid-yw4jxik4> <div class="max-w-6xl mx-auto px-4 py-8" data-astro-cid-yw4jxik4> <div class="flex items-center justify-between mb-8" data-astro-cid-yw4jxik4> <div data-astro-cid-yw4jxik4> <h1 class="text-4xl md:text-5xl font-bold text-[#00ffff] mb-2 uppercase tracking-wider font-['Neuropol']" data-astro-cid-yw4jxik4>
Generator treści marketingowych
</h1> <p class="text-[#a0a0a0] text-lg font-['Kenyan_Coffee']" data-astro-cid-yw4jxik4>
Automatyczne generowanie profesjonalnych treści marketingowych
              przy użyciu AI
</p> </div> <div class="text-right text-sm text-[#a0a0a0] font-mono" data-astro-cid-yw4jxik4> <div class="mb-1" data-astro-cid-yw4jxik4>
STATUS: <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>ONLINE</span> </div> <div data-astro-cid-yw4jxik4>AI MODEL: <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>GPT-4</span></div> </div> </div> <!-- Navigation --> <div class="flex gap-4 mb-8" data-astro-cid-yw4jxik4> <a href="/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-yw4jxik4>
← Powrót do głównej
</a> <a href="/zaawansowane-funkcje-ai" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-yw4jxik4>
Wszystkie funkcje AI
</a> </div> </div> </section> <!-- Main Content --> <section class="relative z-20 py-12" data-astro-cid-yw4jxik4> <div class="max-w-4xl mx-auto px-4" data-astro-cid-yw4jxik4> <!-- Marketing Content Generator Widget --> ${renderComponent($$result2, "MarketingContentGenerator", MarketingContentGenerator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/MarketingContentGenerator.svelte", "client:component-export": "default", "data-astro-cid-yw4jxik4": true })} <!-- Features Description --> <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-yw4jxik4> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-yw4jxik4> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-yw4jxik4>
Funkcjonalności
</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']" data-astro-cid-yw4jxik4> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>✓</span>
Generowanie postów na social media
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>✓</span>
E-maile marketingowe z CTA
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>✓</span>
Opisy produktów dla e-commerce
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>✓</span>
Artykuły na blog biznesowy
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>✓</span>
Treści reklamowe i newslettery
</li> </ul> </div> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-yw4jxik4> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-yw4jxik4>
Możliwości
</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']" data-astro-cid-yw4jxik4> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>⚡</span>
Natychmiastowe generowanie treści
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>⚡</span>
Profesjonalny ton komunikacji
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>⚡</span>
Automatyczne Call-to-Action
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>⚡</span>
Kopiowanie jednym kliknięciem
</li> <li class="flex items-center gap-2" data-astro-cid-yw4jxik4> <span class="text-[#00ffff]" data-astro-cid-yw4jxik4>⚡</span>
Integracja z ActivePieces
</li> </ul> </div> </div> <!-- Integration Info --> <div class="mt-8 p-6 bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 border border-[#00ffff]/30 glass-effect" data-astro-cid-yw4jxik4> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-yw4jxik4>
🔗 Integracja i automatyzacja
</h3> <p class="text-[#e0e0e0] mb-4 font-['Kenyan_Coffee']" data-astro-cid-yw4jxik4>
Generator treści marketingowych może być zintegrowany z ActivePieces
            do automatycznej publikacji na platformach social media oraz z
            systemami CRM do personalizacji komunikacji z klientami.
</p> <div class="flex gap-4" data-astro-cid-yw4jxik4> <span class="px-3 py-1 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] text-sm font-['Neuropol'] uppercase tracking-wide" data-astro-cid-yw4jxik4>
OpenAI GPT-4
</span> <span class="px-3 py-1 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] text-sm font-['Neuropol'] uppercase tracking-wide" data-astro-cid-yw4jxik4>
ActivePieces Ready
</span> <span class="px-3 py-1 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] text-sm font-['Neuropol'] uppercase tracking-wide" data-astro-cid-yw4jxik4>
Real-time API
</span> </div> </div> </div> </section> </main> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/marketing-content.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/marketing-content.astro";
const $$url = "/ai-functions/marketing-content";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MarketingContent,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
