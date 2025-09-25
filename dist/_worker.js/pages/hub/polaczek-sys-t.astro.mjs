globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, d as renderHead, b as renderScript, a as renderTemplate } from '../../chunks/astro/server_DFvGEJvU.mjs';
/* empty css                                             */
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const $$PolaczekSysT = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-q3dt75l2> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>POLACZEK_SYS_T - System Monitor</title>${renderHead()}</head> <body data-astro-cid-q3dt75l2> <main class="system-interface" data-astro-cid-q3dt75l2> <div class="container" data-astro-cid-q3dt75l2> <div class="header" data-astro-cid-q3dt75l2> <h1 class="system-title" data-astro-cid-q3dt75l2>⚙️ POLACZEK_SYS_T</h1> <p class="system-subtitle" data-astro-cid-q3dt75l2>
Advanced System Monitoring and Management Agent
</p> </div> <div class="control-panel" data-astro-cid-q3dt75l2> <h3 class="panel-title" data-astro-cid-q3dt75l2>System Commands</h3> <div class="controls" data-astro-cid-q3dt75l2> <button class="cmd-btn" data-command="monitor" data-astro-cid-q3dt75l2>📊 Monitor System</button> <button class="cmd-btn" data-command="analyze" data-astro-cid-q3dt75l2>🔬 Analyze Performance</button> <button class="cmd-btn" data-command="optimize" data-astro-cid-q3dt75l2>⚡ Optimize System</button> <button class="cmd-btn" data-command="status" data-astro-cid-q3dt75l2>📋 Get Status</button> <button class="cmd-btn" data-command="help" data-astro-cid-q3dt75l2>❓ Help</button> </div> </div> <div class="terminal-panel" data-astro-cid-q3dt75l2> <div class="terminal-header" data-astro-cid-q3dt75l2> <span class="terminal-title" data-astro-cid-q3dt75l2>POLACZEK_SYS_T Terminal</span> <div class="terminal-controls" data-astro-cid-q3dt75l2> <button id="clearTerminal" class="control-btn" data-astro-cid-q3dt75l2>Clear</button> <button id="saveLog" class="control-btn" data-astro-cid-q3dt75l2>Save Log</button> </div> </div> <div id="terminal" class="terminal" data-astro-cid-q3dt75l2>
POLACZEK_SYS_T v2.3.1 - System Monitoring Agent
            ================================================== Ready for
            commands. Click buttons above or type commands. Available commands:
            monitor, analyze, optimize, status, help >
</div> <div class="terminal-input" data-astro-cid-q3dt75l2> <span class="prompt" data-astro-cid-q3dt75l2>polaczek@system:~$</span> <input type="text" id="commandInput" class="command-input" placeholder="Enter command..." data-astro-cid-q3dt75l2> <button id="executeBtn" class="execute-btn" data-astro-cid-q3dt75l2>Execute</button> </div> </div> <div class="system-stats" data-astro-cid-q3dt75l2> <div class="stat-card" data-astro-cid-q3dt75l2> <h4 data-astro-cid-q3dt75l2>🖥️ CPU Usage</h4> <div class="stat-value" id="cpuStat" data-astro-cid-q3dt75l2>23%</div> <div class="stat-bar" data-astro-cid-q3dt75l2> <div class="stat-fill" style="width: 23%" data-astro-cid-q3dt75l2></div> </div> </div> <div class="stat-card" data-astro-cid-q3dt75l2> <h4 data-astro-cid-q3dt75l2>💾 Memory</h4> <div class="stat-value" id="memoryStat" data-astro-cid-q3dt75l2>6.2GB/16GB</div> <div class="stat-bar" data-astro-cid-q3dt75l2> <div class="stat-fill" style="width: 38%" data-astro-cid-q3dt75l2></div> </div> </div> <div class="stat-card" data-astro-cid-q3dt75l2> <h4 data-astro-cid-q3dt75l2>💾 Disk I/O</h4> <div class="stat-value" id="diskStat" data-astro-cid-q3dt75l2>145 MB/s</div> <div class="stat-bar" data-astro-cid-q3dt75l2> <div class="stat-fill" style="width: 65%" data-astro-cid-q3dt75l2></div> </div> </div> <div class="stat-card" data-astro-cid-q3dt75l2> <h4 data-astro-cid-q3dt75l2>🌐 Network</h4> <div class="stat-value" id="networkStat" data-astro-cid-q3dt75l2>15.7 Mbps</div> <div class="stat-bar" data-astro-cid-q3dt75l2> <div class="stat-fill" style="width: 45%" data-astro-cid-q3dt75l2></div> </div> </div> </div> </div> </main>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/polaczek-sys-t.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/polaczek-sys-t.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/polaczek-sys-t.astro";
const $$url = "/hub/polaczek-sys-t";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PolaczekSysT,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
