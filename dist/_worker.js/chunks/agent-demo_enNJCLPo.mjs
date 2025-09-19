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
import { $ as $$Section } from './Section_CRsnWPxR.mjs';

const frontmatter = {
  "title": "Agent Demo",
  "description": "Demo agenta AI w działaniu",
  "date": "2025-08-27",
  "published": true,
  "tags": ["Tag B", "Tag D"],
  "status": "Aktywny"
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "agent-demo",
    "text": "Agent Demo"
  }];
}
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h1, {
      id: "agent-demo",
      children: "Agent Demo"
    }), "\n", createVNode($$Section, {
      children: createVNode("p", {
        children: "Ten agent to automatyczny system do monitorowania i raportowania."
      })
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

const url = "src/posts/agent-demo.mdx";
const file = "Q:/mybonzo/luc-de-zen-on/src/posts/agent-demo.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "Q:/mybonzo/luc-de-zen-on/src/posts/agent-demo.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
