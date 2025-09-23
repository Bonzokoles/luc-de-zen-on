globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$Layout } from '../chunks/Layout_CL3qsB8O.mjs';
import { $ as $$Section } from '../chunks/Footer_CPKEGQoN.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$AgentBuilder23 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "siteTitle": "Agent Builder 23", "siteDescription": "Uproszczona wersja narz\xC4\u2122dzia agent-builder-23", "headerCosmeticText": "AGENT BUILDER" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Section", $$Section, { "class": "min-h-72 pl-4 bg-radial-[at_50%_10%] from-accent/10 to-transparent" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md m-auto text-center"> <h1 class="text-3xl font-bold mb-4">Agent Builder 23</h1> <p class="text-xl mb-6">
Uproszczona wersja narzÄ™dzia do zarzÄ…dzania agentami, stworzona w stylu
        i kolorystyce strony gĹ‚Ăłwnej.
</p> <ul class="text-lg list-disc list-inside"> <li>Tworzenie i edycja agentĂłw</li> <li>PodglÄ…d statusu agentĂłw</li> <li>Podstawowe statystyki</li> <li>Prosty interfejs uĹĽytkownika</li> </ul> </div> ` })} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/agent-builder-23.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/agent-builder-23.astro";
const $$url = "/agent-builder-23";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AgentBuilder23,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
