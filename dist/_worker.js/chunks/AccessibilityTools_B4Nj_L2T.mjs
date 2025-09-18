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
import { e as createAstro, c as createComponent, a as renderTemplate, u as unescapeHTML, h as addAttribute, m as maybeRenderHead, b as renderScript } from './vendor_CYa9XZjz.mjs';
/* empty css                                     */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b, _c;
const $$Astro$1 = createAstro("https://www.mybonzo.com");
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
  const canonicalUrl = canonicalURL || (Astro2.site ? new URL(Astro2.url.pathname, Astro2.site) : Astro2.url.pathname);
  const ogImage = image && Astro2.site ? new URL(image, Astro2.site) : image;
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
  return renderTemplate(_c || (_c = __template(['<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><!-- Primary Meta Tags --><title>", '</title><meta name="title"', '><meta name="description"', '><meta name="author"', '><meta name="robots"', '><link rel="canonical"', '><!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:alt"', '><meta property="og:site_name" content="MyBonzo"><meta property="og:locale" content="pl_PL">', "", "", "", '<!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><meta property="twitter:image:alt"', '><!-- Additional SEO --><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#0f172a"><meta name="keywords"', '><!-- Structured Data --><script type="application/ld+json">', "<\/script><!-- Breadcrumb Schema -->", "<!-- Organization Schema -->", ""])), addAttribute(Astro2.generator, "content"), finalTitle, addAttribute(finalTitle, "content"), addAttribute(finalDescription, "content"), addAttribute(author, "content"), addAttribute(noindex ? "noindex, nofollow" : "index, follow", "content"), addAttribute(canonicalUrl?.toString() || canonicalUrl, "href"), addAttribute(article ? "article" : "website", "content"), addAttribute(canonicalUrl?.toString() || canonicalUrl, "content"), addAttribute(finalTitle, "content"), addAttribute(finalDescription, "content"), addAttribute(ogImage?.toString() || ogImage, "content"), addAttribute(finalTitle, "content"), article && finalPublishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(finalPublishedTime, "content")}>`, article && finalModifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(finalModifiedTime, "content")}>`, article && author && renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`, finalTags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`), addAttribute(canonicalUrl?.toString() || canonicalUrl, "content"), addAttribute(finalTitle, "content"), addAttribute(finalDescription, "content"), addAttribute(ogImage?.toString() || ogImage, "content"), addAttribute(finalTitle, "content"), addAttribute(finalTags.join(", "), "content"), unescapeHTML(JSON.stringify({
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

const $$Astro = createAstro("https://www.mybonzo.com");
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

export { $$SEOHead as $, $$AccessibilityTools as a };
