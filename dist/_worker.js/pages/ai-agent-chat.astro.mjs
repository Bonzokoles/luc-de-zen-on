globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as renderTemplate } from '../chunks/astro/server_BDhFni3J.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$AiAgentChat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-agent-chat.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-agent-chat.astro";
const $$url = "/ai-agent-chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$AiAgentChat,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
