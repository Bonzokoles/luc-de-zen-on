globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_i2zefgs1.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Tavily = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Tavily AI Search" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-4xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Tavily AI Search</h1> <p class="text-cyber-text-dim mt-4">
Zaawansowane wyszukiwanie internetowe.
</p> <div class="mt-8">[KOMPONENT WYSZUKIWARKI TUTAJ]</div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/mybonzo-github/src/pages/hub/tavily.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/hub/tavily.astro";
const $$url = "/hub/tavily";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tavily,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
