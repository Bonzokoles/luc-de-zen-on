
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { query } = await request.json();

  // Mock search results
  const mockResults = [
    { url: '#', title: `Wynik 1 dla zapytania: "${query}"` },
    { url: '#', title: `Wynik 2: Jak Bielik może pomóc z "${query}"` },
    { url: '#', title: `Wynik 3: Zaawansowane techniki dotyczące "${query}"` },
  ];

  await new Promise(res => setTimeout(res, 500)); // Simulate network delay

  return new Response(JSON.stringify(mockResults), { 
      headers: { "Content-Type": "application/json" } 
  });
};
