import type { APIRoute } from 'astro';
import type { CloudflareEnv, TransakcjaFinansowa } from '../../../types/finanse';

interface TransactionsResponse {
  items: TransakcjaFinansowa[];
  total: number;
  from: string;
  to: string;
  limit: number;
  offset: number;
}

function buildDemoResponse(from: string, to: string, limit: number, offset: number): TransactionsResponse {
  const demoItems: TransakcjaFinansowa[] = [
    {
      id: 'TXN-001', tenant_id: 'meblepumo', data: from,
      kwota: 12500.00, waluta: 'PLN', kierunek: 'PRZYCHÓD',
      kategoria: 'Sprzedaż mebli', podkategoria: 'Sofy',
      kontrahent: 'IKEA Poland Sp. z o.o.', kontrahent_id: 'CNT-001',
      projekt_id: null, dokument_id: 'DOC-001',
      status: 'Zaksięgowano', sposob_platnosci: 'Przelew',
      zrodlo_systemu: 'MANUAL', opis: 'Faktura VAT 2025/001',
      meta: null,
      created_at: `${from}T09:00:00Z`, updated_at: `${from}T09:00:00Z`,
    },
    {
      id: 'TXN-002', tenant_id: 'meblepumo', data: from,
      kwota: 3200.00, waluta: 'PLN', kierunek: 'KOSZT',
      kategoria: 'Materiały', podkategoria: 'Drewno',
      kontrahent: 'Tartak Mazowsze', kontrahent_id: 'CNT-002',
      projekt_id: null, dokument_id: 'DOC-002',
      status: 'Zaksięgowano', sposob_platnosci: 'Przelew',
      zrodlo_systemu: 'MANUAL', opis: 'Zakup materiałów',
      meta: null,
      created_at: `${from}T10:15:00Z`, updated_at: `${from}T10:15:00Z`,
    },
    {
      id: 'TXN-003', tenant_id: 'meblepumo', data: to,
      kwota: 8900.00, waluta: 'PLN', kierunek: 'PRZYCHÓD',
      kategoria: 'Sprzedaż mebli', podkategoria: 'Stoły',
      kontrahent: 'Piotr Kowalski', kontrahent_id: 'CNT-003',
      projekt_id: 'PROJ-001', dokument_id: 'DOC-003',
      status: 'Oczekujące', sposob_platnosci: 'Gotówka',
      zrodlo_systemu: 'MANUAL', opis: 'Zamówienie stołu dębowego',
      meta: null,
      created_at: `${to}T14:30:00Z`, updated_at: `${to}T14:30:00Z`,
    },
    {
      id: 'TXN-004', tenant_id: 'meblepumo', data: to,
      kwota: 1450.00, waluta: 'PLN', kierunek: 'KOSZT',
      kategoria: 'Transport', podkategoria: null,
      kontrahent: 'InPost Sp. z o.o.', kontrahent_id: 'CNT-004',
      projekt_id: null, dokument_id: null,
      status: 'Zaksięgowano', sposob_platnosci: 'Karta',
      zrodlo_systemu: 'MANUAL', opis: 'Usługi kurierskie – czerwiec',
      meta: null,
      created_at: `${to}T16:00:00Z`, updated_at: `${to}T16:00:00Z`,
    },
  ];

  return {
    items: demoItems.slice(offset, offset + limit),
    total: demoItems.length,
    from,
    to,
    limit,
    offset,
  };
}

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: CloudflareEnv } }).runtime?.env;
  const url = new URL(request.url);

  const from = url.searchParams.get('from') ?? new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const to = url.searchParams.get('to') ?? new Date().toISOString().split('T')[0];
  const direction = url.searchParams.get('direction'); // PRZYCHÓD | KOSZT | PRZENIESIENIE
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 200);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');
  const tenantId = env?.TENANT_ID ?? 'meblepumo';

  if (!env?.D1) {
    return Response.json(buildDemoResponse(from, to, limit, offset));
  }

  try {
    const db = env.D1;

    let countQuery = `SELECT COUNT(*) as cnt FROM transakcje_finansowe WHERE tenant_id = ? AND data BETWEEN ? AND ?`;
    let dataQuery = `SELECT * FROM transakcje_finansowe WHERE tenant_id = ? AND data BETWEEN ? AND ?`;
    const baseParams: (string | number)[] = [tenantId, from, to];

    if (direction) {
      countQuery += ` AND kierunek = ?`;
      dataQuery += ` AND kierunek = ?`;
      baseParams.push(direction);
    }

    dataQuery += ` ORDER BY data DESC, created_at DESC LIMIT ? OFFSET ?`;

    const [countResult, dataResult] = await Promise.all([
      db.prepare(countQuery).bind(...baseParams).first<{ cnt: number }>(),
      db.prepare(dataQuery).bind(...baseParams, limit, offset).all<TransakcjaFinansowa>(),
    ]);

    const total = countResult?.cnt ?? 0;
    const items = (dataResult.results ?? []).map((row) => ({
      ...row,
      meta: row.meta ? JSON.parse(row.meta as unknown as string) : null,
    }));

    return Response.json({ items, total, from, to, limit, offset } satisfies TransactionsResponse);
  } catch (e) {
    console.error('/api/finanse/transactions error:', e);
    return Response.json(buildDemoResponse(from, to, limit, offset));
  }
};
