import type { APIRoute } from 'astro';
import { getAgentsStatus } from '../../lib/api';

// This is the actual API endpoint that the frontend component will call.
// It uses the real getAgentsStatus function from our new lib/api.ts file.
export const GET: APIRoute = ({ params, request }) => {
  const statuses = getAgentsStatus();
  return new Response(
    JSON.stringify(statuses), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}
