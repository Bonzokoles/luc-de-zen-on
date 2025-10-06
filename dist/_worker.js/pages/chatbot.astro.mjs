globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_HpSis98d.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_BwiF4hL0.mjs';
/* empty css                                   */
export { r as renderers } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$Chatbot = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "title": "AI Chatbot | AI Workers", "data-astro-cid-cpe23hkd": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh" data-astro-cid-cpe23hkd> <!-- Chat Settings Panel               <select
                id="chatTemperature"
                class="w-full p-2 border border-edge rounded text-primary-foreground"
                style="background: rgba(0, 0, 0, 0.5);"
              >
        <div
          class="settings-panel mt-8 border border-edge rounded-lg p-6"
          style="background: rgba(0, 0, 0, 0.5);"
        >- Header Section --> <section class="border border-edge" data-astro-cid-cpe23hkd> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-cpe23hkd> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-cpe23hkd> <div class="mt-auto" data-astro-cid-cpe23hkd> <span style="writing-mode: vertical-lr;" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-cpe23hkd>
AI_CHAT
</span> </div> <span class="mt-auto" data-astro-cid-cpe23hkd> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-cpe23hkd>
GPT_BOT
</span> </span> </div> </div> </section> <!-- Navigation Section --> <section class="border border-edge" data-astro-cid-cpe23hkd> <div class="max-w-6xl mx-auto border-x border-edge" data-astro-cid-cpe23hkd> <div class="flex flex-row p-2" data-astro-cid-cpe23hkd> <a class="hover:brightness-125" href="/" data-astro-cid-cpe23hkd> <h1 class="text-4xl sm:text-5xl" data-astro-cid-cpe23hkd>AI CHATBOT</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-cpe23hkd>Inteligentny Asystent</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-cpe23hkd> <a class="ml-auto hover:brightness-125 duration-200" href="/" data-astro-cid-cpe23hkd>
← Powrót do strony głównej
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-cpe23hkd> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-cpe23hkd></path> </svg> </a> </div> </div> </div> </section> <!-- Chatbot Section --> <section class="ai-workers-section flex items-center justify-center py-16" style="background: rgba(0, 0, 0, 0.5);" id="chatbot" data-astro-cid-cpe23hkd> <div class="section-container max-w-4xl mx-auto" data-astro-cid-cpe23hkd> <h2 class="section-title" data-astro-cid-cpe23hkd>AI CHATBOT</h2> <p class="section-description" data-astro-cid-cpe23hkd>
Inteligentny asystent AI do rozmów, odpowiadania na pytania i pomocy w
          zadaniach
</p> <!-- Chat Interface --> <div class="chat-container border border-edge rounded-lg overflow-hidden mt-8" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-cpe23hkd> <!-- Chat Header --> <div class="chat-header border-b border-edge p-4 flex items-center justify-between" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-cpe23hkd> <div class="flex items-center gap-3" data-astro-cid-cpe23hkd> <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse" data-astro-cid-cpe23hkd></div> <span class="text-primary-foreground font-semibold" data-astro-cid-cpe23hkd>AI Assistant Online</span> </div> <div class="flex gap-2" data-astro-cid-cpe23hkd> <button onclick="clearChat()" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm" data-astro-cid-cpe23hkd>
Wyczyść
</button> <button onclick="exportChat()" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm" data-astro-cid-cpe23hkd>
Eksport
</button> </div> </div> <!-- Chat Messages --> <div id="chatMessages" class="chat-messages h-96 overflow-y-auto p-4 space-y-4" data-astro-cid-cpe23hkd> <div class="message assistant-message" data-astro-cid-cpe23hkd> <div class="message-content bg-cyan-600/20 border border-cyan-400/30 rounded-lg p-3" data-astro-cid-cpe23hkd> <div class="message-header flex items-center gap-2 mb-2" data-astro-cid-cpe23hkd> <span class="w-2 h-2 bg-cyan-400 rounded-full" data-astro-cid-cpe23hkd></span> <span class="text-cyan-400 text-sm font-medium" data-astro-cid-cpe23hkd>AI Assistant</span> <span class="text-gray-400 text-xs ml-auto" data-astro-cid-cpe23hkd>Teraz</span> </div> <div class="message-text text-primary-foreground" data-astro-cid-cpe23hkd>
Cześć! Jestem AI Assistant. Mogę pomóc Ci w różnych zadaniach
                  - odpowiadać na pytania, pisać kod, tłumaczyć, analizować
                  tekst i wiele więcej. O czym chcesz porozmawiać?
