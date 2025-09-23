globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { e as createAstro, c as createComponent, d as renderHead, a as renderTemplate } from '../../chunks/astro/server_BDhFni3J.mjs';
/* empty css                                   */
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Astro = createAstro("https://mybonzo.com");
=======
/* empty css                                     */
import { d as createAstro, c as createComponent, e as renderHead, a as renderTemplate } from '../../chunks/astro/server_CDFI50iS.mjs';
/* empty css                                   */
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$Test = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Test;
  const pageTitle = "Test Admin Page";
<<<<<<< HEAD
  return renderTemplate`<html lang="pl" data-astro-cid-ywkxjoqy> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title>${renderHead()}</head> <body data-astro-cid-ywkxjoqy> <div class="container" data-astro-cid-ywkxjoqy> <h1 data-astro-cid-ywkxjoqy>đźš€ Test Admin Panel</h1> <p data-astro-cid-ywkxjoqy>JeĹ›li widzisz tÄ™ stronÄ™, to Astro dziaĹ‚a poprawnie!</p> <h2 data-astro-cid-ywkxjoqy>đź“Š Status systemu:</h2> <ul data-astro-cid-ywkxjoqy> <li data-astro-cid-ywkxjoqy>âś… Astro v5.13.5 - dziaĹ‚a</li> <li data-astro-cid-ywkxjoqy>âś… Routing - dziaĹ‚a</li> <li data-astro-cid-ywkxjoqy>âś… CSS - dziaĹ‚a</li> <li data-astro-cid-ywkxjoqy>âš ď¸Ź React components - do sprawdzenia</li> </ul> <h2 data-astro-cid-ywkxjoqy>đź”— Linki:</h2> <ul data-astro-cid-ywkxjoqy> <li data-astro-cid-ywkxjoqy><a href="/admin" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>GĹ‚Ăłwny panel admin</a></li> <li data-astro-cid-ywkxjoqy><a href="/admin/dashboard" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>Dashboard</a></li> <li data-astro-cid-ywkxjoqy><a href="/admin/ai-chat" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>AI Chat</a></li> </ul> </div> </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/admin/test.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/admin/test.astro";
=======
  return renderTemplate`<html lang="pl" data-astro-cid-ywkxjoqy> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${pageTitle}</title>${renderHead()}</head> <body data-astro-cid-ywkxjoqy> <div class="container" data-astro-cid-ywkxjoqy> <h1 data-astro-cid-ywkxjoqy>🚀 Test Admin Panel</h1> <p data-astro-cid-ywkxjoqy>Jeśli widzisz tę stronę, to Astro działa poprawnie!</p> <h2 data-astro-cid-ywkxjoqy>📊 Status systemu:</h2> <ul data-astro-cid-ywkxjoqy> <li data-astro-cid-ywkxjoqy>✅ Astro v5.13.5 - działa</li> <li data-astro-cid-ywkxjoqy>✅ Routing - działa</li> <li data-astro-cid-ywkxjoqy>✅ CSS - działa</li> <li data-astro-cid-ywkxjoqy>⚠️ React components - do sprawdzenia</li> </ul> <h2 data-astro-cid-ywkxjoqy>🔗 Linki:</h2> <ul data-astro-cid-ywkxjoqy> <li data-astro-cid-ywkxjoqy><a href="/admin" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>Główny panel admin</a></li> <li data-astro-cid-ywkxjoqy><a href="/admin/dashboard" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>Dashboard</a></li> <li data-astro-cid-ywkxjoqy><a href="/admin/ai-chat" style="color: #00d9ff;" data-astro-cid-ywkxjoqy>AI Chat</a></li> </ul> </div> </body></html>`;
}, "Q:/mybonzo/mybonzo-github/src/pages/admin/test.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/admin/test.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/admin/test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Test,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
