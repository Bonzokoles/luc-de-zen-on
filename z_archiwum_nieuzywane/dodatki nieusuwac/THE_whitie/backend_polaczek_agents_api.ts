// Przykład backendu (Node, Express lub Astro API) – REST API agentów
import type { APIRoute } from "astro";

let agents = [
  { id: "POLACZEK_T", name: "Tłumacz", type: "T", role: "translator", status: "active" },
  { id: "POLACZEK_M1", name: "Music Assistant 1", type: "M", role: "music-player", status: "idle" }
  // ...
];

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(agents), { status: 200, headers: { "Content-Type": "application/json" }});
};

export const POST: APIRoute = async ({ request }) => {
  const newAgent = await request.json();
  agents.push(newAgent);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const PATCH: APIRoute = async ({ request }) => {
  const { id, status } = await request.json();
  agents = agents.map(a => a.id === id ? { ...a, status } : a);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};