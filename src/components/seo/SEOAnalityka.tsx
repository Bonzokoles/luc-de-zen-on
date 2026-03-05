import { useState, useEffect } from "react";
import { Search, TrendingUp, Globe, BarChart3, Target, Download, Sparkles, Bot, Zap, CheckCircle, AlertTriangle, Info, Clock, MapPin, FileText, List } from "lucide-react";

type AIModel = "gpt-4o" | "gpt-4o-mini" | "gemini" | "deepseek";
type RecPriority = "pilne" | "wazne" | "opcjonalne";

interface Keyword { keyword: string; volume: number; difficulty: number; cpc: number; trend: "up"|"down"|"stable"; intent?: string; aiInsight?: string; }
interface CrawlIssue { severity: "error"|"warning"|"info"; title: string; description: string; fix: string; }
interface CrawlResult {
  crawledUrl: string; model: string;
  scores: { overall: number; title: number; description: number; headings: number; content: number; performance: number; };
  detectedKeywords: { keyword: string; count: number; density: number; }[];
  issues: CrawlIssue[];
  strengths: string[];
  recommendations: string[];
  contentSummary: string;
  estimatedRank: string;
}

interface PageEntry {
  id: string;
  url: string;
  title: string;
  seoScore: number;
  lastCrawl: string;
  contentHash: string;
  geoCountry: string;
  geoRegion: string;
  robotsCompliant: boolean;
  crawlHistory: CrawlHistoryItem[];
  aiRecommendations: AIRecommendation[];
}

interface CrawlHistoryItem {
  id: string;
  date: string;
  seoScore: number;
  contentHash: string;
  statusCode: number;
  changeDetected: boolean;
}

interface AIRecommendation {
  id: string;
  priority: RecPriority;
  category: string;
  description: string;
  createdAt: string;
}

