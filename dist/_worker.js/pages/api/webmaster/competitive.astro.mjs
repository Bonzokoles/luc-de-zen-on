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
import { c as createOPTIONSHandler, b as createErrorResponse, a as createSuccessResponse } from '../../../chunks/corsUtils_DD_RavK2.mjs';
export { d as renderers } from '../../../chunks/vendor_DlPT8CWO.mjs';

const OPTIONS = createOPTIONSHandler(["POST"]);
const POST = async ({ request }) => {
  try {
    const { domain, analysis = [] } = await request.json();
    if (!domain) {
      return createErrorResponse("Domena jest wymagana do analizy konkurencyjnej", 400);
    }
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
    if (!cleanDomain || !cleanDomain.includes(".")) {
      return createErrorResponse("Nieprawidłowy format domeny", 400);
    }
    const startTime = Date.now();
    const competitiveResults = await analyzeCompetitive(cleanDomain);
    const analysisTime = Date.now() - startTime;
    return createSuccessResponse({
      domain: cleanDomain,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      competitive: competitiveResults,
      usage: {
        analysisTime,
        dataPoints: Object.keys(competitiveResults).length
      }
    });
  } catch (error) {
    console.error("Competitive Analysis API Error:", error);
    return createErrorResponse(`Błąd analizy konkurencyjnej: ${error.message}`, 500);
  }
};
async function analyzeCompetitive(domain) {
  const keywords = generateKeywords(domain);
  const techStack = generateTechStack();
  const trafficData = generateTrafficData();
  const backlinks = generateBacklinks(domain);
  const socialPresence = generateSocialPresence();
  const competitors = generateCompetitors(domain);
  return {
    overview: {
      domainAuthority: Math.floor(Math.random() * 40 + 35),
      pageAuthority: Math.floor(Math.random() * 45 + 30),
      trustScore: Math.floor(Math.random() * 30 + 60),
      spamScore: Math.floor(Math.random() * 15 + 1)
    },
    keywords,
    techStack,
    traffic: trafficData,
    backlinks,
    socialPresence,
    competitors,
    seoHealth: generateSEOHealth(),
    marketPosition: generateMarketPosition()
  };
}
function generateKeywords(domain) {
  const baseKeywords = [
    "artificial intelligence",
    "machine learning",
    "AI automation",
    "chatbot development",
    "business intelligence",
    "data analysis",
    "web development",
    "cloud computing",
    "digital transformation",
    "software solutions",
    "tech consulting",
    "automation tools"
  ];
  const domainKeywords = [];
  if (domain.includes("ai") || domain.includes("bot")) {
    domainKeywords.push("AI solutions", "intelligent automation", "neural networks");
  }
  if (domain.includes("web") || domain.includes("dev")) {
    domainKeywords.push("web design", "frontend development", "responsive design");
  }
  if (domain.includes("data") || domain.includes("analytics")) {
    domainKeywords.push("data visualization", "business analytics", "predictive modeling");
  }
  const allKeywords = [...baseKeywords, ...domainKeywords];
  return allKeywords.slice(0, 15).map((keyword) => ({
    keyword,
    position: Math.floor(Math.random() * 50 + 1),
    volume: generateSearchVolume(),
    difficulty: Math.floor(Math.random() * 100 + 1),
    cpc: `$${(Math.random() * 5 + 0.5).toFixed(2)}`,
    trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "stable" : "down"
  })).sort((a, b) => a.position - b.position);
}
function generateSearchVolume() {
  const volume = Math.floor(Math.random() * 1e5 + 100);
  if (volume >= 1e4) return `${(volume / 1e3).toFixed(1)}K`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return volume.toString();
}
function generateTechStack(domain) {
  const commonTech = [
    "React.js",
    "Vue.js",
    "Angular",
    "Node.js",
    "Express.js",
    "Next.js",
    "Nuxt.js",
    "Svelte",
    "TypeScript",
    "JavaScript"
  ];
  const backendTech = [
    "Python",
    "Django",
    "Flask",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "Java",
    "Spring Boot",
    "C#",
    ".NET"
  ];
  const infrastructureTech = [
    "AWS",
    "Google Cloud",
    "Azure",
    "Cloudflare",
    "Docker",
    "Kubernetes",
    "Redis",
    "PostgreSQL",
    "MongoDB",
    "Elasticsearch"
  ];
  const allTech = [...commonTech, ...backendTech, ...infrastructureTech];
  const selectedTech = [];
  const numTech = Math.floor(Math.random() * 8 + 4);
  for (let i = 0; i < numTech; i++) {
    const tech = allTech[Math.floor(Math.random() * allTech.length)];
    if (!selectedTech.includes(tech)) {
      selectedTech.push(tech);
    }
  }
  return selectedTech.map((tech) => ({
    name: tech,
    category: categorizeTech(tech),
    popularity: Math.floor(Math.random() * 100 + 1)
  }));
}
function categorizeTech(tech) {
  const categories = {
    "React.js": "Frontend Framework",
    "Vue.js": "Frontend Framework",
    "Angular": "Frontend Framework",
    "Node.js": "Runtime Environment",
    "Express.js": "Backend Framework",
    "Next.js": "Full-stack Framework",
    "Python": "Programming Language",
    "Django": "Backend Framework",
    "AWS": "Cloud Provider",
    "Docker": "Containerization",
    "PostgreSQL": "Database",
    "Redis": "Cache/Database"
  };
  return categories[tech] || "Technology";
}
function generateTrafficData(domain) {
  const baseTraffic = Math.floor(Math.random() * 1e6 + 1e4);
  return {
    monthlyVisits: formatNumber(baseTraffic),
    uniqueVisitors: formatNumber(Math.floor(baseTraffic * 0.7)),
    pageViews: formatNumber(Math.floor(baseTraffic * 2.3)),
    bounceRate: `${Math.floor(Math.random() * 40 + 30)}%`,
    avgSessionDuration: `${Math.floor(Math.random() * 4 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`,
    pagesPerSession: (Math.random() * 3 + 1.2).toFixed(1),
    trafficSources: {
      organic: Math.floor(Math.random() * 40 + 40),
      direct: Math.floor(Math.random() * 25 + 15),
      social: Math.floor(Math.random() * 15 + 5),
      referral: Math.floor(Math.random() * 15 + 8),
      paid: Math.floor(Math.random() * 10 + 2)
    },
    topCountries: [
      { country: "United States", percentage: Math.floor(Math.random() * 30 + 25) },
      { country: "Poland", percentage: Math.floor(Math.random() * 20 + 15) },
      { country: "Germany", percentage: Math.floor(Math.random() * 15 + 10) },
      { country: "United Kingdom", percentage: Math.floor(Math.random() * 12 + 8) },
      { country: "Canada", percentage: Math.floor(Math.random() * 10 + 5) }
    ]
  };
}
function formatNumber(num) {
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}
function generateBacklinks(domain) {
  const totalBacklinks = Math.floor(Math.random() * 5e4 + 1e3);
  const referringDomains = Math.floor(totalBacklinks * 0.1);
  return {
    totalBacklinks,
    referringDomains,
    domainAuthority: Math.floor(Math.random() * 40 + 35),
    followLinks: Math.floor(totalBacklinks * 0.7),
    nofollowLinks: Math.floor(totalBacklinks * 0.3),
    newBacklinks: Math.floor(Math.random() * 500 + 50),
    lostBacklinks: Math.floor(Math.random() * 200 + 10),
    anchorTexts: [
      { text: domain, count: Math.floor(Math.random() * 100 + 50) },
      { text: "visit website", count: Math.floor(Math.random() * 80 + 30) },
      { text: "click here", count: Math.floor(Math.random() * 60 + 20) },
      { text: "homepage", count: Math.floor(Math.random() * 40 + 15) },
      { text: "ai solutions", count: Math.floor(Math.random() * 35 + 10) }
    ],
    topReferrers: [
      { domain: "github.com", links: Math.floor(Math.random() * 200 + 50) },
      { domain: "stackoverflow.com", links: Math.floor(Math.random() * 150 + 30) },
      { domain: "medium.com", links: Math.floor(Math.random() * 100 + 25) },
      { domain: "linkedin.com", links: Math.floor(Math.random() * 80 + 20) },
      { domain: "reddit.com", links: Math.floor(Math.random() * 60 + 15) }
    ]
  };
}
function generateSocialPresence(domain) {
  return {
    platforms: [
      {
        platform: "LinkedIn",
        followers: formatNumber(Math.floor(Math.random() * 1e4 + 500)),
        engagement: `${(Math.random() * 3 + 1).toFixed(1)}%`,
        active: Math.random() > 0.2
      },
      {
        platform: "Twitter",
        followers: formatNumber(Math.floor(Math.random() * 25e3 + 1e3)),
        engagement: `${(Math.random() * 2 + 0.5).toFixed(1)}%`,
        active: Math.random() > 0.3
      },
      {
        platform: "Facebook",
        followers: formatNumber(Math.floor(Math.random() * 5e3 + 200)),
        engagement: `${(Math.random() * 4 + 1).toFixed(1)}%`,
        active: Math.random() > 0.4
      },
      {
        platform: "YouTube",
        followers: formatNumber(Math.floor(Math.random() * 15e3 + 300)),
        engagement: `${(Math.random() * 5 + 2).toFixed(1)}%`,
        active: Math.random() > 0.6
      }
    ],
    socialScore: Math.floor(Math.random() * 60 + 30),
    mentions: Math.floor(Math.random() * 500 + 50),
    sentiment: Math.random() > 0.6 ? "positive" : Math.random() > 0.3 ? "neutral" : "negative"
  };
}
function generateCompetitors(domain) {
  const competitorDomains = [
    "openai.com",
    "anthropic.com",
    "huggingface.co",
    "replicate.com",
    "stability.ai",
    "deepl.com",
    "jasper.ai",
    "copy.ai",
    "writesonic.com"
  ].filter((d) => !domain.includes(d.split(".")[0]));
  return competitorDomains.slice(0, 5).map((comp) => ({
    domain: comp,
    similarity: Math.floor(Math.random() * 40 + 60),
    trafficRatio: (Math.random() * 5 + 0.2).toFixed(1),
    keywordOverlap: Math.floor(Math.random() * 200 + 50),
    competitionLevel: Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low"
  }));
}
function generateSEOHealth() {
  return {
    overallScore: Math.floor(Math.random() * 30 + 65),
    issues: {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 5 + 1),
      medium: Math.floor(Math.random() * 8 + 2),
      low: Math.floor(Math.random() * 12 + 3)
    },
    categories: {
      technical: Math.floor(Math.random() * 20 + 75),
      content: Math.floor(Math.random() * 25 + 70),
      userExperience: Math.floor(Math.random() * 30 + 65),
      mobile: Math.floor(Math.random() * 15 + 80)
    }
  };
}
function generateMarketPosition(domain) {
  return {
    industryRanking: Math.floor(Math.random() * 1e3 + 100),
    marketShare: `${(Math.random() * 5 + 0.1).toFixed(2)}%`,
    growthRate: `${(Math.random() * 50 + 10).toFixed(1)}%`,
    competitiveStrength: Math.random() > 0.5 ? "strong" : Math.random() > 0.3 ? "moderate" : "weak",
    opportunities: [
      "Zwiększ obecność w social media",
      "Optymalizuj long-tail keywords",
      "Popraw mobile user experience",
      "Rozbuduj content marketing strategy"
    ].slice(0, Math.floor(Math.random() * 3 + 2))
  };
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
