import { useState } from 'react';
import { FileText, Sparkles, Copy, Download, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  useAIExecute,
  AIModelSelector,
  CompanyPromptField,
  AIResultMeta,
} from '../shared/AIToolComponents';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt: string;
}

const templates: DocumentTemplate[] = [
  {
    id: 'umowa-uslug',
    name: 'Umowa Świadczenia Usług',
    description: 'Profesjonalna umowa między usługodawcą a klientem',
    category: 'Umowy',
    icon: '📝',
    prompt: 'Utwórz profesjonalną umowę świadczenia usług zgodnie z prawem polskim. Zawrzyj sekcje: strony umowy, przedmiot umowy, wynagrodzenie, terminy, odpowiedzialność, klauzule końcowe.'
  },
  {
    id: 'polityka-prywatnosci',
    name: 'Polityka Prywatności (RODO)',
    description: 'Zgodna z RODO polityka dla strony/sklepu',
    category: 'Prawne',
    icon: '🔒',
    prompt: 'Stwórz kompleksową Politykę Prywatności zgodną z RODO dla strony internetowej/sklepu. Zawrzyj: administratora danych, cel przetwarzania, podstawę prawną, prawa użytkowników, cookies, bezpieczeństwo danych.'
  },
  {
    id: 'regulamin-sklepu',
    name: 'Regulamin Sklepu Internetowego',
    description: 'Kompletny regulamin e-commerce',
    category: 'E-commerce',
    icon: '🛒',
    prompt: 'Wygeneruj regulamin sklepu internetowego zgodny z polskim prawem. Zawrzyj: definicje, warunki sprzedaży, realizacja zamówień, płatności, zwroty i reklamacje, ochrona danych osobowych.'
  },
  {
    id: 'umowa-zlecenie',
    name: 'Umowa Zlecenie',
    description: 'Umowa na określone zadanie/projekt',
    category: 'Umowy',
    icon: '🤝',
    prompt: 'Utwórz umowę zlecenia zgodną z Kodeksem Cywilnym. Zawrzyj: strony, przedmiot zlecenia, termin wykonania, wynagrodzenie, zasady rozliczenia, warunki odstąpienia.'
  },
  {
    id: 'nda',
    name: 'NDA (Umowa Poufności)',
    description: 'Chroni tajemnice przedsiębiorstwa',
    category: 'Prawne',
    icon: '🔐',
    prompt: 'Stwórz umowę o zachowaniu poufności (NDA) dla polskich firm. Zawrzyj: definicję informacji poufnych, zobowiązania stron, okres obowiązywania, kary umowne, sąd właściwy.'
  },
  {
    id: 'oferta-handlowa',
    name: 'Oferta Handlowa',
    description: 'Profesjonalna oferta dla klienta',
    category: 'Biznes',
    icon: '💼',
    prompt: 'Wygeneruj profesjonalną ofertę handlową. Zawrzyj: opis firmy, zakres usług/produktów, cennik, korzyści, warunki współpracy, dane kontaktowe, czas ważności oferty.'
  },
  {
    id: 'umowa-wspolpracy',
    name: 'Umowa Współpracy B2B',
    description: 'Współpraca między firmami',
    category: 'Umowy',
    icon: '🤝',
    prompt: 'Utwórz umowę współpracy B2B między dwoma firmami. Zawrzyj: przedmiot współpracy, obowiązki stron, rozliczenia finansowe, czas trwania, warunki rozwiązania.'
  },
  {
    id: 'oswiadczenie-rodo',
    name: 'Oświadczenie RODO',
    description: 'Klauzula informacyjna RODO',
    category: 'Prawne',
    icon: '📋',
    prompt: 'Stwórz klauzulę informacyjną RODO dla zbierania danych osobowych (np. rekrutacja, formularz kontaktowy). Zawrzyj wszystkie wymagane elementy art. 13 RODO.'
  }
];

