import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const users = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'moderator', role: 'moderator' },
    { id: 3, username: 'viewer', role: 'viewer' },
  ];

  return new Response(JSON.stringify({ users }), {
    headers: { 'Content-Type': 'application/json' }
  });
};