globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, d as renderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_C1oOU0Od.mjs';
import { e as escape_html, a as attr, b as ensure_array_like, c as attr_class, d as clsx } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';
/* empty css                                        */

function PolaczekDyrektorPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let // Pobieranie agentów z backendu
		// Pobierz konfigurację systemu
		visibleAgents;

		let agents = [];
		let search = "";

		let newAgent = {
			name: "",
			type: "T",
			role: "",
			description: "",
			endpoint: ""
		};

		let config = {};

		visibleAgents = agents.filter((a) => search === "");

		$$renderer.push(`<div class="container svelte-ci4y1b"><h2>POLACZEK Dyrektor – Panel Agentów</h2> <div>GPU: ${escape_html(config.gpu)} | RAM: ${escape_html(config.ram)} | DB: ${escape_html(config.db)} | Routing: ${escape_html(config.routing)} | Liczba agentów: ${escape_html(config.agentsCount)}</div> <input type="text"${attr('value', search)} placeholder="Szukaj agentów..."/> <table class="svelte-ci4y1b"><thead><tr><th>ID</th><th>Nazwa</th><th>Typ</th><th>Rola</th><th>Status</th><th>Opis</th><th>Endpoint</th><th>Akcje</th></tr></thead><tbody><!--[-->`);

		const each_array = ensure_array_like(visibleAgents);

		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let agent = each_array[$$index];

			$$renderer.push(`<tr${attr_class(clsx(agent.status === "active" ? "active-row" : ""), 'svelte-ci4y1b')}><td>${escape_html(agent.id)}</td><td>${escape_html(agent.name)}</td><td>${escape_html(agent.type)}</td><td>${escape_html(agent.role)}</td><td>`);

			$$renderer.select({ value: agent.status }, ($$renderer) => {
				$$renderer.option({ value: 'active' }, ($$renderer) => {
					$$renderer.push(`active`);
				});

				$$renderer.option({ value: 'idle' }, ($$renderer) => {
					$$renderer.push(`idle`);
				});

				$$renderer.option({ value: 'busy' }, ($$renderer) => {
					$$renderer.push(`busy`);
				});

				$$renderer.option({ value: 'error' }, ($$renderer) => {
					$$renderer.push(`error`);
				});

				$$renderer.option({ value: 'disabled' }, ($$renderer) => {
					$$renderer.push(`disabled`);
				});
			});

			$$renderer.push(`</td><td>${escape_html(agent.description)}</td><td>${escape_html(agent.endpoint)}</td><td><button>Usuń</button></td></tr>`);
		}

		$$renderer.push(`<!--]--></tbody></table> <h3>Dodaj nowego agenta POLACZEK_X</h3> <div class="new-agent-row svelte-ci4y1b">`);

		$$renderer.select({ value: newAgent.type }, ($$renderer) => {
			$$renderer.option({ value: 'T' }, ($$renderer) => {
				$$renderer.push(`Tłumacz`);
			});

			$$renderer.option({ value: 'M' }, ($$renderer) => {
				$$renderer.push(`Music Assistant`);
			});

			$$renderer.option({ value: 'D' }, ($$renderer) => {
				$$renderer.push(`Dashboard Keeper`);
			});

			$$renderer.option({ value: 'B' }, ($$renderer) => {
				$$renderer.push(`Bibliotekarz`);
			});

			$$renderer.option({ value: 'Dyrektor' }, ($$renderer) => {
				$$renderer.push(`Dyrektor`);
			});

			$$renderer.option({ value: 'Magazynier' }, ($$renderer) => {
				$$renderer.push(`Magazynier`);
			});
		});

		$$renderer.push(` <input type="text"${attr('value', newAgent.name)} placeholder="Nazwa agenta"/> <input type="text"${attr('value', newAgent.role)} placeholder="Rola agenta"/> <input type="text"${attr('value', newAgent.description)} placeholder="Opis (opcjonalnie)"/> <input type="text"${attr('value', newAgent.endpoint)} placeholder="Endpoint (opcjonalnie)"/> <button>Dodaj</button></div></div>`);
	});
}

const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pl" data-astro-cid-x6qnsptu> <head><title>Panel Dyrektora</title>${renderHead()}</head> <body data-astro-cid-x6qnsptu> ${renderComponent($$result, "PolaczekDyrektorPanel", PolaczekDyrektorPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/admin/PolaczekDyrektorPanel.svelte", "client:component-export": "default", "data-astro-cid-x6qnsptu": true })} </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/dashboard.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/admin/dashboard.astro";
const $$url = "/admin/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
