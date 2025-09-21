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
/* empty css                                     */
import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_xZvTY01m.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_BhpsI7E-.mjs';
import { b as escape_html, e as ensure_array_like, a as attr_class, s as stringify, c as attr, d as bind_props } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';
/* empty css                                        */

function DynamicChat($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let agent = $$props['agent'];
		let messages = [];
		let userInput = "";
		let isLoading = false;

		$$renderer.push(`<div class="chat-container border border-edge rounded-lg overflow-hidden mt-8" style="background: rgba(0, 0, 0, 0.5);"><div class="chat-header border-b border-edge p-4 flex items-center justify-between" style="background: rgba(0, 0, 0, 0.3);"><div class="flex items-center gap-3"><div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div> <span class="text-primary-foreground font-semibold">${escape_html(agent.name)}</span></div></div> <div class="chat-messages h-96 overflow-y-auto p-4 space-y-4"><!--[-->`);

		const each_array = ensure_array_like(messages);

		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let msg = each_array[$$index];

			$$renderer.push(`<div${attr_class(`message ${stringify(msg.from)}-message`, 'svelte-1s7eeir')}><div${attr_class(
				`message-content ${stringify(msg.from === 'user'
					? 'bg-blue-600/20 border-blue-400/30'
					: 'bg-cyan-600/20 border-cyan-400/30')} rounded-lg p-3`,
				'svelte-1s7eeir'
			)}><div class="message-text text-primary-foreground whitespace-pre-wrap">${escape_html(msg.text)}</div></div></div>`);
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div> <div class="chat-input border-t border-edge p-4"><div class="flex gap-3"><textarea rows="2" placeholder="Napisz swoją wiadomość..." class="flex-1 p-3 border border-edge rounded-lg text-primary-foreground placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none" style="background: rgba(0, 0, 0, 0.5);"${attr('disabled', isLoading, true)}>`);

		const $$body = escape_html(userInput);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea> <button class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"${attr('disabled', isLoading, true)}>Wyślij</button></div></div></div>`);
		bind_props($$props, { agent });
	});
}

const $$Astro = createAstro("https://www.mybonzo.com");
const $$agentId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$agentId;
  const { agentId } = Astro2.params;
  let agent = null;
  let error = null;
  try {
    const response = await fetch(new URL(`/api/agents/${agentId}`, Astro2.url.origin));
    if (response.ok) {
      agent = await response.json();
    } else {
      error = `Nie znaleziono agenta o ID: ${agentId}`;
    }
  } catch (e) {
    error = "B\u0142\u0105d podczas pobierania danych agenta.";
    console.error(e);
  }
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "title": agent ? `Czat z ${agent.name}` : "B\u0142\u0105d Agenta", "data-astro-cid-76is26rk": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh" data-astro-cid-76is26rk> <!-- Header Section --> <section class="border-b border-edge" data-astro-cid-76is26rk> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-76is26rk> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-76is26rk> <div class="mt-auto" data-astro-cid-76is26rk> <span style="writing-mode: vertical-lr;" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-76is26rk>
DYNAMIC_CHAT
</span> </div> <span class="mt-auto" data-astro-cid-76is26rk> <span class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-76is26rk> ${agent ? agent.name.toUpperCase().replace(/\s/g, "_") : "ERROR"} </span> </span> </div> </div> </section> <!-- Navigation Section --> <section class="border-b border-edge" data-astro-cid-76is26rk> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-76is26rk> <div class="flex flex-row p-2" data-astro-cid-76is26rk> <a class="hover:brightness-125" href="/" data-astro-cid-76is26rk> <h1 class="text-4xl sm:text-5xl" data-astro-cid-76is26rk>${agent ? `Czat z ${agent.name}` : "B\u0142\u0105d Agenta"}</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-76is26rk>Dynamicznie załadowany agent AI</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-76is26rk> <a class="ml-auto hover:brightness-125 duration-200" href="/agents" data-astro-cid-76is26rk>
← Powrót do listy agentów
</a> </div> </div> </div> </section> <!-- Main Content Section --> <section class="ai-workers-section flex items-center justify-center py-16" data-astro-cid-76is26rk> <div class="section-container max-w-4xl mx-auto w-full" data-astro-cid-76is26rk> ${agent ? renderTemplate`${renderComponent($$result2, "DynamicChat", DynamicChat, { "client:load": true, "agent": agent, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/DynamicChat.svelte", "client:component-export": "default", "data-astro-cid-76is26rk": true })}` : renderTemplate`<div class="text-center text-red-400" data-astro-cid-76is26rk> <h3 class="text-2xl font-bold" data-astro-cid-76is26rk>Wystąpił Błąd</h3> <p data-astro-cid-76is26rk>${error}</p> </div>`} </div> </section> </main> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/chat/[agentId].astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/chat/[agentId].astro";
const $$url = "/chat/[agentId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$agentId,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
