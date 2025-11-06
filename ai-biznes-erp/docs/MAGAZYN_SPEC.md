# 📦 Moduł MAGAZYN - Specyfikacja Techniczna

## 1. Przegląd

**Cel**: Kompleksowe zarządzanie stanem magazynowym z historią ruchów, alertami i raportami.

---

## 2. Funkcjonalności

### 2.1 Stan Magazynowy
```typescript
interface InventoryItem {
  id: string;
  sku: string;                 // kod produktu
  name: string;
  description: string;
  category: string;
  unit: 'szt' | 'kg' | 'l' | 'm';
  quantity: number;            // aktualny stan
  minQuantity: number;         // minimum (alert)
  maxQuantity: number;         // maksimum
  location: string;            // lokalizacja w magazynie
  barcodes: string[];          // kody kreskowe
  price: {
    purchase: number;          // cena zakupu
    sale: number;              // cena sprzedaży
  };
  supplier: string;
  lastUpdated: Date;
  batches: Batch[];           // partie towaru
}

interface Batch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate?: Date;
  productionDate: Date;
  purchasePrice: number;
}
```

### 2.2 Dokumenty Magazynowe

#### PZ - Przyjęcie Zewnętrzne
```typescript
interface PZ {
  id: string;
  number: string;              // PZ/2025/001
  date: Date;
  supplier: string;
  items: PZItem[];
  totalValue: number;
  status: 'draft' | 'approved' | 'completed';
  notes: string;
  documents: string[];         // załączniki
}

interface PZItem {
  itemId: string;
  quantity: number;
  price: number;
  batchNumber?: string;
  expiryDate?: Date;
}
```

#### WZ - Wydanie Zewnętrzne
```typescript
interface WZ {
  id: string;
  number: string;              // WZ/2025/001
  date: Date;
  recipient: string;
  project?: string;            // przypisanie do projektu
  items: WZItem[];
  totalValue: number;
  status: 'draft' | 'approved' | 'completed';
  notes: string;
}

interface WZItem {
  itemId: string;
  quantity: number;
  batchId?: string;            // z której partii
  purpose: string;             // cel wydania
}
```

### 2.3 Raporty i Wykresy

#### Rotacja Towarów
```typescript
interface RotationReport {
  itemId: string;
  period: 'month' | 'quarter' | 'year';
  entries: number;             // wejścia
  exits: number;               // wyjścia
  rotationDays: number;        // ile dni obrót
  value: number;               // wartość rotacji
}
```

#### Wykres Rotacji (Recharts)
- Line Chart: Stan w czasie
- Bar Chart: Wejścia vs Wyjścia
- Pie Chart: Kategorie produktów

---

## 3. UI/UX

### 3.1 Dashboard Magazynu
```
┌─────────────────────────────────────────┐
│ 📦 MAGAZYN - Dashboard                  │
├─────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │ 1,234  │ │   45   │ │  12    │       │
│ │Produkty│ │Kategor.│ │ Alerty │       │
│ └────────┘ └────────┘ └────────┘       │
├─────────────────────────────────────────┤
│ 🔍 Wyszukaj produkt...                  │
├─────────────────────────────────────────┤
│ [Wszystkie ▼] [+ Nowy PZ] [+ Nowy WZ]  │
├─────────────────────────────────────────┤
│ Tabela produktów:                       │
│ │SKU    │Nazwa      │Stan │Alert│Akcje││
│ │PRD-001│Monitor 24"│ 15  │  ✓  │[...]││
│ │PRD-002│Klawiatura │  3  │  ⚠️  │[...]││
│ └────────────────────────────────────────│
├─────────────────────────────────────────┤
│ 📊 Wykres rotacji (ostatnie 6 mies.)   │
│ [Line Chart Component]                  │
└─────────────────────────────────────────┘
```

### 3.2 Formularz PZ
```
┌─────────────────────────────────────────┐
│ 📥 Nowe Przyjęcie Zewnętrzne (PZ)       │
├─────────────────────────────────────────┤
│ Numer: PZ/2025/[auto]                   │
│ Data: [2025-01-15]                      │
│ Dostawca: [Wybierz...]                  │
├─────────────────────────────────────────┤
│ Pozycje:                                │
│ [+ Dodaj produkt]                       │
│ │Produkt    │Ilość│Cena │Partia │Ważn.││
│ │Monitor 24"│ 10  │450zł│BP-001│2027  ││
│ │           │     │     │      │      ││
├─────────────────────────────────────────┤
│ Wartość: 4,500.00 PLN                   │
│ Notatki: [...]                          │
│ [Zapisz szkic] [Zatwierdź]              │
└─────────────────────────────────────────┘
```

