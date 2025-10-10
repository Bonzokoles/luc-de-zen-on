
import type { APIRoute } from 'astro';
import { getConfig } from '../../lib/api';

export const GET: APIRoute = ({ params, request }) => {
  const config = getConfig();
  return new Response(
    JSON.stringify(config), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}
