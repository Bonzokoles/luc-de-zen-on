globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_CUKi2fNT.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Funkcje" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Dodatkowe Funkcje</h1> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"> <a class="block p-6 border border-cyber-border" href="/hub/functions/1">Funkcja 1</a> <a class="block p-6 border border-cyber-border" href="/hub/functions/2">Funkcja 2</a> <a class="block p-6 border border-cyber-border" href="/hub/functions/3">Funkcja 3</a> </div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">â† PowrĂłt do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/functions/index.astro";
=======
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_i2zefgs1.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Funkcje" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Dodatkowe Funkcje</h1> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"> <a class="block p-6 border border-cyber-border" href="/hub/functions/1">Funkcja 1</a> <a class="block p-6 border border-cyber-border" href="/hub/functions/2">Funkcja 2</a> <a class="block p-6 border border-cyber-border" href="/hub/functions/3">Funkcja 3</a> </div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/mybonzo-github/src/pages/hub/functions/index.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/hub/functions/index.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/hub/functions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
