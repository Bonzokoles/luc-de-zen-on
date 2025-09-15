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
import { p as push, i as attr, j as escape_html, k as pop } from './vendor_QZhDtzeH.mjs';
/* empty css                              */

function TicketSubmissionWidget($$payload, $$props) {
	push();

	let form = {
		description: "",
		email: ""};

	$$payload.out += `<div class="ticket-widget-container svelte-1hd5a6l"><h2 class="widget-title svelte-1hd5a6l">🎫 System zgłoszeń i ticketów</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2">Email *</label> <input type="email"${attr('value', form.email)} placeholder="twoj.email@example.com" class="widget-input svelte-1hd5a6l"></div> <div><label class="block text-sm font-medium mb-2">Priorytet</label> <select class="widget-select svelte-1hd5a6l"><option value="low" class="svelte-1hd5a6l">🟢 Niski</option><option value="medium" class="svelte-1hd5a6l">🟡 Średni</option><option value="high" class="svelte-1hd5a6l">🟠 Wysoki</option><option value="critical" class="svelte-1hd5a6l">🔴 Krytyczny</option></select></div></div> <div><label class="block text-sm font-medium mb-2">Kategoria (opcjonalna)</label> <select class="widget-select svelte-1hd5a6l"><option value="" class="svelte-1hd5a6l">Wybierz kategorię</option><option value="bug" class="svelte-1hd5a6l">🐛 Błąd w systemie</option><option value="feature-request" class="svelte-1hd5a6l">✨ Prośba o funkcję</option><option value="question" class="svelte-1hd5a6l">❓ Pytanie</option><option value="billing" class="svelte-1hd5a6l">💰 Płatności/Faktury</option><option value="integration" class="svelte-1hd5a6l">🔗 Integracje</option><option value="performance" class="svelte-1hd5a6l">⚡ Wydajność</option><option value="other" class="svelte-1hd5a6l">🤔 Inne</option></select></div> <div><label class="block text-sm font-medium mb-2">Opis problemu *</label> <textarea rows="6" placeholder="Opisz szczegółowo swój problem lub zapytanie. Im więcej informacji podasz, tym szybciej będziemy mogli pomóc..." class="widget-textarea svelte-1hd5a6l">`;

	const $$body = escape_html(form.description);

	if ($$body) {
		$$payload.out += `${$$body}`;
	}

	$$payload.out += `</textarea></div> <div class="flex gap-3"><button${attr('disabled', true, true)} class="action-btn primary svelte-1hd5a6l">`;

	{
		$$payload.out += '<!--[!-->';
		$$payload.out += `🎫 Wyślij zgłoszenie`;
	}

	$$payload.out += `<!--]--></button> <button class="action-btn secondary svelte-1hd5a6l">🗑️ Wyczyść</button></div> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> <div class="text-xs text-gray-400 italic">💡 Tip: Podanie szczegółowego opisu problemu pomoże naszemu systemowi AI
      lepiej sklasyfikować zgłoszenie</div></div></div>`;

	pop();
}

export { TicketSubmissionWidget as T };
