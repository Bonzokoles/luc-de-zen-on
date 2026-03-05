import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, FileText, Calculator, Save, Sparkles, ShieldCheck } from 'lucide-react';
import {
  useToolAPI,
  AIModelSelector,
  CompanyPromptField,
  ToolResultMeta,
  AntAgentPanel,
} from '../shared/AIToolComponents';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  saleDate: string;
  dueDate: string;
  seller: {
    name: string;
    address: string;
    nip: string;
    email: string;
    phone: string;
  };
  buyer: {
    name: string;
    address: string;
    nip: string;
    email: string;
  };
  items: InvoiceItem[];
  paymentMethod: string;
  bankAccount: string;
  notes: string;
}

const GeneratorFaktur = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `FV/${new Date().getFullYear()}/${String(Date.now()).slice(-6)}`,
    issueDate: new Date().toISOString().split('T')[0],
    saleDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    seller: {
      name: '',
      address: '',
      nip: '',
      email: '',
      phone: ''
    },
    buyer: {
      name: '',
      address: '',
      nip: '',
      email: ''
    },
    items: [],
    paymentMethod: 'przelew',
    bankAccount: '',
    notes: ''
  });

  const [totals, setTotals] = useState({
    netTotal: 0,
    vatTotal: 0,
    grossTotal: 0
  });

  // AI: model selector + company prompt + opis AI + walidacja
  const [model, setModel] = useState('auto');
  const [companyPrompt, setCompanyPrompt] = useState('');
  const [aiItemLoading, setAiItemLoading] = useState<string | null>(null);
  const [aiBatchLoading, setAiBatchLoading] = useState(false);
  const [walidacjaResult, setWalidacjaResult] = useState<{
    status?: string;
    wyniki?: Array<{ sprawdzane: string; status: string; komentarz: string }>;
    sugestie?: string[];
    zalecana_akcja?: string;
    raw?: string;
  } | null>(null);
  const [walidacjaLoading, setWalidacjaLoading] = useState(false);
  const [walidacjaMeta, setWalidacjaMeta] = useState<{ model?: string; czas?: number; tokeny?: { input: number; output: number } } | null>(null);

  const api = useToolAPI('/api/narzedzia/generator-faktur');

  // Generuj AI opis dla jednej pozycji
  const generateAIDescription = async (itemId: string) => {
    const item = invoice.items.find(i => i.id === itemId);
    if (!item || !item.name.trim()) return;
    setAiItemLoading(itemId);

    try {
      const result = await api.call({
        model,
        company_prompt: companyPrompt || undefined,
        akcja: 'opisy_ai',
        faktura: {
          pozycje: [{ nazwa: item.name, ilosc: item.quantity, cena_jedn_netto: item.unitPrice, vat_stawka: item.vatRate }],
        },
      });

      if (result) {
        const r = result as Record<string, unknown>;
        const pozycje = (r.pozycje as Array<{ sugerowany_opis?: string }>) || [];
        if (pozycje[0]?.sugerowany_opis) {
          updateItem(itemId, 'name', pozycje[0].sugerowany_opis);
        }
      }
    } finally {
      setAiItemLoading(null);
    }
  };

  // Batch AI opisy — wszystkie pozycje naraz
  const generateAllDescriptions = async () => {
    if (invoice.items.length === 0) return;
    setAiBatchLoading(true);

    try {
      const result = await api.call({
        model,
        company_prompt: companyPrompt || undefined,
        akcja: 'opisy_ai',
        faktura: {
          pozycje: invoice.items.map(i => ({ nazwa: i.name, ilosc: i.quantity, cena_jedn_netto: i.unitPrice, vat_stawka: i.vatRate })),
        },
      });

      if (result) {
        const r = result as Record<string, unknown>;
        const pozycje = (r.pozycje as Array<{ sugerowany_opis?: string }>) || [];
        pozycje.forEach((p, idx) => {
          if (p.sugerowany_opis && invoice.items[idx]) {
            updateItem(invoice.items[idx].id, 'name', p.sugerowany_opis);
          }
        });
      }
    } finally {
      setAiBatchLoading(false);
    }
  };

  // Walidacja faktury AI
  const validateInvoiceAI = async () => {
    if (invoice.items.length === 0) return;
    setWalidacjaLoading(true);
    setWalidacjaResult(null);
    setWalidacjaMeta(null);

    try {
      const result = await api.call({
        model,
        company_prompt: companyPrompt || undefined,
        akcja: 'walidacja_ai',
        faktura: {
          sprzedawca: invoice.seller,
          nabywca: invoice.buyer,
          pozycje: invoice.items.map(i => ({ nazwa: i.name, ilosc: i.quantity, cena_jedn_netto: i.unitPrice, vat_stawka: i.vatRate })),
          sposob_platnosci: invoice.paymentMethod,
          nr_konta: invoice.bankAccount || undefined,
          termin_platnosci: invoice.dueDate,
        },
      });

      if (result) {
        const r = result as Record<string, unknown>;
        const rawText = (r.walidacja as string) || (r.wynik as string) || '';
        // Próbuj sparsować JSON z wyniku AI
        try {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setWalidacjaResult({
              status: parsed.status,
              wyniki: parsed.wyniki,
              sugestie: parsed.sugestie,
              zalecana_akcja: parsed.zalecana_akcja,
            });
          } else {
            setWalidacjaResult({ raw: rawText });
          }
        } catch {
          setWalidacjaResult({ raw: rawText });
        }
        if (r.model_uzyty) {
          const m = r.model_uzyty as { nazwa_logiczna?: string; model_id?: string };
          setWalidacjaMeta({
            model: m.nazwa_logiczna || m.model_id,
            czas: r.czas as number,
            tokeny: r.tokeny as { input: number; output: number },
          });
        }
      }
    } finally {
      setWalidacjaLoading(false);
    }
  };

  // Oblicz sumy
  useEffect(() => {
    const netTotal = invoice.items.reduce((sum, item) => sum + item.netAmount, 0);
    const vatTotal = invoice.items.reduce((sum, item) => sum + item.vatAmount, 0);
    const grossTotal = invoice.items.reduce((sum, item) => sum + item.grossAmount, 0);

    setTotals({ netTotal, vatTotal, grossTotal });
  }, [invoice.items]);

  // Dodaj nową pozycję
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      name: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 23,
      netAmount: 0,
      vatAmount: 0,
      grossAmount: 0
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  // Usuń pozycję
  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  // Aktualizuj pozycję
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Przelicz kwoty
        const quantity = field === 'quantity' ? Number(value) : item.quantity;
        const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
        const vatRate = field === 'vatRate' ? Number(value) : item.vatRate;

        const netAmount = quantity * unitPrice;
        const vatAmount = netAmount * (vatRate / 100);
        const grossAmount = netAmount + vatAmount;

        return {
          ...updated,
          netAmount,
          vatAmount,
          grossAmount
        };
      })
    }));
  };

  // Zapisz jako draft w localStorage
  const saveDraft = () => {
    localStorage.setItem('invoice-draft', JSON.stringify(invoice));
    alert('✅ Szkic faktury został zapisany!');
  };

  // Wczytaj draft
  const loadDraft = () => {
    const draft = localStorage.getItem('invoice-draft');
    if (draft) {
      setInvoice(JSON.parse(draft));
      alert('✅ Szkic faktury został wczytany!');
    } else {
      alert('❌ Brak zapisanego szkicu');
    }
  };

  // Generuj HTML faktury do druku
  const generateInvoiceHTML = (): string => {
    return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faktura ${invoice.invoiceNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      background: white;
      color: #000;
    }
    h1 {
      text-align: center;
      font-size: 28px;
      margin-bottom: 30px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .company-box {
      width: 45%;
      padding: 15px;
      border: 2px solid #000;
    }
    .company-box h2 {
      font-size: 14px;
      margin: 0 0 10px 0;
      font-weight: bold;
    }
    .company-box p {
      margin: 3px 0;
      font-size: 12px;
    }
    .dates {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #f0f0f0;
      font-weight: bold;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .totals {
      margin-top: 20px;
      width: 40%;
      margin-left: auto;
    }
    .totals table {
      font-size: 12px;
    }
    .totals .final-total {
      font-weight: bold;
      font-size: 14px;
      background: #f0f0f0;
    }
    .payment-info {
      margin-top: 30px;
      font-size: 12px;
    }
    .notes {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      font-size: 11px;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <h1>FAKTURA VAT</h1>
  <h2 style="text-align: center; font-size: 18px; margin: -20px 0 20px 0;">${invoice.invoiceNumber}</h2>

  <div class="header">
    <div class="company-box">
      <h2>SPRZEDAWCA:</h2>
      <p><strong>${invoice.seller.name || '[Nazwa firmy]'}</strong></p>
      <p>${invoice.seller.address || '[Adres]'}</p>
      <p><strong>NIP:</strong> ${invoice.seller.nip || '[NIP]'}</p>
      <p>Email: ${invoice.seller.email || '[Email]'}</p>
      <p>Tel: ${invoice.seller.phone || '[Telefon]'}</p>
    </div>

    <div class="company-box">
      <h2>NABYWCA:</h2>
      <p><strong>${invoice.buyer.name || '[Nazwa firmy/klienta]'}</strong></p>
      <p>${invoice.buyer.address || '[Adres]'}</p>
      <p><strong>NIP:</strong> ${invoice.buyer.nip || '[NIP]'}</p>
      <p>Email: ${invoice.buyer.email || '[Email]'}</p>
    </div>
  </div>

  <div class="dates">
    <div><strong>Data wystawienia:</strong> ${invoice.issueDate}</div>
    <div><strong>Data sprzedaży:</strong> ${invoice.saleDate}</div>
    <div><strong>Termin płatności:</strong> ${invoice.dueDate}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">Lp.</th>
        <th style="width: 35%;">Nazwa towaru/usługi</th>
        <th style="width: 10%;" class="text-center">Ilość</th>
        <th style="width: 12%;" class="text-right">Cena jedn. netto</th>
        <th style="width: 12%;" class="text-right">Wartość netto</th>
        <th style="width: 8%;" class="text-center">VAT %</th>
        <th style="width: 12%;" class="text-right">Kwota VAT</th>
        <th style="width: 12%;" class="text-right">Wartość brutto</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item, index) => `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item.name || '[Nazwa produktu/usługi]'}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-right">${item.unitPrice.toFixed(2)} zł</td>
          <td class="text-right">${item.netAmount.toFixed(2)} zł</td>
          <td class="text-center">${item.vatRate}%</td>
          <td class="text-right">${item.vatAmount.toFixed(2)} zł</td>
          <td class="text-right">${item.grossAmount.toFixed(2)} zł</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td><strong>Razem netto:</strong></td>
        <td class="text-right">${totals.netTotal.toFixed(2)} zł</td>
      </tr>
      <tr>
        <td><strong>Razem VAT:</strong></td>
        <td class="text-right">${totals.vatTotal.toFixed(2)} zł</td>
      </tr>
      <tr class="final-total">
        <td><strong>RAZEM BRUTTO:</strong></td>
        <td class="text-right"><strong>${totals.grossTotal.toFixed(2)} zł</strong></td>
      </tr>
    </table>
  </div>

  <div class="payment-info">
    <p><strong>Sposób płatności:</strong> ${invoice.paymentMethod === 'przelew' ? 'Przelew bankowy' : invoice.paymentMethod === 'gotowka' ? 'Gotówka' : 'BLIK'}</p>
    ${invoice.paymentMethod === 'przelew' && invoice.bankAccount ? `<p><strong>Numer konta:</strong> ${invoice.bankAccount}</p>` : ''}
    <p><strong>Do zapłaty:</strong> <span style="font-size: 16px; font-weight: bold;">${totals.grossTotal.toFixed(2)} zł</span></p>
  </div>

  ${invoice.notes ? `
  <div class="notes">
    <strong>Uwagi:</strong><br>
    ${invoice.notes}
  </div>
  ` : ''}

  <div style="margin-top: 60px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 40%;">
      <div style="border-top: 1px solid #000; padding-top: 5px;">Podpis wystawiającego</div>
    </div>
    <div style="text-align: center; width: 40%;">
      <div style="border-top: 1px solid #000; padding-top: 5px;">Podpis odbierającego</div>
    </div>
  </div>

  <p style="text-align: center; margin-top: 30px; font-size: 10px; color: #666;">
    Wygenerowano przez AI Biznes Start - ${new Date().toLocaleString('pl-PL')}
  </p>
</body>
</html>
    `;
  };

  // Drukuj / Eksportuj do PDF
  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateInvoiceHTML());
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="space-y-6">
      <AntAgentPanel currentTool="Generator Faktur" className="mb-2" />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Generator Faktur VAT</h1>
        <p className="text-gray-300">
          Twórz profesjonalne faktury zgodne z polskim prawem
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={saveDraft}
          className="btn-secondary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Zapisz szkic
        </button>
        <button
          onClick={loadDraft}
          className="btn-secondary flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Wczytaj szkic
        </button>
        <button
          onClick={printInvoice}
          className="btn-primary flex items-center gap-2"
          disabled={invoice.items.length === 0}
        >
          <Download className="w-4 h-4" />
          Podgląd i Drukuj
        </button>
      </div>

      {/* Main Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sprzedawca */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">📤 Sprzedawca (Ty)</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nazwa firmy"
              value={invoice.seller.name}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                seller: { ...prev.seller, name: e.target.value }
              }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Adres (ulica, kod, miasto)"
              value={invoice.seller.address}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                seller: { ...prev.seller, address: e.target.value }
              }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="NIP"
              value={invoice.seller.nip}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                seller: { ...prev.seller, nip: e.target.value }
              }))}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.seller.email}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                seller: { ...prev.seller, email: e.target.value }
              }))}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={invoice.seller.phone}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                seller: { ...prev.seller, phone: e.target.value }
              }))}
              className="input-field"
            />
          </div>
        </div>

        {/* Nabywca */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">📥 Nabywca (Klient)</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nazwa firmy/klienta"
              value={invoice.buyer.name}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                buyer: { ...prev.buyer, name: e.target.value }
              }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Adres (ulica, kod, miasto)"
              value={invoice.buyer.address}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                buyer: { ...prev.buyer, address: e.target.value }
              }))}
              className="input-field"
            />
            <input
              type="text"
              placeholder="NIP"
              value={invoice.buyer.nip}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                buyer: { ...prev.buyer, nip: e.target.value }
              }))}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={invoice.buyer.email}
              onChange={(e) => setInvoice(prev => ({
                ...prev,
                buyer: { ...prev.buyer, email: e.target.value }
              }))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Dane faktury */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">📄 Dane faktury</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Numer faktury</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Data wystawienia</label>
            <input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, issueDate: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Data sprzedaży</label>
            <input
              type="date"
              value={invoice.saleDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, saleDate: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Termin płatności</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Pozycje faktury */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">🛒 Pozycje faktury</h2>
          <button
            onClick={addItem}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj pozycję
          </button>
        </div>

        {invoice.items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Brak pozycji. Kliknij "Dodaj pozycję" aby rozpocząć.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2 text-gray-300">Nazwa</th>
                  <th className="text-center p-2 text-gray-300">Ilość</th>
                  <th className="text-right p-2 text-gray-300">Cena jedn.</th>
                  <th className="text-center p-2 text-gray-300">VAT %</th>
                  <th className="text-right p-2 text-gray-300">Netto</th>
                  <th className="text-right p-2 text-gray-300">VAT</th>
                  <th className="text-right p-2 text-gray-300">Brutto</th>
                  <th className="text-center p-2"></th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800">
                    <td className="p-2">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Nazwa produktu/usługi"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="input-field w-full"
                        />
                        <button
                          onClick={() => generateAIDescription(item.id)}
                          disabled={aiItemLoading === item.id || !item.name.trim()}
                          className="text-blue-400 hover:text-blue-300 p-1 disabled:opacity-30 flex-shrink-0"
                          title="AI: rozwiń opis pozycji"
                        >
                          {aiItemLoading === item.id ? <span className="loading-spinner w-4 h-4 inline-block" /> : <Sparkles className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="input-field w-20 text-center"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                        className="input-field w-28 text-right"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateItem(item.id, 'vatRate', e.target.value)}
                        className="input-field w-20 text-center"
                      >
                        <option value="23">23%</option>
                        <option value="8">8%</option>
                        <option value="5">5%</option>
                        <option value="0">0%</option>
                      </select>
                    </td>
                    <td className="p-2 text-right text-white">
                      {item.netAmount.toFixed(2)} zł
                    </td>
                    <td className="p-2 text-right text-gray-300">
                      {item.vatAmount.toFixed(2)} zł
                    </td>
                    <td className="p-2 text-right text-primary-400 font-bold">
                      {item.grossAmount.toFixed(2)} zł
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Usuń pozycję"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Podsumowanie */}
        {invoice.items.length > 0 && (
          <div className="mt-6 flex justify-end">
            <div className="w-full md:w-96 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Suma netto:</span>
                <span className="font-bold">{totals.netTotal.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Suma VAT:</span>
                <span className="font-bold">{totals.vatTotal.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-2xl text-primary-400 font-bold pt-2 border-t border-gray-700">
                <span>DO ZAPŁATY:</span>
                <span>{totals.grossTotal.toFixed(2)} zł</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Panel */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">🤖 Ustawienia AI</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <AIModelSelector value={model} onChange={setModel} />
          <CompanyPromptField value={companyPrompt} onChange={setCompanyPrompt} />
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={generateAllDescriptions}
            disabled={aiBatchLoading || invoice.items.length === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            {aiBatchLoading ? <><span className="loading-spinner inline-block w-4 h-4" /> Generuję opisy...</> : <><Sparkles className="w-4 h-4" /> ✨ Opisy AI (wszystkie)</>}
          </button>
          <button
            onClick={validateInvoiceAI}
            disabled={walidacjaLoading || invoice.items.length === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {walidacjaLoading ? <><span className="loading-spinner inline-block w-4 h-4" /> Sprawdzam...</> : <><ShieldCheck className="w-4 h-4" /> ✅ Sprawdź fakturę AI</>}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Kliknij ✨ przy nazwie pozycji dla pojedynczego opisu, lub "Opisy AI" dla wszystkich naraz. "Sprawdź fakturę" waliduje NIP, stawki VAT i sumy.
        </p>

        {walidacjaResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            walidacjaResult.status === 'OK' ? 'bg-green-900/20 border-green-500/30' :
            walidacjaResult.status === 'BŁĄD' ? 'bg-red-900/20 border-red-500/30' :
            walidacjaResult.status === 'OSTRZEŻENIE' ? 'bg-yellow-900/20 border-yellow-500/30' :
            'bg-blue-900/20 border-blue-500/30'
          }`}>
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              {walidacjaResult.status === 'OK' ? '✅' : walidacjaResult.status === 'BŁĄD' ? '❌' : '⚠️'}
              <span className={
                walidacjaResult.status === 'OK' ? 'text-green-300' :
                walidacjaResult.status === 'BŁĄD' ? 'text-red-300' :
                'text-yellow-300'
              }>
                Wynik walidacji: {walidacjaResult.status || 'Sprawdzono'}
              </span>
              {walidacjaResult.zalecana_akcja && (
                <span className="ml-auto text-xs px-2 py-1 rounded bg-business-dark text-gray-400">
                  Zalecenie: {walidacjaResult.zalecana_akcja}
                </span>
              )}
            </h4>

            {walidacjaResult.wyniki && (
              <div className="space-y-1 mb-3">
                {walidacjaResult.wyniki.map((w, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm ${
                    w.status === 'BŁĄD' ? 'text-red-400' : w.status === 'OK' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    <span>{w.status === 'OK' ? '✅' : w.status === 'BŁĄD' ? '❌' : '⚠️'}</span>
                    <span className="font-medium">{w.sprawdzane}:</span>
                    <span className="text-gray-300">{w.komentarz}</span>
                  </div>
                ))}
              </div>
            )}

            {walidacjaResult.sugestie && walidacjaResult.sugestie.length > 0 && (
              <div className="mt-2 p-2 bg-business-dark/50 rounded text-sm">
                <span className="font-medium text-yellow-300">💡 Sugestie:</span>
                <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-300">
                  {walidacjaResult.sugestie.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {walidacjaResult.raw && (
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{walidacjaResult.raw}</pre>
            )}

            {walidacjaMeta && <ToolResultMeta model={walidacjaMeta.model} czas={walidacjaMeta.czas} tokeny={walidacjaMeta.tokeny} />}
          </div>
        )}

        {api.error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">⚠️ {api.error}</div>
        )}
      </div>

      {/* Płatność */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">💳 Sposób płatności</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Metoda płatności</label>
            <select
              value={invoice.paymentMethod}
              onChange={(e) => setInvoice(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="input-field"
            >
              <option value="przelew">Przelew bankowy</option>
              <option value="gotowka">Gotówka</option>
              <option value="blik">BLIK</option>
              <option value="karta">Karta płatnicza</option>
            </select>
          </div>
          {invoice.paymentMethod === 'przelew' && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Numer konta bankowego</label>
              <input
                type="text"
                placeholder="PL 00 0000 0000 0000 0000 0000 0000"
                value={invoice.bankAccount}
                onChange={(e) => setInvoice(prev => ({ ...prev, bankAccount: e.target.value }))}
                className="input-field"
              />
            </div>
          )}
        </div>
      </div>

      {/* Uwagi */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">📝 Uwagi (opcjonalnie)</h2>
        <textarea
          placeholder="Dodatkowe informacje do faktury..."
          value={invoice.notes}
          onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
          className="input-field resize-none"
          rows={3}
        />
      </div>

      {/* Info */}
      <div className="card bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Calculator className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-2">Stawki VAT w Polsce:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li><strong>23%</strong> - standardowa (większość towarów i usług)</li>
              <li><strong>8%</strong> - obniżona (książki, restauracje, transport)</li>
              <li><strong>5%</strong> - preferencyjna (żywność podstawowa)</li>
              <li><strong>0%</strong> - zwolniona (eksport, niektóre usługi)</li>
            </ul>
            <p className="mt-3 text-yellow-400">
              ⚠️ To narzędzie jest pomocą. W razie wątpliwości skonsultuj się z księgowym.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorFaktur;
