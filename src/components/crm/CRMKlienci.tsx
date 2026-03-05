import { useState, useEffect, useRef } from 'react';
import { Users, Plus, Search, Edit2, Trash2, Mail, Phone, Building, Calendar, Tag, Download, Filter, MessageSquare, Clock, Upload, Brain, BarChart3, Bot, Globe, MapPin, Hash } from 'lucide-react';

interface Contact {
  id: string;
  date: string;
  type: 'email' | 'phone' | 'meeting' | 'note' | 'oferta' | 'faktura';
  description: string;
  wynik?: 'pozytywny' | 'negatywny' | 'neutralny';
  nastepneKroki?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  nip?: string;
  adres?: string;
  www?: string;
  status: 'lead' | 'konsultacja' | 'negocjacje' | 'active' | 'inactive' | 'vip';
  segment: string;
  value: number;
  szansaSprzedazy: number; // 0-100
  leadScore?: number; // 0-100 AI
  source: string;
  createdAt: string;
  lastContact: string;
  contacts: Contact[];
  notes: string;
  tags: string[];
}

interface LeadScoringResult {
  lead_score: number;
  rekomendacje: string[];
  szacowana_wartosc: number;
  uzasadnienie: string;
}

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
  lead: { label: 'Lead', color: 'bg-yellow-500/20 text-yellow-300', icon: '🔍' },
  konsultacja: { label: 'Konsultacja', color: 'bg-blue-500/20 text-blue-300', icon: '💬' },
  negocjacje: { label: 'Negocjacje', color: 'bg-orange-500/20 text-orange-300', icon: '🤝' },
  active: { label: 'Klient', color: 'bg-green-500/20 text-green-300', icon: '✅' },
  inactive: { label: 'Nieaktywny', color: 'bg-gray-500/20 text-gray-300', icon: 'ÔĆŞ´ŞĆ' },
  vip: { label: 'VIP', color: 'bg-purple-500/20 text-purple-300', icon: 'ÔşÉ' }
};

