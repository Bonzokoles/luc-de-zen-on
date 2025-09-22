globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_BYicRfIX.mjs';
import { b as escape_html } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
/* empty css                                                 */
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_cAs3q6CP.mjs';

function RemindersManager($$renderer, $$props) {
	$$renderer.component(($$renderer) => {

		let stats = {
			total: 0,
			completed: 0,
			overdue: 0,
			today: 0};

		$$renderer.push(`<div class="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-cyan-300 max-h-[800px] overflow-hidden"><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-3"><div class="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div> <h2 class="text-2xl font-bold text-cyan-400">HARMONOGRAM I PRZYPOMNIENIA</h2></div> <button class="px-4 py-2 bg-cyan-700/50 hover:bg-cyan-600/50 rounded text-sm font-semibold transition-colors">${escape_html('➕ Nowe przypomnienie')}</button></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"><div class="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-cyan-400">${escape_html(stats.total)}</div> <div class="text-sm text-gray-400">Łącznie</div></div> <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-green-400">${escape_html(stats.completed)}</div> <div class="text-sm text-gray-400">Zakończone</div></div> <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-red-400">${escape_html(stats.overdue)}</div> <div class="text-sm text-gray-400">Przeterminowane</div></div> <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center"><div class="text-2xl font-bold text-yellow-400">${escape_html(stats.today)}</div> <div class="text-sm text-gray-400">Dzisiaj</div></div></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar svelte-1seyal6">`);

		{
			$$renderer.push('<!--[-->');
			$$renderer.push(`<div class="text-center py-8"><div class="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div> <p class="text-gray-400">Ładowanie przypomnień...</p></div>`);
		}

		$$renderer.push(`<!--]--></div></div>`);
	});
}

const $$RemindersCalendar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Harmonogramowanie i Przypomnienia | AI Functions | KAROL LISSON" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, {})} ${maybeRenderHead()}<main class="min-h-svh relative z-10"> <!-- Background Grid Pattern --> <div class="fixed inset-0 bg-[#0a0a0a]"> <div class="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black"></div> <div class="cyber-grid absolute inset-0"></div> </div> <!-- Header Section --> <section class="relative z-20 border-b border-[#333333] pt-20"> <div class="max-w-6xl mx-auto px-4 py-8"> <div class="flex items-center justify-between mb-8"> <div> <h1 class="text-4xl md:text-5xl font-bold text-[#00ffff] mb-2 uppercase tracking-wider font-['Neuropol']">
Harmonogramowanie i Przypomnienia
</h1> <p class="text-[#a0a0a0] text-lg font-['Kenyan_Coffee']">
Inteligentny system przypomnień z integracją z kalendarzami i AI przewidywaniem
</p> </div> <div class="text-right text-sm text-[#a0a0a0] font-mono"> <div class="mb-1">
STATUS: <span class="text-[#00ffff]">SYNCING</span> </div> <div>EVENTS: <span class="text-[#00ffff] animate-pulse">12 today</span></div> </div> </div> <!-- Navigation --> <div class="flex gap-4 mb-8"> <a href="/" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm">
← Powrót do głównej
</a> <a href="/zaawansowane-funkcje-ai" class="px-4 py-2 bg-[#111111] border border-[#333333] text-[#e0e0e0] hover:text-[#00ffff] hover:brightness-125 transition-all duration-300 font-['Neuropol'] uppercase tracking-wide text-sm">
Wszystkie funkcje AI
</a> </div> </div> </section> <!-- Main Content --> <section class="relative z-20 py-12"> <div class="max-w-4xl mx-auto px-4"> <!-- Reminders Manager --> <!-- Reminders Manager Widget --> ${renderComponent($$result2, "RemindersManager", RemindersManager, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/RemindersManager.svelte", "client:component-export": "default" })} <!-- Quick Add Form --> <div class="mt-12 p-6 bg-[#111111] border border-[#333333] glass-effect"> <h3 class="text-xl font-bold text-[#00ffff] mb-4 uppercase tracking-wider font-['Neuropol']">Szybkie Dodawanie</h3> <form class="space-y-4"> <div> <label class="block text-sm font-medium text-slate-300 mb-2">Tytuł przypomnienia</label> <input type="text" placeholder="Np. Spotkanie z klientem..." class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400"> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-slate-300 mb-2">Data</label> <input type="date" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"> </div> <div> <label class="block text-sm font-medium text-slate-300 mb-2">Godzina</label> <input type="time" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"> </div> </div> <div> <label class="block text-sm font-medium text-slate-300 mb-2">Priorytet</label> <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"> <option value="low">🟢 Niski</option> <option value="medium">🟡 Średni</option> <option value="high">🟠 Wysoki</option> <option value="urgent">🔴 Pilny</option> </select> </div> <button type="submit" class="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors">
🔔 Dodaj Przypomnienie
</button> </form> </div> </div> <!-- Sidebar --> <div class="space-y-6"> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6"> <h3 class="text-xl font-semibold mb-4 text-green-400">Nadchodzące</h3> <div class="space-y-3"> <div class="p-3 bg-slate-700/50 rounded-lg"> <div class="flex items-center justify-between mb-2"> <span class="text-sm font-medium">Prezentacja AI</span> <span class="px-2 py-1 bg-red-600 rounded text-xs">PILNE</span> </div> <div class="text-xs text-slate-400">Dziś, 14:00</div> </div> <div class="p-3 bg-slate-700/50 rounded-lg"> <div class="flex items-center justify-between mb-2"> <span class="text-sm font-medium">Review kodu</span> <span class="px-2 py-1 bg-yellow-600 rounded text-xs">ŚREDNI</span> </div> <div class="text-xs text-slate-400">Jutro, 10:30</div> </div> <div class="p-3 bg-slate-700/50 rounded-lg"> <div class="flex items-center justify-between mb-2"> <span class="text-sm font-medium">Backup systemu</span> <span class="px-2 py-1 bg-green-600 rounded text-xs">NISKI</span> </div> <div class="text-xs text-slate-400">Piątek, 23:00</div> </div> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6"> <h3 class="text-xl font-semibold mb-4 text-green-400">AI Insights</h3> <ul class="space-y-3 text-slate-300"> <li class="flex items-center gap-3"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
Najlepszy czas na spotkania: 10:00-12:00
</li> <li class="flex items-center gap-3"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
Średnie wyprzedzenie: 3 dni
</li> <li class="flex items-center gap-3"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
Wykonalność zadań: 87%
</li> </ul> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6"> <h3 class="text-xl font-semibold mb-4 text-green-400">Integracje</h3> <ul class="space-y-2 text-slate-300 text-sm"> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
📅 Google Calendar
</li> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
📧 Outlook
</li> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
📱 Apple Calendar
</li> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
💼 Slack
</li> </ul> </div> </div> </section></main>` })}`;
}, "Q:/mybonzo/mybonzo-github/src/pages/ai-functions/reminders-calendar.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/ai-functions/reminders-calendar.astro";
const $$url = "/ai-functions/reminders-calendar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RemindersCalendar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
