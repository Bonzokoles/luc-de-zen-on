// 🌐 Webmaster Agent API - SEO i monitoring stron
import type { APIRoute } from "astro";
import { AGENT_CONFIG } from "./config";

// Symulacja bazy danych dla SEO data
const seoAudits: Array<any> = [];
const keywordData: Array<any> = [];
const performanceMetrics: Array<any> = [];
const competitorData: Array<any> = [];
const backlinksData: Array<any> = [];
const contentAnalysis: Array<any> = [];
const crawlErrors: Array<any> = [];
const seoReports: Array<any> = [];

// Cache dla danych external APIs
const apiCache = new Map();
let cacheInitialized = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as any;
    const { action, data } =
      typeof body === "object" && body !== null ? body : {};
    const payload = data && typeof data === "object" ? data : {};

    switch (action) {
      case "test":
        return testAgent();

      case "run-seo-audit":
        return runSEOAudit(payload);

      case "get-seo-score":
        return getSEOScore(payload);

      case "analyze-keywords":
        return analyzeKeywords(payload);

      case "get-keyword-rankings":
        return getKeywordRankings();

      case "check-performance":
        return checkPerformance(payload);

      case "get-core-web-vitals":
        return getCoreWebVitals(payload);

      case "analyze-competitors":
        return analyzeCompetitors(payload);

      case "get-backlinks":
        return getBacklinks(payload);

      case "analyze-content":
        return analyzeContent(payload);

      case "get-crawl-errors":
        return getCrawlErrors();

      case "generate-sitemap":
        return generateSitemap(payload);

      case "optimize-robots":
        return optimizeRobots(payload);

      case "generate-seo-report":
        return generateSEOReport(payload);

      case "get-monitoring-data":
        return getMonitoringData();

      default:
        return errorResponse("Nieprawidłowa akcja");
    }
  } catch (error) {
    return errorResponse(
      `Błąd serwera: ${
        error instanceof Error ? error.message : "Nieznany błąd"
      }`
    );
  }
};

