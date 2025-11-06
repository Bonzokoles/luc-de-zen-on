import { useState, useEffect } from 'react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

const NewsBiznesowe = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'business' | 'technology' | 'ai'>('business');

  // Przykładowe dane (w production użyj prawdziwego API)
  const mockNews: Record<string, NewsArticle[]> = {
    business: [
      {
        title: 'Polski rynek e-commerce rośnie o 15% rocznie',
        description: 'Nowy raport pokazuje dynamiczny wzrost sprzedaży online w Polsce. Eksperci przewidują dalszy rozwój branży.',
        url: '#',
        publishedAt: '2025-11-05',
        source: 'Biznes.pl'
      },
      {
        title: 'Małe firmy inwestują w automatyzację',
        description: 'Ponad 60% małych przedsiębiorstw planuje wdrożyć narzędzia automatyzacji w najbliższym roku.',
        url: '#',
        publishedAt: '2025-11-04',
        source: 'StartupPL'
      },
      {
        title: 'Nowe ulgi podatkowe dla przedsiębiorców',
        description: 'Rząd ogłosił pakiet ulg dla małych i średnich przedsiębiorstw. Sprawdź czy możesz skorzystać.',
        url: '#',
        publishedAt: '2025-11-03',
        source: 'Finanse24'
      }
    ],
    technology: [
      {
        title: 'Cloud computing przyszłością biznesu',
        description: 'Firmy masowo przechodzą na rozwiązania chmurowe. Oszczędności mogą wynieść nawet 40%.',
        url: '#',
        publishedAt: '2025-11-05',
        source: 'TechBiznes'
      },
      {
        title: 'Cyberbezpieczeństwo priorytetem w 2025',
        description: 'Ataki hakerskie rosną. Jak zabezpieczyć swoją firmę? Poradnik dla przedsiębiorców.',
        url: '#',
        publishedAt: '2025-11-04',
        source: 'SecurityPL'
      },
      {
        title: '5G zmienia sposób prowadzenia biznesu',
        description: 'Nowa technologia umożliwia szybszą komunikację i otworzy nowe możliwości dla firm.',
        url: '#',
        publishedAt: '2025-11-03',
        source: 'TechNews'
      }
    ],
    ai: [
      {
        title: 'ChatGPT w polskich firmach - case study',
        description: 'Jak polskie firmy wykorzystują AI do obsługi klienta i generowania treści. Realne przykłady.',
        url: '#',
        publishedAt: '2025-11-05',
        source: 'AI w Biznesie'
      },
      {
        title: 'AI asystenci zwiększają produktywność o 30%',
        description: 'Badanie pokazuje, że firmy korzystające z AI pracują szybciej i efektywniej.',
        url: '#',
        publishedAt: '2025-11-04',
        source: 'AIToday'
      },
      {
        title: 'Etyka AI - nowe regulacje w UE',
        description: 'Unia Europejska wprowadza przepisy dotyczące odpowiedzialnego wykorzystania sztucznej inteligencji.',
        url: '#',
        publishedAt: '2025-11-03',
        source: 'EUTech'
      }
    ]
  };

  useEffect(() => {
    // Symulacja ładowania
    setLoading(true);
    setTimeout(() => {
      setNews(mockNews[category]);
      setLoading(false);
    }, 500);
  }, [category]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          📰 Wiadomości
        </h2>

        {/* Kategorie */}
        <div className="flex gap-2">
          <button
            onClick={() => setCategory('business')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === 'business'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                : 'bg-business-surface border border-business-border hover:border-business-accent'
            }`}
          >
            💼 Biznes
          </button>
          <button
            onClick={() => setCategory('technology')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === 'technology'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                : 'bg-business-surface border border-business-border hover:border-business-accent'
            }`}
          >
            💻 Tech
          </button>
          <button
            onClick={() => setCategory('ai')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === 'ai'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                : 'bg-business-surface border border-business-border hover:border-business-accent'
            }`}
          >
            🤖 AI
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-business-text-dim text-sm">Ładowanie wiadomości...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-business-dark border border-business-border rounded-lg p-4 hover:border-business-accent transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg group-hover:text-business-accent transition-colors flex-grow">
                  {article.title}
                </h3>
                <svg className="w-5 h-5 text-business-accent flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </div>

              <p className="text-sm text-business-text-dim mb-3">
                {article.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-business-text-dim">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                  </svg>
                  {article.source}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-business-dark border border-business-border rounded-lg text-center">
        <p className="text-sm text-business-text-dim">
          💡 <strong>Wskazówka:</strong> Te wiadomości są przykładowe. W pełnej wersji zobaczysz prawdziwe, aktualne newsy z API.
        </p>
      </div>
    </div>
  );
};

export default NewsBiznesowe;
