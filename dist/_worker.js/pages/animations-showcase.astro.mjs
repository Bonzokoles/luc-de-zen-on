globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
/* empty css                                               */
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_DdWhmxse.mjs';
/* empty css                                               */
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

function AnimationsShowcase($$renderer, $$props) {
	$$renderer.component(($$renderer) => {

		$$renderer.push(`<div class="animations-showcase svelte-1bsui5e">`);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

const $$AnimationsShowcase = createComponent(($$result, $$props, $$slots) => {
<<<<<<< HEAD
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Svelte Animations Showcase - Demonstracja Animacji", "data-astro-cid-apaj6hqy": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="animations-page" data-astro-cid-apaj6hqy> ${renderComponent($$result2, "SvelteAnimationsShowcase", AnimationsShowcase, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AnimationsShowcase.svelte", "client:component-export": "default", "data-astro-cid-apaj6hqy": true })} </div> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/animations-showcase.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/animations-showcase.astro";
=======
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Svelte Animations Showcase - Demonstracja Animacji", "data-astro-cid-apaj6hqy": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="animations-page" data-astro-cid-apaj6hqy> ${renderComponent($$result2, "SvelteAnimationsShowcase", AnimationsShowcase, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/AnimationsShowcase.svelte", "client:component-export": "default", "data-astro-cid-apaj6hqy": true })} </div> ` })} `;
}, "Q:/mybonzo/mybonzo-github/src/pages/animations-showcase.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/animations-showcase.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/animations-showcase";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AnimationsShowcase,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
