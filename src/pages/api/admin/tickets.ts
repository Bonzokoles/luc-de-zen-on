import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const tickets = [
    { id: 1, subject: 'Voice AI not responding', status: 'open' },
    { id: 2, subject: 'Image generator stuck in demo mode', status: 'open' },
    { id: 3, subject: 'Cannot login to admin dashboard', status: 'closed' },
  ];

  return new Response(JSON.stringify({ tickets }), {
    headers: { 'Content-Type': 'application/json' }
  });
};