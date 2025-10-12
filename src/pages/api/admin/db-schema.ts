import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = (locals as any)?.runtime?.env?.DB;
    if (!db) throw new Error("Baza danych D1 jest niedostępna.");

    const { results } = await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = results.map(row => row.name);

    return new Response(JSON.stringify({
      success: true,
      tables: tableNames,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};