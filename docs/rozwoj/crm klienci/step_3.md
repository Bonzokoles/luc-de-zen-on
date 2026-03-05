<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Kompletny moduł CRM – endpointy + agenci + raporty dzienne


***

## 1. Endpoint interakcji: `POST /api/crm/interakcja`

```typescript
// src/api/crm/interakcja.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST') {
      const body = await request.json<{
        klient_id: string;
        firma_id: string;
        typ: string;        // email, telefon, spotkanie, oferta, faktura
        opis: string;
        wynik?: string;     // pozytywny, negatywny, neutralny
        nastepne_kroki?: string;
      }>();

      const id = `inter_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      
      await env.D1.prepare(`
        INSERT INTO interakcje_klientow (
          id, klient_id, firma_id, typ, opis, wynik, nastepne_kroki, data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, DATE('now'))
      `).bind(
        id, body.klient_id, body.firma_id, 
        body.typ, body.opis, body.wynik, body.nastepne_kroki
      ).run();

      // Aktualizuj klienta (ostatnia interakcja)
      await env.D1.prepare(`
        UPDATE klienci SET 
          updated_at = CURRENT_TIMESTAMP,
          ostatnia_interakcja = DATE('now')
        WHERE id = ? AND firma_id = ?
      `).bind(body.klient_id, body.firma_id).run();

      return Response.json({ 
        success: true, 
        interakcja_id: id 
      });
    }
  }
};
```

**Twój UI → `handleAddContact`:**

```tsx
const handleAddContact = async () => {
  await fetch('/api/crm/interakcja', {
    method: 'POST',
    body: JSON.stringify({
      klient_id: selectedClient.id,
      firma_id: 'firma_123',
      typ: newContact.type,
      opis: newContact.description,
      firma_id: 'firma_123'
    })
  });
  
  // Refresh interakcji
  loadInterakcje(selectedClient.id);
  setNewContact({ type: 'note', description: '' });
};
```


***

## 2. Agent CRM: `the_ANT_03` – pomoc w zarządzaniu klientami

**Endpoint:** `POST /api/ant/03`

**Core prompt:**

```text
Jesteś **the_ANT_03** – specjalistą CRM MyBonzo.

POMAGASZ Z:
- Zarządzaniem klientami (dodawanie, edycja, usuwanie)
- Interakcjami (jak dodawać, co rejestrować)
- Lead scoring i analiza szans sprzedaży
- Importem CSV i migracją danych
- Integracją z innymi modułami (finanse, oferty)

ZASADY:
- Pokazuj dokładne kroki z nazwami przycisków i endpointów.
- Jeśli błąd – powiedz jak debugować (np. "sprawdź konsolę F12").
- Proponuj automatyzację powtarzalnych zadań.

FORMAT:
**Krótka odpowiedź** (1 zdanie)

**Kroki:**
1. ...
2. ...
3. ...
```

**UI w CRMKlienci.tsx:**

```tsx
// Obok przycisków "Dodaj klienta" dodaj:
<button onClick={() => askANT(3)} className="btn-help ml-2">
  🤖 the_ANT_03 (CRM)
</button>
```


***

## 3. Model AI raportów dziennych z ruchu/strony/koszyka

### Nowa tabela raporty dzienne

```sql
CREATE TABLE raporty_dzienne (
  id TEXT PRIMARY KEY,
  data DATE NOT NULL,
  firma_id TEXT NOT NULL,
  wizyty INT DEFAULT 0,
  unikalni_uzytkownicy INT DEFAULT 0,
  koszyki INT DEFAULT 0,
  zamowienia INT DEFAULT 0,
  przychód_dzienny DECIMAL(12,2) DEFAULT 0,
  klienci_hurtowi INT DEFAULT 0,
  nowe_leady INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(firma_id, data)
);
```


### Endpoint: `POST /api/crm/raport-dzienny/ai`

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      data: string;  // YYYY-MM-DD
      company_prompt?: string;
    }>();

    // Pobierz dane z raportów + CRM
    const raport = await env.D1.prepare(`
      SELECT * FROM raporty_dzienne 
      WHERE firma_id = ? AND data = ?
    `).bind(body.firma_id, body.data).first();

    const leady = await env.D1.prepare(`
      SELECT COUNT(*) as count 
      FROM klienci WHERE firma_id = ? AND created_at >= ? AND status = 'lead'
    `).bind(body.firma_id, `${body.data} 00:00:00`).first();

    const corePrompt = `
