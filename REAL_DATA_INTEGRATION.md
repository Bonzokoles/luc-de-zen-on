# 🔌 Jak Dodać Prawdziwe Dane do Każdej Strony

## 📋 Instrukcje dla Każdego Komponentu

---

## 1️⃣ Kalkulator Biznesowy (`KalkulatorBiznesowy.tsx`)

### Gdzie: `src/components/narzedzia/KalkulatorBiznesowy.tsx`

### Co Zmienić:

**PRZED (przykładowe dane):**
```tsx
const chartData = marginToChartData(cost, price, margin, marginPercent);
```

**PO (prawdziwe dane z API):**
```tsx
import { saveLocalCalculation } from '../utils/dataIntegration';

const handleCalculate = async () => {
  const margin = price - cost;
  const marginPercent = (margin / price) * 100;
  
  // ZAPISZ DO LOCALSTORAGE
  saveLocalCalculation({
    type: 'margin',
    inputs: { cost, price },
    results: { margin, marginPercent }
  });
  
  // LUB ZAPISZ DO API
  await fetch('/api/calculations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'margin',
      inputs: { cost, price },
      results: { margin, marginPercent }
    })
  });
  
  setMargin(margin);
  setMarginPercent(marginPercent);
};
```

### Dodaj Historię Obliczeń:

```tsx
import { getLocalCalculations } from '../utils/dataIntegration';

const [history, setHistory] = useState([]);

useEffect(() => {
  // Załaduj historię przy starcie
  const saved = getLocalCalculations('margin');
  setHistory(saved.slice(0, 5)); // Ostatnie 5
}, []);

// Wyświetl w UI
{history.length > 0 && (
  <div className="card mt-6">
    <h3 className="text-lg font-bold mb-4">📜 Ostatnie Obliczenia</h3>
    {history.map((calc, i) => (
      <div key={i} className="p-3 bg-business-dark rounded mb-2">
        {formatCurrency(calc.inputs.cost)} → {formatCurrency(calc.inputs.price)}
        <span className="text-business-accent ml-4">
          {calc.results.marginPercent.toFixed(1)}%
        </span>
      </div>
    ))}
  </div>
)}
```

---

## 2️⃣ Music Player Visualizer (`MusicPlayerVisualizer.tsx`)

### Gdzie: `src/components/MusicPlayerVisualizer.tsx`

### Dodaj Własne Tracki:

**PRZED (przykładowe tracki):**
```tsx
const tracks = [
  { title: 'Lo-fi Beat 1', url: '/audio/lofi-1.mp3' },
  // ...
];
```

**PO (tracki z API/bazy):**
```tsx
const [tracks, setTracks] = useState([]);

useEffect(() => {
  // Opcja 1: Z localStorage
  const savedTracks = JSON.parse(localStorage.getItem('myTracks') || '[]');
  setTracks(savedTracks);
  
  // Opcja 2: Z API
  fetch('/api/music/tracks')
    .then(res => res.json())
    .then(data => setTracks(data));
    
  // Opcja 3: Z Supabase
  supabase
    .from('tracks')
    .select('*')
    .then(({ data }) => setTracks(data));
}, []);
```

### Upload Własnych Plików:

```tsx
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('audio/')) {
    const url = URL.createObjectURL(file);
    const newTrack = {
      title: file.name,
      url: url
    };
    
    setTracks(prev => [...prev, newTrack]);
    
    // Zapisz w localStorage
    localStorage.setItem('myTracks', JSON.stringify([...tracks, newTrack]));
  }
};

// W UI:
<input 
  type="file" 
  accept="audio/*" 
  onChange={handleFileUpload}
  className="hidden"
  id="audio-upload"
/>
<label htmlFor="audio-upload" className="btn-secondary cursor-pointer">
  📁 Dodaj Utwór
</label>
```

---

## 3️⃣ Generator Treści (`GeneratorTresci.tsx`)

### Gdzie: `src/components/narzedzia/GeneratorTresci.tsx`

### Dodaj Zapisywanie Historii:

