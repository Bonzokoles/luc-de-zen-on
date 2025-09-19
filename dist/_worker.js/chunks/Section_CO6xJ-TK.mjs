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
import { e as createAstro, c as createComponent, m as maybeRenderHead, h as addAttribute, t as renderSlot, a as renderTemplate } from './vendor_BHZTJLV0.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$Section = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Section;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="border border-edge"> <div class="max-w-6xl mx-auto border-x border-edge"> <div${addAttribute(className, "class")}> ${renderSlot($$result, $$slots["default"])} </div> </div> </section>`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/Section.astro", void 0);

export { $$Section as $ };
