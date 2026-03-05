import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import {
  useAIExecute,
  AIModelSelector,
  CompanyPromptField,
  AIResultMeta,
  AIStatusIndicator,
} from '../shared/AIToolComponents';

const GeneratorTresci = () => {
  const [contentType, setContentType] = useState('post na Facebooka');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('profesjonalny');
  const [length, setLength] = useState('średnia');
  const [generatedContent, setGeneratedContent] = useState('');

  // Nowe: model selector + company prompt
  const [model, setModel] = useState('auto');
  const [companyPrompt, setCompanyPrompt] = useState('');
  const [localError, setLocalError] = useState('');

  const { execute, loading: isLoading, error: aiError, result: aiResult } = useAIExecute();

  const contentTypes = [
    'post na Facebooka',
    'post na LinkedIn',
    'post na Instagram',
    'opis produktu',
    'ogłoszenie o usłudze',
    'newsletter',
    'artykuł blogowy',
    'opis firmy'
  ];

  const tones = [
    'profesjonalny',
    'przyjazny',
    'entuzjastyczny',
    'formalny',
    'zabawny',
    'motywujący'
  ];

  const lengths = [
    'krótka (1-2 zdania)',
    'średnia (akapit)',
    'długa (kilka akapitów)'
  ];

  const handleGenerate = async () => {
    if (!description.trim()) {
      setLocalError('Proszę opisz czego potrzebujesz');
      return;
    }

    setLocalError('');
    setGeneratedContent('');

    const data = await execute({
      narzedzie: 'generator_tresci',
      model,
      company_prompt: companyPrompt || undefined,
      payload: {
        typ: contentType,
        opis: description,
        ton: tone,
        dlugosc: length,
        jezyk: 'pl',
      },
    });

    if (data?.wynik) {
      setGeneratedContent(data.wynik);
    }
  };

  const error = localError || aiError;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Skopiowano do schowka! ✅');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Panel Konfiguracji */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6">
            ⚙️ Konfiguracja
          </h2>

          {/* Typ treści */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Co chcesz stworzyć?
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="input-field"
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Opis */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Opisz czego potrzebujesz
              <span className="text-red-400 ml-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-field"
              placeholder="Np. Promocja nowej pizzerii w Warszawie, specjalna oferta na pizze 2+1 gratis w piątki"
            />
            <p className="text-xs text-business-text-dim mt-1">
              Im więcej szczegółów, tym lepszy wynik!
            </p>
          </div>

          {/* Ton */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Jaki ma być ton wypowiedzi?
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input-field"
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Długość */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Jak długi ma być tekst?
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="input-field"
            >
              {lengths.map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Model AI + Kontekst firmy */}
          <div className="mb-6 space-y-4 border-t border-business-border pt-4">
            <AIModelSelector value={model} onChange={setModel} />
            <CompanyPromptField value={companyPrompt} onChange={setCompanyPrompt} />
          </div>

          {/* Przycisk */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !description.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner inline-block mr-2"></span>
                Generuję...
              </>
            ) : (
              '✨ Wygeneruj Treść'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}
        </motion.div>

        {/* Panel Wyniku */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6">
            📄 Wygenerowana Treść
          </h2>

          {!generatedContent && !isLoading && (
            <div className="text-center py-12 text-business-text-dim">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>Twoja treść pojawi się tutaj</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-business-text-dim">AI tworzy dla Ciebie treść...</p>
            </div>
          )}

          {generatedContent && (
            <div className="space-y-4">
              <div className="bg-business-dark border border-business-border rounded-lg p-6">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{generatedContent}</ReactMarkdown>
                </div>
                {aiResult && <AIResultMeta result={aiResult} />}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="btn-primary flex-1"
                >
                  📋 Kopiuj
                </button>
                <button
                  onClick={() => {
                    setGeneratedContent('');
                    setDescription('');
                  }}
                  className="btn-secondary"
                >
                  🔄 Nowy
                </button>
              </div>

              <div className="bg-business-accent/10 border border-business-accent/30 rounded-lg p-4">
                <p className="text-sm text-business-text-dim">
                  💡 <strong>Wskazówka:</strong> Możesz edytować wygenerowaną treść według potrzeb.
                  Jeśli nie podoba Ci się wynik, zmień opis lub kliknij "Nowy" i spróbuj ponownie!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Przykłady użycia */}
      <div className="mt-8 card">
        <h3 className="text-xl font-bold mb-4">💡 Przykłady zastosowań</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-business-dark border border-business-border rounded-lg p-4">
            <h4 className="font-bold mb-2">📱 Social Media</h4>
            <p className="text-sm text-business-text-dim">
              Posty na Facebook, Instagram, LinkedIn - z odpowiednimi hashtagami i CTA
            </p>
          </div>
          <div className="bg-business-dark border border-business-border rounded-lg p-4">
            <h4 className="font-bold mb-2">🛍️ E-commerce</h4>
            <p className="text-sm text-business-text-dim">
              Opisy produktów, które sprzedają - z korzyściami i wezwaniem do zakupu
            </p>
          </div>
          <div className="bg-business-dark border border-business-border rounded-lg p-4">
            <h4 className="font-bold mb-2">📧 Email Marketing</h4>
            <p className="text-sm text-business-text-dim">
              Newslettery, oferty specjalne, komunikaty do klientów
            </p>
          </div>
          <div className="bg-business-dark border border-business-border rounded-lg p-4">
            <h4 className="font-bold mb-2">📝 Blogi</h4>
            <p className="text-sm text-business-text-dim">
              Artykuły eksperckie, porady, przewodniki dla Twojej branży
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GeneratorTresci;
