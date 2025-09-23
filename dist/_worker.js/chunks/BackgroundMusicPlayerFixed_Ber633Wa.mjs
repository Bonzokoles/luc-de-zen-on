globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, a as renderTemplate, am as unescapeHTML, g as addAttribute, m as maybeRenderHead, b as renderScript } from './astro/server_BDhFni3J.mjs';
/* empty css                                     */
import { f as ssr_context, d as attr_class, e as escape_html, c as ensure_array_like, b as attr, g as attr_style, s as stringify } from './_@astro-renderers_ChtfEq-M.mjs';

/** @import { SSRContext } from '#server' */
/** @import { Renderer } from './internal/server/renderer.js' */

/** @param {() => void} fn */
function onDestroy(fn) {
	/** @type {Renderer} */ (/** @type {SSRContext} */ (ssr_context).r).on_destroy(fn);
}

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

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b, _c;
const $$Astro$1 = createAstro("https://mybonzo.com");
const $$SEOHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SEOHead;
  const {
    title = "MyBonzo - Zaawansowana Platforma AI Workers",
    description = "Nowoczesna platforma AI z zaawansowanymi narz\u0119dziami do automatyzacji, generowania tre\u015Bci, analizy danych i wi\u0119cej. Odkryj moc sztucznej inteligencji.",
    image = "/og-image.jpg",
    article = false,
    publishedTime,
    modifiedTime,
    author = "MyBonzo Team",
    tags = [],
    canonicalURL,
    noindex = false,
    post
  } = Astro2.props;
  const canonicalUrl = canonicalURL || new URL(Astro2.url.pathname, Astro2.site);
  const ogImage = new URL(image, Astro2.site);
  const postTitle = post?.data?.title;
  const postDescription = post?.data?.description;
  post?.data?.image;
  const postPublishedTime = post?.data?.publishedDate?.toISOString();
  const postModifiedTime = post?.data?.updatedDate?.toISOString();
  const postTags = post?.data?.tags;
  const finalTitle = postTitle || title;
  const finalDescription = postDescription || description;
  const finalPublishedTime = postPublishedTime || publishedTime;
  const finalModifiedTime = postModifiedTime || modifiedTime;
  const finalTags = postTags || tags;
  return renderTemplate(_c || (_c = __template(['<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><!-- Primary Meta Tags --><title>", '</title><meta name="title"', '><meta name="description"', '><meta name="author"', '><meta name="robots"', '><link rel="canonical"', '><!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:alt"', '><meta property="og:site_name" content="MyBonzo"><meta property="og:locale" content="pl_PL">', "", "", "", '<!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><meta property="twitter:image:alt"', '><!-- Additional SEO --><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#0f172a"><meta name="keywords"', '><!-- Structured Data --><script type="application/ld+json">', "<\/script><!-- Breadcrumb Schema -->", "<!-- Organization Schema -->", ""])), addAttribute(Astro2.generator, "content"), finalTitle, addAttribute(finalTitle, "content"), addAttribute(finalDescription, "content"), addAttribute(author, "content"), addAttribute(noindex ? "noindex, nofollow" : "index, follow", "content"), addAttribute(canonicalUrl, "href"), addAttribute(article ? "article" : "website", "content"), addAttribute(canonicalUrl, "content"), addAttribute(finalTitle, "content"), addAttribute(finalDescription, "content"), addAttribute(ogImage, "content"), addAttribute(finalTitle, "content"), article && finalPublishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(finalPublishedTime, "content")}>`, article && finalModifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(finalModifiedTime, "content")}>`, article && author && renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`, finalTags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`), addAttribute(canonicalUrl, "content"), addAttribute(finalTitle, "content"), addAttribute(finalDescription, "content"), addAttribute(ogImage, "content"), addAttribute(finalTitle, "content"), addAttribute(finalTags.join(", "), "content"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": article ? "Article" : "WebSite",
    "name": finalTitle,
    "description": finalDescription,
    "url": canonicalUrl,
    "image": ogImage,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "MyBonzo",
      "logo": {
        "@type": "ImageObject",
        "url": new URL("/logo.png", Astro2.site)
      }
    },
    ...article && finalPublishedTime && {
      "datePublished": finalPublishedTime,
      "dateModified": finalModifiedTime || finalPublishedTime,
      "headline": finalTitle,
      "articleBody": finalDescription
    },
    ...finalTags.length > 0 && {
      "keywords": finalTags.join(", ")
    }
  })), Astro2.url.pathname !== "/" && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": Astro2.site
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": finalTitle,
        "item": canonicalUrl
      }
    ]
  }))), Astro2.url.pathname === "/" && renderTemplate(_b || (_b = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MyBonzo",
    "url": Astro2.site,
    "logo": new URL("/logo.png", Astro2.site),
    "description": "Zaawansowana platforma AI Workers dla automatyzacji i sztucznej inteligencji",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@mybonzo.com"
    },
    "sameAs": [
      "https://github.com/Bonzokoles",
      "https://twitter.com/mybonzo"
    ]
  }))));
}, "Q:/mybonzo/luc-de-zen-on/src/components/SEO/SEOHead.astro", void 0);

