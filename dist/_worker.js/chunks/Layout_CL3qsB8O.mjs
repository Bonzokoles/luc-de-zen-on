globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, a as renderTemplate, r as renderComponent, an as renderSlot, d as renderHead } from './astro/server_BDhFni3J.mjs';
import { a as $$Footer, b as $$Header, c as $$Head } from './Footer_CPKEGQoN.mjs';

if (typeof MessageChannel === "undefined") {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      const channel = {
        port1: null,
        port2: null
      };
      this.port1 = {
        onmessage: null,
        postMessage: (data) => {
          if (channel.port2?.onmessage) {
            setTimeout(() => channel.port2.onmessage({ data }), 0);
          }
        },
        close: () => {
        },
        start: () => {
        }
      };
      this.port2 = {
        onmessage: null,
        postMessage: (data) => {
          if (channel.port1?.onmessage) {
            setTimeout(() => channel.port1.onmessage({ data }), 0);
          }
        },
        close: () => {
        },
        start: () => {
        }
      };
      channel.port1 = this.port1;
      channel.port2 = this.port2;
    }
  };
}
if (typeof requestIdleCallback === "undefined") {
  globalThis.requestIdleCallback = (callback) => {
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
  };
}
if (typeof cancelIdleCallback === "undefined") {
  globalThis.cancelIdleCallback = (id) => {
    clearTimeout(id);
  };
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://mybonzo.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { siteTitle, siteDescription, headerCosmeticText } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="bg-primary"> <head>', "", '</head> <body class="bg-cyber-dark text-cyber-text font-sans"> <main class="min-h-svh"> ', " ", " ", ' </main> <!-- Frontend API Fix for Music and POLACZEK APIs --> <script src="/frontend-api-fix.js"><\/script> </body> </html>'])), renderComponent($$result, "Head", $$Head, { "pageTitle": siteTitle, "pageDescription": siteDescription }), renderHead(), renderComponent($$result, "Header", $$Header, { "cosmeticText": headerCosmeticText }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
