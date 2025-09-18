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
import { e as createAstro, c as createComponent, h as addAttribute, r as renderComponent, y as $$ClientRouter, a as renderTemplate, z as twMerge, A as clsx, m as maybeRenderHead, f as renderHead, t as renderSlot } from './vendor_CYa9XZjz.mjs';
/* empty css                            */
import { s as siteTitle } from './site_efiYLszo.mjs';
import { $ as $$Section } from './Section_Clr2R2N3.mjs';

const $$Astro$4 = createAstro("https://www.mybonzo.com");
const $$Head = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Head;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  const {
    pageTitle,
    pageDescription,
    pageThumbnail = "/site-thumbnail.png"
  } = Astro2.props;
  return renderTemplate`<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap-index.xml"><link rel="alternate" type="application/rss+xml"${addAttribute(siteTitle, "title")}${addAttribute(new URL("rss.xml", Astro2.site), "href")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Font preloads --><link rel="preload" href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" as="font" type="font/woff" crossorigin><!-- Canonical URL --><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Primary Meta Tags --><title>${pageTitle}</title><meta name="title"${addAttribute(pageTitle, "content")}><meta name="description"${addAttribute(pageDescription, "content")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro2.url, "content")}><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(pageDescription, "content")}><meta property="og:image"${addAttribute(new URL(pageThumbnail, Astro2.url), "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(Astro2.url, "content")}><meta property="twitter:title"${addAttribute(pageTitle, "content")}><meta property="twitter:description"${addAttribute(pageDescription, "content")}><meta property="twitter:image"${addAttribute(new URL(pageThumbnail, Astro2.url), "content")}>${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/Head.astro", void 0);

const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

const $$Astro$3 = createAstro("https://www.mybonzo.com");
const $$Arrow = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Arrow;
  const { rotate, class: className = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(`--rotation: ${rotate}deg`, "style")}${addAttribute(cn(
    className,
    "inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]"
  ), "class")} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg>`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/Arrow.astro", void 0);

const userEmail = "LissonKarol.msa@gmail.com";
const userSocials = [{"title":"LinkedIn","link":"https://www.linkedin.com/in/linkedinHandle"},{"title":"GitHub","link":"https://www.github.com/githubUsername"}];

const userName = "KAROL LISSON";

const $$Astro$2 = createAstro("https://www.mybonzo.com");
const $$CosmeticText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CosmeticText;
  const { text, vertical = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(vertical ? "writing-mode: vertical-lr;" : "", "style")} class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]"> ${text} </span>`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/CosmeticText.astro", void 0);

const $$Astro$1 = createAstro("https://www.mybonzo.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  const { cosmeticText = "" } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "class": "flex justify-between items-center h-16 bg-primary/50 backdrop-blur-md" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mt-auto"> ${renderComponent($$result2, "CosmeticText", $$CosmeticText, { "text": cosmeticText, "vertical": true })} </div> <span class="mt-auto"> ${renderComponent($$result2, "CosmeticText", $$CosmeticText, { "text": (/* @__PURE__ */ new Date()).toLocaleDateString("en-us", { year: "numeric", month: "short" }).toUpperCase() })} </span> ` })} ${renderComponent($$result, "Section", $$Section, { "class": "flex flex-row items-center h-16 bg-primary/50 backdrop-blur-md p-2" }, { "default": ($$result2) => renderTemplate` <a class="hover:brightness-125" href="/"><h1 class="text-4xl sm:text-5xl">${userName}</h1></a>    <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col"> <a class="ml-auto hover:brightness-125 duration-200"${addAttribute(`mailto:${userEmail}`, "href")}>${userEmail}${renderComponent($$result2, "Arrow", $$Arrow, { "class": "stroke-primary-foreground", "rotate": -45 })}</a> <div class="flex flex-row-reverse flex-wrap gap-4"> ${userSocials.map((social) => renderTemplate`<a class="hover:brightness-125 duration-200"${addAttribute(social.link, "href")}> ${social.title} ${renderComponent($$result2, "Arrow", $$Arrow, { "class": "stroke-primary-foreground", "rotate": -45 })} </a>`)} </div> </div> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Section", $$Section, { "class": "flex flex-row p-2" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<a class="my-auto hover:brightness-125" href="/"><h1>${userName}</h1></a>  <div class="hidden ml-auto md:flex md:flex-col"> <div class="flex flex-row-reverse flex-wrap gap-4"> <a class="hover:brightness-125 duration-200"${addAttribute(`mailto:${userEmail}`, "href")}>${userEmail}${renderComponent($$result2, "Arrow", $$Arrow, { "class": "stroke-primary-foreground", "rotate": -45 })}</a> ${userSocials.map((social) => renderTemplate`<a class="hover:brightness-125 duration-200"${addAttribute(social.link, "href")}> ${social.title}${renderComponent($$result2, "Arrow", $$Arrow, { "class": "stroke-primary-foreground", "rotate": -45 })} </a>`)} </div> </div> <a class="ml-auto px-2 text-primary-foreground hover:cursor-pointer hover:brightness-125 md:hidden"> ${userEmail} ${renderComponent($$result2, "Arrow", $$Arrow, { "class": "stroke-primary-foreground", "rotate": -45 })} </a> ` })} <!-- CREDITS --> ${renderComponent($$result, "Section", $$Section, { "class": "flex flex-row justify-center gap-8 m-auto py-16 text-center" }, { "default": ($$result2) => renderTemplate` <a class="hover:brightness-125 duration-200" target="_blank" rel="noopener noreferrer" href="#">SYSTEM AGENTS ${renderComponent($$result2, "Arrow", $$Arrow, { "class": "stroke-primary-foreground", "rotate": -45 })}</a> <div class="group w-24 p-1 border border-primary-foreground rounded-interactive text-primary-foreground text-xs font-black text-nowrap opacity-60"> <span class="group-hover:hidden">100% HANDMADE</span> <span class="hidden group-hover:inline">0% AI</span> </div> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/Footer.astro", void 0);

const $$Astro = createAstro("https://www.mybonzo.com");
const $$BackroomInterface = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BackroomInterface;
  const { siteTitle = "", siteDescription = "" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "Head", $$Head, { "pageTitle": siteTitle, "pageDescription": siteDescription })}<!-- Import Backroom visual styles --><link rel="stylesheet" href="/src/styles/backroom-tailwind.css">${renderHead()}</head> <body class="bg-cyber-dark text-cyber-text font-sans"> ${renderComponent($$result, "Header", $$Header, { "cosmeticText": "Backroom Interface" })} <main class="min-h-svh"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/BackroomInterface.astro", void 0);

export { $$BackroomInterface as $ };
