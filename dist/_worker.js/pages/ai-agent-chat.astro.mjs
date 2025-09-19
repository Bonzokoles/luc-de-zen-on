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
import { c as createComponent, a as renderTemplate } from '../chunks/vendor_BHZTJLV0.mjs';
export { d as renderers } from '../chunks/vendor_BHZTJLV0.mjs';

const $$AiAgentChat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/ai-agent-chat.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/ai-agent-chat.astro";
const $$url = "/ai-agent-chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$AiAgentChat,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
