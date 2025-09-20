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
/* empty css                                  */
import { c as createComponent, e as renderHead, b as renderScript, a as renderTemplate } from '../chunks/astro/server_xZvTY01m.mjs';
/* empty css                                             */
export { r as renderers } from '../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const $$PaymentSimulator = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pl" data-astro-cid-auwpx3mw> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Payment Simulator - AI Workers Platform</title>${renderHead()}</head> <body data-astro-cid-auwpx3mw> <div class="payment-container" data-astro-cid-auwpx3mw> <div class="payment-header" data-astro-cid-auwpx3mw> <h1 class="payment-title" data-astro-cid-auwpx3mw>💳 Payment Simulator</h1> <p class="payment-subtitle" data-astro-cid-auwpx3mw>Development Mode - Symulacja płatności</p> </div> <div id="paymentForm" data-astro-cid-auwpx3mw> <div class="payment-details" id="paymentDetails" data-astro-cid-auwpx3mw> <!-- Payment details will be inserted here --> </div> <div class="payment-actions" data-astro-cid-auwpx3mw> <button class="btn btn-success" onclick="processPayment(true)" data-astro-cid-auwpx3mw>
✅ Symuluj Sukces
</button> <button class="btn btn-cancel" onclick="processPayment(false)" data-astro-cid-auwpx3mw>
❌ Symuluj Błąd
</button> </div> </div> <div class="processing" id="processing" data-astro-cid-auwpx3mw> <div class="spinner" data-astro-cid-auwpx3mw></div> <p data-astro-cid-auwpx3mw>Przetwarzanie płatności...</p> </div> </div> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/pages/payment-simulator.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
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