const CRMKlienci = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSegment, setFilterSegment] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    nip: '',
    adres: '',
    www: '',
    status: 'lead',
    segment: '',
    value: 0,
    szansaSprzedazy: 50,
    source: '',
    notes: '',
    tags: []
  });

  // New contact form
  const [newContact, setNewContact] = useState({
    type: 'note' as Contact['type'],
    description: '',
    wynik: '' as string,
    nastepneKroki: ''
  });

  // AI Lead Scoring
  const [aiScoring, setAiScoring] = useState<LeadScoringResult | null>(null);
  const [aiScoringLoading, setAiScoringLoading] = useState(false);
  const [aiPipelineReport, setAiPipelineReport] = useState('');
  const [aiPipelineLoading, setAiPipelineLoading] = useState(false);
  const [aiDailyReport, setAiDailyReport] = useState('');
  const [aiDailyLoading, setAiDailyLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Load clients from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crm-clients');
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      // ⚠️ DANE DEMONSTRACYJNE - wyzerowane. Rozpocznij pracę z narzędziami aby zobaczyć prawdziwe dane.
      const demoClients: Client[] = [];
      setClients(demoClients);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('crm-clients', JSON.stringify(clients));
    }
  }, [clients]);

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesSegment = filterSegment === 'all' || client.segment === filterSegment;

    return matchesSearch && matchesStatus && matchesSegment;
  });

  // Get unique segments
  const segments = Array.from(new Set(clients.map(c => c.segment).filter(Boolean)));

  // Statistics
  const stats = {
    total: clients.length,
    leads: clients.filter(c => c.status === 'lead').length,
    active: clients.filter(c => c.status === 'active').length,
    vip: clients.filter(c => c.status === 'vip').length,
    totalValue: clients.reduce((sum, c) => sum + (c.value || 0), 0),
    pipelineValue: clients
      .filter(c => ['lead', 'konsultacja', 'negocjacje'].includes(c.status))
      .reduce((sum, c) => sum + (c.value * (c.szansaSprzedazy || 50) / 100), 0),
    avgChance: clients.length > 0
      ? Math.round(clients.reduce((s, c) => s + (c.szansaSprzedazy || 50), 0) / clients.length)
      : 0
  };

  // Add/Update client
  const handleSaveClient = () => {
    if (!formData.name || !formData.email) {
      alert('Imię i email są wymagane!');
      return;
    }

    if (editMode && selectedClient) {
      // Update existing
      setClients(prev => prev.map(c =>
        c.id === selectedClient.id
          ? { ...c, ...formData }
          : c
      ));
      setShowDetailModal(false);
      setEditMode(false);
    } else {
      // Add new
      const newClient: Client = {
        ...formData as Client,
        id: `client-${Date.now()}`,
        szansaSprzedazy: formData.szansaSprzedazy ?? 50,
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        contacts: [],
        tags: formData.tags || []
      };
      setClients(prev => [newClient, ...prev]);
      setShowAddModal(false);
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      nip: '',
      adres: '',
      www: '',
      status: 'lead',
      segment: '',
      value: 0,
      szansaSprzedazy: 50,
      source: '',
      notes: '',
      tags: []
    });
  };

  // Delete client
  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      setClients(prev => prev.filter(c => c.id !== id));
      setShowDetailModal(false);
    }
  };

  // Add contact to client
  const handleAddContact = () => {
    if (!selectedClient || !newContact.description) return;

    const contact: Contact = {
      id: `contact-${Date.now()}`,
      date: new Date().toISOString(),
      type: newContact.type,
      description: newContact.description,
      wynik: newContact.wynik ? newContact.wynik as Contact['wynik'] : undefined,
      nastepneKroki: newContact.nastepneKroki || undefined,
    };

    setClients(prev => prev.map(c =>
      c.id === selectedClient.id
        ? {
          ...c,
          contacts: [contact, ...c.contacts],
          lastContact: new Date().toISOString()
        }
        : c
    ));

    setSelectedClient(prev => prev ? {
      ...prev,
      contacts: [contact, ...prev.contacts],
      lastContact: new Date().toISOString()
    } : null);

    setNewContact({ type: 'note', description: '', wynik: '', nastepneKroki: '' });
  };

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['Imię i Nazwisko', 'Email', 'Telefon', 'Firma', 'Status', 'Segment', 'Wartość', '┼╣ródło', 'Data utworzenia'],
      ...filteredClients.map(c => [
        c.name,
        c.email,
        c.phone,
        c.company,
        statusLabels[c.status].label,
        c.segment,
        c.value.toString(),
        c.source,
        new Date(c.createdAt).toLocaleDateString('pl-PL')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `klienci-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openDetailModal = (client: Client) => {
    setSelectedClient(client);
    setShowDetailModal(true);
    setEditMode(false);
    setAiScoring(null);
  };

  // AI Lead Scoring
  const handleAILeadScoring = async (client: Client) => {
    setAiScoringLoading(true);
    setAiScoring(null);
    try {
      // Symulacja AI - w produkcji fetch do /api/crm/ai/lead-scoring
      const interakcje = client.contacts || [];
      const lastContactDays = client.lastContact
        ? Math.floor((Date.now() - new Date(client.lastContact).getTime()) / 86400000)
        : 999;

      // Heurystyczny lead scoring (zastąpi API call)
      let score = 50;
      score += interakcje.length * 5; // Więcej interakcji = lepiej
      score += interakcje.filter(i => i.wynik === 'pozytywny').length * 10;
      score -= interakcje.filter(i => i.wynik === 'negatywny').length * 15;
      if (lastContactDays < 7) score += 15;
      else if (lastContactDays > 30) score -= 20;
      if (client.status === 'negocjacje') score += 20;
      else if (client.status === 'konsultacja') score += 10;
      if (client.value > 10000) score += 10;
      score = Math.max(0, Math.min(100, score));

      const rekomendacje: string[] = [];
      if (lastContactDays > 7) rekomendacje.push(`Zadzwoń — ostatni kontakt ${lastContactDays} dni temu`);
      if (client.status === 'lead') rekomendacje.push('Wyślij ofertę handlową');
      if (client.status === 'negocjacje') rekomendacje.push('Umów finalne spotkanie');
      if (interakcje.length < 3) rekomendacje.push('Zaplanuj demo produktu');
      if (rekomendacje.length === 0) rekomendacje.push('Utrzymuj regularny kontakt');

      setAiScoring({
        lead_score: score,
        rekomendacje,
        szacowana_wartosc: client.value || score * 250,
        uzasadnienie: `Ocena bazuje na ${interakcje.length} interakcjach, statusie "${client.status}" i aktywności w ostatnich ${lastContactDays} dniach.`
      });

      // Update client leadScore
      setClients(prev => prev.map(c =>
        c.id === client.id ? { ...c, leadScore: score, szansaSprzedazy: score } : c
      ));
      setSelectedClient(prev => prev ? { ...prev, leadScore: score, szansaSprzedazy: score } : null);
    } finally {
      setAiScoringLoading(false);
    }
  };

  // AI Pipeline Analysis
  const handleAIPipelineAnalysis = async () => {
    setAiPipelineLoading(true);
    try {
      const activeClients = clients.filter(c => !['inactive'].includes(c.status));
      const pipelineValue = activeClients.reduce((s, c) => s + (c.value * (c.szansaSprzedazy || 50) / 100), 0);
      const avgChance = activeClients.length > 0
        ? (activeClients.reduce((s, c) => s + (c.szansaSprzedazy || 50), 0) / activeClients.length).toFixed(0)
        : '0';

      const report = `📊 **Analiza Pipeline Sprzedaży**

**Podsumowanie:**
• Aktywnych klientów: ${activeClients.length}
• Wartość pipeline (ważona): ${pipelineValue.toLocaleString('pl-PL')} PLN
• Średnia szansa konwersji: ${avgChance}%
• Leadów: ${clients.filter(c => c.status === 'lead').length}
• W negocjacjach: ${clients.filter(c => c.status === 'negocjacje').length}

**🔥 Top 3 gorące leady:**
${activeClients
  .sort((a, b) => (b.szansaSprzedazy || 0) - (a.szansaSprzedazy || 0))
  .slice(0, 3)
  .map((c, i) => `${i + 1}. ${c.name} — ${c.szansaSprzedazy || 50}% szansy, ${c.value.toLocaleString('pl-PL')} PLN`)
  .join('\n')}

**✅ Rekomendacje:**
• Skup się na klientach w fazie negocjacji — tu jest najwyższa szansa zamknięcia
• Follow-up z leadami, które nie odpowiedziały >7 dni
• Zautomatyzuj emaile przypominające dla nieaktywnych leadów`;

      setAiPipelineReport(report);
    } finally {
      setAiPipelineLoading(false);
    }
  };

  // AI Daily Report
  const handleAIDailyReport = async () => {
    setAiDailyLoading(true);
    try {
      const today = new Date().toLocaleDateString('pl-PL');
      const todayContacts = clients.reduce((sum, c) =>
        sum + c.contacts.filter(ct => new Date(ct.date).toDateString() === new Date().toDateString()).length, 0);
      const newLeads = clients.filter(c =>
        c.status === 'lead' && new Date(c.createdAt).toDateString() === new Date().toDateString()).length;

      setAiDailyReport(`📊 **Raport dzienny CRM — ${today}**

**Kluczowe liczby:**
• Klientów łącznie: ${clients.length}
• Nowe leady dzisiaj: ${newLeads}
• Interakcje dzisiaj: ${todayContacts}
• Aktywni klienci: ${clients.filter(c => c.status === 'active').length}
• Wartość pipeline: ${clients.filter(c => ['lead', 'negocjacje', 'konsultacja'].includes(c.status)).reduce((s, c) => s + c.value, 0).toLocaleString('pl-PL')} PLN

**✅ Działania na jutro:**
• Sprawdź leady bez odpowiedzi
• Wyślij follow-up do klientów w negocjacjach
• Zaktualizuj szanse sprzedaży`);
    } finally {
      setAiDailyLoading(false);
    }
  };

  // Import CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) { alert('Plik CSV jest pusty lub ma tylko nagłówek'); return; }

      const imported: Client[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < 2) continue;

        imported.push({
          id: `csv-${Date.now()}-${i}`,
          name: cols[0] || '',
          email: cols[1] || '',
          phone: cols[2] || '',
          company: cols[3] || '',
          nip: cols[4] || '',
          status: 'lead',
          segment: cols[5] || '',
          value: parseFloat(cols[6]) || 0,
          szansaSprzedazy: 50,
          source: 'Import CSV',
          createdAt: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          contacts: [],
          notes: '',
          tags: []
        });
      }

      setClients(prev => [...imported, ...prev]);
      alert(`Zaimportowano ${imported.length} klientów z CSV`);
      setShowImportModal(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const startEdit = () => {
    if (selectedClient) {
      setFormData(selectedClient);
      setEditMode(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-primary-400" />
          CRM - Zarządzanie Klientami
        </h1>
        <p className="text-gray-300">
          Twoja baza klientów w jednym miejscu - historia kontaktów, segmentacja, wartość
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-400">Wszyscy</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.leads}</div>
          <div className="text-xs text-gray-400">Leady</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-xs text-gray-400">Klienci</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.vip}</div>
          <div className="text-xs text-gray-400">VIP</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-400">
            {(stats.totalValue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-400">Wartość (PLN)</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-400">
            {(stats.pipelineValue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-400">Pipeline</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.avgChance}%</div>
          <div className="text-xs text-gray-400">Śr. szansa</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj klienta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">Wszystkie statusy</option>
            <option value="lead">Lead</option>
            <option value="konsultacja">Konsultacja</option>
            <option value="negocjacje">Negocjacje</option>
            <option value="active">Klient</option>
            <option value="inactive">Nieaktywny</option>
            <option value="vip">VIP</option>
          </select>

          {/* Segment Filter */}
          {segments.length > 0 && (
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="input-field"
            >
              <option value="all">Wszystkie segmenty</option>
              {segments.map(seg => (
                <option key={seg} value={seg}>{seg}</option>
              ))}
            </select>
          )}

          {/* Actions */}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Dodaj klienta
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary flex items-center gap-2 whitespace-nowrap"
            title="Import z CSV"
          >
            <Upload className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={handleAIPipelineAnalysis}
            disabled={aiPipelineLoading || clients.length === 0}
            className="btn-secondary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            title="AI Analiza Pipeline"
          >
            <Brain className="w-4 h-4" />
            {aiPipelineLoading ? '...' : 'Pipeline AI'}
          </button>

          <button
            onClick={handleAIDailyReport}
            disabled={aiDailyLoading}
            className="btn-secondary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            title="Raport dzienny AI"
          >
            <BarChart3 className="w-4 h-4" />
            {aiDailyLoading ? '...' : 'Raport'}
          </button>

          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
            title="Eksportuj do CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Brak klientów do wyświetlenia</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-4"
            >
              Dodaj pierwszego klienta
            </button>
          </div>
        ) : (
          filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => openDetailModal(client)}
              className="card hover:border-primary-500 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-white text-lg">{client.name}</h3>
                  <p className="text-sm text-gray-400">{client.company}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${statusLabels[client.status].color}`}>
                  {statusLabels[client.status].icon} {statusLabels[client.status].label}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </div>
                )}
                {client.segment && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Tag className="w-4 h-4" />
                    {client.segment}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                <span>Wartość: {client.value.toLocaleString('pl-PL')} zł</span>
                <span className="flex items-center gap-2">
                  {client.leadScore !== undefined && (
                    <span className={`font-bold ${
                      client.leadScore >= 70 ? 'text-green-400' :
                      client.leadScore >= 40 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      🎯 {client.leadScore}/100
                    </span>
                  )}
                  <span>{client.szansaSprzedazy || 50}% szansa</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Dodaj nowego klienta</h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Imię i nazwisko *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="jan@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+48 123 456 789"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Firma</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                    placeholder="Nazwa firmy"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">NIP</label>
                  <input
                    type="text"
                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="input-field"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Adres</label>
                  <input
                    type="text"
                    value={formData.adres || ''}
                    onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                    className="input-field"
                    placeholder="ul. Przykładowa 1, Warszawa"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">WWW</label>
                  <input
                    type="url"
                    value={formData.www || ''}
                    onChange={(e) => setFormData({ ...formData, www: e.target.value })}
                    className="input-field"
                    placeholder="https://www.firma.pl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
                    className="input-field"
                  >
                    <option value="lead">Lead</option>
                    <option value="konsultacja">Konsultacja</option>
                    <option value="negocjacje">Negocjacje</option>
                    <option value="active">Klient</option>
                    <option value="inactive">Nieaktywny</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Segment</label>
                  <input
                    type="text"
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    className="input-field"
                    placeholder="np. Enterprise, SMB"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Wartość (PLN)</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Szansa sprzedaży %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.szansaSprzedazy ?? 50}
                    onChange={(e) => setFormData({ ...formData, szansaSprzedazy: Number(e.target.value) })}
                    className="input-field"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">┼╣ródło pozyskania</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="input-field"
                  placeholder="np. Rekomendacja, LinkedIn, Strona WWW"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Notatki</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Dodatkowe informacje o kliencie..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveClient} className="btn-primary flex-1">
                Dodaj klienta
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {editMode ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">Edytuj klienta</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Imię i nazwisko *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Telefon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Firma</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">NIP</label>
                      <input
                        type="text"
                        value={formData.nip || ''}
                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                        className="input-field"
                        placeholder="1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Adres</label>
                      <input
                        type="text"
                        value={formData.adres || ''}
                        onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                        className="input-field"
                        placeholder="ul. Przykładowa 1, Warszawa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">WWW</label>
                      <input
                        type="url"
                        value={formData.www || ''}
                        onChange={(e) => setFormData({ ...formData, www: e.target.value })}
                        className="input-field"
                        placeholder="https://www.firma.pl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
                        className="input-field"
                      >
                        <option value="lead">Lead</option>
                        <option value="konsultacja">Konsultacja</option>
                        <option value="negocjacje">Negocjacje</option>
                        <option value="active">Klient</option>
                        <option value="inactive">Nieaktywny</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Segment</label>
                      <input
                        type="text"
                        value={formData.segment}
                        onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Wartość (PLN)</label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Szansa sprzedaży %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.szansaSprzedazy ?? 50}
                        onChange={(e) => setFormData({ ...formData, szansaSprzedazy: Number(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">┼╣ródło</label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Notatki</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input-field resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={handleSaveClient} className="btn-primary flex-1">
                    Zapisz zmiany
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn-secondary"
                  >
                    Anuluj
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Client Details View */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                    <p className="text-gray-400">{selectedClient.company}</p>
                  </div>
                  <span className={`px-3 py-1 rounded ${statusLabels[selectedClient.status].color}`}>
                    {statusLabels[selectedClient.status].icon} {statusLabels[selectedClient.status].label}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mail className="w-5 h-5 text-primary-400" />
                      <a href={`mailto:${selectedClient.email}`} className="hover:text-primary-400">
                        {selectedClient.email}
                      </a>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <Phone className="w-5 h-5 text-primary-400" />
                        <a href={`tel:${selectedClient.phone}`} className="hover:text-primary-400">
                          {selectedClient.phone}
                        </a>
                      </div>
                    )}
                    {selectedClient.segment && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <Tag className="w-5 h-5 text-primary-400" />
                        {selectedClient.segment}
                      </div>
                    )}
                    {selectedClient.nip && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <Building className="w-5 h-5 text-primary-400" />
                        NIP: {selectedClient.nip}
                      </div>
                    )}
                    {selectedClient.adres && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <MapPin className="w-5 h-5 text-primary-400" />
                        {selectedClient.adres}
                      </div>
                    )}
                    {selectedClient.www && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <Globe className="w-5 h-5 text-primary-400" />
                        <a href={selectedClient.www} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 underline">
                          {selectedClient.www}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Building className="w-5 h-5 text-primary-400" />
                      ┼╣ródło: {selectedClient.source || 'Nie podano'}
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-primary-400" />
                      Dodano: {new Date(selectedClient.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-5 h-5 text-primary-400" />
                      Ostatni kontakt: {new Date(selectedClient.lastContact).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                </div>

                {/* Value + Szansa + Lead Score */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="card bg-primary-900/20 border-primary-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-400">
                        {selectedClient.value.toLocaleString('pl-PL')} PLN
                      </div>
                      <div className="text-xs text-gray-400">Wartość klienta</div>
                    </div>
                  </div>
                  <div className="card bg-blue-900/20 border-blue-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {selectedClient.szansaSprzedazy ?? 0}%
                      </div>
                      <div className="text-xs text-gray-400">Szansa sprzedaży</div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${(selectedClient.szansaSprzedazy ?? 0) > 70 ? 'bg-green-400' : (selectedClient.szansaSprzedazy ?? 0) > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${selectedClient.szansaSprzedazy ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card bg-purple-900/20 border-purple-700">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${(selectedClient.leadScore ?? 0) > 80 ? 'text-green-400' : (selectedClient.leadScore ?? 0) > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {selectedClient.leadScore ?? '?'}
                      </div>
                      <div className="text-xs text-gray-400">Lead Score AI</div>
                      <button
                        onClick={() => handleAILeadScoring(selectedClient)}
                        disabled={aiScoringLoading}
                        className="mt-2 px-3 py-1 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {aiScoringLoading ? '⏳ Analiza...' : '🤖 Oceń AI'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Scoring Result */}
                {aiScoring && (
                  <div className="card bg-purple-900/20 border-purple-700 mb-6">
                    <h4 className="font-bold text-purple-300 mb-3">🤖 Wynik AI Lead Scoring</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Wynik:</span>
                        <span className={`ml-2 font-bold text-lg ${aiScoring.lead_score > 80 ? 'text-green-400' : aiScoring.lead_score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {aiScoring.lead_score}/100
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Szacowana wartość:</span>
                        <span className="ml-2 text-primary-400 font-bold">{aiScoring.szacowana_wartosc.toLocaleString('pl-PL')} PLN</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">{aiScoring.uzasadnienie}</p>
                    {aiScoring.rekomendacje.length > 0 && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-xs mb-1">Rekomendacje:</p>
                        <ul className="list-disc ml-4 text-sm text-gray-300 space-y-1">
                          {aiScoring.rekomendacje.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedClient.notes && (
                  <div className="mb-6">
                    <h3 className="font-bold text-white mb-2">Notatki:</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedClient.notes}</p>
                  </div>
                )}

                {/* Add Contact */}
                <div className="mb-6">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Dodaj nowy kontakt
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <select
                        value={newContact.type}
                        onChange={(e) => setNewContact({ ...newContact, type: e.target.value as Contact['type'] })}
                        className="input-field w-40"
                      >
                        <option value="note">Notatka</option>
                        <option value="email">Email</option>
                        <option value="phone">Telefon</option>
                        <option value="meeting">Spotkanie</option>
                        <option value="oferta">Oferta</option>
                        <option value="faktura">Faktura</option>
                      </select>
                      <select
                        value={newContact.wynik || ''}
                        onChange={(e) => setNewContact({ ...newContact, wynik: e.target.value })}
                        className="input-field w-36"
                      >
                        <option value="">— Wynik —</option>
                        <option value="pozytywny">✅ Pozytywny</option>
                        <option value="negatywny">❌ Negatywny</option>
                        <option value="neutralny">➖ Neutralny</option>
                      </select>
                      <input
                        type="text"
                        value={newContact.description}
                        onChange={(e) => setNewContact({ ...newContact, description: e.target.value })}
                        placeholder="Opis kontaktu..."
                        className="input-field flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddContact();
                        }}
                      />
                      <button onClick={handleAddContact} className="btn-primary">
                        Dodaj
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newContact.nastepneKroki || ''}
                      onChange={(e) => setNewContact({ ...newContact, nastepneKroki: e.target.value })}
                      placeholder="Następne kroki (opcjonalnie)..."
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Contact History */}
                <div className="mb-6">
                  <h3 className="font-bold text-white mb-3">Historia kontaktów ({selectedClient.contacts.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedClient.contacts.length === 0 ? (
                      <p className="text-gray-400 text-sm">Brak historii kontaktów</p>
                    ) : (
                      selectedClient.contacts.map(contact => (
                        <div key={contact.id} className="flex gap-3 p-3 bg-surface-darker rounded-lg">
                          <div className="text-2xl">
                            {contact.type === 'email' && '📧'}
                            {contact.type === 'phone' && '📞'}
                            {contact.type === 'meeting' && '🤝'}
                            {contact.type === 'note' && '📝'}
                            {contact.type === 'oferta' && '💼'}
                            {contact.type === 'faktura' && '🧾'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-gray-300">{contact.description}</p>
                              {contact.wynik && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  contact.wynik === 'pozytywny' ? 'bg-green-900/50 text-green-400' :
                                  contact.wynik === 'negatywny' ? 'bg-red-900/50 text-red-400' :
                                  'bg-gray-700 text-gray-300'
                                }`}>
                                  {contact.wynik === 'pozytywny' ? '✅' : contact.wynik === 'negatywny' ? '❌' : '➖'} {contact.wynik}
                                </span>
                              )}
                            </div>
                            {contact.nastepneKroki && (
                              <p className="text-xs text-blue-400 mt-1">→ {contact.nastepneKroki}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(contact.date).toLocaleString('pl-PL')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={startEdit} className="btn-primary flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(selectedClient.id)}
                    className="btn-secondary text-red-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Usuń
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="btn-secondary ml-auto"
                  >
                    Zamknij
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI Pipeline Report */}
      {aiPipelineReport && (
        <div className="card bg-green-900/20 border-green-700/50 mb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-green-300 text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analiza Pipeline AI
            </h3>
            <button onClick={() => setAiPipelineReport('')} className="text-gray-400 hover:text-white text-sm">✕</button>
          </div>
          <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{aiPipelineReport}</div>
        </div>
      )}

      {/* AI Daily Report */}
      {aiDailyReport && (
        <div className="card bg-amber-900/20 border-amber-700/50 mb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-amber-300 text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Raport Dzienny AI
            </h3>
            <button onClick={() => setAiDailyReport('')} className="text-gray-400 hover:text-white text-sm">✕</button>
          </div>
          <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{aiDailyReport}</div>
        </div>
      )}

      {/* Info */}
      <div className="card bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-2">Zarządzaj swoimi klientami profesjonalnie</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Dodawaj klientów z pełnymi danymi kontaktowymi i NIP</li>
              <li>Śledź historię wszystkich interakcji z wynikami</li>
              <li>AI Lead Scoring — automatyczna ocena szans</li>
              <li>AI Pipeline — analiza lejka sprzedażowego</li>
              <li>AI Raport Dzienny — podsumowanie aktywności</li>
              <li>Import CSV i eksport danych</li>
              <li>Segmentuj klientów według wartości i statusu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMKlienci;
