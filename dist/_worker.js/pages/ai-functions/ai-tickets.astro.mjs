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
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_B_W4wGYR.mjs';
import { T as TicketSubmissionWidget } from '../../chunks/TicketSubmissionWidget_ZZEDDkfU.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_1dOwT_HE.mjs';
/* empty css                                         */
export { r as renderers } from '../../chunks/_@astro-renderers_CHiEcNgA.mjs';

const $$AiTickets = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "System ticket\xF3w AI | AI Functions | KAROL LISSON", "data-astro-cid-6t3e7dfk": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-6t3e7dfk": true })} ${maybeRenderHead()}<main class="min-h-svh relative z-10" data-astro-cid-6t3e7dfk> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-[#0a0a0a]" data-astro-cid-6t3e7dfk> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black" data-astro-cid-6t3e7dfk></div> <div class="cyber-grid absolute inset-0" data-astro-cid-6t3e7dfk></div> </div> <!-- Header Section --> <section class="relative z-20 border-b border-[#333333] pt-20" data-astro-cid-6t3e7dfk> <div class="max-w-6xl mx-auto px-4 py-8" data-astro-cid-6t3e7dfk> <div class="flex items-center justify-between mb-8" data-astro-cid-6t3e7dfk> <div data-astro-cid-6t3e7dfk> <h1 class="text-4xl md:text-5xl font-bold text-[#00ffff] mb-2 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6t3e7dfk>
System ticketów AI
</h1> <p class="text-[#a0a0a0] text-lg font-['Kenyan_Coffee']" data-astro-cid-6t3e7dfk>
Automatyczna klasyfikacja zgłoszeń z integracją Jira/Zendesk
</p> </div> <div class="text-right text-sm text-[#a0a0a0] font-mono" data-astro-cid-6t3e7dfk> <div class="mb-1" data-astro-cid-6t3e7dfk>
STATUS: <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>PROCESSING</span> </div> <div data-astro-cid-6t3e7dfk>
QUEUE: <span class="text-[#00ffff] animate-pulse" data-astro-cid-6t3e7dfk>23 tickets</span> </div> </div> </div> <!-- Navigation --> <div class="flex gap-4 mb-8" data-astro-cid-6t3e7dfk> <a href="/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-6t3e7dfk>
← Powrót do głównej
</a> <a href="/zaawansowane-funkcje-ai" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-6t3e7dfk>
Wszystkie funkcje AI
</a> </div> </div> </section> <!-- Main Content --> <section class="relative z-20 py-12" data-astro-cid-6t3e7dfk> <div class="max-w-4xl mx-auto px-4" data-astro-cid-6t3e7dfk> <!-- Ticket Submission Widget --> ${renderComponent($$result2, "TicketSubmissionWidget", TicketSubmissionWidget, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/TicketSubmissionWidget.svelte", "client:component-export": "default", "data-astro-cid-6t3e7dfk": true })} <!-- Features Description --> <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-6t3e7dfk> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6t3e7dfk> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6t3e7dfk>
Funkcjonalności
</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']" data-astro-cid-6t3e7dfk> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>✓</span>
Automatyczna klasyfikacja zgłoszeń
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>✓</span>
Priorytetyzacja na podstawie pilności
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>✓</span>
Przypisywanie do odpowiednich zespołów
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>✓</span>
Integracja z Jira, Zendesk, ServiceNow
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>✓</span>
Automatyczne odpowiedzi i eskalacja
</li> </ul> </div> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6t3e7dfk> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6t3e7dfk>
Możliwości AI
</h3> <ul class="space-y-2 text-[#e0e0e0] font-['Kenyan_Coffee']" data-astro-cid-6t3e7dfk> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>⚡</span>
Analiza sentymentu i pilności
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>⚡</span>
Przewidywanie czasu rozwiązania
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>⚡</span>
Sugerowanie rozwiązań z bazy wiedzy
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>⚡</span>
Wykrywanie duplikatów
</li> <li class="flex items-center gap-2" data-astro-cid-6t3e7dfk> <span class="text-[#00ffff]" data-astro-cid-6t3e7dfk>⚡</span>
Automatyzacja workflow
</li> </ul> </div> </div> <!-- Classification System --> <div class="mt-8 p-6 bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 border border-[#00ffff]/30 glass-effect" data-astro-cid-6t3e7dfk> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6t3e7dfk>
🎯 System klasyfikacji
</h3> <div class="grid grid-cols-1 md:grid-cols-4 gap-4" data-astro-cid-6t3e7dfk> <div class="text-center p-4 bg-red-900/30 border border-red-400/50" data-astro-cid-6t3e7dfk> <div class="text-3xl mb-2" data-astro-cid-6t3e7dfk>🚨</div> <div class="text-lg font-bold text-red-400 font-['Neuropol']" data-astro-cid-6t3e7dfk>
CRITICAL
</div> <div class="text-xs text-[#a0a0a0] uppercase tracking-wide" data-astro-cid-6t3e7dfk>
System Down
</div> <div class="text-xs text-red-300 mt-1" data-astro-cid-6t3e7dfk>≤ 1h SLA</div> </div> <div class="text-center p-4 bg-orange-900/30 border border-orange-400/50" data-astro-cid-6t3e7dfk> <div class="text-3xl mb-2" data-astro-cid-6t3e7dfk>⚠️</div> <div class="text-lg font-bold text-orange-400 font-['Neuropol']" data-astro-cid-6t3e7dfk>
HIGH
</div> <div class="text-xs text-[#a0a0a0] uppercase tracking-wide" data-astro-cid-6t3e7dfk>
Business Impact
</div> <div class="text-xs text-orange-300 mt-1" data-astro-cid-6t3e7dfk>≤ 4h SLA</div> </div> <div class="text-center p-4 bg-yellow-900/30 border border-yellow-400/50" data-astro-cid-6t3e7dfk> <div class="text-3xl mb-2" data-astro-cid-6t3e7dfk>📋</div> <div class="text-lg font-bold text-yellow-400 font-['Neuropol']" data-astro-cid-6t3e7dfk>
MEDIUM
</div> <div class="text-xs text-[#a0a0a0] uppercase tracking-wide" data-astro-cid-6t3e7dfk>
Functionality
</div> <div class="text-xs text-yellow-300 mt-1" data-astro-cid-6t3e7dfk>≤ 24h SLA</div> </div> <div class="text-center p-4 bg-green-900/30 border border-green-400/50" data-astro-cid-6t3e7dfk> <div class="text-3xl mb-2" data-astro-cid-6t3e7dfk>💡</div> <div class="text-lg font-bold text-green-400 font-['Neuropol']" data-astro-cid-6t3e7dfk>
LOW
</div> <div class="text-xs text-[#a0a0a0] uppercase tracking-wide" data-astro-cid-6t3e7dfk>
Enhancement
</div> <div class="text-xs text-green-300 mt-1" data-astro-cid-6t3e7dfk>≤ 72h SLA</div> </div> </div> </div> <!-- Team Assignment --> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-6t3e7dfk> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6t3e7dfk> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6t3e7dfk>
👥 Automatyczne przypisywanie
</h3> <div class="space-y-3" data-astro-cid-6t3e7dfk> <div class="flex justify-between items-center p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6t3e7dfk> <div data-astro-cid-6t3e7dfk> <div class="font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6t3e7dfk>
TECHNICAL SUPPORT
</div> <div class="text-xs text-[#a0a0a0]" data-astro-cid-6t3e7dfk>
Błędy systemu, API, integrace
</div> </div> <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-['Neuropol'] uppercase" data-astro-cid-6t3e7dfk>12 tickets</span> </div> <div class="flex justify-between items-center p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6t3e7dfk> <div data-astro-cid-6t3e7dfk> <div class="font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6t3e7dfk>
CUSTOMER SUCCESS
</div> <div class="text-xs text-[#a0a0a0]" data-astro-cid-6t3e7dfk>
Onboarding, szkolenia, konsultacje
</div> </div> <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-['Neuropol'] uppercase" data-astro-cid-6t3e7dfk>7 tickets</span> </div> <div class="flex justify-between items-center p-3 bg-[#00ffff]/10 border border-[#00ffff]/30" data-astro-cid-6t3e7dfk> <div data-astro-cid-6t3e7dfk> <div class="font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6t3e7dfk>
BILLING & ACCOUNT
</div> <div class="text-xs text-[#a0a0a0]" data-astro-cid-6t3e7dfk>
Płatności, faktury, zmiany planu
</div> </div> <span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-['Neuropol'] uppercase" data-astro-cid-6t3e7dfk>4 tickets</span> </div> </div> </div> <div class="p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6t3e7dfk> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6t3e7dfk>
📊 Statystyki obsługi
</h3> <div class="p-4 bg-[#111111]/50 border border-[#333333] rounded" data-astro-cid-6t3e7dfk> <p class="text-[#a0a0a0] text-sm font-['Kenyan_Coffee'] italic" data-astro-cid-6t3e7dfk>
📊 Statystyki obsługi będą wyświetlane po skonfigurowaniu
                systemu ticketów.
</p> </div> </div> </div> <!-- Integration Systems --> <div class="mt-8 p-6 bg-[#111111] border border-[#333333] glass-effect" data-astro-cid-6t3e7dfk> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']" data-astro-cid-6t3e7dfk>
🔗 Integracje systemów ticketowych
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-astro-cid-6t3e7dfk> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-center" data-astro-cid-6t3e7dfk> <div class="text-lg font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6t3e7dfk>
JIRA
</div> <div class="text-xs text-[#a0a0a0]" data-astro-cid-6t3e7dfk>Atlassian Suite</div> <div class="mt-2" data-astro-cid-6t3e7dfk> <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-['Neuropol'] uppercase" data-astro-cid-6t3e7dfk>Connected</span> </div> </div> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-center" data-astro-cid-6t3e7dfk> <div class="text-lg font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6t3e7dfk>
ZENDESK
</div> <div class="text-xs text-[#a0a0a0]" data-astro-cid-6t3e7dfk>Customer Service</div> <div class="mt-2" data-astro-cid-6t3e7dfk> <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-['Neuropol'] uppercase" data-astro-cid-6t3e7dfk>Connected</span> </div> </div> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-center" data-astro-cid-6t3e7dfk> <div class="text-lg font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6t3e7dfk>
SERVICENOW
</div> <div class="text-xs text-[#a0a0a0]" data-astro-cid-6t3e7dfk>ITSM Platform</div> <div class="mt-2" data-astro-cid-6t3e7dfk> <span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-['Neuropol'] uppercase" data-astro-cid-6t3e7dfk>Setup</span> </div> </div> <div class="p-3 bg-[#00ffff]/10 border border-[#00ffff]/30 text-center" data-astro-cid-6t3e7dfk> <div class="text-lg font-bold text-[#00ffff] font-['Neuropol']" data-astro-cid-6t3e7dfk>
FRESHDESK
</div> <div class="text-xs text-[#a0a0a0]" data-astro-cid-6t3e7dfk>Cloud Helpdesk</div> <div class="mt-2" data-astro-cid-6t3e7dfk> <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-['Neuropol'] uppercase" data-astro-cid-6t3e7dfk>Connected</span> </div> </div> </div> <div class="mt-6 p-4 bg-gradient-to-r from-cyan-800/20 to-blue-800/20 border border-[#00ffff]/20" data-astro-cid-6t3e7dfk> <p class="text-[#e0e0e0] text-sm font-['Kenyan_Coffee']" data-astro-cid-6t3e7dfk> <strong class="text-[#00ffff]" data-astro-cid-6t3e7dfk>ActivePieces Integration:</strong>
Automatyczne workflow zapewniają synchronizację ticketów między wszystkimi
              systemami, powiadomienia email/SMS, eskalację SLA oraz raportowanie
              metryk obsługi klienta.
</p> </div> </div> </div> </section> </main> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/ai-tickets.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/ai-tickets.astro";
const $$url = "/ai-functions/ai-tickets";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiTickets,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
