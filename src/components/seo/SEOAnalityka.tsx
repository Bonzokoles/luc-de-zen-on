import { useState } from "react";
import { Search, TrendingUp, Globe, BarChart3, Target, Download, Sparkles, Bot, Zap, CheckCircle, AlertTriangle, Info } from "lucide-react";

type AIModel = "gpt-4o" | "gpt-4o-mini" | "gemini" | "deepseek";
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
  const [activeTab, setActiveTab] = useState<"keywords"|"crawler">("keywords");
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
    } catch(e: any) {
      setError(e.message);
    } finally {
      setIsCrawling(false);
    }
  }
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Search className="text-cyan-400 w-8 h-8" /> SEO Analityka AI
          </h1>
          <p className="text-gray-400 mt-2">Badanie słów kluczowych i analiza SEO z pomocą AI</p>
        </div>
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
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
          <button onClick={() => setActiveTab("keywords")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
              activeTab === "keywords" ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50" : "text-gray-400 hover:text-white"
            }`}>
            <Search className="w-4 h-4" /> Słowa kluczowe
          </button>
          <button onClick={() => setActiveTab("crawler")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
              activeTab === "crawler" ? "bg-purple-400/20 text-purple-400 border border-purple-400/50" : "text-gray-400 hover:text-white"
            }`}>
            <Bot className="w-4 h-4" /> AI Crawler
          </button>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-400 w-5 h-5 shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {activeTab === "keywords" && (
          <div>
            <div className="flex gap-3 mb-6">
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchKeywords()}
                placeholder="Wpisz frazę kluczową..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 placeholder-gray-600" />
              <button onClick={searchKeywords} disabled={isLoading}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                {isLoading ? <Zap className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {isLoading ? "Analizuję..." : "Szukaj"}
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
                      <th className="text-left p-3 text-gray-400">Słowo kluczowe</th>
                      <th className="text-right p-3 text-gray-400">Wolumen</th>
                      <th className="text-right p-3 text-gray-400">Trudność</th>
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

        {activeTab === "crawler" && (
          <div>
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm mb-3">
                Wpisz URL strony, a AI przeanalizuje jej treść i wygeneruje raport SEO przy użyciu Jina AI Reader.
              </p>
              <div className="flex gap-3">
                <input value={crawlUrlInput} onChange={e => setCrawlUrlInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && crawlWebsite()}
                  placeholder="https://example.com"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 placeholder-gray-600" />
                <button onClick={crawlWebsite} disabled={isCrawling}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  {isCrawling ? <Zap className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  {isCrawling ? "Crawluję..." : "Analizuj URL"}
                </button>
              </div>
            </div>
            {isCrawling && (
              <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-12 text-center">
                <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                <p className="text-white font-semibold text-lg">AI analizuje stronę...</p>
                <p className="text-gray-400 text-sm mt-2">Pobieranie treści i generowanie raportu SEO</p>
              </div>
            )}
            {crawlResult && <CrawlResultCard result={crawlResult} />}
          </div>
        )}
      </div>
    </div>
  );
}
