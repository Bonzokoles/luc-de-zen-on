globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, d as renderHead, b as renderScript, a as renderTemplate } from '../chunks/astro/server_BDhFni3J.mjs';
/* empty css                                             */
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$PaymentSimulator = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pl" data-astro-cid-auwpx3mw> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Payment Simulator - AI Workers Platform</title>${renderHead()}</head> <body data-astro-cid-auwpx3mw> <div class="payment-container" data-astro-cid-auwpx3mw> <div class="payment-header" data-astro-cid-auwpx3mw> <h1 class="payment-title" data-astro-cid-auwpx3mw>đź’ł Payment Simulator</h1> <p class="payment-subtitle" data-astro-cid-auwpx3mw>Development Mode - Symulacja pĹ‚atnoĹ›ci</p> </div> <div id="paymentForm" data-astro-cid-auwpx3mw> <div class="payment-details" id="paymentDetails" data-astro-cid-auwpx3mw> <!-- Payment details will be inserted here --> </div> <div class="payment-actions" data-astro-cid-auwpx3mw> <button class="btn btn-success" onclick="processPayment(true)" data-astro-cid-auwpx3mw>
âś… Symuluj Sukces
</button> <button class="btn btn-cancel" onclick="processPayment(false)" data-astro-cid-auwpx3mw>
âťŚ Symuluj BĹ‚Ä…d
</button> </div> </div> <div class="processing" id="processing" data-astro-cid-auwpx3mw> <div class="spinner" data-astro-cid-auwpx3mw></div> <p data-astro-cid-auwpx3mw>Przetwarzanie pĹ‚atnoĹ›ci...</p> </div> </div> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/payment-simulator.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/payment-simulator.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/payment-simulator.astro";
const $$url = "/payment-simulator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PaymentSimulator,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
