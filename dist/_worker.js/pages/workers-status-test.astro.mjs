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
/* empty css                                  */
import { c as createComponent, e as renderHead, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_xZvTY01m.mjs';
import { W as WorkersStatusDashboard } from '../chunks/WorkersStatusDashboard_yZl3yP8D.mjs';
/* empty css                                               */
export { r as renderers } from '../chunks/_@astro-renderers_CHiEcNgA.mjs';

const $$WorkersStatusTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`title: "Status Workerów - Test Dashboard"; ---
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title>${renderHead()}</head> <body data-astro-cid-onxdzcec> <div class="container" data-astro-cid-onxdzcec> <h1 data-astro-cid-onxdzcec>🔧 Status Workerów - Test Dashboard</h1> <div class="test-info" data-astro-cid-onxdzcec> <p data-astro-cid-onxdzcec>
Testowa strona dla weryfikacji działania systemu monitorowania
          Cloudflare Workers.
</p> <p data-astro-cid-onxdzcec>
Dashboard automatycznie wczyta się poniżej z przykładowymi danymi.
</p> </div> <!-- Dashboard Component --> ${renderComponent($$result, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-onxdzcec": true })} </div> </body>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/workers-status-test.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/workers-status-test.astro";
const $$url = "/workers-status-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$WorkersStatusTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
