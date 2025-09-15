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
import { p as push, l as ensure_array_like, i as attr, j as escape_html, t as to_class, k as pop, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../chunks/vendor_QZhDtzeH.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_UkYhPfz2.mjs';
/* empty css                                              */

function AIWorkersManager($$payload, $$props) {
	push();

	// Removed cloudflareApi import, using local fetch instead
	// State management
	let workers = [];
	let selectedWorker = null;
	let loading = false;
	// Form data
	let newWorkerName = "";

	let workerConfig = {
		maxTokens: 1000,
		temperature: 0.7
	};

	// Worker types configuration
	const workerTypes = [
		{
			id: "chat",
			name: "Chat AI",
			endpoint: "/api/chat"
		},
		{
			id: "image",
			name: "Image Generator",
			endpoint: "/api/generate-image"
		},
		{
			id: "analyze",
			name: "Data Analyzer",
			endpoint: "/api/data-analyze"
		},
		{
			id: "search",
			name: "Search Assistant",
			endpoint: "/api/search"
		}
	];

	const each_array = ensure_array_like(workerTypes);

	$$payload.out += `<div class="ai-workers-manager svelte-1qsa07w"><div class="header svelte-1qsa07w"><h2 class="svelte-1qsa07w">🤖 AI Workers Manager</h2> <p class="subtitle svelte-1qsa07w">Zarządzaj AI Workers w środowisku Cloudflare</p></div> `;

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

	$$payload.out += `<!--]--> <div class="create-worker-section svelte-1qsa07w"><h3>➕ Utwórz Nowy Worker</h3> <form class="worker-form svelte-1qsa07w"><div class="form-group svelte-1qsa07w"><label for="worker-name" class="svelte-1qsa07w">Nazwa Worker:</label> <input id="worker-name" type="text"${attr('value', newWorkerName)} placeholder="np. Chat Assistant v2" required class="svelte-1qsa07w"></div> <div class="form-group svelte-1qsa07w"><label for="worker-type" class="svelte-1qsa07w">Typ Worker:</label> <select id="worker-type" class="svelte-1qsa07w"><!--[-->`;

	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let type = each_array[$$index];

		$$payload.out += `<option${attr('value', type.id)}>${escape_html(type.name)}</option>`;
	}

	$$payload.out += `<!--]--></select></div> <div class="config-section"><h4>Konfiguracja AI:</h4> <div class="form-row svelte-1qsa07w"><div class="form-group svelte-1qsa07w"><label for="model" class="svelte-1qsa07w">Model:</label> <select id="model" class="svelte-1qsa07w"><option value="llama-3.1-8b-instant">Llama 3.1 8B</option><option value="llama-3.1-70b-versatile">Llama 3.1 70B</option><option value="gemma-7b-it">Gemma 7B</option></select></div> <div class="form-group svelte-1qsa07w"><label for="max-tokens" class="svelte-1qsa07w">Max Tokens:</label> <input id="max-tokens" type="number"${attr('value', workerConfig.maxTokens)} min="100" max="4000" class="svelte-1qsa07w"></div> <div class="form-group svelte-1qsa07w"><label for="temperature" class="svelte-1qsa07w">Temperature:</label> <input id="temperature" type="range"${attr('value', workerConfig.temperature)} min="0" max="2" step="0.1" class="svelte-1qsa07w"> <span class="range-value svelte-1qsa07w">${escape_html(workerConfig.temperature)}</span></div></div></div> <button type="submit" class="btn-primary svelte-1qsa07w"${attr('disabled', !newWorkerName.trim(), true)}>🚀 Utwórz Worker</button></form></div> <div class="workers-list-section svelte-1qsa07w"><div class="section-header svelte-1qsa07w"><h3>📋 Lista Workers (${escape_html(workers.length)})</h3> <button class="btn-secondary svelte-1qsa07w"${attr('disabled', loading, true)}>🔄 Odśwież</button></div> `;

	if (workers.length === 0 && true) {
		$$payload.out += '<!--[-->';
		$$payload.out += `<div class="empty-state svelte-1qsa07w"><span class="icon svelte-1qsa07w">🤖</span> <p>Brak workers. Utwórz pierwszy!</p></div>`;
	} else {
		$$payload.out += '<!--[!-->';

		const each_array_1 = ensure_array_like(workers);

		$$payload.out += `<div class="workers-grid svelte-1qsa07w"><!--[-->`;

		for (let $$index_1 = 0,
			$$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let worker = each_array_1[$$index_1];

			$$payload.out += `<div${attr('class', to_class('worker-card', 'svelte-1qsa07w', { 'selected': selectedWorker?.id === worker.id }))}><div class="worker-header svelte-1qsa07w"><h4 class="svelte-1qsa07w">${escape_html(worker.name)}</h4> <span class="worker-type svelte-1qsa07w">${escape_html(workerTypes.find((t) => t.id === worker.type)?.name || worker.type)}</span></div> <div class="worker-details svelte-1qsa07w"><p class="svelte-1qsa07w"><strong>Model:</strong> ${escape_html(worker.config?.model || "N/A")}</p> <p class="svelte-1qsa07w"><strong>Endpoint:</strong> <code class="svelte-1qsa07w">${escape_html(worker.endpoint)}</code></p> <p class="svelte-1qsa07w"><strong>Status:</strong> <span${attr('class', to_class('status ' + (worker.status || 'active'), 'svelte-1qsa07w'))}>${escape_html(worker.status || "active")}</span></p></div> <div class="worker-actions svelte-1qsa07w"><button class="btn-test svelte-1qsa07w"${attr('disabled', loading, true)}>🧪 Test</button> <button class="btn-select svelte-1qsa07w"${attr('disabled', loading, true)}>📋 Wybierz</button> <button class="btn-danger svelte-1qsa07w"${attr('disabled', loading, true)}>🗑️ Usuń</button></div></div>`;
		}

		$$payload.out += `<!--]--></div>`;
	}

	$$payload.out += `<!--]--></div> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--></div>`;
	pop();
}

const $$AiWorkersManager = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Workers Manager - Zarz\u0105dzanie AI Workers", "data-astro-cid-656rxf6d": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="manager-container" data-astro-cid-656rxf6d> ${renderComponent($$result2, "AIWorkersManager", AIWorkersManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AIWorkersManager.svelte", "client:component-export": "default", "data-astro-cid-656rxf6d": true })} </div> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-workers-manager.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-workers-manager.astro";
const $$url = "/ai-workers-manager";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiWorkersManager,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
