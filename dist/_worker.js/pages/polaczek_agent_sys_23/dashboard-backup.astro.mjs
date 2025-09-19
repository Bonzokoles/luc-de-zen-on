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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../../chunks/vendor_DCrrhcp4.mjs';
export { d as renderers } from '../../chunks/vendor_DCrrhcp4.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_BsrSeDeM.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_BSAeJswa.mjs';

const $$DashboardBackup = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "POLACZEK Agent System 23 - Dashboard" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, {})}  ${maybeRenderHead()}<div class="workers-vertical-line-left"></div> <div class="workers-vertical-line-right"></div> <main class="min-h-svh"> <!-- Header Section - Styl nr.1 --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <div class="flex justify-between max-h-72 min-h-64"> <!-- Left corner - Dashboard info --> <div class="mt-auto" style="max-width: 45vw;"> <div class="text-edge text-sm italic px-2" style="
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
              ">
🤖 POLACZEK DASHBOARD - Centrum<br>
zarządzania agentami AI. Monitoruj,<br>
kontroluj i optymalizuj wydajność<br>
wszystkich aktywnych agentów.
</div> </div> <span class="mt-auto"> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 30px;
              margin-right: 0px;
              line-height: 1.1;
              " class="text-edge font-bold text-right">
DASHBOARD<br>
CONTROL
</div> </span> </div> </div> </section> <!-- Main Dashboard Content with transparent background --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <!-- Dashboard background with 55% transparency --> <div style="background: rgba(0, 0, 0, 0.55); border-radius: 0; padding: 2rem;"> <!-- System Status Panel --> <div class="mb-8"> <h2 class="text-2xl font-bold text-white mb-4">📊 Status Systemu</h2> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"> <div style="background: rgba(34, 197, 94, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="active-agents">0</div> <div class="text-sm">Aktywne Agenty</div> </div> </div> <div style="background: rgba(59, 130, 246, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="total-messages">0</div> <div class="text-sm">Wiadomości</div> </div> </div> <div style="background: rgba(168, 85, 247, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="system-health">100%</div> <div class="text-sm">Zdrowie Systemu</div> </div> </div> <div style="background: rgba(245, 101, 101, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="error-count">0</div> <div class="text-sm">Błędy</div> </div> </div> </div> </div> <!-- Quick Actions --> <div class="mb-8"> <h3 class="text-xl font-bold text-white mb-4">🚀 Szybkie Akcje</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/agents/create', '_blank')" style="background: rgba(34, 197, 94, 0.8); border-radius: 0; padding: 1rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity"> <div class="text-lg font-bold">+ Stwórz Agenta</div> <div class="text-sm">Nowy agent AI</div> </button> <button onclick="refreshAgentsList()" style="background: rgba(59, 130, 246, 0.8); border-radius: 0; padding: 1rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity"> <div class="text-lg font-bold">🔄 Odśwież</div> <div class="text-sm">Lista agentów</div> </button> <button onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" style="background: rgba(168, 85, 247, 0.8); border-radius: 0; padding: 1rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity"> <div class="text-lg font-bold">🏠 SDK</div> <div class="text-sm">Główna strona</div> </button> </div> </div> <!-- Active Agents List --> <div> <div class="flex justify-between items-center mb-4"> <h3 class="text-xl font-bold text-white">🤖 Aktywne Agenty</h3> <div class="text-sm text-gray-300">Ostatnia aktualizacja: <span id="last-update">Nigdy</span></div> </div> <div id="agents-container" style="background: rgba(0, 0, 0, 0.3); border-radius: 0; padding: 1rem;"> <div class="text-center text-gray-400 py-8" id="loading-message">
Ładowanie agentów...
</div> </div> </div> </div> </div> </section> <div class="text-sm opacity-90">Aktywne Agenty</div> <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4"> <div class="text-white"> <div class="text-2xl font-bold" id="total-agents">0</div> <div class="text-sm opacity-90">Łącznie Agentów</div> </div> </div> <div class="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4"> <div class="text-white"> <div class="text-2xl font-bold" id="pending-tasks">0</div> <div class="text-sm opacity-90">Oczekujące Zadania</div> </div> </div> <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4"> <div class="text-white"> <div class="text-2xl font-bold" id="system-health">100%</div> <div class="text-sm opacity-90">Zdrowie Systemu</div> </div> </div> </main>  ${renderComponent($$result2, "GlassPanel", GlassPanel, { "class": "mb-8" }, { "default": async ($$result3) => renderTemplate` <div class="p-6"> <div class="flex justify-between items-center mb-4"> <h2 class="text-2xl font-bold text-white">🤖 Aktywne Agenty</h2> <button id="refresh-agents" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors">
🔄 Odśwież
</button> </div> <div id="agents-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> <!-- Agent cards will be dynamically loaded here --> </div> </div> ` })}  ${renderComponent($$result2, "GlassPanel", GlassPanel, {}, { "default": async ($$result3) => renderTemplate` <div class="p-6"> <h2 class="text-2xl font-bold text-white mb-4">⚡ Szybkie Akcje</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> ${renderComponent($$result3, "CyberpunkButton", CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/monitor", "class": "bg-red-600 hover:bg-red-500" }, { "default": async ($$result4) => renderTemplate`
📈 Monitoring Systemu
` })} ${renderComponent($$result3, "CyberpunkButton", CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/analytics", "class": "bg-purple-600 hover:bg-purple-500" }, { "default": async ($$result4) => renderTemplate`
📊 Analityka
` })} ${renderComponent($$result3, "CyberpunkButton", CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/logs", "class": "bg-gray-600 hover:bg-gray-500" }, { "default": async ($$result4) => renderTemplate`
📝 Logi Systemu
` })} ${renderComponent($$result3, "CyberpunkButton", CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/settings", "class": "bg-indigo-600 hover:bg-indigo-500" }, { "default": async ($$result4) => renderTemplate`
⚙️ Ustawienia
` })} </div> </div> ` })}  <div id="agent-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50"> <div class="flex items-center justify-center min-h-screen p-4"> <div class="bg-gray-900 rounded-xl border border-cyan-500/30 p-6 max-w-md w-full"> <div class="flex justify-between items-center mb-4"> <h3 id="modal-title" class="text-xl font-bold text-white"></h3> <button id="close-modal" class="text-gray-400 hover:text-white">
✕
</button> </div> <div id="modal-content" class="text-gray-300"> <!-- Modal content will be dynamically loaded --> </div> <div class="flex justify-end space-x-2 mt-6"> <button id="modal-cancel" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors">
Anuluj
</button> <button id="modal-action" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors">
Wykonaj
</button> </div> </div> </div> </div> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/dashboard-backup.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/dashboard-backup.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/dashboard-backup.astro";
const $$url = "/POLACZEK_AGENT_SYS_23/dashboard-backup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DashboardBackup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
