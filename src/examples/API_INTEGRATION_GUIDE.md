# 📘 Przewodnik Integracji API z Prawdziwymi Danymi

## 📋 Spis Treści
1. [Szybki Start](#szybki-start)
2. [Integracja z localStorage](#localstorage)
3. [Integracja z własnym API](#własne-api)
4. [Integracja z bazą danych](#baza-danych)
5. [Live Updates (WebSocket)](#websocket)
6. [Eksport danych](#eksport)

---

## 🚀 Szybki Start

### Krok 1: Import narzędzi

```tsx
import {
  marginToChartData,
  saveLocalCalculation,
  getLocalCalculations,
  formatCurrency
} from '../utils/dataIntegration';
```

### Krok 2: Użyj w komponencie

```tsx
const MyCalculator = () => {
  const [cost, setCost] = useState(100);
  const [price, setPrice] = useState(150);
  
  const calculate = () => {
    const margin = price - cost;
    const marginPercent = (margin / price) * 100;
    
    // Konwertuj na dane dla wykresów
    const chartData = marginToChartData(cost, price, margin, marginPercent);
    
    // Zapisz obliczenie
    saveLocalCalculation({
      type: 'margin',
      inputs: { cost, price },
      results: { margin, marginPercent }
    });
    
    return chartData;
  };
  
  return (
    <div>
      {/* Twoje wykresy tutaj */}
      <AnimatedPieChart data={calculate().pieData} />
    </div>
  );
};
```

---

## 💾 localStorage (Bez Backendu)

### Zapisywanie danych

```tsx
import { saveLocalCalculation } from '../utils/dataIntegration';

const handleCalculate = () => {
  const result = performCalculation();
  
  // Zapisz w przeglądarce
  saveLocalCalculation({
    type: 'margin',
    inputs: { cost: 100, price: 150 },
    results: { margin: 50, marginPercent: 33.33 }
  });
};
```

### Odczyt danych

```tsx
import { getLocalCalculations } from '../utils/dataIntegration';

const MyComponent = () => {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    // Pobierz wszystkie obliczenia typu 'margin'
    const data = getLocalCalculations('margin');
    setHistory(data);
  }, []);
  
  return (
    <div>
      <h3>Historia obliczeń:</h3>
      {history.map((calc, i) => (
        <div key={i}>
          Koszt: {calc.inputs.cost} → Marża: {calc.results.marginPercent}%
        </div>
      ))}
    </div>
  );
};
```

---

## 🌐 Własne API

### 1. Utwórz endpoint API (przykład Astro)

Stwórz plik: `src/pages/api/calculations.ts`

```typescript
import type { APIRoute } from 'astro';

// GET - Pobierz obliczenia
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  
  // TODO: Pobierz z bazy danych
  const calculations = await database.getCalculations(type);
  
  return new Response(JSON.stringify(calculations), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// POST - Zapisz obliczenie
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  
  // TODO: Zapisz do bazy danych
  await database.saveCalculation({
    ...data,
    timestamp: new Date(),
    userId: 'user-id' // z sesji
  });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
```

### 2. Użyj w komponencie

```tsx
import { fetchCalculationHistory, saveCalculation } from '../utils/dataIntegration';

const MyComponent = () => {
  const [data, setData] = useState([]);
  
  // Pobierz dane
  useEffect(() => {
    fetchCalculationHistory('margin').then(setData);
  }, []);
  
  // Zapisz nowe
  const handleSave = async (calculation) => {
    const success = await saveCalculation(calculation);
    if (success) {
      // Odśwież listę
      const updated = await fetchCalculationHistory('margin');
      setData(updated);
    }
  };
  
  return <div>{/* ... */}</div>;
};
```

---

## 🗄️ Integracja z Bazą Danych

### Opcja 1: Supabase

#### 1. Zainstaluj Supabase

```bash
npm install @supabase/supabase-js
```

#### 2. Konfiguracja

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_KEY
);
```

#### 3. Stwórz tabelę w Supabase

```sql
CREATE TABLE calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  type TEXT NOT NULL,
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

#### 4. Użyj w komponencie

```tsx
import { supabase } from '../lib/supabase';

const saveToDatabase = async (calculation) => {
  const { data, error } = await supabase
    .from('calculations')
    .insert([{
      type: calculation.type,
      inputs: calculation.inputs,
      results: calculation.results
    }]);
  
  if (error) {
    console.error('Błąd zapisu:', error);
    return false;
  }
  
  return true;
};

const fetchFromDatabase = async (type) => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('type', type)
    .order('timestamp', { ascending: false })
    .limit(10);
  
  return data || [];
};
```

### Opcja 2: MongoDB

```typescript
// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(import.meta.env.MONGODB_URI);

export async function saveCalculation(calculation) {
  await client.connect();
  const db = client.db('business');
  const result = await db.collection('calculations').insertOne({
    ...calculation,
    timestamp: new Date()
  });
  return result.insertedId;
}

export async function getCalculations(type) {
  await client.connect();
  const db = client.db('business');
  return await db.collection('calculations')
    .find(type ? { type } : {})
    .sort({ timestamp: -1 })
    .limit(100)
    .toArray();
}
```

---

## 🔌 WebSocket (Live Updates)

### 1. Serwer WebSocket (przykład Node.js)

```javascript
// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Klient połączony');
  
  // Wysyłaj dane co 5 sekund
  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      timestamp: new Date().toISOString(),
      value: Math.random() * 100,
      metric: 'revenue'
    }));
  }, 5000);
  
  ws.on('close', () => {
    clearInterval(interval);
  });
});
```

### 2. Klient w React

```tsx
const LiveDataComponent = () => {
  const [liveData, setLiveData] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onmessage = (event) => {
      const newPoint = JSON.parse(event.data);
      setLiveData(prev => [...prev.slice(-50), newPoint]); // Ostatnie 50
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => ws.close();
  }, []);
  
  return (
    <AnimatedLineChart
      data={liveData}
      dataKeys={[{ key: 'value', name: 'Wartość', color: '#0ea5e9' }]}
      xKey="timestamp"
      title="📡 Dane na żywo"
    />
  );
};
```

---

## 📤 Eksport Danych

### CSV Export

```tsx
import { exportToCSV } from '../utils/dataIntegration';

const ExportButton = () => {
  const handleExport = () => {
    const data = [
      { date: '2024-01-01', revenue: 1000, costs: 600, profit: 400 },
      { date: '2024-01-02', revenue: 1200, costs: 700, profit: 500 }
    ];
    
    exportToCSV(data, 'raport-finansowy.csv');
  };
  
  return (
    <button onClick={handleExport} className="btn-primary">
      📥 Eksportuj CSV
    </button>
  );
};
```

### JSON Export

```tsx
import { exportToJSON } from '../utils/dataIntegration';

const handleExportJSON = () => {
  const data = {
    period: '2024-Q1',
    summary: {
      revenue: 50000,
      costs: 30000,
      profit: 20000
    },
    details: [/* ... */]
  };
  
  exportToJSON(data, 'raport-q1-2024.json');
};
```

---

## 🎯 Przykłady Użycia w Kalkulatorach

### Kalkulator Marży z API

```tsx
const MarginCalculator = () => {
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  
  const handleCalculate = async () => {
    const margin = price - cost;
    const marginPercent = (margin / price) * 100;
    
    setSaving(true);
    
    // Zapisz do API
    await fetch('/api/calculations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'margin',
        inputs: { cost, price },
        results: { margin, marginPercent }
      })
    });
    
    setSaving(false);
    
    // Pokaż wyniki w wykresach
    const chartData = marginToChartData(cost, price, margin, marginPercent);
    return chartData;
  };
  
  return (
    <div>
      <input 
        type="number" 
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
        placeholder="Koszt"
      />
      <input 
        type="number" 
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Cena"
      />
      <button onClick={handleCalculate} disabled={saving}>
        {saving ? 'Zapisuję...' : 'Oblicz i Zapisz'}
      </button>
    </div>
  );
};
```

### Dashboard z Danymi z API

```tsx
const FinancialDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Pobierz dane finansowe
    fetch('/api/financial-summary')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Ładowanie...</div>;
  
  const chartData = profitToChartData(
    data.revenue,
    data.costs,
    data.profit,
    data.profitMargin
  );
  
  return (
    <div className="space-y-6">
      <AnimatedLineChart
        data={chartData.lineData}
        dataKeys={[
          { key: 'przychody', name: 'Przychody', color: '#10b981' },
          { key: 'koszty', name: 'Koszty', color: '#ef4444' }
        ]}
        xKey="name"
        title="📈 Trend 6-miesięczny"
      />
      
      <DataTable
        title="📊 Podsumowanie"
        columns={[
          { key: 'metric', label: 'Metryka', align: 'left' },
          { key: 'value', label: 'Wartość', align: 'right' }
        ]}
        data={chartData.analysisData}
      />
    </div>
  );
};
```

---

## ⚙️ Zmienne Środowiskowe

Stwórz plik `.env`:

```env
# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_KEY=your-anon-key

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# WebSocket
WS_URL=wss://your-api.com/live

# API Keys
OPENAI_API_KEY=sk-...
```

Użyj w kodzie:

```typescript
const apiKey = import.meta.env.OPENAI_API_KEY;
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
```

---

## 🔒 Bezpieczeństwo

### 1. Walidacja danych

```typescript
function validateCalculation(data: any) {
  if (typeof data.cost !== 'number' || data.cost < 0) {
    throw new Error('Nieprawidłowy koszt');
  }
  if (typeof data.price !== 'number' || data.price < 0) {
    throw new Error('Nieprawidłowa cena');
  }
  return true;
}
```

### 2. Rate Limiting

```typescript
// src/middleware/rateLimit.ts
const requests = new Map();

export function rateLimit(userId: string, limit = 100) {
  const now = Date.now();
  const userRequests = requests.get(userId) || [];
  
  // Usuń stare requesty (starsze niż 1h)
  const recent = userRequests.filter(time => now - time < 3600000);
  
  if (recent.length >= limit) {
    throw new Error('Zbyt wiele żądań');
  }
  
  recent.push(now);
  requests.set(userId, recent);
  return true;
}
```

### 3. Sanityzacja danych

```typescript
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}
```

---

## 📊 Monitorowanie

### Logowanie błędów

```typescript
function logError(error: Error, context: any) {
  console.error('Error:', error);
  
  // Wyślij do serwisu monitoringu (np. Sentry)
  // Sentry.captureException(error, { extra: context });
}
```

### Metryki wydajności

```typescript
const performanceMonitor = {
  start: (operation: string) => {
    performance.mark(`${operation}-start`);
  },
  
  end: (operation: string) => {
    performance.mark(`${operation}-end`);
    performance.measure(
      operation,
      `${operation}-start`,
      `${operation}-end`
    );
    
    const measure = performance.getEntriesByName(operation)[0];
    console.log(`${operation} took ${measure.duration}ms`);
  }
};

// Użycie
performanceMonitor.start('calculation');
const result = performCalculation();
performanceMonitor.end('calculation');
```

---

## ✅ Checklist Integracji

- [ ] Wybierz metodę przechowywania danych (localStorage/API/DB)
- [ ] Stwórz strukturę danych (typy TypeScript)
- [ ] Zaimplementuj funkcje zapisu i odczytu
- [ ] Dodaj walidację danych wejściowych
- [ ] Obsłuż błędy i stany ładowania
- [ ] Dodaj eksport danych (CSV/JSON)
- [ ] Zabezpiecz API (autentykacja, rate limiting)
- [ ] Przetestuj z prawdziwymi danymi
- [ ] Dodaj logowanie i monitoring
- [ ] Zoptymalizuj wydajność

---

## 🆘 Częste Problemy

### Problem: CORS przy API

**Rozwiązanie:**
```typescript
// astro.config.mjs
export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:3000'
      }
    }
  }
});
```

### Problem: Dane nie zapisują się

**Rozwiązanie:**
1. Sprawdź console.log błędów
2. Zweryfikuj format danych
3. Upewnij się że endpoint działa (test w Postman)

### Problem: Wykresy nie renderują się

**Rozwiązanie:**
```typescript
// Upewnij się że dane mają poprawny format
const data = [
  { name: 'Jan', value: 100 }, // ✅ Dobrze
  { label: 'Feb', amount: 200 } // ❌ Źle - niepoprawne klucze
];
```

---

**Potrzebujesz pomocy?** Sprawdź przykłady w `src/examples/CalculatorIntegrationExample.tsx`
