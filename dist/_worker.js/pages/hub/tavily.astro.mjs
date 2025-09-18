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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/vendor_CYa9XZjz.mjs';
export { d as renderers } from '../../chunks/vendor_CYa9XZjz.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_Dc6Xy4tu.mjs';

const $$Tavily = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Tavily AI Search" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-4xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Tavily AI Search</h1> <p class="text-cyber-text-dim mt-4">
Zaawansowane wyszukiwanie internetowe.
</p> <div class="mt-8">[KOMPONENT WYSZUKIWARKI TUTAJ]</div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/tavily.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/tavily.astro";
const $$url = "/hub/tavily";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tavily,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
