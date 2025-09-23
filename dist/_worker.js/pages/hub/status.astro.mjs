globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_CUKi2fNT.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Status = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Status Worker\u0102\u0142w" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-4xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Status WorkerĂłw</h1> <p class="text-cyber-text-dim mt-4">
SprawdĹş status i dostÄ™pnoĹ›Ä‡ API workerĂłw.
</p> <div class="mt-8">[KOMPONENT STATUSU TUTAJ]</div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">â† PowrĂłt do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/status.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/status.astro";
const $$url = "/hub/status";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Status,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
