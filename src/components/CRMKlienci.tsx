import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, Mail, Phone, Building, Calendar, Tag, Download, Filter, MessageSquare, Clock } from 'lucide-react';

interface Contact {
  id: string;
  date: string;
  type: 'email' | 'phone' | 'meeting' | 'note';
  description: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'active' | 'inactive' | 'vip';
  segment: string;
  value: number;
  source: string;
  createdAt: string;
  lastContact: string;
  contacts: Contact[];
  notes: string;
  tags: string[];
}

const statusLabels = {
  lead: { label: 'Lead', color: 'bg-yellow-500/20 text-yellow-300', icon: '­čöö' },
  active: { label: 'Aktywny', color: 'bg-green-500/20 text-green-300', icon: 'Ôťů' },
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
    status: 'lead',
    segment: '',
    value: 0,
    source: '',
    notes: '',
    tags: []
  });

  // New contact form
  const [newContact, setNewContact] = useState({
    type: 'note' as Contact['type'],
    description: ''
  });

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
    totalValue: clients.reduce((sum, c) => sum + (c.value || 0), 0)
  };

  // Add/Update client
  const handleSaveClient = () => {
    if (!formData.name || !formData.email) {
      alert('Imi─Ö i email s─ů wymagane!');
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
      status: 'lead',
      segment: '',
      value: 0,
      source: '',
      notes: '',
      tags: []
    });
  };

  // Delete client
  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usun─ů─ç tego klienta?')) {
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
      description: newContact.description
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

    // Update selected client
    setSelectedClient(prev => prev ? {
      ...prev,
      contacts: [contact, ...prev.contacts],
      lastContact: new Date().toISOString()
    } : null);

    setNewContact({ type: 'note', description: '' });
  };

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['Imi─Ö i Nazwisko', 'Email', 'Telefon', 'Firma', 'Status', 'Segment', 'Warto┼Ť─ç', '┼╣r├│d┼éo', 'Data utworzenia'],
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
          CRM - Zarz─ůdzanie Klientami
        </h1>
        <p className="text-gray-300">
          Twoja baza klient├│w w jednym miejscu - historia kontakt├│w, segmentacja, warto┼Ť─ç
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-400">Wszyscy klienci</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.leads}</div>
          <div className="text-xs text-gray-400">Leady</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-xs text-gray-400">Aktywni</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.vip}</div>
          <div className="text-xs text-gray-400">VIP</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-400">
            {(stats.totalValue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-400">Warto┼Ť─ç (PLN)</div>
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
            <option value="active">Aktywny</option>
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
            <p className="text-gray-400">Brak klient├│w do wy┼Ťwietlenia</p>
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
                <span>Warto┼Ť─ç: {client.value.toLocaleString('pl-PL')} z┼é</span>
                <span>{client.contacts.length} kontakt├│w</span>
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
                  <label className="block text-sm text-gray-300 mb-1">Imi─Ö i nazwisko *</label>
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
                  <label className="block text-sm text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
                    className="input-field"
                  >
                    <option value="lead">Lead</option>
                    <option value="active">Aktywny</option>
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
                  <label className="block text-sm text-gray-300 mb-1">Warto┼Ť─ç (PLN)</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">┼╣r├│d┼éo pozyskania</label>
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
                      <label className="block text-sm text-gray-300 mb-1">Imi─Ö i nazwisko *</label>
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
                      <label className="block text-sm text-gray-300 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
                        className="input-field"
                      >
                        <option value="lead">Lead</option>
                        <option value="active">Aktywny</option>
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
                      <label className="block text-sm text-gray-300 mb-1">Warto┼Ť─ç (PLN)</label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">┼╣r├│d┼éo</label>
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
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Building className="w-5 h-5 text-primary-400" />
                      ┼╣r├│d┼éo: {selectedClient.source || 'Nie podano'}
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

                {/* Value */}
                <div className="card bg-primary-900/20 border-primary-700 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-400">
                      {selectedClient.value.toLocaleString('pl-PL')} PLN
                    </div>
                    <div className="text-sm text-gray-400">Warto┼Ť─ç klienta</div>
                  </div>
                </div>

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
                  <div className="flex gap-3">
                    <select
                      value={newContact.type}
                      onChange={(e) => setNewContact({ ...newContact, type: e.target.value as Contact['type'] })}
                      className="input-field"
                    >
                      <option value="note">Notatka</option>
                      <option value="email">Email</option>
                      <option value="phone">Telefon</option>
                      <option value="meeting">Spotkanie</option>
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
                </div>

                {/* Contact History */}
                <div className="mb-6">
                  <h3 className="font-bold text-white mb-3">Historia kontakt├│w ({selectedClient.contacts.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedClient.contacts.length === 0 ? (
                      <p className="text-gray-400 text-sm">Brak historii kontakt├│w</p>
                    ) : (
                      selectedClient.contacts.map(contact => (
                        <div key={contact.id} className="flex gap-3 p-3 bg-surface-darker rounded-lg">
                          <div className="text-2xl">
                            {contact.type === 'email' && '­čôž'}
                            {contact.type === 'phone' && '­čô×'}
                            {contact.type === 'meeting' && '­čĄŁ'}
                            {contact.type === 'note' && '­čôŁ'}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300">{contact.description}</p>
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
                    Usu┼ä
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

      {/* Info */}
      <div className="card bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-2">Zarz─ůdzaj swoimi klientami profesjonalnie</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Dodawaj klient├│w z pe┼énymi danymi kontaktowymi</li>
              <li>┼Üled┼║ histori─Ö wszystkich interakcji</li>
              <li>Segmentuj klient├│w wed┼éug warto┼Ťci i statusu</li>
              <li>Eksportuj dane do CSV dla raport├│w</li>
              <li>Wszystkie dane zapisywane lokalnie w przegl─ůdarce</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMKlienci;
