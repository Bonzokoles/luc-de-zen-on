globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DFvGEJvU.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_BhCD-Bso.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_BV683skl.mjs';
/* empty css                                    */
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Tickets System | KAROL LISSON", "data-astro-cid-vw25ueqa": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-vw25ueqa": true })} ${maybeRenderHead()}<main class="min-h-svh relative z-10" data-astro-cid-vw25ueqa> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-[#0a0a0a]" data-astro-cid-vw25ueqa> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black" data-astro-cid-vw25ueqa></div> <div class="cyber-grid absolute inset-0" data-astro-cid-vw25ueqa></div> </div> <!-- Header Section --> <section class="relative z-20 border-b border-[#333333] pt-20" data-astro-cid-vw25ueqa> <div class="max-w-6xl mx-auto px-4 py-8" data-astro-cid-vw25ueqa> <div class="flex items-center justify-between mb-8" data-astro-cid-vw25ueqa> <div data-astro-cid-vw25ueqa> <h1 class="text-4xl md:text-5xl font-bold text-[#00ffff] mb-2 uppercase tracking-wider font-['Neuropol']" data-astro-cid-vw25ueqa>
AI Tickets System
</h1> <p class="text-[#a0a0a0] text-lg font-['Kenyan_Coffee']" data-astro-cid-vw25ueqa>
Inteligentne zarządzanie zgłoszeniami z automatyczną kategoryzacją i priorytetyzacją
</p> </div> <div class="text-right text-sm text-[#a0a0a0] font-mono" data-astro-cid-vw25ueqa> <div class="mb-1" data-astro-cid-vw25ueqa>
STATUS: <span class="text-[#00ffff]" data-astro-cid-vw25ueqa>PROCESSING</span> </div> <div data-astro-cid-vw25ueqa>TICKETS: <span class="text-[#ff6699] animate-pulse" data-astro-cid-vw25ueqa>142 open</span></div> </div> </div> <!-- Navigation --> <div class="flex gap-4 mb-8" data-astro-cid-vw25ueqa> <a href="/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-vw25ueqa>
← Powrót do głównej
</a> <a href="/zaawansowane-funkcje-ai" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-vw25ueqa>
Wszystkie funkcje AI
</a> <a href="./dashboard/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-vw25ueqa>
DASHBOARD
</a> <a href="./classifier/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-vw25ueqa>
KLASYFIKATOR
</a> <a href="./automation/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm" data-astro-cid-vw25ueqa>
AUTOMATYZACJA
</a> </div> </div> </section> <!-- Feature Overview --> <section class="relative z-20 py-12" data-astro-cid-vw25ueqa> <div class="max-w-6xl mx-auto px-4" data-astro-cid-vw25ueqa> <div class="grid md:grid-cols-3 gap-6 mb-12" data-astro-cid-vw25ueqa> <!-- Dashboard Card --> <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-[#333333] p-6 rounded-sm hover:border-[#00ffff] transition-all duration-300 group" data-astro-cid-vw25ueqa> <div class="flex items-center justify-between mb-4" data-astro-cid-vw25ueqa> <h3 class="text-[#00ffff] font-['Neuropol'] text-xl uppercase tracking-wide" data-astro-cid-vw25ueqa>Dashboard</h3> <div class="text-2xl text-[#ff6699]" data-astro-cid-vw25ueqa>📊</div> </div> <p class="text-[#a0a0a0] mb-4 font-['Kenyan_Coffee']" data-astro-cid-vw25ueqa>
Centralny panel zarządzania tickets
</p> <div class="text-sm text-[#00ffff] mb-4" data-astro-cid-vw25ueqa>
• Real-time metrics<br data-astro-cid-vw25ueqa>
• Priority queues<br data-astro-cid-vw25ueqa>
• Agent workload
</div> <a href="./dashboard/" class="inline-block bg-[#00ffff] text-[#0a0a0a] px-4 py-2 text-sm font-bold hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide" data-astro-cid-vw25ueqa>
OTWÓRZ PANEL
</a> </div> <!-- AI Classifier Card --> <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-[#333333] p-6 rounded-sm hover:border-[#00ffff] transition-all duration-300 group" data-astro-cid-vw25ueqa> <div class="flex items-center justify-between mb-4" data-astro-cid-vw25ueqa> <h3 class="text-[#00ffff] font-['Neuropol'] text-xl uppercase tracking-wide" data-astro-cid-vw25ueqa>AI Klasyfikator</h3> <div class="text-2xl text-[#ff6699]" data-astro-cid-vw25ueqa>🤖</div> </div> <p class="text-[#a0a0a0] mb-4 font-['Kenyan_Coffee']" data-astro-cid-vw25ueqa>
Automatyczna kategoryzacja zgłoszeń
</p> <div class="text-sm text-[#00ffff] mb-4" data-astro-cid-vw25ueqa>
• Intent recognition<br data-astro-cid-vw25ueqa>
• Priority scoring<br data-astro-cid-vw25ueqa>
• Department routing
</div> <a href="./classifier/" class="inline-block bg-[#00ffff] text-[#0a0a0a] px-4 py-2 text-sm font-bold hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide" data-astro-cid-vw25ueqa>
KONFIGURUJ
</a> </div> <!-- Automation Card --> <div class="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-[#333333] p-6 rounded-sm hover:border-[#00ffff] transition-all duration-300 group" data-astro-cid-vw25ueqa> <div class="flex items-center justify-between mb-4" data-astro-cid-vw25ueqa> <h3 class="text-[#00ffff] font-['Neuropol'] text-xl uppercase tracking-wide" data-astro-cid-vw25ueqa>Automatyzacja</h3> <div class="text-2xl text-[#ff6699]" data-astro-cid-vw25ueqa>⚡</div> </div> <p class="text-[#a0a0a0] mb-4 font-['Kenyan_Coffee']" data-astro-cid-vw25ueqa>
Workflow i reguły automatyczne
</p> <div class="text-sm text-[#00ffff] mb-4" data-astro-cid-vw25ueqa>
• Auto-responses<br data-astro-cid-vw25ueqa>
• Escalation rules<br data-astro-cid-vw25ueqa>
• SLA monitoring
</div> <a href="./automation/" class="inline-block bg-[#00ffff] text-[#0a0a0a] px-4 py-2 text-sm font-bold hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide" data-astro-cid-vw25ueqa>
ZARZĄDZAJ
</a> </div> </div> </div> </section> <!-- Live Tickets Feed --> <section class="relative z-20 py-8 border-t border-[#333333]" data-astro-cid-vw25ueqa> <div class="max-w-6xl mx-auto px-4" data-astro-cid-vw25ueqa> <h3 class="text-[#00ffff] font-['Neuropol'] text-xl uppercase tracking-wide mb-6" data-astro-cid-vw25ueqa>
🎫 Live Tickets Feed
</h3> <div class="grid md:grid-cols-2 gap-6" data-astro-cid-vw25ueqa> <!-- High Priority --> <div class="bg-[#111111] border border-[#ff3333] p-4 rounded-sm" data-astro-cid-vw25ueqa> <h4 class="text-[#ff3333] font-['Neuropol'] text-sm uppercase mb-3" data-astro-cid-vw25ueqa>🚨 High Priority</h4> <div class="space-y-3" data-astro-cid-vw25ueqa> <div class="border-l-4 border-[#ff3333] pl-3" data-astro-cid-vw25ueqa> <div class="text-[#e0e0e0] text-sm font-bold" data-astro-cid-vw25ueqa>#T2847 - Server Down</div> <div class="text-[#a0a0a0] text-xs" data-astro-cid-vw25ueqa>Customer: TechCorp Ltd | 2 min ago</div> <div class="text-[#ff3333] text-xs" data-astro-cid-vw25ueqa>AI Score: CRITICAL</div> </div> <div class="border-l-4 border-[#ff6699] pl-3" data-astro-cid-vw25ueqa> <div class="text-[#e0e0e0] text-sm font-bold" data-astro-cid-vw25ueqa>#T2846 - Payment Issues</div> <div class="text-[#a0a0a0] text-xs" data-astro-cid-vw25ueqa>Customer: StartupXYZ | 8 min ago</div> <div class="text-[#ff6699] text-xs" data-astro-cid-vw25ueqa>AI Score: HIGH</div> </div> <div class="border-l-4 border-[#ffaa00] pl-3" data-astro-cid-vw25ueqa> <div class="text-[#e0e0e0] text-sm font-bold" data-astro-cid-vw25ueqa>#T2845 - Integration Problem</div> <div class="text-[#a0a0a0] text-xs" data-astro-cid-vw25ueqa>Customer: DevAgency | 15 min ago</div> <div class="text-[#ffaa00] text-xs" data-astro-cid-vw25ueqa>AI Score: MEDIUM</div> </div> </div> </div> <!-- Recent Activity --> <div class="bg-[#111111] border border-[#333333] p-4 rounded-sm" data-astro-cid-vw25ueqa> <h4 class="text-[#00ffff] font-['Neuropol'] text-sm uppercase mb-3" data-astro-cid-vw25ueqa>📈 Recent Activity</h4> <div class="space-y-2" data-astro-cid-vw25ueqa> <div class="flex justify-between text-xs" data-astro-cid-vw25ueqa> <span class="text-[#e0e0e0]" data-astro-cid-vw25ueqa>#T2844 resolved by AI</span> <span class="text-[#00ff00]" data-astro-cid-vw25ueqa>✓ 3min</span> </div> <div class="flex justify-between text-xs" data-astro-cid-vw25ueqa> <span class="text-[#e0e0e0]" data-astro-cid-vw25ueqa>#T2843 escalated to L2</span> <span class="text-[#ffaa00]" data-astro-cid-vw25ueqa>⚡ 7min</span> </div> <div class="flex justify-between text-xs" data-astro-cid-vw25ueqa> <span class="text-[#e0e0e0]" data-astro-cid-vw25ueqa>#T2842 auto-categorized</span> <span class="text-[#00ffff]" data-astro-cid-vw25ueqa>🤖 12min</span> </div> <div class="flex justify-between text-xs" data-astro-cid-vw25ueqa> <span class="text-[#e0e0e0]" data-astro-cid-vw25ueqa>#T2841 SLA warning</span> <span class="text-[#ff6699]" data-astro-cid-vw25ueqa>⏰ 18min</span> </div> </div> </div> </div> </div> </section> <!-- Stats Dashboard --> <section class="relative z-20 py-8 border-t border-[#333333]" data-astro-cid-vw25ueqa> <div class="max-w-6xl mx-auto px-4" data-astro-cid-vw25ueqa> <div class="grid md:grid-cols-4 gap-4" data-astro-cid-vw25ueqa> <div class="bg-[#111111] border border-[#333333] p-4 rounded-sm" data-astro-cid-vw25ueqa> <div class="text-[#00ffff] text-2xl font-bold" data-astro-cid-vw25ueqa>142</div> <div class="text-[#a0a0a0] text-sm" data-astro-cid-vw25ueqa>Open Tickets</div> </div> <div class="bg-[#111111] border border-[#333333] p-4 rounded-sm" data-astro-cid-vw25ueqa> <div class="text-[#00ffff] text-2xl font-bold" data-astro-cid-vw25ueqa>96.8%</div> <div class="text-[#a0a0a0] text-sm" data-astro-cid-vw25ueqa>AI Accuracy</div> </div> <div class="bg-[#111111] border border-[#333333] p-4 rounded-sm" data-astro-cid-vw25ueqa> <div class="text-[#00ffff] text-2xl font-bold" data-astro-cid-vw25ueqa>1.2h</div> <div class="text-[#a0a0a0] text-sm" data-astro-cid-vw25ueqa>Avg Resolution</div> </div> <div class="bg-[#111111] border border-[#333333] p-4 rounded-sm" data-astro-cid-vw25ueqa> <div class="text-[#00ffff] text-2xl font-bold" data-astro-cid-vw25ueqa>89%</div> <div class="text-[#a0a0a0] text-sm" data-astro-cid-vw25ueqa>SLA Compliance</div> </div> </div> </div> </section> </main>  ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/ai-tickets/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/ai-tickets/index.astro";
const $$url = "/ai-functions/ai-tickets";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
