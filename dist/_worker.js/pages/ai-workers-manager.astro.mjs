globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_CxYxxMc2.mjs';
import { c as attr, e as ensure_array_like, b as escape_html, a as attr_class, s as stringify } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';
/* empty css                                              */

function AIWorkersManager($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		// Removed cloudflareApi import, using local fetch instead
		// State management
		let workers = [];

		let selectedWorker = null;
		let loading = false;

		// Form data
		let newWorkerName = "";

		let newWorkerType = "chat";

		let workerConfig = {
			model: "llama-3.1-8b-instant",
			maxTokens: 1000,
			temperature: 0.7
		};

		// Worker types configuration
		const workerTypes = [
			{ id: "chat", name: "Chat AI", endpoint: "/api/chat" },

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

		$$renderer.push(`<div class="ai-workers-manager svelte-1sonwds"><div class="header svelte-1sonwds"><h2 class="svelte-1sonwds">🤖 AI Workers Manager</h2> <p class="subtitle svelte-1sonwds">Zarządzaj AI Workers w środowisku Cloudflare</p></div> `);

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

		$$renderer.push(`<!--]--> <div class="create-worker-section svelte-1sonwds"><h3>➕ Utwórz Nowy Worker</h3> <form class="worker-form svelte-1sonwds"><div class="form-group svelte-1sonwds"><label for="worker-name" class="svelte-1sonwds">Nazwa Worker:</label> <input id="worker-name" type="text"${attr('value', newWorkerName)} placeholder="np. Chat Assistant v2" required class="svelte-1sonwds"/></div> <div class="form-group svelte-1sonwds"><label for="worker-type" class="svelte-1sonwds">Typ Worker:</label> `);

		$$renderer.select({ id: 'worker-type', value: newWorkerType, class: '' }, ($$renderer) => {
			$$renderer.push(`<!--[-->`);

			const each_array = ensure_array_like(workerTypes);

			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let type = each_array[$$index];

				$$renderer.option({ value: type.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(type.name)}`);
				});
			}

			$$renderer.push(`<!--]-->`);
		});

		$$renderer.push(`</div> <div class="config-section"><h4>Konfiguracja AI:</h4> <div class="form-row svelte-1sonwds"><div class="form-group svelte-1sonwds"><label for="model" class="svelte-1sonwds">Model:</label> `);

		$$renderer.select({ id: 'model', value: workerConfig.model, class: '' }, ($$renderer) => {
			$$renderer.option({ value: 'llama-3.1-8b-instant' }, ($$renderer) => {
				$$renderer.push(`Llama 3.1 8B`);
			});

			$$renderer.option({ value: 'llama-3.1-70b-versatile' }, ($$renderer) => {
				$$renderer.push(`Llama 3.1 70B`);
			});

			$$renderer.option({ value: 'gemma-7b-it' }, ($$renderer) => {
				$$renderer.push(`Gemma 7B`);
			});
		});

		$$renderer.push(`</div> <div class="form-group svelte-1sonwds"><label for="max-tokens" class="svelte-1sonwds">Max Tokens:</label> <input id="max-tokens" type="number"${attr('value', workerConfig.maxTokens)} min="100" max="4000" class="svelte-1sonwds"/></div> <div class="form-group svelte-1sonwds"><label for="temperature" class="svelte-1sonwds">Temperature:</label> <input id="temperature" type="range"${attr('value', workerConfig.temperature)} min="0" max="2" step="0.1" class="svelte-1sonwds"/> <span class="range-value svelte-1sonwds">${escape_html(workerConfig.temperature)}</span></div></div></div> <button type="submit" class="btn-primary svelte-1sonwds"${attr('disabled', !newWorkerName.trim(), true)}>🚀 Utwórz Worker</button></form></div> <div class="workers-list-section svelte-1sonwds"><div class="section-header svelte-1sonwds"><h3>📋 Lista Workers (${escape_html(workers.length)})</h3> <button class="btn-secondary svelte-1sonwds"${attr('disabled', loading, true)}>🔄 Odśwież</button></div> `);

		if (workers.length === 0 && !loading) {
			$$renderer.push('<!--[-->');
			$$renderer.push(`<div class="empty-state svelte-1sonwds"><span class="icon svelte-1sonwds">🤖</span> <p>Brak workers. Utwórz pierwszy!</p></div>`);
		} else {
			$$renderer.push('<!--[!-->');
			$$renderer.push(`<div class="workers-grid svelte-1sonwds"><!--[-->`);

			const each_array_1 = ensure_array_like(workers);

			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let worker = each_array_1[$$index_1];

				$$renderer.push(`<div${attr_class('worker-card svelte-1sonwds', void 0, { 'selected': selectedWorker?.id === worker.id })}><div class="worker-header svelte-1sonwds"><h4 class="svelte-1sonwds">${escape_html(worker.name)}</h4> <span class="worker-type svelte-1sonwds">${escape_html(workerTypes.find((t) => t.id === worker.type)?.name || worker.type)}</span></div> <div class="worker-details svelte-1sonwds"><p class="svelte-1sonwds"><strong>Model:</strong> ${escape_html(worker.config?.model || "N/A")}</p> <p class="svelte-1sonwds"><strong>Endpoint:</strong> <code class="svelte-1sonwds">${escape_html(worker.endpoint)}</code></p> <p class="svelte-1sonwds"><strong>Status:</strong> <span${attr_class(`status ${stringify(worker.status || 'active')}`, 'svelte-1sonwds')}>${escape_html(worker.status || "active")}</span></p></div> <div class="worker-actions svelte-1sonwds"><button class="btn-test svelte-1sonwds"${attr('disabled', loading, true)}>🧪 Test</button> <button class="btn-select svelte-1sonwds"${attr('disabled', loading, true)}>📋 Wybierz</button> <button class="btn-danger svelte-1sonwds"${attr('disabled', loading, true)}>🗑️ Usuń</button></div></div>`);
			}

			$$renderer.push(`<!--]--></div>`);
		}

		$$renderer.push(`<!--]--></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

const $$AiWorkersManager = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Workers Manager - Zarz\u0105dzanie AI Workers", "data-astro-cid-656rxf6d": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="manager-container" data-astro-cid-656rxf6d> ${renderComponent($$result2, "AIWorkersManager", AIWorkersManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/AIWorkersManager.svelte", "client:component-export": "default", "data-astro-cid-656rxf6d": true })} </div> ` })} `;
}, "Q:/mybonzo/mybonzo-github/src/pages/ai-workers-manager.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/ai-workers-manager.astro";
const $$url = "/ai-workers-manager";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiWorkersManager,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
