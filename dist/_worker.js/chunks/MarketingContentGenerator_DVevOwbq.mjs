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
import { k as escape_html, i as ensure_array_like, n as attr, p as maybe_selected } from './vendor_DCrrhcp4.mjs';
/* empty css                                     */

function MarketingContentGenerator($$payload) {
	let prompt = '';
	let contentType = 'post na social media';

	const contentTypes = [
		'post na social media',
		'e-mail marketingowy',
		'opis produktu',
		'artykuł na blog',
		'treść reklamowa',
		'newsletter'
	];

	$$payload.push(`<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl svelte-he12kq"><div class="mb-6"><h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Generator treści marketingowych</h2> <p class="text-gray-400">Automatyczne generowanie profesjonalnych treści marketingowych przy użyciu AI</p></div> <div class="space-y-4"><div><label for="prompt" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Temat treści</label> <textarea id="prompt" placeholder="Wpisz temat, o którym ma być treść marketingowa..." rows="4" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono">`);

	const $$body = escape_html(prompt);

	if ($$body) {
		$$payload.push(`${$$body}`);
	}

	$$payload.push(`</textarea></div> <div><label for="contentType" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Rodzaj treści</label> <select id="contentType" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono">`);

	$$payload.child(($$payload) => {
		$$payload.local.select_value = contentType;
		$$payload.push(`<!--[-->`);

		const each_array = ensure_array_like(contentTypes);

		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let type = each_array[$$index];

			$$payload.push(`<option${attr('value', type)}${maybe_selected($$payload, type)}>${escape_html(type)}</option>`);
		}

		$$payload.push(`<!--]-->`);
	});

	$$payload.push(`</select></div> <div class="flex gap-4"><button${attr('disabled', !prompt.trim(), true)} class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide">${escape_html('Generuj treść')}</button> <button class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 uppercase tracking-wide">Wyczyść</button></div> `);

	{
		$$payload.push('<!--[!-->');
	}

	$$payload.push(`<!--]--> `);

	{
		$$payload.push('<!--[!-->');
	}

	$$payload.push(`<!--]--></div></div>`);
}

export { MarketingContentGenerator as M };
