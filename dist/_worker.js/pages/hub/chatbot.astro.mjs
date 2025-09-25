globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DFvGEJvU.mjs';
import { $ as $$BackroomInterface } from '../../chunks/BackroomInterface_Dyj06ELx.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const $$Chatbot = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "AI Chatbot" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-4xl mx-auto py-12"> <h1 class="text-2xl font-bold text-cyber-blue">AI Chatbot</h1> <p class="text-cyber-text-dim mt-4">
Interfejs chatbota i historia rozmów.
</p> <div class="mt-8">[KOMPONENT CHATBOTA TUTAJ]</div> <div class="mt-8"> <a class="text-cyber-blue" href="/hub">← Powrót do HUB</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/chatbot.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/chatbot.astro";
const $$url = "/hub/chatbot";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Chatbot,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
