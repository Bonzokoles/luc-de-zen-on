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
import { e as createAstro, c as createComponent, m as maybeRenderHead, h as addAttribute, q as renderSlot, a as renderTemplate, r as renderComponent } from '../chunks/vendor_DlPT8CWO.mjs';
export { d as renderers } from '../chunks/vendor_DlPT8CWO.mjs';
import { $ as $$BackroomInterface } from '../chunks/BackroomInterface_Dr2EV_L9.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$HubCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HubCard;
  const { title, description = "", href = "#" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a class="block border border-cyber-border bg-cyber-surface p-6 hover:brightness-110 transition-shadow"${addAttribute(href, "href")}> <div class="flex items-start gap-4"> <div class="w-12 h-12 rounded flex items-center justify-center bg-cyber-dark/40"> <!-- icon slot placeholder --> ${renderSlot($$result, $$slots["icon"], renderTemplate`⚙️`)} </div> <div> <h3 class="uppercase tracking-widest text-cyber-blue font-semibold"> ${title} </h3> ${description && renderTemplate`<p class="text-cyber-text-dim mt-2">${description}</p>`} </div> </div> <div class="mt-6 flex gap-3"> <button class="px-4 py-2 border border-cyber-border text-cyber-blue">OTWÓRZ</button> <button class="px-4 py-2 border border-cyber-border text-cyber-text-dim">WIĘCEJ</button> </div> </a>`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/HubCard.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "AI WORKERS HUB" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-3xl font-bold text-cyber-blue text-center">AI WORKERS</h1> <p class="text-center text-cyber-text-dim mt-4">
Zaawansowane narzędzia AI dostępne na platformie
</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"> ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Generator Obraz\xF3w", "description": "Tw\xF3rz obrazy z tekstu.", "href": "/hub/generator" }, { "icon": ($$result3) => renderTemplate`<span>🖼️</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "AI Chatbot", "description": "Inteligentny asystent do rozm\xF3w.", "href": "/hub/chatbot" }, { "icon": ($$result3) => renderTemplate`<span>💬</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "BigQuery Analytics", "description": "Analizuj dane i wykonuj zapytania SQL.", "href": "/hub/bigquery" }, { "icon": ($$result3) => renderTemplate`<span>📊</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Kaggle Datasets", "description": "Przeszukuj zbiory danych i konkursy.", "href": "/hub/kaggle" }, { "icon": ($$result3) => renderTemplate`<span>📁</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Tavily AI Search", "description": "Zaawansowane wyszukiwanie internetowe.", "href": "/hub/tavily" }, { "icon": ($$result3) => renderTemplate`<span>🔎</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Status Worker\xF3w", "description": "Sprawd\u017A status i dost\u0119pno\u015B\u0107 API.", "href": "/hub/status" }, { "icon": ($$result3) => renderTemplate`<span>🛰️</span>` })} </div> <h2 class="text-2xl font-bold text-cyber-blue mt-12">Dodatkowe funkcje</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"> ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Funkcja 1", "description": "Opis funkcji 1", "href": "/hub/functions/1" }, { "icon": ($$result3) => renderTemplate`<span>🔧</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Funkcja 2", "description": "Opis funkcji 2", "href": "/hub/functions/2" }, { "icon": ($$result3) => renderTemplate`<span>⚙️</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Funkcja 3", "description": "Opis funkcji 3", "href": "/hub/functions/3" }, { "icon": ($$result3) => renderTemplate`<span>🧰</span>` })} </div> <div class="mt-12 text-center"> <a class="text-cyber-blue underline" href="/dashboard">Otwórz Dashboard (aktualna strona)</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/index.astro";
const $$url = "/hub";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
