globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as escape_html, b as attr } from './_@astro-renderers_ChtfEq-M.mjs';
/* empty css                               */

function FAQGeneratorWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let knowledgeBase = '';

		$$renderer.push(`<div class="faq-widget-container svelte-f9nzj7"><h2 class="widget-title svelte-f9nzj7">🤖 Generator FAQ dynamiczny</h2> <div class="space-y-4"><div><label for="knowledge-base" class="block text-sm font-medium mb-2">Baza wiedzy (tekst źródłowy):</label> <textarea id="knowledge-base" rows="6" placeholder="Wklej tutaj treść bazy wiedzy, dokumentację, instrukcje lub inne materiały z których ma zostać wygenerowane FAQ..." class="widget-textarea svelte-f9nzj7">`);

		const $$body = escape_html(knowledgeBase);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea></div> <div class="flex gap-3"><button${attr('disabled', !knowledgeBase.trim(), true)} class="action-btn primary svelte-f9nzj7">`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`⚡ Generuj FAQ`);
		}

		$$renderer.push(`<!--]--></button> <button class="action-btn secondary svelte-f9nzj7">🗑️ Wyczyść</button></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="tip-text svelte-f9nzj7">💡 Tip: Im bardziej szczegółowa baza wiedzy, tym lepsze FAQ zostanie wygenerowane</div></div></div>`);
	});
}

export { FAQGeneratorWidget as F };