```tsx
import { useState, useEffect } from 'react';

const [savedContent, setSavedContent] = useState([]);

// Zapisz wygenerowaną treść
const saveContent = () => {
  const newContent = {
    id: Date.now(),
    type: contentType,
    content: generatedContent,
    date: new Date().toISOString()
  };
  
  const updated = [newContent, ...savedContent].slice(0, 10); // Ostatnie 10
  setSavedContent(updated);
  localStorage.setItem('generatedContent', JSON.stringify(updated));
};

// Załaduj przy starcie
useEffect(() => {
  const saved = localStorage.getItem('generatedContent');
  if (saved) {
    setSavedContent(JSON.parse(saved));
  }
}, []);

// UI dla historii
<div className="card mt-6">
  <h3 className="text-xl font-bold mb-4">📚 Ostatnie Treści</h3>
  {savedContent.map(item => (
    <div key={item.id} className="p-4 bg-business-dark rounded mb-2">
      <div className="flex justify-between">
        <span className="font-bold">{item.type}</span>
        <span className="text-sm text-business-text-dim">
          {new Date(item.date).toLocaleDateString('pl-PL')}
        </span>
      </div>
      <p className="text-sm mt-2 line-clamp-2">{item.content}</p>
      <button 
        onClick={() => setGeneratedContent(item.content)}
        className="text-business-accent text-sm mt-2"
      >
        📋 Użyj ponownie
      </button>
    </div>
  ))}
</div>
```

---

## 4️⃣ Asystent Email (`AsystentEmail.tsx`)

### Gdzie: `src/components/narzedzia/AsystentEmail.tsx`

### Zapisz Szablony Email:

```tsx
const [templates, setTemplates] = useState([]);

// Zapisz email jako szablon
const saveAsTemplate = () => {
  const template = {
    id: Date.now(),
    title: recipient + ' - ' + emailType,
    recipient,
    purpose,
    tone,
    content: generatedEmail,
    date: new Date()
  };
  
  const updated = [...templates, template];
  setTemplates(updated);
  localStorage.setItem('emailTemplates', JSON.stringify(updated));
  alert('✅ Zapisano jako szablon!');
};

// Załaduj szablony
useEffect(() => {
  const saved = localStorage.getItem('emailTemplates');
  if (saved) {
    setTemplates(JSON.parse(saved));
  }
}, []);

// Użyj szablonu
const useTemplate = (template) => {
  setRecipient(template.recipient);
  setPurpose(template.purpose);
  setTone(template.tone);
  setGeneratedEmail(template.content);
};

// UI dla szablonów
<div className="card">
  <h3 className="text-lg font-bold mb-4">💾 Moje Szablony</h3>
  {templates.map(t => (
    <div key={t.id} className="p-3 bg-business-dark rounded mb-2">
      <div className="flex justify-between items-center">
        <span>{t.title}</span>
        <button 
          onClick={() => useTemplate(t)}
          className="btn-secondary text-sm"
        >
          Użyj
        </button>
      </div>
    </div>
  ))}
</div>
```

---

## 5️⃣ Strona Główna (`index.astro`)

### Gdzie: `src/pages/index.astro`

### Dodaj Statystyki z API:

```astro
---
// Pobierz statystyki przy budowaniu strony
let stats = {
  users: 0,
  calculations: 0,
  generated: 0
};

try {
  // Z API
  const response = await fetch('https://your-api.com/stats');
  stats = await response.json();
  
  // LUB z bazy danych bezpośrednio
  // const db = await connectDB();
  // stats = await db.collection('stats').findOne();
} catch (error) {
  console.error('Błąd pobierania statystyk:', error);
}
---

<section class="stats-section">
  <div class="stat-card">
    <h3>👥 Użytkownicy</h3>
    <p class="text-4xl font-bold">{stats.users}</p>
  </div>
  <div class="stat-card">
    <h3>🧮 Obliczenia</h3>
    <p class="text-4xl font-bold">{stats.calculations}</p>
  </div>
  <div class="stat-card">
    <h3>✨ Wygenerowane</h3>
    <p class="text-4xl font-bold">{stats.generated}</p>
  </div>
</section>
```

---

## 6️⃣ Wykresy i Tabele

### Gdzie: Dowolny komponent używający wykresów

### Podłącz Prawdziwe Dane:

