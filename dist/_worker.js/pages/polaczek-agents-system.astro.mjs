globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_HpSis98d.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_DvEt2LDO.mjs';
import { n as noop, a as attr, k as store_get, e as escape_html, u as unsubscribe_stores } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';
/* empty css                                                  */

/** @import { Equals } from '#client' */


/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function safe_not_equal(a, b) {
	return a != a
		? b == b
		: a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
}

/** @import { Readable, StartStopNotifier, Subscriber, Unsubscriber, Updater, Writable } from '../public.js' */
/** @import { Stores, StoresValues, SubscribeInvalidateTuple } from '../private.js' */

/**
 * @type {Array<SubscribeInvalidateTuple<any> | any>}
 */
const subscriber_queue = [];

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * @template T
 * @param {T} [value] initial value
 * @param {StartStopNotifier<T>} [start]
 * @returns {Writable<T>}
 */
function writable(value, start = noop) {
	/** @type {Unsubscriber | null} */
	let stop = null;

	/** @type {Set<SubscribeInvalidateTuple<T>>} */
	const subscribers = new Set();

	/**
	 * @param {T} new_value
	 * @returns {void}
	 */
	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				// store is ready
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}

	/**
	 * @param {Updater<T>} fn
	 * @returns {void}
	 */
	function update(fn) {
		set(fn(/** @type {T} */ (value)));
	}

	/**
	 * @param {Subscriber<T>} run
	 * @param {() => void} [invalidate]
	 * @returns {Unsubscriber}
	 */
	function subscribe(run, invalidate = noop) {
		/** @type {SubscribeInvalidateTuple<T>} */
		const subscriber = [run, invalidate];
		subscribers.add(subscriber);
		if (subscribers.size === 1) {
			stop = start(set, update) || noop;
		}
		run(/** @type {T} */ (value));
		return () => {
			subscribers.delete(subscriber);
			if (subscribers.size === 0 && stop) {
				stop();
				stop = null;
			}
		};
	}
	return { set, update, subscribe };
}

