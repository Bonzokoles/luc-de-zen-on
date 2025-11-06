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

const demoItems: InventoryItem[] = [
  {
    id: '1',
    sku: 'PRD-001',
    name: 'Monitor 24" Dell',
    description: 'Monitor LED 24 cale, Full HD',
    category: 'Elektronika',
    unit: 'szt',
    quantity: 15,
    minQuantity: 5,
    maxQuantity: 50,
    location: 'A-01-03',
    barcodes: ['5901234567890'],
    price: { purchase: 450, sale: 650 },
    supplier: 'Tech Distribution Sp. z o.o.',
    lastUpdated: new Date('2025-01-10'),
    batches: [
      {
        id: 'b1',
        batchNumber: 'BP-2025-001',
        quantity: 15,
        productionDate: new Date('2024-12-01'),
        purchasePrice: 450
      }
    ]
  },
  {
    id: '2',
    sku: 'PRD-002',
    name: 'Klawiatura mechaniczna RGB',
    description: 'Klawiatura mechaniczna, przełączniki Blue',
    category: 'Elektronika',
    unit: 'szt',
    quantity: 3,
    minQuantity: 10,
    maxQuantity: 30,
    location: 'A-01-05',
    barcodes: ['5901234567891'],
    price: { purchase: 180, sale: 280 },
    supplier: 'Gaming Gear Polska',
    lastUpdated: new Date('2025-01-12'),
    batches: [
      {
        id: 'b2',
        batchNumber: 'BP-2025-002',
        quantity: 3,
        productionDate: new Date('2024-11-15'),
        purchasePrice: 180
      }
    ]
  },
  {
    id: '3',
    sku: 'PRD-003',
    name: 'Myszka bezprzewodowa',
    description: 'Myszka optyczna, bezprzewodowa, 1600 DPI',
    category: 'Elektronika',
    unit: 'szt',
    quantity: 28,
    minQuantity: 15,
    maxQuantity: 50,
    location: 'A-02-01',
    barcodes: ['5901234567892'],
    price: { purchase: 45, sale: 85 },
    supplier: 'Tech Distribution Sp. z o.o.',
    lastUpdated: new Date('2025-01-08'),
    batches: [
      {
        id: 'b3',
        batchNumber: 'BP-2025-003',
        quantity: 28,
        productionDate: new Date('2024-12-20'),
        purchasePrice: 45
      }
    ]
  },
  {
    id: '4',
    sku: 'PRD-004',
    name: 'Kabel HDMI 2m',
    description: 'Kabel HDMI 2.0, 2 metry, 4K support',
    category: 'Akcesoria',
    unit: 'szt',
    quantity: 52,
    minQuantity: 20,
    maxQuantity: 100,
    location: 'B-03-02',
    barcodes: ['5901234567893'],
    price: { purchase: 15, sale: 35 },
    supplier: 'Cable World',
    lastUpdated: new Date('2025-01-05'),
    batches: [
      {
        id: 'b4',
        batchNumber: 'BP-2025-004',
        quantity: 52,
        productionDate: new Date('2024-11-01'),
        purchasePrice: 15
      }
    ]
  }
];

const demoAlerts: Alert[] = [
  {
    id: 'a1',
    itemId: '2',
    type: 'low_stock',
    message: 'Klawiatura mechaniczna RGB - stan niższy niż minimum (3 < 10)',
    severity: 'critical',
    createdAt: new Date('2025-01-12'),
    acknowledged: false
  },
  {
    id: 'a2',
    itemId: '1',
    type: 'low_stock',
    message: 'Monitor 24" Dell - zbliża się do minimum (15 > 5)',
    severity: 'warning',
    createdAt: new Date('2025-01-10'),
    acknowledged: false
  }
];

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
      batches: []
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

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            📦 Magazyn ERP
          </h1>
          <p className="text-slate-400">Zarządzanie stanem magazynowym, dokumenty PZ/WZ, raporty</p>
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
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === view.id
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400">{totalItems}</div>
                <div className="text-sm text-slate-400 mt-1">Produkty</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-cyan-400">{totalCategories}</div>
                <div className="text-sm text-slate-400 mt-1">Kategorie</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-red-400">{criticalAlerts}</div>
                <div className="text-sm text-slate-400 mt-1">Alerty</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <div className="text-3xl font-bold text-emerald-400">{totalValue.toLocaleString('pl-PL')} zł</div>
                <div className="text-sm text-slate-400 mt-1">Wartość magazynu</div>
              </div>
            </div>

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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Lokalizacja *</label>
                        <input name="location" placeholder="A-01-03" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Dostawca *</label>
                        <input name="supplier" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                        const productSelect = document.getElementById('pz-product') as HTMLSelectElement;
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
                        const productSelect = document.getElementById('wz-product') as HTMLSelectElement;
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
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">📈 Raporty i Analizy</h2>
              <p className="text-slate-400 mb-4">
                Dostępne wkrótce: Eksport PDF, Excel, raporty rotacji towarów, wartości magazynu.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all text-left">
                  <div className="text-3xl mb-3">📄</div>
                  <h3 className="font-bold mb-1">Eksport do PDF</h3>
                  <p className="text-sm text-slate-400">Wygeneruj raport magazynowy w PDF</p>
                </button>

                <button className="p-6 bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl hover:border-emerald-500/50 transition-all text-left">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold mb-1">Eksport do Excel</h3>
                  <p className="text-sm text-slate-400">Pobierz dane w formacie XLSX</p>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
