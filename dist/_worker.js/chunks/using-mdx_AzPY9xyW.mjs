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
import { L as createVNode, M as Fragment, _ as __astro_tag_component__ } from './vendor_DCrrhcp4.mjs';
import './Section_CRsnWPxR.mjs';

const frontmatter = {
  "title": "Using MDX",
  "published": true,
  "description": "Lorem ipsum dolor sit amet",
  "tags": ["Tag B", "Tag D"],
  "date": "2024-06-01"
};
function getHeadings() {
  return [];
}
function _createMdxContent(props) {
  const _components = {
    br: "br",
    p: "p",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Przykład agenta w MDX"
    }), "\n", createVNode(_components.p, {
      children: ["Nazwa: Agent MDX", createVNode(_components.br, {}), "\nTyp: Hybrydowy", createVNode(_components.br, {}), "\nZadania: Integracja API, Obsługa użytkownika", createVNode(_components.br, {}), "\nStatus: W trakcie konfiguracji"]
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}

const url = "src/posts/using-mdx.mdx";
const file = "Q:/mybonzo/luc-de-zen-on/src/posts/using-mdx.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "Q:/mybonzo/luc-de-zen-on/src/posts/using-mdx.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
