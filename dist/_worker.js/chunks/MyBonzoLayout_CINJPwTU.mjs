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
import { e as createAstro, c as createComponent, t as defineStyleVars, h as addAttribute, r as renderComponent, m as maybeRenderHead, f as renderHead, q as renderSlot, b as renderScript, $ as $$Icon, a as renderTemplate } from './vendor_DlPT8CWO.mjs';
import { $ as $$SEOHead, a as $$AccessibilityTools } from './AccessibilityTools_JER4g_7l.mjs';
/* empty css                                     */

(function() {
  if (typeof globalThis.MessageChannel !== "undefined") {
    return;
  }
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = new MessagePort();
      this.port2 = new MessagePort();
      this.port1._linkedPort = this.port2;
      this.port2._linkedPort = this.port1;
    }
  };
  globalThis.MessagePort = class MessagePort {
    constructor() {
      this.onmessage = null;
      this._linkedPort = null;
      this._listeners = [];
    }
    postMessage(data) {
      if (this._linkedPort) {
        if (typeof queueMicrotask !== "undefined") {
          queueMicrotask(() => {
            this._deliverMessage(data);
          });
        } else {
          setTimeout(() => {
            this._deliverMessage(data);
          }, 0);
        }
      }
    }
    _deliverMessage(data) {
      if (!this._linkedPort) return;
      const event = {
        data,
        type: "message",
        target: this._linkedPort,
        currentTarget: this._linkedPort,
        isTrusted: true,
        origin: "",
        lastEventId: "",
        source: this,
        ports: []
      };
      if (this._linkedPort.onmessage && typeof this._linkedPort.onmessage === "function") {
        try {
          this._linkedPort.onmessage.call(this._linkedPort, event);
        } catch (error) {
          console.error("MessagePort onmessage error:", error);
        }
      }
      this._linkedPort._listeners.forEach((listener) => {
        try {
          listener.call(this._linkedPort, event);
        } catch (error) {
          console.error("MessagePort listener error:", error);
        }
      });
    }
    addEventListener(type, listener) {
      if (type === "message" && typeof listener === "function") {
        this._listeners.push(listener);
      }
    }
    removeEventListener(type, listener) {
      if (type === "message") {
        const index = this._listeners.indexOf(listener);
        if (index > -1) {
          this._listeners.splice(index, 1);
        }
      }
    }
    start() {
    }
    close() {
      this.onmessage = null;
      this._listeners = [];
      this._linkedPort = null;
    }
  };
  if (typeof globalThis.requestIdleCallback === "undefined") {
    globalThis.requestIdleCallback = function(callback, options = {}) {
      const timeout = options.timeout || 0;
      const start = Date.now();
      return setTimeout(() => {
        callback({
          didTimeout: timeout > 0 && Date.now() - start >= timeout,
          timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start));
          }
        });
      }, 1);
    };
  }
  if (typeof globalThis.cancelIdleCallback === "undefined") {
    globalThis.cancelIdleCallback = function(id) {
      clearTimeout(id);
    };
  }
  console.log("MessageChannel polyfill loaded for Cloudflare Workers");
})();

