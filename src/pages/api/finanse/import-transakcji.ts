import type { APIRoute } from 'astro';
import type { CloudflareEnv } from '../../../types/finanse';

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
      if (!file) return Response.json({ error: 'Brak pliku w formData (pole: plik)' }, { status: 400 });
      csvText = await file.text();
    } else {
      csvText = await request.text();
    }

    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return Response.json({ error: 'Plik CSV musi zawierać nagłówek + min. 1 rekord' }, { status: 400 });
    }

    const headers = lines[0].split(';').map(h => h.replace(/"/g, '').trim().toLowerCase());

    // Mapowanie nagłówków PL → pola tabeli
    const FIELD_MAP: Record<string, string> = {
      'data': 'data',
      'kwota': 'kwota',
      'kierunek': 'kierunek',
      'kategoria': 'kategoria',
      'podkategoria': 'podkategoria',
      'kontrahent': 'kontrahent',
      'opis': 'opis',
      'status': 'status',
      'waluta': 'waluta',
      'sposob_platnosci': 'sposob_platnosci',
    };

    const imported: string[] = [];
    const errors: string[] = [];
    const batchStmts: ReturnType<typeof env.D1.prepare>[] = [];

    const stmtTemplate = `
      INSERT OR IGNORE INTO transakcje_finansowe
        (id, tenant_id, data, kwota, kierunek, kategoria, podkategoria, kontrahent, opis, status, waluta, sposob_platnosci, zrodlo_systemu)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'CSV')
    `;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(';').map(v => v.replace(/"/g, '').trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          const field = FIELD_MAP[h];
          if (field) row[field] = values[idx] ?? '';
        });

        if (!row.data || !row.kwota || !row.kierunek) {
          errors.push(`Linia ${i + 1}: brak wymaganych pól (data, kwota, kierunek)`);
          continue;
        }

        const kwota = parseFloat(row.kwota.replace(',', '.'));
        if (isNaN(kwota)) {
          errors.push(`Linia ${i + 1}: nieprawidłowa kwota "${row.kwota}"`);
          continue;
        }

        const kierunek = row.kierunek.toUpperCase();
        if (!['PRZYCHÓD', 'KOSZT', 'PRZENIESIENIE'].includes(kierunek)) {
          errors.push(`Linia ${i + 1}: nieznany kierunek "${row.kierunek}" (dopuszczalne: PRZYCHÓD, KOSZT, PRZENIESIENIE)`);
          continue;
        }

        const id = `trx_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`;

        batchStmts.push(
          env.D1.prepare(stmtTemplate).bind(
            id,
            tenantId,
            row.data,
            kwota,
            kierunek,
            row.kategoria || 'Inne',
            row.podkategoria || null,
            row.kontrahent || null,
            row.opis || null,
            row.status || 'Zaksięgowano',
            row.waluta || 'PLN',
            row.sposob_platnosci || null,
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
      message: `Zaimportowano ${imported.length} transakcji. Błędy: ${errors.length}.`,
    });
  } catch (err) {
    console.error('[import-transakcji]', err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
