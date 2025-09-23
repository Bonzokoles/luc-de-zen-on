globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CL3qsB8O.mjs';
import { $ as $$Section } from '../../chunks/Footer_CPKEGQoN.mjs';
import { r as renderEntry, g as getCollection } from '../../chunks/_astro_content_woigiaq5.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Astro = createAstro("https://mybonzo.com");
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
