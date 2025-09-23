globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../../../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { $ as $$DecorativeLines } from '../../../chunks/DecorativeLines_BgZWjcZU.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Create = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "POLACZEK Agent System 23 - Kreator Agenta" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, {})}  ${maybeRenderHead()}<div class="workers-vertical-line-left"></div> <div class="workers-vertical-line-right"></div> <main class="min-h-svh"> <!-- Top Separator Section --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section> <!-- Header Section - Styl nr.1 --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <div class="flex justify-between max-h-72 min-h-64"> <!-- Left corner - Creator info --> <div class="mt-auto" style="max-width: 45vw;"> <div class="text-edge text-sm italic px-2" style="
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
đź› ď¸Ź KREATOR AGENTĂ“W - StwĂłrz<br>
spersonalizowanego agenta AI<br>
dopasowanego do Twoich potrzeb<br>
biznesowych i osobistych.
</div> </div> <span class="mt-auto"> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 30px;
              margin-right: 0px;
              line-height: 1.1;
              " class="text-edge font-bold text-right">
AGENT<br>
CREATOR
</div> </span> </div> </div> </section> <!-- Main Creator Content with transparent background --> <section class="border border-edge relative"> <div class="max-w-6xl mx-auto"> <!-- Creator background with 55% transparency --> <div style="background: rgba(0, 0, 0, 0.55); border: 1px solid white; border-radius: 0; padding: 2rem;"> <!-- Quick Navigation --> <div class="mb-8"> <div class="flex justify-center gap-4"> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/dashboard', '_blank')" style="background: rgba(107, 114, 128, 0.8); border-radius: 0; padding: 0.75rem 1.5rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity">
â† Dashboard
</button> <button onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" style="background: rgba(168, 85, 247, 0.8); border-radius: 0; padding: 0.75rem 1.5rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity">
đźŹ  SDK
</button> <button onclick="loadTemplate()" style="background: rgba(59, 130, 246, 0.8); border-radius: 0; padding: 0.75rem 1.5rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity">
đź“‹ Szablon
</button> </div> </div> <!-- Agent Creation Form --> <div> <h2 class="text-2xl font-bold text-white mb-6 text-center">đź¤– StwĂłrz Nowego Agenta</h2> <form id="agent-creation-form" style="background: rgba(0, 0, 0, 0.3); border: 1px solid white; border-radius: 0; padding: 2rem;"> <!-- Basic Information --> <div class="mb-8"> <h3 class="text-xl font-bold text-white mb-4">đź“ť Podstawowe Informacje</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-gray-300 mb-2">
Nazwa Agenta *
</label> <input type="text" name="name" id="agent-name" placeholder="np. Polaczek_Custom_1" style="width: 100%; padding: 0.75rem; background: rgba(55, 65, 81, 0.8); border: 1px solid #4b5563; border-radius: 0; color: white;" required> </div> <div> <label class="block text-sm font-medium text-gray-300 mb-2">
Typ Agenta *
</label> <select name="type" id="agent-type" style="width: 100%; padding: 0.75rem; background: rgba(55, 65, 81, 0.8); border: 1px solid #4b5563; border-radius: 0; color: white;" required> <option value="">Wybierz typ agenta</option> <option value="chatbot">đź¤– Chatbot - Konwersacyjny</option> <option value="translator">đźŚ Translator - TĹ‚umacz</option> <option value="searcher">đź”Ť Searcher - Wyszukiwacz</option> <option value="monitor">đź“Š Monitor - Obserwator</option> <option value="artist">đźŽ¨ Artist - TwĂłrca</option> <option value="analyst">đź“ Analyst - Analityk</option> <option value="writer">âśŤď¸Ź Writer - Pisarz</option> <option value="coder">đź’» Coder - Programista</option> <option value="scheduler">âŹ° Scheduler - Planista</option> </select> </div> </div> </div> <!-- Description --> <div class="mb-8"> <label class="block text-sm font-medium text-gray-300 mb-2">
Opis Agenta
</label> <textarea name="description" id="agent-description" rows="3" placeholder="Opisz funkcje i cele tego agenta..." style="width: 100%; padding: 0.75rem; background: rgba(55, 65, 81, 0.8); border: 1px solid #4b5563; border-radius: 0; color: white; resize: vertical;"></textarea> </div> <!-- Configuration --> <div class="mb-8"> <h3 class="text-xl font-bold text-white mb-4">âš™ď¸Ź Konfiguracja</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div> <label class="block text-sm font-medium text-gray-300 mb-2">
Model AI
</label> <select name="model" id="agent-model" style="width: 100%; padding: 0.75rem; background: rgba(55, 65, 81, 0.8); border: 1px solid #4b5563; border-radius: 0; color: white;"> <option value="@cf/qwen/qwen1.5-14b-chat-awq">Qwen 1.5 14B (DomyĹ›lny)</option> <option value="@cf/meta/llama-3.1-8b-instruct">Llama 3.1 8B</option> <option value="@cf/microsoft/phi-2">Phi-2</option> </select> </div> <div> <label class="block text-sm font-medium text-gray-300 mb-2">
JÄ™zyk Komunikacji
</label> <select name="language" id="agent-language" style="width: 100%; padding: 0.75rem; background: rgba(55, 65, 81, 0.8); border: 1px solid #4b5563; border-radius: 0; color: white;"> <option value="pl">đź‡µđź‡± Polski</option> <option value="en">đź‡şđź‡¸ English</option> <option value="de">đź‡©đź‡Ş Deutsch</option> <option value="fr">đź‡«đź‡· FranĂ§ais</option> </select> </div> <div> <label class="block text-sm font-medium text-gray-300 mb-2">
Poziom AktywnoĹ›ci
</label> <select name="activity_level" id="agent-activity" style="width: 100%; padding: 0.75rem; background: rgba(55, 65, 81, 0.8); border: 1px solid #4b5563; border-radius: 0; color: white;"> <option value="low">đźź˘ Niski - Standardowy</option> <option value="medium">đźźˇ Ĺšredni - Aktywny</option> <option value="high">đź”´ Wysoki - Intensywny</option> </select> </div> </div> </div> <!-- Custom Instructions --> <div class="mb-8"> <h3 class="text-xl font-bold text-white mb-4">đź“‹ Instrukcje Specjalne</h3> <textarea name="instructions" id="agent-instructions" rows="4" placeholder="Podaj szczegĂłĹ‚owe instrukcje dla agenta (opcjonalne)..." style="width: 100%; padding: 0.75rem; background: rgba(55, 65, 81, 0.8); border: 1px solid #4b5563; border-radius: 0; color: white; resize: vertical;"></textarea> </div> <!-- Action Buttons --> <div class="flex justify-center gap-4"> <button type="button" onclick="resetForm()" style="background: rgba(107, 114, 128, 0.8); border-radius: 0; padding: 0.75rem 2rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity">
đź”„ Reset
</button> <button type="button" onclick="previewAgent()" style="background: rgba(59, 130, 246, 0.8); border-radius: 0; padding: 0.75rem 2rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity">
đź‘ď¸Ź PodglÄ…d
</button> <button type="submit" style="background: rgba(34, 197, 94, 0.8); border-radius: 0; padding: 0.75rem 2rem; color: white; border: none; cursor: pointer;" class="hover:opacity-80 transition-opacity">
đźš€ StwĂłrz Agenta
</button> </div> </form> </div> <!-- Status Panel --> <div id="status-panel" class="mt-8" style="display: none;"> <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid white; border-radius: 0; padding: 1.5rem;"> <h3 class="text-lg font-bold text-white mb-4">đź“Š Status Tworzenia</h3> <div id="status-content" class="text-gray-300"> <!-- Status bÄ™dzie wstawiany dynamicznie --> </div> </div> </div> </div> </div> </section> </main>  ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/agents/create.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/agents/create.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/agents/create.astro";
const $$url = "/POLACZEK_AGENT_SYS_23/agents/create";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Create,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