```tsx
import { AnimatedLineChart } from '../components/shared/ChartComponents';

const MyDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Pobierz dane z API
    fetch('/api/analytics/monthly')
      .then(res => res.json())
      .then(data => {
        // Przekształć na format dla wykresu
        const formatted = data.map(item => ({
          name: item.month,
          revenue: item.revenue,
          costs: item.costs,
          profit: item.revenue - item.costs
        }));
        
        setChartData(formatted);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <div className="text-center py-12">Ładowanie danych...</div>;
  }
  
  return (
    <AnimatedLineChart
      data={chartData}
      dataKeys={[
        { key: 'revenue', name: 'Przychody', color: '#10b981' },
        { key: 'costs', name: 'Koszty', color: '#ef4444' },
        { key: 'profit', name: 'Zysk', color: '#0ea5e9' }
      ]}
      xKey="name"
      title="📈 Wyniki Miesięczne"
      height={400}
    />
  );
};
```

---

## 📡 Tworzenie Własnego API

### Przykład: Endpoint dla Obliczeń

Stwórz: `src/pages/api/calculations.ts`

```typescript
import type { APIRoute } from 'astro';

// Prosta "baza danych" w pamięci (dla testów)
// W produkcji użyj prawdziwej bazy danych
let calculations = [];

export const GET: APIRoute = async ({ url }) => {
  const type = url.searchParams.get('type');
  
  // Filtruj po typie jeśli podano
  const filtered = type 
    ? calculations.filter(c => c.type === type)
    : calculations;
  
  return new Response(
    JSON.stringify(filtered),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  
  // Walidacja
  if (!data.type || !data.inputs || !data.results) {
    return new Response(
      JSON.stringify({ error: 'Niepełne dane' }),
      { status: 400 }
    );
  }
  
  // Dodaj timestamp i ID
  const newCalculation = {
    id: Date.now(),
    ...data,
    timestamp: new Date().toISOString()
  };
  
  calculations.unshift(newCalculation);
  
  // Ogranicz do 1000 ostatnich
  calculations = calculations.slice(0, 1000);
  
  return new Response(
    JSON.stringify({ success: true, id: newCalculation.id }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
```

### Użycie w komponencie:

```tsx
// Zapisz obliczenie
const saveCalculation = async (type, inputs, results) => {
  try {
    const response = await fetch('/api/calculations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, inputs, results })
    });
    
    const data = await response.json();
    console.log('Zapisano:', data);
  } catch (error) {
    console.error('Błąd zapisu:', error);
  }
};

// Pobierz obliczenia
const fetchCalculations = async (type) => {
  try {
    const response = await fetch(`/api/calculations?type=${type}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Błąd pobierania:', error);
    return [];
  }
};
```

---

## 🗄️ Integracja z Bazą Danych

### Opcja 1: Supabase (Najłatwiejsza)

#### 1. Zainstaluj:
```bash
npm install @supabase/supabase-js
```

#### 2. Stwórz tabelę w Supabase Dashboard:

```sql
create table calculations (
  id uuid default uuid_generate_v4() primary key,
  type text not null,
  inputs jsonb not null,
  results jsonb not null,
  created_at timestamp default now()
);
```

#### 3. Użyj w komponencie:

```tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
);

// Zapisz
const saveToSupabase = async (calculation) => {
  const { data, error } = await supabase
    .from('calculations')
    .insert([calculation]);
    
  if (error) console.error(error);
  else console.log('Zapisano:', data);
};

