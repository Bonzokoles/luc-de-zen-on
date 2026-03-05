import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useToolAPI,
  AIModelSelector,
  CompanyPromptField,
  ToolResultMeta,
  AntAgentPanel,
} from '../shared/AIToolComponents';

interface EmailResponse {
  email: string;
  model_uzyty: { nazwa_logiczna: string; provider: string; model_id: string };
  czas: number;
  tokeny: { input: number; output: number };
}

const AsystentEmail = () => {
  const [typ, setTyp] = useState('oferta');
  const [ton, setTon] = useState('profesjonalny');
  const [odbiorca, setOdbiorca] = useState('');
  const [kontekst, setKontekst] = useState('');
  const [temat, setTemat] = useState('');
  const [dodatkowe, setDodatkowe] = useState<string[]>(['']);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [alternativeEmail, setAlternativeEmail] = useState('');

  const [model, setModel] = useState('auto');
  const [companyPrompt, setCompanyPrompt] = useState('');

  const api = useToolAPI<EmailResponse>('/api/narzedzia/asystent-email');

  const typy = [
    { value: 'oferta', label: 'Oferta handlowa' },
    { value: 'przypomnienie', label: 'Przypomnienie płatności' },
    { value: 'podziekowanie', label: 'Podziękowanie' },
    { value: 'reklamacja', label: 'Reklamacja' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'zaproszenie', label: 'Zaproszenie na spotkanie' },
    { value: 'zapytanie', label: 'Zapytanie ofertowe' },
    { value: 'odpowiedz', label: 'Odpowiedź na zapytanie' },
  ];

  const tony = [
    { value: 'formalny', label: 'Formalny' },
    { value: 'profesjonalny', label: 'Profesjonalny' },
    { value: 'swobodny', label: 'Swobodny' },
    { value: 'przyjazny', label: 'Przyjazny' },
    { value: 'bezposredni', label: 'Bezpośredni' },
  ];

  const templates = [
    { title: 'Oferta handlowa', odbiorca: 'potencjalny klient', kontekst: 'Zaproponuj spotkanie i przedstaw ofertę usług.' },
    { title: 'Przypomnienie płatności', odbiorca: 'klient z zaległą fakturą', kontekst: 'Uprzejme przypomnienie o niezapłaconej fakturze.' },
    { title: 'Follow-up po spotkaniu', odbiorca: 'partner biznesowy', kontekst: 'Podziękowanie za spotkanie i podsumowanie ustaleń.' },
  ];

  const handleGenerate = async (altModel?: string) => {
    if (!kontekst.trim()) return;

    const punkty = dodatkowe.filter(p => p.trim());

    const result = await api.call({
      model: altModel || model,
      company_prompt: companyPrompt || undefined,
      typ,
      ton,
      jezyk: 'pl',
      odbiorca,
      kontekst,
      temat: temat || undefined,
      dodatkowe_punkty: punkty.length > 0 ? punkty : undefined,
    });

    if (result?.email) {
      if (altModel) {
        setAlternativeEmail(result.email);
      } else {
        setGeneratedEmail(result.email);
        setAlternativeEmail('');
      }
    }
  };

  const generateAlternative = () => {
    const nextModel = model === 'auto' ? 'szybki' : model === 'szybki' ? 'dokladny' : 'auto';
    handleGenerate(nextModel);
  };

  const dodajPunkt = () => setDodatkowe([...dodatkowe, '']);
  const usunPunkt = (i: number) => setDodatkowe(dodatkowe.filter((_, idx) => idx !== i));
  const updatePunkt = (i: number, val: string) => {
    const copy = [...dodatkowe];
    copy[i] = val;
    setDodatkowe(copy);
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const useTemplate = (t: typeof templates[0]) => {
    setOdbiorca(t.odbiorca);
    setKontekst(t.kontekst);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto">
      <AntAgentPanel currentTool="Asystent Email" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Konfiguracji */}
        <div className="space-y-6">
          {/* Szablony */}
          <div className="card bg-gradient-to-br from-primary-900/20 to-business-surface border-primary-700/50">
            <h3 className="text-lg font-bold mb-4">⚡ Szybkie szablony</h3>
            <div className="space-y-2">
              {templates.map((t, i) => (
                <button key={i} onClick={() => useTemplate(t)} className="w-full text-left p-3 bg-business-dark hover:bg-business-border rounded-lg transition-colors text-sm">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-business-text-dim mt-1">Do: {t.odbiorca}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Formularz */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">⚙️ Stwórz Email</h2>

            {/* Konfiguracja top row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Typ emaila</label>
                <select value={typ} onChange={(e) => setTyp(e.target.value)} className="input-field">
                  {typy.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ton</label>
                <select value={ton} onChange={(e) => setTon(e.target.value)} className="input-field">
                  {tony.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Odbiorca <span className="text-red-400">*</span></label>
              <input type="text" value={odbiorca} onChange={(e) => setOdbiorca(e.target.value)} className="input-field"
                placeholder="Dyrektor zakupów, klient VIP, partner biznesowy..." />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Temat emaila (opcjonalnie)</label>
              <input type="text" value={temat} onChange={(e) => setTemat(e.target.value)} className="input-field"
                placeholder="Np. Oferta współpracy – usługi marketingowe" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Opis sytuacji / cel emaila <span className="text-red-400">*</span></label>
              <textarea value={kontekst} onChange={(e) => setKontekst(e.target.value)} className="textarea-field" rows={4}
                placeholder="Np. Chcemy zaproponować pierwsze spotkanie i przedstawić ofertę usług. Klient pytał o wdrożenie CRM." />
            </div>

            {/* Dodatkowe punkty */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Dodatkowe punkty do uwzględnienia</label>
              <div className="space-y-2">
                {dodatkowe.map((punkt, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={punkt} onChange={(e) => updatePunkt(i, e.target.value)} className="input-field flex-1"
                      placeholder={`Punkt ${i + 1} (np. podkreśl doświadczenie firmy)`} />
                    {dodatkowe.length > 1 && (
                      <button onClick={() => usunPunkt(i)} className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 text-sm">×</button>
                    )}
                  </div>
                ))}
                <button onClick={dodajPunkt} className="btn-secondary text-xs">+ Dodaj punkt</button>
              </div>
            </div>

            {/* AI Config */}
            <div className="mb-6 space-y-4 border-t border-business-border pt-4">
              <AIModelSelector value={model} onChange={setModel} />
              <CompanyPromptField value={companyPrompt} onChange={setCompanyPrompt}
                placeholder="Np. Polska firma usługowa, współpraca B2B i B2C, stawiamy na uprzejmą i konkretną komunikację." />
            </div>

            <button onClick={() => handleGenerate()} disabled={api.loading || !kontekst.trim()} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {api.loading ? <><span className="loading-spinner inline-block mr-2" />Piszę email...</> : '📧 Wygeneruj Email'}
            </button>

            {api.error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">⚠️ {api.error}</div>}
          </div>
        </div>

        {/* Panel Wyniku */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">📧 Wygenerowany Email</h2>

          {!generatedEmail && !api.loading && (
            <div className="text-center py-12 text-business-text-dim">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>Twój email pojawi się tutaj</p>
            </div>
          )}

          {api.loading && (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4" />
              <p className="text-business-text-dim">AI pisze dla Ciebie email...</p>
            </div>
          )}

          {generatedEmail && (
            <div className="space-y-4">
              <div className="bg-white text-gray-900 rounded-lg p-6 border-2 border-business-border">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{generatedEmail}</pre>
              </div>
              {api.meta && <ToolResultMeta model={api.meta.model} czas={api.meta.czas} tokeny={api.meta.tokeny} />}

              <div className="flex gap-3">
                <button onClick={() => copyToClipboard(generatedEmail)} className="btn-primary flex-1">📋 Kopiuj</button>
                <button onClick={generateAlternative} className="btn-secondary flex-1" disabled={api.loading}>🔄 Inna wersja</button>
                <button onClick={() => { setGeneratedEmail(''); setAlternativeEmail(''); setKontekst(''); setOdbiorca(''); }} className="btn-secondary">🆕 Nowy</button>
              </div>

              {alternativeEmail && (
                <div className="bg-business-dark border border-blue-500/30 rounded-lg p-6 mt-4">
                  <h4 className="text-sm font-bold text-blue-400 mb-3">🔄 Alternatywna wersja:</h4>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">{alternativeEmail}</pre>
                  <button onClick={() => copyToClipboard(alternativeEmail)} className="btn-secondary mt-3 text-xs">📋 Kopiuj tę wersję</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AsystentEmail;
