globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../../../chunks/astro/server_C1oOU0Od.mjs';
import { $ as $$MyBonzoLayout } from '../../../chunks/MyBonzoLayout_DeSMV8-3.mjs';
import { $ as $$DecorativeLines } from '../../../chunks/DecorativeLines_CYP07A9F.mjs';
/* empty css                                               */
export { r as renderers } from '../../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const $$CreateBackup = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "POLACZEK Agent System 23 - Kreator Agenta", "data-astro-cid-ruqxmpje": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-ruqxmpje": true })}  ${maybeRenderHead()}<div class="workers-vertical-line-left" data-astro-cid-ruqxmpje></div> <div class="workers-vertical-line-right" data-astro-cid-ruqxmpje></div> <main class="min-h-svh" data-astro-cid-ruqxmpje> <!-- Top Separator Section --> <section class="border border-edge relative" data-astro-cid-ruqxmpje> <div class="max-w-6xl mx-auto" data-astro-cid-ruqxmpje> <div class="py-1" data-astro-cid-ruqxmpje></div> </div> </section> <!-- Header Section - Styl nr.1 --> <section class="border border-edge relative" data-astro-cid-ruqxmpje> <div class="max-w-6xl mx-auto" data-astro-cid-ruqxmpje> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-ruqxmpje> <!-- Left corner - Creator info --> <div class="mt-auto" style="max-width: 45vw;" data-astro-cid-ruqxmpje> <div class="text-edge text-sm italic px-2" style="
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
              " data-astro-cid-ruqxmpje>
đź› ď¸Ź KREATOR AGENTĂ“W - StwĂłrz<br data-astro-cid-ruqxmpje>
spersonalizowanego agenta AI<br data-astro-cid-ruqxmpje>
dopasowanego do Twoich potrzeb<br data-astro-cid-ruqxmpje>
biznesowych i osobistych.
</div> </div> <span class="mt-auto" data-astro-cid-ruqxmpje> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 30px;
              margin-right: 0px;
              line-height: 1.1;
              " class="text-edge font-bold text-right" data-astro-cid-ruqxmpje>
