globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, d as renderHead, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_BDhFni3J.mjs';
import { W as WorkersStatusDashboard } from '../chunks/WorkersStatusDashboard_BtnDHy3d.mjs';
/* empty css                                               */
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$WorkersStatusTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`title: "Status WorkerĂłw - Test Dashboard"; ---
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title>${renderHead()}</head> <body data-astro-cid-onxdzcec> <div class="container" data-astro-cid-onxdzcec> <h1 data-astro-cid-onxdzcec>đź”§ Status WorkerĂłw - Test Dashboard</h1> <div class="test-info" data-astro-cid-onxdzcec> <p data-astro-cid-onxdzcec>
Testowa strona dla weryfikacji dziaĹ‚ania systemu monitorowania
          Cloudflare Workers.
</p> <p data-astro-cid-onxdzcec>
Dashboard automatycznie wczyta siÄ™ poniĹĽej z przykĹ‚adowymi danymi.
</p> </div> <!-- Dashboard Component --> ${renderComponent($$result, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-onxdzcec": true })} </div> </body>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/workers-status-test.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/workers-status-test.astro";
=======
/* empty css                                  */
import { c as createComponent, e as renderHead, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CDFI50iS.mjs';
import { W as WorkersStatusDashboard } from '../chunks/WorkersStatusDashboard_BEflDN07.mjs';
/* empty css                                               */
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$WorkersStatusTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`title: "Status Workerów - Test Dashboard"; ---
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title>${renderHead()}</head> <body data-astro-cid-onxdzcec> <div class="container" data-astro-cid-onxdzcec> <h1 data-astro-cid-onxdzcec>🔧 Status Workerów - Test Dashboard</h1> <div class="test-info" data-astro-cid-onxdzcec> <p data-astro-cid-onxdzcec>
Testowa strona dla weryfikacji działania systemu monitorowania
          Cloudflare Workers.
</p> <p data-astro-cid-onxdzcec>
Dashboard automatycznie wczyta się poniżej z przykładowymi danymi.
</p> </div> <!-- Dashboard Component --> ${renderComponent($$result, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-onxdzcec": true })} </div> </body>`;
}, "Q:/mybonzo/mybonzo-github/src/pages/workers-status-test.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/workers-status-test.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/workers-status-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$WorkersStatusTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