const $$Astro = createAstro("https://mybonzo.com");
const $$AccessibilityTools = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AccessibilityTools;
  const {
    skipToContent = true,
    announcements = true,
    colorMode = true,
    fontSize = true
  } = Astro2.props;
  return renderTemplate`<!-- Accessibility Tools -->${maybeRenderHead()}<div class="accessibility-tools" role="banner" aria-label="Narzędzia dostępności" data-astro-cid-wcx2oag4> ${skipToContent && renderTemplate`<a href="#main-content" class="skip-link" aria-label="Przejdź do głównej treści" data-astro-cid-wcx2oag4>
Przejdź do treści
</a>`} <div class="accessibility-controls" role="toolbar" aria-label="Ustawienia dostępności" data-astro-cid-wcx2oag4> ${colorMode && renderTemplate`<button id="color-mode-toggle" class="accessibility-btn" aria-label="Przełącz tryb kolorów" aria-pressed="false" type="button" data-astro-cid-wcx2oag4> <span class="sr-only" data-astro-cid-wcx2oag4>Tryb kolorów</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-astro-cid-wcx2oag4> <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" data-astro-cid-wcx2oag4></path> </svg> </button>`} ${fontSize && renderTemplate`<div class="font-size-controls" role="group" aria-label="Kontrola rozmiaru czcionki" data-astro-cid-wcx2oag4> <button id="font-size-decrease" class="accessibility-btn" aria-label="Zmniejsz rozmiar czcionki" type="button" data-astro-cid-wcx2oag4>
A-
</button> <button id="font-size-reset" class="accessibility-btn" aria-label="Resetuj rozmiar czcionki" type="button" data-astro-cid-wcx2oag4>
A
</button> <button id="font-size-increase" class="accessibility-btn" aria-label="Zwiększ rozmiar czcionki" type="button" data-astro-cid-wcx2oag4>
A+
</button> </div>`} </div> ${announcements && renderTemplate`<div id="accessibility-announcements" class="sr-only" aria-live="polite" aria-atomic="true" role="status" data-astro-cid-wcx2oag4></div>`} </div>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/SEO/AccessibilityTools.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/SEO/AccessibilityTools.astro", void 0);

function AiHelpAssistant($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let isConnected = false;
    let messages = [];
    let inputValue = "";
    let agentStatus = "disconnected";
    let capabilities = [];
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const API_BASE_URL = (typeof window !== "undefined" ? window.location.origin : "");
    const HEALTH_ENDPOINT = `${API_BASE_URL}/api/health`;
    async function checkConnection() {
      try {
        agentStatus = "connecting";
        const response = await fetch(HEALTH_ENDPOINT, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
          const data = await response.json();
          isConnected = true;
          agentStatus = "ready";
          capabilities = ["Chat AI", "Knowledge Base", "Help System"];
          addMessage("system", "🤖 POLACZEK_T Assistant połączony i gotowy do pracy!");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Connection check failed:", error);
        isConnected = false;
        agentStatus = "disconnected";
        addMessage("error", `Błąd połączenia: ${error.message}`);
      }
    }
    onDestroy(() => {
      if (typeof window !== "undefined") {
        try {
          window.removeEventListener("polaczek-clear-chat", clearChat);
          window.removeEventListener("polaczek-reconnect", checkConnection);
        } catch (e) {
        }
      }
    });
    function scrollToBottom() {
    }
    function addMessage(type, content) {
      messages = [
        ...messages,
        {
          id: Date.now() + Math.random(),
          type,
          content,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
        }
      ];
    }
    function getStatusColor(status) {
      switch (status) {
        case "connected":
        case "ready":
          return "text-green-500";
        case "error":
          return "text-red-500";
        case "disconnected":
          return "text-gray-500";
        default:
          return "text-yellow-500";
      }
    }
    function getStatusIcon(status) {
      switch (status) {
        case "connected":
        case "ready":
          return "🟢";
        case "error":
          return "🔴";
        case "disconnected":
          return "⚪";
        default:
          return "🟡";
      }
    }
    function clearChat() {
      messages = [];
    }
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 50);
    }
    if (typeof window !== "undefined") {
        window.POLACZEK = window.POLACZEK || {};
        window.POLACZEK.status = agentStatus;
        try {
          window.dispatchEvent(new CustomEvent("polaczek-status", { detail: { status: agentStatus } }));
        } catch (e) {
        }
      }
    $$renderer2.push(`<div class="assistant-container svelte-et2eqj">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="assistant-panel svelte-et2eqj"><div class="assistant-header svelte-et2eqj"><div class="flex items-center gap-2 svelte-et2eqj"><span class="text-lg svelte-et2eqj">🤖</span> <span class="font-medium svelte-et2eqj">POLACZEK_T Asystent</span></div> <div class="flex items-center gap-2 svelte-et2eqj"><span${attr_class(`text-xs ${getStatusColor(agentStatus)}`, "svelte-et2eqj")}>${escape_html(getStatusIcon(agentStatus))}
            ${escape_html(agentStatus)}</span> <button class="text-white hover:text-gray-200 text-xl svelte-et2eqj">−</button></div></div> <div class="messages svelte-et2eqj"><!--[-->`);
      const each_array = ensure_array_like(messages);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let message = each_array[$$index];
        $$renderer2.push(`<div${attr_class(`flex ${message.type === "user" ? "justify-end" : "justify-start"}`, "svelte-et2eqj")}><div${attr_class(
          `bubble ${message.type === "user" ? "bubble-user" : message.type === "agent" ? "bubble-agent" : message.type === "system" ? "bubble-system" : "bg-red-100 text-red-800 border border-red-200"}`,
          "svelte-et2eqj"
        )}><div class="svelte-et2eqj">${escape_html(message.content)}</div> <div${attr_class(`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`, "svelte-et2eqj")}>${escape_html(message.timestamp)}</div></div></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="input-bar svelte-et2eqj"><div class="flex gap-2 mb-2 svelte-et2eqj"><button class="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 svelte-et2eqj"${attr("disabled", messages.length === 0, true)}>Wyczyść</button> <button class="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 svelte-et2eqj"${attr("disabled", isConnected, true)}>Połącz ponownie</button></div> <div class="flex gap-2 svelte-et2eqj"><input${attr("value", inputValue)} placeholder="Zadaj pytanie agentowi..."${attr("disabled", !isConnected, true)} class="assistant-input svelte-et2eqj"/> <button${attr("disabled", !isConnected || !inputValue.trim(), true)} class="assistant-send svelte-et2eqj">Wyślij</button></div> `);
      if (capabilities.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-2 text-xs text-gray-400 svelte-et2eqj">Funkcje: ${escape_html(capabilities.join(", "))}</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

function BackgroundMusicPlayerFixed($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let playlist = [];
    let currentTrack = 0;
    let volume = 0.5;
    let currentTime = 0;
    let duration = 0;
    let trackName = "No track selected";
    let isLoading = false;
    let panelX = 20;
    let panelY = 20;
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    $$renderer2.push(`<div class="background-music-player svelte-eczhuw"${attr_style(`transform: translate(${stringify(panelX)}px, ${stringify(panelY)}px)`)}><audio preload="metadata" crossorigin="anonymous" class="svelte-eczhuw"></audio> <div class="music-control-panel svelte-eczhuw"><div class="panel-header svelte-eczhuw"><span class="svelte-eczhuw">🎵 MUSIC • POLACZEK ${escape_html("")}</span> <button class="minimize-btn svelte-eczhuw">${escape_html("−")}</button></div> `);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="panel-content svelte-eczhuw"><div class="now-playing svelte-eczhuw"><div class="track-info svelte-eczhuw"><div class="track-name svelte-eczhuw">${escape_html(trackName)}</div> <div class="track-time svelte-eczhuw">${escape_html(formatTime(currentTime))} / ${escape_html(formatTime(duration))}</div> `);
        {
          $$renderer2.push("<!--[!-->");
          {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div> <div class="player-controls svelte-eczhuw"><button class="control-btn svelte-eczhuw">⏮</button> <button class="control-btn play-pause svelte-eczhuw"${attr("disabled", isLoading, true)}>`);
        {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html("▶")}`);
        }
        $$renderer2.push(`<!--]--></button> <button class="control-btn svelte-eczhuw">⏭</button> <button class="control-btn svelte-eczhuw">📋</button> <button class="control-btn emergency svelte-eczhuw" title="Emergency Fix">🚨</button></div> <div class="volume-control svelte-eczhuw"><span class="svelte-eczhuw">🔊</span> <input type="range" min="0" max="100"${attr("value", volume * 100)} class="volume-slider svelte-eczhuw"/> <span class="volume-value svelte-eczhuw">${escape_html(Math.round(volume * 100))}%</span></div> <div class="progress-container svelte-eczhuw"><div class="progress-bar svelte-eczhuw"><div class="progress-fill svelte-eczhuw"${attr_style(`width: ${stringify(0)}%`)}></div></div></div> <div class="status-info svelte-eczhuw"><div class="status-item svelte-eczhuw"><span class="status-label svelte-eczhuw">Status:</span> <span${attr_class(`status-value ${stringify("paused")}`, "svelte-eczhuw")}>${escape_html("Paused")}</span></div> <div class="status-item svelte-eczhuw"><span class="status-label svelte-eczhuw">Track:</span> <span class="status-value svelte-eczhuw">${escape_html(currentTrack + 1)}/${escape_html(playlist.length)}</span></div></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { $$SEOHead as $, AiHelpAssistant as A, BackgroundMusicPlayerFixed as B, $$AccessibilityTools as a };