const $$Astro = createAstro("https://www.mybonzo.com");
const $$MyBonzoLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MyBonzoLayout;
  const {
    siteTitle,
    description = "MyBonzo - Zaawansowana Platforma AI Workers z narzędziami do automatyzacji, generowania treści i analizy danych",
    themeColor = "190",
    image,
    article,
    publishedTime,
    modifiedTime,
    author,
    tags,
    canonicalURL,
    noindex
  } = Astro2.props;
  Astro2.url.pathname;
  const $$definedVars = defineStyleVars([{ themeColor }]);
  return renderTemplate`<html lang="pl" dir="ltr" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <head><!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap-index.xml"><link rel="manifest" href="/manifest.json"><meta name="generator" content="Astro v5.13.5"><!-- SEO and Meta Tags -->${renderComponent($$result, "SEOHead", $$SEOHead, { "title": siteTitle, "description": description, "image": image, "article": article, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "author": author, "tags": tags, "canonicalURL": canonicalURL, "noindex": noindex, "data-astro-cid-slfebfn6": true })}<!-- PWA Meta Tags --><meta name="theme-color" content="#00ffff"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="MyBonzo"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- Performance: DNS Prefetch and Preconnect --><link rel="dns-prefetch" href="//fonts.googleapis.com"><link rel="dns-prefetch" href="//fonts.gstatic.com"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Performance: Critical CSS inline --><!-- Font preloads - Non-blocking --><link rel="preload" href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">${maybeRenderHead()}<noscript><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript><!-- Primary Meta Tags --><title>${siteTitle}</title><meta name="title"${addAttribute(siteTitle, "content")}><meta name="description"${addAttribute(description, "content")}><!-- CSS Variables for Theme -->${renderHead()}</head> <body data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <!-- Accessibility Tools --> ${renderComponent($$result, "AccessibilityTools", $$AccessibilityTools, { "data-astro-cid-slfebfn6": true })} <!-- Background Animation - Lazy loaded --> <div class="bg-animation bg-animation-container"${addAttribute(`${"position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6> <div class="loading-spinner"${addAttribute(`${"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6></div> </div> <div class="compact-header" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <nav${addAttribute(`${"position: fixed; top: 0; left: 0; width: 100%; z-index: 20; background: rgba(13, 13, 13, 0.8); backdrop-filter: blur(16px); padding: 1rem;"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6> <div${addAttribute(`${"display: flex; align-items: center; gap: 2rem;"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6> <a href="/"${addAttribute(`${"display: flex; align-items: center; gap: 0.5rem;"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6> <img src="/favicon.svg"${addAttribute(siteTitle, "alt")} width="24" height="24" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <span${addAttribute(`${"color: white; font-weight: bold;"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6>${siteTitle}</span> </a> </div> </nav> </div> <!-- Page content --> <main id="main-content" class="min-h-svh cyberpunk-grid" tabindex="-1" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderSlot($$result, $$slots["default"])} </main> <!-- Floating MCP Buttons --> <div class="mcp-floating-buttons" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <button class="mcp-btn" data-mcp="duckdb" onclick="openMCPModal('duckdb')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:database", "class": "mcp-icon", "data-astro-cid-slfebfn6": true })}
DuckDB
</button> <button class="mcp-btn" data-mcp="paypal" onclick="openMCPModal('paypal')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:credit-card", "class": "mcp-icon", "data-astro-cid-slfebfn6": true })}
PayPal
</button> <button class="mcp-btn" data-mcp="huggingface" onclick="openMCPModal('huggingface')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:brain", "class": "mcp-icon", "data-astro-cid-slfebfn6": true })}
HuggingFace
</button> <button class="mcp-btn" data-mcp="memory" onclick="openMCPModal('memory')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", $$Icon, { "name": "lucide:hard-drive", "class": "mcp-icon", "data-astro-cid-slfebfn6": true })}
Memory
</button> </div> <!-- MCP Modal --> <div id="mcpModal" class="mcp-modal" onclick="closeMCPModal()" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div class="mcp-modal-content" onclick="event.stopPropagation()" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div class="mcp-modal-header" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <h3 id="mcpModalTitle" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}>MCP Service</h3> <button class="mcp-close-btn" onclick="closeMCPModal()" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}>×</button> </div> <div class="mcp-modal-body" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div id="mcpModalDescription" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></div> <div class="mcp-code-section" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <h4 data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}>🔧 Przykład użycia:</h4> <pre id="mcpModalCode" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></pre> </div> </div> </div> </div>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/layouts/MyBonzoLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/MyBonzoLayout.astro", void 0);

export { $$MyBonzoLayout as $ };
