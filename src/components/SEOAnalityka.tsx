import { useState, useEffect } from 'react';
import { Search, TrendingUp, Globe, BarChart3, Target, Eye, Download, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';

interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
}

interface PositionData {
  keyword: string;
  position: number;
  previousPosition: number;
  url: string;
  date: string;
}

interface TrafficData {
  date: string;
  visits: number;
  pageviews: number;
  uniqueVisitors: number;
  bounceRate: number;
}

interface SEOScore {
  overall: number;
  title: number;
  description: number;
  headings: number;
  images: number;
  performance: number;
}

const SEOAnalityka = () => {
  const [activeTab, setActiveTab] = useState<'keywords' | 'positions' | 'analytics' | 'onpage'>('keywords');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo data
  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    // ⚠️ DANE DEMONSTRACYJNE - wyzerowane. Rozpocznij pracę z narzędziami aby zobaczyć prawdziwe dane.
    const demoKeywords: Keyword[] = [];

    const demoPositions: PositionData[] = [];

    const demoTraffic: TrafficData[] = [];

    setKeywords(demoKeywords);
    setPositions(demoPositions);
    setTrafficData(demoTraffic);
  };

  const searchKeywords = async () => {
    if (!searchQuery.trim()) {
      alert('Wpisz fraz─Ö do wyszukania');
      return;
    }

    setIsAnalyzing(true);

    // Symulacja API call - w prawdziwej wersji u┼╝yj Gemini AI lub SEO API
    setTimeout(() => {
      const suggestions: Keyword[] = [
        { keyword: searchQuery, volume: Math.floor(Math.random() * 2000), difficulty: Math.floor(Math.random() * 100), cpc: parseFloat((Math.random() * 5).toFixed(2)), trend: 'up' },
        { keyword: `${searchQuery} online`, volume: Math.floor(Math.random() * 1500), difficulty: Math.floor(Math.random() * 100), cpc: parseFloat((Math.random() * 5).toFixed(2)), trend: 'stable' },
        { keyword: `${searchQuery} 2025`, volume: Math.floor(Math.random() * 1000), difficulty: Math.floor(Math.random() * 100), cpc: parseFloat((Math.random() * 5).toFixed(2)), trend: 'up' },
        { keyword: `najlepsze ${searchQuery}`, volume: Math.floor(Math.random() * 800), difficulty: Math.floor(Math.random() * 100), cpc: parseFloat((Math.random() * 5).toFixed(2)), trend: 'down' },
        { keyword: `${searchQuery} za darmo`, volume: Math.floor(Math.random() * 1200), difficulty: Math.floor(Math.random() * 100), cpc: parseFloat((Math.random() * 5).toFixed(2)), trend: 'up' },
      ];

      setKeywords(suggestions);
      setIsAnalyzing(false);
    }, 1500);
  };

  const analyzeWebsite = async () => {
    if (!websiteUrl.trim()) {
      alert('Wpisz adres URL strony');
      return;
    }

    setIsAnalyzing(true);

    // Symulacja analizy
    setTimeout(() => {
      const score: SEOScore = {
        overall: 78,
        title: 85,
        description: 72,
        headings: 80,
        images: 65,
        performance: 88,
      };

      setSeoScore(score);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-400';
    if (difficulty < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 30) return '┼üatwe';
    if (difficulty < 60) return '┼Ürednie';
    return 'Trudne';
  };

  const exportData = () => {
    const data = {
      keywords,
      positions,
      trafficData,
      seoScore,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Search className="w-8 h-8 text-primary-400" />
          SEO & Analityka Stron
        </h1>
        <p className="text-gray-300">
          Wyszukiwanie s┼é├│w kluczowych, pozycjonowanie, analityka ruchu - wszystko w jednym miejscu
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'keywords'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
          >
            ­čöŹ S┼éowa Kluczowe
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'positions'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
          >
            ­čôł Pozycje w Google
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'analytics'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
          >
            ­čôŐ Analityka Ruchu
          </button>
          <button
            onClick={() => setActiveTab('onpage')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'onpage'
                ? 'bg-primary-600 text-white'
                : 'bg-surface-dark text-gray-300 hover:bg-surface-darker'
              }`}
          >
            ÔÜÖ´ŞĆ Analiza On-Page
          </button>
          <button
            onClick={exportData}
            className="btn-secondary ml-auto flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Eksportuj
          </button>
        </div>
      </div>

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">­čöŹ Wyszukiwanie S┼é├│w Kluczowych</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchKeywords()}
                placeholder="Wpisz fraz─Ö, np. 'marketing AI'"
                className="input-field flex-1"
              />
              <button
                onClick={searchKeywords}
                disabled={isAnalyzing}
                className="btn-primary flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Szukam...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Szukaj
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">­čôő Wyniki ({keywords.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-300">S┼éowo kluczowe</th>
                    <th className="text-center p-3 text-gray-300">Wyszukiwa┼ä/mc</th>
                    <th className="text-center p-3 text-gray-300">Trudno┼Ť─ç</th>
                    <th className="text-center p-3 text-gray-300">CPC (PLN)</th>
                    <th className="text-center p-3 text-gray-300">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-surface-darker">
                      <td className="p-3 text-white font-medium">{kw.keyword}</td>
                      <td className="p-3 text-center text-primary-400">
                        {kw.volume.toLocaleString('pl-PL')}
                      </td>
                      <td className={`p-3 text-center font-bold ${getDifficultyColor(kw.difficulty)}`}>
                        {kw.difficulty} - {getDifficultyLabel(kw.difficulty)}
                      </td>
                      <td className="p-3 text-center text-gray-300">
                        {kw.cpc.toFixed(2)} z┼é
                      </td>
                      <td className="p-3 text-center">
                        {kw.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-400 mx-auto" />}
                        {kw.trend === 'down' && <TrendingUp className="w-5 h-5 text-red-400 mx-auto rotate-180" />}
                        {kw.trend === 'stable' && <span className="text-gray-400">Ôöü</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="card bg-purple-900/20 border-purple-500/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-bold text-white mb-2">­čĺí Wskaz├│wki SEO od AI</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Skup si─Ö na s┼éowach o ┼Ťredniej trudno┼Ťci (30-60) dla lepszego ROI</li>
                  <li>D┼éugie frazy (long-tail) maj─ů ni┼╝sz─ů konkurencj─Ö i lepsz─ů konwersj─Ö</li>
                  <li>Analizuj trendy - rosn─ůce zapytania to szansa na szybki wzrost</li>
                  <li>Wysokie CPC oznacza komercyjn─ů warto┼Ť─ç frazy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">­čôł Monitorowanie Pozycji w Google</h2>

            {positions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Brak ┼Ťledzonych s┼é├│w kluczowych</p>
                <button className="btn-primary mt-4">Dodaj pierwsze s┼éowo</button>
              </div>
            ) : (
              <div className="space-y-4">
                {positions.map((pos, index) => (
                  <div key={index} className="p-4 bg-surface-dark rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white">{pos.keyword}</h3>
                        <p className="text-sm text-gray-400">{pos.url}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary-400">#{pos.position}</div>
                        <div className="text-sm">
                          {pos.position < pos.previousPosition ? (
                            <span className="text-green-400">
                              ÔćĹ +{pos.previousPosition - pos.position} miejsc
                            </span>
                          ) : pos.position > pos.previousPosition ? (
                            <span className="text-red-400">
                              Ôćô -{pos.position - pos.previousPosition} miejsc
                            </span>
                          ) : (
                            <span className="text-gray-400">bez zmian</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Ostatnia aktualizacja: {new Date(pos.date).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Position Chart */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">­čôë Historia Pozycji</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <BarChart3 className="w-16 h-16 opacity-30 mb-2" />
              <p className="ml-4">Wykres historii pozycji (integracja z Recharts)</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {trafficData.reduce((sum, d) => sum + d.visits, 0).toLocaleString('pl-PL')}
              </div>
              <div className="text-xs text-gray-400">Wizyty (7 dni)</div>
            </div>
            <div className="card text-center">
              <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {trafficData.reduce((sum, d) => sum + d.uniqueVisitors, 0).toLocaleString('pl-PL')}
              </div>
              <div className="text-xs text-gray-400">Unikalni</div>
            </div>
            <div className="card text-center">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {trafficData.reduce((sum, d) => sum + d.pageviews, 0).toLocaleString('pl-PL')}
              </div>
              <div className="text-xs text-gray-400">Wy┼Ťwietlenia</div>
            </div>
            <div className="card text-center">
              <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {(trafficData.reduce((sum, d) => sum + d.bounceRate, 0) / trafficData.length).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-400">Bounce Rate</div>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">­čôŐ Ruch na stronie (ostatnie 7 dni)</h2>
            <div className="space-y-3">
              {trafficData.map((day, index) => {
                const maxVisits = Math.max(...trafficData.map(d => d.visits));
                const percentage = (day.visits / maxVisits) * 100;

                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-gray-400">
                      {new Date(day.date).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="relative h-8 bg-surface-darker rounded overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {day.visits} wizyt
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-sm text-gray-400 text-right">
                      {day.bounceRate}% BR
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sources */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">­čîÉ ┼╣r├│d┼éa Ruchu</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface-dark rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Organiczny (Google)</span>
                  <span className="text-green-400 font-bold">54%</span>
                </div>
                <div className="w-full bg-surface-darker rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-surface-dark rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Direct</span>
                  <span className="text-blue-400 font-bold">28%</span>
                </div>
                <div className="w-full bg-surface-darker rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              <div className="p-4 bg-surface-dark rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Social Media</span>
                  <span className="text-purple-400 font-bold">18%</span>
                </div>
                <div className="w-full bg-surface-darker rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* On-Page Tab */}
      {activeTab === 'onpage' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">ÔÜÖ´ŞĆ Analiza SEO On-Page</h2>
            <div className="flex gap-3 mb-6">
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://twoja-strona.pl"
                className="input-field flex-1"
              />
              <button
                onClick={analyzeWebsite}
                disabled={isAnalyzing}
                className="btn-primary flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Analizuj─Ö...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analizuj
                  </>
                )}
              </button>
            </div>

            {seoScore && (
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="text-center p-6 bg-gradient-to-r from-primary-900/30 to-purple-900/30 rounded-lg">
                  <div className="text-6xl font-bold text-primary-400 mb-2">
                    {seoScore.overall}
                  </div>
                  <div className="text-gray-300">Og├│lny wynik SEO</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {seoScore.overall >= 80 && '­čÄë ┼Üwietnie! Twoja strona jest dobrze zoptymalizowana'}
                    {seoScore.overall >= 60 && seoScore.overall < 80 && '­čĹŹ Dobry wynik, ale jest miejsce na popraw─Ö'}
                    {seoScore.overall < 60 && 'ÔÜá´ŞĆ Wymaga optymalizacji'}
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries({
                    title: { label: 'Tytu┼é strony', icon: '­čôä' },
                    description: { label: 'Meta opis', icon: '­čôŁ' },
                    headings: { label: 'Nag┼é├│wki H1-H6', icon: '­čôő' },
                    images: { label: 'Optymalizacja obraz├│w', icon: '­čľ╝´ŞĆ' },
                    performance: { label: 'Wydajno┼Ť─ç', icon: 'ÔÜí' },
                  }).map(([key, { label, icon }]) => {
                    const score = seoScore[key as keyof SEOScore] as number;
                    const percentage = score;

                    return (
                      <div key={key} className="p-4 bg-surface-dark rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-300">
                            {icon} {label}
                          </span>
                          <span className={`font-bold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {score}/100
                          </span>
                        </div>
                        <div className="w-full bg-surface-darker rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recommendations */}
                <div className="card bg-blue-900/20 border-blue-500/30">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    Rekomendacje
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300 ml-6 list-disc">
                    {seoScore.title < 80 && <li>Dodaj s┼éowo kluczowe na pocz─ůtku tytu┼éu strony</li>}
                    {seoScore.description < 80 && <li>Meta opis powinien mie─ç 150-160 znak├│w i zawiera─ç call-to-action</li>}
                    {seoScore.headings < 80 && <li>U┼╝yj tylko jednego H1 na stronie i strukturyzuj tre┼Ť─ç z H2-H6</li>}
                    {seoScore.images < 80 && <li>Dodaj atrybuty alt do wszystkich obrazk├│w i zmniejsz ich rozmiar</li>}
                    {seoScore.performance < 80 && <li>Zoptymalizuj ┼éadowanie strony - u┼╝yj cache i kompresji</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="card bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start gap-3">
          <Search className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-2">­čôł Kompletne narz─Ödzie SEO</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li><strong>S┼éowa kluczowe</strong> - znajd┼║ najlepsze frazy do pozycjonowania</li>
              <li><strong>Pozycje</strong> - ┼Ťled┼║ ranking w Google dla wybranych s┼é├│w</li>
              <li><strong>Analityka</strong> - monitoruj ruch, ┼║r├│d┼éa i zachowania u┼╝ytkownik├│w</li>
              <li><strong>On-Page</strong> - sprawd┼║ optymalizacj─Ö techniczn─ů strony</li>
            </ul>
            <p className="mt-3 text-yellow-400">
              ­čĺí <strong>Wskaz├│wka:</strong> To demo z przyk┼éadowymi danymi. W pe┼énej wersji integracja z prawdziwymi API SEO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAnalityka;
