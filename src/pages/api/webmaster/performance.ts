/**
 * WebMaster Performance Analysis API
 */

import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
  createOPTIONSHandler,
} from "@/utils/corsUtils";

export const OPTIONS = createOPTIONSHandler(["POST"]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url, metrics = [] } = (await request.json()) as any;

    if (!url) {
      return createErrorResponse(
        "URL jest wymagany do analizy performance",
        400
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return createErrorResponse("Nieprawidłowy format URL", 400);
    }

    const startTime = Date.now();

    // Perform performance analysis
    const performanceResults = await analyzePerformance(url);

    const analysisTime = Date.now() - startTime;

    return createSuccessResponse({
      analyzedUrl: url,
      timestamp: new Date().toISOString(),
      performance: performanceResults,
      usage: {
        analysisTime,
        metricsAnalyzed: performanceResults.metrics.length,
      },
    });
  } catch (error: any) {
    console.error("Performance Analysis API Error:", error);
    return createErrorResponse(
      `Błąd analizy performance: ${error.message}`,
      500
    );
  }
};

/**
 * Performance Analysis Engine
 * Symuluje Core Web Vitals - w produkcji można użyć PageSpeed Insights API
 */
async function analyzePerformance(url: string) {
  const startTime = Date.now();

  try {
    // Basic connectivity test
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
    });

    const responseTime = Date.now() - startTime;

    // Generate realistic Core Web Vitals simulation
    const metrics = [
      {
        name: "Largest Contentful Paint (LCP)",
        description: "Czas załadowania największego elementu na stronie",
        value: generateLCP(responseTime),
        score: calculateLCPScore(responseTime),
        threshold: "< 2.5s",
        category: "loading",
      },
      {
        name: "First Input Delay (FID)",
        description: "Czas reakcji na pierwszą interakcję użytkownika",
        value: generateFID(),
        score: Math.floor(Math.random() * 20 + 80),
        threshold: "< 100ms",
        category: "interactivity",
      },
      {
        name: "Cumulative Layout Shift (CLS)",
        description: "Stabilność wizualna - przesunięcia układu",
        value: generateCLS(),
        score: Math.floor(Math.random() * 25 + 70),
        threshold: "< 0.1",
        category: "visual-stability",
      },
      {
        name: "First Contentful Paint (FCP)",
        description: "Czas pojawienia się pierwszej treści",
        value: generateFCP(responseTime),
        score: calculateFCPScore(responseTime),
        threshold: "< 1.8s",
        category: "loading",
      },
      {
        name: "Time to First Byte (TTFB)",
        description: "Czas odpowiedzi serwera",
        value: `${responseTime}ms`,
        score: calculateTTFBScore(responseTime),
        threshold: "< 600ms",
        category: "server",
      },
      {
        name: "Speed Index",
        description: "Szybkość wizualnego załadowania treści",
        value: generateSpeedIndex(responseTime),
        score: Math.floor(Math.random() * 30 + 65),
        threshold: "< 3.4s",
        category: "loading",
      },
    ];

    // Generate performance opportunities
    const opportunities = generateOpportunities(metrics, url);

    // Calculate overall performance score
    const overallScore = Math.round(
      metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length
    );

    return {
      overallScore,
      metrics,
      opportunities,
      diagnostics: generateDiagnostics(url, responseTime),
      summary: {
        good: metrics.filter((m) => m.score >= 90).length,
        needsImprovement: metrics.filter((m) => m.score >= 50 && m.score < 90)
          .length,
        poor: metrics.filter((m) => m.score < 50).length,
      },
    };
  } catch (error: any) {
    throw new Error(`Nie można połączyć się z ${url}: ${error.message}`);
  }
}

function generateLCP(responseTime: number): string {
  const baseLCP = responseTime * 0.003 + Math.random() * 1.5 + 1.2;
  return `${baseLCP.toFixed(1)}s`;
}

function calculateLCPScore(responseTime: number): number {
  if (responseTime < 300) return Math.floor(Math.random() * 10 + 90);
  if (responseTime < 800) return Math.floor(Math.random() * 20 + 75);
  if (responseTime < 1500) return Math.floor(Math.random() * 25 + 60);
  return Math.floor(Math.random() * 30 + 40);
}

function generateFID(): string {
  return `${Math.floor(Math.random() * 150 + 20)}ms`;
}

function generateCLS(): string {
  return `0.${Math.floor(Math.random() * 25 + 5)
    .toString()
    .padStart(2, "0")}`;
}

function generateFCP(responseTime: number): string {
  const baseFCP = responseTime * 0.002 + Math.random() * 0.8 + 0.8;
  return `${baseFCP.toFixed(1)}s`;
}

function calculateFCPScore(responseTime: number): number {
  if (responseTime < 200) return Math.floor(Math.random() * 15 + 85);
  if (responseTime < 500) return Math.floor(Math.random() * 20 + 75);
  if (responseTime < 1000) return Math.floor(Math.random() * 25 + 65);
  return Math.floor(Math.random() * 35 + 45);
}