// Pobierz
const fetchFromSupabase = async (type) => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(10);
    
  return data || [];
};
```

### Opcja 2: Firebase

```bash
npm install firebase
```

```tsx
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = { /* ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Zapisz
const saveToFirebase = async (calculation) => {
  const docRef = await addDoc(collection(db, 'calculations'), calculation);
  console.log('Zapisano:', docRef.id);
};

// Pobierz
const fetchFromFirebase = async (type) => {
  const q = query(
    collection(db, 'calculations'),
    where('type', '==', type)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

---

## ⚡ Szybkie Startery

### 1. localStorage (Bez backendu) ✅ NAJSZYBSZE

```tsx
// Zapisz
localStorage.setItem('myData', JSON.stringify(data));

// Pobierz
const data = JSON.parse(localStorage.getItem('myData') || '[]');
```

### 2. API Endpoint (Średnio)

```typescript
// src/pages/api/data.ts
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  // Zapisz w bazie
  return new Response(JSON.stringify({ ok: true }));
};
```

### 3. Supabase (Zalecane dla produkcji)

```tsx
const { data } = await supabase.from('table').insert([...]);
```

---

## 🎯 Checklist Integracji

### Dla Każdej Strony:

- [ ] Zidentyfikuj gdzie są przykładowe dane
- [ ] Zdecyduj gdzie przechowasz dane (localStorage/API/DB)
- [ ] Dodaj funkcje zapisu (`save...`)
- [ ] Dodaj funkcje odczytu (`fetch...` / `get...`)
- [ ] Dodaj obsługę błędów (`try/catch`)
- [ ] Dodaj stany ładowania (`loading`)
- [ ] Pokaż użytkownikowi co się dzieje
- [ ] Przetestuj z prawdziwymi danymi
- [ ] Dodaj walidację danych
- [ ] (Opcjonalnie) Dodaj eksport danych

---

## 🆘 Potrzebujesz Pomocy?

1. Sprawdź przykłady w `src/examples/CalculatorIntegrationExample.tsx`
2. Przeczytaj pełny przewodnik w `src/examples/API_INTEGRATION_GUIDE.md`
3. Użyj narzędzi z `src/utils/dataIntegration.ts`

**Gotowe funkcje pomocnicze:**
- `marginToChartData()` - Konwersja danych marży
- `vatToChartData()` - Konwersja danych VAT
- `roiToChartData()` - Konwersja danych ROI
- `profitToChartData()` - Konwersja danych zysku
- `saveLocalCalculation()` - Zapis do localStorage
- `getLocalCalculations()` - Odczyt z localStorage
- `exportToCSV()` - Eksport do CSV
- `exportToJSON()` - Eksport do JSON
- `formatCurrency()` - Formatowanie walut
- `formatPercent()` - Formatowanie procentów

---

## 📝 Przykład Pełnej Integracji

```tsx
import { useState, useEffect } from 'react';
import { 
  marginToChartData,
  saveLocalCalculation,
  getLocalCalculations,
  formatCurrency 
} from '../utils/dataIntegration';
import { AnimatedPieChart, AnimatedBarChart } from '../components/shared/ChartComponents';
import { ComparisonTable } from '../components/shared/TableComponents';

const FullIntegrationExample = () => {
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Załaduj historię
  useEffect(() => {
    const saved = getLocalCalculations('margin');
    setHistory(saved);
  }, []);
  
  // Oblicz i zapisz
  const handleCalculate = () => {
    const margin = price - cost;
    const marginPercent = (margin / price) * 100;
    
    // Zapisz
    saveLocalCalculation({
      type: 'margin',
      inputs: { cost, price },
      results: { margin, marginPercent }
    });
    
    // Odśwież historię
    setHistory(getLocalCalculations('margin'));
    setShowResults(true);
  };
  
  const margin = price - cost;
  const marginPercent = (margin / price) * 100;
  const chartData = marginToChartData(cost, price, margin, marginPercent);
  
  return (
    <div className="space-y-6">
      {/* Formularz */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Kalkulator Marży</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            placeholder="Koszt"
            className="input-field"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Cena"
            className="input-field"
          />
        </div>
        <button onClick={handleCalculate} className="btn-primary w-full mt-4">
          💰 Oblicz i Zapisz
        </button>
      </div>
      
      {/* Wykresy */}
      {showResults && price > 0 && cost > 0 && (
        <>
          <AnimatedPieChart
            data={chartData.pieData}
            title="💰 Struktura Ceny"
          />
          <ComparisonTable
            title="📊 Scenariusze"
            categories={['Koszt', 'Cena', 'Zysk', 'Marża']}
            items={chartData.comparisonData}
          />
        </>
      )}
      
      {/* Historia */}
      {history.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">📜 Historia Obliczeń</h3>
          {history.slice(0, 5).map((calc, i) => (
            <div key={i} className="p-3 bg-business-dark rounded mb-2">
              <div className="flex justify-between">
                <span>
                  {formatCurrency(calc.inputs.cost as number)} → 
                  {formatCurrency(calc.inputs.price as number)}
                </span>
                <span className="text-business-accent font-bold">
                  {calc.results.marginPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

**Gotowe! Masz teraz pełną instrukcję jak dodać prawdziwe dane do każdej strony aplikacji.** 🎉