Jesteś analitykiem sprzedaży. Napisz RAPORT DZIENNY.

DANE DNIA ${body.data}:
Wizyty: ${raport?.wizyty || 0}
Unikalni: ${raport?.unikalni_uzytkownicy || 0}
Koszyki: ${raport?.koszyki || 0}
Zamówienia: ${raport?.zamowienia || 0}
Przychód: ${raport?.przychód_dzienny?.toLocaleString() || 0} PLN
Nowe leady: ${leady?.count || 0}
Klienci hurtowi: ${raport?.klienci_hurtowi || 0}

ZADANIE:
1. Podsumowanie kluczowych metryk (3 zdania)
2. 3 wnioski biznesowe
3. 3 rekomendacje na jutro

FORMAT:
**📊 Podsumowanie dnia ${body.data}**

**Kluczowe liczby:**
• Wizyty: X
• Przychód: Y PLN
• ...

**📈 Wnioski:**
• ...
• ...
• ...

**✅ Działania na jutro:**
• ...
• ...
• ...
`;

    const aiRes = await fetch(`${request.url.origin}/api/ai/execute`, {
      method: 'POST',
      body: JSON.stringify({
        firma_id: body.firma_id,
        narzedzie: 'crm_raport_dzienny',
        model: 'auto',
        core_prompt: corePrompt,
        company_prompt: body.company_prompt,
        payload: { data: body.data }
      })
    });

    const data = await aiRes.json();

    return Response.json({
      raport_ai: data.wynik,
      surowe_dane: raport,
      model_uzyty: data.model_uzyty
    });
  }
};
```


### Endpoint importu danych dziennych: `POST /api/crm/raport-dzienny/import`

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      data: string;
      wizyty: number;
      unikalni_uzytkownicy: number;
      koszyki: number;
      zamowienia: number;
      przychod_dzienny: number;
      klienci_hurtowi: number;
      nowe_leady: number;
    }>();

    await env.D1.prepare(`
      INSERT OR REPLACE INTO raporty_dzienne (
        firma_id, data, wizyty, unikalni_uzytkownicy, koszyki,
        zamowienia, przychod_dzienny, klienci_hurtowi, nowe_leady
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.firma_id, body.data, body.wizyty, body.unikalni_uzytkownicy,
      body.koszyki, body.zamowienia, body.przychod_dzienny,
      body.klienci_hurtowi, body.nowe_leady
    ).run();

    return Response.json({ success: true });
  }
};
```


***

## 4. UI przyciski w CRMKlienci.tsx

### a) Przycisk agenta CRM:

```tsx
<button 
  onClick={() => askANT(3, 'crm')}
  className="btn-help flex items-center gap-2 ml-auto"
  title="the_ANT_03 - pomoc CRM"
>
  🤖 the_ANT_03
</button>
```


### b) Przycisk raportu dziennego (na górze):

```tsx
<button 
  onClick={() => generateDailyReport()}
  className="btn-secondary flex items-center gap-2"
>
  📊 Raport dzienny AI
</button>
```

**`generateDailyReport`:**

```tsx
const generateDailyReport = async () => {
  const today = new Date().toISOString().split('T')[0];
  const res = await fetch('/api/crm/raport-dzienny/ai', {
    method: 'POST',
    body: JSON.stringify({
      firma_id: 'firma_123',
      data: today
    })
  });
  
  const data = await res.json();
  showModal(data.raport_ai);
};
```


***

## 5. Kompletny moduł CRM – co masz teraz

✅ **Baza D1:** klienci + interakcje + raporty_dzienne
✅ **Endpointy:**

- `GET /api/crm/klienci` – lista + stats
- `POST /api/crm/klient` – CRUD
- `GET /api/crm/klient/:id/interakcje` – historia
- `POST /api/crm/interakcja` – dodawanie kontaktów
- `POST /api/crm/ai/lead-scoring` – AI scoring
- `POST /api/crm/import/csv` – import
- `POST /api/crm/raport-dzienny/ai` – raporty dzienne
- `POST /api/ant/03` – agent CRM

✅ **Integracja z Twoim UI:** wszystkie `fetch` gotowe do wklejenia

**Moduł gotowy do testów!** 🚀

**Następny moduł:** **Magazyn** (stanów magazynowych + alerty braków)?

