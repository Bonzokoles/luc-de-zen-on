globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, g as addAttribute, r as renderComponent, b as renderScript, d as renderHead, an as renderSlot, a as renderTemplate } from './astro/server_BDhFni3J.mjs';
import { $ as $$SEOHead, a as $$AccessibilityTools, B as BackgroundMusicPlayerFixed, A as AiHelpAssistant } from './BackgroundMusicPlayerFixed_Ber633Wa.mjs';
/* empty css                           */

const $$Astro = createAstro("https://mybonzo.com");
const $$UniversalPageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$UniversalPageLayout;
  const Icon = ({ name }) => `<span class="icon-${name.replace("lucide:", "")}" aria-hidden="true"></span>`;
  const {
    siteTitle,
    pageTitle,
    title,
    description = "MyBonzo Admin Panel - Zarządzanie systemem AI",
    pageDescription,
    pageQuote = "Zarządzanie to sztuka, kontrola to nauka.",
    pageAuthor = "MyBonzo Team",
    showRandomQuote = false,
    themeColor = "190",
    image,
    article,
    publishedTime,
    modifiedTime,
    author,
    tags,
    canonicalURL,
    noindex = false
  } = Astro2.props;
  const finalTitle = siteTitle || title || pageTitle || "MyBonzo Platform";
  const finalDescription = pageDescription || description;
  return renderTemplate`<html lang="pl" dir="ltr"${addAttribute(`--themeColor: ${themeColor};`, "style")} data-astro-cid-32tqkvsz> <head><!-- SEO and Meta Tags -->${renderComponent($$result, "SEOHead", $$SEOHead, { "title": finalTitle, "description": finalDescription, "image": image, "article": article, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "author": author, "tags": tags, "canonicalURL": canonicalURL, "noindex": noindex, "data-astro-cid-32tqkvsz": true })}<!-- Import głównych stylów MyBonzo --><link rel="stylesheet" href="/src/styles/global.css"><!-- MyBonzo Interactive JavaScript -->${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/layouts/UniversalPageLayout.astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body data-astro-cid-32tqkvsz> ${renderComponent($$result, "AccessibilityTools", $$AccessibilityTools, { "data-astro-cid-32tqkvsz": true })} <div class="main-container" data-astro-cid-32tqkvsz> <!-- Page Header --> <header class="page-header" data-astro-cid-32tqkvsz> <h1 class="page-title" data-astro-cid-32tqkvsz>${pageTitle}</h1> ${pageDescription && renderTemplate`<p class="page-description" data-astro-cid-32tqkvsz>${pageDescription}</p>`} ${showRandomQuote && pageQuote && renderTemplate`<div data-astro-cid-32tqkvsz> <p class="page-quote" data-astro-cid-32tqkvsz>"${pageQuote}"</p> ${pageAuthor && renderTemplate`<p class="page-author" data-astro-cid-32tqkvsz>— ${pageAuthor}</p>`} </div>`} </header> <!-- Main Content --> <main class="content-wrapper" data-astro-cid-32tqkvsz> ${renderSlot($$result, $$slots["default"])} </main> </div> <!-- Global Right Floating Panel - Available on all pages using UniversalPageLayout --> <div class="universal-right-panel-fixed" data-astro-cid-32tqkvsz> <div class="floating-widget-container" data-astro-cid-32tqkvsz> <button onclick="toggleUniversalMusicPlayer()" class="universal-right-btn" id="universalMusicPlayerBtn" data-astro-cid-32tqkvsz> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:music", "data-astro-cid-32tqkvsz": true })} MUSIC PLAYER
</button> <div id="universalMusicPlayerWidget" class="universal-floating-widget hidden" data-astro-cid-32tqkvsz> ${renderComponent($$result, "BackgroundMusicPlayerFixed", BackgroundMusicPlayerFixed, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BackgroundMusicPlayerFixed.svelte", "client:component-export": "default", "data-astro-cid-32tqkvsz": true })} </div> </div> <div class="floating-widget-container" data-astro-cid-32tqkvsz> <button onclick="toggleUniversalPolaczekAssistant()" class="universal-right-btn" id="universalPolaczekBtn" title="AI Assistant do wyjaśniania funkcji na stronie" data-astro-cid-32tqkvsz> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:bot", "data-astro-cid-32tqkvsz": true })} AI ASSISTANT
</button> <div id="universalPolaczekWidget" class="universal-floating-widget hidden" data-astro-cid-32tqkvsz> ${renderComponent($$result, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AiHelpAssistant.svelte", "client:component-export": "default", "data-astro-cid-32tqkvsz": true })} </div> </div> <button onclick="openUniversalMainChat()" class="universal-right-btn" data-astro-cid-32tqkvsz> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:message-circle", "data-astro-cid-32tqkvsz": true })} MAIN CHAT
</button> <button onclick="openUniversalRefresh()" class="universal-right-btn" data-astro-cid-32tqkvsz> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:refresh-cw", "data-astro-cid-32tqkvsz": true })} REFRESH
</button> <button onclick="openUniversalFolder()" class="universal-right-btn" data-astro-cid-32tqkvsz> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:folder", "data-astro-cid-32tqkvsz": true })} FOLDER
</button> <button onclick="openUniversalClose()" class="universal-right-btn" data-astro-cid-32tqkvsz> ${renderComponent($$result, "Icon", Icon, { "name": "lucide:x", "data-astro-cid-32tqkvsz": true })} CLOSE
</button> </div> <!-- Modal container for floating buttons --> <div id="main-modal" style="display: none;" data-astro-cid-32tqkvsz></div> <!-- Footer Navigation --> <footer style="text-align: center; padding: 30px 0; margin-top: 50px; border-top: 1px solid var(--border-color);" data-astro-cid-32tqkvsz> <div style="margin-bottom: 15px;" data-astro-cid-32tqkvsz> <a href="/admin" style="margin: 0 15px;" data-astro-cid-32tqkvsz>🏠 Admin Home</a> <a href="/" style="margin: 0 15px;" data-astro-cid-32tqkvsz>🌐 Main Site</a> <a href="/admin/test" style="margin: 0 15px;" data-astro-cid-32tqkvsz>🧪 Test Page</a> </div> <p style="color: var(--text-secondary); font-size: 0.9rem;" data-astro-cid-32tqkvsz>
MyBonzo Admin Panel © 2025
</p> </footer> <!-- Universal Floating Panels CSS and JavaScript -->  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/layouts/UniversalPageLayout.astro?astro&type=script&index=1&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/UniversalPageLayout.astro", void 0);

export { $$UniversalPageLayout as $ };
