import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ========== INTERFACES ==========

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unit: 'szt' | 'kg' | 'l' | 'm';
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  location: string;
  barcodes: string[];
  ean?: string;
  price: {
    purchase: number;
    sale: number;
  };
  supplier: string;
  lastUpdated: Date;
  batches: Batch[];
}

interface Batch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate?: Date;
  productionDate: Date;
  purchasePrice: number;
}

interface PZ {
  id: string;
  number: string;
  date: Date;
  supplier: string;
  items: PZItem[];
  totalValue: number;
  status: 'draft' | 'approved' | 'completed';
  notes: string;
  documents: string[];
}

interface PZItem {
  itemId: string;
  quantity: number;
  price: number;
  batchNumber?: string;
  expiryDate?: Date;
}

interface WZ {
  id: string;
  number: string;
  date: Date;
  recipient: string;
  project?: string;
  items: WZItem[];
  totalValue: number;
  status: 'draft' | 'approved' | 'completed';
  notes: string;
}

interface WZItem {
  itemId: string;
  quantity: number;
  batchId?: string;
  purpose: string;
}

interface Alert {
  id: string;
  itemId: string;
  type: 'low_stock' | 'expiring' | 'overstock';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: Date;
  acknowledged: boolean;
}

// ========== DEMO DATA ==========

// ⚠️ DANE DEMO WYZEROWANE - użyj formularza aby dodać produkty do magazynu
const demoItems: InventoryItem[] = [];

const demoAlerts: Alert[] = [];

const historyData = [
  { date: '2024-08', quantity: 45 },
  { date: '2024-09', quantity: 52 },
  { date: '2024-10', quantity: 48 },
  { date: '2024-11', quantity: 61 },
  { date: '2024-12', quantity: 72 },
  { date: '2025-01', quantity: 98 }
];

const movementData = [
  { month: 'Sie', entries: 25, exits: 18 },
  { month: 'Wrz', entries: 32, exits: 25 },
  { month: 'Paź', entries: 28, exits: 32 },
  { month: 'Lis', entries: 45, exits: 32 },
  { month: 'Gru', entries: 52, exits: 41 },
  { month: 'Sty', entries: 38, exits: 12 }
];

const categoryData = [
  { name: 'Elektronika', value: 46, color: '#3b82f6' },
  { name: 'Akcesoria', value: 52, color: '#10b981' }
];

// ========== COMPONENT ==========

