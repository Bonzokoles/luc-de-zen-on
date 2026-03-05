<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Nowy moduł: Projekty (zarządzanie projektami + time tracking)

**Ścieżka:** `/projekty`

***

### 1. Struktura bazy D1 (Projekty)

```sql
-- Projekty
CREATE TABLE projekty (
  id TEXT PRIMARY KEY,
  firma_id TEXT NOT NULL,
  nazwa TEXT NOT NULL,
  klient_id TEXT,                 -- powiązanie z CRM
  opis TEXT,
  status TEXT CHECK (status IN ('planowanie', 'w_toku', 'testy', 'zakonczone', 'zamrozone')),
  priorytet TEXT CHECK (priorytet IN ('niski', 'normalny', 'wysoki', 'pilny')),
  planowany_start DATE,
  planowany_koniec DATE,
  rzeczywisty_koniec DATE,
  budzet DECIMAL(12,2),
  wydatki DECIMAL(12,2) DEFAULT 0,
  zespól JSON,                    -- ["user1", "user2"]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(klient_id) REFERENCES klienci(id)
);

-- Zadania w projektach
CREATE TABLE zadania (
  id TEXT PRIMARY KEY,
  projekt_id TEXT NOT NULL,
  nazwa TEXT NOT NULL,
  opis TEXT,
  status TEXT CHECK (status IN ('do_zrobienia', 'w_toku', 'do_przeglądu', 'zrobione')),
  priorytet INTEGER DEFAULT 1,     -- 1-5
  przypisany_do TEXT,              -- user_id
  planowany_czas INTEGER DEFAULT 0, -- godziny
  rzeczywisty_czas INTEGER DEFAULT 0,
  termin DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(projekt_id) REFERENCES projekty(id)
);

-- Time tracking
CREATE TABLE time_tracking (
  id TEXT PRIMARY KEY,
  zadanie_id TEXT,
  user_id TEXT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  czas_minut INTEGER,
  opis TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(zadanie_id) REFERENCES zadania(id)
);
```


***

### 2. Endpointy Projekty

#### a) `GET /api/projekty`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const firma_id = url.searchParams.get('firma_id') || 'demo';

    const projekty = await env.D1.prepare(`
      SELECT 
        p.*,
        k.nazwa as klient_nazwa,
        (SELECT COUNT(*) FROM zadania z WHERE z.projekt_id = p.id AND z.status != 'zrobione') as otwartych_zadan,
        (SELECT SUM(rzeczywisty_czas) FROM time_tracking t 
         JOIN zadania z ON t.zadanie_id = z.id WHERE z.projekt_id = p.id) as czas_zutracony
      FROM projekty p
      LEFT JOIN klienci k ON p.klient_id = k.id
      WHERE p.firma_id = ?
      ORDER BY CASE p.status 
        WHEN 'w_toku' THEN 1 
        WHEN 'planowanie' THEN 2 
        ELSE 3 
      END, p.priorytet DESC
    `).bind(firma_id).all();

    const stats = await env.D1.prepare(`
      SELECT 
        status, COUNT(*) as liczba,
        AVG(julianday(COALESCE(planowany_koniec, '9999-12-31'), planowany_start)) as sredni_czas
      FROM projekty WHERE firma_id = ?
      GROUP BY status
    `).bind(firma_id).all();

    return Response.json({
      projekty: projekty.results,
      stats: stats.results
    });
  }
};
```


#### b) `POST /api/projekty`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'POST') {
      const body = await request.json<{
        id?: string;
        nazwa: string;
        klient_id?: string;
        opis: string;
        status: string;
        priorytet: string;
        planowany_start: string;
        planowany_koniec: string;
        budzet: number;
        zespól: string[];
        firma_id: string;
      }>();

      if (body.id) {
        // UPDATE
        await env.D1.prepare(`
          UPDATE projekty SET 
            nazwa=?, klient_id=?, opis=?, status=?, priorytet=?,
            planowany_start=?, planowany_koniec=?, budzet=?, zespól=?
          WHERE id=? AND firma_id=?
        `).bind(
          body.nazwa, body.klient_id, body.opis, body.status, body.priorytet,
          body.planowany_start, body.planowany_koniec, body.budzet, JSON.stringify(body.zespól),
          body.id, body.firma_id
        ).run();
      } else {
        // INSERT
        const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        await env.D1.prepare(`
          INSERT INTO projekty (
            id, firma_id, nazwa, klient_id, opis, status, priorytet,
            planowany_start, planowany_koniec, budzet, zespól
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, body.firma_id, body.nazwa, body.klient_id, body.opis,
          body.status, body.priorytet, body.planowany_start, body.planowany_koniec,
          body.budzet, JSON.stringify(body.zespól)
        ).run();
        
        return Response.json({ success: true, projekt_id: id });
      }
    }
  }
};
```


#### c) Zadania: `GET/POST /api/projekty/:projekt_id/zadania`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const projekt_id = url.pathname.split('/')[2];

    if (request.method === 'GET') {
      const zadania = await env.D1.prepare(`
        SELECT *, 
          (SELECT SUM(czas_minut) FROM time_tracking WHERE zadanie_id = zadania.id) as czas_zutracony
        FROM zadania WHERE projekt_id = ?
        ORDER BY priorytet DESC, termin ASC
      `).bind(projekt_id).all();
      
      return Response.json(zadania.results);
    }

    if (request.method === 'POST') {
      const body = await request.json<{
        nazwa: string;
        opis: string;
        status: string;
        priorytet: number;
        przypisany_do: string;
        planowany_czas: number;
        termin: string;
      }>();

      const id = `zad_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      await env.D1.prepare(`
        INSERT INTO zadania (
          id, projekt_id, nazwa, opis, status, priorytet,
          przypisany_do, planowany_czas, termin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, projekt_id, body.nazwa, body.opis, body.status,
        body.priorytet, body.przypisany_do, body.planowany_czas, body.termin
      ).run();

      return Response.json({ success: true, zadanie_id: id });
    }
  }
};
```


#### d) Time tracking: `POST /api/projekty/time/start`, `POST /api/projekty/time/stop`

```typescript
// Start timera
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      zadanie_id: string;
      user_id: string;
    }>();

    const id = `tt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await env.D1.prepare(`
      INSERT INTO time_tracking (id, zadanie_id, user_id, start_time)
      VALUES (?, ?, ?, ?)
    `).bind(id, body.zadanie_id, body.user_id, new Date().toISOString()).run();

    return Response.json({ timer_id: id, start_time: new Date().toISOString() });
  }
};

