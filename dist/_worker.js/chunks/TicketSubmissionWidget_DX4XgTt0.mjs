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
import { n as attr, k as escape_html } from './vendor_DlPT8CWO.mjs';
/* empty css                              */

function TicketSubmissionWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let form = { description: "", email: "", priority: "medium", category: "" };

		$$renderer.push(`<div class="ticket-widget-container svelte-s2lxog"><h2 class="widget-title svelte-s2lxog">🎫 System zgłoszeń i ticketów</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-2">Email *</label> <input type="email"${attr('value', form.email)} placeholder="twoj.email@example.com" class="widget-input svelte-s2lxog"/></div> <div><label class="block text-sm font-medium mb-2">Priorytet</label> `);

		$$renderer.select({ value: form.priority, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: 'low', class: '' }, ($$renderer) => {
				$$renderer.push(`🟢 Niski`);
			});

			$$renderer.option({ value: 'medium', class: '' }, ($$renderer) => {
				$$renderer.push(`🟡 Średni`);
			});

			$$renderer.option({ value: 'high', class: '' }, ($$renderer) => {
				$$renderer.push(`🟠 Wysoki`);
			});

			$$renderer.option({ value: 'critical', class: '' }, ($$renderer) => {
				$$renderer.push(`🔴 Krytyczny`);
			});
		});

		$$renderer.push(`</div></div> <div><label class="block text-sm font-medium mb-2">Kategoria (opcjonalna)</label> `);

		$$renderer.select({ value: form.category, class: 'widget-select' }, ($$renderer) => {
			$$renderer.option({ value: '', class: '' }, ($$renderer) => {
				$$renderer.push(`Wybierz kategorię`);
			});

			$$renderer.option({ value: 'bug', class: '' }, ($$renderer) => {
				$$renderer.push(`🐛 Błąd w systemie`);
			});

			$$renderer.option({ value: 'feature-request', class: '' }, ($$renderer) => {
				$$renderer.push(`✨ Prośba o funkcję`);
			});

			$$renderer.option({ value: 'question', class: '' }, ($$renderer) => {
				$$renderer.push(`❓ Pytanie`);
			});

			$$renderer.option({ value: 'billing', class: '' }, ($$renderer) => {
				$$renderer.push(`💰 Płatności/Faktury`);
			});

			$$renderer.option({ value: 'integration', class: '' }, ($$renderer) => {
				$$renderer.push(`🔗 Integracje`);
			});

			$$renderer.option({ value: 'performance', class: '' }, ($$renderer) => {
				$$renderer.push(`⚡ Wydajność`);
			});

			$$renderer.option({ value: 'other', class: '' }, ($$renderer) => {
				$$renderer.push(`🤔 Inne`);
			});
		});

		$$renderer.push(`</div> <div><label class="block text-sm font-medium mb-2">Opis problemu *</label> <textarea rows="6" placeholder="Opisz szczegółowo swój problem lub zapytanie. Im więcej informacji podasz, tym szybciej będziemy mogli pomóc..." class="widget-textarea svelte-s2lxog">`);

		const $$body = escape_html(form.description);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea></div> <div class="flex gap-3"><button${attr('disabled', true, true)} class="action-btn primary svelte-s2lxog">`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`🎫 Wyślij zgłoszenie`);
		}

		$$renderer.push(`<!--]--></button> <button class="action-btn secondary svelte-s2lxog">🗑️ Wyczyść</button></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="text-xs text-gray-400 italic">💡 Tip: Podanie szczegółowego opisu problemu pomoże naszemu systemowi AI
      lepiej sklasyfikować zgłoszenie</div></div></div>`);
	});
}

export { TicketSubmissionWidget as T };
