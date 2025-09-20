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
import { d as createAstro, c as createComponent, b as renderScript, e as renderHead, a as renderTemplate } from '../chunks/astro/server_xZvTY01m.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$ControlPanel = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ControlPanel;
  return renderTemplate`<html lang="pl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MyBonzo Control Panel</title>${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/control-panel.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/control-panel.astro?astro&type=script&index=1&lang.ts")}${renderHead()}</head> <body class="bg-gray-900 text-white min-h-screen"> <div id="app" class="container mx-auto p-6"> <!-- Header --> <header class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
🚀 MyBonzo Control Panel
</h1> <p class="text-gray-400 mt-2">Zarządzanie aplikacją i deploymentami</p> </div> <div class="flex items-center gap-4"> <div class="flex items-center gap-2"> <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div> <span class="text-green-400">System Online</span> </div> <div class="text-gray-400 text-sm">
Ostatnia aktualizacja: <span id="lastUpdated"></span> </div> </div> </div> </header> <!-- Quick Status Cards --> <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"> <div class="bg-gray-800 rounded-lg p-6 border border-gray-700"> <div class="flex items-center gap-3"> <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
✅
</div> <div> <p class="text-gray-400 text-sm">Status Produkcji</p> <p class="text-xl font-bold text-green-400" id="prodStatus">Zdrowy</p> </div> </div> </div> <div class="bg-gray-800 rounded-lg p-6 border border-gray-700"> <div class="flex items-center gap-3"> <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
⚡
</div> <div> <p class="text-gray-400 text-sm">Aktywne Deploymenty</p> <p class="text-xl font-bold text-blue-400" id="deployCount">2</p> </div> </div> </div> <div class="bg-gray-800 rounded-lg p-6 border border-gray-700"> <div class="flex items-center gap-3"> <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
⚠️
</div> <div> <p class="text-gray-400 text-sm">Alerty Bezpieczeństwa</p> <p class="text-xl font-bold text-yellow-400" id="alertCount">0</p> </div> </div> </div> <div class="bg-gray-800 rounded-lg p-6 border border-gray-700"> <div class="flex items-center gap-3"> <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
💾
</div> <div> <p class="text-gray-400 text-sm">Dostępne Backupy</p> <p class="text-xl font-bold text-purple-400" id="backupCount">5</p> </div> </div> </div> </div> <!-- Main Control Sections --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <!-- Deployment Controls --> <div class="bg-gray-800 rounded-lg p-6 border border-gray-700"> <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
🚀 Kontrola Deploymentów
</h2> <div class="space-y-4"> <!-- Production Deploy --> <div class="bg-gray-700 rounded-lg p-4"> <div class="flex items-center justify-between mb-3"> <div> <h3 class="font-semibold text-green-400">Deploy Produkcyjny</h3> <p class="text-sm text-gray-400">Wdrożenie do środowiska produkcyjnego</p> </div> <div class="text-right"> <p class="text-xs text-gray-500">Ostatni: 2h temu</p> <p class="text-xs text-green-400">Status: Sukces</p> </div> </div> <div class="flex gap-2 mb-3"> <button onclick="deployProduction()" class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
🚀 Deploy Produkcja
</button> <button onclick="deployProductionForce()" class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
⚡ Force Deploy
</button> </div> <div class="text-xs"> <label class="flex items-center gap-2 text-gray-400"> <input type="checkbox" id="skipTests" class="rounded">
Pomiń testy (nie zalecane)
</label> </div> </div> <!-- Quick Actions --> <div class="bg-gray-700 rounded-lg p-4"> <h3 class="font-semibold text-blue-400 mb-3">Szybkie Akcje</h3> <div class="grid grid-cols-2 gap-2 text-xs"> <button onclick="startDevServer()" class="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded transition-colors">
▶️ Start Dev
</button> <button onclick="buildLocal()" class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded transition-colors">
🔨 Build
</button> <button onclick="runSecurityScan()" class="bg-red-600 hover:bg-red-500 px-3 py-2 rounded transition-colors">
🔍 Security
</button> <button onclick="createQuickBackup()" class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded transition-colors">
💾 Backup
</button> </div> </div> </div> </div> <!-- System Status & Controls --> <div class="bg-gray-800 rounded-lg p-6 border border-gray-700"> <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
📊 Status Systemu
</h2> <div class="space-y-4"> <!-- Git Status --> <div class="bg-gray-700 rounded-lg p-4"> <h3 class="font-semibold text-orange-400 mb-3">Git Repository</h3> <div id="gitStatus" class="space-y-2 text-sm mb-4"> <div class="flex justify-between"> <span class="text-gray-400">Branch:</span> <span class="text-white" id="currentBranch">main</span> </div> <div class="flex justify-between"> <span class="text-gray-400">Commit:</span> <span class="text-white font-mono text-xs" id="currentCommit">abc1234</span> </div> <div class="flex justify-between"> <span class="text-gray-400">Status:</span> <span class="text-green-400" id="repoStatus">Czysty</span> </div> </div> <div class="flex gap-2 text-xs"> <button onclick="refreshGitStatus()" class="bg-orange-600 hover:bg-orange-500 px-3 py-2 rounded transition-colors">
🔄 Odśwież
</button> <button onclick="validateCode()" class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded transition-colors">
✅ Waliduj
</button> </div> </div> <!-- Health Monitoring --> <div class="bg-gray-700 rounded-lg p-4"> <h3 class="font-semibold text-cyan-400 mb-3">Monitoring</h3> <div class="grid grid-cols-2 gap-2 text-xs mb-3"> <button onclick="checkProduction()" class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded transition-colors">
✅ Produkcja
</button> <button onclick="checkStaging()" class="bg-yellow-600 hover:bg-yellow-500 px-3 py-2 rounded transition-colors">
🎭 Staging
</button> </div> <div id="healthStatus" class="text-xs text-gray-400">
Ostatnie sprawdzenie: <span id="lastHealthCheck">Nigdy</span> </div> </div> </div> </div> </div> <!-- Emergency Controls --> <div class="mt-8 bg-red-900/20 border border-red-500/30 rounded-lg p-6"> <h2 class="text-2xl font-bold mb-4 flex items-center gap-2 text-red-400">
🚨 Kontrole Awaryjne
</h2> <div class="grid grid-cols-1 lg:grid-cols-3 gap-4"> <!-- Quick Backup --> <div class="bg-gray-800 rounded-lg p-4"> <h3 class="font-semibold text-purple-400 mb-3">Szybki Backup</h3> <input type="text" id="quickBackupReason" placeholder="Powód..." class="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm mb-3"> <button onclick="createQuickBackup()" class="w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
💾 Utwórz Backup
</button> </div> <!-- Emergency Rollback --> <div class="bg-gray-800 rounded-lg p-4"> <h3 class="font-semibold text-red-400 mb-3">Awaryjny Rollback</h3> <select id="rollbackVersion" class="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm mb-3" title="Wybierz wersję do rollbacku"> <option value="">Wybierz wersję...</option> </select> <button onclick="performEmergencyRollback()" class="w-full bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
🚨 ROLLBACK
</button> </div> <!-- System Info --> <div class="bg-gray-800 rounded-lg p-4"> <h3 class="font-semibold text-blue-400 mb-3">Info Systemu</h3> <div class="space-y-1 text-xs"> <div class="flex justify-between"> <span class="text-gray-400">Node.js:</span> <span id="nodeVersion">v22.18.0</span> </div> <div class="flex justify-between"> <span class="text-gray-400">Astro:</span> <span id="astroVersion">5.13.5</span> </div> <div class="flex justify-between"> <span class="text-gray-400">Uptime:</span> <span id="systemUptime">15d 4h</span> </div> </div> </div> </div> </div> <!-- Console Output --> <div class="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700"> <div class="flex items-center justify-between mb-4"> <h2 class="text-xl font-bold">Konsola Systemowa</h2> <div class="flex gap-2"> <button onclick="clearConsole()" class="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm transition-colors">
🗑️ Wyczyść
</button> <button onclick="toggleAutoScroll()" id="autoScrollBtn" class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition-colors">
📜 Auto-scroll
</button> </div> </div> <div id="consoleOutput" class="bg-black rounded p-4 h-64 overflow-y-auto font-mono text-sm"> <div class="text-green-400">[12:34:56] MyBonzo Control Panel zainicjalizowany</div> <div class="text-blue-400">[12:34:57] Łączenie z usługami backend...</div> <div class="text-green-400">[12:34:58] Wszystkie systemy online ✓</div> </div> </div> </div> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/control-panel.astro?astro&type=script&index=2&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/control-panel.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/control-panel.astro";
const $$url = "/control-panel";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ControlPanel,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
