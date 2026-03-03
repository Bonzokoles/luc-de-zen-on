import type { APIRoute } from 'astro';
import type { CloudflareEnv, DokumentFinansowy } from '../../../types/finanse';

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const url = new URL(request.url);
  const tenantId = env?.TENANT_ID ?? 'meblepumo';
  const ryzyko   = url.searchParams.get('ryzyko');      // Niskie | Średnie | Wysokie
  const status   = url.searchParams.get('status');
  const limit    = parseInt(url.searchParams.get('limit') ?? '50');
  const offset   = parseInt(url.searchParams.get('offset') ?? '0');

  if (!env?.D1) {
    return Response.json({ items: DEMO_DOKUMENTY, total: DEMO_DOKUMENTY.length });
  }

  try {
    let query = `
      SELECT *,
        CASE 
          WHEN termin_platnosci < date('now') AND status NOT IN ('Zapłacona','Anulowana')
          THEN CAST(julianday('now') - julianday(termin_platnosci) AS INTEGER)
          ELSE 0 
        END as dni_przeterminowania
      FROM dokumenty_finansowe
      WHERE tenant_id = ?
    `;
    const params: (string | number)[] = [tenantId];

    if (ryzyko) {
      query += ' AND poziom_ryzyka = ?';
      params.push(ryzyko);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY data_wystawienia DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.D1.prepare(query).bind(...params).all<DokumentFinansowy>();

    const count = await env.D1.prepare(
      `SELECT COUNT(*) as total FROM dokumenty_finansowe WHERE tenant_id = ?`
    ).bind(tenantId).first<{ total: number }>();

    // Parsuj tagi_ryzyka z JSON string → array
    const items = (result.results ?? []).map(doc => ({
      ...doc,
      tagi_ryzyka: typeof doc.tagi_ryzyka === 'string'
        ? JSON.parse(doc.tagi_ryzyka || '[]')
        : (doc.tagi_ryzyka ?? []),
    }));

    return Response.json({ items, total: count?.total ?? 0 });
  } catch (err) {
    console.error('[dokumenty-finansowe GET]', err);
    return Response.json({ items: DEMO_DOKUMENTY, total: DEMO_DOKUMENTY.length });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  if (!env?.D1) {
    return Response.json({ error: 'Brak D1' }, { status: 503 });
  }

  try {
    const body = await request.json() as Partial<DokumentFinansowy>;

    if (!body.numer || !body.kontrahent || !body.data_wystawienia) {
      return Response.json({ error: 'Wymagane: numer, kontrahent, data_wystawienia' }, { status: 400 });
    }

    const id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await env.D1.prepare(`
      INSERT INTO dokumenty_finansowe
        (id, tenant_id, numer, typ, data_wystawienia, termin_platnosci, waluta,
         kwota_netto, kwota_brutto, stawka_vat, kontrahent, kontrahent_id, projekt_id,
         status, plik_url, zrodlo, uwagi)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      id, tenantId,
      body.numer,
      body.typ ?? 'Faktura',
      body.data_wystawienia,
      body.termin_platnosci ?? null,
      body.waluta ?? 'PLN',
      body.kwota_netto ?? null,
      body.kwota_brutto ?? null,
      body.stawka_vat ?? null,
      body.kontrahent,
      body.kontrahent_id ?? null,
      body.projekt_id ?? null,
      body.status ?? 'Szkic',
      body.plik_url ?? null,
      body.zrodlo ?? 'Ręczny',
      body.uwagi ?? null,
    ).run();

    return Response.json({ id, success: true }, { status: 201 });
  } catch (err) {
    console.error('[dokumenty-finansowe POST]', err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
};

// ---- Dane demo ----
const DEMO_DOKUMENTY: DokumentFinansowy[] = [
  {
    id: 'doc_demo_001',
    tenant_id: 'meblepumo',
    numer: 'FV/03/2026/0012',
    typ: 'Faktura',
    data_wystawienia: '2026-03-01',
    termin_platnosci: '2026-03-15',
    waluta: 'PLN',
    kwota_netto: 2032.51,
    kwota_brutto: 2499.99,
    stawka_vat: 23,
    kontrahent: 'Jan Kowalski',
    status: 'Wysłana',
    ryzyko_punktowe: 72,
    poziom_ryzyka: 'Średnie',
    tagi_ryzyka: ['nowy_klient', 'duza_kwota'],
    podsumowanie_ryzyka: 'Nowy klient, wysoka kwota, termin 14 dni.',
    model_ai: 'gemini-2.5-flash',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'doc_demo_002',
    tenant_id: 'meblepumo',
    numer: 'OF/03/2026/0005',
    typ: 'Oferta',
    data_wystawienia: '2026-03-03',
    waluta: 'PLN',
    kwota_netto: 9756.10,
    kwota_brutto: 12000.00,
    stawka_vat: 23,
    kontrahent: 'Firma XYZ Sp.z o.o.',
    status: 'Wysłana',
    ryzyko_punktowe: 85,
    poziom_ryzyka: 'Wysokie',
    tagi_ryzyka: ['brak_historii', 'bardzo_wysoka_kwota', 'brak_nip'],
    podsumowanie_ryzyka: 'Brak historii, bardzo wysoka kwota, brak NIP.',
    model_ai: 'gemini-2.5-flash',
    created_at: '2026-03-03T09:00:00Z',
    updated_at: '2026-03-03T09:00:00Z',
  },
];