</div> </div> </div> </div> <!-- Chat Input --> <div class="chat-input border-t border-edge p-4" data-astro-cid-cpe23hkd> <div class="flex gap-3" data-astro-cid-cpe23hkd> <textarea id="messageInput" rows="2" placeholder="Napisz swoją wiadomość..." class="flex-1 p-3 border border-edge rounded-lg text-primary-foreground placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none" style="background: rgba(0, 0, 0, 0.5);" onkeypress="handleKeyPress(event)" data-astro-cid-cpe23hkd></textarea> <button id="sendButton" onclick="sendMessage()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50" data-astro-cid-cpe23hkd>
Wyślij
</button> </div> <div id="typingIndicator" class="hidden mt-2 text-gray-400 text-sm" data-astro-cid-cpe23hkd> <span class="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" data-astro-cid-cpe23hkd></span> <span class="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s" data-astro-cid-cpe23hkd></span> <span class="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s" data-astro-cid-cpe23hkd></span> <span class="ml-2" data-astro-cid-cpe23hkd>AI pisze odpowiedź...</span> </div> </div> </div> <!-- Quick Actions --> <div class="quick-actions mt-8" data-astro-cid-cpe23hkd> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-cpe23hkd>
Szybkie akcje:
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-3" data-astro-cid-cpe23hkd> <button class="quick-action-btn" onclick="askQuestion('Jak napisać funkcję w JavaScript?')" data-astro-cid-cpe23hkd>
💻 Programowanie
</button> <button class="quick-action-btn" onclick="askQuestion('Przetłumacz ten tekst na angielski')" data-astro-cid-cpe23hkd>
🌐 Tłumaczenie
</button> <button class="quick-action-btn" onclick="askQuestion('Napisz kreatywną historię o kosmosie')" data-astro-cid-cpe23hkd>
✍️ Pisanie
</button> <button class="quick-action-btn" onclick="askQuestion('Wyjaśnij mi podstawy uczenia maszynowego')" data-astro-cid-cpe23hkd>
🧠 Nauka
</button> <button class="quick-action-btn" onclick="askQuestion('Pomóż mi z matematyką')" data-astro-cid-cpe23hkd>
🔢 Matematyka
</button> <button class="quick-action-btn" onclick="askQuestion('Stwórz plan diety')" data-astro-cid-cpe23hkd>
🥗 Zdrowie
</button> <button class="quick-action-btn" onclick="askQuestion('Doradź mi książkę do czytania')" data-astro-cid-cpe23hkd>
📚 Książki
</button> <button class="quick-action-btn" onclick="askQuestion('Co nowego w technologii?')" data-astro-cid-cpe23hkd>
🔬 Technologia
</button> </div> </div> <!-- Settings Panel --> <div class="settings-panel mt-8 bg-black/20 border border-edge rounded-lg p-6" data-astro-cid-cpe23hkd> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-cpe23hkd>
Ustawienia czatu:
</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-astro-cid-cpe23hkd> <div data-astro-cid-cpe23hkd> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-cpe23hkd>Model AI:</label> <select id="aiModel" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-cpe23hkd> <option value="gpt-4" data-astro-cid-cpe23hkd>GPT-4 (Zalecany)</option> <option value="gpt-3.5-turbo" data-astro-cid-cpe23hkd>GPT-3.5 Turbo</option> <option value="claude" data-astro-cid-cpe23hkd>Claude</option> <option value="bielik" data-astro-cid-cpe23hkd>Bielik</option> </select> </div> <div data-astro-cid-cpe23hkd> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-cpe23hkd>Temperatura:</label> <select id="temperature" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0, 0, 0, 0.5);" data-astro-cid-cpe23hkd> <option value="0.1" data-astro-cid-cpe23hkd>Precyzyjny (0.1)</option> <option value="0.7" selected data-astro-cid-cpe23hkd>Zbalansowany (0.7)</option> <option value="1.0" data-astro-cid-cpe23hkd>Kreatywny (1.0)</option> </select> </div> <div data-astro-cid-cpe23hkd> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-cpe23hkd>Język:</label> <select id="language" class="w-full p-2 bg-black/40 border border-edge rounded text-primary-foreground" data-astro-cid-cpe23hkd> <option value="pl" data-astro-cid-cpe23hkd>Polski</option> <option value="en" data-astro-cid-cpe23hkd>English</option> <option value="auto" data-astro-cid-cpe23hkd>Automatyczny</option> </select> </div> </div> </div> <!-- Chat History --> <div class="chat-history mt-8" data-astro-cid-cpe23hkd> <h3 class="text-xl font-semibold mb-4 text-primary-foreground" data-astro-cid-cpe23hkd>
Ostatnie rozmowy:
</h3> <div id="chatHistoryList" class="space-y-2" data-astro-cid-cpe23hkd> <!-- History items will be populated here --> </div> </div> </div> </section> </main>  ` })}  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/chatbot.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/chatbot.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/chatbot.astro";
const $$url = "/chatbot";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Chatbot,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
