globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, a as renderTemplate } from '../chunks/astro/server_BDhFni3J.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/login.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/login.astro";
=======
/* empty css                                  */
import { c as createComponent, a as renderTemplate } from '../chunks/astro/server_CDFI50iS.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/mybonzo-github/src/pages/login.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/login.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Login,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
