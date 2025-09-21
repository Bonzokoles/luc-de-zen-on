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
import { d as createAstro, c as createComponent, e as renderHead, a as renderTemplate } from '../../chunks/astro/server_xZvTY01m.mjs';
/* empty css                                   */
export { r as renderers } from '../../chunks/_@astro-renderers_CHiEcNgA.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$Test = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Test;
  const pageTitle = "Test Admin Page";
  return renderTemplate`<html lang="pl" data-astro-cid-ywkxjoqy> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title>${renderHead()}</head> <body data-astro-cid-ywkxjoqy> <div class="container" data-astro-cid-ywkxjoqy> <h1 data-astro-cid-ywkxjoqy>🚀 Test Admin Panel</h1> <p data-astro-cid-ywkxjoqy>Jeśli widzisz tę stronę, to Astro działa poprawnie!</p> <h2 data-astro-cid-ywkxjoqy>📊 Status systemu:</h2> <ul data-astro-cid-ywkxjoqy> <li data-astro-cid-ywkxjoqy>✅ Astro v5.13.5 - działa</li> <li data-astro-cid-ywkxjoqy>✅ Routing - działa</li> <li data-astro-cid-ywkxjoqy>✅ CSS - działa</li> <li data-astro-cid-ywkxjoqy>⚠️ React components - do sprawdzenia</li> </ul> <h2 data-astro-cid-ywkxjoqy>🔗 Linki:</h2> <ul data-astro-cid-ywkxjoqy> <li data-astro-cid-ywkxjoqy><a href="/admin" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>Główny panel admin</a></li> <li data-astro-cid-ywkxjoqy><a href="/admin/dashboard" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>Dashboard</a></li> <li data-astro-cid-ywkxjoqy><a href="/admin/ai-chat" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>AI Chat</a></li> </ul> </div> </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/test.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/admin/test.astro";
const $$url = "/admin/test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Test,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
