/**
 * Semantic Search Demo Component
 * Demonstrates HuggingFace MiniHelper (all-MiniLM-L6-v2) for document search
 */

import React, { useState } from 'react';
import { Search, FileText, Loader2 } from 'lucide-react';

interface SearchResult {
  index: number;
  text: string;
  title: string;
  similarity: number;
  metadata: any;
}

interface ApiResponse {
  query: string;
  results: SearchResult[];
  model: string;
  totalDocuments: number;
}

const SemanticSearchDemo = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelInfo, setModelInfo] = useState('');

  // Example documents - in production, these would come from a database
  const sampleDocuments = [
    {
      title: 'Jak wystawić fakturę VAT?',
      text: 'Aby wystawić fakturę VAT, przejdź do narzędzia Generator Faktur. Wprowadź dane sprzedawcy, nabywcy, dodaj pozycje z ceną netto i stawką VAT. System automatycznie obliczy kwotę brutto.',
      metadata: { category: 'faktury', views: 150 }
    },
    {
      title: 'Kalkulator Marży',
      text: 'Kalkulator biznesowy pozwala obliczyć marżę handlową. Wpisz cenę zakupu i sprzedaży, a system obliczy marżę w procentach oraz kwotę zysku.',
      metadata: { category: 'kalkulatory', views: 230 }
    },
    {
      title: 'Generator Treści Marketingowych',
      text: 'Twórz profesjonalne posty na social media używając AI. Wybierz typ treści (Facebook, Instagram, LinkedIn), opisz temat i wybierz ton. AI wygeneruje gotowy post z hashtagami.',
      metadata: { category: 'marketing', views: 420 }
    },
    {
      title: 'Asystent Email Biznesowy',
      text: 'Pisz profesjonalne emaile biznesowe w kilka sekund. Wybierz typ emaila (oferta, zapytanie, przypomnienie), podaj szczegóły, a AI wygeneruje email z odpowiednim tonem.',
      metadata: { category: 'komunikacja', views: 180 }
    },
    {
      title: 'Organizer Zadań',
      text: 'Zarządzaj zadaniami biznesowymi z priorytetami. Dodaj zadanie, ustaw priorytet (wysoki, średni, niski), określ termin wykonania. System zapisuje wszystko lokalnie w przeglądarce.',
      metadata: { category: 'produktywność', views: 95 }
    },
    {
      title: 'Polityka RODO',
      text: 'Generator dokumentów pozwala stworzyć politykę prywatności zgodną z RODO. Wypełnij dane firmy, a AI wygeneruje profesjonalny dokument prawny.',
      metadata: { category: 'dokumenty', views: 310 }
    }
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Wpisz zapytanie');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/mini-helper-semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          documents: sampleDocuments
        })
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Błąd wyszukiwania');
      }

      const data: ApiResponse = await response.json();
      setResults(data.results);
      setModelInfo(`Model: ${data.model} | Przeszukano: ${data.totalDocuments} dokumentów`);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas wyszukiwania');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔍 Semantic Search Demo
          </h1>
          <p className="text-gray-600">
            Wyszukiwanie semantyczne używając HuggingFace MiniHelper (all-MiniLM-L6-v2)
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Wpisz pytanie, np. 'jak obliczyć marżę?'"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Szukam...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Szukaj
                </>
              )}
            </button>
          </div>

          {/* Model Info */}
          {modelInfo && (
            <p className="text-sm text-gray-500 mt-2">{modelInfo}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
            {error.includes('HF_TOKEN') && (
              <p className="text-sm text-red-600 mt-2">
                Skonfiguruj token HuggingFace: <code className="bg-red-100 px-2 py-1 rounded">npx wrangler pages secret put HF_TOKEN</code>
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📊 Wyniki ({results.length})
            </h2>
            {results.map((result, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-500" size={20} />
                    <h3 className="font-semibold text-gray-800">{result.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {(result.similarity * 100).toFixed(1)}% dopasowanie
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{result.text}</p>
                {result.metadata?.category && (
                  <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {result.metadata.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Example Queries */}
        {!loading && results.length === 0 && !error && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">💡 Przykładowe zapytania:</h3>
            <div className="space-y-2">
              {[
                'jak wystawić fakturę?',
                'jak obliczyć marżę?',
                'jak napisać email biznesowy?',
                'jak tworzyć posty na social media?',
                'gdzie zarządzać zadaniami?'
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(example)}
                  className="block text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  → {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Jak to działa?</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Używa modelu <strong>all-MiniLM-L6-v2</strong> z HuggingFace (80MB, bardzo szybki)</li>
            <li>Wyszukiwanie <strong>semantyczne</strong> - rozumie sens, nie tylko słowa</li>
            <li>Działa bez dużych modeli LLM - oszczędność kosztów i czasu</li>
            <li>Zwraca top 5 najlepiej dopasowanych dokumentów</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SemanticSearchDemo;
