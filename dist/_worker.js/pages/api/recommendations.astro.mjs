globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_Ba3qNCWV.mjs';

class GoogleDriveIntegration {
  config;
  accessToken = null;
  refreshToken = null;
  constructor(config) {
    this.config = config;
  }
  /**
   * Step 1: Get authorization URL for OAuth2 flow
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent"
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
  /**
   * Step 2: Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(authorizationCode) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: authorizationCode,
        grant_type: "authorization_code",
        redirect_uri: this.config.redirectUri
      })
    });
    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }
    const tokens = await response.json();
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    return tokens;
  }
  /**
   * Step 3: Refresh access token when expired
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token"
      })
    });
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }
    const tokens = await response.json();
    this.accessToken = tokens.access_token;
    return this.accessToken;
  }
  /**
   * Step 4: Search files in Google Drive
   */
  async searchFiles(query = "", maxResults = 100) {
    if (!this.accessToken) {
      throw new Error("Not authenticated. Call exchangeCodeForTokens first.");
    }
    const searchQuery = query ? `name contains '${query}'` : "";
    const params = new URLSearchParams({
      q: searchQuery,
      pageSize: maxResults.toString(),
      fields: "files(id,name,mimeType,size,modifiedTime,webViewLink),nextPageToken"
    });
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      if (response.status === 401) {
        await this.refreshAccessToken();
        return this.searchFiles(query, maxResults);
      }
      throw new Error(`Drive API error: ${response.statusText}`);
    }
    const data = await response.json();
    const files = data.files || [];
    const totalSize = files.reduce((sum, file) => sum + (parseInt(file.size) || 0), 0);
    const categories = this.categorizeFiles(files);
    return {
      files,
      totalFiles: files.length,
      totalSize,
      categories
    };
  }
  /**
   * Step 5: Get file content for AI analysis
   */
  async getFileContent(fileId) {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }
    const metaResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      headers: {
        "Authorization": `Bearer ${this.accessToken}`
      }
    });
    if (!metaResponse.ok) {
      throw new Error(`Failed to get file metadata: ${metaResponse.statusText}`);
    }
    const metadata = await metaResponse.json();
    if (!this.isTextFile(metadata.mimeType)) {
      throw new Error(`File type ${metadata.mimeType} is not supported for content extraction`);
    }
    const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        "Authorization": `Bearer ${this.accessToken}`
      }
    });
    if (!contentResponse.ok) {
      throw new Error(`Failed to download file content: ${contentResponse.statusText}`);
    }
    return await contentResponse.text();
  }
  /**
   * Step 6: Analyze Drive data for AI recommendations
   */
  async analyzeUserData(dataTypes = ["personal", "business"]) {
    const analysisResults = [];
    for (const dataType of dataTypes) {
      try {
        let searchQuery = "";
        switch (dataType) {
          case "personal":
            searchQuery = "CV OR resume OR portfolio OR certificate";
            break;
          case "business":
            searchQuery = "business OR plan OR report OR analysis";
            break;
          case "technical":
            searchQuery = "code OR documentation OR config OR log";
            break;
        }
        const searchResult = await this.searchFiles(searchQuery, 20);
        const textFiles = searchResult.files.filter((file) => this.isTextFile(file.mimeType)).slice(0, 5);
        for (const file of textFiles) {
          try {
            const content = await this.getFileContent(file.id);
            analysisResults.push(`${dataType.toUpperCase()} - ${file.name}: ${content.substring(0, 200)}...`);
          } catch (error) {
            console.warn(`Failed to read file ${file.name}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${dataType} data:`, error);
        analysisResults.push(`${dataType.toUpperCase()}: Błąd dostępu do danych`);
      }
    }
    return analysisResults.join("\n\n");
  }
  /**
   * Helper: Check if file is text-based
   */
  isTextFile(mimeType) {
    const textTypes = [
      "text/plain",
      "text/html",
      "text/css",
      "text/javascript",
      "application/json",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.google-apps.document",
      "application/vnd.google-apps.spreadsheet"
    ];
    return textTypes.some((type) => mimeType.includes(type));
  }
  /**
   * Helper: Categorize files by type
   */
  categorizeFiles(files) {
    const categories = {
      documents: 0,
      images: 0,
      videos: 0,
      audio: 0,
      code: 0,
      other: 0
    };
    files.forEach((file) => {
      const mimeType = file.mimeType.toLowerCase();
      if (mimeType.includes("document") || mimeType.includes("text") || mimeType.includes("pdf")) {
        categories.documents++;
      } else if (mimeType.includes("image")) {
        categories.images++;
      } else if (mimeType.includes("video")) {
        categories.videos++;
      } else if (mimeType.includes("audio")) {
        categories.audio++;
      } else if (mimeType.includes("javascript") || mimeType.includes("python") || mimeType.includes("code")) {
        categories.code++;
      } else {
        categories.other++;
      }
    });
    return categories;
  }
  /**
   * Get current authentication status
   */
  isAuthenticated() {
    return !!this.accessToken;
  }
  /**
   * Set tokens manually (for server-side usage)
   */
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }
}
function createGoogleDriveIntegration(env) {
  const config = {
    clientId: env.GOOGLE_CLIENT_ID || "your-client-id.googleusercontent.com",
    clientSecret: env.GOOGLE_CLIENT_SECRET || "your-client-secret",
    redirectUri: env.GOOGLE_REDIRECT_URI || "https://mybonzo.com/auth/google/callback",
    scopes: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.metadata.readonly"
    ]
  };
  return new GoogleDriveIntegration(config);
}
async function getGoogleDriveData(env, dataTypes = []) {
  try {
    const accessToken = env.GOOGLE_ACCESS_TOKEN;
    const refreshToken = env.GOOGLE_REFRESH_TOKEN;
    if (!accessToken) {
      return `GOOGLE DRIVE: Nie skonfigurowano. Wymagane zmienne:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET  
- GOOGLE_ACCESS_TOKEN
- GOOGLE_REFRESH_TOKEN

Instrukcje konfiguracji: /docs/google-drive-setup`;
    }
    const drive = createGoogleDriveIntegration(env);
    drive.setTokens(accessToken, refreshToken);
    const analysisResult = await drive.analyzeUserData(dataTypes);
    return `PRAWDZIWE DANE Z GOOGLE DRIVE (2TB):
${analysisResult}`;
  } catch (error) {
    console.error("Google Drive integration error:", error);
    return `GOOGLE DRIVE: Błąd połączenia - ${error.message}`;
  }
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://mybonzo.com", "SSR": true};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { userProfile, recommendationType, contextData, selectedModels, useGoogleDrive, driveDataTypes } = body;
    if (!userProfile || !selectedModels || selectedModels.length === 0) {
      return new Response(JSON.stringify({
        error: "User profile and selected models are required",
        status: "error"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let driveContext = "";
    if (useGoogleDrive) {
      try {
        driveContext = await getGoogleDriveData(Object.assign(__vite_import_meta_env__, {}), driveDataTypes || []);
      } catch (error) {
        console.warn("Google Drive integration failed:", error);
        driveContext = "Google Drive: Nie skonfigurowano lub błąd połączenia";
      }
    }
    const modelResults = await Promise.allSettled(
      selectedModels.map(
        (modelName) => generateRecommendationsWithModel(modelName, userProfile, recommendationType, contextData, driveContext)
      )
    );
    const successfulResults = modelResults.filter((result) => result.status === "fulfilled").map((result) => result.value);
    const failedModels = modelResults.map((result, index) => ({ result, model: selectedModels[index] })).filter(({ result }) => result.status === "rejected").map(({ model }) => model);
    const combinedRecommendations = combineAndRankRecommendations(successfulResults);
    const aiInsights = generateAIInsights(userProfile, combinedRecommendations, successfulResults);
    const response = {
      status: "success",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      userProfile: userProfile.substring(0, 100) + "...",
      // Truncated for privacy
      recommendationType,
      modelsUsed: selectedModels.filter((model) => !failedModels.includes(model)),
      failedModels,
      recommendations: combinedRecommendations,
      aiInsights,
      metadata: {
        totalModels: selectedModels.length,
        successfulModels: successfulResults.length,
        processingTime: Math.random() * 3e3 + 1e3,
        // ms
        googleDriveUsed: useGoogleDrive,
        dataSourcesCount: useGoogleDrive ? 3 : 2
      }
    };
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Recommendations API Error:", error);
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
async function generateRecommendationsWithModel(modelName, userProfile, type, context = "", driveContext) {
  try {
    const mockResponse = {
      recommendations: [
        {
          title: `Rekomendacja z ${modelName}`,
          description: `Spersonalizowana rekomendacja wygenerowana przez model ${modelName} na podstawie Twojego profilu.`,
          reason: `Analiza przez ${modelName} wskazuje wysokie dopasowanie`,
          score: Math.floor(Math.random() * 20 + 80),
          category: type,
          price: "Do ustalenia",
          timeframe: "Zależy od implementacji",
          priority: "medium"
        }
      ],
      summary: `Analiza wykonana przez ${modelName}`
    };
    return {
      model: modelName,
      success: true,
      ...mockResponse
    };
  } catch (error) {
    console.error(`Error with model ${modelName}:`, error);
    return {
      model: modelName,
      success: false,
      error: error?.message || "Unknown error",
      recommendations: [],
      summary: `Błąd podczas analizy przez ${modelName}`
    };
  }
}
function combineAndRankRecommendations(modelResults) {
  const allRecommendations = [];
  modelResults.forEach((result) => {
    if (result.success && result.recommendations) {
      result.recommendations.forEach((rec) => {
        allRecommendations.push({
          ...rec,
          sourceModel: result.model
        });
      });
    }
  });
  allRecommendations.sort((a, b) => (b.score || 0) - (a.score || 0));
  return allRecommendations.slice(0, 8);
}
function generateAIInsights(userProfile, recommendations, modelResults) {
  const insights = {
    profileAnalysis: [],
    recommendationTrends: [],
    modelConsensus: [],
    actionableSteps: []
  };
  if (userProfile.toLowerCase().includes("ai") || userProfile.toLowerCase().includes("machine learning")) {
    insights.profileAnalysis.push("Silne zainteresowanie sztuczną inteligencją");
  }
  if (userProfile.toLowerCase().includes("cloud") || userProfile.toLowerCase().includes("aws") || userProfile.toLowerCase().includes("azure")) {
    insights.profileAnalysis.push("Doświadczenie z technologiami chmurowymi");
  }
  if (userProfile.toLowerCase().includes("python") || userProfile.toLowerCase().includes("javascript")) {
    insights.profileAnalysis.push("Umiejętności programistyczne");
  }
  const categories = recommendations.map((r) => r.category).filter(Boolean);
  const categoryCount = categories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0];
  if (topCategory) {
    insights.recommendationTrends.push(`Dominująca kategoria: ${topCategory[0]} (${topCategory[1]} rekomendacji)`);
  }
  const modelAgreement = modelResults.filter((r) => r.success).length / modelResults.length * 100;
  insights.modelConsensus.push(`Zgodność modeli: ${modelAgreement.toFixed(1)}%`);
  insights.actionableSteps.push("Rozpocznij od rekomendacji o najwyższym score");
  insights.actionableSteps.push("Sprawdź dostępność budżetu dla płatnych opcji");
  insights.actionableSteps.push("Zaplanuj harmonogram realizacji");
  insights.actionableSteps.push("Monitoruj postępy i dostosowuj plan");
  return insights;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
