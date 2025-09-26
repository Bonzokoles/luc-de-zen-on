globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DFvGEJvU.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_DBUhkttC.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const $$Kaggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "Kaggle Datasets" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-4xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">Kaggle Datasets</h1> <p class="text-cyber-text-dim mt-4">Przeszukuj zbiory danych i konkursy.</p> <div class="mt-8">[KOMPONENT KAGGLE TUTAJ]</div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/kaggle.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/kaggle.astro";
const $$url = "/hub/kaggle";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Kaggle,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
