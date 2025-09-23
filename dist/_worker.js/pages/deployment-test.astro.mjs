globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as renderTemplate } from '../chunks/astro/server_BDhFni3J.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$DeploymentTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`Test file for deployment verification 09/11/2025 02:21:51`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/deployment-test.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/deployment-test.astro";
const $$url = "/deployment-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$DeploymentTest,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
