import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import {
  useToolAPI,
  AIModelSelector,
  CompanyPromptField,
  ToolResultMeta,
  AntAgentPanel,
} from '../shared/AIToolComponents';

interface DokumentResponse {
  dokument: string;
  model_uzyty: { nazwa_logiczna: string; provider: string; model_id: string };
  czas: number;
  tokeny: { input: number; output: number };
  ostrzezenie: string;
}

const rodzajeMap: Record<string, { label: string; fields: string[] }> = {
  umowa_uslug: { label: 'Umowa o świadczenie usług', fields: ['strona_A', 'strona_B', 'przedmiot', 'okres', 'wynagrodzenie', 'miejsce'] },
  umowa_sprzedazy: { label: 'Umowa sprzedaży', fields: ['strona_A', 'strona_B', 'przedmiot', 'cena', 'warunki_dostawy', 'miejsce'] },
  umowa_zlecenia: { label: 'Umowa zlecenia', fields: ['strona_A', 'strona_B', 'przedmiot', 'wynagrodzenie', 'termin'] },
  regulamin: { label: 'Regulamin serwisu / sklepu', fields: ['przedmiot', 'strona_A'] },
  polityka_prywatnosci: { label: 'Polityka prywatności (RODO)', fields: ['przedmiot', 'strona_A'] },
  oferta: { label: 'Oferta handlowa', fields: ['strona_A', 'strona_B', 'przedmiot', 'wynagrodzenie', 'okres'] },
};

const fieldLabels: Record<string, string> = {
  strona_A: 'Strona A (Twoja firma)',
  strona_B: 'Strona B (kontrahent)',
  przedmiot: 'Przedmiot',
  okres: 'Okres świadczenia',
  wynagrodzenie: 'Wynagrodzenie / cena',
  cena: 'Cena',
  miejsce: 'Miejsce',
  warunki_dostawy: 'Warunki dostawy',
  termin: 'Termin wykonania',
};

const fieldPlaceholders: Record<string, string> = {
  strona_A: 'Firma XYZ Sp. z o.o., NIP: ...',
  strona_B: 'Klient biznesowy / osoba prywatna',
  przedmiot: 'Np. świadczenie usług programistycznych',
  okres: 'Np. 12 miesięcy',
  wynagrodzenie: 'Np. 5000 PLN netto miesięcznie',
  cena: 'Np. 15 000 PLN netto',
  miejsce: 'Np. Warszawa, Polska',
  warunki_dostawy: 'Np. dostawa kurierem w 3 dni robocze',
  termin: 'Np. 30 dni od podpisania umowy',
};

