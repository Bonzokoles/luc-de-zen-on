if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_DfX9K_yD.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_Dp3aPz4Y.mjs';

const OPTIONS = createOPTIONSHandler(["POST"]);
const POST = async ({ request }) => {
  try {
    const { url, checks = [] } = await request.json();
    if (!url) {
      return createErrorResponse("URL jest wymagany do analizy SEO", 400);
    }
    try {
      new URL(url);
    } catch {
      return createErrorResponse("Nieprawidłowy format URL", 400);
    }
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyBonzo-WebMaster/1.0 (SEO Analysis Bot)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(15e3)
      // 15s timeout
    });
    if (!response.ok) {
      return createErrorResponse(`Nie można pobrać strony: ${response.status} ${response.statusText}`, 400);
    }
    const html = await response.text();
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return createErrorResponse("URL nie wskazuje na stronę HTML", 400);
    }
    const seoResults = await analyzeSEO(html, url);
    const analysisTime = Date.now() - startTime;
    return createSuccessResponse({
      analyzedUrl: url,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      seo: seoResults,
      usage: {
        analysisTime,
        checksPerformed: seoResults.checks.length
      }
    });
  } catch (error) {
    console.error("SEO Analysis API Error:", error);
    return createErrorResponse(`Błąd analizy SEO: ${error.message}`, 500);
  }
};
async function analyzeSEO(html, url) {
  const checks = [];
  let overallScore = 0;
  const recommendations = [];
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  const metaDescMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : null;
  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
  const h1Count = h1Matches ? h1Matches.length : 0;
  const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/gi);
  const h2Count = h2Matches ? h2Matches.length : 0;
  const imgMatches = html.match(/<img[^>]*>/gi);
  const images = imgMatches || [];
  if (title) {
    const titleLength = title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      checks.push({
        name: "Title Tag",
        passed: true,
        description: `Optymalna długość: ${titleLength} znaków`,
        impact: "high",
        value: title
      });
      overallScore += 20;
    } else if (titleLength < 30) {
      checks.push({
        name: "Title Tag",
        passed: false,
        description: `Za krótki: ${titleLength} znaków (zalecane 30-60)`,
        impact: "high",
        value: title
      });
      recommendations.push({
        priority: "high",
        text: "Wydłuż title tag - dodaj więcej opisowych słów kluczowych",
        category: "meta"
      });
    } else {
      checks.push({
        name: "Title Tag",
        passed: false,
        description: `Za długi: ${titleLength} znaków (zalecane 30-60)`,
        impact: "high",
        value: title.substring(0, 60) + "..."
      });
      recommendations.push({
        priority: "high",
        text: "Skróć title tag - Google może go obciąć w wynikach",
        category: "meta"
      });
    }
  } else {
    checks.push({
      name: "Title Tag",
      passed: false,
      description: "Brak title tag",
      impact: "critical"
    });
    recommendations.push({
      priority: "critical",
      text: "Dodaj title tag - to podstawowy element SEO",
      category: "meta"
    });
  }
  if (metaDescription) {
    const descLength = metaDescription.length;
    if (descLength >= 150 && descLength <= 160) {
      checks.push({
        name: "Meta Description",
        passed: true,
        description: `Optymalna długość: ${descLength} znaków`,
        impact: "high",
        value: metaDescription
      });
      overallScore += 20;
    } else if (descLength < 150) {
      checks.push({
        name: "Meta Description",
        passed: false,
        description: `Za krótka: ${descLength} znaków (zalecane 150-160)`,
        impact: "medium",
        value: metaDescription
      });
      recommendations.push({
        priority: "medium",
        text: "Wydłuż meta description - wykorzystaj dostępne miejsce",
        category: "meta"
      });
    } else {
      checks.push({
        name: "Meta Description",
        passed: false,
        description: `Za długa: ${descLength} znaków (zalecane 150-160)`,
        impact: "medium",
        value: metaDescription.substring(0, 160) + "..."
      });
      recommendations.push({
        priority: "medium",
        text: "Skróć meta description - może być obcięta w wynikach",
        category: "meta"
      });
    }
  } else {
    checks.push({
      name: "Meta Description",
      passed: false,
      description: "Brak meta description",
      impact: "high"
    });
    recommendations.push({
      priority: "high",
      text: "Dodaj meta description - zwiększa CTR w wynikach wyszukiwania",
      category: "meta"
    });
  }
  if (h1Count === 1) {
    checks.push({
      name: "H1 Heading",
      passed: true,
      description: "Jeden H1 tag (poprawnie)",
      impact: "medium"
    });
    overallScore += 15;
  } else if (h1Count === 0) {
    checks.push({
      name: "H1 Heading",
      passed: false,
      description: "Brak H1 tag",
      impact: "high"
    });
    recommendations.push({
      priority: "high",
      text: "Dodaj jeden H1 tag z głównym słowem kluczowym strony",
      category: "structure"
    });
  } else {
    checks.push({
      name: "H1 Heading",
      passed: false,
      description: `${h1Count} H1 tagów - zalecany jeden`,
      impact: "medium"
    });
    recommendations.push({
      priority: "medium",
      text: "Użyj tylko jednego H1 tag na stronie dla lepszej struktury",
      category: "structure"
    });
  }
  if (h2Count > 0) {
    checks.push({
      name: "Heading Structure",
      passed: true,
      description: `Struktura H1-H2: ${h1Count} H1, ${h2Count} H2`,
      impact: "low"
    });
    overallScore += 10;
  } else {
    checks.push({
      name: "Heading Structure",
      passed: false,
      description: "Brak H2 tagów dla struktury treści",
      impact: "low"
    });
    recommendations.push({
      priority: "low",
      text: "Dodaj H2 tagi dla lepszej struktury treści i SEO",
      category: "structure"
    });
  }
  if (images.length > 0) {
    const imagesWithoutAlt = images.filter((img) => !img.includes("alt=")).length;
    const imagesWithEmptyAlt = images.filter(
      (img) => img.includes('alt=""') || img.includes("alt=''")
    ).length;
    if (imagesWithoutAlt === 0 && imagesWithEmptyAlt === 0) {
      checks.push({
        name: "Images Alt Text",
        passed: true,
        description: `Wszystkie ${images.length} obrazów ma prawidłowy alt text`,
        impact: "medium"
      });
      overallScore += 15;
    } else {
      const problemImages = imagesWithoutAlt + imagesWithEmptyAlt;
      checks.push({
        name: "Images Alt Text",
        passed: false,
        description: `${problemImages}/${images.length} obrazów bez alt text lub z pustym alt`,
        impact: "medium"
      });
      recommendations.push({
        priority: "medium",
        text: "Dodaj opisowy alt text do wszystkich obrazów dla dostępności i SEO",
        category: "accessibility"
      });
    }
  }
  if (url.startsWith("https://")) {
    checks.push({
      name: "HTTPS Security",
      passed: true,
      description: "Strona używa bezpiecznego protokołu HTTPS",
      impact: "high"
    });
    overallScore += 15;
  } else {
    checks.push({
      name: "HTTPS Security",
      passed: false,
      description: "Strona nie używa HTTPS - problem bezpieczeństwa",
      impact: "critical"
    });
    recommendations.push({
      priority: "critical",
      text: "Włącz HTTPS - Google preferuje bezpieczne strony w rankingu",
      category: "security"
    });
  }
  const hasViewport = html.includes("viewport") && html.includes("width=device-width");
  if (hasViewport) {
    checks.push({
      name: "Mobile Viewport",
      passed: true,
      description: "Meta viewport tag dla urządzeń mobilnych",
      impact: "high"
    });
    overallScore += 15;
  } else {
    checks.push({
      name: "Mobile Viewport",
      passed: false,
      description: "Brak lub nieprawidłowy meta viewport tag",
      impact: "high"
    });
    recommendations.push({
      priority: "high",
      text: 'Dodaj <meta name="viewport" content="width=device-width, initial-scale=1"> dla responsywności',
      category: "mobile"
    });
  }
  const hasOG = html.includes("og:title") && html.includes("og:description");
  if (hasOG) {
    checks.push({
      name: "Open Graph Tags",
      passed: true,
      description: "Open Graph meta tagi dla social media",
      impact: "low"
    });
    overallScore += 5;
  } else {
    checks.push({
      name: "Open Graph Tags",
      passed: false,
      description: "Brak Open Graph meta tagów",
      impact: "low"
    });
    recommendations.push({
      priority: "low",
      text: "Dodaj Open Graph tagi dla lepszego wyglądu w social media",
      category: "social"
    });
  }
  const hasSchema = html.includes("application/ld+json") || html.includes("itemscope");
  if (hasSchema) {
    checks.push({
      name: "Schema Markup",
      passed: true,
      description: "Structured data markup znaleziony",
      impact: "medium"
    });
    overallScore += 10;
  } else {
    checks.push({
      name: "Schema Markup",
      passed: false,
      description: "Brak structured data markup",
      impact: "medium"
    });
    recommendations.push({
      priority: "medium",
      text: "Dodaj Schema.org markup dla rich snippets w Google",
      category: "structure"
    });
  }
  overallScore = Math.min(overallScore, 100);
  return {
    overallScore,
    checks,
    recommendations: recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }),
    summary: {
      totalChecks: checks.length,
      passedChecks: checks.filter((c) => c.passed).length,
      criticalIssues: checks.filter((c) => c.impact === "critical" && !c.passed).length,
      highIssues: checks.filter((c) => c.impact === "high" && !c.passed).length
    }
  };
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
