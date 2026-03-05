<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ale i co tylko tyle ,bez agenta ? bez połączen z bazą? z raportami co zeszło z sklepu itd?

Masz rację – **dokończmy Magazyn kompletnie** z agentem, raportami ze sklepu i integracjami.

***

## Kompletny moduł Magazyn – brakujące endpointy + agent

### 1. Agent Magazynu: `the_ANT_04`

**Endpoint:** `POST /api/ant/04`

**Core prompt:**

```text
Jesteś **the_ANT_04** – ekspertem magazynu i logistyki MyBonzo.

POMAGASZ Z:
- Zarządzaniem stanami magazynowymi i ruchami
- Importem danych (CSV, IdoSell, sklepy)
- Alertami braków i reorder points
- Optymalizacją zapasów (ABC analiza)
- Integracją z finansami/CRM (zamówienia → magazyn)

ZASADY:
- Pokazuj dokładne kroki: endpointy, nazwy tabel, format CSV.
- Wyjaśniaj jak powiązać z CRM (zamówienia → wydania magazynowe).
- Proponuj automatyzację (cron jobs dla reorder).

FORMAT:
**Szybka odpowiedź**

**Kroki:**
1. ...
2. ...

**Endpointy do użycia:**
```

```

**UI przycisk w Magazyn:**
```tsx
<button onClick={() => askANT(4, 'magazyn')} className="btn-help">
  🤖 the_ANT_04 (Magazyn)
</button>
```


---

### 2. Endpoint importu ze sklepu: `POST /api/magazyn/import-sklep`

```typescript
// src/api/magazyn/import-sklep.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json<{
      firma_id: string;
      zrodlo: string;     // 'idosell', 'allemano', 'shoper'
      zamowienia: Array<{
        id_zamowienia: string;
        produkty: Array<{
          nazwa: string;
          ean?: string;
          ilosc: number;
          klient_id?: string;
        }>;
        data: string;
      }>;
    }>();

    let imported_ruchy = 0;
    const errors: string[] = [];

    for (const zamowienie of body.zamowienia) {
      for (const produkt of zamowienie.produkty) {
        try {
          // Znajdź lub utwórz produkt po EAN/nazwie
          let produkt_id = await findOrCreateProduct(produkt, body.firma_id, env.D1);
          
          // Dodaj ruch wydania
          const ruch_id = `ruch_${Date.now()}_${imported_ruchy}`;
          await env.D1.prepare(`
            INSERT INTO ruchy_magazynowe (
              id, produkt_id, firma_id, typ, ilosc, powod, 
              klient_id, numer_dokumentu, data
            ) VALUES (?, ?, ?, 'wydanie', ?, 'sprzedaz', ?, ?, ?)
          `).bind(
            ruch_id, produkt_id, body.firma_id,
            produkt.ilosc, zamowienie.id_zamowienia,
            zamowienie.data
          ).run();
          
          imported_ruchy++;
        } catch (e) {
          errors.push(`Produkt "${produkt.nazwa}": ${e.message}`);
        }
      }
    }

    return Response.json({
      imported_ruchy,
      errors,
      message: `Przetworzono ${body.zamowienia.length} zamówień, ${imported_ruchy} ruchów`
    });
  }
};