// Stop timera
export default {
  async fetch(request: Request, env: Env) {
    const body = await request.json<{
      timer_id: string;
      opis?: string;
    }>();

    const result = await env.D1.prepare(`
      UPDATE time_tracking 
      SET end_time = ?, opis = ?, czas_minut = (
        julianday(?) - julianday(start_time)
      ) * 1440
      WHERE id = ?
      RETURNING czas_minut
    `).bind(
      new Date().toISOString(),
      body.opis,
      new Date().toISOString(),
      body.timer_id
    ).first();

    return Response.json({ czas_minut: result.czas_minut });
  }
};
```


***

### 3. Agent Projekty: `the_ANT_05`

**Endpoint:** `POST /api/ant/05`

**Core prompt:**

```text
Jesteś **the_ANT_05** – menedżerem projektów MyBonzo.

POMAGASZ Z:
- Tworzeniem projektów i zadań
- Time tracking i rozliczaniem czasu
- Priorytetyzacją backlogu
- Raportami projektów (burn down, velocity)
- Integracją z CRM (projekty klientów)

FORMAT:
**Krótka odpowiedź**

**Kroki:**
1. ...
```

```

---

### 4. UI layout `/projekty`

```

Nagłówek: "Projekty i czas pracy"

KPI:

- Aktywne projekty
- Otwarte zadania
- Czas zutracony tyg.
- Budżet wykorzystany %

Lista projektów (cards):
[Karta projektu: nazwa, status, klient, zadań otwartych, czasu]

Szczegóły projektu (klik):

- Zadania (Kanban: do zrobienia → w toku → zrobione)
- Time tracking (aktualne timery + historia)
- Budżet vs wydatki
- Zespół

Szybkie akcje:
[+ Nowy projekt] [Start timera] [Raport tygodniowy AI]

```

---

**Endpointy gotowe:**
1. ✅ `GET/POST /api/projekty` – CRUD projektów
2. ✅ `GET/POST /api/projekty/:id/zadania` – zadania
3. ✅ `POST /api/projekty/time/start|stop` – time tracking
4. ✅ `POST /api/ant/05` – agent projektów

**Moduł Projekty kompletny!** 🚀  

**Następny:** **SEO Analityka** (crawler + rekomendacje AI)?```

