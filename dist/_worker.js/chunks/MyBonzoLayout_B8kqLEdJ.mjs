globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, m as maybeRenderHead, g as addAttribute, a as renderTemplate, b as renderScript, r as renderComponent, an as renderSlot, ao as defineStyleVars, d as renderHead } from './astro/server_BDhFni3J.mjs';
import { $ as $$SEOHead, a as $$AccessibilityTools, B as BackgroundMusicPlayerFixed, A as AiHelpAssistant } from './BackgroundMusicPlayerFixed_Ber633Wa.mjs';
import { d as attr_class, e as escape_html, b as attr, h as slot, i as bind_props } from './_@astro-renderers_ChtfEq-M.mjs';
/* empty css                                     */
import { W as WorkersStatusDashboard } from './WorkersStatusDashboard_BtnDHy3d.mjs';

function BigQueryWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let query = "";
		let isLoading = false;
		let isExpanded = false;

		$$renderer.push(`<div${attr_class('bigquery-widget svelte-qinsj6', void 0, { 'expanded': isExpanded })}><div class="widget-header svelte-qinsj6"><div class="title-section svelte-qinsj6"><h3 class="svelte-qinsj6">📊 BigQuery Analytics</h3> <span class="service-badge svelte-qinsj6">Google Cloud</span></div> <div class="header-actions svelte-qinsj6"><button class="expand-btn svelte-qinsj6" title="Rozwiń/Zwiń">${escape_html("▲")}</button> <button class="full-btn svelte-qinsj6" title="Otwórz pełną analitykę">🔗</button></div></div> <div class="widget-content svelte-qinsj6">`);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="input-section svelte-qinsj6"><div class="input-container svelte-qinsj6"><textarea placeholder="SELECT * FROM dataset.table WHERE..."${attr('rows', "2")}${attr('disabled', isLoading, true)} class="sql-input svelte-qinsj6">`);

		const $$body = escape_html(query);

		if ($$body) {
			$$renderer.push(`${$$body}`);
		}

		$$renderer.push(`</textarea> <button${attr('disabled', !query.trim() || isLoading, true)} class="execute-btn svelte-qinsj6" title="Wykonaj zapytanie SQL">`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`📊`);
		}

		$$renderer.push(`<!--]--></button></div></div></div></div>`);
	});
}

function KaggleWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let searchQuery = "";
		let isLoading = false;
		let isExpanded = false;

		$$renderer.push(`<div${attr_class('kaggle-widget svelte-1cu75xn', void 0, { 'expanded': isExpanded })}><div class="widget-header svelte-1cu75xn"><div class="title-section svelte-1cu75xn"><h3 class="svelte-1cu75xn">🔍 Kaggle Datasets</h3> <span class="service-badge svelte-1cu75xn">ML Platform</span></div> <div class="header-actions svelte-1cu75xn"><button class="expand-btn svelte-1cu75xn" title="Rozwiń/Zwiń">${escape_html("▲")}</button> <button class="full-btn svelte-1cu75xn" title="Otwórz pełną platformę">🔗</button></div></div> <div class="widget-content svelte-1cu75xn">`);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="input-section svelte-1cu75xn"><div class="input-container svelte-1cu75xn"><input type="text"${attr('value', searchQuery)} placeholder="machine learning, computer vision..."${attr('disabled', isLoading, true)} class="search-input svelte-1cu75xn"/> <button${attr('disabled', !searchQuery.trim() || isLoading, true)} class="search-btn svelte-1cu75xn" title="Wyszukaj datasets">`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`🔍`);
		}

		$$renderer.push(`<!--]--></button></div></div></div></div>`);
	});
}

