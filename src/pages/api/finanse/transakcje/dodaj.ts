/**
 * POST /api/finanse/transakcje/dodaj
 * Dodaje pojedynczą transakcję finansową (JSON body) do D1.
 *
 * Body (JSON):
 * {
 *   data: string,           // YYYY-MM-DD — wymagane
 *   kwota: number,          // wymagane, > 0
 *   kierunek: string,       // PRZYCHÓD | KOSZT | PRZENIESIENIE — wymagane
 *   kategoria: string,      // wymagane
 *   podkategoria?: string,
 *   kontrahent?: string,
 *   kontrahent_id?: string,
 *   projekt_id?: string,
 *   document_id?: string,
 *   status?: string,        // Planowane | Oczekujące | Zaksięgowano | Anulowane
 *   waluta?: string,        // domyślnie PLN
 *   sposob_platnosci?: string,
 *   opis?: string,
 *   meta?: object,
 * }
 *
 * step_13 checklista (punkt 13)
 */
import type { APIRoute } from 'astro';
import type { CloudflareEnv } from '../../../../types/finanse';

const VALID_KIERUNEK = ['PRZYCHÓD', 'KOSZT', 'PRZENIESIENIE'];
const VALID_STATUS   = ['Planowane', 'Oczekujące', 'Zaksięgowano', 'Anulowane'];

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'Wymagany JSON body' }, { status: 400 });
  }

  // Walidacja wymaganych pól
  const { data, kwota, kierunek, kategoria } = body;

  if (!data || typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return Response.json({ error: 'Pole "data" wymagane w formacie YYYY-MM-DD' }, { status: 400 });
  }

  const kwotaNum = typeof kwota === 'number' ? kwota : parseFloat(String(kwota ?? ''));
  if (isNaN(kwotaNum) || kwotaNum <= 0) {
    return Response.json({ error: 'Pole "kwota" wymagane i musi być liczbą > 0' }, { status: 400 });
  }

  if (!kierunek || !VALID_KIERUNEK.includes(String(kierunek).toUpperCase())) {
    return Response.json(
      { error: `Pole "kierunek" wymagane: ${VALID_KIERUNEK.join(' | ')}` },
      { status: 400 }
    );
  }

  if (!kategoria || typeof kategoria !== 'string' || !kategoria.trim()) {
    return Response.json({ error: 'Pole "kategoria" wymagane' }, { status: 400 });
  }

  const statusStr = body.status ? String(body.status) : 'Zaksięgowano';
  const statusNorm = VALID_STATUS.includes(statusStr) ? statusStr : 'Zaksięgowano';

  const id = `trx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (!env?.D1) {
    // Demo mode — brak D1, zwróć symulowany sukces
    return Response.json({
      id,
      success: true,
      demo: true,
      message: 'Transakcja przyjęta (tryb demo — brak D1)',
      transakcja: {
        id,
        tenant_id: tenantId,
        data,
        kwota: kwotaNum,
        kierunek: String(kierunek).toUpperCase(),
        kategoria: String(kategoria).trim(),
        status: statusNorm,
      },
    }, { status: 201 });
  }

  try {
    await env.D1.prepare(`
      INSERT INTO transakcje_finansowe
        (id, tenant_id, data, kwota, waluta, kierunek, kategoria, podkategoria,
         kontrahent, kontrahent_id, projekt_id, dokument_id,
         status, sposob_platnosci, zrodlo_systemu, opis, meta,
         created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      id,
      tenantId,
      data,
      kwotaNum,
      String(body.waluta ?? 'PLN'),
      String(kierunek).toUpperCase(),
      String(kategoria).trim(),
      body.podkategoria ? String(body.podkategoria) : null,
      body.kontrahent   ? String(body.kontrahent)   : null,
      body.kontrahent_id ? String(body.kontrahent_id) : null,
      body.projekt_id ? String(body.projekt_id) : null,
      body.document_id ? String(body.document_id) : null,
      statusNorm,
      body.sposob_platnosci ? String(body.sposob_platnosci) : null,
      'API',
      body.opis ? String(body.opis) : null,
      body.meta ? JSON.stringify(body.meta) : null,
      new Date().toISOString(),
      new Date().toISOString(),
    ).run();

    return Response.json({
      id,
      success: true,
      message: 'Transakcja dodana pomyślnie',
    }, { status: 201 });

  } catch (err) {
    console.error('[transakcje/dodaj]', err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