function AgentBuilder($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;

		// Agent data store
		const agent = writable({ name: '', description: '', type: 'chatbot', config: {} });

		$$renderer.push(`<div class="agent-builder svelte-1ofe914"><h2 class="svelte-1ofe914">Agent Builder</h2> <form><div class="form-group svelte-1ofe914"><label for="agent-name" class="svelte-1ofe914">Agent Name</label> <input id="agent-name" type="text"${attr('value', store_get($$store_subs ??= {}, '$agent', agent).name)} placeholder="e.g., Customer Support Bot" required class="svelte-1ofe914"/></div> <div class="form-group svelte-1ofe914"><label for="agent-description" class="svelte-1ofe914">Agent Description</label> <textarea id="agent-description" placeholder="Describe the agent's purpose and capabilities." class="svelte-1ofe914">`);

		const $$body = escape_html(store_get($$store_subs ??= {}, '$agent', agent).description);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea></div> <div class="form-group svelte-1ofe914"><label for="agent-type" class="svelte-1ofe914">Agent Type</label> `);

		$$renderer.select(
			{
				id: 'agent-type',
				value: store_get($$store_subs ??= {}, '$agent', agent).type,
				class: ''
			},
			($$renderer) => {
				$$renderer.option({ value: 'chatbot' }, ($$renderer) => {
					$$renderer.push(`Chatbot`);
				});

				$$renderer.option({ value: 'task_automation' }, ($$renderer) => {
					$$renderer.push(`Task Automation`);
				});

				$$renderer.option({ value: 'data_analysis' }, ($$renderer) => {
					$$renderer.push(`Data Analysis`);
				});

				$$renderer.option({ value: 'custom' }, ($$renderer) => {
					$$renderer.push(`Custom`);
				});
			},
			'svelte-1ofe914'
		);

		$$renderer.push(`</div> <button type="submit" class="btn svelte-1ofe914">Create Agent</button></form></div>`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

function AgentBuilderWrapper($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let username = "";
		let password = "";
		const state = writable({ isLoggedIn: false, isDemo: false });

		if (store_get($$store_subs ??= {}, '$state', state).isLoggedIn || store_get($$store_subs ??= {}, '$state', state).isDemo) {
			$$renderer.push('<!--[-->');

			AgentBuilder($$renderer, {
				demo: store_get($$store_subs ??= {}, '$state', state).isDemo
			});
		} else {
			$$renderer.push('<!--[!-->');
			$$renderer.push(`<div class="max-w-md mx-auto bg-gray-900/50 border border-edge rounded-2xl p-8 shadow-xl text-white"><h3 class="text-2xl font-bold text-center text-cyan-400 mb-6">Logowanie Administratora</h3> <form class="space-y-6"><div><label for="username" class="block text-sm font-medium text-gray-300 mb-2">Nazwa użytkownika</label> <input type="text" id="username"${attr('value', username)} placeholder="admin" class="w-full px-4 py-2 bg-gray-800 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/></div> <div><label for="password" class="block text-sm font-medium text-gray-300 mb-2">Hasło</label> <input type="password" id="password"${attr('value', password)} placeholder="••••••••" class="w-full px-4 py-2 bg-gray-800 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/></div> `);

			{
				$$renderer.push('<!--[!-->');
			}

			$$renderer.push(`<!--]--> <div class="flex items-center justify-between gap-4 pt-4"><button type="button" class="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-all">Zobacz Demo</button> <button type="submit" class="w-full px-6 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-all">Zaloguj się</button></div></form></div>`);
		}

		$$renderer.push(`<!--]-->`);

		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}

const $$PolaczekAgentsSystem = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "POLACZEK Agent Builder + API Keys | POLACZEK AGENTS SYS_23", "data-astro-cid-s5hu4jl2": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="workers-vertical-line-left" data-astro-cid-s5hu4jl2></div> <div class="workers-vertical-line-right" data-astro-cid-s5hu4jl2></div> <main class="min-h-svh" data-astro-cid-s5hu4jl2> <!-- Top Separator Section --> <section class="border border-edge relative" data-astro-cid-s5hu4jl2> <div class="absolute left-0 right-0 h-full" data-astro-cid-s5hu4jl2> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-s5hu4jl2> <div class="py-1" data-astro-cid-s5hu4jl2></div> </div> </section> <!-- Header Section --> <section class="border border-edge relative" data-astro-cid-s5hu4jl2> <div class="absolute left-0 right-0 h-full" data-astro-cid-s5hu4jl2> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-s5hu4jl2> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-s5hu4jl2> <div class="mt-auto" style="max-width: 45vw;" data-astro-cid-s5hu4jl2> <div class="text-edge text-sm italic px-2" style="
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
              " data-astro-cid-s5hu4jl2>
POLACZEK Agent System 2.3 - Zaawansowany<br data-astro-cid-s5hu4jl2>
kreator agentów AI z pełnym SDK.<br data-astro-cid-s5hu4jl2>
Buduj, testuj i wdrażaj inteligentnych<br data-astro-cid-s5hu4jl2>
asystentów dla Twojego biznesu.
</div> </div> <span class="mt-auto" data-astro-cid-s5hu4jl2> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 15px;
              width: calc(50vw - 576px - 10px - 20px - 30px);
              max-width: 400px;
              text-align: right;
              word-wrap: break-word;
              hyphens: auto;
            " data-astro-cid-s5hu4jl2> <span class="text-primary-foreground text-sm italic" data-astro-cid-s5hu4jl2>
"Przyszłość to AI, które rozumie człowieka"
</span> </div> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-s5hu4jl2>
SEP 2025
</span> </span> </div> </div> </section> <!-- Header-Navigation Separator --> <section class="border border-edge relative" data-astro-cid-s5hu4jl2> <div class="absolute left-0 right-0 h-full" data-astro-cid-s5hu4jl2> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-s5hu4jl2> <div class="py-1" data-astro-cid-s5hu4jl2></div> </div> </section> <!-- Navigation Section --> <section class="border border-edge relative" data-astro-cid-s5hu4jl2> <div class="absolute left-0 right-0 h-full" data-astro-cid-s5hu4jl2> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-s5hu4jl2> <div class="flex flex-row p-2" data-astro-cid-s5hu4jl2> <a class="hover:brightness-125" href="/" data-astro-cid-s5hu4jl2> <h1 class="text-4xl sm:text-5xl" data-astro-cid-s5hu4jl2>POLACZEK AGENTS</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-s5hu4jl2>AI Agent Builder System</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-s5hu4jl2> <a class="ml-auto hover:brightness-125 duration-200" href="/" data-astro-cid-s5hu4jl2>
← Powrót do strony głównej
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-s5hu4jl2> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-s5hu4jl2></path> </svg> </a> <div class="flex flex-row-reverse flex-wrap gap-4" data-astro-cid-s5hu4jl2> <a class="hover:brightness-125 duration-200" href="/POLACZEK_AGENT_SYS_23/api-keys" data-astro-cid-s5hu4jl2>
API Keys
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-s5hu4jl2> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-s5hu4jl2></path> </svg> </a> <a class="hover:brightness-125 duration-200" href="/POLACZEK_AGENT_SYS_23/agent-data-simple" data-astro-cid-s5hu4jl2>
Agent Data
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-s5hu4jl2> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-s5hu4jl2></path> </svg> </a> <a class="hover:brightness-125 duration-200" href="/workers-status" data-astro-cid-s5hu4jl2>
STATUS
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-s5hu4jl2> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-s5hu4jl2></path> </svg> </a> </div> </div> </div> </div> </section> <!-- Separator Section 1 --> <section class="border border-edge relative" data-astro-cid-s5hu4jl2> <div class="absolute left-0 right-0 h-full" data-astro-cid-s5hu4jl2> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-s5hu4jl2> <div class="py-1" data-astro-cid-s5hu4jl2></div> </div> </section> <!-- Main Content Section --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative" id="polaczek-agents" data-astro-cid-s5hu4jl2> <div class="absolute left-0 right-0 h-full" data-astro-cid-s5hu4jl2> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-s5hu4jl2></div> </div> <div class="max-w-6xl mx-auto w-full" data-astro-cid-s5hu4jl2> <div class="section-container" data-astro-cid-s5hu4jl2> <h2 class="system-title" data-astro-cid-s5hu4jl2>POLACZEK AGENTS SYSTEM 2.3</h2> <!-- Separator after title --> <div style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
            max-width: 1212px;
            margin: 0 auto;
            border-t: 1px solid #ffffff;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
          " data-astro-cid-s5hu4jl2></div> <p class="section-description" style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px) - 40px);
            max-width: 1100px;
            margin: 0 auto;
            margin-left: calc(50% - 10px);
            transform: translateX(-50%);
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            padding: 0 15px;
          " data-astro-cid-s5hu4jl2>
Zaawansowany system budowania i zarządzania agentami AI z wizualnym
            interfejsem drag-and-drop. Pełne SDK z funkcjami wyszukiwania, analizy,
            generowania treści i personalizacji.
</p> </div> <!-- Agent Builder Interface --> <div class="agent-container border border-edge rounded-lg overflow-hidden mt-8" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-s5hu4jl2> <!-- Agent Builder Header --> <div class="agent-header border-b border-edge p-4 flex items-center justify-between" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-s5hu4jl2> <div class="flex items-center gap-3" data-astro-cid-s5hu4jl2> <div class="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" data-astro-cid-s5hu4jl2></div> <span class="text-primary-foreground font-semibold" data-astro-cid-s5hu4jl2>Agent Builder Online</span> </div> <div class="flex gap-2" data-astro-cid-s5hu4jl2> <button onclick="resetBuilder()" class="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-400 hover:bg-red-500/30 transition-all text-sm" data-astro-cid-s5hu4jl2>
Reset
</button> <button onclick="saveAgent()" class="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded text-green-400 hover:bg-green-500/30 transition-all text-sm" data-astro-cid-s5hu4jl2>
Save Agent
</button> </div> </div> <div class="agent-content p-8" data-astro-cid-s5hu4jl2> <!-- Agent Builder z wbudowaną autoryzacją --> ${renderComponent($$result2, "AgentBuilderWrapper", AgentBuilderWrapper, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AgentBuilderWrapper.svelte", "client:component-export": "default", "data-astro-cid-s5hu4jl2": true })} </div> </div> <!-- Quick Actions Section --> <div class="quick-actions mt-12" data-astro-cid-s5hu4jl2> <h3 class="text-xl font-semibold mb-6 text-primary-foreground text-center" data-astro-cid-s5hu4jl2>
AKCJE SYSTEMOWE
</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-astro-cid-s5hu4jl2> <div class="worker-card" style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 217, 255, 0.4);" data-astro-cid-s5hu4jl2> <h3 class="worker-title" data-astro-cid-s5hu4jl2>🤖 Zarządzaj Agentami</h3> <p class="worker-description" data-astro-cid-s5hu4jl2>
Zobacz listę wszystkich agentów systemowych i stworzonych przez
                użytkowników
</p> <div class="worker-features" data-astro-cid-s5hu4jl2> <span class="feature-tag" data-astro-cid-s5hu4jl2>Active Agents</span> <span class="feature-tag" data-astro-cid-s5hu4jl2>Management</span> <span class="feature-tag" data-astro-cid-s5hu4jl2>Monitoring</span> </div> <div class="worker-actions" data-astro-cid-s5hu4jl2> <button class="action-btn primary" onclick="window.open('/agents', '_blank')" data-astro-cid-s5hu4jl2>
Otwórz Panel
</button> <button class="action-btn secondary" onclick="listActiveAgents()" data-astro-cid-s5hu4jl2>
Lista Aktywnych
</button> </div> </div> <div class="worker-card" style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 217, 255, 0.4);" data-astro-cid-s5hu4jl2> <h3 class="worker-title" data-astro-cid-s5hu4jl2>📖 Dokumentacja</h3> <p class="worker-description" data-astro-cid-s5hu4jl2>
Przewodnik tworzenia efektywnych promptów i konfiguracji agentów
                AI
</p> <div class="worker-features" data-astro-cid-s5hu4jl2> <span class="feature-tag" data-astro-cid-s5hu4jl2>Tutorials</span> <span class="feature-tag" data-astro-cid-s5hu4jl2>Examples</span> <span class="feature-tag" data-astro-cid-s5hu4jl2>Best Practices</span> </div> <div class="worker-actions" data-astro-cid-s5hu4jl2> <button class="action-btn primary" onclick="window.open('/docs/agent-building-guide', '_blank')" data-astro-cid-s5hu4jl2>
Otwórz Docs
</button> <button class="action-btn secondary" onclick="showQuickGuide()" data-astro-cid-s5hu4jl2>
Quick Guide
</button> </div> </div> <div class="worker-card" style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 217, 255, 0.4);" data-astro-cid-s5hu4jl2> <h3 class="worker-title" data-astro-cid-s5hu4jl2>💎 Premium Features</h3> <p class="worker-description" data-astro-cid-s5hu4jl2>
Odblokuj zaawansowane funkcje systemu z subskrypcją Pro lub
                Enterprise
</p> <div class="worker-features" data-astro-cid-s5hu4jl2> <span class="feature-tag" data-astro-cid-s5hu4jl2>Pro Tools</span> <span class="feature-tag" data-astro-cid-s5hu4jl2>Enterprise</span> <span class="feature-tag" data-astro-cid-s5hu4jl2>Advanced AI</span> </div> <div class="worker-actions" data-astro-cid-s5hu4jl2> <button class="action-btn primary" onclick="window.open('/zenon-mcp-server', '_blank')" data-astro-cid-s5hu4jl2>
Zobacz Plany
</button> <button class="action-btn secondary" onclick="checkSubscription()" data-astro-cid-s5hu4jl2>
Status
</button> </div> </div> </div> </div> </div> </section> </main> ` })}  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/polaczek-agents-system.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/polaczek-agents-system.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/polaczek-agents-system.astro";
const $$url = "/polaczek-agents-system";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$PolaczekAgentsSystem,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