function TavilyWidget($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let searchQuery = "";
		let isLoading = false;
		let isExpanded = false;

		$$renderer.push(`<div${attr_class('tavily-widget svelte-vqitbf', void 0, { 'expanded': isExpanded })}><div class="widget-header svelte-vqitbf"><div class="title-section svelte-vqitbf"><h3 class="svelte-vqitbf">🌐 Tavily AI Search</h3> <span class="service-badge svelte-vqitbf">AI Powered</span></div> <div class="header-actions svelte-vqitbf"><button class="expand-btn svelte-vqitbf" title="Rozwiń/Zwiń">${escape_html("▲")}</button> <button class="full-btn svelte-vqitbf" title="Otwórz pełne wyszukiwanie">🔗</button></div></div> <div class="widget-content svelte-vqitbf">`);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <div class="input-section svelte-vqitbf"><div class="input-container svelte-vqitbf"><input type="text"${attr('value', searchQuery)} placeholder="Wyszukaj w internecie..."${attr('disabled', isLoading, true)} class="search-input svelte-vqitbf"/> <button${attr('disabled', !searchQuery.trim() || isLoading, true)} class="search-btn svelte-vqitbf" title="Wyszukaj w internecie">`);

		{
			$$renderer.push('<!--[!-->');
			$$renderer.push(`🌐`);
		}

		$$renderer.push(`<!--]--></button></div></div></div></div>`);
	});
}

function PageTransition($$renderer, $$props) {
	let key = $$props['key'];

	$$renderer.push(`<div${attr('key', key)}><!--[-->`);
	slot($$renderer, $$props, 'default', {});
	$$renderer.push(`<!--]--></div>`);
	bind_props($$props, { key });
}

const $$Astro$4 = createAstro("https://mybonzo.com");
const $$HamburgerButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$HamburgerButton;
  const { color = "var(--color-hamburger-lines, #fff)" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button class="hamburger hamburger--collapse" type="button" id="hamburger-btn"${addAttribute(`--hamburger-color: ${color};`, "style")} data-astro-cid-iderrtnh> <span class="hamburger-box" data-astro-cid-iderrtnh> <span class="hamburger-inner" data-astro-cid-iderrtnh></span> </span> </button> `;
}, "Q:/mybonzo/luc-de-zen-on/node_modules/@sofidevo/astro-dynamic-header/src/HamburgerButton.astro", void 0);

const $$Astro$3 = createAstro("https://mybonzo.com");
const $$NavMenu = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$NavMenu;
  const { menuItems = [], showHomeLink = true, homeText = "Home" } = Astro2.props;
  const pagePathname = Astro2.url.pathname;
  return renderTemplate`${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/node_modules/@sofidevo/astro-dynamic-header/src/NavMenu.astro?astro&type=script&index=0&lang.ts")} ${maybeRenderHead()}<nav class="header__menu" id="header-menu" data-astro-cid-kt6r4pss> <ul class="menu" data-astro-cid-kt6r4pss> ${showHomeLink && pagePathname !== "/" && renderTemplate`<li class="header__item" data-astro-cid-kt6r4pss> <a class="menu__link" href="/" data-astro-prefetch="hover" data-astro-cid-kt6r4pss> ${homeText} </a> </li>`} ${menuItems.map((item) => renderTemplate`<li class="menu__item" data-astro-cid-kt6r4pss> <a class="menu__link"${addAttribute(item.link, "href")} data-astro-cid-kt6r4pss> ${item.text} ${item.submenu && renderTemplate`${renderComponent($$result, "iconify-icon", "iconify-icon", { "class": "iconify-arrow", "icon": "codicon:triangle-down", "width": "15", "height": "15", "data-astro-cid-kt6r4pss": true })}`} </a> ${item.submenu && renderTemplate`<ul class="submenu" data-astro-cid-kt6r4pss> ${item.submenu.map((sub) => renderTemplate`<li class="submenu__item submenu__item--secondary" data-astro-cid-kt6r4pss> <a${addAttribute(sub.link, "href")} data-astro-cid-kt6r4pss> ${sub.text} ${sub.submenu && sub.submenu.length > 0 && renderTemplate`${renderComponent($$result, "iconify-icon", "iconify-icon", { "class": "iconify-arrow", "icon": "codicon:triangle-down", "width": "15", "height": "15", "data-astro-cid-kt6r4pss": true })}`} </a> ${sub.submenu && renderTemplate`<ul class="subsubmenu" data-astro-cid-kt6r4pss> ${sub.submenu.map((subsub) => renderTemplate`<li class="submenu__item--tertiary" data-astro-cid-kt6r4pss> <a${addAttribute(subsub.link, "href")} data-astro-cid-kt6r4pss>${subsub.text}</a> </li>`)} </ul>`} </li>`)} </ul>`} </li>`)} </ul> </nav> `;
}, "Q:/mybonzo/luc-de-zen-on/node_modules/@sofidevo/astro-dynamic-header/src/NavMenu.astro", void 0);

