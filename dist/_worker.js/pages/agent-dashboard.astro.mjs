globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, a as renderTemplate } from '../chunks/astro/server_CDFI50iS.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$AgentDashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/mybonzo-github/src/pages/agent-dashboard.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/agent-dashboard.astro";
const $$url = "/agent-dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$AgentDashboard,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
