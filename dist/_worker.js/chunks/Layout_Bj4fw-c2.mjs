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

if (typeof MessageChannel === "undefined") {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      const channel = {
        port1: null,
        port2: null
      };
      this.port1 = {
        onmessage: null,
        postMessage: (data) => {
          if (channel.port2?.onmessage) {
            setTimeout(() => channel.port2.onmessage({ data }), 0);
          }
        },
        close: () => {
        },
        start: () => {
        }
      };
      this.port2 = {
        onmessage: null,
        postMessage: (data) => {
          if (channel.port1?.onmessage) {
            setTimeout(() => channel.port1.onmessage({ data }), 0);
          }
        },
        close: () => {
        },
        start: () => {
        }
      };
      channel.port1 = this.port1;
      channel.port2 = this.port2;
    }
  };
}
if (typeof requestIdleCallback === "undefined") {
  globalThis.requestIdleCallback = (callback) => {
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
  };
}
if (typeof cancelIdleCallback === "undefined") {
  globalThis.cancelIdleCallback = (id) => {
    clearTimeout(id);
  };
}

const $$Astro = createAstro("https://www.mybonzo.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { siteTitle, siteDescription, headerCosmeticText } = Astro2.props;
  return renderTemplate`<html lang="en" class="bg-primary"> <head>${renderComponent($$result, "Head", $$Head, { "pageTitle": siteTitle, "pageDescription": siteDescription })}${renderHead()}</head> <body class="bg-cyber-dark text-cyber-text font-sans"> <main class="min-h-svh"> ${renderComponent($$result, "Header", $$Header, { "cosmeticText": headerCosmeticText })} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, {})} </main> </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
