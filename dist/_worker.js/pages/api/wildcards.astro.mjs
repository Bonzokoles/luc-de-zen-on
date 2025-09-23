globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "OPTIONS"]);
const wildcardsData = {
  cyberpunk: [
    "A high-tech cyborg ninja in a neon-lit alley of Neo-Tokyo",
    "Glitching hologram of a corporate CEO giving a speech",
    "A lone data runner jacking into the matrix from a rooftop slum"
  ],
  fantasy: [
    "An ancient dragon sleeping on a hoard of gold in a mountain cave",
    "An elven archer perched on a moss-covered tree branch",
    "A dwarven blacksmith forging a mythical sword in a volcanic forge"
  ],
  space_opera: [
    "A massive starship battle near a swirling nebula",
    "An alien diplomat presenting a peace treaty on a futuristic council",
    "A lone astronaut discovering ancient ruins on a desolate moon"
  ]
};
const GET = ({ url }) => {
  const category = url.searchParams.get("category");
  const mode = url.searchParams.get("mode");
  if (mode === "categories") {
    return new Response(JSON.stringify(Object.keys(wildcardsData)), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (category && wildcardsData[category]) {
    return new Response(JSON.stringify(wildcardsData[category]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify([]), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
