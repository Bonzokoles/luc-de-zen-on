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
import { e as createAstro, c as createComponent, G as renderEntry, r as renderComponent, a as renderTemplate } from '../../chunks/vendor_CYa9XZjz.mjs';
export { d as renderers } from '../../chunks/vendor_CYa9XZjz.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DLExyJGc.mjs';
import { $ as $$Section } from '../../chunks/Section_Clr2R2N3.mjs';
import { g as getCollection } from '../../chunks/_astro_content_DUb_tGDh.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const post = Astro2.props;
  const { Content } = await renderEntry(post);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "siteTitle": Astro2.props.data.title, "siteDescription": Astro2.props.data.description, "headerCosmeticText": "POST" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Section", $$Section, { "class": "prose-lg p-8" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Content", Content, {})} ` })} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/posts/[...slug].astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/posts/[...slug].astro";
const $$url = "/posts/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
