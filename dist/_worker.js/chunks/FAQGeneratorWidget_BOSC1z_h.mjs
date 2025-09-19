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
import { k as escape_html, n as attr } from './vendor_BHZTJLV0.mjs';
/* empty css                               */

function FAQGeneratorWidget($$payload, $$props) {
	$$payload.component(($$payload) => {
		let knowledgeBase = '';

		$$payload.push(`<div class="faq-widget-container svelte-f9nzj7"><h2 class="widget-title svelte-f9nzj7">🤖 Generator FAQ dynamiczny</h2> <div class="space-y-4"><div><label for="knowledge-base" class="block text-sm font-medium mb-2">Baza wiedzy (tekst źródłowy):</label> <textarea id="knowledge-base" rows="6" placeholder="Wklej tutaj treść bazy wiedzy, dokumentację, instrukcje lub inne materiały z których ma zostać wygenerowane FAQ..." class="widget-textarea svelte-f9nzj7">`);

		const $$body = escape_html(knowledgeBase);

		if ($$body) {
			$$payload.push(`${$$body}`);
		}

		$$payload.push(`</textarea></div> <div class="flex gap-3"><button${attr('disabled', !knowledgeBase.trim(), true)} class="action-btn primary svelte-f9nzj7">`);

		{
			$$payload.push('<!--[!-->');
			$$payload.push(`⚡ Generuj FAQ`);
		}

		$$payload.push(`<!--]--></button> <button class="action-btn secondary svelte-f9nzj7">🗑️ Wyczyść</button></div> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--> `);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--> <div class="tip-text svelte-f9nzj7">💡 Tip: Im bardziej szczegółowa baza wiedzy, tym lepsze FAQ zostanie wygenerowane</div></div></div>`);
	});
}

export { FAQGeneratorWidget as F };
