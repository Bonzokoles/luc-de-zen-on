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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/vendor_BHZTJLV0.mjs';
export { d as renderers } from '../../chunks/vendor_BHZTJLV0.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_Byk_hFpk.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Funkcje" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Dodatkowe Funkcje</h1> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"> <a class="block p-6 border border-cyber-border" href="/hub/functions/1">Funkcja 1</a> <a class="block p-6 border border-cyber-border" href="/hub/functions/2">Funkcja 2</a> <a class="block p-6 border border-cyber-border" href="/hub/functions/3">Funkcja 3</a> </div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/index.astro";
const $$url = "/hub/functions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
