globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, m as maybeRenderHead, g as addAttribute, an as renderSlot, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$BackroomInterface } from '../chunks/BackroomInterface_CUKi2fNT.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Astro = createAstro("https://mybonzo.com");
const $$HubCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HubCard;
  const { title, description = "", href = "#" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a class="block border border-cyber-border bg-cyber-surface p-6 hover:brightness-110 transition-shadow"${addAttribute(href, "href")}> <div class="flex items-start gap-4"> <div class="w-12 h-12 rounded flex items-center justify-center bg-cyber-dark/40"> <!-- icon slot placeholder --> ${renderSlot($$result, $$slots["icon"], renderTemplate`âš™ď¸Ź`)} </div> <div> <h3 class="uppercase tracking-widest text-cyber-blue font-semibold"> ${title} </h3> ${description && renderTemplate`<p class="text-cyber-text-dim mt-2">${description}</p>`} </div> </div> <div class="mt-6 flex gap-3"> <button class="px-4 py-2 border border-cyber-border text-cyber-blue">OTWĂ“RZ</button> <button class="px-4 py-2 border border-cyber-border text-cyber-text-dim">WIÄCEJ</button> </div> </a>`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/HubCard.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BackroomInterface, { "siteTitle": "AI WORKERS HUB" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto py-12"> <h1 class="text-3xl font-bold text-cyber-blue text-center">AI WORKERS</h1> <p class="text-center text-cyber-text-dim mt-4">
Zaawansowane narzÄ™dzia AI dostÄ™pne na platformie
</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"> ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Generator Obraz\u0102\u0142w", "description": "Tw\u0102\u0142rz obrazy z tekstu.", "href": "/hub/generator" }, { "icon": ($$result3) => renderTemplate`<span>đź–Ľď¸Ź</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "AI Chatbot", "description": "Inteligentny asystent do rozm\u0102\u0142w.", "href": "/hub/chatbot" }, { "icon": ($$result3) => renderTemplate`<span>đź’¬</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "BigQuery Analytics", "description": "Analizuj dane i wykonuj zapytania SQL.", "href": "/hub/bigquery" }, { "icon": ($$result3) => renderTemplate`<span>đź“Š</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Kaggle Datasets", "description": "Przeszukuj zbiory danych i konkursy.", "href": "/hub/kaggle" }, { "icon": ($$result3) => renderTemplate`<span>đź“</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Tavily AI Search", "description": "Zaawansowane wyszukiwanie internetowe.", "href": "/hub/tavily" }, { "icon": ($$result3) => renderTemplate`<span>đź”Ž</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Status Worker\u0102\u0142w", "description": "Sprawd\u0139\u015F status i dost\xC4\u2122pno\u0139\u203A\xC4\u2021 API.", "href": "/hub/status" }, { "icon": ($$result3) => renderTemplate`<span>đź›°ď¸Ź</span>` })} </div> <h2 class="text-2xl font-bold text-cyber-blue mt-12">Dodatkowe funkcje</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"> ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Funkcja 1", "description": "Opis funkcji 1", "href": "/hub/functions/1" }, { "icon": ($$result3) => renderTemplate`<span>đź”§</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Funkcja 2", "description": "Opis funkcji 2", "href": "/hub/functions/2" }, { "icon": ($$result3) => renderTemplate`<span>âš™ď¸Ź</span>` })} ${renderComponent($$result2, "HubCard", $$HubCard, { "title": "Funkcja 3", "description": "Opis funkcji 3", "href": "/hub/functions/3" }, { "icon": ($$result3) => renderTemplate`<span>đź§°</span>` })} </div> <div class="mt-12 text-center"> <a class="text-cyber-blue underline" href="/dashboard">OtwĂłrz Dashboard (aktualna strona)</a> </div> </section> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/hub/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/hub/index.astro";
const $$url = "/hub";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
