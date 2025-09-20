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
import { e as createAstro, c as createComponent, h as addAttribute, r as renderComponent, b as renderScript, f as renderHead, q as renderSlot, a as renderTemplate, m as maybeRenderHead } from './vendor_DlPT8CWO.mjs';
import { $ as $$SEOHead, a as $$AccessibilityTools } from './AccessibilityTools_JER4g_7l.mjs';
/* empty css                           */

const $$Astro$2 = createAstro("https://www.mybonzo.com");
const $$UniversalPageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$UniversalPageLayout;
  const {
    pageTitle,
    pageDescription = "MyBonzo Admin Panel - Zarządzanie systemem AI",
    pageQuote = "Zarządzanie to sztuka, kontrola to nauka.",
    pageAuthor = "MyBonzo Team",
    showRandomQuote = false,
    themeColor = "190",
    noindex = false
  } = Astro2.props;
  return renderTemplate`<html lang="pl" dir="ltr"${addAttribute(`--themeColor: ${themeColor};`, "style")} data-astro-cid-32tqkvsz> <head>${renderComponent($$result, "SEOHead", $$SEOHead, { "siteTitle": pageTitle, "description": pageDescription, "themeColor": themeColor, "noindex": noindex, "data-astro-cid-32tqkvsz": true })}<!-- Import głównych stylów MyBonzo --><link rel="stylesheet" href="/src/styles/global.css"><!-- MyBonzo Interactive JavaScript -->${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/layouts/UniversalPageLayout.astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body data-astro-cid-32tqkvsz> ${renderComponent($$result, "AccessibilityTools", $$AccessibilityTools, { "data-astro-cid-32tqkvsz": true })} <div class="main-container" data-astro-cid-32tqkvsz> <!-- Page Header --> <header class="page-header" data-astro-cid-32tqkvsz> <h1 class="page-title" data-astro-cid-32tqkvsz>${pageTitle}</h1> ${pageDescription && renderTemplate`<p class="page-description" data-astro-cid-32tqkvsz>${pageDescription}</p>`} ${showRandomQuote && pageQuote && renderTemplate`<div data-astro-cid-32tqkvsz> <p class="page-quote" data-astro-cid-32tqkvsz>"${pageQuote}"</p> ${pageAuthor && renderTemplate`<p class="page-author" data-astro-cid-32tqkvsz>— ${pageAuthor}</p>`} </div>`} </header> <!-- Main Content --> <main class="content-wrapper" data-astro-cid-32tqkvsz> ${renderSlot($$result, $$slots["default"])} </main> </div> <!-- Footer Navigation --> <footer style="text-align: center; padding: 30px 0; margin-top: 50px; border-top: 1px solid var(--border-color);" data-astro-cid-32tqkvsz> <div style="margin-bottom: 15px;" data-astro-cid-32tqkvsz> <a href="/admin" style="margin: 0 15px;" data-astro-cid-32tqkvsz>🏠 Admin Home</a> <a href="/" style="margin: 0 15px;" data-astro-cid-32tqkvsz>🌐 Main Site</a> <a href="/admin/test" style="margin: 0 15px;" data-astro-cid-32tqkvsz>🧪 Test Page</a> </div> <p style="color: var(--text-secondary); font-size: 0.9rem;" data-astro-cid-32tqkvsz>
MyBonzo Admin Panel © 2025
</p> </footer> </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/UniversalPageLayout.astro", void 0);

const $$Astro$1 = createAstro("https://www.mybonzo.com");
const $$GlassPanel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$GlassPanel;
  const {
    title,
    variant = "default",
    padding = "md",
    className = ""
  } = Astro2.props;
  const variantClasses = {
    default: "glass-panel-default",
    highlight: "glass-panel-highlight",
    warning: "glass-panel-warning",
    success: "glass-panel-success"
  };
  const paddingClasses = {
    sm: "glass-panel-sm",
    md: "glass-panel-md",
    lg: "glass-panel-lg"
  };
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`glass-panel ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`, "class")} data-astro-cid-5cyrmoy2> ${title && renderTemplate`<div class="glass-panel-header" data-astro-cid-5cyrmoy2> <h3 class="glass-panel-title" data-astro-cid-5cyrmoy2>${title}</h3> </div>`} <div class="glass-panel-content" data-astro-cid-5cyrmoy2> ${renderSlot($$result, $$slots["default"])} </div> </div> `;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/components/GlassPanel.astro", void 0);

const $$Astro = createAstro("https://www.mybonzo.com");
const $$CyberpunkButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CyberpunkButton;
  const {
    text,
    href,
    type = "button",
    variant = "primary",
    size = "md",
    icon,
    disabled = false,
    className = "",
    onclick
  } = Astro2.props;
  const baseClasses = "cyberpunk-btn";
  const variantClasses = {
    primary: "cyberpunk-btn-primary",
    secondary: "cyberpunk-btn-secondary",
    danger: "cyberpunk-btn-danger",
    success: "cyberpunk-btn-success",
    outline: "cyberpunk-btn-outline"
  };
  const sizeClasses = {
    sm: "cyberpunk-btn-sm",
    md: "cyberpunk-btn-md",
    lg: "cyberpunk-btn-lg"
  };
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  return renderTemplate`${href ? renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(buttonClasses, "class")} data-astro-cid-6ee5p5qg>${icon && renderTemplate`<span class="cyberpunk-btn-icon" data-astro-cid-6ee5p5qg>${icon}</span>`}<span data-astro-cid-6ee5p5qg>${text}</span></a>` : renderTemplate`<button${addAttribute(type, "type")}${addAttribute(buttonClasses, "class")}${addAttribute(disabled, "disabled")}${addAttribute(onclick, "onclick")} data-astro-cid-6ee5p5qg>${icon && renderTemplate`<span class="cyberpunk-btn-icon" data-astro-cid-6ee5p5qg>${icon}</span>`}<span data-astro-cid-6ee5p5qg>${text}</span></button>`}`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/components/CyberpunkButton.astro", void 0);

export { $$UniversalPageLayout as $, $$GlassPanel as a, $$CyberpunkButton as b };
