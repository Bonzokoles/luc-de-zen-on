globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../chunks/_@astro-renderers_Ba3qNCWV.mjs';

const buildRobots = (sitemapURL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;
const GET = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(buildRobots(sitemapURL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
