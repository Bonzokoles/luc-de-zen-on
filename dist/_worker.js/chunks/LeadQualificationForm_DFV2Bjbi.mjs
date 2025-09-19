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
import { n as attr, p as maybe_selected, i as ensure_array_like, k as escape_html } from './vendor_DCrrhcp4.mjs';
/* empty css                                       */

function LeadQualificationForm($$payload) {
	let name = '';
	let email = '';
	let message = '';
	let phone = '';
	let company = '';
	let budget = '';

	const budgetOptions = [
		'< 5000 PLN',
		'5000 - 15000 PLN',
		'15000 - 50000 PLN',
		'50000 - 100000 PLN',
		'> 100000 PLN',
		'Nie określono'
	];

	$$payload.push(`<div class="worker-card bg-black border border-cyan-500/30 p-6 rounded-lg shadow-2xl svelte-1marw4p"><div class="mb-6"><h2 class="text-2xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Automatyzacja obsługi klienta</h2> <p class="text-gray-400">Inteligentny system kwalifikacji leadów z automatyczną odpowiedzią AI</p></div> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="name" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Imię i nazwisko *</label> <input id="name"${attr('value', name)} placeholder="Jan Kowalski" required class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"/></div> <div><label for="email" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">E-mail *</label> <input id="email" type="email"${attr('value', email)} placeholder="jan@example.com" required class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"/></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="phone" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Telefon</label> <input id="phone"${attr('value', phone)} placeholder="+48 123 456 789" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"/></div> <div><label for="company" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Firma</label> <input id="company"${attr('value', company)} placeholder="Nazwa firmy" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono"/></div></div> <div><label for="budget" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Budżet projektu</label> <select id="budget" class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono">`);

	$$payload.child(($$payload) => {
		$$payload.local.select_value = budget;
		$$payload.push(`<option value=""${maybe_selected($$payload, '')}>Wybierz budżet...</option><!--[-->`);

		const each_array = ensure_array_like(budgetOptions);

		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let option = each_array[$$index];

			$$payload.push(`<option${attr('value', option)}${maybe_selected($$payload, option)}>${escape_html(option)}</option>`);
		}

		$$payload.push(`<!--]-->`);
	});

	$$payload.push(`</select></div> <div><label for="message" class="block text-cyan-300 font-medium mb-2 uppercase text-sm tracking-wide">Wiadomość *</label> <textarea id="message" placeholder="Opisz swoje potrzeby i oczekiwania..." rows="4" required class="w-full p-3 bg-gray-900/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono">`);

	const $$body = escape_html(message);

	if ($$body) {
		$$payload.push(`${$$body}`);
	}

	$$payload.push(`</textarea></div> <div class="flex gap-4"><button${attr('disabled', !name.trim() || !email.trim() || !message.trim(), true)} class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-cyan-500/50 uppercase tracking-wide">${escape_html('Wyślij zapytanie')}</button> <button class="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/50 hover:border-gray-500/50 transition-all duration-300 uppercase tracking-wide">Wyczyść</button></div> `);

	{
		$$payload.push('<!--[!-->');
	}

	$$payload.push(`<!--]--> `);

	{
		$$payload.push('<!--[!-->');
	}

	$$payload.push(`<!--]--> `);

	{
		$$payload.push('<!--[!-->');
	}

	$$payload.push(`<!--]--> `);

	{
		$$payload.push('<!--[!-->');
	}

	$$payload.push(`<!--]--></div></div>`);
}

export { LeadQualificationForm as L };
