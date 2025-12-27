import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const envKeys = locals.runtime?.env ? Object.keys(locals.runtime.env) : [];
  
  return new Response(
    JSON.stringify({ 
      hasRuntime: !!locals.runtime,
      hasEnv: !!locals.runtime?.env,
      availableKeys: envKeys,
      keyCount: envKeys.length
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
};