const $$Astro$2 = createAstro("https://mybonzo.com");
const $$MobileNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MobileNav;
  const { type } = Astro2.props;
  const {
    menuItems = [],
    showHomeLink = true,
    homeText = "Home",
    accentColor = "var(--light-spot-color, #00ffff)"
  } = Astro2.props;
  const pagePathname = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<nav${addAttribute(`mobile-header__menu mobile-header__menu--${type}`, "class")} id="mobile-header-menu"${addAttribute(`--mobile-accent-color: ${accentColor};`, "style")} data-astro-cid-clzwpxlp> <ol class="mobile-menu" data-astro-cid-clzwpxlp> ${showHomeLink && pagePathname !== "/" && renderTemplate`<li class="header__item mobile-header__item" data-astro-cid-clzwpxlp> <a class="menu__link mobile-menu__link" href="/" data-astro-prefetch="hover" data-astro-cid-clzwpxlp> ${homeText} </a> </li>`} ${menuItems.map((item) => renderTemplate`<li data-astro-cid-clzwpxlp> ${item.submenu ? renderTemplate`<details class="mobile-details" data-astro-cid-clzwpxlp> <summary class="menu__summary" data-astro-cid-clzwpxlp> ${item.text} ${renderComponent($$result, "iconify-icon", "iconify-icon", { "class": "iconify-arrow", "icon": "codicon:triangle-down", "width": "15", "height": "15", "style": `color: ${accentColor};`, "data-astro-cid-clzwpxlp": true })} </summary> <ol class="mobile-submenu" data-astro-cid-clzwpxlp> ${item.submenu.map((sub) => renderTemplate`<li data-astro-cid-clzwpxlp> ${sub.submenu && sub.submenu.length > 0 ? renderTemplate`<details class="mobile-details" data-astro-cid-clzwpxlp> <summary class="menu__summary" data-astro-cid-clzwpxlp> ${sub.text} ${renderComponent($$result, "iconify-icon", "iconify-icon", { "class": "iconify-arrow", "icon": "codicon:triangle-down", "width": "15", "height": "15", "style": `color: ${accentColor};`, "data-astro-cid-clzwpxlp": true })} </summary> <ol class="mobile-subsubmenu" data-astro-cid-clzwpxlp> ${sub.submenu.map((subsub) => renderTemplate`<li class="mobile-submenu__item secondary" data-astro-cid-clzwpxlp> <a class="menu__link mobile-menu__link"${addAttribute(subsub.link, "href")} data-astro-cid-clzwpxlp> ${subsub.text} </a> </li>`)} </ol> </details>` : renderTemplate`<a class="menu__link mobile-menu__link"${addAttribute(sub.link, "href")} data-astro-cid-clzwpxlp> ${sub.text} </a>`} </li>`)} </ol> </details>` : renderTemplate`<a class="mobile-menu__link"${addAttribute(item.link, "href")} data-astro-cid-clzwpxlp> ${item.text} </a>`} </li>`)} </ol> ${renderSlot($$result, $$slots["slot-panel"])} </nav> `;
}, "Q:/mybonzo/luc-de-zen-on/node_modules/@sofidevo/astro-dynamic-header/src/MobileNav.astro", void 0);

const $$Astro$1 = createAstro("https://mybonzo.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const {
    headerType = "floating",
    logoSrc = "/logo.png",
    logoAlt = "Logo",
    logoWidth = "120px",
    homeUrl = "/",
    menuItems = [],
    backgroundColor = "#0d0d0dcc",
    backdropBlur = "blur(20px)",
    zIndex = 10
  } = Astro2.props;
  return renderTemplate`${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/node_modules/@sofidevo/astro-dynamic-header/src/Header.astro?astro&type=script&index=0&lang.ts")} ${maybeRenderHead()}<div${addAttribute(`header__container header__container--${headerType}`, "class")}${addAttribute(`z-index: ${zIndex};`, "style")} data-astro-cid-clcmuyge> <header${addAttribute(`header header--${headerType}`, "class")}${addAttribute(`background-color: ${backgroundColor}; backdrop-filter: ${backdropBlur}; -webkit-backdrop-filter: ${backdropBlur};`, "style")} data-astro-cid-clcmuyge> <a${addAttribute(homeUrl, "href")} data-astro-cid-clcmuyge> <img class="header__logo"${addAttribute(logoSrc, "src")}${addAttribute(logoAlt, "alt")}${addAttribute(`width: ${logoWidth};`, "style")} data-astro-cid-clcmuyge> </a> ${renderComponent($$result, "NavMenu", $$NavMenu, { "menuItems": menuItems, "data-astro-cid-clcmuyge": true })} ${renderSlot($$result, $$slots["slot-desktop"])} ${renderComponent($$result, "HamburgerButton", $$HamburgerButton, { "data-astro-cid-clcmuyge": true })} ${renderComponent($$result, "MobileNav", $$MobileNav, { "menuItems": menuItems, "type": headerType, "data-astro-cid-clcmuyge": true }, { "slot-panel": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["slot-panel"])}` })} </header> </div> `;
}, "Q:/mybonzo/luc-de-zen-on/node_modules/@sofidevo/astro-dynamic-header/src/Header.astro", void 0);

