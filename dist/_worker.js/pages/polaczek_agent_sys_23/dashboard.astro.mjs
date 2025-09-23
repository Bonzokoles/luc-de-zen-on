globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { $ as $$DecorativeLines } from '../../chunks/DecorativeLines_BgZWjcZU.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "POLACZEK Agent System 23 - Dashboard" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, {})}  ${maybeRenderHead()}<div class="workers-vertical-line-left"></div> <div class="workers-vertical-line-right"></div> <main class="min-h-svh"> <!-- Top Separator Section --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section> <!-- Header Section - Styl nr.1 --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <div class="flex justify-between max-h-72 min-h-64"> <!-- Left corner - Dashboard info --> <div class="mt-auto" style="max-width: 45vw;"> <div class="text-edge text-sm italic px-2" style="
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
              ">
đź¤– POLACZEK DASHBOARD - Centrum<br>
zarzÄ…dzania agentami AI. Monitoruj,<br>
kontroluj i optymalizuj wydajnoĹ›Ä‡<br>
wszystkich aktywnych agentĂłw.
</div> </div> <span class="mt-auto"> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 30px;
              margin-right: 0px;
              line-height: 1.1;
              " class="text-edge font-bold text-right">
DASHBOARD<br>
CONTROL
</div> </span> </div> </div> </section> <!-- Main Dashboard Content with transparent background --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <!-- Dashboard background with 55% transparency --> <div style="background: rgba(0, 0, 0, 0.55); border: 1px solid white; border-radius: 0; padding: 2rem;"> <!-- System Status Panel --> <div class="mb-8"> <h2 class="text-2xl font-bold text-white mb-4">đź“Š Status Systemu</h2> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"> <div style="background: rgba(34, 197, 94, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="active-agents">0</div> <div class="text-sm">Aktywne Agenty</div> </div> </div> <div style="background: rgba(59, 130, 246, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="total-messages">0</div> <div class="text-sm">WiadomoĹ›ci</div> </div> </div> <div style="background: rgba(168, 85, 247, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="system-health">100%</div> <div class="text-sm">Zdrowie Systemu</div> </div> </div> <div style="background: rgba(245, 101, 101, 0.8); border-radius: 0; padding: 1rem;"> <div class="text-white"> <div class="text-2xl font-bold" id="error-count">0</div> <div class="text-sm">BĹ‚Ä™dy</div> </div> </div> </div> </div> <!-- Quick Actions --> <div class="mb-8"> <h3 class="text-xl font-bold text-white mb-4">đźš€ Szybkie Akcje</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/agents/create', '_blank')" style="background: rgba(34, 197, 94, 0.8); border-radius: 0; padding: 1rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity"> <div class="text-lg font-bold">+ StwĂłrz Agenta</div> <div class="text-sm">Nowy agent AI</div> </button> <button onclick="refreshAgentsList()" style="background: rgba(59, 130, 246, 0.8); border-radius: 0; padding: 1rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity"> <div class="text-lg font-bold">đź”„ OdĹ›wieĹĽ</div> <div class="text-sm">Lista agentĂłw</div> </button> <button onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" style="background: rgba(168, 85, 247, 0.8); border-radius: 0; padding: 1rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity"> <div class="text-lg font-bold">đźŹ  SDK</div> <div class="text-sm">GĹ‚Ăłwna strona</div> </button> </div> </div> <!-- Active Agents List --> <div> <div class="flex justify-between items-center mb-4"> <h3 class="text-xl font-bold text-white">đź¤– Aktywne Agenty</h3> <div class="text-sm text-gray-300">Ostatnia aktualizacja: <span id="last-update">Nigdy</span></div> </div> <div id="agents-container" style="background: rgba(0, 0, 0, 0.3); border: 1px solid white; border-radius: 0; padding: 1rem;"> <div class="text-center text-gray-400 py-8" id="loading-message">
Ĺadowanie agentĂłw...
</div> </div> </div> </div> </div> </section> </main>  ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/dashboard.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/dashboard.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/dashboard.astro";
const $$url = "/POLACZEK_AGENT_SYS_23/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
