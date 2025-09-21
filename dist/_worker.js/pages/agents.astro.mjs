if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../chunks/astro/server_xZvTY01m.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_BhpsI7E-.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "title": "AI Agents Dashboard | MyBonzo" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh bg-black text-white"> <!-- Header --> <section class="border-b border-cyan-500/30"> <div class="max-w-6xl mx-auto p-6"> <h1 class="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
AI Agents Dashboard
</h1> <p class="text-gray-300 mt-2">
Zarządzaj swoimi agentami AI w jednym miejscu
</p> </div> </section> <!-- Agents Grid --> <section class="max-w-6xl mx-auto p-6"> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <!-- MyBonzo Agent --> <div class="border border-cyan-500/30 rounded-lg bg-gray-900/30 overflow-hidden hover:border-cyan-400 transition-colors"> <div class="bg-gradient-to-r from-cyan-500 to-purple-600 p-4"> <h3 class="text-xl font-bold text-white">MyBonzo AI</h3> <p class="text-cyan-100 text-sm">Główny agent</p> </div> <div class="p-4"> <div class="text-sm text-gray-400 mb-4">
Funkcje: Chat, Obrazy, Zadania, Analiza
</div> <div class="flex gap-2"> <a href="/agents/mybonzo" class="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-2 rounded text-center text-sm transition-colors">
Otwórz
</a> <button onclick="testAgent('mybonzo')" class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-2 rounded text-sm transition-colors">
Test
</button> </div> </div> </div> <!-- Polaczek Agent --> <div class="border border-red-500/30 rounded-lg bg-gray-900/30 overflow-hidden hover:border-red-400 transition-colors"> <div class="bg-gradient-to-r from-red-500 to-white p-4"> <h3 class="text-xl font-bold text-red-900">Polaczek Agent</h3> <p class="text-red-800 text-sm">Agent lokalny</p> </div> <div class="p-4"> <div class="text-sm text-gray-400 mb-4">
Funkcje: Chat, Tłumaczenia, Lokalne zadania
</div> <div class="flex gap-2"> <a href="/agents/polaczek" class="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded text-center text-sm transition-colors">
Otwórz
</a> <button onclick="testAgent('polaczek')" class="bg-white/20 hover:bg-white/30 text-gray-300 px-3 py-2 rounded text-sm transition-colors">
Test
</button> </div> </div> </div> <!-- Bielik Agent --> <div class="border border-blue-500/30 rounded-lg bg-gray-900/30 overflow-hidden hover:border-blue-400 transition-colors"> <div class="bg-gradient-to-r from-blue-500 to-green-600 p-4"> <h3 class="text-xl font-bold text-white">Bielik AI</h3> <p class="text-blue-100 text-sm">Polski model</p> </div> <div class="p-4"> <div class="text-sm text-gray-400 mb-4">
Funkcje: Chat PL, Zadania PL, Analiza
</div> <div class="flex gap-2"> <a href="/agents/bielik" class="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded text-center text-sm transition-colors">
Otwórz
</a> <button onclick="testAgent('bielik')" class="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded text-sm transition-colors">
Test
</button> </div> </div> </div> <!-- Universal Assistant --> <div class="border border-gray-500/30 rounded-lg bg-gray-900/30 overflow-hidden hover:border-gray-400 transition-colors"> <div class="bg-gradient-to-r from-gray-500 to-blue-500 p-4"> <h3 class="text-xl font-bold text-white">Universal Assistant</h3> <p class="text-gray-100 text-sm">Asystent ogólny</p> </div> <div class="p-4"> <div class="text-sm text-gray-400 mb-4">
Funkcje: Chat, Pomoc, Ogólne zadania
</div> <div class="flex gap-2"> <a href="/agents/assistant" class="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 px-3 py-2 rounded text-center text-sm transition-colors">
Otwórz
</a> <button onclick="testAgent('assistant')" class="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded text-sm transition-colors">
Test
</button> </div> </div> </div> </div> </section> <!-- Agent Creator --> <section class="max-w-6xl mx-auto p-6"> <div class="border border-yellow-500/30 rounded-lg bg-gray-900/30 p-6"> <h2 class="text-2xl font-semibold mb-4 text-yellow-400">
🔧 Stwórz Nowego Agenta
</h2> <p class="text-gray-300 mb-6">
Możesz utworzyć własnego agenta z konfigurowalnymi funkcjami
</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-gray-300 mb-2">Nazwa agenta</label> <input type="text" id="agent-name" placeholder="np. MójBot" class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"> </div> <div> <label class="block text-sm font-medium text-gray-300 mb-2">Model AI</label> <select id="agent-model" class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"> <option value="@cf/meta/llama-3.1-8b-instruct">Llama 3.1 8B</option> <option value="@cf/huggingface/bielik-7b-instruct-v0.1">Bielik 7B</option> <option value="@cf/google/gemma-3-12b-it">Gemma 3 12B</option> </select> </div> <div class="md:col-span-2"> <label class="block text-sm font-medium text-gray-300 mb-2">Opis agenta</label> <textarea id="agent-description" placeholder="Opisz co robi twój agent..." class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none h-24"></textarea> </div> <div class="md:col-span-2"> <label class="block text-sm font-medium text-gray-300 mb-2">Funkcje agenta</label> <div class="grid grid-cols-2 md:grid-cols-4 gap-2"> <label class="flex items-center space-x-2"> <input type="checkbox" value="chat" class="text-yellow-400"> <span class="text-sm">💬 Chat</span> </label> <label class="flex items-center space-x-2"> <input type="checkbox" value="images" class="text-yellow-400"> <span class="text-sm">🖼️ Obrazy</span> </label> <label class="flex items-center space-x-2"> <input type="checkbox" value="tasks" class="text-yellow-400"> <span class="text-sm">⚡ Zadania</span> </label> <label class="flex items-center space-x-2"> <input type="checkbox" value="analysis" class="text-yellow-400"> <span class="text-sm">🔍 Analiza</span> </label> </div> </div> <div class="md:col-span-2"> <button onclick="createAgent()" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded hover:opacity-80 transition-opacity">
Stwórz Agenta
</button> </div> </div> </div> </section> <!-- System Status --> <section class="max-w-6xl mx-auto p-6"> <div class="border border-green-500/30 rounded-lg bg-gray-900/30 p-4"> <h3 class="text-lg font-semibold mb-4 text-green-400">
📊 Status Systemu
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="system-status"> <div class="text-center"> <div class="text-2xl text-green-400" id="active-agents">4</div> <div class="text-sm text-gray-400">Aktywne Agenty</div> </div> <div class="text-center"> <div class="text-2xl text-blue-400" id="total-messages">0</div> <div class="text-sm text-gray-400">Wiadomości</div> </div> <div class="text-center"> <div class="text-2xl text-purple-400" id="images-generated">0</div> <div class="text-sm text-gray-400">Wygenerowane Obrazy</div> </div> <div class="text-center"> <div class="text-2xl text-yellow-400" id="tasks-completed">0</div> <div class="text-sm text-gray-400">Ukończone Zadania</div> </div> </div> </div> </section> </main> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/agents/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/agents/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/agents/index.astro";
const $$url = "/agents";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
