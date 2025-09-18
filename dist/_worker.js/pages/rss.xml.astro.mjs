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
import { J as getRssResponse } from '../chunks/vendor_CYa9XZjz.mjs';
export { d as renderers } from '../chunks/vendor_CYa9XZjz.mjs';
import { g as getCollection } from '../chunks/_astro_content_DUb_tGDh.mjs';
import { S as SiteDescription, s as siteTitle } from '../chunks/site_efiYLszo.mjs';

async function GET(context) {
  const posts = await getCollection("posts");
  return getRssResponse({
    title: siteTitle,
    description: SiteDescription,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.id}/`,
    })),
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