// Test agent functionality
async function testAgent() {
  initializeSampleData();

  return new Response(
    JSON.stringify({
      success: true,
      message: "Agent Webmaster działa poprawnie",
      agent: AGENT_CONFIG.displayName,
      capabilities: AGENT_CONFIG.capabilities,
      integrations: AGENT_CONFIG.integrations.map((i) => i.name),
      auditCategories: AGENT_CONFIG.auditCategories.length,
      metricsTracked: AGENT_CONFIG.seoMetrics.length,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Run comprehensive SEO audit
async function runSEOAudit(data: any) {
  const { url, auditType = "comprehensive" } = data;

  if (!url) {
    return errorResponse("URL jest wymagany do audytu SEO");
  }

  const auditId = generateId();
  const startTime = Date.now();

  // Symulacja audytu SEO
  const auditResults = await performSEOAudit(url, auditType);
  const endTime = Date.now();

  const audit = {
    id: auditId,
    url,
    type: auditType,
    startTime,
    endTime,
    duration: endTime - startTime,
    status: "completed",
    overallScore: auditResults.overallScore,
    categoryScores: auditResults.categoryScores,
    issues: auditResults.issues,
    recommendations: auditResults.recommendations,
    metrics: auditResults.metrics,
  };

  seoAudits.unshift(audit);

  // Zachowaj tylko 20 ostatnich audytów
  if (seoAudits.length > 20) {
    seoAudits.pop();
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: `Audyt SEO dla ${url} został ukończony`,
      audit,
      score: auditResults.overallScore,
      issuesFound: auditResults.issues.length,
      recommendations: auditResults.recommendations.length,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get SEO score for website
async function getSEOScore(data: any) {
  const { url } = data;

  if (!url) {
    return errorResponse("URL jest wymagany");
  }

  // Find latest audit or create mock score
  const latestAudit = seoAudits.find((audit) => audit.url === url);

  if (latestAudit) {
    return new Response(
      JSON.stringify({
        success: true,
        url,
        score: latestAudit.overallScore,
        categoryScores: latestAudit.categoryScores,
        lastAuditDate: latestAudit.startTime,
        trending: generateTrendData(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Generate mock score if no audit exists
  const mockScore = generateMockSEOScore(url);

  return new Response(
    JSON.stringify({
      success: true,
      url,
      score: mockScore.overall,
      categoryScores: mockScore.categories,
      lastAuditDate: Date.now(),
      trending: generateTrendData(),
      note: "Dane przykładowe - uruchom audyt SEO dla dokładnych wyników",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Analyze keywords for website
async function analyzeKeywords(data: any) {
  const { url, keywords, language = "pl" } = data;

  if (!url && !keywords) {
    return errorResponse("URL lub lista słów kluczowych jest wymagana");
  }

  const analysisId = generateId();
  const keywordList = keywords
    ? keywords.split(",").map((k: string) => k.trim())
    : generateSampleKeywords(url);

  // Symulacja analizy słów kluczowych
  const analysis = {
    id: analysisId,
    url,
    language,
    keywords: keywordList.map((keyword: string) => ({
      keyword,
      volume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 100) + 1,
      cpc: (Math.random() * 5 + 0.1).toFixed(2),
      competition: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      currentRanking: Math.floor(Math.random() * 100) + 1,
      opportunity: Math.floor(Math.random() * 100) + 1,
      trend: ["rising", "stable", "falling"][Math.floor(Math.random() * 3)],
    })),
    totalVolume: 0,
    averageDifficulty: 0,
    opportunityScore: 0,
    analyzedAt: Date.now(),
  };

  // Oblicz metryki
  analysis.totalVolume = analysis.keywords.reduce(
    (sum: number, kw: any) => sum + kw.volume,
    0
  );
  analysis.averageDifficulty = Math.round(
    analysis.keywords.reduce((sum: number, kw: any) => sum + kw.difficulty, 0) /
      analysis.keywords.length
  );
  analysis.opportunityScore = Math.round(
    analysis.keywords.reduce(
      (sum: number, kw: any) => sum + kw.opportunity,
      0
    ) / analysis.keywords.length
  );

  keywordData.unshift(analysis);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Przeanalizowano ${keywordList.length} słów kluczowych`,
      analysis,
      summary: {
        totalKeywords: keywordList.length,
        totalVolume: analysis.totalVolume,
        averageDifficulty: analysis.averageDifficulty,
        opportunityScore: analysis.opportunityScore,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get keyword rankings
async function getKeywordRankings() {
  return new Response(
    JSON.stringify({
      success: true,
      rankings: keywordData.slice(0, 5),
      summary: {
        totalKeywords: keywordData.reduce(
          (sum, analysis) => sum + analysis.keywords.length,
          0
        ),
        topRanking:
          keywordData.length > 0
            ? Math.min(
                ...keywordData[0].keywords.map((k: any) => k.currentRanking)
              )
            : null,
        averagePosition:
          keywordData.length > 0
            ? Math.round(
                keywordData[0].keywords.reduce(
                  (sum: number, k: any) => sum + k.currentRanking,
                  0
                ) / keywordData[0].keywords.length
              )
            : null,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Check website performance
async function checkPerformance(data: any) {
  const { url, device = "desktop" } = data;

  if (!url) {
    return errorResponse("URL jest wymagany do testów wydajności");
  }

  // Symulacja testów wydajności
  const performance = {
    id: generateId(),
    url,
    device,
    testedAt: Date.now(),
    scores: {
      performance: Math.floor(Math.random() * 40) + 60, // 60-100
      accessibility: Math.floor(Math.random() * 30) + 70, // 70-100
      bestPractices: Math.floor(Math.random() * 25) + 75, // 75-100
      seo: Math.floor(Math.random() * 20) + 80, // 80-100
    },
    metrics: {
      firstContentfulPaint: (Math.random() * 2 + 1).toFixed(1),
      largestContentfulPaint: (Math.random() * 3 + 2).toFixed(1),
      firstInputDelay: Math.floor(Math.random() * 200) + 50,
      cumulativeLayoutShift: (Math.random() * 0.3).toFixed(3),
      speedIndex: (Math.random() * 4 + 3).toFixed(1),
      timeToInteractive: (Math.random() * 5 + 4).toFixed(1),
    },
    coreWebVitals: {
      lcp: { value: (Math.random() * 3 + 2).toFixed(1), rating: "good" },
      fid: { value: Math.floor(Math.random() * 200) + 50, rating: "good" },
      cls: { value: (Math.random() * 0.3).toFixed(3), rating: "good" },
    },
    opportunities: generatePerformanceOpportunities(),
    diagnostics: generatePerformanceDiagnostics(),
  };

  // Określ rating dla Core Web Vitals
  const thresholds = AGENT_CONFIG.performanceThresholds;
  performance.coreWebVitals.lcp.rating =
    parseFloat(performance.coreWebVitals.lcp.value) <= thresholds.lcp.good
      ? "good"
      : parseFloat(performance.coreWebVitals.lcp.value) <= thresholds.lcp.poor
      ? "needs-improvement"
      : "poor";

  performanceMetrics.unshift(performance);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Test wydajności dla ${url} ukończony`,
      performance,
      overallScore: Math.round(
        (performance.scores.performance +
          performance.scores.accessibility +
          performance.scores.bestPractices +
          performance.scores.seo) /
          4
      ),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get Core Web Vitals data
async function getCoreWebVitals(data: any) {
  const { url, period = "28d" } = data;

  if (!url) {
    return errorResponse("URL jest wymagany");
  }

  // Symulacja danych Core Web Vitals
  const coreWebVitals = {
    url,
    period,
    collectDate: Date.now(),
    metrics: {
      lcp: {
        p75: (Math.random() * 3 + 1.5).toFixed(2),
        trend: ["improving", "stable", "degrading"][
          Math.floor(Math.random() * 3)
        ],
        distribution: {
          good: Math.floor(Math.random() * 50) + 40,
          needsImprovement: Math.floor(Math.random() * 30) + 15,
          poor: Math.floor(Math.random() * 20) + 5,
        },
      },
      fid: {
        p75: Math.floor(Math.random() * 150) + 50,
        trend: ["improving", "stable", "degrading"][
          Math.floor(Math.random() * 3)
        ],
        distribution: {
          good: Math.floor(Math.random() * 60) + 30,
          needsImprovement: Math.floor(Math.random() * 25) + 10,
          poor: Math.floor(Math.random() * 15) + 5,
        },
      },
      cls: {
        p75: (Math.random() * 0.3).toFixed(3),
        trend: ["improving", "stable", "degrading"][
          Math.floor(Math.random() * 3)
        ],
        distribution: {
          good: Math.floor(Math.random() * 70) + 20,
          needsImprovement: Math.floor(Math.random() * 20) + 10,
          poor: Math.floor(Math.random() * 15) + 5,
        },
      },
    },
    pageViews: Math.floor(Math.random() * 10000) + 1000,
    lastUpdated: Date.now(),
  };

  return new Response(
    JSON.stringify({
      success: true,
      coreWebVitals,
      summary: {
        overallRating: calculateCWVRating(coreWebVitals.metrics),
        pagesPassing: Math.floor(Math.random() * 80) + 20,
        mainIssues: identifyCWVIssues(coreWebVitals.metrics),
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Analyze competitors
async function analyzeCompetitors(data: any) {
  const { domain, competitors = [] } = data;

  if (!domain) {
    return errorResponse("Domena jest wymagana do analizy konkurencji");
  }

  const competitorList =
    competitors.length > 0 ? competitors : generateSampleCompetitors(domain);

  const analysis = {
    id: generateId(),
    domain,
    analyzedAt: Date.now(),
    competitors: competitorList.map((competitor: any) => ({
      domain: competitor,
      domainAuthority: Math.floor(Math.random() * 50) + 40,
      backlinks: Math.floor(Math.random() * 50000) + 5000,
      referringDomains: Math.floor(Math.random() * 1000) + 100,
      organicKeywords: Math.floor(Math.random() * 10000) + 1000,
      organicTraffic: Math.floor(Math.random() * 100000) + 10000,
      topKeywords: generateTopKeywords(),
      contentGaps: Math.floor(Math.random() * 200) + 50,
      socialSignals: Math.floor(Math.random() * 10000) + 500,
    })),
    insights: generateCompetitorInsights(),
    opportunities: generateCompetitorOpportunities(),
  };

  competitorData.unshift(analysis);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Przeanalizowano ${competitorList.length} konkurentów`,
      analysis,
      summary: {
        totalCompetitors: competitorList.length,
        averageDA: Math.round(
          analysis.competitors.reduce(
            (sum: number, comp: any) => sum + comp.domainAuthority,
            0
          ) / analysis.competitors.length
        ),
        totalOpportunities: analysis.opportunities.length,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get backlinks analysis
async function getBacklinks(data: any) {
  const { domain } = data;

  if (!domain) {
    return errorResponse("Domena jest wymagana do analizy linków");
  }

  const backlinks = {
    domain,
    analyzedAt: Date.now(),
    summary: {
      totalBacklinks: Math.floor(Math.random() * 10000) + 1000,
      referringDomains: Math.floor(Math.random() * 500) + 100,
      domainRating: Math.floor(Math.random() * 40) + 40,
      organicKeywords: Math.floor(Math.random() * 5000) + 500,
    },
    topBacklinks: generateTopBacklinks(),
    anchorTexts: generateAnchorTexts(),
    linkTypes: {
      dofollow: Math.floor(Math.random() * 80) + 10,
      nofollow: Math.floor(Math.random() * 20) + 5,
      ugc: Math.floor(Math.random() * 10) + 2,
      sponsored: Math.floor(Math.random() * 5) + 1,
    },
    linkTrends: generateLinkTrends(),
  };

  backlinksData.unshift(backlinks);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Analiza linków dla ${domain} ukończona`,
      backlinks,
      recommendations: generateLinkBuildingRecommendations(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Analyze content optimization
async function analyzeContent(data: any) {
  const { url, content } = data;

  if (!url && !content) {
    return errorResponse("URL lub treść jest wymagana do analizy");
  }

  // Symulacja analizy treści
  const analysis = {
    id: generateId(),
    url,
    analyzedAt: Date.now(),
    contentMetrics: {
      wordCount: Math.floor(Math.random() * 2000) + 300,
      readabilityScore: Math.floor(Math.random() * 40) + 60,
      keywordDensity: (Math.random() * 2.5 + 0.5).toFixed(1),
      headingStructure: {
        h1: 1,
        h2: Math.floor(Math.random() * 5) + 2,
        h3: Math.floor(Math.random() * 8) + 3,
        h4: Math.floor(Math.random() * 4),
      },
      internalLinks: Math.floor(Math.random() * 10) + 3,
      externalLinks: Math.floor(Math.random() * 5) + 1,
      images: Math.floor(Math.random() * 8) + 2,
      altTexts: Math.floor(Math.random() * 6) + 1,
    },
    seoScore: Math.floor(Math.random() * 30) + 70,
    issues: generateContentIssues(),
    recommendations: generateContentRecommendations(),
  };

  contentAnalysis.unshift(analysis);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Analiza treści ukończona`,
      analysis,
      optimizationLevel:
        analysis.seoScore >= 90
          ? "excellent"
          : analysis.seoScore >= 80
          ? "good"
          : analysis.seoScore >= 70
          ? "fair"
          : "poor",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get crawl errors
async function getCrawlErrors() {
  // Generuj przykładowe błędy crawlingu jeśli nie ma danych
  if (crawlErrors.length === 0) {
    const sampleErrors = [
      {
        id: generateId(),
        type: "404",
        url: "/old-page",
        severity: "high",
        firstDetected: Date.now() - 86400000 * 3,
        lastSeen: Date.now() - 86400000,
        occurrences: 15,
      },
      {
        id: generateId(),
        type: "500",
        url: "/api/broken-endpoint",
        severity: "critical",
        firstDetected: Date.now() - 86400000 * 2,
        lastSeen: Date.now() - 3600000,
        occurrences: 8,
      },
      {
        id: generateId(),
        type: "redirect_chain",
        url: "/long-redirect-chain",
        severity: "medium",
        firstDetected: Date.now() - 86400000 * 7,
        lastSeen: Date.now() - 86400000 * 2,
        occurrences: 3,
      },
    ];
    crawlErrors.push(...sampleErrors);
  }

  return new Response(
    JSON.stringify({
      success: true,
      errors: crawlErrors,
      summary: {
        total: crawlErrors.length,
        critical: crawlErrors.filter((e) => e.severity === "critical").length,
        high: crawlErrors.filter((e) => e.severity === "high").length,
        medium: crawlErrors.filter((e) => e.severity === "medium").length,
        low: crawlErrors.filter((e) => e.severity === "low").length,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Generate sitemap
async function generateSitemap(data: any) {
  const { domain, includeImages = true, changeFreq = "weekly" } = data;

  if (!domain) {
    return errorResponse("Domena jest wymagana do generowania sitemap");
  }

  const sitemap = {
    id: generateId(),
    domain,
    generatedAt: Date.now(),
    urls: generateSampleSitemapUrls(domain, includeImages),
    settings: {
      includeImages,
      changeFreq,
      priority: "auto",
    },
  };

  return new Response(
    JSON.stringify({
      success: true,
      message: `Sitemap dla ${domain} została wygenerowana`,
      sitemap,
      urlCount: sitemap.urls.length,
      downloadUrl: `/api/agents/agent-09/sitemap/${sitemap.id}.xml`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Optimize robots.txt
async function optimizeRobots(data: any) {
  const { domain, currentRobots } = data;

  if (!domain) {
    return errorResponse("Domena jest wymagana do optymalizacji robots.txt");
  }

  const optimizedRobots = generateOptimizedRobots(domain, currentRobots);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Robots.txt został zoptymalizowany",
      optimizedRobots,
      improvements: [
        "Dodano sitemap XML",
        "Zoptymalizowano crawler directives",
        "Dodano delay dla agresywnych botów",
        "Zaktualizowano ścieżki disallow",
      ],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Generate SEO report
async function generateSEOReport(data: any) {
  const { reportType = "weekly", domain, sections = [] } = data;

  const report = {
    id: generateId(),
    type: reportType,
    domain,
    generatedAt: Date.now(),
    period: getPeriodDates(reportType),
    sections: {
      executiveSummary: generateExecutiveSummary(),
      trafficAnalysis: generateTrafficAnalysis(),
      keywordPerformance: generateKeywordPerformance(),
      technicalIssues: generateTechnicalIssues(),
      competitorInsights: generateCompetitorInsights(),
      recommendations: generateRecommendations(),
    },
  };

  seoReports.unshift(report);

  return new Response(
    JSON.stringify({
      success: true,
      message: `Raport SEO ${reportType} został wygenerowany`,
      report,
      downloadUrl: `/api/agents/agent-09/reports/${report.id}.pdf`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Get monitoring data
async function getMonitoringData() {
  return new Response(
    JSON.stringify({
      success: true,
      monitoring: {
        audits: seoAudits.slice(0, 5),
        keywords: keywordData.slice(0, 3),
        performance: performanceMetrics.slice(0, 5),
        errors: crawlErrors.slice(0, 10),
        reports: seoReports.slice(0, 3),
      },
      summary: {
        totalAudits: seoAudits.length,
        avgSEOScore:
          seoAudits.length > 0
            ? Math.round(
                seoAudits.reduce((sum, audit) => sum + audit.overallScore, 0) /
                  seoAudits.length
              )
            : null,
        activeErrors: crawlErrors.filter(
          (e) => Date.now() - e.lastSeen < 86400000
        ).length,
        lastReport: seoReports[0]?.generatedAt || null,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Helper functions
function initializeSampleData() {
  if (!cacheInitialized) {
    // Wygeneruj przykładowe dane SEO
    generateMockSEOData();
    cacheInitialized = true;
  }
}

function generateMockSEOData() {
  // Przykładowe audyty SEO
  if (seoAudits.length === 0) {
    const mockAudit = {
      id: generateId(),
      url: "https://example.pl",
      type: "comprehensive",
      startTime: Date.now() - 3600000,
      endTime: Date.now() - 3000000,
      duration: 600000,
      status: "completed",
      overallScore: 78,
      categoryScores: {
        technical: 82,
        onpage: 75,
        performance: 71,
        content: 80,
        links: 77,
      },
      issues: [
        { severity: "high", type: "missing_alt_text", count: 5 },
        { severity: "medium", type: "slow_loading_images", count: 12 },
        { severity: "low", type: "meta_description_length", count: 3 },
      ],
      recommendations: [
        "Dodaj alt text do wszystkich obrazów",
        "Zoptymalizuj rozmiar obrazów",
        "Dostosuj długość meta description",
      ],
      metrics: {
        crawledPages: 45,
        indexedPages: 42,
        errorPages: 3,
      },
    };
    seoAudits.push(mockAudit);
  }
}

async function performSEOAudit(url: string, auditType: string) {
  // Symulacja kompleksowego audytu SEO
  const isComprehensive = auditType === "comprehensive";

  return {
    overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
    categoryScores: {
      technical: Math.floor(Math.random() * 40) + 60,
      onpage: Math.floor(Math.random() * 40) + 60,
      performance: Math.floor(Math.random() * 40) + 60,
      content: Math.floor(Math.random() * 40) + 60,
      links: Math.floor(Math.random() * 40) + 60,
    },
    issues: generateSEOIssues(isComprehensive),
    recommendations: generateSEORecommendations(isComprehensive),
    metrics: {
      crawledPages: Math.floor(Math.random() * 100) + 20,
      indexedPages: Math.floor(Math.random() * 90) + 18,
      errorPages: Math.floor(Math.random() * 10) + 1,
    },
  };
}

function generateSEOIssues(comprehensive: boolean) {
  const issues = [
    {
      severity: "high",
      type: "missing_title_tags",
      count: Math.floor(Math.random() * 5) + 1,
    },
    {
      severity: "medium",
      type: "duplicate_meta_descriptions",
      count: Math.floor(Math.random() * 8) + 2,
    },
    {
      severity: "low",
      type: "missing_alt_attributes",
      count: Math.floor(Math.random() * 15) + 3,
    },
  ];

  if (comprehensive) {
    issues.push(
      {
        severity: "critical",
        type: "crawl_errors",
        count: Math.floor(Math.random() * 3),
      },
      {
        severity: "high",
        type: "slow_page_speed",
        count: Math.floor(Math.random() * 7) + 2,
      },
      {
        severity: "medium",
        type: "broken_internal_links",
        count: Math.floor(Math.random() * 10) + 1,
      }
    );
  }

  return issues;
}

function generateSEORecommendations(comprehensive: boolean) {
  const recommendations = [
    "Dodaj unikatowe title tags do wszystkich stron",
    "Utwórz unikatowe meta descriptions",
    "Dodaj alt text do obrazów",
  ];

  if (comprehensive) {
    recommendations.push(
      "Popraw szybkość ładowania stron",
      "Napraw błędy crawlingu",
      "Zoptymalizuj strukturę linków wewnętrznych",
      "Wdróż structured data markup",
      "Popraw responsywność na urządzeniach mobilnych"
    );
  }

  return recommendations;
}

function generateSampleKeywords(url: string) {
  const domain = new URL(url).hostname.replace("www.", "").split(".")[0];
  return [
    `${domain} usługi`,
    `najlepszy ${domain}`,
    `${domain} opinie`,
    `${domain} cennik`,
    `${domain} kontakt`,
  ];
}

function generateMockSEOScore(url: string) {
  return {
    overall: Math.floor(Math.random() * 30) + 70,
    categories: {
      technical: Math.floor(Math.random() * 40) + 60,
      onpage: Math.floor(Math.random() * 40) + 60,
      performance: Math.floor(Math.random() * 40) + 60,
      content: Math.floor(Math.random() * 40) + 60,
      links: Math.floor(Math.random() * 40) + 60,
    },
  };
}

function generateTrendData() {
  return Array.from({ length: 7 }, (_, i) => ({
    date: Date.now() - (6 - i) * 86400000,
    score: Math.floor(Math.random() * 20) + 70,
  }));
}

function generatePerformanceOpportunities() {
  return [
    {
      title: "Optymalizuj obrazy",
      description: "Zmniejsz rozmiar obrazów o 45%",
      impact: "high",
      savings: "2.3s",
    },
    {
      title: "Usuń nieużywane CSS",
      description: "Usuń 67kb nieużywanego kodu CSS",
      impact: "medium",
      savings: "0.8s",
    },
    {
      title: "Włącz kompresję tekstu",
      description: "Skompresuj zasoby tekstowe",
      impact: "medium",
      savings: "1.2s",
    },
  ];
}

function generatePerformanceDiagnostics() {
  return [
    {
      title: "Zredukuj impact third-party code",
      description: "Third-party code blocked the main thread for 150 ms",
      impact: "medium",
    },
    {
      title: "Użyj nowoczesnych formatów obrazów",
      description: "Zastąp JPEG/PNG formatami WebP/AVIF",
      impact: "low",
    },
  ];
}

function calculateCWVRating(metrics: any) {
  const scores = Object.values(metrics).map((metric: any) => {
    const good = metric.distribution.good;
    return good >= 75 ? "good" : good >= 50 ? "needs-improvement" : "poor";
  });

  const goodCount = scores.filter((s) => s === "good").length;
  return goodCount >= 2
    ? "good"
    : goodCount >= 1
    ? "needs-improvement"
    : "poor";
}

function identifyCWVIssues(metrics: any) {
  const issues = [];

  if (metrics.lcp.distribution.good < 75) {
    issues.push("Wolne ładowanie największych elementów (LCP)");
  }
  if (metrics.fid.distribution.good < 75) {
    issues.push("Opóźnienia w reakcji na interakcję (FID)");
  }
  if (metrics.cls.distribution.good < 75) {
    issues.push("Niestabilność wizualna układu (CLS)");
  }

  return issues;
}

function generateSampleCompetitors(domain: string) {
  const tld = domain.split(".").pop();
  return [
    `competitor1.${tld}`,
    `competitor2.${tld}`,
    `market-leader.${tld}`,
    `alternative.${tld}`,
    `budget-option.${tld}`,
  ];
}

function generateTopKeywords() {
  return [
    {
      keyword: "main service",
      position: Math.floor(Math.random() * 10) + 1,
      volume: 5400,
    },
    {
      keyword: "brand name",
      position: Math.floor(Math.random() * 5) + 1,
      volume: 3200,
    },
    {
      keyword: "industry term",
      position: Math.floor(Math.random() * 20) + 1,
      volume: 2100,
    },
  ];
}

function generateCompetitorInsights() {
  return [
    "Konkurenci używają więcej długich słów kluczowych",
    "Brak obecności w local SEO",
    "Słaba optymalizacja mobilna u konkurentów",
    "Możliwość przejęcia pozycji w content marketing",
  ];
}

function generateCompetitorOpportunities() {
  return [
    {
      type: "keyword_gap",
      title: "Luka w słowach kluczowych",
      description: "Znaleziono 45 słów kluczowych używanych przez konkurentów",
      priority: "high",
    },
    {
      type: "content_gap",
      title: "Braki w treściach",
      description: "Konkurenci pokrywają tematy, których nie masz",
      priority: "medium",
    },
    {
      type: "backlink_opportunity",
      title: "Możliwość pozyskania linków",
      description: "12 stron linkuje do konkurentów, ale nie do Ciebie",
      priority: "high",
    },
  ];
}

function generateTopBacklinks() {
  return [
    {
      url: "https://authority-site.pl/article",
      domainRating: 72,
      urlRating: 45,
      anchorText: "zobacz więcej",
      firstSeen: Date.now() - 86400000 * 30,
      type: "dofollow",
    },
    {
      url: "https://industry-blog.pl/post",
      domainRating: 58,
      urlRating: 38,
      anchorText: "recommended service",
      firstSeen: Date.now() - 86400000 * 15,
      type: "dofollow",
    },
    {
      url: "https://news-portal.pl/news",
      domainRating: 81,
      urlRating: 52,
      anchorText: "brand name",
      firstSeen: Date.now() - 86400000 * 7,
      type: "nofollow",
    },
  ];
}

function generateAnchorTexts() {
  return [
    { text: "brand name", count: 45, percentage: 35 },
    { text: "strona główna", count: 23, percentage: 18 },
    { text: "kliknij tutaj", count: 18, percentage: 14 },
    { text: "więcej informacji", count: 15, percentage: 12 },
    { text: "naked URL", count: 27, percentage: 21 },
  ];
}

function generateLinkTrends() {
  return Array.from({ length: 12 }, (_, i) => ({
    month: Date.now() - (11 - i) * 30 * 86400000,
    newLinks: Math.floor(Math.random() * 20) + 5,
    lostLinks: Math.floor(Math.random() * 8) + 1,
    netGrowth: Math.floor(Math.random() * 15) + 3,
  }));
}

function generateLinkBuildingRecommendations() {
  return [
    "Stwórz content hub z wartościowymi zasobami",
    "Rozwijaj współpracę z branżowymi bloggerami",
    "Optymalizuj profile w katalogach branżowych",
    "Wykorzystuj broken link building",
    "Twórz infografiki i shareable content",
  ];
}

function generateContentIssues() {
  return [
    {
      type: "thin_content",
      severity: "high",
      description: "Strona zawiera mniej niż 300 słów",
    },
    {
      type: "keyword_stuffing",
      severity: "medium",
      description: "Zbyt wysoka gęstość słów kluczowych (4.2%)",
    },
    {
      type: "missing_headings",
      severity: "low",
      description: "Brak struktury nagłówków H2-H3",
    },
  ];
}

function generateContentRecommendations() {
  return [
    "Zwiększ długość treści do minimum 800 słów",
    "Dodaj więcej nagłówków dla lepszej struktury",
    "Zwiększ liczbę linków wewnętrznych",
    "Dodaj wywołania do działania (CTA)",
    "Popraw readability score przez uproszczenie zdań",
  ];
}

function generateOptimizedRobots(domain: string, current?: string) {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://${domain}/sitemap.xml
Sitemap: https://${domain}/sitemap-images.xml

# Crawl delay for aggressive bots
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

# Disallow admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /tmp/
Disallow: *.pdf$
Disallow: /search?*
Disallow: /*?utm_*

# Allow important bot access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;
}

function generateSampleSitemapUrls(domain: string, includeImages: boolean) {
  const urls = [
    {
      loc: `https://${domain}/`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0,
    },
    {
      loc: `https://${domain}/o-nas`,
      lastmod: new Date(Date.now() - 86400000 * 2).toISOString(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: `https://${domain}/uslugi`,
      lastmod: new Date(Date.now() - 86400000 * 5).toISOString(),
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: `https://${domain}/kontakt`,
      lastmod: new Date(Date.now() - 86400000 * 7).toISOString(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: `https://${domain}/blog`,
      lastmod: new Date(Date.now() - 86400000).toISOString(),
      changefreq: "weekly",
      priority: 0.8,
    },
  ];

  if (includeImages) {
    urls.forEach((url) => {
      if (Math.random() > 0.5) {
        (url as any)["images"] = [
          {
            loc: `https://${domain}/images/hero-${Math.floor(
              Math.random() * 10
            )}.jpg`,
            caption: "Hero image",
            title: "Main page hero",
          },
        ];
      }
    });
  }

  return urls;
}

function generateExecutiveSummary() {
  return {
    overallPerformance: "positive",
    keyMetrics: {
      organicTraffic: { value: 15420, change: "+12%" },
      averagePosition: { value: 18.5, change: "-2.3" },
      clickThroughRate: { value: 4.2, change: "+0.8%" },
      newKeywords: { value: 47, change: "+15" },
    },
    highlights: [
      "Wzrost ruchu organicznego o 12%",
      "Poprawa pozycji dla 23 głównych fraz",
      "Zmniejszenie błędów crawlingu o 67%",
      "Wdrożenie 15 nowych landing pages",
    ],
  };
}

function generateTrafficAnalysis() {
  return {
    totalSessions: Math.floor(Math.random() * 50000) + 20000,
    organicSessions: Math.floor(Math.random() * 30000) + 10000,
    conversionRate: (Math.random() * 3 + 1).toFixed(2),
    bounceRate: (Math.random() * 30 + 40).toFixed(1),
    avgSessionDuration: "2:34",
    topPages: [
      { page: "/", sessions: 5420, conversions: 124 },
      { page: "/uslugi", sessions: 3210, conversions: 89 },
      { page: "/o-nas", sessions: 2100, conversions: 45 },
    ],
  };
}

function generateKeywordPerformance() {
  return {
    totalKeywords: Math.floor(Math.random() * 500) + 200,
    top10Keywords: Math.floor(Math.random() * 20) + 5,
    improvingKeywords: Math.floor(Math.random() * 100) + 30,
    decliningKeywords: Math.floor(Math.random() * 50) + 10,
    topKeywords: [
      { keyword: "main service", position: 3, change: "+2", volume: 5400 },
      { keyword: "brand name", position: 1, change: "0", volume: 3200 },
      { keyword: "local service", position: 7, change: "+5", volume: 2100 },
    ],
  };
}

function generateTechnicalIssues() {
  return {
    totalIssues: Math.floor(Math.random() * 20) + 5,
    critical: Math.floor(Math.random() * 3) + 1,
    high: Math.floor(Math.random() * 5) + 2,
    medium: Math.floor(Math.random() * 8) + 3,
    low: Math.floor(Math.random() * 10) + 5,
    topIssues: [
      { type: "Slow page speed", count: 8, severity: "high" },
      { type: "Missing alt attributes", count: 15, severity: "medium" },
      { type: "Duplicate title tags", count: 3, severity: "high" },
    ],
  };
}

function generateRecommendations() {
  return [
    {
      priority: "high",
      title: "Popraw szybkość ładowania",
      description: "Zoptymalizuj obrazy i włącz kompresję",
      effort: "medium",
      impact: "high",
    },
    {
      priority: "high",
      title: "Rozbuduj content marketing",
      description: "Stwórz 10 nowych artykułów o wysokiej jakości",
      effort: "high",
      impact: "high",
    },
    {
      priority: "medium",
      title: "Popraw linki wewnętrzne",
      description: "Dodaj contextualne linki między powiązanymi treściami",
      effort: "low",
      impact: "medium",
    },
  ];
}

function getPeriodDates(reportType: string) {
  const now = Date.now();
  switch (reportType) {
    case "daily":
      return { start: now - 86400000, end: now };
    case "weekly":
      return { start: now - 7 * 86400000, end: now };
    case "monthly":
      return { start: now - 30 * 86400000, end: now };
    default:
      return { start: now - 7 * 86400000, end: now };
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function errorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
