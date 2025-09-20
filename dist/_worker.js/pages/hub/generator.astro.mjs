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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_xZvTY01m.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_uj3Su3qj.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const $$Generator = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Generator Obraz\xF3w" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-4xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Generator Obrazów</h1> <p class="text-cyber-text-dim mt-4">
Tutaj znajdziesz interfejs generowania obrazów.
</p> <div class="mt-8">[KOMPONENT GENERATORA TUTAJ]</div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/generator.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/generator.astro";
const $$url = "/hub/generator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Generator,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
