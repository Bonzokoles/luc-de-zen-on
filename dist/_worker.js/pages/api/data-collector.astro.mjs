globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { action = "start" } = body;
    const env = locals.runtime?.env;
    switch (action) {
      case "start":
        return await handleDataCollection(body, env);
      case "status":
        return await handleCollectionStatus(env);
      case "storage":
        return await handleStorageInfo(env);
      case "topics":
        return await handleGetTopics(env);
      default:
        return new Response(JSON.stringify({
          error: "Invalid action",
          availableActions: ["start", "status", "storage", "topics"]
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error("Data Collector API Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      status: "error",
      message: error?.message || "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ url, locals }) => {
  const action = url.searchParams.get("action") || "status";
  const env = locals.runtime?.env;
  try {
    switch (action) {
      case "status":
        return await handleCollectionStatus(env);
      case "storage":
        return await handleStorageInfo(env);
      case "topics":
        return await handleGetTopics(env);
      default:
        return new Response(JSON.stringify({
          error: "Invalid action for GET request",
          availableActions: ["status", "storage", "topics"]
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error("Data Collector GET Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      status: "error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function handleDataCollection(body, env) {
  const { topics, sources = ["tavily", "web"], maxFilesPerTopic = 50 } = body;
  if (!topics || topics.length === 0) {
    return new Response(JSON.stringify({
      error: "Topics are required for data collection",
      status: "error"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const collectionId = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  ({
    estimatedCompletion: Date.now() + topics.length * maxFilesPerTopic * 2e3});
  return new Response(JSON.stringify({
    status: "success",
    collectionId,
    message: "Data collection started",
    estimatedFiles: topics.length * maxFilesPerTopic,
    estimatedSize: `${Math.round(topics.length * maxFilesPerTopic * 0.5)}MB`,
    trackingUrl: `/api/data-collector?action=status&id=${collectionId}`
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
async function handleCollectionStatus(env) {
  const overallStatus = {
    activeJobs: 3,
    completedToday: 12,
    totalCollectedFiles: 2847,
    totalDataSize: "1.2TB",
    lastCollection: new Date(Date.now() - 30 * 60 * 1e3).toISOString(),
    topicsActive: [
      "artificial intelligence trends",
      "machine learning applications",
      "cloud computing solutions",
      "digital marketing strategies",
      "business automation",
      "programming tutorials",
      "fintech innovations",
      "healthcare technology"
    ],
    storageUsed: "1.3TB / 1.8TB available for collection"
  };
  return new Response(JSON.stringify({
    status: "success",
    collection: overallStatus
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
async function handleStorageInfo(env) {
  return new Response(JSON.stringify({
    status: "success",
    storage: {
      total: "2TB",
      used: "1.375TB",
      available: "625GB",
      reservedForUser: "200GB",
      availableForCollection: "1.8TB",
      currentCollectionSize: "1.175TB",
      breakdown: {
        userFiles: "200GB (10%)",
        aiCollectedData: "1.175TB (58.75%)",
        systemFiles: "25GB (1.25%)",
        free: "600GB (30%)"
      },
      topCategories: {
        "AI & Technology": "340GB",
        "Business & Marketing": "285GB",
        "Development & Programming": "220GB",
        "Industry Specific": "180GB",
        "Education & Training": "150GB"
      }
    }
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
async function handleGetTopics(env) {
  const CLIENT_TOPICS = [
    // Technologia i AI
    "artificial intelligence trends",
    "machine learning applications",
    "cloud computing solutions",
    "cybersecurity best practices",
    "blockchain technology",
    "quantum computing",
    "edge computing",
    "IoT internet of things",
    // Business i Marketing
    "digital marketing strategies",
    "e-commerce optimization",
    "startup funding",
    "business automation",
    "customer experience",
    "data analytics",
    "project management",
    "remote work solutions",
    // Rozwój osobisty
    "programming tutorials",
    "career development",
    "leadership skills",
    "productivity tools",
    "online education",
    "certification programs",
    "skill assessment",
    "professional networking",
    // Branżowe
    "fintech innovations",
    "healthcare technology",
    "educational technology",
    "real estate tech",
    "automotive industry",
    "renewable energy",
    "smart cities",
    "agriculture technology"
  ];
  const topicsWithStats = CLIENT_TOPICS.map((topic) => ({
    name: topic,
    category: categorizeTopicByName(topic),
    estimatedFiles: Math.floor(Math.random() * 100 + 50),
    lastCollected: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1e3).toISOString(),
    relevanceScore: Math.floor(Math.random() * 30 + 70),
    dataSize: `${Math.floor(Math.random() * 50 + 10)}MB`
  }));
  return new Response(JSON.stringify({
    status: "success",
    topics: topicsWithStats,
    totalTopics: CLIENT_TOPICS.length,
    categories: {
      "Technology & AI": topicsWithStats.filter((t) => t.category === "Technology & AI").length,
      "Business & Marketing": topicsWithStats.filter((t) => t.category === "Business & Marketing").length,
      "Development": topicsWithStats.filter((t) => t.category === "Development").length,
      "Industry": topicsWithStats.filter((t) => t.category === "Industry").length
    }
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
function categorizeTopicByName(topic) {
  if (topic.includes("ai") || topic.includes("machine learning") || topic.includes("technology")) {
    return "Technology & AI";
  } else if (topic.includes("business") || topic.includes("marketing") || topic.includes("startup")) {
    return "Business & Marketing";
  } else if (topic.includes("programming") || topic.includes("development") || topic.includes("coding")) {
    return "Development";
  } else {
    return "Industry";
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
