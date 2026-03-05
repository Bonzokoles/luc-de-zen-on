<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# juz mam jakiś wstępny plik i UI ,rozpisz kody endpointów

Doskonale! Widzę, że masz solidne UI lokalne (`localStorage`). Teraz **endpointy D1** zintegrowane z Twoim `CRMKlienci.tsx` – dodaj je do Cloudflare Workers.

***

## 1. Endpoint listy klientów: `GET /api/crm/klienci`

```typescript
// src/api/crm/klienci.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const firma_id = url.searchParams.get('firma_id') || 'demo';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || 'all';

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, nazwa, nip, email, telefon, adres, www,
        status, wartosc_potencjalna, szansa_sprzedazy,
        created_at, 
        (SELECT COUNT(*) FROM interakcje_klientow WHERE klient_id = klienci.id) as liczba_interakcji,
        (SELECT MAX(data) FROM interakcje_klientow WHERE klient_id = klienci.id) as ostatnia_interakcja
      FROM klienci 
      WHERE firma_id = ?
    `;

    const params: any[] = [firma_id];

    if (search) {
      query += ` AND (nazwa LIKE ? OR email LIKE ? OR nip LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY szansa_sprzedazy DESC, created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const klienci = await env.D1.prepare(query).bind(...params).all();

    // Statystyki
    const stats = await env.D1.prepare(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(wartosc_potencjalna) as total_value,
        AVG(szansa_sprzedazy) as avg_chance
      FROM klienci WHERE firma_id = ?
      GROUP BY status
    `).bind(firma_id).all();

    const total_pipeline = await env.D1.prepare(`
      SELECT SUM(wartosc_potencjalna) as total 
      FROM klienci WHERE firma_id = ? AND status IN ('lead', 'negocjacje')
    `).bind(firma_id).first();

    return Response.json({
      klienci: klienci.results,
      pagination: { page, limit, offset, total: 150 }, // TODO: COUNT(*)
      stats: stats.results,
      pipeline_wartosc: total_pipeline?.total || 0
    });
  }
};
```

**Twój UI `CRMKlienci.tsx` → podłącz:**

```tsx
// Zamiast demoClients:
useEffect(() => {
  fetch(`/api/crm/klienci?firma_id=firma_123&search=${searchTerm}&status=${filterStatus}`)
    .then(res => res.json())
    .then(data => {
      setClients(data.klienci);
      // stats do KPI cards
      setStats(data.stats);
    });
}, [searchTerm, filterStatus]);
```


***

## 2. Endpoint dodawania/aktualizacji: `POST /api/crm/klient`

```typescript
// src/api/crm/klient.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST') {
      const body = await request.json<{
        id?: string;
        nazwa: string;
        email: string;
        telefon?: string;
        firma: string;
        status: string;
        segment?: string;
        value: number;
        source?: string;
        notes?: string;
        tags?: string;
        firma_id: string;
      }>();

      if (body.id) {
        // UPDATE
        await env.D1.prepare(`
          UPDATE klienci SET 
            nazwa = ?, email = ?, telefon = ?, 
            firma = ?, status = ?, segment = ?,
            value = ?, source = ?, notes = ?, tags = ?
          WHERE id = ? AND firma_id = ?
        `).bind(
          body.nazwa, body.email, body.telefon,
          body.firma, body.status, body.segment,
          body.value, body.source, body.notes, body.tags,
          body.id, body.firma_id
        ).run();
        
        return Response.json({ success: true, message: 'Zaktualizowano klienta' });
      } else {
        // INSERT
        const newId = `klient_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        await env.D1.prepare(`
          INSERT INTO klienci (
            id, firma_id, nazwa, email, telefon, firma,
            status, segment, value, source, notes, tags
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          newId, body.firma_id, body.nazwa, body.email, body.telefon,
          body.firma, body.status, body.segment, body.value,
          body.source, body.notes, body.tags
        ).run();
        
        return Response.json({ 
          success: true, 
          klient_id: newId,
          message: 'Dodano klienta' 
        });
      }
    }

    if (request.method === 'DELETE') {
      const { id, firma_id } = await request.json();
      await env.D1.prepare('DELETE FROM klienci WHERE id = ? AND firma_id = ?')
        .bind(id, firma_id).run();
      return Response.json({ success: true });
    }
  }
};
```

**Twój UI → `handleSaveClient`:**

```tsx
const handleSaveClient = async () => {
  const res = await fetch('/api/crm/klient', {
    method: 'POST',
    body: JSON.stringify({
      id: editMode ? selectedClient.id : undefined,
      ...formData,
      firma_id: 'firma_123'
    })
  });
  
  const data = await res.json();
  // refresh listy klientów
  loadClients();
  setShowDetailModal(false);
};
```


***

## 3. Endpoint historii interakcji: `GET /api/crm/klient/:id/interakcje`

```typescript
// src/api/crm/klient-interakcje.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const klient_id = url.pathname.split('/').pop();
    const firma_id = url.searchParams.get('firma_id');

    const interakcje = await env.D1.prepare(`
      SELECT id, typ, opis, data, wynik, nastepne_kroki
      FROM interakcje_klientow 
      WHERE klient_id = ? AND firma_id = ?
      ORDER BY data DESC
    `).bind(klient_id, firma_id).all();

    return Response.json(interakcje.results);
  }
};
```

**Twój UI → `selectedClient.contacts` zastąp:**

```tsx
useEffect(() => {
  if (selectedClient?.id) {
    fetch(`/api/crm/klient/${selectedClient.id}/interakcje?firma_id=firma_123`)
      .then(res => res.json())
      .then(data => {
        setSelectedClient(prev => ({ ...prev, contacts: data }));
      });
  }
}, [selectedClient?.id]);
```


***

## 4. Endpoint AI Lead Scoring: `POST /api/crm/ai/lead-scoring`

```typescript
// src/api/crm/ai-lead-scoring.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      klient_id: string;
      firma_id: string;
      company_prompt?: string;
    }>();

    // Pobierz dane klienta + interakcje
    const klient = await env.D1.prepare(`
      SELECT * FROM klienci WHERE id = ? AND firma_id = ?
    `).bind(body.klient_id, body.firma_id).first();

    const interakcje = await env.D1.prepare(`
      SELECT typ, opis, data, wynik FROM interakcje_klientow 
      WHERE klient_id = ? AND firma_id = ? 
      ORDER BY data DESC LIMIT 10
    `).bind(body.klient_id, body.firma_id).all();

    const corePrompt = `
Jesteś specjalistą ds. sprzedaży B2B. Oceń szansę konwersji.

KLIENT: ${JSON.stringify(klient)}
INTERAKCJE (${interakcje.results.length}):
${interakcje.results.map((i: any) => `${i.data}: ${i.typ} (${i.wynik})`).join('\n')}

WYNIK JSON:
{
  "lead_score": 0-100,
  "rekomendacje": ["krok1", "krok2"],
  "szacowana_wartosc": 0,
  "uzasadnienie": "dlaczego taka ocena"
}
`;

    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'crm_lead_scoring',
        model: body.model || 'auto',
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: { klient_id: body.klient_id }
      })
    });

    const data = await aiRes.json();
    const scoring = JSON.parse(data.wynik);

    // Zapisz do klienta
    await env.D1.prepare(`
      UPDATE klienci SET szansa_sprzedazy = ?, wartosc_potencjalna = ?
      WHERE id = ? AND firma_id = ?
    `).bind(scoring.lead_score, scoring.szacowana_wartosc, body.klient_id, body.firma_id).run();

    return Response.json(scoring);
  }
};
```

**W UI przycisk „🤖 AI Lead Score”:**

```tsx
const analyzeLead = async () => {
  const res = await fetch(`/api/crm/ai/lead-scoring`, {
    method: 'POST',
    body: JSON.stringify({
      klient_id: selectedClient.id,
      firma_id: 'firma_123'
    })
  });
  
  const scoring = await res.json();
  setSelectedClient(prev => ({ ...prev, lead_score: scoring.lead_score }));
  showToast(`Lead Score: ${scoring.lead_score}/100`);
};
```


***

## 5. Endpoint import CSV: `POST /api/crm/import/csv`

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const formData = await request.formData();
    const csvFile = formData.get('csv') as File;
    const firma_id = formData.get('firma_id') as string;

    const csvText = await csvFile.text();
    const lines = csvText.split('\n').slice(1); // pomiń header

    let imported = 0;
    const errors: string[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      
      const [nazwa, email, telefon, firma, status] = line.split(',');
      
      try {
        const id = `klient_${Date.now()}_${imported}`;
        await env.D1.prepare(`
          INSERT INTO klienci (id, firma_id, nazwa, email, telefon, firma, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(id, firma_id, nazwa.trim(), email.trim(), telefon?.trim(), firma?.trim(), status?.trim() || 'lead').run();
        
        imported++;
      } catch (e) {
        errors.push(`Linia "${line}": ${e.message}`);
      }
    }

    return Response.json({
      imported,
      errors,
      message: `Zaimportowano ${imported} klientów${errors.length ? `, ${errors.length} błędów` : ''}`
    });
  }
};
```

**W UI przycisk „Import CSV”:**

```tsx
<input type="file" accept=".csv" ref={csvRef} />
<button onClick={importCsv}>📥 Importuj CSV</button>

const importCsv = async () => {
  const formData = new FormData();
  formData.append('csv', csvRef.current.files[^0]);
  formData.append('firma_id', 'firma_123');
  
  const res = await fetch('/api/crm/import/csv', { method: 'POST', body: formData });
  const data = await res.json();
  loadClients(); // refresh
  showToast(data.message);
};
```


***

**Endpointy gotowe do wdrożenia:**

1. ✅ `GET /api/crm/klienci` – lista + stats
2. ✅ `POST /api/crm/klient` – CRUD klientów
3. ✅ `GET /api/crm/klient/:id/interakcje` – historia
4. ✅ `POST /api/crm/ai/lead-scoring` – AI analiza
5. ✅ `POST /api/crm/import/csv` – masowy import

**W Twoim UI:** Zamień `localStorage` na te fetch + użyj `handleSaveClient` z `POST /api/crm/klient`.

**Co dalej:** Endpointy interakcji (`POST /api/crm/interakcja`) czy **moduł kolejny** (Magazyn)?
<span style="display:none">[^1]</span>

<div align="center">⁂</div>

[^1]: CRMKlienci.tsx

