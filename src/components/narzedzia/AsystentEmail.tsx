import { useState } from 'react';
import { motion } from 'framer-motion';

const AsystentEmail = () => {
  const [emailType, setEmailType] = useState('email biznesowy');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('profesjonalny');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const emailTypes = [
    'email biznesowy',
    'odpowiedź na zapytanie',
    'oferta handlowa',
    'prośba o informacje',
    'zaproszenie na spotkanie',
    'podziękowanie',
    'przeprosiny',
    'przypomnienie o płatności'
  ];

  const tones = [
    'profesjonalny',
    'formalny',
    'uprzejmy',
    'bezpośredni',
    'przyjazny',
  ];

  const templates = [
    {
      title: 'Pierwsze zapytanie ofertowe',
      recipient: 'potencjalny dostawca',
      purpose: 'zapytanie o cenę i warunki współpracy',
    },
    {
      title: 'Przypomnienie o płatności',
      recipient: 'klient',
      purpose: 'uprzejme przypomnienie o niezapłaconej fakturze',
    },
    {
      title: 'Zaproszenie na spotkanie',
      recipient: 'partner biznesowy',
      purpose: 'ustalenie terminu spotkania w sprawie współpracy',
    }
  ];

  const handleGenerate = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      setError('Wypełnij wszystkie wymagane pola');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedEmail('');

    try {
      // 🤖 MODEL AI: GPT-4 TURBO
      // Profesjonalne emaile biznesowe, formalne pisma, oferty
      // Endpoint: /api/generate-email
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType,
          recipient,
          purpose,
          tone,
          additionalInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd generowania');
      }

      setGeneratedEmail(data.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    alert('Email skopiowany do schowka! ✅');
  };

  const useTemplate = (template: typeof templates[0]) => {
    setRecipient(template.recipient);
    setPurpose(template.purpose);
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
        <div className="space-y-6">

          {/* Szablony */}
          <div className="card bg-gradient-to-br from-primary-900/20 to-business-surface border-primary-700/50">
            <h3 className="text-lg font-bold mb-4">⚡ Szybkie Szablony</h3>
            <div className="space-y-2">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => useTemplate(template)}
                  className="w-full text-left p-3 bg-business-dark hover:bg-business-border rounded-lg transition-colors text-sm"
                >
                  <div className="font-medium">{template.title}</div>
                  <div className="text-xs text-business-text-dim mt-1">
                    Do: {template.recipient}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formularz */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">
              ⚙️ Stwórz Email
            </h2>

            {/* Typ */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Typ emaila
              </label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="input-field"
              >
                {emailTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Odbiorca */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Do kogo piszesz? <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input-field"
                placeholder="Np. klient, dostawca, partner biznesowy"
              />
            </div>

            {/* Cel */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                W jakiej sprawie? <span className="text-red-400">*</span>
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="textarea-field"
                rows={3}
                placeholder="Np. chcę zapytać o cenę za 100 sztuk produktów X"
              />
            </div>

            {/* Ton */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Ton wiadomości
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

            {/* Dodatkowe info */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Dodatkowe informacje (opcjonalnie)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="textarea-field"
                rows={2}
                placeholder="Np. termin, kwota, szczegóły..."
              />
            </div>

            {/* Przycisk */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !recipient.trim() || !purpose.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner inline-block mr-2"></span>
                  Piszę email...
                </>
              ) : (
                '✉️ Wygeneruj Email'
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>

        {/* Panel Wyniku */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">
            📧 Wygenerowany Email
          </h2>

          {!generatedEmail && !isLoading && (
            <div className="text-center py-12 text-business-text-dim">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <p>Twój email pojawi się tutaj</p>
              <p className="text-sm mt-2">Wypróbuj szybkie szablony lub stwórz własny!</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-business-text-dim">AI pisze dla Ciebie email...</p>
            </div>
          )}

          {generatedEmail && (
            <div className="space-y-4">
              <div className="bg-white text-gray-900 rounded-lg p-6 border-2 border-business-border">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {generatedEmail}
                </pre>
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
                    setGeneratedEmail('');
                    setRecipient('');
                    setPurpose('');
                    setAdditionalInfo('');
                  }}
                  className="btn-secondary"
                >
                  🔄 Nowy
                </button>
              </div>

              <div className="bg-business-accent-soft/10 border border-business-accent-soft/30 rounded-lg p-4">
                <p className="text-sm text-business-text-dim">
                  💡 <strong>Wskazówka:</strong> Sprawdź email przed wysłaniem i dostosuj go do swojego stylu.
                  Możesz zmienić imię, dane kontaktowe lub dodać własne informacje.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AsystentEmail;
