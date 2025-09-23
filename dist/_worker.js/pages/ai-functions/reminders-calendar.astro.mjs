globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { e as escape_html } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
/* empty css                                                 */

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
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Harmonogramowanie i Przypomnienia | MyBonzo AI" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"> <div class="container mx-auto px-4 py-8"> <div class="text-center mb-8"> <h1 class="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
đź”” Harmonogramowanie i Przypomnienia
</h1> <p class="text-xl text-slate-300 max-w-3xl mx-auto">
Inteligentny system przypomnieĹ„ z integracjÄ… z kalendarzami i AI przewidywaniem
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <!-- Main Calendar Interface --> <div class="lg:col-span-2"> ${renderComponent($$result2, "RemindersManager", RemindersManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/RemindersManager.svelte", "client:component-export": "default" })} <!-- Quick Add Form --> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-6"> <h3 class="text-xl font-semibold mb-4 text-green-400">Szybkie Dodawanie</h3> <form class="space-y-4"> <div> <label class="block text-sm font-medium text-slate-300 mb-2">TytuĹ‚ przypomnienia</label> <input type="text" placeholder="Np. Spotkanie z klientem..." class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400"> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-slate-300 mb-2">Data</label> <input type="date" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"> </div> <div> <label class="block text-sm font-medium text-slate-300 mb-2">Godzina</label> <input type="time" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"> </div> </div> <div> <label class="block text-sm font-medium text-slate-300 mb-2">Priorytet</label> <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"> <option value="low">đźź˘ Niski</option> <option value="medium">đźźˇ Ĺšredni</option> <option value="high">đźź  Wysoki</option> <option value="urgent">đź”´ Pilny</option> </select> </div> <button type="submit" class="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors">
đź”” Dodaj Przypomnienie
</button> </form> </div> </div> <!-- Sidebar --> <div class="space-y-6"> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6"> <h3 class="text-xl font-semibold mb-4 text-green-400">NadchodzÄ…ce</h3> <div class="space-y-3"> <div class="p-3 bg-slate-700/50 rounded-lg"> <div class="flex items-center justify-between mb-2"> <span class="text-sm font-medium">Prezentacja AI</span> <span class="px-2 py-1 bg-red-600 rounded text-xs">PILNE</span> </div> <div class="text-xs text-slate-400">DziĹ›, 14:00</div> </div> <div class="p-3 bg-slate-700/50 rounded-lg"> <div class="flex items-center justify-between mb-2"> <span class="text-sm font-medium">Review kodu</span> <span class="px-2 py-1 bg-yellow-600 rounded text-xs">ĹšREDNI</span> </div> <div class="text-xs text-slate-400">Jutro, 10:30</div> </div> <div class="p-3 bg-slate-700/50 rounded-lg"> <div class="flex items-center justify-between mb-2"> <span class="text-sm font-medium">Backup systemu</span> <span class="px-2 py-1 bg-green-600 rounded text-xs">NISKI</span> </div> <div class="text-xs text-slate-400">PiÄ…tek, 23:00</div> </div> </div> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6"> <h3 class="text-xl font-semibold mb-4 text-green-400">AI Insights</h3> <ul class="space-y-3 text-slate-300"> <li class="flex items-center gap-3"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
Najlepszy czas na spotkania: 10:00-12:00
</li> <li class="flex items-center gap-3"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
Ĺšrednie wyprzedzenie: 3 dni
</li> <li class="flex items-center gap-3"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
WykonalnoĹ›Ä‡ zadaĹ„: 87%
</li> </ul> </div> <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6"> <h3 class="text-xl font-semibold mb-4 text-green-400">Integracje</h3> <ul class="space-y-2 text-slate-300 text-sm"> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
đź“… Google Calendar
</li> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
đź“§ Outlook
</li> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
đź“± Apple Calendar
</li> <li class="flex items-center gap-2"> <span class="w-2 h-2 bg-green-400 rounded-full"></span>
đź’Ľ Slack
</li> </ul> </div> </div> </div> </div></main>` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/reminders-calendar.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-functions/reminders-calendar.astro";
const $$url = "/ai-functions/reminders-calendar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RemindersCalendar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
