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
import { n as attr, p as maybe_selected, k as escape_html } from './vendor_BHZTJLV0.mjs';
/* empty css                              */

function TicketSubmissionWidget($$payload, $$props) {
	$$payload.component(($$payload) => {
		let form = { description: "", email: "", priority: "medium", category: "" };

		$$payload.push(`<div class="ticket-widget-container svelte-s2lxog"><h2 class="widget-title svelte-s2lxog">🎫 System zgłoszeń i ticketów</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2">Email *</label> <input type="email"${attr('value', form.email)} placeholder="twoj.email@example.com" class="widget-input svelte-s2lxog"/></div> <div><label class="block text-sm font-medium mb-2">Priorytet</label> <select class="widget-select svelte-s2lxog">`);

		$$payload.child(($$payload) => {
			$$payload.local.select_value = form.priority;
			$$payload.push(`<option value="low"${maybe_selected($$payload, 'low')} class="svelte-s2lxog">🟢 Niski</option><option value="medium"${maybe_selected($$payload, 'medium')} class="svelte-s2lxog">🟡 Średni</option><option value="high"${maybe_selected($$payload, 'high')} class="svelte-s2lxog">🟠 Wysoki</option><option value="critical"${maybe_selected($$payload, 'critical')} class="svelte-s2lxog">🔴 Krytyczny</option>`);
		});

		$$payload.push(`</select></div></div> <div><label class="block text-sm font-medium mb-2">Kategoria (opcjonalna)</label> <select class="widget-select svelte-s2lxog">`);

		$$payload.child(($$payload) => {
			$$payload.local.select_value = form.category;
			$$payload.push(`<option value=""${maybe_selected($$payload, '')} class="svelte-s2lxog">Wybierz kategorię</option><option value="bug"${maybe_selected($$payload, 'bug')} class="svelte-s2lxog">🐛 Błąd w systemie</option><option value="feature-request"${maybe_selected($$payload, 'feature-request')} class="svelte-s2lxog">✨ Prośba o funkcję</option><option value="question"${maybe_selected($$payload, 'question')} class="svelte-s2lxog">❓ Pytanie</option><option value="billing"${maybe_selected($$payload, 'billing')} class="svelte-s2lxog">💰 Płatności/Faktury</option><option value="integration"${maybe_selected($$payload, 'integration')} class="svelte-s2lxog">🔗 Integracje</option><option value="performance"${maybe_selected($$payload, 'performance')} class="svelte-s2lxog">⚡ Wydajność</option><option value="other"${maybe_selected($$payload, 'other')} class="svelte-s2lxog">🤔 Inne</option>`);
		});

		$$payload.push(`</select></div> <div><label class="block text-sm font-medium mb-2">Opis problemu *</label> <textarea rows="6" placeholder="Opisz szczegółowo swój problem lub zapytanie. Im więcej informacji podasz, tym szybciej będziemy mogli pomóc..." class="widget-textarea svelte-s2lxog">`);

		const $$body = escape_html(form.description);

		if ($$body) {
			$$payload.push(`${$$body}`);
		}

		$$payload.push(`</textarea></div> <div class="flex gap-3"><button${attr('disabled', true, true)} class="action-btn primary svelte-s2lxog">`);

		{
			$$payload.push('<!--[!-->');
			$$payload.push(`🎫 Wyślij zgłoszenie`);
		}

		$$payload.push(`<!--]--></button> <button class="action-btn secondary svelte-s2lxog">🗑️ Wyczyść</button></div> `);

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

		$$payload.push(`<!--]--> <div class="text-xs text-gray-400 italic">💡 Tip: Podanie szczegółowego opisu problemu pomoże naszemu systemowi AI
      lepiej sklasyfikować zgłoszenie</div></div></div>`);
	});
}

export { TicketSubmissionWidget as T };
