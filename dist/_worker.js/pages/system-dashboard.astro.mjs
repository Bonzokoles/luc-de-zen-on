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
import { c as createComponent, e as renderHead, b as renderScript, a as renderTemplate } from '../chunks/astro/server_xZvTY01m.mjs';
/* empty css                                            */
export { r as renderers } from '../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const $$SystemDashboard = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pl" data-astro-cid-5e72ur2p> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MyBonzo System Dashboard</title>${renderHead()}</head> <body data-astro-cid-5e72ur2p> <div class="dashboard-container" data-astro-cid-5e72ur2p> <header class="header" data-astro-cid-5e72ur2p> <h1 data-astro-cid-5e72ur2p>🚀 MyBonzo System Dashboard</h1> <p data-astro-cid-5e72ur2p>Zarządzanie i diagnostyka platformy AI</p> </header> <div class="grid" data-astro-cid-5e72ur2p> <!-- System Health Card --> <div class="card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>🏥</span>Zdrowie Systemu</h3> <div id="system-status" data-astro-cid-5e72ur2p> <div class="status-indicator status-loading" data-astro-cid-5e72ur2p></div> <span data-astro-cid-5e72ur2p>Sprawdzanie...</span> </div> <button class="action-btn primary-btn" onclick="runSystemCheck()" data-astro-cid-5e72ur2p>
Pełna Diagnostyka
</button> <button class="action-btn" onclick="runQuickCheck()" data-astro-cid-5e72ur2p>
Szybki Test
</button> </div> <!-- Configuration Validator --> <div class="card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>⚙️</span>Walidacja Konfiguracji</h3> <div id="config-status" data-astro-cid-5e72ur2p> <div class="status-indicator status-loading" data-astro-cid-5e72ur2p></div> <span data-astro-cid-5e72ur2p>Sprawdzanie konfiguracji...</span> </div> <button class="action-btn primary-btn" onclick="validateConfig()" data-astro-cid-5e72ur2p>
Sprawdź Konfigurację
</button> <a href="/api/system/validate" class="action-btn" target="_blank" data-astro-cid-5e72ur2p>
API Endpoint
</a> </div> <!-- Dependencies Manager --> <div class="card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>📦</span>Zarządzanie Zależnościami</h3> <div id="dependencies-status" data-astro-cid-5e72ur2p> <div class="metric" data-astro-cid-5e72ur2p> <span class="metric-label" data-astro-cid-5e72ur2p>node_modules:</span> <span class="metric-value" id="nodeModulesStatus" data-astro-cid-5e72ur2p>Sprawdzanie...</span> </div> <div class="metric" data-astro-cid-5e72ur2p> <span class="metric-label" data-astro-cid-5e72ur2p>Lock file:</span> <span class="metric-value" id="lockFileStatus" data-astro-cid-5e72ur2p>Sprawdzanie...</span> </div> </div> <button class="action-btn primary-btn" onclick="runDependencyFix()" data-astro-cid-5e72ur2p>
Napraw Zależności
</button> <button class="action-btn" onclick="checkDependencies()" data-astro-cid-5e72ur2p>
Sprawdź Status
</button> </div> <!-- Workers Status --> <div class="card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>☁️</span>Cloudflare Workers</h3> <div id="workers-status" data-astro-cid-5e72ur2p> <div class="metric" data-astro-cid-5e72ur2p> <span class="metric-label" data-astro-cid-5e72ur2p>Health:</span> <span class="metric-value" id="workerHealth" data-astro-cid-5e72ur2p>Sprawdzanie...</span> </div> <div class="metric" data-astro-cid-5e72ur2p> <span class="metric-label" data-astro-cid-5e72ur2p>Response Time:</span> <span class="metric-value" id="workerResponseTime" data-astro-cid-5e72ur2p>-</span> </div> </div> <button class="action-btn primary-btn" onclick="testWorkers()" data-astro-cid-5e72ur2p>
Test Workers
</button> <button class="action-btn" onclick="deployWorkers()" data-astro-cid-5e72ur2p>
Deploy
</button> </div> <!-- API Connectivity --> <div class="card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>🔗</span>Połączenia API</h3> <div id="api-status" data-astro-cid-5e72ur2p> <div class="metric" data-astro-cid-5e72ur2p> <span class="metric-label" data-astro-cid-5e72ur2p>OpenAI:</span> <span class="metric-value" id="openaiStatus" data-astro-cid-5e72ur2p>Sprawdzanie...</span> </div> <div class="metric" data-astro-cid-5e72ur2p> <span class="metric-label" data-astro-cid-5e72ur2p>Cloudflare:</span> <span class="metric-value" id="cloudflareStatus" data-astro-cid-5e72ur2p>Sprawdzanie...</span> </div> <div class="metric" data-astro-cid-5e72ur2p> <span class="metric-label" data-astro-cid-5e72ur2p>Anthropic:</span> <span class="metric-value" id="anthropicStatus" data-astro-cid-5e72ur2p>Sprawdzanie...</span> </div> </div> <button class="action-btn primary-btn" onclick="testAPIConnections()" data-astro-cid-5e72ur2p>
Test Wszystkich API
</button> </div> <!-- Quick Actions --> <div class="card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>⚡</span>Szybkie Akcje</h3> <button class="action-btn" onclick="clearCache()" data-astro-cid-5e72ur2p>
Wyczyść Cache
</button> <button class="action-btn" onclick="restartServices()" data-astro-cid-5e72ur2p>
Restart Serwisów
</button> <button class="action-btn" onclick="generateReport()" data-astro-cid-5e72ur2p>
Generuj Raport
</button> <button class="action-btn" onclick="viewLogs()" data-astro-cid-5e72ur2p>
Pokaż Logi
</button> </div> </div> <!-- System Metrics --> <div class="card wide-card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>📊</span>Metryki Systemowe</h3> <div class="system-health" data-astro-cid-5e72ur2p> <div class="health-metric" data-astro-cid-5e72ur2p> <div class="health-value" id="cpuUsage" data-astro-cid-5e72ur2p>-%</div> <div class="health-label" data-astro-cid-5e72ur2p>CPU Usage</div> </div> <div class="health-metric" data-astro-cid-5e72ur2p> <div class="health-value" id="memoryUsage" data-astro-cid-5e72ur2p>-%</div> <div class="health-label" data-astro-cid-5e72ur2p>Memory Usage</div> </div> <div class="health-metric" data-astro-cid-5e72ur2p> <div class="health-value" id="diskSpace" data-astro-cid-5e72ur2p>-%</div> <div class="health-label" data-astro-cid-5e72ur2p>Disk Usage</div> </div> <div class="health-metric" data-astro-cid-5e72ur2p> <div class="health-value" id="responseTime" data-astro-cid-5e72ur2p>-ms</div> <div class="health-label" data-astro-cid-5e72ur2p>Avg Response</div> </div> </div> </div> <!-- Console Output --> <div class="card wide-card" data-astro-cid-5e72ur2p> <h3 data-astro-cid-5e72ur2p><span class="icon" data-astro-cid-5e72ur2p>💻</span>Console Output</h3> <div id="console-output" class="log-output" data-astro-cid-5e72ur2p> <div class="info-text" data-astro-cid-5e72ur2p>[INFO] MyBonzo System Dashboard inicjalizowany...</div> <div class="info-text" data-astro-cid-5e72ur2p>[INFO] Gotowy do użycia. Kliknij przycisk aby rozpocząć diagnostykę.</div> </div> <button class="action-btn" onclick="clearConsole()" data-astro-cid-5e72ur2p>Wyczyść</button> <button class="action-btn" onclick="exportLogs()" data-astro-cid-5e72ur2p>Eksportuj Logi</button> </div> </div> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/system-dashboard.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/system-dashboard.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/system-dashboard.astro";
const $$url = "/system-dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$SystemDashboard,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
