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
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/vendor_DCrrhcp4.mjs';
export { d as renderers } from '../chunks/vendor_DCrrhcp4.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_BsrSeDeM.mjs';
/* empty css                                               */

function AnimationsShowcase($$payload, $$props) {
	$$payload.component(($$payload) => {

		$$payload.push(`<div class="animations-showcase svelte-1bsui5e">`);

		{
			$$payload.push('<!--[!-->');
		}

		$$payload.push(`<!--]--></div>`);
	});
}

const $$AnimationsShowcase = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Svelte Animations Showcase - Demonstracja Animacji", "data-astro-cid-apaj6hqy": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="animations-page" data-astro-cid-apaj6hqy> ${renderComponent($$result2, "SvelteAnimationsShowcase", AnimationsShowcase, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AnimationsShowcase.svelte", "client:component-export": "default", "data-astro-cid-apaj6hqy": true })} </div> ` })} `;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/animations-showcase.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/animations-showcase.astro";
const $$url = "/animations-showcase";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AnimationsShowcase,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
