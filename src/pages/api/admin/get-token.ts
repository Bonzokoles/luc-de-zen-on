import type { APIRoute } from 'astro';
import { AuthService } from '../../../utils/auth';

export const GET: APIRoute = async () => {
  const token = AuthService.authenticate('superadmin', 'HAOS77ZENON');
  return new Response(JSON.stringify({ token }));
};