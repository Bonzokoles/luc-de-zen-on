globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { d as createAstro, c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, an as renderSlot, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_B6La9NdR.mjs';
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_3AZ5KuQd.mjs';
/* empty css                                 */
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Astro$1 = createAstro("https://mybonzo.com");
const $$CyberpunkButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$CyberpunkButton;
  const {
    href,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    onclick,
    class: className = "",
    icon = ""
  } = Astro2.props;
  const Tag = href ? "a" : "button";
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };
  const variantClasses = {
    primary: "cyberpunk-btn-primary",
    secondary: "cyberpunk-btn-secondary",
    danger: "cyberpunk-btn-danger",
    success: "cyberpunk-btn-success"
  };
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "type": type, "disabled": disabled, "onclick": onclick, "class": `cyberpunk-btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, "data-astro-cid-kv7rg66x": true }, { "default": ($$result2) => renderTemplate`${icon && renderTemplate`${maybeRenderHead()}<span class="btn-icon" data-astro-cid-kv7rg66x>${icon}</span>`}${renderSlot($$result2, $$slots["default"])} ` })}  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/CyberpunkButton.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/CyberpunkButton.astro", void 0);

const $$Astro = createAstro("https://mybonzo.com");
const $$CyberStatCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CyberStatCard;
  const {
    title,
    value,
    unit = "",
    icon = "\u{1F4CA}",
    trend = "stable",
    color = "primary",
    loading = false
  } = Astro2.props;
  const colorClasses = {
    primary: "border-cyan-400 text-cyan-400",
    success: "border-green-400 text-green-400",
    warning: "border-yellow-400 text-yellow-400",
    danger: "border-red-400 text-red-400"
  };
  const trendIcons = {
    up: "\u2197\uFE0F",
    down: "\u2198\uFE0F",
    stable: "\u2192"
  };
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`cyber-stat-card ${colorClasses[color]}`, "class")} data-astro-cid-j4wl2dju> <div class="stat-header" data-astro-cid-j4wl2dju> <span class="stat-icon" data-astro-cid-j4wl2dju>${icon}</span> <span class="stat-title" data-astro-cid-j4wl2dju>${title}</span> <span class="stat-trend" data-astro-cid-j4wl2dju>${trendIcons[trend]}</span> </div> <div class="stat-content" data-astro-cid-j4wl2dju> ${loading ? renderTemplate`<div class="stat-loading" data-astro-cid-j4wl2dju> <div class="loading-spinner" data-astro-cid-j4wl2dju></div> <span class="loading-text" data-astro-cid-j4wl2dju>Loading...</span> </div>` : renderTemplate`<div class="stat-value" data-astro-cid-j4wl2dju> <span class="value-number" data-astro-cid-j4wl2dju>${value}</span> ${unit && renderTemplate`<span class="value-unit" data-astro-cid-j4wl2dju>${unit}</span>`} </div>`} </div> <div class="stat-footer" data-astro-cid-j4wl2dju> ${renderSlot($$result, $$slots["default"])} </div> </div> `;
}, "Q:/mybonzo/luc-de-zen-on/src/components/CyberStatCard.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "POLACZEK AGENTS SYS_23 | Advanced AI SDK", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-mwcm4pqh": true })}  ${maybeRenderHead()}<div class="workers-vertical-line-left" data-astro-cid-mwcm4pqh></div> <div class="workers-vertical-line-right" data-astro-cid-mwcm4pqh></div> <main class="min-h-svh" data-astro-cid-mwcm4pqh> <!-- Top Separator Section --> <section class="border border-edge relative" data-astro-cid-mwcm4pqh> <div class="max-w-6xl mx-auto" data-astro-cid-mwcm4pqh> <div class="py-1" data-astro-cid-mwcm4pqh></div> </div> </section> <!-- Header Section --> <section class="border border-edge relative" data-astro-cid-mwcm4pqh> <div class="max-w-6xl mx-auto" data-astro-cid-mwcm4pqh> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-mwcm4pqh> <!-- Left corner - POLACZEK System info --> <div class="mt-auto" style="max-width: 45vw;" data-astro-cid-mwcm4pqh> <div class="text-edge text-sm italic px-2" style="
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
              " data-astro-cid-mwcm4pqh>
