/**
 * POST /api/finanse/import-kosztow
 * Importuje koszty z pliku CSV do tabeli `koszty` w D1.
 *
 * Format CSV (separator ;):
 * data;kwota;kategoria;podkategoria;kontrahent;opis;status;waluta;typ
 *
 * Kategorie: Marketing | Logistyka | Pracownicy | Dostawcy | Administracja
 * Status: Planowane | Zapłacone | Oczekujące
 * Typ: Stałe | Zmienne
 *
 * step_09 + step_11 (Cloudflare D1 native)
 */
import type { APIRoute } from 'astro';
import type { CloudflareEnv } from '../../../types/finanse';

const VALID_KATEGORIE = ['Marketing', 'Logistyka', 'Pracownicy', 'Dostawcy', 'Administracja'];
const VALID_STATUS    = ['Planowane', 'Zapłacone', 'Oczekujące'];
const VALID_TYP       = ['Stałe', 'Zmienne'];

const SAMPLE_CSV = `data;kwota;kategoria;kontrahent;opis;status
2026-03-01;1500.00;Marketing;Meta Platforms Inc.;FB Ads marzec;Zapłacone
2026-03-02;2200.50;Logistyka;InPost;Paczki marzec tydzień 1;Zapłacone`;

export const GET: APIRoute = async () => {
  return Response.json({
    opis: 'POST /api/finanse/import-kosztow — import CSV kosztów',
    format: 'data;kwota;kategoria;podkategoria;kontrahent;opis;status;waluta;typ',
    kategorie: VALID_KATEGORIE,
    status: VALID_STATUS,
    typ: VALID_TYP,
    przyklad: SAMPLE_CSV,
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  if (!env?.D1) {
    return Response.json({ error: 'Brak D1 — import niemożliwy' }, { status: 503 });
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';
    let csvText: string;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('plik') as File | null;
      if (!file) {
        return Response.json({ error: 'Brak pliku w formData (pole: plik)' }, { status: 400 });
      }
      csvText = await file.text();
    } else {
      csvText = await request.text();
    }

    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return Response.json(
        { error: 'Plik CSV musi zawierać nagłówek + min. 1 rekord' },
        { status: 400 }
      );
    }

    const headers = lines[0].split(';').map(h => h.replace(/"/g, '').trim().toLowerCase());

    // Mapowanie PL nagłówków → pola tabeli
    const FIELD_MAP: Record<string, string> = {
      'data':          'data',
      'kwota':         'kwota',
      'kategoria':     'kategoria',
      'podkategoria':  'podkategoria',
      'kontrahent':    'kontrahent',
      'opis':          'opis',
      'status':        'status',
      'waluta':        'waluta',
      'typ':           'typ',
      'kwota_netto':   'kwota_netto',
      'vat':           'vat',
      'projekt_id':    'projekt_id',
    };

    const imported: string[] = [];
    const errors: string[] = [];
    const batchStmts: ReturnType<typeof env.D1.prepare>[] = [];

    const stmtTemplate = `
      INSERT OR IGNORE INTO koszty
        (id, tenant_id, data, kwota, waluta, typ, kategoria, podkategoria,
         kontrahent, opis, status, kwota_netto, stawka_vat, projekt_id, zrodlo_systemu)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'CSV')
    `;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(';').map(v => v.replace(/"/g, '').trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          const field = FIELD_MAP[h];
          if (field) row[field] = values[idx] ?? '';
        });

        // Walidacja wymaganych pól
        if (!row.data || !row.kwota || !row.kategoria) {
          errors.push(`Linia ${i + 1}: brak wymaganych pól (data, kwota, kategoria)`);
          continue;
        }

        const kwota = parseFloat(row.kwota.replace(',', '.'));
        if (isNaN(kwota) || kwota <= 0) {
          errors.push(`Linia ${i + 1}: nieprawidłowa kwota "${row.kwota}"`);
          continue;
        }

        // Normalizuj kategorię (case-insensitive match)
        const katNorm = VALID_KATEGORIE.find(
          k => k.toLowerCase() === row.kategoria.toLowerCase()
        ) ?? row.kategoria;

        const statusNorm = VALID_STATUS.find(
          s => s.toLowerCase() === (row.status ?? '').toLowerCase()
        ) ?? 'Oczekujące';

        const typNorm = VALID_TYP.find(
          t => t.toLowerCase() === (row.typ ?? '').toLowerCase()
        ) ?? 'Zmienne';

        const kwotaNetto = row.kwota_netto
          ? parseFloat(row.kwota_netto.replace(',', '.'))
          : null;

        const vat = row.vat ? parseFloat(row.vat) : null;

        const id = `cost_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`;

        batchStmts.push(
          env.D1.prepare(stmtTemplate).bind(
            id,
            tenantId,
            row.data,
            kwota,
            row.waluta || 'PLN',
            typNorm,
            katNorm,
            row.podkategoria || null,
            row.kontrahent || null,
            row.opis || null,
            statusNorm,
            kwotaNetto,
            vat,
            row.projekt_id || null,
          )
        );
        imported.push(id);
      } catch (lineErr) {
        errors.push(`Linia ${i + 1}: ${String(lineErr)}`);
      }
    }

    // D1 batch — all inserts in one round-trip
    if (batchStmts.length > 0) {
      await env.D1.batch(batchStmts);
    }

    return Response.json({
      imported: imported.length,
      errors: errors.length,
      error_details: errors.slice(0, 10),
      message: `Zaimportowano ${imported.length} kosztów. Błędy: ${errors.length}.`,
    });

  } catch (err) {
    console.error('[import-kosztow]', err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
