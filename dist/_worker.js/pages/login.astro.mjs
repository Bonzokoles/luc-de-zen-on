globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, a as renderTemplate } from '../chunks/astro/server_DFvGEJvU.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/login.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Login,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
