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

interface GeneratorResponse {
  tresc: string;
  model_uzyty: { nazwa_logiczna: string; provider: string; model_id: string };
  czas: number;
  tokeny: { input: number; output: number };
}

const GeneratorTresci = () => {
  const [contentType, setContentType] = useState('post_social');
  const [channel, setChannel] = useState('facebook');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('profesjonalny');
  const [length, setLength] = useState('srednia');
  const [generatedContent, setGeneratedContent] = useState('');
  const [alternativeContent, setAlternativeContent] = useState('');

  const [model, setModel] = useState('auto');
  const [companyPrompt, setCompanyPrompt] = useState('');

  const api = useToolAPI<GeneratorResponse>('/api/narzedzia/generator-tresci');

  const contentTypes = [
    { value: 'post_social', label: 'Post na social media' },
    { value: 'opis_produktu', label: 'Opis produktu' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'artykul', label: 'Artykuł blogowy' },
    { value: 'opis_firmy', label: 'Opis firmy / usługi' },
    { value: 'ogloszenie', label: 'Ogłoszenie o usłudze' },
  ];

  const channels = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'blog', label: 'Blog / strona www' },
    { value: 'newsletter', label: 'Email / newsletter' },
  ];

  const tones = [
    { value: 'profesjonalny', label: 'Profesjonalny' },
    { value: 'przyjazny', label: 'Przyjazny' },
    { value: 'entuzjastyczny', label: 'Entuzjastyczny' },
    { value: 'formalny', label: 'Formalny' },
    { value: 'swobodny', label: 'Swobodny' },
    { value: 'motywujacy', label: 'Motywujący' },
  ];

  const lengths = [
    { value: 'krotka', label: 'Krótka (1-2 zdania)' },
    { value: 'srednia', label: 'Średnia (akapit)' },
    { value: 'dluga', label: 'Długa (kilka akapitów)' },
  ];

  const handleGenerate = async (altModel?: string) => {
    if (!description.trim()) return;

    const result = await api.call({
      model: altModel || model,
      company_prompt: companyPrompt || undefined,
      typ: contentType,
      kanal: channel,
      ton: tone,
      dlugosc: length,
      jezyk: 'pl',
      opis: description,
    });

    if (result?.tresc) {
      if (altModel) {
        setAlternativeContent(result.tresc);
      } else {
        setGeneratedContent(result.tresc);
        setAlternativeContent('');
      }
    }
  };

  const generateAlternative = () => {
    const nextModel = model === 'auto' ? 'szybki' : model === 'szybki' ? 'dokladny' : 'auto';
    handleGenerate(nextModel);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto">
      <AntAgentPanel currentTool="Generator Treści" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Konfiguracji */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="card">
          <h2 className="text-2xl font-bold mb-6">⚙️ Konfiguracja</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Typ treści</label>
            <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="input-field">
              {contentTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Kanał publikacji</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="input-field">
              {channels.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Opisz czego potrzebujesz <span className="text-red-400">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea-field" rows={4}
              placeholder="Np. Ogłoszenie nowej funkcji raportowania w aplikacji. Chcemy podkreślić łatwość użycia i oszczędność czasu." />
            <p className="text-xs text-business-text-dim mt-1">Im więcej szczegółów, tym lepszy wynik!</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Ton</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-field">
              {tones.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Długość</label>
            <select value={length} onChange={(e) => setLength(e.target.value)} className="input-field">
              {lengths.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          <div className="mb-6 space-y-4 border-t border-business-border pt-4">
            <AIModelSelector value={model} onChange={setModel} />
            <CompanyPromptField value={companyPrompt} onChange={setCompanyPrompt}
              placeholder="Np. Jesteśmy polską firmą B2B, sprzedajemy oprogramowanie dla małych firm. Komunikacja: profesjonalna, ale przystępna." />
          </div>

          <button onClick={() => handleGenerate()} disabled={api.loading || !description.trim()} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {api.loading ? <><span className="loading-spinner inline-block mr-2" />Generuję...</> : '✨ Wygeneruj Treść'}
          </button>

          {api.error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">⚠️ {api.error}</div>}
        </motion.div>

        {/* Panel Wyniku */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="card">
          <h2 className="text-2xl font-bold mb-6">📄 Wygenerowana Treść</h2>

          {!generatedContent && !api.loading && (
            <div className="text-center py-12 text-business-text-dim">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Twoja treść pojawi się tutaj</p>
            </div>
          )}

          {api.loading && (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4" />
              <p className="text-business-text-dim">AI tworzy dla Ciebie treść...</p>
            </div>
          )}

          {generatedContent && (
            <div className="space-y-4">
              <div className="bg-business-dark border border-business-border rounded-lg p-6">
                <div className="prose prose-invert max-w-none"><ReactMarkdown>{generatedContent}</ReactMarkdown></div>
                {api.meta && <ToolResultMeta model={api.meta.model} czas={api.meta.czas} tokeny={api.meta.tokeny} />}
              </div>

              <div className="flex gap-3">
                <button onClick={() => copyToClipboard(generatedContent)} className="btn-primary flex-1">📋 Kopiuj</button>
                <button onClick={generateAlternative} className="btn-secondary flex-1" disabled={api.loading}>🔄 Inna wersja</button>
                <button onClick={() => { setGeneratedContent(''); setAlternativeContent(''); setDescription(''); }} className="btn-secondary">🆕 Nowy</button>
              </div>

              {alternativeContent && (
                <div className="bg-business-dark border border-blue-500/30 rounded-lg p-6 mt-4">
                  <h4 className="text-sm font-bold text-blue-400 mb-3">🔄 Alternatywna wersja (inny model):</h4>
                  <div className="prose prose-invert max-w-none"><ReactMarkdown>{alternativeContent}</ReactMarkdown></div>
                  <button onClick={() => copyToClipboard(alternativeContent)} className="btn-secondary mt-3 text-xs">📋 Kopiuj tę wersję</button>
                </div>
              )}

              <div className="bg-business-accent/10 border border-business-accent/30 rounded-lg p-4">
                <p className="text-sm text-business-text-dim">
                  💡 <strong>Wskazówka:</strong> Kliknij "Inna wersja" żeby wygenerować tekst innym modelem AI.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GeneratorTresci;
