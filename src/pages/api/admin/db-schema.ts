import type { APIRoute } from 'astro';

interface TableInfo {
  name: string;
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = (locals as any)?.runtime?.env?.DB;
    if (!db) throw new Error("Baza danych D1 jest niedostępna.");

    const { results } = await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = (results as TableInfo[]).map((row: TableInfo) => row.name);

    return new Response(JSON.stringify({
      success: true,
      tables: tableNames,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};