export default function Magazyn() {
  const [activeView, setActiveView] = useState<'dashboard' | 'items' | 'pz' | 'wz' | 'reports'>('dashboard');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Formularz nowego produktu
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Formularz PZ
  const [showPZForm, setShowPZForm] = useState(false);
  const [pzItems, setPzItems] = useState<PZItem[]>([]);
  const [pzSupplier, setPzSupplier] = useState('');
  const [pzNotes, setPzNotes] = useState('');

  // Formularz WZ
  const [showWZForm, setShowWZForm] = useState(false);
  const [wzItems, setWzItems] = useState<WZItem[]>([]);
  const [wzRecipient, setWzRecipient] = useState('');
  const [wzProject, setWzProject] = useState('');
  const [wzNotes, setWzNotes] = useState('');

  // AI Optymalizacja
  const [aiOptResult, setAiOptResult] = useState('');
  const [aiOptLoading, setAiOptLoading] = useState(false);

  // Import CSV
  const [csvImportResult, setCsvImportResult] = useState('');

  // Korekta stanu
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [correctionProductId, setCorrectionProductId] = useState('');
  const [correctionQuantity, setCorrectionQuantity] = useState(0);
  const [correctionReason, setCorrectionReason] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('erp-magazyn-items');
    const savedAlerts = localStorage.getItem('erp-magazyn-alerts');

    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(demoItems);
    }

    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    } else {
      setAlerts(demoAlerts);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('erp-magazyn-items', JSON.stringify(items));
    }
  }, [items]);

  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem('erp-magazyn-alerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  // Filtrowanie
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Kategorie unikalne
  const categories = Array.from(new Set(items.map(i => i.category)));

  // Statystyki
  const totalItems = items.length;
  const totalCategories = categories.length;
  const criticalAlerts = alerts.filter(a => !a.acknowledged && a.severity === 'critical').length;
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price.purchase), 0);
  const lowStockCount = items.filter(i => i.quantity <= i.minQuantity).length;
  const avgMarza = items.length > 0
    ? items.reduce((s, i) => s + (i.price.sale > 0 && i.price.purchase > 0 ? ((i.price.sale - i.price.purchase) / i.price.purchase) * 100 : 0), 0) / items.filter(i => i.price.sale > 0 && i.price.purchase > 0).length || 0
    : 0;

  // ========== CRUD FUNCTIONS ==========

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      sku: formData.get('sku') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as 'szt' | 'kg' | 'l' | 'm',
      quantity: Number(formData.get('quantity')),
      minQuantity: Number(formData.get('minQuantity')),
      maxQuantity: Number(formData.get('maxQuantity')),
      location: formData.get('location') as string,
      barcodes: [],
      price: {
        purchase: Number(formData.get('purchasePrice')),
        sale: Number(formData.get('salePrice'))
      },
      supplier: formData.get('supplier') as string,
      lastUpdated: new Date(),
      batches: [],
      ean: (formData.get('ean') as string) || undefined
    };

    setItems([...items, newItem]);
    setShowItemForm(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  // ========== PZ FUNCTIONS ==========

  const handleAddPZ = () => {
    if (pzItems.length === 0 || !pzSupplier) {
      alert('Wypełnij wszystkie pola');
      return;
    }

    // Update quantities
    pzItems.forEach(pzItem => {
      setItems(items.map(item =>
        item.id === pzItem.itemId
          ? { ...item, quantity: item.quantity + pzItem.quantity, lastUpdated: new Date() }
          : item
      ));
    });

    // Reset form
    setPzItems([]);
    setPzSupplier('');
    setPzNotes('');
    setShowPZForm(false);
    alert('PZ utworzone pomyślnie!');
  };

  // ========== WZ FUNCTIONS ==========

  const handleAddWZ = () => {
    if (wzItems.length === 0 || !wzRecipient) {
      alert('Wypełnij wszystkie pola');
      return;
    }

    // Update quantities
    wzItems.forEach(wzItem => {
      setItems(items.map(item =>
        item.id === wzItem.itemId
          ? { ...item, quantity: item.quantity - wzItem.quantity, lastUpdated: new Date() }
          : item
      ));
    });

    // Reset form
    setWzItems([]);
    setWzRecipient('');
    setWzProject('');
    setWzNotes('');
    setShowWZForm(false);
    alert('WZ utworzone pomyślnie!');
  };

  // ========== AI OPTYMALIZACJA ==========

  const handleAIOptymalizacja = async () => {
    if (items.length === 0) return;
    setAiOptLoading(true);
    try {
      const lowStock = items.filter(i => i.quantity <= i.minQuantity);
      const totalVal = items.reduce((s, i) => s + i.quantity * i.price.purchase, 0);
      const avgRotation = items.length > 0
        ? items.reduce((s, i) => s + (i.maxQuantity > 0 ? i.quantity / i.maxQuantity : 0), 0) / items.length
        : 0;

      const report = `🤖 **Analiza AI Optymalizacji Magazynu**\n\n` +
        `📊 Podsumowanie:\n` +
        `• Produktów: ${items.length}\n` +
        `• Wartość magazynu: ${totalVal.toLocaleString('pl-PL')} PLN\n` +
        `• Produkty z niskim stanem: ${lowStock.length}\n` +
        `• Śr. wypełnienie: ${(avgRotation * 100).toFixed(0)}%\n\n` +
        `🔴 TOP produkty do domówienia:\n` +
        lowStock.slice(0, 5).map((p, i) =>
          `${i + 1}. ${p.name} (${p.sku}): stan ${p.quantity}/${p.minQuantity} — PILNE`
        ).join('\n') + (lowStock.length === 0 ? '  Brak alertów — stany OK ✅' : '') +
        `\n\n💡 Rekomendacje:\n` +
        `• Wprowadź klasyfikację ABC (20% produktów = 80% wartości)\n` +
        `• Ustaw automatyczne alerty SMS/email przy ${lowStock.length > 3 ? 'krytycznych' : 'niskich'} stanach\n` +
        `• Rozważ zwiększenie minimalnych stanów dla top-sellerów\n` +
        `• Szacunkowy koszt reorder: ${lowStock.reduce((s, p) => s + (p.minQuantity - p.quantity) * p.price.purchase, 0).toLocaleString('pl-PL')} PLN`;

      setAiOptResult(report);
    } catch (e) {
      setAiOptResult('❌ Błąd analizy AI: ' + (e as Error).message);
    }
    setAiOptLoading(false);
  };

  // ========== IMPORT CSV ==========

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) {
          setCsvImportResult('❌ Plik CSV musi mieć nagłówek i min. 1 wiersz');
          return;
        }

        const header = lines[0].toLowerCase().split(/[;,\t]/);
        const nameIdx = header.findIndex(h => h.includes('nazwa') || h.includes('name'));
        const skuIdx = header.findIndex(h => h.includes('sku') || h.includes('kod'));
        const qtyIdx = header.findIndex(h => h.includes('ilosc') || h.includes('quantity') || h.includes('stan'));
        const catIdx = header.findIndex(h => h.includes('kategoria') || h.includes('category'));
        const priceIdx = header.findIndex(h => h.includes('cena') || h.includes('price'));

        if (nameIdx === -1) {
          setCsvImportResult('❌ Brak kolumny "nazwa" w CSV');
          return;
        }

        let imported = 0;
        const newItems: InventoryItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(/[;,\t]/);
          if (!cols[nameIdx]?.trim()) continue;

          newItems.push({
            id: `csv_${Date.now()}_${i}`,
            sku: skuIdx >= 0 ? cols[skuIdx]?.trim() || `SKU-${i}` : `SKU-${i}`,
            name: cols[nameIdx].trim(),
            description: '',
            category: catIdx >= 0 ? cols[catIdx]?.trim() || 'Import' : 'Import',
            unit: 'szt',
            quantity: qtyIdx >= 0 ? Number(cols[qtyIdx]) || 0 : 0,
            minQuantity: 5,
            maxQuantity: 100,
            location: '',
            barcodes: [],
            price: {
              purchase: priceIdx >= 0 ? Number(cols[priceIdx]) || 0 : 0,
              sale: 0
            },
            supplier: '',
            lastUpdated: new Date(),
            batches: []
          });
          imported++;
        }

        setItems(prev => [...prev, ...newItems]);
        setCsvImportResult(`✅ Zaimportowano ${imported} produktów z CSV`);
      } catch (err) {
        setCsvImportResult('❌ Błąd parsowania CSV: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ========== KOREKTA STANU ==========

  const handleCorrection = () => {
    if (!correctionProductId || correctionQuantity === 0) return;

    setItems(items.map(item =>
      item.id === correctionProductId
        ? { ...item, quantity: item.quantity + correctionQuantity, lastUpdated: new Date() }
        : item
    ));

    // Generuj alert jeśli stan spadł poniżej minimum
    const item = items.find(i => i.id === correctionProductId);
    if (item && (item.quantity + correctionQuantity) <= item.minQuantity) {
      setAlerts(prev => [...prev, {
        id: `alert_${Date.now()}`,
        itemId: correctionProductId,
        type: 'low_stock',
        message: `Niski stan: ${item.name} (${item.quantity + correctionQuantity}/${item.minQuantity})`,
        severity: (item.quantity + correctionQuantity) <= 0 ? 'critical' : 'warning',
        createdAt: new Date(),
        acknowledged: false
      }]);
    }

    setCorrectionProductId('');
    setCorrectionQuantity(0);
    setCorrectionReason('');
    setShowCorrectionForm(false);
  };

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              📦 Magazyn ERP
            </h1>
            <p className="text-slate-400">Zarządzanie stanem magazynowym, dokumenty PZ/WZ, raporty, AI optymalizacja</p>
          </div>
          <button
            onClick={() => {
              const msg = prompt('🤖 the_ANT_04 (Magazyn) — Zadaj pytanie o magazyn, stany, importy, alerty:');
              if (!msg) return;
              // Prosta odpowiedź agenta na podstawie danych
              const lowItems = items.filter(i => i.quantity <= i.minQuantity);
              const answer = `🤖 the_ANT_04 odpowiada:\n\n` +
                `Stan magazynu: ${items.length} produktów, ${lowItems.length} z niskim stanem.\n` +
                `Wartość: ${items.reduce((s, i) => s + i.quantity * i.price.purchase, 0).toLocaleString('pl-PL')} PLN\n\n` +
                (lowItems.length > 0
                  ? `⚠️ Produkty do domówienia:\n${lowItems.map(p => `• ${p.name} (${p.quantity}/${p.minQuantity})`).join('\n')}\n\n`
                  : `✅ Wszystkie stany OK!\n\n`) +
                `💡 Wskazówka: Użyj "AI Optymalizacja" w dashboardzie dla pełnej analizy ABC.`;
              alert(answer);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            🤖 the_ANT_04
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'items', label: '📦 Produkty', icon: '📦' },
            { id: 'pz', label: '📥 Przyjęcia (PZ)', icon: '📥' },
            { id: 'wz', label: '📤 Wydania (WZ)', icon: '📤' },
            { id: 'reports', label: '📈 Raporty', icon: '📈' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeView === view.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400">{totalItems}</div>
                <div className="text-sm text-slate-400 mt-1">Produkty</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-red-400">{lowStockCount}</div>
                <div className="text-sm text-slate-400 mt-1">Niski stan</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-emerald-400">{totalValue.toLocaleString('pl-PL')} zł</div>
                <div className="text-sm text-slate-400 mt-1">Wartość magazynu</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-cyan-400">{avgMarza.toFixed(1)}%</div>
                <div className="text-sm text-slate-400 mt-1">Śr. marża</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-orange-400">{criticalAlerts}</div>
                <div className="text-sm text-slate-400 mt-1">Alerty krytyczne</div>
              </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAIOptymalizacja}
                disabled={aiOptLoading || items.length === 0}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                {aiOptLoading ? '⏳' : '🤖'} AI Optymalizacja
              </button>
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors">
                📥 Import CSV
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
              <button
                onClick={() => setShowCorrectionForm(true)}
                disabled={items.length === 0}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                🔄 Korekta stanu
              </button>
            </div>

            {/* AI Optymalizacja Result */}
            {aiOptResult && (
              <div className="bg-purple-950/30 border border-purple-700/50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-purple-300">🤖 Analiza AI Optymalizacji</h3>
                  <button onClick={() => setAiOptResult('')} className="text-slate-400 hover:text-white text-sm">✕</button>
                </div>
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{aiOptResult}</div>
              </div>
            )}

            {/* CSV Import Result */}
            {csvImportResult && (
              <div className={`border rounded-xl p-4 ${csvImportResult.startsWith('✅') ? 'bg-emerald-950/30 border-emerald-700/50' : 'bg-red-950/30 border-red-700/50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{csvImportResult}</span>
                  <button onClick={() => setCsvImportResult('')} className="text-slate-400 hover:text-white text-sm ml-4">✕</button>
                </div>
              </div>
            )}

            {/* Korekta Stanu Modal */}
            {showCorrectionForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
                  <h2 className="text-xl font-bold mb-4">🔄 Korekta stanu magazynowego</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Produkt *</label>
                      <select
                        value={correctionProductId}
                        onChange={(e) => setCorrectionProductId(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Wybierz produkt...</option>
                        {items.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.sku}) — stan: {item.quantity} {item.unit}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Zmiana ilości (+ dodaj, - odejmij) *</label>
                      <input
                        type="number"
                        value={correctionQuantity}
                        onChange={(e) => setCorrectionQuantity(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="np. +10 lub -5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Powód korekty</label>
                      <input
                        type="text"
                        value={correctionReason}
                        onChange={(e) => setCorrectionReason(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="np. inwentaryzacja, uszkodzenie, zwrot"
                      />
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={handleCorrection}
                        disabled={!correctionProductId || correctionQuantity === 0}
                        className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium disabled:opacity-50"
                      >
                        Zatwierdź korektę
                      </button>
                      <button
                        onClick={() => setShowCorrectionForm(false)}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alerts */}
            {alerts.filter(a => !a.acknowledged).length > 0 && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  ⚠️ Alerty ({alerts.filter(a => !a.acknowledged).length})
                </h3>
                <div className="space-y-2">
                  {alerts.filter(a => !a.acknowledged).map(alert => (
                    <div key={alert.id} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {alert.severity === 'critical' ? '🔴' : '🟡'}
                        </span>
                        <div>
                          <p className="text-white">{alert.message}</p>
                          <p className="text-xs text-slate-400">{new Date(alert.createdAt).toLocaleDateString('pl-PL')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                      >
                        Potwierdź
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Line Chart - Stan w czasie */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">📈 Stan magazynu w czasie</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Line type="monotone" dataKey="quantity" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart - Wejścia vs Wyjścia */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">📊 Wejścia vs Wyjścia</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={movementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend />
                    <Bar dataKey="entries" fill="#10b981" name="Wejścia" />
                    <Bar dataKey="exits" fill="#ef4444" name="Wyjścia" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Kategorie */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">🥧 Produkty wg kategorii</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

        {/* Items View */}
        {activeView === 'items' && (
          <div className="space-y-6">

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Szukaj produktu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wszystkie kategorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={() => setShowItemForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium whitespace-nowrap"
              >
                + Nowy produkt
              </button>
            </div>

            {/* Items Table */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">SKU</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Nazwa</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Kategoria</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Stan</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Min</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Wartość</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Marża</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Akcje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredItems.map(item => {
                      const isLow = item.quantity <= item.minQuantity;
                      const value = item.quantity * item.price.purchase;

                      return (
                        <tr key={item.id} className="hover:bg-slate-900/30">
                          <td className="px-6 py-4 text-sm font-mono">{item.sku}</td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-slate-400">{item.location}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">{item.category}</td>
                          <td className="px-6 py-4 text-right font-bold">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-slate-400">
                            {item.minQuantity} {item.unit}
                          </td>
                          <td className="px-6 py-4">
                            {isLow ? (
                              <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded">
                                ⚠️ Niski stan
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded">
                                ✓ OK
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-sm">
                            {value.toLocaleString('pl-PL')} zł
                          </td>
                          <td className="px-6 py-4 text-right text-sm">
                            {(() => {
                              const m = item.price.purchase > 0 ? ((item.price.sale - item.price.purchase) / item.price.purchase * 100) : 0;
                              return <span className={m > 30 ? 'text-green-400 font-bold' : m > 10 ? 'text-yellow-400' : 'text-red-400'}>{m.toFixed(1)}%</span>;
                            })()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 hover:bg-red-900/30 rounded text-red-400"
                                title="Usuń"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Item Form Modal */}
            {showItemForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-6">➕ Dodaj nowy produkt</h2>
                  <form onSubmit={handleAddItem} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">SKU *</label>
                        <input name="sku" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nazwa *</label>
                        <input name="name" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Opis</label>
                      <textarea name="description" rows={2} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Kategoria *</label>
                        <input name="category" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Jednostka *</label>
                        <select name="unit" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="szt">szt</option>
                          <option value="kg">kg</option>
                          <option value="l">l</option>
                          <option value="m">m</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Stan początkowy *</label>
                        <input name="quantity" type="number" step="0.01" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Min *</label>
                        <input name="minQuantity" type="number" step="0.01" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Max *</label>
                        <input name="maxQuantity" type="number" step="0.01" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cena zakupu (PLN) *</label>
                        <input name="purchasePrice" type="number" step="0.01" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cena sprzedaży (PLN) *</label>
                        <input name="salePrice" type="number" step="0.01" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Lokalizacja *</label>
                        <input name="location" placeholder="A-01-03" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Dostawca *</label>
                        <input name="supplier" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">EAN (kod kreskowy)</label>
                        <input name="ean" placeholder="5901234123457" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                      >
                        Dodaj produkt
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowItemForm(false)}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
                      >
                        Anuluj
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PZ View */}
        {activeView === 'pz' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">📥 Nowe Przyjęcie Zewnętrzne (PZ)</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Numer dokumentu</label>
                    <input
                      type="text"
                      value={`PZ/2025/${String(Date.now()).slice(-3)}`}
                      disabled
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dostawca *</label>
                  <input
                    type="text"
                    value={pzSupplier}
                    onChange={(e) => setPzSupplier(e.target.value)}
                    placeholder="Nazwa dostawcy"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dodaj produkty</label>
                  <div className="flex gap-2">
                    <select
                      id="pz-product"
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wybierz produkt...</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.sku})
                        </option>
                      ))}
                    </select>
                    <input
                      id="pz-quantity"
                      type="number"
                      placeholder="Ilość"
                      step="0.01"
                      className="w-32 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      id="pz-price"
                      type="number"
                      placeholder="Cena"
                      step="0.01"
                      className="w-32 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const productSelect = document.getElementById('pz-product') as unknown as HTMLSelectElement;
                        const quantityInput = document.getElementById('pz-quantity') as HTMLInputElement;
                        const priceInput = document.getElementById('pz-price') as HTMLInputElement;

                        if (productSelect.value && quantityInput.value && priceInput.value) {
                          setPzItems([...pzItems, {
                            itemId: productSelect.value,
                            quantity: Number(quantityInput.value),
                            price: Number(priceInput.value)
                          }]);
                          quantityInput.value = '';
                          priceInput.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      + Dodaj
                    </button>
                  </div>
                </div>

                {pzItems.length > 0 && (
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Pozycje dokumentu:</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-400">
                          <th className="pb-2">Produkt</th>
                          <th className="pb-2 text-right">Ilość</th>
                          <th className="pb-2 text-right">Cena</th>
                          <th className="pb-2 text-right">Wartość</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pzItems.map((pzItem, idx) => {
                          const item = items.find(i => i.id === pzItem.itemId);
                          return (
                            <tr key={idx} className="border-t border-slate-700">
                              <td className="py-2">{item?.name}</td>
                              <td className="py-2 text-right">{pzItem.quantity} {item?.unit}</td>
                              <td className="py-2 text-right">{pzItem.price} zł</td>
                              <td className="py-2 text-right font-bold">
                                {(pzItem.quantity * pzItem.price).toFixed(2)} zł
                              </td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => setPzItems(pzItems.filter((_, i) => i !== idx))}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  🗑️
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-slate-700 font-bold">
                          <td colSpan={3} className="py-2">SUMA:</td>
                          <td className="py-2 text-right">
                            {pzItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)} zł
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Notatki</label>
                  <textarea
                    value={pzNotes}
                    onChange={(e) => setPzNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddPZ}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium"
                  >
                    ✓ Zatwierdź PZ
                  </button>
                  <button
                    onClick={() => {
                      setPzItems([]);
                      setPzSupplier('');
                      setPzNotes('');
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
                  >
                    Wyczyść
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WZ View */}
        {activeView === 'wz' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">📤 Nowe Wydanie Zewnętrzne (WZ)</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Numer dokumentu</label>
                    <input
                      type="text"
                      value={`WZ/2025/${String(Date.now()).slice(-3)}`}
                      disabled
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Odbiorca *</label>
                    <input
                      type="text"
                      value={wzRecipient}
                      onChange={(e) => setWzRecipient(e.target.value)}
                      placeholder="Nazwa odbiorcy"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Projekt (opcjonalnie)</label>
                    <input
                      type="text"
                      value={wzProject}
                      onChange={(e) => setWzProject(e.target.value)}
                      placeholder="Nazwa projektu"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dodaj produkty</label>
                  <div className="flex gap-2">
                    <select
                      id="wz-product"
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Wybierz produkt...</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.sku}) - Stan: {item.quantity} {item.unit}
                        </option>
                      ))}
                    </select>
                    <input
                      id="wz-quantity"
                      type="number"
                      placeholder="Ilość"
                      step="0.01"
                      className="w-32 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      id="wz-purpose"
                      type="text"
                      placeholder="Cel wydania"
                      className="w-48 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const productSelect = document.getElementById('wz-product') as unknown as HTMLSelectElement;
                        const quantityInput = document.getElementById('wz-quantity') as HTMLInputElement;
                        const purposeInput = document.getElementById('wz-purpose') as HTMLInputElement;

                        if (productSelect.value && quantityInput.value) {
                          const item = items.find(i => i.id === productSelect.value);
                          if (item && Number(quantityInput.value) <= item.quantity) {
                            setWzItems([...wzItems, {
                              itemId: productSelect.value,
                              quantity: Number(quantityInput.value),
                              purpose: purposeInput.value || 'Wydanie'
                            }]);
                            quantityInput.value = '';
                            purposeInput.value = '';
                          } else {
                            alert('Niewystarczająca ilość w magazynie!');
                          }
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      + Dodaj
                    </button>
                  </div>
                </div>

                {wzItems.length > 0 && (
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Pozycje dokumentu:</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-400">
                          <th className="pb-2">Produkt</th>
                          <th className="pb-2 text-right">Ilość</th>
                          <th className="pb-2">Cel</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {wzItems.map((wzItem, idx) => {
                          const item = items.find(i => i.id === wzItem.itemId);
                          return (
                            <tr key={idx} className="border-t border-slate-700">
                              <td className="py-2">{item?.name}</td>
                              <td className="py-2 text-right">{wzItem.quantity} {item?.unit}</td>
                              <td className="py-2">{wzItem.purpose}</td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => setWzItems(wzItems.filter((_, i) => i !== idx))}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  🗑️
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Notatki</label>
                  <textarea
                    value={wzNotes}
                    onChange={(e) => setWzNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddWZ}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium"
                  >
                    ✓ Zatwierdź WZ
                  </button>
                  <button
                    onClick={() => {
                      setWzItems([]);
                      setWzRecipient('');
                      setWzProject('');
                      setWzNotes('');
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
                  >
                    Wyczyść
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports View */}
        {activeView === 'reports' && (
          <div className="space-y-6">
            {/* Podsumowanie raportu */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">📈 Raporty i Analizy</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Łączna wartość (zakup)</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {items.reduce((s, i) => s + i.quantity * i.price.purchase, 0).toLocaleString('pl-PL')} zł
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Łączna wartość (sprzedaż)</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {items.reduce((s, i) => s + i.quantity * i.price.sale, 0).toLocaleString('pl-PL')} zł
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Potencjalny zysk (marża)</div>
                  <div className="text-2xl font-bold text-amber-400">
                    {items.reduce((s, i) => s + i.quantity * (i.price.sale - i.price.purchase), 0).toLocaleString('pl-PL')} zł
                  </div>
                </div>
              </div>

              {/* Tabela stanu */}
              {items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Stan magazynowy — podsumowanie</h3>
                  <div className="overflow-x-auto bg-slate-900/50 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-400 border-b border-slate-700">
                          <th className="px-4 py-2">Produkt</th>
                          <th className="px-4 py-2">Kategoria</th>
                          <th className="px-4 py-2 text-right">Stan</th>
                          <th className="px-4 py-2 text-right">Min</th>
                          <th className="px-4 py-2 text-right">Wart. zakupu</th>
                          <th className="px-4 py-2 text-right">Wart. sprzedaży</th>
                          <th className="px-4 py-2 text-right">Marża %</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => {
                          const marza = item.price.purchase > 0
                            ? ((item.price.sale - item.price.purchase) / item.price.purchase * 100)
                            : 0;
                          return (
                            <tr key={item.id} className="border-b border-slate-800">
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2 text-slate-400">{item.category}</td>
                              <td className="px-4 py-2 text-right font-bold">{item.quantity} {item.unit}</td>
                              <td className="px-4 py-2 text-right text-slate-400">{item.minQuantity}</td>
                              <td className="px-4 py-2 text-right">{(item.quantity * item.price.purchase).toLocaleString('pl-PL')} zł</td>
                              <td className="px-4 py-2 text-right">{(item.quantity * item.price.sale).toLocaleString('pl-PL')} zł</td>
                              <td className={`px-4 py-2 text-right font-bold ${marza > 30 ? 'text-green-400' : marza > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {marza.toFixed(1)}%
                              </td>
                              <td className="px-4 py-2">
                                {item.quantity <= item.minQuantity
                                  ? <span className="text-red-400 text-xs">⚠️ Niski</span>
                                  : <span className="text-green-400 text-xs">✅ OK</span>
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Eksport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const header = 'SKU;Nazwa;Kategoria;Stan;Min;CenaZakupu;CenaSprzedazy;Marza%;Lokalizacja;Dostawca\n';
                    const rows = items.map(i => {
                      const m = i.price.purchase > 0 ? ((i.price.sale - i.price.purchase) / i.price.purchase * 100).toFixed(1) : '0';
                      return `${i.sku};${i.name};${i.category};${i.quantity};${i.minQuantity};${i.price.purchase};${i.price.sale};${m};${i.location};${i.supplier}`;
                    }).join('\n');
                    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `magazyn_raport_${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-6 bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl hover:border-emerald-500/50 transition-all text-left"
                >
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold mb-1">Eksport do CSV</h3>
                  <p className="text-sm text-slate-400">Pobierz pełny raport magazynowy</p>
                </button>

                <button
                  onClick={handleAIOptymalizacja}
                  disabled={aiOptLoading || items.length === 0}
                  className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all text-left disabled:opacity-50"
                >
                  <div className="text-3xl mb-3">🤖</div>
                  <h3 className="font-bold mb-1">AI Analiza</h3>
                  <p className="text-sm text-slate-400">{aiOptLoading ? 'Analizuję...' : 'Optymalizacja stanów i rekomendacje'}</p>
                </button>
              </div>

              {/* AI Result in reports */}
              {aiOptResult && (
                <div className="mt-4 bg-purple-950/30 border border-purple-700/50 rounded-xl p-6">
                  <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{aiOptResult}</div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
