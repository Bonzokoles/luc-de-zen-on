
import type { APIRoute } from 'astro';

// Mock data simulating a large YAML file
const wildcardsData = {
  cyberpunk: [
    'A high-tech cyborg ninja in a neon-lit alley of Neo-Tokyo',
    'Glitching hologram of a corporate CEO giving a speech',
    'A lone data runner jacking into the matrix from a rooftop slum',
  ],
  fantasy: [
    'An ancient dragon sleeping on a hoard of gold in a mountain cave',
    'An elven archer perched on a moss-covered tree branch',
    'A dwarven blacksmith forging a mythical sword in a volcanic forge',
  ],
  space_opera: [
    'A massive starship battle near a swirling nebula',
    'An alien diplomat presenting a peace treaty on a futuristic council',
    'A lone astronaut discovering ancient ruins on a desolate moon',
  ],
};

export const GET: APIRoute = ({ url }) => {
  const category = url.searchParams.get('category');
  const mode = url.searchParams.get('mode');

  // Endpoint to get all available categories
  if (mode === 'categories') {
    return new Response(JSON.stringify(Object.keys(wildcardsData)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Endpoint to get examples for a specific category
  if (category && wildcardsData[category]) {
    return new Response(JSON.stringify(wildcardsData[category]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Return empty or error if no valid parameters
  return new Response(JSON.stringify([]), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