const $$Astro = createAstro("https://mybonzo.com");
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
  const menuItems = [
    { link: "/", text: "Strona główna" },
    {
      link: "/#ai-workers",
      text: "AI Workers",
      submenu: [
        { link: "/ai-workers-manager", text: "Manager" },
        { link: "/agents", text: "Agenci" },
        { link: "/agent-builder-23", text: "Builder" }
      ]
    },
    { link: "/image-generator", text: "Generator obrazów" },
    { link: "/quiz", text: "Quiz" },
    { link: "/admin/", text: "Panel" }
  ];
  const pageKey = Astro2.url.pathname;
  const $$definedVars = defineStyleVars([{ themeColor }]);
  return renderTemplate`<html lang="pl" dir="ltr" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <head><!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap-index.xml"><link rel="manifest" href="/manifest.json"><meta name="generator" content="Astro v5.13.5"><!-- SEO and Meta Tags -->${renderComponent($$result, "SEOHead", $$SEOHead, { "title": siteTitle, "description": description, "image": image, "article": article, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "author": author, "tags": tags, "canonicalURL": canonicalURL, "noindex": noindex, "data-astro-cid-slfebfn6": true })}<!-- PWA Meta Tags --><meta name="theme-color" content="#00ffff"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="MyBonzo"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- Performance: DNS Prefetch and Preconnect --><link rel="dns-prefetch" href="//fonts.googleapis.com"><link rel="dns-prefetch" href="//fonts.gstatic.com"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Performance: Critical CSS inline --><!-- Font preloads - Non-blocking --><link rel="preload" href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">${maybeRenderHead()}<noscript><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript><!-- Primary Meta Tags --><title>${siteTitle}</title><meta name="title"${addAttribute(siteTitle, "content")}><meta name="description"${addAttribute(description, "content")}><!-- CSS Variables for Theme -->${renderHead()}</head> <body data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <!-- Accessibility Tools --> ${renderComponent($$result, "AccessibilityTools", $$AccessibilityTools, { "data-astro-cid-slfebfn6": true })} <!-- Background Animation - Lazy loaded --> <div class="bg-animation bg-animation-container"${addAttribute(`${"position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6> <div class="loading-spinner"${addAttribute(`${"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"}; ${$$definedVars}`, "style")} data-astro-cid-slfebfn6></div> </div> <div class="compact-header" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Header", $$Header, { "headerType": "floating", "logoSrc": "/favicon.svg", "logoAlt": siteTitle, "logoWidth": "24px", "homeUrl": "/", "menuItems": menuItems, "backgroundColor": "#0d0d0dcc", "backdropBlur": "blur(16px)", "zIndex": 20, "data-astro-cid-slfebfn6": true })} </div> <!-- Page content with transition wrapper --> ${renderComponent($$result, "PageTransition", PageTransition, { "key": pageKey, "data-astro-cid-slfebfn6": true }, { "default": async ($$result2) => renderTemplate` <main id="main-content" class="min-h-svh cyberpunk-grid" tabindex="-1" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderSlot($$result2, $$slots["default"])} </main> ` })} <!-- Global AI Widgets - Available on all pages --> <div class="fixed bottom-4 right-4 z-50 space-y-2" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <!-- Quick Access Widgets Panel --> <div id="quick-widgets-panel" class="hidden" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div class="bg-black/80 backdrop-blur-sm border border-edge rounded-lg p-4 w-80 max-h-96 overflow-y-auto space-y-3" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <!-- BigQuery Widget --> <div class="widget-container" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "BigQueryWidget", BigQueryWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BigQueryWidget.svelte", "client:component-export": "default", "data-astro-cid-slfebfn6": true })} </div> <!-- Kaggle Widget --> <div class="widget-container" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "KaggleWidget", KaggleWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/KaggleWidget.svelte", "client:component-export": "default", "data-astro-cid-slfebfn6": true })} </div> <!-- Tavily Search Widget --> <div class="widget-container" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "TavilyWidget", TavilyWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/TavilyWidget.svelte", "client:component-export": "default", "data-astro-cid-slfebfn6": true })} </div> <!-- Workers Status --> <div class="widget-container" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "WorkersStatusDashboard", WorkersStatusDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/WorkersStatusDashboard.svelte", "client:component-export": "default", "data-astro-cid-slfebfn6": true })} </div> </div> </div> <!-- Toggle Button for Widgets --> <button id="toggle-widgets" onclick="toggleQuickWidgets()" class="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110" title="Pokaż/Ukryj Widgety AI" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></path> </svg> </button> </div> <!-- Floating MCP Buttons --> <div class="mcp-floating-buttons" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <button class="mcp-btn" data-mcp="duckdb" onclick="openMCPModal('duckdb')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <svg class="mcp-icon w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></path> </svg>
