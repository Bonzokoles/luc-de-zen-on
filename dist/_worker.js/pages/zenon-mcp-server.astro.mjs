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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../chunks/vendor_QZhDtzeH.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_UkYhPfz2.mjs';
/* empty css                                            */

const $$ZenonMcpServer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "ZENON MCP SERVER - LUC de ZEN ON", "description": "Model Context Protocol Server z zaawansowanymi narz\u0119dziami AI", "themeColor": "280", "data-astro-cid-dzbvmgjo": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="header-with-help" data-astro-cid-dzbvmgjo> <h1 class="page-title" data-astro-cid-dzbvmgjo>⚡ ZENON MCP SERVER</h1> <button id="helpButton" class="help-icon" data-astro-cid-dzbvmgjo>?</button> </div>  <div class="server-status" data-astro-cid-dzbvmgjo> <!-- ... existing server status content ... --> </div>  <div class="bulk-packages" data-astro-cid-dzbvmgjo> <h2 data-astro-cid-dzbvmgjo>Pakiety Subskrypcji (Bulk Packages)</h2> <p class="packages-subtitle" data-astro-cid-dzbvmgjo>Wybierz plan, aby odblokować pełny potencjał tworzenia i zarządzania agentami AI.</p> <div class="packages-grid" data-astro-cid-dzbvmgjo> <!-- Basic Plan --> <div class="package-card" data-astro-cid-dzbvmgjo> <div class="package-header" data-astro-cid-dzbvmgjo> <h3 data-astro-cid-dzbvmgjo>Basic</h3> <div class="price" data-astro-cid-dzbvmgjo>$49<span data-astro-cid-dzbvmgjo>/miesiąc</span></div> </div> <ul class="features-list" data-astro-cid-dzbvmgjo> <li data-astro-cid-dzbvmgjo><strong data-astro-cid-dzbvmgjo>5</strong> Własnych Agentów AI</li> <li data-astro-cid-dzbvmgjo><strong data-astro-cid-dzbvmgjo>10,000</strong> Zapytań API / miesiąc</li> <li data-astro-cid-dzbvmgjo>Dostęp do podstawowych modeli AI</li> <li data-astro-cid-dzbvmgjo>Podstawowe narzędzia (Search, Filesystem)</li> <li data-astro-cid-dzbvmgjo>Wsparcie społecznościowe</li> </ul> <button class="package-btn" data-astro-cid-dzbvmgjo>Wybierz Plan Basic</button> </div> <!-- Pro Plan --> <div class="package-card recommended" data-astro-cid-dzbvmgjo> <div class="package-header" data-astro-cid-dzbvmgjo> <h3 data-astro-cid-dzbvmgjo>Pro</h3> <div class="price" data-astro-cid-dzbvmgjo>$99<span data-astro-cid-dzbvmgjo>/miesiąc</span></div> </div> <ul class="features-list" data-astro-cid-dzbvmgjo> <li data-astro-cid-dzbvmgjo><strong data-astro-cid-dzbvmgjo>25</strong> Własnych Agentów AI</li> <li data-astro-cid-dzbvmgjo><strong data-astro-cid-dzbvmgjo>50,000</strong> Zapytań API / miesiąc</li> <li data-astro-cid-dzbvmgjo>Dostęp do wszystkich modeli AI (w tym premium)</li> <li data-astro-cid-dzbvmgjo>Wszystkie narzędzia (w tym GitHub, Perplexity)</li> <li data-astro-cid-dzbvmgjo>Priorytetowe wsparcie email</li> </ul> <button class="package-btn" data-astro-cid-dzbvmgjo>Wybierz Plan Pro</button> </div> <!-- Enterprise Plan --> <div class="package-card" data-astro-cid-dzbvmgjo> <div class="package-header" data-astro-cid-dzbvmgjo> <h3 data-astro-cid-dzbvmgjo>Enterprise</h3> <div class="price" data-astro-cid-dzbvmgjo>Kontakt<span data-astro-cid-dzbvmgjo></span></div> </div> <ul class="features-list" data-astro-cid-dzbvmgjo> <li data-astro-cid-dzbvmgjo><strong data-astro-cid-dzbvmgjo>Nielimitowani</strong> Agenci AI</li> <li data-astro-cid-dzbvmgjo><strong data-astro-cid-dzbvmgjo>Nielimitowane</strong> Zapytania API</li> <li data-astro-cid-dzbvmgjo>Dedykowana infrastruktura i modele</li> <li data-astro-cid-dzbvmgjo>Narzędzia na zamówienie i integracje</li> <li data-astro-cid-dzbvmgjo>Dedykowane wsparcie techniczne (SLA)</li> </ul> <button class="package-btn" data-astro-cid-dzbvmgjo>Skontaktuj się z nami</button> </div> </div> </div>  <div class="mcp-tools" data-astro-cid-dzbvmgjo> <!-- ... existing mcp tools content ... --> </div>   ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/zenon-mcp-server.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/zenon-mcp-server.astro";
const $$url = "/zenon-mcp-server";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ZenonMcpServer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