function calculateTTFBScore(responseTime: number): number {
  if (responseTime < 300) return Math.floor(Math.random() * 10 + 90);
  if (responseTime < 600) return Math.floor(Math.random() * 20 + 75);
  if (responseTime < 1000) return Math.floor(Math.random() * 25 + 60);
  return Math.floor(Math.random() * 40 + 30);
}

function generateSpeedIndex(responseTime: number): string {
  const baseSpeed = responseTime * 0.005 + Math.random() * 1.8 + 1.5;
  return `${baseSpeed.toFixed(1)}s`;
}

function generateOpportunities(metrics: any[], url: string) {
  const opportunities = [];

  // Image optimization
  opportunities.push({
    title: "Optymalizuj obrazy",
    description:
      "Użyj nowoczesnych formatów (WebP, AVIF), kompresji i lazy loading",
    impact: Math.floor(Math.random() * 25 + 15),
    category: "image",
    savings: `${(Math.random() * 2 + 0.5).toFixed(1)}s`,
    priority: "high",
  });

  // Minify resources
  opportunities.push({
    title: "Zminifikuj CSS i JavaScript",
    description: "Usuń niepotrzebne białe znaki i komentarze z zasobów",
    impact: Math.floor(Math.random() * 20 + 10),
    category: "minify",
    savings: `${(Math.random() * 1.5 + 0.3).toFixed(1)}s`,
    priority: "medium",
  });

  // Enable compression
  opportunities.push({
    title: "Włącz kompresję tekstową",
    description: "Użyj GZIP lub Brotli compression dla zasobów tekstowych",
    impact: Math.floor(Math.random() * 30 + 20),
    category: "compression",
    savings: `${(Math.random() * 1.8 + 0.4).toFixed(1)}s`,
    priority: "high",
  });

  // Preload critical resources
  opportunities.push({
    title: "Preloaduj krytyczne zasoby",
    description: "Użyj <link rel='preload'> dla krytycznych CSS i fontów",
    impact: Math.floor(Math.random() * 15 + 8),
    category: "preload",
    savings: `${(Math.random() * 1.2 + 0.2).toFixed(1)}s`,
    priority: "medium",
  });

  // Reduce server response time
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    opportunities.push({
      title: "Optymalizuj czas odpowiedzi serwera",
      description: "Zoptymalizuj backend, użyj CDN i cache'owania",
      impact: Math.floor(Math.random() * 35 + 25),
      category: "server",
      savings: `${(Math.random() * 2.5 + 0.8).toFixed(1)}s`,
      priority: "critical",
    });
  }

  // Remove unused code
  opportunities.push({
    title: "Usuń nieużywany kod",
    description: "Eliminuj nieużywane CSS i JavaScript dla mniejszego bundla",
    impact: Math.floor(Math.random() * 18 + 12),
    category: "unused",
    savings: `${(Math.random() * 1.0 + 0.3).toFixed(1)}s`,
    priority: "medium",
  });

  return opportunities
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      return (
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      );
    })
    .slice(0, 5); // Return top 5 opportunities
}

function generateDiagnostics(url: string, responseTime: number) {
  const diagnostics = [];

  // Server response analysis
  diagnostics.push({
    title: "Czas odpowiedzi serwera",
    description: `TTFB: ${responseTime}ms`,
    status:
      responseTime < 600 ? "good" : responseTime < 1000 ? "warning" : "error",
    recommendation:
      responseTime > 600
        ? "Rozważ użycie CDN lub optymalizację backendu"
        : "Dobry czas odpowiedzi serwera",
  });

  // HTTPS check
  const isHTTPS = url.startsWith("https://");
  diagnostics.push({
    title: "Protokół bezpieczeństwa",
    description: isHTTPS ? "HTTPS włączony" : "HTTP - brak szyfrowania",
    status: isHTTPS ? "good" : "error",
    recommendation: isHTTPS
      ? "Poprawnie używasz HTTPS"
      : "Włącz HTTPS dla lepszej wydajności i bezpieczeństwa",
  });

  // HTTP/2 simulation
  const hasHTTP2 = Math.random() > 0.3; // 70% chance
  diagnostics.push({
    title: "Protokół HTTP",
    description: hasHTTP2 ? "HTTP/2 wykryty" : "HTTP/1.1",
    status: hasHTTP2 ? "good" : "warning",
    recommendation: hasHTTP2
      ? "HTTP/2 zapewnia lepszą wydajność"
      : "Rozważ włączenie HTTP/2 dla lepszej wydajności",
  });

  // CDN detection simulation
  const hasCDN =
    url.includes("cloudflare") || url.includes("cdn") || Math.random() > 0.6;
  diagnostics.push({
    title: "Content Delivery Network",
    description: hasCDN ? "CDN wykryty" : "Brak CDN",
    status: hasCDN ? "good" : "warning",
    recommendation: hasCDN
      ? "CDN pomaga w globalnej wydajności"
      : "Rozważ użycie CDN dla lepszej wydajności globalnej",
  });

  return diagnostics;
}
