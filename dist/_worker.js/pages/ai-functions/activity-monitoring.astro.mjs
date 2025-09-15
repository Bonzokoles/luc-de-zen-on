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
import { p as push, i as attr, j as escape_html, k as pop, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../../chunks/vendor_QZhDtzeH.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_UkYhPfz2.mjs';
/* empty css                                                  */

function ActivityDashboard($$payload, $$props) {
	push();

	let stats = {
		total: 0,
		errors: 0,
		warnings: 0,
		lastHour: 0};

	let loading = true;

	$$payload.out += `<div class="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-cyan-300 max-h-[800px] overflow-hidden"><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-3"><div class="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div> <h2 class="text-2xl font-bold text-cyan-400">MONITOR AKTYWNOŚCI</h2></div> <div class="flex items-center space-x-4"><select class="bg-gray-900 border border-cyan-500/50 rounded px-3 py-1 text-cyan-300 focus:border-cyan-400 focus:outline-none"><option value="all">Wszystkie</option><option value="info">Info</option><option value="warning">Ostrzeżenia</option><option value="error">Błędy</option></select> <button class="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded text-sm font-semibold transition-colors"${attr('disabled', loading, true)}>${escape_html("Odświeżanie..." )}</button></div></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"><div class="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-cyan-400">${escape_html(stats.total)}</div> <div class="text-sm text-gray-400">Łącznie</div></div> <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-red-400">${escape_html(stats.errors)}</div> <div class="text-sm text-gray-400">Błędy</div></div> <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-yellow-400">${escape_html(stats.warnings)}</div> <div class="text-sm text-gray-400">Ostrzeżenia</div></div> <div class="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-cyan-400">${escape_html(stats.lastHour)}</div> <div class="text-sm text-gray-400">Ostatnia godzina</div></div></div> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar svelte-y4gcsn">`;

	{
		$$payload.out += '<!--[-->';
		$$payload.out += `<div class="text-center py-8"><div class="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div> <p class="text-gray-400">Ładowanie logów...</p></div>`;
	}

	$$payload.out += `<!--]--></div></div>`;
	pop();
}

const $$ActivityMonitoring = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Monitorowanie i Raportowanie | MyBonzo AI", "data-astro-cid-y26jeksb": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" data-astro-cid-y26jeksb> <div class="container mx-auto px-4 py-8" data-astro-cid-y26jeksb> <div class="text-center mb-8" data-astro-cid-y26jeksb> <h1 class="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4" data-astro-cid-y26jeksb>
📊 Monitorowanie i Raportowanie
</h1> <p class="text-xl text-slate-300 max-w-3xl mx-auto" data-astro-cid-y26jeksb>
Dashboard z automatycznym generowaniem raportów i alertami o anomaliach
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8" data-astro-cid-y26jeksb> <!-- Key Metrics --> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-y26jeksb> <div class="flex items-center gap-3 mb-3" data-astro-cid-y26jeksb> <span class="text-2xl" data-astro-cid-y26jeksb>🔄</span> <h3 class="text-lg font-semibold text-orange-400" data-astro-cid-y26jeksb>Aktywność</h3> </div> <div class="text-3xl font-bold text-white mb-2" data-astro-cid-y26jeksb>1,234</div> <div class="text-sm text-green-400" data-astro-cid-y26jeksb>+12% z zeszłego tygodnia</div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-y26jeksb> <div class="flex items-center gap-3 mb-3" data-astro-cid-y26jeksb> <span class="text-2xl" data-astro-cid-y26jeksb>👥</span> <h3 class="text-lg font-semibold text-orange-400" data-astro-cid-y26jeksb>Użytkownicy</h3> </div> <div class="text-3xl font-bold text-white mb-2" data-astro-cid-y26jeksb>567</div> <div class="text-sm text-blue-400" data-astro-cid-y26jeksb>89 nowych dzisiaj</div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-y26jeksb> <div class="flex items-center gap-3 mb-3" data-astro-cid-y26jeksb> <span class="text-2xl" data-astro-cid-y26jeksb>⚡</span> <h3 class="text-lg font-semibold text-orange-400" data-astro-cid-y26jeksb>API Calls</h3> </div> <div class="text-3xl font-bold text-white mb-2" data-astro-cid-y26jeksb>15.2K</div> <div class="text-sm text-yellow-400" data-astro-cid-y26jeksb>234 w ostatniej godzinie</div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-y26jeksb> <div class="flex items-center gap-3 mb-3" data-astro-cid-y26jeksb> <span class="text-2xl" data-astro-cid-y26jeksb>🚨</span> <h3 class="text-lg font-semibold text-orange-400" data-astro-cid-y26jeksb>Alerty</h3> </div> <div class="text-3xl font-bold text-white mb-2" data-astro-cid-y26jeksb>3</div> <div class="text-sm text-red-400" data-astro-cid-y26jeksb>1 wymaga uwagi</div> </div> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-astro-cid-y26jeksb> <!-- Main Dashboard --> <div class="lg:col-span-2" data-astro-cid-y26jeksb> ${renderComponent($$result2, "ActivityDashboard", ActivityDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/ActivityDashboard.svelte", "client:component-export": "default", "data-astro-cid-y26jeksb": true })} <!-- Real-time Activity Feed --> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-6" data-astro-cid-y26jeksb> <h3 class="text-xl font-semibold mb-4 text-orange-400" data-astro-cid-y26jeksb>Live Activity Feed</h3> <div class="space-y-3 max-h-64 overflow-y-auto" data-astro-cid-y26jeksb> <div class="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg" data-astro-cid-y26jeksb> <span class="w-3 h-3 bg-green-400 rounded-full animate-pulse" data-astro-cid-y26jeksb></span> <div class="flex-1" data-astro-cid-y26jeksb> <div class="text-sm font-medium" data-astro-cid-y26jeksb>Nowy użytkownik zarejestrowany</div> <div class="text-xs text-slate-400" data-astro-cid-y26jeksb>2 minuty temu</div> </div> </div> <div class="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg" data-astro-cid-y26jeksb> <span class="w-3 h-3 bg-blue-400 rounded-full" data-astro-cid-y26jeksb></span> <div class="flex-1" data-astro-cid-y26jeksb> <div class="text-sm font-medium" data-astro-cid-y26jeksb>API Call: Generate Image</div> <div class="text-xs text-slate-400" data-astro-cid-y26jeksb>5 minut temu</div> </div> </div> <div class="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg" data-astro-cid-y26jeksb> <span class="w-3 h-3 bg-yellow-400 rounded-full" data-astro-cid-y26jeksb></span> <div class="flex-1" data-astro-cid-y26jeksb> <div class="text-sm font-medium" data-astro-cid-y26jeksb>Wysokie zużycie CPU</div> <div class="text-xs text-slate-400" data-astro-cid-y26jeksb>8 minut temu</div> </div> </div> </div> </div> </div> <!-- Sidebar Controls --> <div class="space-y-6" data-astro-cid-y26jeksb> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-y26jeksb> <h3 class="text-xl font-semibold mb-4 text-orange-400" data-astro-cid-y26jeksb>Kontrola</h3> <div class="space-y-3" data-astro-cid-y26jeksb> <button class="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold transition-colors" data-astro-cid-y26jeksb>
📋 Generuj Raport
</button> <button class="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors" data-astro-cid-y26jeksb>
📊 Eksportuj Dane
</button> <button class="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors" data-astro-cid-y26jeksb>
🔔 Ustawienia Alertów
</button> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-y26jeksb> <h3 class="text-xl font-semibold mb-4 text-orange-400" data-astro-cid-y26jeksb>System Status</h3> <div class="space-y-3" data-astro-cid-y26jeksb> <div class="flex justify-between items-center" data-astro-cid-y26jeksb> <span class="text-slate-300" data-astro-cid-y26jeksb>API Gateway</span> <span class="px-2 py-1 bg-green-600 rounded text-xs" data-astro-cid-y26jeksb>ONLINE</span> </div> <div class="flex justify-between items-center" data-astro-cid-y26jeksb> <span class="text-slate-300" data-astro-cid-y26jeksb>AI Workers</span> <span class="px-2 py-1 bg-green-600 rounded text-xs" data-astro-cid-y26jeksb>RUNNING</span> </div> <div class="flex justify-between items-center" data-astro-cid-y26jeksb> <span class="text-slate-300" data-astro-cid-y26jeksb>Database</span> <span class="px-2 py-1 bg-yellow-600 rounded text-xs" data-astro-cid-y26jeksb>SLOW</span> </div> <div class="flex justify-between items-center" data-astro-cid-y26jeksb> <span class="text-slate-300" data-astro-cid-y26jeksb>Cache</span> <span class="px-2 py-1 bg-green-600 rounded text-xs" data-astro-cid-y26jeksb>OPTIMAL</span> </div> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6" data-astro-cid-y26jeksb> <h3 class="text-xl font-semibold mb-4 text-orange-400" data-astro-cid-y26jeksb>Automatyczne Raporty</h3> <ul class="space-y-2 text-slate-300 text-sm" data-astro-cid-y26jeksb> <li data-astro-cid-y26jeksb>📧 Email co 24h</li> <li data-astro-cid-y26jeksb>📱 SMS przy alertach</li> <li data-astro-cid-y26jeksb>📊 Weekly Dashboard</li> <li data-astro-cid-y26jeksb>📈 Monthly Analytics</li> </ul> </div> </div> </div> </div> </main> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/activity-monitoring.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/activity-monitoring.astro";
const $$url = "/ai-functions/activity-monitoring";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ActivityMonitoring,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
