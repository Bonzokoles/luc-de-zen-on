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
import { p as push, j as escape_html, i as attr, k as pop } from './vendor_QZhDtzeH.mjs';
/* empty css                               */

function FAQGeneratorWidget($$payload, $$props) {
	push();

	let knowledgeBase = '';

	$$payload.out += `<div class="faq-widget-container svelte-lnkcwv"><h2 class="widget-title svelte-lnkcwv">🤖 Generator FAQ dynamiczny</h2> <div class="space-y-4"><div><label for="knowledge-base" class="block text-sm font-medium mb-2">Baza wiedzy (tekst źródłowy):</label> <textarea id="knowledge-base" rows="6" placeholder="Wklej tutaj treść bazy wiedzy, dokumentację, instrukcje lub inne materiały z których ma zostać wygenerowane FAQ..." class="widget-textarea svelte-lnkcwv">`;

	const $$body = escape_html(knowledgeBase);

	if ($$body) {
		$$payload.out += `${$$body}`;
	}

	$$payload.out += `</textarea></div> <div class="flex gap-3"><button${attr('disabled', !knowledgeBase.trim(), true)} class="action-btn primary svelte-lnkcwv">`;

	{
		$$payload.out += '<!--[!-->';
		$$payload.out += `⚡ Generuj FAQ`;
	}

	$$payload.out += `<!--]--></button> <button class="action-btn secondary svelte-lnkcwv">🗑️ Wyczyść</button></div> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> <div class="tip-text svelte-lnkcwv">💡 Tip: Im bardziej szczegółowa baza wiedzy, tym lepsze FAQ zostanie wygenerowane</div></div></div>`;
	pop();
}

export { FAQGeneratorWidget as F };
