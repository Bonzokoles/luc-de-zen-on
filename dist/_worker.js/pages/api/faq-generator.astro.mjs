globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
const faqDatabase = [];
const POST = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const aiBinding = env.AI;
    if (!aiBinding) {
      throw new Error("AI binding is not configured in your environment.");
    }
    const { knowledgeBase, category = "general", count = 5 } = await request.json();
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Knowledge base content is required" }), { status: 400 });
    }
    const systemPrompt = `You are an expert at creating FAQs. Based on the provided knowledge base, generate ${count} of the most important questions and answers in Polish.
    
    You MUST return the response as a valid JSON array of objects. Each object must contain these keys: "question", "answer", "priority" (a number from 1 to 5, where 1 is most important).
    
    Example format:
    [
      { "question": "Example question 1?", "answer": "Example answer 1.", "priority": 1 },
      { "question": "Example question 2?", "answer": "Example answer 2.", "priority": 2 }
    ]`;
    const aiResponse = await aiBinding.run("@cf/google/gemma-2-9b-it", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Knowledge Base: ${knowledgeBase.substring(0, 4e3)}` }
      ],
      max_tokens: 2e3
    });
    let parsedFAQ;
    try {
      const jsonMatch = aiResponse.response.match(/(\[[\s\S]*\])/);
      if (jsonMatch && jsonMatch[0]) {
        parsedFAQ = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON array found in AI response.");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse.response);
      throw new Error("AI returned data in an invalid format.");
    }
    const generatedFAQ = parsedFAQ.slice(0, count).map((item) => ({
      id: crypto.randomUUID(),
      question: item.question,
      answer: item.answer,
      category,
      priority: item.priority || 3,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));
    faqDatabase.push(...generatedFAQ);
    return new Response(JSON.stringify({
      success: true,
      message: "FAQ generated successfully using AI",
      faq: generatedFAQ
    }), { status: 200 });
  } catch (error) {
    console.error("FAQ Generation Error:", error);
    return new Response(JSON.stringify({ success: false, message: `Failed to generate FAQ: ${error.message}` }), { status: 500 });
  }
};
const GET = async ({ url }) => {
  const params = new URL(url).searchParams;
  const category = params.get("category");
  const limit = parseInt(params.get("limit") || "20");
  try {
    let filteredFAQ = faqDatabase;
    if (category) {
      filteredFAQ = faqDatabase.filter((item) => item.category === category);
    }
    const sortedFAQ = filteredFAQ.sort((a, b) => a.priority - b.priority || b.createdAt - a.createdAt).slice(0, limit);
    const stats = {
      total: faqDatabase.length,
      categories: [...new Set(faqDatabase.map((item) => item.category))],
      lastUpdated: faqDatabase.length > 0 ? Math.max(...faqDatabase.map((item) => item.updatedAt)) : null,
      averagePriority: faqDatabase.length > 0 ? faqDatabase.reduce((sum, item) => sum + item.priority, 0) / faqDatabase.length : 0
    };
    return new Response(JSON.stringify({
      success: true,
      faq: sortedFAQ,
      stats
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Failed to retrieve FAQ" }), { status: 500 });
  }
};
const PUT = async ({ request }) => {
  try {
    const { id, ...updateData } = await request.json();
    const faqIndex = faqDatabase.findIndex((item) => item.id === id);
    if (faqIndex === -1) {
      return new Response(JSON.stringify({ success: false, message: "FAQ item not found" }), { status: 404 });
    }
    faqDatabase[faqIndex] = {
      ...faqDatabase[faqIndex],
      ...updateData,
      updatedAt: Date.now()
    };
    return new Response(JSON.stringify({ success: true, message: "FAQ item updated successfully", faq: faqDatabase[faqIndex] }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Failed to update FAQ item" }), { status: 400 });
  }
};
const DELETE = async ({ url }) => {
  const params = new URL(url).searchParams;
  const id = params.get("id");
  if (!id) {
    return new Response(JSON.stringify({ success: false, message: "FAQ item ID is required" }), { status: 400 });
  }
  try {
    const faqIndex = faqDatabase.findIndex((item) => item.id === id);
    if (faqIndex === -1) {
      return new Response(JSON.stringify({ success: false, message: "FAQ item not found" }), { status: 404 });
    }
    faqDatabase.splice(faqIndex, 1);
    return new Response(JSON.stringify({ success: true, message: "FAQ item deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Failed to delete FAQ item" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
