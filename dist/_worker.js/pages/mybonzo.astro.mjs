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
import { j as escape_html, i as attr, c as createComponent, f as renderHead, r as renderComponent, a as renderTemplate } from '../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../chunks/vendor_QZhDtzeH.mjs';
/* empty css                                   */

function MyBonzoChat($$payload) {
	let prompt = "";

	$$payload.out += `<div class="mybonzo-chat-widget p-6 bg-gray-900 rounded-lg border border-gray-700 svelte-10dff0r"><div class="mb-4"><h3 class="text-xl font-bold text-white mb-2">🤖 MyBonzo AI Assistant</h3> <p class="text-gray-400 text-sm">Polski asystent AI specjalizujący się w Cloudflare Workers i technologiach
      chmurowych</p></div> <div class="space-y-4"><div><textarea placeholder="Zapytaj MyBonzo o Cloudflare Workers, deployment, AI, lub inne technologie..." class="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none" rows="3">`;

	const $$body = escape_html(prompt);

	if ($$body) {
		$$payload.out += `${$$body}`;
	}

	$$payload.out += `</textarea></div> <button${attr('disabled', !prompt.trim(), true)} class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">${escape_html("Zapytaj MyBonzo")}</button> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--></div></div>`;
}

const $$Mybonzo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MyBonzo AI Assistant</title><meta name="description" content="Twój inteligentny asystent AI">${renderHead()}</head> <body class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"> <main class="min-h-screen flex items-center justify-center p-4"> <div class="w-full max-w-4xl"> <h1 class="text-4xl font-bold text-cyan-300 mb-8 text-center">
🤖 MyBonzo AI Assistant
</h1> ${renderComponent($$result, "MyBonzoChat", MyBonzoChat, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/MyBonzoChat.svelte", "client:component-export": "default" })} </div> </main> </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/mybonzo.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/mybonzo.astro";
const $$url = "/mybonzo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Mybonzo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
