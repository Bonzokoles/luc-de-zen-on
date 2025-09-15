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
import { p as push, j as escape_html, i as attr, l as ensure_array_like, t as to_class, k as pop } from './vendor_QZhDtzeH.mjs';
/* empty css                                                */

function RecommendationsWidget($$payload, $$props) {
	push();

	let preferences = "";
	let history = "";
	let recommendations = [];
	let loading = false;

	function getPriorityColor(priority) {
		if (priority >= 4) return "border-green-400 bg-green-900/10";
		if (priority >= 3) return "border-yellow-400 bg-yellow-900/10";
		return "border-gray-500 bg-gray-900/10";
	}

	function getPriorityText(priority) {
		if (priority >= 4) return "Wysoki priorytet";
		if (priority >= 3) return "Średni priorytet";
		return "Niski priorytet";
	}

	$$payload.out += `<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl svelte-bqqj6t"><div class="mb-6"><h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Personalizowane rekomendacje</h2> <p class="text-gray-400">System rekomendacji produktów i usług oparty na preferencjach użytkownika</p></div> <div class="space-y-4"><div><label for="preferences" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Preferencje użytkownika</label> <textarea id="preferences" placeholder="Wpisz preferencje użytkownika (np. technologie, marketing, e-commerce)..." rows="3" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono">`;

	const $$body = escape_html(preferences);

	if ($$body) {
		$$payload.out += `${$$body}`;
	}

	$$payload.out += `</textarea></div> <div><label for="history" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Historia użytkownika (opcjonalnie)</label> <input id="history"${attr('value', history)} placeholder="Historia zakupów, odwiedzonych stron (oddziel przecinkami)..." class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"></div> <div class="flex gap-4"><button${attr('disabled', !preferences.trim(), true)} class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide">${escape_html("Generuj rekomendacje")}</button> `;

	if (recommendations.length > 0) {
		$$payload.out += '<!--[-->';
		$$payload.out += `<button${attr('disabled', loading, true)} class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 disabled:opacity-50 uppercase tracking-wide">Odśwież</button>`;
	} else {
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--></div> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	if (recommendations.length > 0 && true) {
		$$payload.out += '<!--[-->';

		const each_array = ensure_array_like(recommendations);

		$$payload.out += `<div class="mt-6"><h3 class="text-lg font-semibold text-cyan-300 mb-4 uppercase tracking-wider">Rekomendacje dla Ciebie (${escape_html(recommendations.length)})</h3> <div class="grid gap-4"><!--[-->`;

		for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
			let rec = each_array[idx];

			$$payload.out += `<div${attr('class', to_class('p-4 rounded-lg border ' + getPriorityColor(rec.priority || 3) + ' transition-all duration-300 hover:shadow-xl hover:border-opacity-80 bg-gray-900/20', 'svelte-bqqj6t'))}><div class="flex justify-between items-start mb-3"><h4 class="text-white font-bold text-lg uppercase tracking-wide">${escape_html(rec.title)}</h4> `;

			if (rec.priority) {
				$$payload.out += '<!--[-->';
				$$payload.out += `<span class="px-2 py-1 bg-gray-800/50 border border-gray-600/30 text-xs rounded text-gray-300 uppercase tracking-wide">${escape_html(getPriorityText(rec.priority))}</span>`;
			} else {
				$$payload.out += '<!--[!-->';
			}

			$$payload.out += `<!--]--></div> <p class="text-gray-300 mb-3 leading-relaxed font-mono text-sm">${escape_html(rec.description)}</p> `;

			if (rec.reason) {
				$$payload.out += '<!--[-->';
				$$payload.out += `<div class="mb-3"><span class="text-cyan-400 text-sm font-semibold uppercase tracking-wide">Dlaczego dla Ciebie:</span> <p class="text-gray-400 text-sm italic font-mono">${escape_html(rec.reason)}</p></div>`;
			} else {
				$$payload.out += '<!--[!-->';
			}

			$$payload.out += `<!--]--> `;

			if (rec.category) {
				$$payload.out += '<!--[-->';
				$$payload.out += `<div class="flex justify-between items-center"><span class="px-3 py-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-300 text-xs rounded uppercase tracking-wide font-semibold">${escape_html(rec.category)}</span> <button class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm rounded hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 uppercase tracking-wide font-semibold border border-cyan-500/50">Dowiedz się więcej</button></div>`;
			} else {
				$$payload.out += '<!--[!-->';
			}

			$$payload.out += `<!--]--></div>`;
		}

		$$payload.out += `<!--]--></div></div>`;
	} else {
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	if (recommendations.length === 0 && preferences) ; else {
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--></div></div>`;
	pop();
}

export { RecommendationsWidget as R };
