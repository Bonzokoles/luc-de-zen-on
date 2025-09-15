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
import { e as createAstro, c as createComponent, r as renderComponent, f as renderHead, q as renderSlot, a as renderTemplate } from './vendor_QZhDtzeH.mjs';
import { $ as $$Head, a as $$Header, b as $$Footer } from './Footer_IC4q6u3D.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$BackroomInterface = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BackroomInterface;
  const { siteTitle = "", siteDescription = "" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "Head", $$Head, { "pageTitle": siteTitle, "pageDescription": siteDescription })}<!-- Import Backroom visual styles --><link rel="stylesheet" href="/src/styles/backroom-tailwind.css">${renderHead()}</head> <body class="bg-cyber-dark text-cyber-text font-sans"> ${renderComponent($$result, "Header", $$Header, { "cosmeticText": "Backroom Interface" })} <main class="min-h-svh"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/BackroomInterface.astro", void 0);

export { $$BackroomInterface as $ };
