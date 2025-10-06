
import type { APIRoute } from 'astro';
import { createOPTIONSHandler, createSuccessResponse } from '../../utils/corsUtils';

export const GET: APIRoute = async () => {
  return createSuccessResponse({
    message: 'Search API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { query: "search terms" }'
  });
};

export const OPTIONS = createOPTIONSHandler(['GET', 'POST', 'OPTIONS']);

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
