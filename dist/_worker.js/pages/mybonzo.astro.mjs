globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, d as renderHead, a as renderTemplate } from '../chunks/astro/server_HpSis98d.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$Mybonzo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MyBonzo AI Assistant</title><meta name="description" content="Twój inteligentny asystent AI">${renderHead()}</head> <body class="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"> <main class="min-h-screen flex items-center justify-center p-4"> <div class="w-full max-w-4xl"> <h1 class="text-4xl font-bold text-cyan-300 mb-8 text-center">
🤖 MyBonzo AI Assistant
</h1> <div class="text-center text-cyan-300"> <p>MyBonzo Chat Component - Coming Soon</p> <p class="text-sm mt-2">Component MyBonzoChat.svelte needs to be created</p> </div> </div> </main> </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/mybonzo.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/mybonzo.astro";
const $$url = "/mybonzo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Mybonzo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