POLACZEK AGENTS SYS_23 - Najnowsza<br data-astro-cid-mwcm4pqh>
generacja AI SDK z pełną funkcjonalnością.<br data-astro-cid-mwcm4pqh>
Twórz, zarządzaj i optymalizuj agentów AI<br data-astro-cid-mwcm4pqh>
dla każdego zastosowania biznesowego.
</div> </div> <span class="mt-auto" data-astro-cid-mwcm4pqh> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 15px;
              width: calc(50vw - 576px - 10px - 20px - 30px);
              max-width: 400px;
              text-align: right;
              word-wrap: break-word;
              hyphens: auto;
            " data-astro-cid-mwcm4pqh> <span class="text-primary-foreground text-sm italic" data-astro-cid-mwcm4pqh>
"AI that understands, adapts, and delivers"
</span> </div> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-mwcm4pqh>
SEP 2025
</span> </span> </div> </div> </section> <!-- Header-Navigation Separator --> <section class="border border-edge relative" data-astro-cid-mwcm4pqh> <div class="max-w-6xl mx-auto" data-astro-cid-mwcm4pqh> <div class="py-1" data-astro-cid-mwcm4pqh></div> </div> </section> <!-- Navigation Section --> <section class="border border-edge relative" data-astro-cid-mwcm4pqh> <div class="max-w-6xl mx-auto" data-astro-cid-mwcm4pqh> <div class="flex flex-row p-2" data-astro-cid-mwcm4pqh> <a class="hover:brightness-125" href="/" data-astro-cid-mwcm4pqh> <h1 class="text-4xl sm:text-5xl" data-astro-cid-mwcm4pqh>POLACZEK AGENTS SYS_23</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-mwcm4pqh>Advanced AI SDK Platform</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-mwcm4pqh> <a class="ml-auto hover:brightness-125 duration-200" href="/" data-astro-cid-mwcm4pqh>
← Powrót do MyBonzo Hub
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-mwcm4pqh> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mwcm4pqh></path> </svg> </a> <div class="flex flex-row-reverse flex-wrap gap-4" data-astro-cid-mwcm4pqh> <a class="hover:brightness-125 duration-200" href="/POLACZEK_AGENT_SYS_23/api-keys" data-astro-cid-mwcm4pqh>
API Keys
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-mwcm4pqh> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mwcm4pqh></path> </svg> </a> <a class="hover:brightness-125 duration-200" href="/POLACZEK_AGENT_SYS_23/agent-data-simple" data-astro-cid-mwcm4pqh>
Agent Data
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-mwcm4pqh> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mwcm4pqh></path> </svg> </a> </div> </div> </div> </div> </section> <!-- Separator Section 1 --> <section class="border border-edge relative" data-astro-cid-mwcm4pqh> <div class="max-w-6xl mx-auto" data-astro-cid-mwcm4pqh> <div class="py-1" data-astro-cid-mwcm4pqh></div> </div> </section> <!-- System Statistics Section --> <section class="border border-edge relative" data-astro-cid-mwcm4pqh> <div class="max-w-6xl mx-auto p-6" data-astro-cid-mwcm4pqh> <h3 class="text-2xl font-bold text-primary-foreground mb-6 text-center" data-astro-cid-mwcm4pqh>System Status - POLACZEK AGENTS</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-astro-cid-mwcm4pqh> ${renderComponent($$result2, "CyberStatCard", $$CyberStatCard, { "title": "Active Agents", "value": "12", "icon": "\u{1F916}", "color": "success", "trend": "up", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
Online & Ready
` })} ${renderComponent($$result2, "CyberStatCard", $$CyberStatCard, { "title": "CPU Usage", "value": "67", "unit": "%", "icon": "\u26A1", "color": "warning", "trend": "stable", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
System Load
` })} ${renderComponent($$result2, "CyberStatCard", $$CyberStatCard, { "title": "Memory", "value": "4.2", "unit": "GB", "icon": "\u{1F4BE}", "color": "primary", "trend": "up", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
RAM Usage
` })} ${renderComponent($$result2, "CyberStatCard", $$CyberStatCard, { "title": "Requests", "value": "1.2k", "icon": "\u{1F4CA}", "color": "success", "trend": "up", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
Last 24h
` })} </div> <div class="flex flex-wrap gap-4 justify-center" data-astro-cid-mwcm4pqh> ${renderComponent($$result2, "CyberpunkButton", $$CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/dashboard", "variant": "primary", "size": "lg", "icon": "\u{1F3AF}", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
Dashboard
` })} ${renderComponent($$result2, "CyberpunkButton", $$CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/agents/create", "variant": "success", "size": "lg", "icon": "\u2795", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
Create Agent
` })} ${renderComponent($$result2, "CyberpunkButton", $$CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/api-keys", "variant": "secondary", "size": "lg", "icon": "\u{1F511}", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
API Keys
` })} ${renderComponent($$result2, "CyberpunkButton", $$CyberpunkButton, { "href": "/POLACZEK_AGENT_SYS_23/monitoring", "variant": "danger", "size": "lg", "icon": "\u{1F50D}", "data-astro-cid-mwcm4pqh": true }, { "default": async ($$result3) => renderTemplate`
Monitoring
` })} </div> </div> </section> <!-- Main POLACZEK SDK Section --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative" id="polaczek-sdk" data-astro-cid-mwcm4pqh> <div class="max-w-6xl mx-auto w-full" data-astro-cid-mwcm4pqh> <div class="section-container" data-astro-cid-mwcm4pqh> <h2 class="system-title" data-astro-cid-mwcm4pqh>POLACZEK AGENTS SYS_23</h2> <!-- Separator after title --> <div style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
            max-width: 1212px;
            margin: 0 auto;
            border-t: 1px solid #ffffff;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
          " data-astro-cid-mwcm4pqh></div> <p class="section-description" style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px) - 40px);
            max-width: 1100px;
            margin: 0 auto;
            margin-left: calc(50% - 10px);
            transform: translateX(-50%);
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            padding: 0 15px;
          " data-astro-cid-mwcm4pqh>
Kompletne SDK do tworzenia, zarządzania i optymalizacji agentów AI. 
            Zaawansowane funkcje wyszukiwania, analizy, generowania treści i personalizacji 
            zintegrowane z bazą wiedzy MyBonzo.
</p> <!-- SDK Functions Grid --> <div class="sdk-functions-grid" data-astro-cid-mwcm4pqh> <h3 class="functions-title" data-astro-cid-mwcm4pqh>ZAAWANSOWANE FUNKCJE SDK</h3> <div class="functions-grid" data-astro-cid-mwcm4pqh> <!-- Chat Function --> <div class="function-card" data-function="chat" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>💬</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Chat</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Standardowa konwersacja AI z kontekstem MyBonzo</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="testSDKFunction('chat')" class="test-btn" data-astro-cid-mwcm4pqh>Test</button> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/dashboard', '_blank')" class="docs-btn" data-astro-cid-mwcm4pqh>Dashboard</button> </div> </div> <!-- Search Function --> <div class="function-card" data-function="search" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>🔍</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Search</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Zaawansowane wyszukiwanie w bazie wiedzy MyBonzo</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="testSDKFunction('search')" class="test-btn" data-astro-cid-mwcm4pqh>Test</button> <button onclick="viewSDKDocs('search')" class="docs-btn" data-astro-cid-mwcm4pqh>Docs</button> </div> </div> <!-- Analyze Function --> <div class="function-card" data-function="analyze" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>📊</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Analyze</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Głęboka analiza tekstu i danych z AI insights</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="testSDKFunction('analyze')" class="test-btn" data-astro-cid-mwcm4pqh>Test</button> <button onclick="viewSDKDocs('analyze')" class="docs-btn" data-astro-cid-mwcm4pqh>Docs</button> </div> </div> <!-- Generate Function --> <div class="function-card" data-function="generate" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>✨</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Generate</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Generowanie treści, raportów i materiałów</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="testSDKFunction('generate')" class="test-btn" data-astro-cid-mwcm4pqh>Test</button> <button onclick="viewSDKDocs('generate')" class="docs-btn" data-astro-cid-mwcm4pqh>Docs</button> </div> </div> <!-- Recommend Function --> <div class="function-card" data-function="recommend" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>🎯</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Recommend</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Personalizowane rekomendacje i sugestie</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="testSDKFunction('recommend')" class="test-btn" data-astro-cid-mwcm4pqh>Test</button> <button onclick="viewSDKDocs('recommend')" class="docs-btn" data-astro-cid-mwcm4pqh>Docs</button> </div> </div> <!-- Translate Function --> <div class="function-card" data-function="translate" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>🌍</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Translate</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Kontekstowe tłumaczenie między językami</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="testSDKFunction('translate')" class="test-btn" data-astro-cid-mwcm4pqh>Test</button> <button onclick="viewSDKDocs('translate')" class="docs-btn" data-astro-cid-mwcm4pqh>Docs</button> </div> </div> <!-- Summarize Function --> <div class="function-card" data-function="summarize" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>📝</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Summarize</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Inteligentne streszczanie długich treści</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="testSDKFunction('summarize')" class="test-btn" data-astro-cid-mwcm4pqh>Test</button> <button onclick="viewSDKDocs('summarize')" class="docs-btn" data-astro-cid-mwcm4pqh>Docs</button> </div> </div> <!-- Agent Create Function --> <div class="function-card" data-function="agent_create" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>🤖</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Agent Create</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Tworzenie niestandardowych agentów AI</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/agents/create', '_blank')" class="test-btn" data-astro-cid-mwcm4pqh>Create</button> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/dashboard', '_blank')" class="docs-btn" data-astro-cid-mwcm4pqh>Dashboard</button> </div> </div> <!-- Agent Manage Function --> <div class="function-card" data-function="agent_manage" data-astro-cid-mwcm4pqh> <div class="function-icon" data-astro-cid-mwcm4pqh>⚙️</div> <h4 class="function-name" data-astro-cid-mwcm4pqh>Agent Manage</h4> <p class="function-desc" data-astro-cid-mwcm4pqh>Zarządzanie i konfiguracja agentów</p> <div class="function-actions" data-astro-cid-mwcm4pqh> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/dashboard', '_blank')" class="test-btn" data-astro-cid-mwcm4pqh>Dashboard</button> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/agents/create', '_blank')" class="docs-btn" data-astro-cid-mwcm4pqh>Create</button> </div> </div> </div> </div> <!-- SDK Testing Interface --> <div class="sdk-tester-section" data-astro-cid-mwcm4pqh> <h3 class="tester-title" data-astro-cid-mwcm4pqh>LIVE SDK TESTER</h3> <div class="tester-container" data-astro-cid-mwcm4pqh> <div class="tester-controls" data-astro-cid-mwcm4pqh> <div class="control-group" data-astro-cid-mwcm4pqh> <label data-astro-cid-mwcm4pqh>Funkcja SDK:</label> <select id="sdkFunction" class="sdk-select" data-astro-cid-mwcm4pqh> <option value="chat" data-astro-cid-mwcm4pqh>Chat - Standardowa konwersacja</option> <option value="search" data-astro-cid-mwcm4pqh>Search - Wyszukiwanie</option> <option value="analyze" data-astro-cid-mwcm4pqh>Analyze - Analiza</option> <option value="generate" data-astro-cid-mwcm4pqh>Generate - Generowanie</option> <option value="recommend" data-astro-cid-mwcm4pqh>Recommend - Rekomendacje</option> <option value="translate" data-astro-cid-mwcm4pqh>Translate - Tłumaczenie</option> <option value="summarize" data-astro-cid-mwcm4pqh>Summarize - Streszczanie</option> <option value="agent_create" data-astro-cid-mwcm4pqh>Agent Create - Tworzenie agenta</option> <option value="agent_manage" data-astro-cid-mwcm4pqh>Agent Manage - Zarządzanie</option> </select> </div> <div class="control-group" data-astro-cid-mwcm4pqh> <label data-astro-cid-mwcm4pqh>Model AI:</label> <select id="sdkModel" class="sdk-select" data-astro-cid-mwcm4pqh> <option value="qwen" data-astro-cid-mwcm4pqh>Qwen 1.5 7B (Rekomendowany)</option> <option value="gemma" data-astro-cid-mwcm4pqh>Gemma 7B (Multilingual)</option> <option value="fast" data-astro-cid-mwcm4pqh>Qwen 0.5B (Szybki)</option> <option value="advanced" data-astro-cid-mwcm4pqh>Llama 3.3 70B (Zaawansowany)</option> <option value="claude" data-astro-cid-mwcm4pqh>Claude 3 Haiku (Kreatywny)</option> </select> </div> </div> <div class="tester-input" data-astro-cid-mwcm4pqh> <textarea id="sdkPrompt" placeholder="Wprowadź zapytanie do przetestowania SDK..." class="sdk-textarea" data-astro-cid-mwcm4pqh></textarea> <div class="tester-actions" data-astro-cid-mwcm4pqh> <button onclick="executeSDKTest()" class="execute-btn" data-astro-cid-mwcm4pqh>Wykonaj Test SDK</button> <button onclick="clearSDKTest()" class="clear-btn" data-astro-cid-mwcm4pqh>Wyczyść</button> </div> </div> <div class="tester-output" id="sdkOutput" data-astro-cid-mwcm4pqh> <div class="output-placeholder" data-astro-cid-mwcm4pqh>Wyniki testów SDK pojawią się tutaj...</div> </div> </div> </div> <!-- Quick Actions Section --> <div class="quick-actions-section" data-astro-cid-mwcm4pqh> <h3 class="actions-title" data-astro-cid-mwcm4pqh>SZYBKIE AKCJE</h3> <div class="actions-grid" data-astro-cid-mwcm4pqh> <div class="action-card" data-astro-cid-mwcm4pqh> <h4 data-astro-cid-mwcm4pqh>� API Keys Manager</h4> <p data-astro-cid-mwcm4pqh>Zarządzanie kluczami zewnętrznych API</p> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/api-keys', '_blank')" class="action-btn" data-astro-cid-mwcm4pqh>
Otwórz Manager
</button> </div> <div class="action-card" data-astro-cid-mwcm4pqh> <h4 data-astro-cid-mwcm4pqh>� Agent Data Manager</h4> <p data-astro-cid-mwcm4pqh>Dodawaj własne treści i dane do agentów</p> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/agent-data1', '_blank')" class="action-btn" data-astro-cid-mwcm4pqh>
Otwórz Manager
</button> </div> <div class="action-card" data-astro-cid-mwcm4pqh> <h4 data-astro-cid-mwcm4pqh>📊 Monitoring</h4> <p data-astro-cid-mwcm4pqh>Status i analityka wszystkich agentów</p> <button onclick="window.open('/POLACZEK_AGENT_SYS_23/dashboard', '_blank')" class="action-btn" data-astro-cid-mwcm4pqh>
Otwórz Monitor
</button> </div> </div> </div> </div> </div> </section> </main> ` })}  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/POLACZEK_AGENT_SYS_23/index.astro";
const $$url = "/POLACZEK_AGENT_SYS_23";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
