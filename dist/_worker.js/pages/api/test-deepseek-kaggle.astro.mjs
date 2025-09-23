globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';

const POST = async ({ request }) => {
  try {
    const { dataset, analysisType, customPrompt } = await request.json();
    if (!dataset) {
      return new Response(JSON.stringify({
        success: false,
        error: "Dataset name is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const deepseekApiKey = undefined                                 || process.env.DEEPSEEK_API_KEY;
    const kaggleUsername = undefined                                || process.env.KAGGLE_USERNAME;
    const kaggleKey = undefined                           || process.env.KAGGLE_KEY;
    if (!deepseekApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "DeepSeek API key not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!kaggleUsername || !kaggleKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Kaggle credentials not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const auth = btoa(`${kaggleUsername}:${kaggleKey}`);
    const kaggleResponse = await fetch(`https://www.kaggle.com/api/v1/datasets/list?search=${encodeURIComponent(dataset)}&page=1&pageSize=5`, {
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    });
    if (!kaggleResponse.ok) {
      throw new Error(`Kaggle API error: ${kaggleResponse.status}`);
    }
    const kaggleData = await kaggleResponse.json();
    if (!kaggleData.datasets || kaggleData.datasets.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "No datasets found for the given search term"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const selectedDataset = kaggleData.datasets[0];
    const datasetRef = `${selectedDataset.ownerName}/${selectedDataset.datasetSlug}`;
    const detailResponse = await fetch(`https://www.kaggle.com/api/v1/datasets/view/${datasetRef}`, {
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    });
    let datasetDetails = selectedDataset;
    if (detailResponse.ok) {
      datasetDetails = await detailResponse.json();
    }
    let analysisPrompt = "";
    switch (analysisType) {
      case "quick":
        analysisPrompt = "Provide a quick analysis focusing on data structure, key features, and potential applications.";
        break;
      case "detailed":
        analysisPrompt = "Provide a comprehensive analysis including data quality assessment, statistical insights, potential biases, and detailed recommendations for analysis approaches.";
        break;
      case "ml":
        analysisPrompt = "Focus on machine learning potential: suitable algorithms, feature engineering opportunities, prediction targets, and expected challenges.";
        break;
      case "custom":
        analysisPrompt = customPrompt || "Provide a general analysis of this dataset.";
        break;
      default:
        analysisPrompt = "Provide a comprehensive analysis of this dataset.";
    }
    const prompt = `
Analyze this Kaggle dataset:

Dataset: ${datasetRef}
Title: ${datasetDetails.title || "N/A"}
Description: ${datasetDetails.description || "No description available"}
Owner: ${datasetDetails.ownerName || "N/A"}
Size: ${datasetDetails.totalBytes || "Unknown"} bytes
Files: ${datasetDetails.files ? datasetDetails.files.map((f) => f.name).join(", ") : "Unknown"}
Downloads: ${datasetDetails.downloadCount || "N/A"}
Views: ${datasetDetails.viewCount || "N/A"}

${analysisPrompt}

Please provide insights in a structured format covering:
1. Dataset Overview
2. Data Quality Assessment
3. Potential Use Cases
4. Recommended Analysis Approaches
5. Key Considerations
    `.trim();
    const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${deepseekApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2e3
      })
    });
    if (!deepseekResponse.ok) {
      throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
    }
    const deepseekData = await deepseekResponse.json();
    const analysis = deepseekData.choices[0]?.message?.content || "No analysis generated";
    return new Response(JSON.stringify({
      success: true,
      dataset: datasetDetails,
      analysis,
      query: dataset,
      analysisType,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("DeepSeek+Kaggle test error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
