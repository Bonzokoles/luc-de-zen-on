import type { APIRoute } from 'astro';

interface RequestBody {
  login?: string;
  password?: string;
}

// TODO: Implement proper session management (e.g., with JWTs in httpOnly cookies)
// For now, this returns a simple success/failure response.

export const POST: APIRoute = async ({ request, locals }) => {
  const body: RequestBody = await request.json();
  const { login, password } = body;

  if (!login || !password) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing login or password' }),
      { status: 400 }
    );
  }

  // Safely get secrets from the environment (e.g., Cloudflare Pages secrets)
  const adminPassword = locals.runtime.env.ADMIN_PASSWORD;
  const userPassword = locals.runtime.env.USER_PASSWORD;

  // Hardcoded fallback for local development if .dev.vars is not set up
  const fallbackAdminPass = 'HAOS77';
  const fallbackUserPass = 'ZENON2015AI';

  const effectiveAdminPassword = adminPassword || fallbackAdminPass;
  const effectiveUserPassword = userPassword || fallbackUserPass;

  let role: 'admin' | 'user' | null = null;
  let success = false;

  if (login === 'admin' && password === effectiveAdminPassword) {
    success = true;
    role = 'admin';
  } else if (login === 'user' && password === effectiveUserPassword) {
    success = true;
    role = 'user';
  }

  if (success) {
    return new Response(
      JSON.stringify({ success: true, role }), 
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid credentials' }),
      { status: 401 }
    );
  }
};