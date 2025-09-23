globalThis.process ??= {}; globalThis.process.env ??= {};
import { i as imageConfig } from '../chunks/_astro_assets_twNce0_U.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const URL_PROTOCOL_REGEX = /^(?:(?:http|ftp|https|ws):?\/\/|\/\/)/;
function isRemotePath(src) {
  const decoded = src.replace(/%5C/gi, "\\");
  if (decoded[0] === "\\") {
    return true;
  }
  if (/^(?:http|https|ftp|ws):\\/.test(decoded)) {
    return true;
  }
  return URL_PROTOCOL_REGEX.test(decoded) || decoded.startsWith("data:");
}

function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    const additionalSubdomains = url.hostname.replace(slicedHostname, "").split(".").filter(Boolean);
    return additionalSubdomains.length === 1;
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    const additionalPathChunks = url.pathname.replace(slicedPathname, "").split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
function isRemoteAllowed(src, {
  domains,
  remotePatterns
}) {
  if (!URL.canParse(src)) {
    return false;
  }
  const url = new URL(src);
  return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}

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