const KreatorDokumentow = () => {
  const [rodzaj, setRodzaj] = useState('umowa_uslug');
  const [poziom, setPoziom] = useState('sredni');
  const [dane, setDane] = useState<Record<string, string>>({});
  const [innePunkty, setInnePunkty] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [alternativeDoc, setAlternativeDoc] = useState('');

  const [model, setModel] = useState('auto');
  const [companyPrompt, setCompanyPrompt] = useState('');

  const api = useToolAPI<DokumentResponse>('/api/narzedzia/kreator-dokumentow');

  const currentFields = rodzajeMap[rodzaj]?.fields || [];

  const updateDane = (field: string, val: string) => {
    setDane((prev) => ({ ...prev, [field]: val }));
  };

  const handleGenerate = async (altModel?: string) => {
    if (!dane.przedmiot?.trim()) return;

    const body: Record<string, unknown> = {
      model: altModel || model,
      company_prompt: companyPrompt || undefined,
      rodzaj,
      poziom_szczegolowosci: poziom,
      jezyk: 'pl',
      dane: {
        ...dane,
        inne_punkty: innePunkty ? innePunkty.split('\n').filter(Boolean) : undefined,
      },
    };

    const result = await api.call(body);

    if (result?.dokument) {
      if (altModel) {
        setAlternativeDoc(result.dokument);
      } else {
        setGeneratedDoc(result.dokument);
        setAlternativeDoc('');
      }
    }
  };

  const generateAlternative = () => {
    const nextModel = model === 'auto' ? 'szybki' : model === 'szybki' ? 'dokladny' : 'auto';
    handleGenerate(nextModel);
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto">
      <AntAgentPanel currentTool="Kreator Dokumentów" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Konfiguracji */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📄 Kreator Dokumentów</h2>

          {/* Typ dokumentu */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rodzaj dokumentu</label>
            <select value={rodzaj} onChange={(e) => { setRodzaj(e.target.value); setDane({}); }} className="input-field">
              {Object.entries(rodzajeMap).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Poziom szczegółowości */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Poziom szczegółowości</label>
            <select value={poziom} onChange={(e) => setPoziom(e.target.value)} className="input-field">
              <option value="prosty">Szkic prosty (szybki)</option>
              <option value="sredni">Średni (standardowy)</option>
              <option value="pelny">Pełny dokument (dokładny)</option>
            </select>
          </div>

          {/* Dynamiczne pola wg typu */}
          <div className="mb-4 space-y-3">
            <label className="block text-sm font-medium mb-1 text-slate-300">Dane dokumentu</label>
            {currentFields.map((field) => (
              <div key={field}>
                <label className="block text-xs text-slate-400 mb-1">{fieldLabels[field] || field}</label>
                <input
                  type="text"
                  value={dane[field] || ''}
                  onChange={(e) => updateDane(field, e.target.value)}
                  className="input-field"
                  placeholder={fieldPlaceholders[field] || ''}
                />
              </div>
            ))}
          </div>

          {/* Dodatkowe punkty */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Dodatkowe punkty / klauzule (opcjonalnie)</label>
            <textarea value={innePunkty} onChange={(e) => setInnePunkty(e.target.value)} className="textarea-field" rows={3}
              placeholder="Każdy wiersz = osobny punkt, np.&#10;Klauzula o poufności&#10;Kara umowna 10% za opóźnienia" />
          </div>

          {/* AI Config */}
          <div className="mb-6 space-y-4 border-t border-business-border pt-4">
            <AIModelSelector value={model} onChange={setModel} />
            <CompanyPromptField value={companyPrompt} onChange={setCompanyPrompt}
              placeholder="Np. Jesteśmy firmą IT z Polski, tworzymy umowy z programistami zdalnymi. Zawsze dodawaj klauzulę o poufności." />
          </div>

          <button onClick={() => handleGenerate()} disabled={api.loading || !dane.przedmiot?.trim()} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {api.loading ? <><span className="loading-spinner inline-block mr-2" />Generuję dokument...</> : '📝 Wygeneruj Dokument'}
          </button>

          {api.error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">⚠️ {api.error}</div>}
        </div>

        {/* Panel Wyniku */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📋 Podgląd Dokumentu</h2>

          {!generatedDoc && !api.loading && (
            <div className="text-center py-12 text-business-text-dim">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Twój dokument pojawi się tutaj</p>
              <p className="text-xs mt-2">Wybierz rodzaj dokumentu, wypełnij dane i kliknij Generuj</p>
            </div>
          )}

          {api.loading && (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4" />
              <p className="text-business-text-dim">AI generuje dokument...</p>
            </div>
          )}

          {generatedDoc && (
            <div className="space-y-4">
              {/* Ostrzeżenie prawne */}
              <div className="p-3 bg-yellow-900/20 border border-yellow-600/40 rounded-lg text-sm text-yellow-300">
                ⚠️ Ten dokument jest szablonem wygenerowanym przez AI. <strong>Skonsultuj z prawnikiem</strong> przed użyciem.
              </div>

              <div className="bg-white text-gray-900 rounded-lg p-6 border-2 border-business-border max-h-[600px] overflow-y-auto">
                <div className="prose max-w-none text-sm">
                  <ReactMarkdown>{generatedDoc}</ReactMarkdown>
                </div>
              </div>

              {api.meta && <ToolResultMeta model={api.meta.model} czas={api.meta.czas} tokeny={api.meta.tokeny} />}

              <div className="flex gap-3">
                <button onClick={() => copyToClipboard(generatedDoc)} className="btn-primary flex-1">📋 Kopiuj</button>
                <button onClick={generateAlternative} className="btn-secondary flex-1" disabled={api.loading}>🔄 Inny model</button>
                <button onClick={() => { setGeneratedDoc(''); setAlternativeDoc(''); }} className="btn-secondary">🆕 Nowy</button>
              </div>

              {alternativeDoc && (
                <div className="bg-business-dark border border-blue-500/30 rounded-lg p-6 mt-4">
                  <h4 className="text-sm font-bold text-blue-400 mb-3">🔄 Alternatywna wersja:</h4>
                  <div className="prose prose-invert max-w-none text-sm max-h-[400px] overflow-y-auto">
                    <ReactMarkdown>{alternativeDoc}</ReactMarkdown>
                  </div>
                  <button onClick={() => copyToClipboard(alternativeDoc)} className="btn-secondary mt-3 text-xs">📋 Kopiuj tę wersję</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default KreatorDokumentow;