DuckDB
</button> <button class="mcp-btn" data-mcp="paypal" onclick="openMCPModal('paypal')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <svg class="mcp-icon w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></path> </svg>
PayPal
</button> <button class="mcp-btn" data-mcp="huggingface" onclick="openMCPModal('huggingface')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <svg class="mcp-icon w-5 h-5" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></path> </svg>
HuggingFace
</button> <button class="mcp-btn" data-mcp="memory" onclick="openMCPModal('memory')" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:hard-drive", "class": "mcp-icon", "data-astro-cid-slfebfn6": true })}
Memory
</button> </div> <!-- Global Right Floating Panel - Available on all pages --> <div class="global-right-panel-fixed" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div class="floating-widget-container" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <button onclick="toggleGlobalMusicPlayer()" class="global-right-btn" id="globalMusicPlayerBtn" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:music", "data-astro-cid-slfebfn6": true })} MUSIC PLAYER
</button> <div id="globalMusicPlayerWidget" class="global-floating-widget hidden" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "BackgroundMusicPlayerFixed", BackgroundMusicPlayerFixed, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BackgroundMusicPlayerFixed.svelte", "client:component-export": "default", "data-astro-cid-slfebfn6": true })} </div> </div> <div class="floating-widget-container" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <button onclick="toggleGlobalPolaczekAssistant()" class="global-right-btn" id="globalPolaczekBtn" title="AI Assistant do wyjaśniania funkcji na stronie" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:bot", "data-astro-cid-slfebfn6": true })} AI ASSISTANT
</button> <div id="globalPolaczekWidget" class="global-floating-widget hidden" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AiHelpAssistant.svelte", "client:component-export": "default", "data-astro-cid-slfebfn6": true })} </div> </div> <button onclick="openGlobalMainChat()" class="global-right-btn" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:message-circle", "data-astro-cid-slfebfn6": true })} MAIN CHAT
</button> <button onclick="openGlobalRefresh()" class="global-right-btn" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:refresh-cw", "data-astro-cid-slfebfn6": true })} REFRESH
</button> <button onclick="openGlobalFolder()" class="global-right-btn" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:folder", "data-astro-cid-slfebfn6": true })} FOLDER
</button> <button onclick="openGlobalClose()" class="global-right-btn" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:x", "data-astro-cid-slfebfn6": true })} CLOSE
</button> </div> <!-- MCP Modal --> <div id="mcpModal" class="mcp-modal" onclick="closeMCPModal()" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div class="mcp-modal-content" onclick="event.stopPropagation()" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div class="mcp-modal-header" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <h3 id="mcpModalTitle" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}>MCP Service</h3> <button class="mcp-close-btn" onclick="closeMCPModal()" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}>×</button> </div> <div class="mcp-modal-body" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <div id="mcpModalDescription" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></div> <div class="mcp-code-section" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}> <h4 data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}>🔧 Przykład użycia:</h4> <pre id="mcpModalCode" data-astro-cid-slfebfn6${addAttribute($$definedVars, "style")}></pre> </div> </div> </div> </div>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/layouts/MyBonzoLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/MyBonzoLayout.astro", void 0);

export { $$MyBonzoLayout as $ };
