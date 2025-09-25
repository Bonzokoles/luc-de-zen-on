globalThis.process ??= {}; globalThis.process.env ??= {};
import { i as isRemoteAllowed, a as imageConfig } from '../chunks/_astro_assets_F9kQ_8I_.mjs';
import { i as isRemotePath } from '../chunks/path_Oj0iLohx.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_iO87Dm24.mjs';

const prerender = false;
const GET = (ctx) => {
  const href = ctx.url.searchParams.get("href");
  if (!href) {
    return new Response("Missing 'href' query parameter", {
      status: 400,
      statusText: "Missing 'href' query parameter"
    });
  }
  if (isRemotePath(href)) {
    if (isRemoteAllowed(href, imageConfig) === false) {
      return new Response("Forbidden", { status: 403 });
    } else {
      return Response.redirect(href, 302);
    }
  }
  return fetch(new URL(href, ctx.url.origin));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
