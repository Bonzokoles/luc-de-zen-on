globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { e as createAstro, c as createComponent, g as addAttribute, d as renderHead, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_BDhFni3J.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Astro = createAstro("https://mybonzo.com");
const $$VoiceAvatarNew = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$VoiceAvatarNew;
  return renderTemplate`<html lang="pl"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Voice AI Avatar - New Design</title>${renderHead()}</head> <body class="bg-white overflow-x-hidden"> <!-- Hero Variant with Avatar on Left --> <main class="min-h-screen relative"> ${renderComponent($$result, "VoiceAvatarComponent", VoiceAvatarComponent, { "variant": "hero", "avatarSrc": "/avatar.jpg", "avatarType": "image", "client:load": true, "client:component-hydration": "load" })} </main> <!-- Demo sections for other variants --> <section class="bg-gray-100 p-8"> <div class="max-w-4xl mx-auto"> <h2 class="text-2xl font-bold mb-8 text-center">Other Variants</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <!-- Compact Variant --> <div class="bg-white p-6 shadow-lg"> <h3 class="text-lg font-semibold mb-4">Compact Version</h3> ${renderComponent($$result, "VoiceAvatarComponent", VoiceAvatarComponent, { "variant": "compact", "avatarSrc": "/avatar.jpg", "avatarType": "image", "client:load": true, "client:component-hydration": "load" })} </div> <!-- Instructions --> <div class="bg-white p-6 shadow-lg"> <h3 class="text-lg font-semibold mb-4">Design Features</h3> <ul class="space-y-2 text-sm text-gray-700"> <li>â€˘ <strong>Avatar na lewej stronie</strong> ekranu</li> <li>â€˘ <strong>OkrÄ…gĹ‚y avatar</strong> z szarÄ… ramkÄ…</li> <li>â€˘ <strong>75% przezroczystoĹ›Ä‡</strong> avatara</li> <li>â€˘ <strong>Przycisk mikrofonu</strong> pod avatarem</li> <li>â€˘ <strong>Bez czarnego tĹ‚a</strong> - czysty design</li> </ul> </div> </div> </div> </section> <!-- Floating Variant - Always visible --> ${renderComponent($$result, "VoiceAvatarComponent", VoiceAvatarComponent, { "variant": "floating", "avatarSrc": "/avatar.jpg", "avatarType": "image", "client:load": true, "client:component-hydration": "load" })} </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/voice-avatar-new.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/voice-avatar-new.astro";
=======
/* empty css                                  */
import { d as createAstro, c as createComponent, g as addAttribute, e as renderHead, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CDFI50iS.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$VoiceAvatarNew = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$VoiceAvatarNew;
  return renderTemplate`<html lang="pl"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Voice AI Avatar - New Design</title>${renderHead()}</head> <body class="bg-white overflow-x-hidden"> <!-- Hero Variant with Avatar on Left --> <main class="min-h-screen relative"> ${renderComponent($$result, "VoiceAvatarComponent", VoiceAvatarComponent, { "variant": "hero", "avatarSrc": "/avatar.jpg", "avatarType": "image", "client:load": true, "client:component-hydration": "load" })} </main> <!-- Demo sections for other variants --> <section class="bg-gray-100 p-8"> <div class="max-w-4xl mx-auto"> <h2 class="text-2xl font-bold mb-8 text-center">Other Variants</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <!-- Compact Variant --> <div class="bg-white p-6 shadow-lg"> <h3 class="text-lg font-semibold mb-4">Compact Version</h3> ${renderComponent($$result, "VoiceAvatarComponent", VoiceAvatarComponent, { "variant": "compact", "avatarSrc": "/avatar.jpg", "avatarType": "image", "client:load": true, "client:component-hydration": "load" })} </div> <!-- Instructions --> <div class="bg-white p-6 shadow-lg"> <h3 class="text-lg font-semibold mb-4">Design Features</h3> <ul class="space-y-2 text-sm text-gray-700"> <li>• <strong>Avatar na lewej stronie</strong> ekranu</li> <li>• <strong>Okrągły avatar</strong> z szarą ramką</li> <li>• <strong>75% przezroczystość</strong> avatara</li> <li>• <strong>Przycisk mikrofonu</strong> pod avatarem</li> <li>• <strong>Bez czarnego tła</strong> - czysty design</li> </ul> </div> </div> </div> </section> <!-- Floating Variant - Always visible --> ${renderComponent($$result, "VoiceAvatarComponent", VoiceAvatarComponent, { "variant": "floating", "avatarSrc": "/avatar.jpg", "avatarType": "image", "client:load": true, "client:component-hydration": "load" })} </body></html>`;
}, "Q:/mybonzo/mybonzo-github/src/pages/voice-avatar-new.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/voice-avatar-new.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/voice-avatar-new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VoiceAvatarNew,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
