globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$Layout } from '../chunks/Layout_CuqLrlqZ.mjs';
import { $ as $$Section } from '../chunks/Section_wMU8ID4U.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$AgentBuilder23 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "siteTitle": "Agent Builder 23", "siteDescription": "Uproszczona wersja narz\u0119dzia agent-builder-23", "headerCosmeticText": "AGENT BUILDER" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Section", $$Section, { "class": "min-h-72 pl-4 bg-radial-[at_50%_10%] from-accent/10 to-transparent" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md m-auto text-center"> <h1 class="text-3xl font-bold mb-4">Agent Builder 23</h1> <p class="text-xl mb-6">
Uproszczona wersja narzędzia do zarządzania agentami, stworzona w stylu
        i kolorystyce strony głównej.
</p> <ul class="text-lg list-disc list-inside"> <li>Tworzenie i edycja agentów</li> <li>Podgląd statusu agentów</li> <li>Podstawowe statystyki</li> <li>Prosty interfejs użytkownika</li> </ul> </div> ` })} ` })}`;
}, "Q:/mybonzo/mybonzo-github/src/pages/agent-builder-23.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/agent-builder-23.astro";
const $$url = "/agent-builder-23";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AgentBuilder23,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
