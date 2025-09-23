globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, r as renderComponent, d as renderHead, an as renderSlot, a as renderTemplate } from './astro/server_BDhFni3J.mjs';
import { c as $$Head, b as $$Header, a as $$Footer } from './Footer_CPKEGQoN.mjs';

const $$Astro = createAstro("https://mybonzo.com");
const $$BackroomInterface = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BackroomInterface;
  const { siteTitle = "", siteDescription = "" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "Head", $$Head, { "pageTitle": siteTitle, "pageDescription": siteDescription })}<!-- Import Backroom visual styles --><link rel="stylesheet" href="/src/styles/backroom-tailwind.css">${renderHead()}</head> <body class="bg-cyber-dark text-cyber-text font-sans"> ${renderComponent($$result, "Header", $$Header, { "cosmeticText": "Backroom Interface" })} <main class="min-h-svh"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/BackroomInterface.astro", void 0);

export { $$BackroomInterface as $ };