const MODELS = [
  { id: "gpt-4o" as AIModel, label: "GPT-4o", color: "text-green-400", icon: "☁️" },
  { id: "gpt-4o-mini" as AIModel, label: "GPT-4o mini", color: "text-emerald-400", icon: "⚡" },
  { id: "gemini" as AIModel, label: "Gemini 1.5", color: "text-blue-400", icon: "💎" },
  { id: "deepseek" as AIModel, label: "DeepSeek", color: "text-purple-400", icon: "🦆" },
];

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function CrawlResultCard({ result }: { result: CrawlResult }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" /> Wyniki SEO
          <span className="ml-auto text-2xl font-bold text-cyan-400">{result.scores.overall}/100</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {([
            ["Title", result.scores.title],
            ["Meta Description", result.scores.description],
            ["Nagłówki", result.scores.headings],
            ["Content", result.scores.content],
            ["Performance", result.scores.performance],
          ] as [string, number][]).map(([label, score]) => (
            <ScoreBar key={label} label={label} score={score} />
          ))}
        </div>
      </div>
      {result.issues?.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Problemy SEO</h3>
          <div className="space-y-2">
            {result.issues.map((issue, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                issue.severity === "error" ? "border-red-500/30 bg-red-500/5" :
                issue.severity === "warning" ? "border-yellow-500/30 bg-yellow-500/5" :
                "border-blue-500/30 bg-blue-500/5"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {issue.severity === "error" ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                   issue.severity === "warning" ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                   <Info className="w-4 h-4 text-blue-400" />}
                  <span className="text-white font-medium text-sm">{issue.title}</span>
                </div>
                <p className="text-gray-400 text-xs ml-6">{issue.description}</p>
                <p className="text-green-400 text-xs ml-6 mt-1">{issue.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {result.strengths?.length > 0 && (
        <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-4">
          <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Mocne strony
          </h3>
          <ul className="space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.detectedKeywords?.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Wykryte słowa kluczowe</h3>
          <div className="flex flex-wrap gap-2">
            {result.detectedKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs">
                {kw.keyword} ({kw.count}x · {kw.density?.toFixed(1)}%)
              </span>
            ))}
          </div>
        </div>
      )}
      {result.recommendations?.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" /> Rekomendacje
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((r, i) => (
              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-cyan-400 font-bold min-w-[20px]">{i+1}.</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.contentSummary && (
        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Podsumowanie treści</h3>
          <p className="text-gray-400 text-sm">{result.contentSummary}</p>
          {result.estimatedRank && (
            <p className="text-cyan-400 text-sm mt-2 font-medium">
              Szacowana pozycja: {result.estimatedRank}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
export default function SEOAnalityka() {
  const [activeTab, setActiveTab] = useState<"keywords"|"crawler"|"pages"|"recommendations">("keywords");
  const [query, setQuery] = useState("");
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [aiModel, setAiModel] = useState<AIModel>("gpt-4o");
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [marketAnalysis, setMarketAnalysis] = useState("");
  const [competitorStrategy, setCompetitorStrategy] = useState("");
  const [crawlUrlInput, setCrawlUrlInput] = useState("");
  const [crawlResult, setCrawlResult] = useState<CrawlResult|null>(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [error, setError] = useState<string|null>(null);

  // Pages management
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageEntry|null>(null);

  // Batch crawl
  const [batchUrls, setBatchUrls] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);

  // AI Agent
  const [aiAgentLoading, setAiAgentLoading] = useState(false);
  const [aiAgentReport, setAiAgentReport] = useState<string|null>(null);

  // GEO input
  const [geoUrl, setGeoUrl] = useState("");
  const [geoResult, setGeoResult] = useState<{country: string; region: string; city: string; suggestions: string[]}|null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Load/save pages
  useEffect(() => {
    const saved = localStorage.getItem('erp-seo-pages');
    if (saved) setPages(JSON.parse(saved));
  }, []);
  useEffect(() => { localStorage.setItem('erp-seo-pages', JSON.stringify(pages)); }, [pages]);

  // KPI
  const totalPages = pages.length;
  const avgScore = totalPages > 0 ? Math.round(pages.reduce((s, p) => s + p.seoScore, 0) / totalPages) : 0;
  const crawlErrors = pages.filter(p => !p.robotsCompliant).length;
  const geoCountries = [...new Set(pages.map(p => p.geoCountry).filter(Boolean))];

  // Generate content hash (simple)
  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return hash.toString(36);
  };

  // Save crawl result as page entry
  const saveCrawlAsPage = (result: CrawlResult) => {
    const hash = simpleHash(result.contentSummary || result.crawledUrl);
    const existing = pages.find(p => p.url === result.crawledUrl);
    const historyItem: CrawlHistoryItem = {
      id: `ch_${Date.now()}`,
      date: new Date().toISOString(),
      seoScore: result.scores.overall,
      contentHash: hash,
      statusCode: 200,
      changeDetected: existing ? existing.contentHash !== hash : false
    };

    // Generate AI recommendations with priorities
    const recs: AIRecommendation[] = (result.recommendations || []).map((r, i) => ({
      id: `rec_${Date.now()}_${i}`,
      priority: (i < 2 ? 'pilne' : i < 5 ? 'wazne' : 'opcjonalne') as RecPriority,
      category: result.issues?.[i]?.title?.split(' ')[0] || 'general',
      description: r,
      createdAt: new Date().toISOString()
    }));

    if (existing) {
      setPages(prev => prev.map(p => p.url === result.crawledUrl ? {
        ...p,
        seoScore: result.scores.overall,
        lastCrawl: new Date().toISOString(),
        contentHash: hash,
        crawlHistory: [...p.crawlHistory, historyItem],
        aiRecommendations: recs,
        title: result.crawledUrl
      } : p));
    } else {
      const newPage: PageEntry = {
        id: `page_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        url: result.crawledUrl,
        title: result.crawledUrl,
        seoScore: result.scores.overall,
        lastCrawl: new Date().toISOString(),
        contentHash: hash,
        geoCountry: '',
        geoRegion: '',
        robotsCompliant: true,
        crawlHistory: [historyItem],
        aiRecommendations: recs
      };
      setPages(prev => [...prev, newPage]);
    }
  };

  async function searchKeywords() {
    if (!query.trim()) return;
    setIsLoading(true); setError(null); setKeywords([]);
    setAiInsight(""); setMarketAnalysis(""); setCompetitorStrategy("");
    try {
      const res = await fetch("/api/seo-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "keywords", query, model: aiModel })
      });
      const data = await res.json() as { error?: string; keywords?: Keyword[]; topInsight?: string; marketAnalysis?: string; competitorStrategy?: string };
      if (data.error) throw new Error(data.error);
      setKeywords(data.keywords || []);
      setAiInsight(data.topInsight || "");
      setMarketAnalysis(data.marketAnalysis || "");
      setCompetitorStrategy(data.competitorStrategy || "");
    } catch(e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function crawlWebsite() {
    if (!crawlUrlInput.trim()) return;
    setIsCrawling(true); setError(null); setCrawlResult(null);
    try {
      const res = await fetch("/api/seo-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "crawl", url: crawlUrlInput, model: aiModel })
      });
      const data = await res.json() as CrawlResult & { error?: string };
      if (data.error) throw new Error(data.error);
      setCrawlResult(data);
      saveCrawlAsPage(data);
    } catch(e: any) {
      setError(e.message);
    } finally {
      setIsCrawling(false);
    }
  }

  // Batch crawl
  async function batchCrawl() {
    const urls = batchUrls.split('\n').map(u => u.trim()).filter(Boolean).slice(0, 10);
    if (urls.length === 0) return;
    setBatchLoading(true); setError(null);
    try {
      for (const url of urls) {
        try {
          const res = await fetch("/api/seo-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "crawl", url, model: aiModel })
          });
          const data = await res.json() as CrawlResult & { error?: string };
          if (!data.error) saveCrawlAsPage(data);
        } catch { /* skip failed */ }
      }
    } finally {
      setBatchLoading(false);
      setBatchUrls("");
    }
  }

  // GEO analysis (local simulation)
  async function analyzeGeo() {
    if (!geoUrl.trim()) return;
    setGeoLoading(true);
    try {
      // Extract domain info for GEO estimation
      const domain = geoUrl.replace(/^https?:\/\//, '').split('/')[0];
      const tld = domain.split('.').pop() || '';
      const countryMap: Record<string, string> = { pl: 'Polska', de: 'Niemcy', uk: 'UK', com: 'USA/Global', eu: 'Europa', fr: 'Francja' };
      const country = countryMap[tld] || 'Global';
      const suggestions = [
        `Domena .${tld} — targetowanie: ${country}`,
        'Dodaj hreflang tags dla wielojezycznosci',
        'Uzyj CDN z lokalizacja blisko docelowego rynku',
        country === 'Polska' ? 'Zoptymalizuj pod Google.pl — polskie slowa kluczowe' : `Sprawdz Google Search Console dla regionu ${country}`
      ];
      setGeoResult({ country, region: tld.toUpperCase(), city: '-', suggestions });

      // Update page GEO if exists
      const page = pages.find(p => p.url.includes(domain));
      if (page) {
        setPages(prev => prev.map(p => p.id === page.id ? { ...p, geoCountry: country, geoRegion: tld.toUpperCase() } : p));
      }
    } finally {
      setGeoLoading(false);
    }
  }

  // AI Agent the_ANT_06
  const handleAIAgent = () => {
    setAiAgentLoading(true);
    setAiAgentReport(null);
    try {
      const allRecs = pages.flatMap(p => p.aiRecommendations);
      const pilne = allRecs.filter(r => r.priority === 'pilne');
      const wazne = allRecs.filter(r => r.priority === 'wazne');
      const avgSeo = avgScore;
      const changedPages = pages.filter(p => p.crawlHistory.some(h => h.changeDetected));
      const nonCompliant = pages.filter(p => !p.robotsCompliant);

      let report = `## Raport SEO (the_ANT_06)\n\n`;
      report += `**Stron zaindeksowanych:** ${totalPages}\n`;
      report += `**Sredni SEO score:** ${avgSeo}/100\n`;
      report += `**Bledy robots.txt:** ${nonCompliant.length}\n`;
      report += `**GEO zasieg:** ${geoCountries.join(', ') || 'brak danych'}\n\n`;

      if (pilne.length > 0) {
        report += `### PILNE (${pilne.length}):\n`;
        pilne.slice(0, 5).forEach(r => { report += `- ${r.description}\n`; });
        report += '\n';
      }
      if (wazne.length > 0) {
        report += `### WAZNE (${wazne.length}):\n`;
        wazne.slice(0, 5).forEach(r => { report += `- ${r.description}\n`; });
        report += '\n';
      }
      if (changedPages.length > 0) {
        report += `### Wykryte zmiany tresci (${changedPages.length}):\n`;
        changedPages.forEach(p => { report += `- ${p.url}\n`; });
        report += '\n';
      }

      report += `### Rekomendacje ogolne:\n`;
      if (avgSeo < 60) report += `- Sredni SEO score ${avgSeo} — potrzebna pilna optymalizacja\n`;
      if (totalPages === 0) report += `- Dodaj strony do monitoringu (crawl URL)\n`;
      if (nonCompliant.length > 0) report += `- Napraw ${nonCompliant.length} stron niezgodnych z robots.txt\n`;
      report += `- Regularnie crawluj strony aby wykrywac zmiany tresci\n`;

      setAiAgentReport(report);
    } finally {
      setAiAgentLoading(false);
    }
  };

  // Priority badge colors
  const prioColor = (p: RecPriority) => p === 'pilne' ? 'bg-red-500/20 text-red-400 border-red-500/30' : p === 'wazne' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
              <Search className="text-cyan-400 w-8 h-8" /> SEO Analityka + Crawler
            </h1>
            <p className="text-gray-400 mt-2">Badanie slow kluczowych, crawling, GEO i rekomendacje AI</p>
          </div>
          <button onClick={handleAIAgent} disabled={aiAgentLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-2">
            {aiAgentLoading ? '...' : <Bot className="w-4 h-4" />} the_ANT_06
          </button>
        </div>

        {/* AI Agent Report */}
        {aiAgentReport && (
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-purple-400">Raport AI (the_ANT_06)</h3>
              <button onClick={() => setAiAgentReport(null)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div className="text-sm text-gray-300 whitespace-pre-line">{aiAgentReport}</div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-cyan-400">{totalPages}</div>
            <div className="text-xs text-gray-400 mt-1">Stron zaindeksowanych</div>
          </div>
          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
            <div className={`text-2xl font-bold ${avgScore >= 70 ? 'text-green-400' : avgScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{avgScore}/100</div>
            <div className="text-xs text-gray-400 mt-1">Sredni SEO score</div>
          </div>
          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
            <div className={`text-2xl font-bold ${crawlErrors > 0 ? 'text-red-400' : 'text-green-400'}`}>{crawlErrors}</div>
            <div className="text-xs text-gray-400 mt-1">Bledy crawla</div>
          </div>
          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">{geoCountries.length || 0}</div>
            <div className="text-xs text-gray-400 mt-1">GEO zasieg</div>
          </div>
        </div>

        {/* Model selector */}
        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="text-cyan-400 w-5 h-5" />
            <span className="text-white font-semibold">Model AI</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {MODELS.map(m => (
              <button key={m.id} onClick={() => setAiModel(m.id)}
                className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                  aiModel === m.id
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab("keywords")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors whitespace-nowrap ${
              activeTab === "keywords" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50" : "text-gray-400 hover:text-white"
            }`}>
            <Search className="w-4 h-4" /> Slowa kluczowe
          </button>
          <button onClick={() => setActiveTab("crawler")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors whitespace-nowrap ${
              activeTab === "crawler" ? "bg-purple-400/20 text-purple-400 border border-purple-400/50" : "text-gray-400 hover:text-white"
            }`}>
            <Bot className="w-4 h-4" /> AI Crawler
          </button>
          <button onClick={() => setActiveTab("pages")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors whitespace-nowrap ${
              activeTab === "pages" ? "bg-green-400/20 text-green-400 border border-green-400/50" : "text-gray-400 hover:text-white"
            }`}>
            <List className="w-4 h-4" /> Strony ({totalPages})
          </button>
          <button onClick={() => setActiveTab("recommendations")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors whitespace-nowrap ${
              activeTab === "recommendations" ? "bg-orange-400/20 text-orange-400 border border-orange-400/50" : "text-gray-400 hover:text-white"
            }`}>
            <Target className="w-4 h-4" /> Rekomendacje
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-400 w-5 h-5 shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* ========== KEYWORDS TAB ========== */}
        {activeTab === "keywords" && (
          <div>
            <div className="flex gap-3 mb-6">
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchKeywords()}
                placeholder="Wpisz fraze kluczowa..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 placeholder-gray-600" />
              <button onClick={searchKeywords} disabled={isLoading}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                {isLoading ? <Zap className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {isLoading ? "Analizuje..." : "Szukaj"}
              </button>
            </div>
            {aiInsight && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-cyan-400 w-4 h-4" />
                  <span className="text-cyan-400 font-semibold text-sm">AI Insight</span>
                </div>
                <p className="text-gray-300 text-sm">{aiInsight}</p>
                {marketAnalysis && <p className="text-gray-400 text-xs border-t border-cyan-500/20 pt-2">{marketAnalysis}</p>}
                {competitorStrategy && <p className="text-gray-500 text-xs">{competitorStrategy}</p>}
              </div>
            )}
            {keywords.length > 0 && (
              <div className="bg-gray-900/60 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-900/80">
                      <th className="text-left p-3 text-gray-400">Slowo kluczowe</th>
                      <th className="text-right p-3 text-gray-400">Wolumen</th>
                      <th className="text-right p-3 text-gray-400">Trudnosc</th>
                      <th className="text-right p-3 text-gray-400">CPC (PLN)</th>
                      <th className="text-center p-3 text-gray-400">Trend</th>
                      <th className="text-center p-3 text-gray-400">Intencja</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw, i) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="p-3">
                          <div className="text-white font-medium">{kw.keyword}</div>
                          {kw.aiInsight && <div className="text-gray-500 text-xs mt-0.5">{kw.aiInsight}</div>}
                        </td>
                        <td className="p-3 text-right text-cyan-400 font-mono">{kw.volume?.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className={`font-bold ${kw.difficulty >= 70 ? "text-red-400" : kw.difficulty >= 40 ? "text-yellow-400" : "text-green-400"}`}>
                            {kw.difficulty}
                          </span>
                        </td>
                        <td className="p-3 text-right text-gray-300 font-mono">{kw.cpc?.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          {kw.trend === "up" ? <TrendingUp className="w-4 h-4 text-green-400 mx-auto" /> :
                           kw.trend === "down" ? <TrendingUp className="w-4 h-4 text-red-400 mx-auto rotate-180" /> :
                           <BarChart3 className="w-4 h-4 text-gray-400 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            kw.intent === "transactional" ? "bg-green-500/20 text-green-400" :
                            kw.intent === "commercial" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-blue-500/20 text-blue-400"
                          }`}>{kw.intent || "info"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========== CRAWLER TAB ========== */}
        {activeTab === "crawler" && (
          <div className="space-y-6">
            {/* Single crawl */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Crawl pojedynczej strony</h3>
              <p className="text-gray-400 text-sm mb-3">
                Wpisz URL strony, a AI przeanalizuje jej tresc i wygeneruje raport SEO.
              </p>
              <div className="flex gap-3">
                <input value={crawlUrlInput} onChange={e => setCrawlUrlInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && crawlWebsite()}
                  placeholder="https://example.com"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 placeholder-gray-600" />
                <button onClick={crawlWebsite} disabled={isCrawling}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  {isCrawling ? <Zap className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  {isCrawling ? "Crawluje..." : "Analizuj URL"}
                </button>
              </div>
            </div>

            {/* Batch crawl */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Batch crawl (max 10)</h3>
              <textarea value={batchUrls} onChange={e => setBatchUrls(e.target.value)}
                placeholder={"https://example.com/page1\nhttps://example.com/page2\nhttps://example.com/page3"}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 placeholder-gray-600 mb-3"
                rows={4} />
              <button onClick={batchCrawl} disabled={batchLoading}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2">
                {batchLoading ? <Zap className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {batchLoading ? "Crawluje batch..." : "Batch crawl"}
              </button>
            </div>

            {/* GEO Analysis */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> GEO Analiza</h3>
              <div className="flex gap-3 mb-3">
                <input value={geoUrl} onChange={e => setGeoUrl(e.target.value)}
                  placeholder="https://example.pl"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 placeholder-gray-600" />
                <button onClick={analyzeGeo} disabled={geoLoading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl">
                  {geoLoading ? "..." : "Analizuj GEO"}
                </button>
              </div>
              {geoResult && (
                <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4 space-y-2">
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400">Kraj: <span className="text-white font-bold">{geoResult.country}</span></span>
                    <span className="text-gray-400">Region: <span className="text-white font-bold">{geoResult.region}</span></span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="font-semibold text-blue-400">Sugestie GEO:</span>
                    <ul className="mt-1 space-y-1">
                      {geoResult.suggestions.map((s, i) => (
                        <li key={i} className="text-gray-300 text-xs flex items-start gap-1">
                          <span className="text-blue-400">-</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Crawl result */}
            {isCrawling && (
              <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-12 text-center">
                <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                <p className="text-white font-semibold text-lg">AI analizuje strone...</p>
              </div>
            )}
            {crawlResult && <CrawlResultCard result={crawlResult} />}
          </div>
        )}

        {/* ========== PAGES TAB ========== */}
        {activeTab === "pages" && (
          <div className="space-y-4">
            {pages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                Brak stron. Uzyj zakladki "AI Crawler" aby dodac strony do monitoringu.
              </div>
            ) : (
              <div className="bg-gray-900/60 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-900/80">
                      <th className="text-left p-3 text-gray-400">URL</th>
                      <th className="text-center p-3 text-gray-400">SEO Score</th>
                      <th className="text-center p-3 text-gray-400">GEO</th>
                      <th className="text-center p-3 text-gray-400">Robots</th>
                      <th className="text-center p-3 text-gray-400">Crawle</th>
                      <th className="text-center p-3 text-gray-400">Ostatni crawl</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map(page => (
                      <tr key={page.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedPage(selectedPage?.id === page.id ? null : page)}>
                        <td className="p-3 text-white max-w-[300px] truncate">{page.url}</td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${page.seoScore >= 80 ? 'text-green-400' : page.seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {page.seoScore}
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-400 text-xs">{page.geoCountry || '-'}</td>
                        <td className="p-3 text-center">
                          {page.robotsCompliant
                            ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                            : <AlertTriangle className="w-4 h-4 text-red-400 mx-auto" />}
                        </td>
                        <td className="p-3 text-center text-gray-400">{page.crawlHistory.length}</td>
                        <td className="p-3 text-center text-gray-500 text-xs">
                          {page.lastCrawl ? new Date(page.lastCrawl).toLocaleDateString('pl-PL') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Page detail panel */}
            {selectedPage && (
              <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{selectedPage.url}</h3>
                  <button onClick={() => setSelectedPage(null)} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-gray-400">SEO Score:</span> <span className="font-bold text-cyan-400">{selectedPage.seoScore}</span></div>
                  <div><span className="text-gray-400">GEO:</span> <span className="text-white">{selectedPage.geoCountry || '-'} / {selectedPage.geoRegion || '-'}</span></div>
                  <div><span className="text-gray-400">Hash:</span> <span className="text-gray-500 font-mono text-xs">{selectedPage.contentHash}</span></div>
                  <div><span className="text-gray-400">Robots:</span> {selectedPage.robotsCompliant ? <span className="text-green-400">OK</span> : <span className="text-red-400">Blad</span>}</div>
                </div>

                {/* Crawl History */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-400 mb-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Historia crawli ({selectedPage.crawlHistory.length})</h4>
                  <div className="space-y-1">
                    {selectedPage.crawlHistory.slice().reverse().map(h => (
                      <div key={h.id} className="flex items-center justify-between bg-gray-800 rounded p-2 text-xs">
                        <span className="text-gray-400">{new Date(h.date).toLocaleString('pl-PL')}</span>
                        <span className={`font-bold ${h.seoScore >= 80 ? 'text-green-400' : h.seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{h.seoScore}/100</span>
                        <span className={`${h.changeDetected ? 'text-orange-400' : 'text-gray-600'}`}>
                          {h.changeDetected ? 'zmiana!' : 'bez zmian'}
                        </span>
                        <span className="text-gray-500">HTTP {h.statusCode}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations for page */}
                {selectedPage.aiRecommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-400 mb-2">Rekomendacje AI</h4>
                    <div className="space-y-1">
                      {selectedPage.aiRecommendations.map(r => (
                        <div key={r.id} className={`flex items-start gap-2 p-2 rounded border text-xs ${prioColor(r.priority)}`}>
                          <span className="font-bold uppercase whitespace-nowrap">[{r.priority}]</span>
                          <span className="text-gray-300">{r.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========== RECOMMENDATIONS TAB ========== */}
        {activeTab === "recommendations" && (
          <div className="space-y-4">
            {pages.flatMap(p => p.aiRecommendations.map(r => ({ ...r, pageUrl: p.url }))).length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                Brak rekomendacji. Crawluj strony aby wygenerowac rekomendacje AI.
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-red-400">
                      {pages.flatMap(p => p.aiRecommendations).filter(r => r.priority === 'pilne').length}
                    </div>
                    <div className="text-xs text-gray-400">Pilne</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-yellow-400">
                      {pages.flatMap(p => p.aiRecommendations).filter(r => r.priority === 'wazne').length}
                    </div>
                    <div className="text-xs text-gray-400">Wazne</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {pages.flatMap(p => p.aiRecommendations).filter(r => r.priority === 'opcjonalne').length}
                    </div>
                    <div className="text-xs text-gray-400">Opcjonalne</div>
                  </div>
                </div>

                {/* All recommendations grouped by priority */}
                {(['pilne', 'wazne', 'opcjonalne'] as RecPriority[]).map(prio => {
                  const recs = pages.flatMap(p => p.aiRecommendations.map(r => ({ ...r, pageUrl: p.url }))).filter(r => r.priority === prio);
                  if (recs.length === 0) return null;
                  return (
                    <div key={prio}>
                      <h3 className={`font-bold text-sm mb-2 uppercase ${prio === 'pilne' ? 'text-red-400' : prio === 'wazne' ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {prio} ({recs.length})
                      </h3>
                      <div className="space-y-2 mb-6">
                        {recs.map(r => (
                          <div key={r.id} className={`flex items-start gap-3 p-3 rounded-lg border ${prioColor(r.priority)}`}>
                            <div className="flex-1">
                              <div className="text-gray-300 text-sm">{r.description}</div>
                              <div className="text-gray-500 text-xs mt-1">{r.pageUrl}</div>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{r.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