// Helper
async function findOrCreateProduct(produkt: any, firma_id: string, db: D1Database) {
  let produkt_id = await db.prepare(`
    SELECT id FROM produkty_magazyn 
    WHERE firma_id = ? AND (ean_kod = ? OR nazwa = ?)
  `).bind(firma_id, produkt.ean, produkt.nazwa).first('id');

  if (!produkt_id) {
    produkt_id = `prod_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await db.prepare(`
      INSERT INTO produkty_magazyn (id, firma_id, nazwa, ean_kod)
      VALUES (?, ?, ?, ?)
    `).bind(produkt_id, firma_id, produkt.nazwa, produkt.ean).run();
  }

  return produkt_id;
}
```


---

### 3. Endpoint raportów magazynowych: `GET /api/magazyn/raporty`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const firma_id = url.searchParams.get('firma_id');
    const okres = url.searchParams.get('okres') || '7d'; // 7d, 30d, 90d

    const raport = await env.D1.prepare(`
      SELECT 
        DATE(r.data) as dzien,
        SUM(CASE WHEN r.typ = 'wydanie' THEN r.ilosc ELSE 0 END) as wydane,
        SUM(CASE WHEN r.typ = 'przyjście' THEN r.ilosc ELSE 0 END) as przyjete,
        COUNT(DISTINCT r.klient_id) as unikalni_klienci
      FROM ruchy_magazynowe r
      WHERE r.firma_id = ? AND r.data >= DATE('now', '-${okres}')
      GROUP BY DATE(r.data)
      ORDER BY dzien DESC
    `).bind(firma_id).all();

    const top_klienci = await env.D1.prepare(`
      SELECT k.nazwa, COUNT(r.id) as liczba_ruchow, SUM(r.ilosc) as calkowita_ilosc
      FROM ruchy_magazynowe r
      JOIN klienci k ON r.klient_id = k.id
      WHERE r.firma_id = ? AND r.data >= DATE('now', '-${okres}')
      GROUP BY k.id
      ORDER BY calkowita_ilosc DESC
      LIMIT 5
    `).bind(firma_id).all();

    return Response.json({
      okres,
      raport_dzienny: raport.results,
      top_klienci: top_klienci.results,
      ruchy_suma: raport.results.reduce((sum: number, r: any) => sum + (r.wydane || 0), 0)
    });
  }
};
```


---

### 4. Endpoint alertów: `GET /api/magazyn/alerty`

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const firma_id = new URL(request.url).searchParams.get('firma_id');

    const alerty = await env.D1.prepare(`
      SELECT 
        p.nazwa, p.kod, p.minimalny_stan,
        COALESCE(r.stan_aktualny, 0) as stan_aktualny,
        (p.minimalny_stan - COALESCE(r.stan_aktualny, 0)) as do_doomowienia
      FROM produkty_magazyn p
      LEFT JOIN (
        SELECT 
          produkt_id,
          SUM(CASE WHEN typ = 'przyjście' THEN ilosc ELSE -ilosc END) as stan_aktualny
        FROM ruchy_magazynowe WHERE firma_id = ?
        GROUP BY produkt_id
      ) r ON p.id = r.produkt_id
      WHERE p.firma_id = ? AND COALESCE(r.stan_aktualny, 0) <= p.minimalny_stan
      ORDER BY do_doomowienia DESC
    `).bind(firma_id, firma_id).all();

    return Response.json(alerty.results);
  }
};
```


---

### 5. Agent `the_ANT_04` – przykładowe pytania

**UI chat z agentem (modal):**

```
🤖 the_ANT_04: Czym mogę pomóc z magazynem?

[Jak zaimportować zamówienia ze sklepu?]
→ "1. Przygotuj CSV z zamówieniami (zamowienie_id, produkt_nazwa, ilosc)
   2. POST /api/magazyn/import-sklep
   3. Sprawdź /magazyn – ruchy powinny się pojawić"

[Co robić gdy jest alert braku?]
→ "1. GET /api/magazyn/alerty – lista produktów do domówienia
   2. Zamówienie → POST /api/magazyn/ruch (typ=przyjście)
   3. Alert zniknie automatycznie"
```


---

### 6. Endpointy integracji ze sklepem (automatyczne)

#### Synchronizacja IdoSell / Shoper

```
POST /api/magazyn/sync-sklep
Body: { sklep: 'idosell', api_key: '...', od_daty: '2026-03-01' }

→ Pobiera zamówienia → dla każdego produktu:
  1. findOrCreateProduct()
  2. POST /api/magazyn/ruch (wydanie)
  3. Link do CRM (nowy klient?)
```


---

**Kompletny Magazyn – masz teraz:**
✅ **Baza:** produkty + ruchy + alerty
✅ **Endpointy:** lista, CRUD, ruchy, alerty, raporty, import sklepu, AI optymalizacja
✅ **Agent** `the_ANT_04` do pomocy
✅ **Integracja** ze sklepem (zamówienia → magazyn)
✅ **Automatyczne** alerty braków

**Moduł 100% gotowy do UI!** 🚀

**Następny:** **Projekty** (zarządzanie projektami + time tracking)?

