globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const OPTIONS = createOPTIONSHandler(["GET", "OPTIONS"]);
const mockLogs = [
  { action: "chat_message", userId: "user_123" },
  { action: "chat_message", userId: "user_456" },
  { action: "calendar", userId: "user_123" },
  { action: "chat_message", userId: "user_123" },
  { action: "finance", userId: "user_789" },
  { action: "email", userId: "user_123" },
  { action: "chat_message", userId: "user_456" },
  { action: "calendar", userId: "user_123" },
  { action: "calendar", userId: "user_123" },
  { action: "search", userId: "user_123" }
  // Low usage example
];
const GET = () => {
  const stats = mockLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});
  const response = {
    totalActions: mockLogs.length,
    stats
  };
  return new Response(JSON.stringify(response), {
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