---

## 4. Baza Danych (D1)

```sql
CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit TEXT,
  quantity REAL DEFAULT 0,
  min_quantity REAL,
  max_quantity REAL,
  location TEXT,
  purchase_price REAL,
  sale_price REAL,
  supplier TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_batches (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  batch_number TEXT,
  quantity REAL,
  production_date DATE,
  expiry_date DATE,
  purchase_price REAL,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE TABLE inventory_movements (
  id TEXT PRIMARY KEY,
  type TEXT, -- 'PZ', 'WZ', 'MM' (przesunięcie)
  number TEXT UNIQUE,
  date DATETIME,
  status TEXT,
  partner TEXT, -- dostawca/odbiorca
  total_value REAL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_movement_items (
  id TEXT PRIMARY KEY,
  movement_id TEXT,
  item_id TEXT,
  batch_id TEXT,
  quantity REAL,
  price REAL,
  purpose TEXT,
  FOREIGN KEY (movement_id) REFERENCES inventory_movements(id),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id),
  FOREIGN KEY (batch_id) REFERENCES inventory_batches(id)
);

CREATE TABLE inventory_alerts (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  type TEXT, -- 'low_stock', 'expiring', 'overstock'
  message TEXT,
  severity TEXT, -- 'info', 'warning', 'critical'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  acknowledged BOOLEAN DEFAULT 0,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);
```

---

## 5. API Endpoints

```typescript
// GET /api/magazyn/items - lista produktów
// GET /api/magazyn/items/:id - szczegóły produktu
// POST /api/magazyn/items - dodaj produkt
// PUT /api/magazyn/items/:id - edytuj produkt
// DELETE /api/magazyn/items/:id - usuń produkt

// GET /api/magazyn/movements - lista dokumentów
// POST /api/magazyn/movements/pz - utwórz PZ
// POST /api/magazyn/movements/wz - utwórz WZ
// PUT /api/magazyn/movements/:id - edytuj dokument
// POST /api/magazyn/movements/:id/approve - zatwierdź

// GET /api/magazyn/alerts - alerty
// POST /api/magazyn/alerts/:id/acknowledge - potwierdź

// GET /api/magazyn/reports/rotation - raport rotacji
// GET /api/magazyn/reports/value - wartość magazynu
```

---

## 6. Wykresy (Recharts)

### 6.1 Stan w czasie (Line Chart)
```tsx
<LineChart data={historyData}>
  <Line dataKey="quantity" stroke="#3b82f6" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
</LineChart>
```

### 6.2 Wejścia vs Wyjścia (Bar Chart)
```tsx
<BarChart data={monthlyData}>
  <Bar dataKey="entries" fill="#10b981" name="Wejścia" />
  <Bar dataKey="exits" fill="#ef4444" name="Wyjścia" />
  <XAxis dataKey="month" />
  <YAxis />
  <Legend />
</BarChart>
```

### 6.3 Kategorie (Pie Chart)
```tsx
<PieChart>
  <Pie data={categories} dataKey="value" nameKey="name" />
  <Tooltip />
</PieChart>
```

---

## 7. Eksport

### PDF (jsPDF + autoTable)
```typescript
const exportToPDF = (items: InventoryItem[]) => {
  const doc = new jsPDF();
  doc.text('Raport Magazynowy', 14, 15);
  doc.autoTable({
    head: [['SKU', 'Nazwa', 'Stan', 'Wartość']],
    body: items.map(i => [i.sku, i.name, i.quantity, i.quantity * i.price.purchase])
  });
  doc.save('magazyn.pdf');
};
```

### Excel (xlsx)
```typescript
const exportToExcel = (items: InventoryItem[]) => {
  const ws = XLSX.utils.json_to_sheet(items);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Magazyn');
  XLSX.writeFile(wb, 'magazyn.xlsx');
};
```

---

## 8. Priorytety Implementacji

1. **Faza 1** (MVP):
   - ✅ Struktura danych
   - [ ] Dashboard podstawowy
   - [ ] Lista produktów (CRUD)
   - [ ] Dodawanie PZ/WZ
   - [ ] localStorage persistence

2. **Faza 2**:
   - [ ] Partie i daty ważności
   - [ ] Alerty niskich stanów
   - [ ] Wykresy Recharts
   - [ ] Eksport PDF/Excel

3. **Faza 3**:
   - [ ] D1 Database integration
   - [ ] Kody kreskowe
   - [ ] Inwentaryzacja
   - [ ] Mobile PWA

---

**Status**: 🟡 W trakcie implementacji
**Odpowiedzialny**: Claude AI
**Data**: 2025-01-15
