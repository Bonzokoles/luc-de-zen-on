import type { APIRoute } from 'astro';
import { createSuccessResponse, createErrorResponse, createOPTIONSHandler } from '../../../utils/corsUtils.ts';

export const OPTIONS = createOPTIONSHandler(['GET', 'POST']);

// Prosta pamięć w procesie dev; w produkcji użyj KV (env.SESSION lub dedykowane)
const inMemoryBackups: { name: string; date: string; age?: string }[] = [];

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      // Pozwól w dev bez tokena, ale zwróć flagę demo
      return createSuccessResponse({ backups: inMemoryBackups, demoAuth: false });
    }

    return createSuccessResponse({ backups: inMemoryBackups, demoAuth: token === 'HAOS77' });
  } catch (e) {
    console.error('backup GET error', e);
    return createErrorResponse('Failed to list backups', 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (token !== 'HAOS77') {
      return createErrorResponse('Unauthorized', 401);
    }

    const { action, reason } = await request.json();
    if (action !== 'create') {
      return createErrorResponse('Invalid action', 400);
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const name = `backup_${stamp}${reason ? '_' + reason : ''}.zip`;
    const entry = { name, date: new Date().toISOString(), age: 'Active' };

    // Trzymaj max 5 wpisów
    inMemoryBackups.unshift(entry);
    if (inMemoryBackups.length > 5) inMemoryBackups.pop();

    return createSuccessResponse({ status: 'created', backup: entry });
  } catch (e) {
    console.error('backup POST error', e);
    return createErrorResponse('Failed to create backup', 500);
  }
};