const KreatorDokumentow = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customDetails, setCustomDetails] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [localError, setLocalError] = useState('');
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Nowe: model selector + company prompt
  const [model, setModel] = useState('auto');
  const [companyPrompt, setCompanyPrompt] = useState('');

  const { execute, loading: isGenerating, error: aiError, result: aiResult } = useAIExecute();

  const handleGenerate = async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) {
      setLocalError('Wybierz szablon dokumentu');
      return;
    }

    setLocalError('');
    setGeneratedDocument('');

    const detailsText = customDetails.trim();
    const companyText = companyName.trim();

    const userPayload = {
      rodzaj: template.name,
      szablon_prompt: template.prompt,
      nazwa_firmy: companyText || undefined,
      szczegoly: detailsText || undefined,
      jezyk: 'pl',
    };

    const data = await execute({
      narzedzie: 'kreator_dokumentow',
      model,
      company_prompt: companyPrompt || undefined,
      payload: userPayload,
    });

    if (data?.wynik) {
      setGeneratedDocument(data.wynik);
    }
  };

  const error = localError || aiError;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const downloadDocument = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const filename = `${template?.name.replace(/\s+/g, '_')}_${Date.now()}.md`;

    const blob = new Blob([generatedDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-primary-400" />
          Kreator Dokumentów Biznesowych
        </h1>
        <p className="text-gray-300">
          Generuj profesjonalne dokumenty prawne z pomocą AI - zgodnie z polskim prawem
        </p>
      </div>

      {/* Templates Selection */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">📚 Wybierz szablon dokumentu</h2>

        {categories.map(category => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">{category}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.filter(t => t.category === category).map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${selectedTemplate === template.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-surface-dark'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{template.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-400">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Details Form */}
      {selectedTemplate && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">✍️ Szczegóły dokumentu</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Nazwa firmy (opcjonalnie)
              </label>
              <input
                type="text"
                placeholder="np. Tech Solutions Sp. z o.o."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Dodatkowe szczegóły i wymagania (opcjonalnie)
              </label>
              <textarea
                placeholder={`Przykład dla umowy:
- Strony: [Twoja firma] i [Nazwa klienta]
- Usługa: Tworzenie strony internetowej
- Wynagrodzenie: 5000 PLN netto
- Termin: 30 dni od podpisania
- Dodatkowe warunki: możliwość przedłużenia o 14 dni`}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className="input-field resize-none"
                rows={8}
              />
              <p className="text-xs text-gray-400 mt-2">
                💡 Podaj konkretne informacje, które powinny znaleźć się w dokumencie
              </p>
            </div>

            {/* Model AI + Kontekst firmy */}
            <div className="space-y-4 border-t border-gray-700 pt-4">
              <AIModelSelector value={model} onChange={setModel} />
              <CompanyPromptField value={companyPrompt} onChange={setCompanyPrompt} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Generuję dokument...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Wygeneruj dokument AI
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card bg-red-900/20 border-red-500/50">
          <div className="flex items-center gap-3 text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Generated Document */}
      {generatedDocument && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Wygenerowany dokument
            </h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedMessage ? 'Skopiowano!' : 'Kopiuj'}
              </button>
              <button
                onClick={downloadDocument}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Pobierz .md
              </button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="bg-white text-gray-900 p-8 rounded-lg max-h-[600px] overflow-y-auto prose prose-sm max-w-none">
            <ReactMarkdown>{generatedDocument}</ReactMarkdown>
          </div>
          {aiResult && <AIResultMeta result={aiResult} />}

          {/* Warning */}
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-200">
                <p className="font-bold mb-1">⚠️ Ważna informacja prawna</p>
                <p>
                  Ten dokument został wygenerowany przez AI jako szablon/pomoc.
                  Przed użyciem w prawdziwych transakcjach biznesowych <strong>skonsultuj go z prawnikiem</strong>.
                  Nie ponosimy odpowiedzialności za skutki użycia dokumentu bez weryfikacji prawnej.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="card bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-2">Jak używać Kreatora Dokumentów?</p>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>Wybierz szablon dokumentu z listy powyżej</li>
              <li>Podaj nazwę firmy i szczegóły (opcjonalnie - AI wypełni placeholdery)</li>
              <li>Kliknij "Wygeneruj dokument AI"</li>
              <li>Sprawdź dokument, edytuj jeśli potrzeba</li>
              <li>Skopiuj lub pobierz gotowy dokument</li>
              <li><strong className="text-yellow-400">ZAWSZE skonsultuj z prawnikiem przed użyciem!</strong></li>
            </ol>
            <p className="mt-3">
              💡 <strong>Wskazówka:</strong> Im więcej szczegółów podasz, tym lepiej dostosowany będzie dokument.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KreatorDokumentow;