AGENT<br data-astro-cid-ruqxmpje>
CREATOR
</div> </span> </div> </div> </section> <div class="p-8" data-astro-cid-ruqxmpje> <form id="agent-creation-form" class="space-y-8" data-astro-cid-ruqxmpje> <!-- Basic Information --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-ruqxmpje> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Nazwa Agenta *
</label> <input type="text" name="name" id="agent-name" placeholder="np. Polaczek_Custom_1" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500" required data-astro-cid-ruqxmpje> <p class="text-xs text-gray-500 mt-1" data-astro-cid-ruqxmpje>Nazwa musi byÄ‡ unikalna i nie zawieraÄ‡ spacji</p> </div> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Typ Agenta *
</label> <select name="type" id="agent-type" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" required data-astro-cid-ruqxmpje> <option value="" data-astro-cid-ruqxmpje>Wybierz typ agenta</option> <option value="chatbot" data-astro-cid-ruqxmpje>đź¤– Chatbot - Asystent konwersacyjny</option> <option value="translator" data-astro-cid-ruqxmpje>đźŚ Translator - TĹ‚umacz jÄ™zykĂłw</option> <option value="searcher" data-astro-cid-ruqxmpje>đź”Ť Searcher - Agent wyszukujÄ…cy</option> <option value="monitor" data-astro-cid-ruqxmpje>đź“Š Monitor - Agent monitorujÄ…cy</option> <option value="artist" data-astro-cid-ruqxmpje>đźŽ¨ Artist - Generator grafik</option> <option value="analyst" data-astro-cid-ruqxmpje>đź“ Analyst - Analityk danych</option> <option value="writer" data-astro-cid-ruqxmpje>âśŤď¸Ź Writer - Generator treĹ›ci</option> <option value="coder" data-astro-cid-ruqxmpje>đź’» Coder - Asystent programisty</option> <option value="scheduler" data-astro-cid-ruqxmpje>âŹ° Scheduler - ZarzÄ…dca zadaĹ„</option> <option value="custom" data-astro-cid-ruqxmpje>đź”§ Custom - Niestandardowy</option> </select> </div> </div> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Opis Agenta *
</label> <textarea name="description" id="agent-description" rows="3" placeholder="Opisz funkcjonalnoĹ›Ä‡ i przeznaczenie agenta..." class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500" required data-astro-cid-ruqxmpje></textarea> </div> <!-- Configuration --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-ruqxmpje> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Port
</label> <input type="number" name="port" id="agent-port" placeholder="3011" min="3000" max="9999" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500" data-astro-cid-ruqxmpje> <p class="text-xs text-gray-500 mt-1" data-astro-cid-ruqxmpje>Port dla WebSocket serwera (domyĹ›lnie: auto)</p> </div> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
JÄ™zyk
</label> <select name="language" id="agent-language" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" data-astro-cid-ruqxmpje> <option value="python" data-astro-cid-ruqxmpje>đźŤ Python</option> <option value="javascript" data-astro-cid-ruqxmpje>đźź¨ JavaScript/Node.js</option> <option value="typescript" data-astro-cid-ruqxmpje>đź”· TypeScript</option> </select> </div> </div> <!-- Capabilities --> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-4" data-astro-cid-ruqxmpje>
MoĹĽliwoĹ›ci Agenta
</label> <div class="grid grid-cols-2 md:grid-cols-3 gap-3" data-astro-cid-ruqxmpje> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="text_processing" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Przetwarzanie tekstu</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="web_search" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Wyszukiwanie web</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="api_integration" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Integracja API</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="file_processing" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Przetwarzanie plikĂłw</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="image_generation" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Generowanie obrazĂłw</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="data_analysis" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Analiza danych</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="real_time_monitoring" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Monitoring real-time</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="email_notifications" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Powiadomienia email</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="capabilities" value="scheduling" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Planowanie zadaĹ„</span> </label> </div> </div> <!-- AI Model Configuration --> <div id="ai-config" class="space-y-4" data-astro-cid-ruqxmpje> <h3 class="text-lg font-semibold text-white" data-astro-cid-ruqxmpje>Konfiguracja AI</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-ruqxmpje> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Model AI
</label> <select name="ai_model" id="ai-model" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" data-astro-cid-ruqxmpje> <option value="gpt-4" data-astro-cid-ruqxmpje>GPT-4 (OpenAI)</option> <option value="gpt-3.5-turbo" data-astro-cid-ruqxmpje>GPT-3.5 Turbo (OpenAI)</option> <option value="claude-3" data-astro-cid-ruqxmpje>Claude 3 (Anthropic)</option> <option value="gemini" data-astro-cid-ruqxmpje>Gemini (Google)</option> <option value="bielik" data-astro-cid-ruqxmpje>Bielik (Speakleash)</option> <option value="local-llama" data-astro-cid-ruqxmpje>Llama Local</option> </select> </div> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Temperatura (KreatywnoĹ›Ä‡)
</label> <input type="range" name="temperature" id="temperature" min="0" max="2" step="0.1" value="0.7" class="w-full" data-astro-cid-ruqxmpje> <div class="flex justify-between text-xs text-gray-400 mt-1" data-astro-cid-ruqxmpje> <span data-astro-cid-ruqxmpje>Precyzyjny (0.0)</span> <span id="temp-value" data-astro-cid-ruqxmpje>0.7</span> <span data-astro-cid-ruqxmpje>Kreatywny (2.0)</span> </div> </div> </div> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
System Prompt
</label> <textarea name="system_prompt" id="system-prompt" rows="4" placeholder="JesteĹ› pomocnym asystentem AI. Twoje zadanie to..." class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500" data-astro-cid-ruqxmpje></textarea> </div> </div> <!-- Advanced Settings --> <div class="border-t border-gray-600 pt-6" data-astro-cid-ruqxmpje> <details class="group" data-astro-cid-ruqxmpje> <summary class="cursor-pointer text-lg font-semibold text-white group-open:text-cyan-400" data-astro-cid-ruqxmpje>
âš™ď¸Ź Zaawansowane Ustawienia
</summary> <div class="mt-4 space-y-4" data-astro-cid-ruqxmpje> <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-astro-cid-ruqxmpje> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Max Memory (MB)
</label> <input type="number" name="max_memory" placeholder="512" min="64" max="4096" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500" data-astro-cid-ruqxmpje> </div> <div data-astro-cid-ruqxmpje> <label class="block text-sm font-medium text-gray-300 mb-2" data-astro-cid-ruqxmpje>
Timeout (sekundy)
</label> <input type="number" name="timeout" placeholder="30" min="5" max="300" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500" data-astro-cid-ruqxmpje> </div> </div> <div class="space-y-2" data-astro-cid-ruqxmpje> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="auto_start" class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>Automatyczne uruchamianie przy starcie systemu</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="logging_enabled" checked class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>WĹ‚Ä…cz logowanie</span> </label> <label class="flex items-center space-x-2" data-astro-cid-ruqxmpje> <input type="checkbox" name="monitoring_enabled" checked class="form-checkbox text-cyan-600" data-astro-cid-ruqxmpje> <span class="text-sm text-gray-300" data-astro-cid-ruqxmpje>WĹ‚Ä…cz monitoring wydajnoĹ›ci</span> </label> </div> </div> </details> </div> <!-- Form Actions --> <div class="flex justify-end space-x-4 pt-6 border-t border-gray-600" data-astro-cid-ruqxmpje> <button type="button" id="preview-agent" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors" data-astro-cid-ruqxmpje>
đź‘€ PodglÄ…d Konfiguracji
</button> <button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors" data-astro-cid-ruqxmpje>
đźš€ UtwĂłrz Agenta
</button> </div> </form> </div> </main>  <div id="preview-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" data-astro-cid-ruqxmpje> <div class="flex items-center justify-center min-h-screen p-4" data-astro-cid-ruqxmpje> <div class="bg-gray-900 rounded-xl border border-cyan-500/30 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" data-astro-cid-ruqxmpje> <div class="flex justify-between items-center mb-4" data-astro-cid-ruqxmpje> <h3 class="text-xl font-bold text-white" data-astro-cid-ruqxmpje>đź‘€ PodglÄ…d Konfiguracji Agenta</h3> <button id="close-preview" class="text-gray-400 hover:text-white" data-astro-cid-ruqxmpje>
âś•
</button> </div> <div id="preview-content" class="text-gray-300" data-astro-cid-ruqxmpje> <!-- Preview content will be generated here --> </div> <div class="flex justify-end space-x-2 mt-6" data-astro-cid-ruqxmpje> <button id="close-preview-btn" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors" data-astro-cid-ruqxmpje>
Zamknij
</button> </div> </div> </div> </div>  <div id="success-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" data-astro-cid-ruqxmpje> <div class="flex items-center justify-center min-h-screen p-4" data-astro-cid-ruqxmpje> <div class="bg-gray-900 rounded-xl border border-green-500/30 p-6 max-w-md w-full" data-astro-cid-ruqxmpje> <div class="text-center" data-astro-cid-ruqxmpje> <div class="text-4xl mb-4" data-astro-cid-ruqxmpje>đźŽ‰</div> <h3 class="text-xl font-bold text-white mb-4" data-astro-cid-ruqxmpje>Agent Utworzony PomyĹ›lnie!</h3> <div id="success-content" class="text-gray-300 mb-6" data-astro-cid-ruqxmpje> <!-- Success content will be generated here --> </div> <div class="flex justify-center space-x-2" data-astro-cid-ruqxmpje> <button id="goto-dashboard" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors" data-astro-cid-ruqxmpje>
đź“Š PrzejdĹş do Dashboard
</button> <button id="create-another" class="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors" data-astro-cid-ruqxmpje>
âž• UtwĂłrz Kolejnego
</button> </div> </div> </div> </div> </div> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/agents/create-backup.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/agents/create-backup.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/agents/create-backup.astro";
const $$url = "/POLACZEK_AGENT_SYS_23/agents/create-backup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CreateBackup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
