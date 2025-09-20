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
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/vendor_DlPT8CWO.mjs';
export { d as renderers } from '../../chunks/vendor_DlPT8CWO.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_CINJPwTU.mjs';
import { L as LeadQualificationForm } from '../../chunks/LeadQualificationForm_DQZWT2qP.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_DImmitW3.mjs';

const $$CustomerAutomation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Automatyzacja Obs\u0142ugi Klienta | AI Functions | KAROL LISSON" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, {})} ${maybeRenderHead()}<main class="min-h-svh relative z-10"> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-[#0a0a0a]"> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black"></div> <div class="cyber-grid absolute inset-0"></div> </div> <!-- Header Section --> <section class="relative z-20 border-b border-[#333333] pt-20"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-4xl md:text-5xl font-bold text-[#00ffff] mb-2 uppercase tracking-wider font-['Neuropol']">
Automatyzacja Obsługi Klienta
</h1> <p class="text-[#a0a0a0] text-lg font-['Kenyan_Coffee']">
AI do kwalifikacji leadów i automatycznych odpowiedzi z integracją CRM
</p> </div> <div class="text-right text-sm text-[#a0a0a0] font-mono"> <div class="mb-1">
STATUS: <span class="text-[#00ffff]">ACTIVE</span> </div> <div>LEADS: <span class="text-[#00ffff] animate-pulse">47 new</span></div> </div> </div> <!-- Navigation --> <div class="flex gap-4 mb-8"> <a href="/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm">
← Powrót do głównej
</a> <a href="/zaawansowane-funkcje-ai" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm">
Wszystkie funkcje AI
</a> </div> </div> </section> <div class="max-w-4xl mx-auto px-4"> <!-- Lead Qualification Form --> ${renderComponent($$result2, "LeadQualificationForm", LeadQualificationForm, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/LeadQualificationForm.svelte", "client:component-export": "default" })} <!-- Demo Chat Interface --> <div class="mt-12 p-6 bg-[#111111] border border-[#333333] glass-effect"> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']">AI Chat Support</h3> <div class="bg-[#0a0a0a] border border-[#333333] rounded-lg p-4 h-80 overflow-y-auto mb-4" id="chatContainer"> <div class="space-y-3"> <div class="flex justify-start"> <div class="bg-[#00ffff] text-[#0a0a0a] rounded-lg px-4 py-2 max-w-xs"> <p class="text-sm font-semibold">Witam! Jak mogę Państwu pomóc?</p> </div> </div> <div class="flex justify-end"> <div class="bg-[#333333] text-[#e0e0e0] rounded-lg px-4 py-2 max-w-xs"> <p class="text-sm">Interesuje mnie Państwa oferta AI</p> </div> </div> <div class="flex justify-start"> <div class="bg-[#00ffff] text-[#0a0a0a] rounded-lg px-4 py-2 max-w-xs"> <p class="text-sm font-semibold">Świetnie! Nasza platforma AI oferuje kompleksowe rozwiązania automatyzacji. Czy mogę poznać specyfikę Państwa potrzeb?</p> </div> </div> </div> </div> <div class="flex gap-2"> <input type="text" placeholder="Wpisz wiadomość..." class="flex-1 bg-white border border-[#333333] rounded-lg px-4 py-2 text-black placeholder-gray-500" id="chatInput"> <button class="bg-[#00ffff] hover:brightness-125 text-[#0a0a0a] px-4 py-2 rounded-lg font-bold transition-all duration-300 uppercase font-['Neuropol']">
Wyślij
</button> </div> </div> <!-- Features Description --> <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect"> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']">Automatyzacja</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']"> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Kwalifikacja leadów
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Auto-odpowiedzi
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Integracja CRM
</li> <li class="flex items-center gap-2"> <span class="text-[#00ffff]">✓</span>
Analytics
</li> </ul> </div> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect"> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']">Statystyki</h3> <div class="space-y-3 text-[#e0e0e0] font-['Kenyan_Coffee']"> <div class="flex justify-between"> <span>Konwersja leadów:</span> <span class="text-[#00ffff] font-bold">85%</span> </div> <div class="flex justify-between"> <span class="text-slate-300">Czas odpowiedzi:</span> <span class="text-blue-400 font-semibold">&lt; 2s</span> </div> <div class="flex justify-between"> <span class="text-slate-300">Satysfakcja:</span> <span class="text-yellow-400 font-semibold">4.9/5</span> </div> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6"> <h3 class="text-xl font-semibold mb-4 text-pink-400">Integracje</h3> <ul class="space-y-2 text-slate-300 text-sm"> <li>🔗 Salesforce</li> <li>🔗 HubSpot</li> <li>🔗 Pipedrive</li> <li>🔗 Zapier</li> <li>🔗 ActivePieces</li> </ul> </div> </div> </div> </main> ` })} ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/customer-automation.astro?astro&type=script&index=0&lang.ts")}`;
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
