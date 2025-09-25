globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$BackroomInterface } from '../../../chunks/BackroomInterface_h2XQBD_s.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_iO87Dm24.mjs';

const $$2 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Funkcja 2" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-3xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Funkcja 2</h1> <p class="text-cyber-text-dim mt-4">Szczegóły Funkcji 2.</p> <div class="mt-8"> <a class="text-cyber-blue" href="/hub/functions">← Powrót do listy funkcji</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/2.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/2.astro";
const $$url = "/hub/functions/2";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$2,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
