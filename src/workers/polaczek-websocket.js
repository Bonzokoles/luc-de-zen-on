// Chat AI Assistant Worker for POLACZEK_T Agent
// Handles HTTP chat requests with knowledge base and AI integration
// Supports multiple AI providers: OpenAI, Hugging Face, Anthropic

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle CORS for all requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Session-ID",
        }
      });
    }

    // Chat endpoint - handle POST requests
    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChatRequest(request, env);
    }
    
    // Status endpoint
    if (url.pathname === "/api/status" && request.method === "GET") {
      return handleStatus(env);
    }

    // Knowledge base management - add new entries
    if (url.pathname === "/api/knowledge" && request.method === "POST") {
      return addToKnowledgeBase(request, env);
    }

    // Knowledge base search endpoint
    if (url.pathname === "/api/knowledge/search" && request.method === "GET") {
      return searchKnowledgeBase(request, env);
    }

    // Health check endpoint
    if (url.pathname === "/health" && request.method === "GET") {
      return new Response(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Default response
    return new Response(JSON.stringify({ 
      error: "Endpoint not found",
      available_endpoints: ["/api/chat", "/api/status", "/api/knowledge", "/api/knowledge/search", "/health"]
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};

async function handleChatRequest(request, env) {
  try {
    const { prompt, sessionId = "default" } = await request.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 1. Check knowledge base for cached answer
    const cachedAnswer = await getAnswerFromStorage(env, prompt);
    if (cachedAnswer) {
      return new Response(JSON.stringify({ 
        answer: cachedAnswer,
        source: "knowledge_base",
        sessionId 
      }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 2. Call external AI model API if no cached answer
    const aiResponse = await callPolishAIModelAPI(prompt, env);
    
    // 3. Save the new answer to knowledge base for future use
    await saveAnswerToStorage(env, prompt, aiResponse);
    
    // 4. Return the AI response
    return new Response(JSON.stringify({ 
      answer: aiResponse,
      source: "ai_model",
      sessionId
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    
  } catch (error) {
    console.error("Error handling chat request:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error.message 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

async function getAnswerFromStorage(env, prompt) {
  try {
    // Normalize prompt for key consistency
    const key = prompt.toLowerCase().trim().replace(/\s+/g, '_');
    return await env.KNOWLEDGE_BASE.get(key);
  } catch (error) {
    console.error("Error reading from knowledge base:", error);
    return null;
  }
}

async function saveAnswerToStorage(env, prompt, answer) {
  try {
    const key = prompt.toLowerCase().trim().replace(/\s+/g, '_');
    await env.KNOWLEDGE_BASE.put(key, answer);
    console.log("Saved new knowledge base entry for prompt:", prompt);
  } catch (error) {
    console.error("Error saving to knowledge base:", error);
  }
}


async function handleStatus(env) {
  try {
    // Get some stats from knowledge base
    const keys = await env.KNOWLEDGE_BASE.list();
    const knowledgeBaseSize = keys.keys.length;
    
    return new Response(JSON.stringify({
      status: "ready",
      agent: "POLACZEK_T Chat Assistant",
      platform: "Cloudflare Workers",
      knowledge_base_entries: knowledgeBaseSize,
      capabilities: ["chat", "knowledge_base", "ai_integration", "caching"]
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

async function addToKnowledgeBase(request, env) {
  try {
    const { question, answer } = await request.json();
    
    if (!question || !answer) {
      return new Response(JSON.stringify({ error: "Question and answer are required" }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    await saveAnswerToStorage(env, question, answer);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Added to knowledge base"
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to add to knowledge base",
      message: error.message 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

async function searchKnowledgeBase(request, env) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    if (!query) {
      return new Response(JSON.stringify({ error: "Query parameter 'q' is required" }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    const keys = await env.KNOWLEDGE_BASE.list();
    const results = [];
    
    // Simple search through keys (for demo purposes)
    // In production, consider using a proper search index
    for (const key of keys.keys) {
      if (key.name.toLowerCase().includes(query.toLowerCase())) {
        const value = await env.KNOWLEDGE_BASE.get(key.name);
        results.push({
          question: key.name.replace(/_/g, ' '),
          answer: value,
          key: key.name
        });
      }
    }
    
    return new Response(JSON.stringify({
      query,
      results,
      total: results.length
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Failed to search knowledge base",
      message: error.message 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

// Enhanced AI model integration with real API support
async function callPolishAIModelAPI(prompt, env) {
  try {
    const provider = env.AI_MODEL_PROVIDER || 'cloudflare';
    
    switch (provider) {
      case 'openai':
        return await callOpenAIAPI(prompt, env);
      case 'huggingface':
        return await callHuggingFaceAPI(prompt, env);
      case 'anthropic':
        return await callAnthropicAPI(prompt, env);
      case 'cloudflare':
        return await callCloudflareAI(prompt, env);
      default:
        return await callCloudflareAI(prompt, env);
    }
  } catch (error) {
    console.error("AI API call failed:", error);
  // Return error instead of mock response
  throw new Error('API key not configured - cannot provide real AI response');
  }
}

async function callOpenAIAPI(prompt, env) {
  // Requires OPENAI_API_KEY secret
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY not set, unable to provide AI response");
    throw new Error('OpenAI API key not configured');
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Jesteś pomocnym asystentem AI mówiącym po polsku. Odpowiadaj w języku polskim.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callHuggingFaceAPI(prompt, env) {
  // Requires HUGGINGFACE_API_KEY secret
  const apiKey = env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    console.warn("HUGGINGFACE_API_KEY not set, unable to provide AI response");
    throw new Error('HuggingFace API key not configured');
  }

  // Try Bielik model first, fallback to general Polish model
  const models = [
    'HuggingFaceH4/zephyr-7b-beta', // Bielik compatible model
    'piotr-ai/alpaca-7b-polish',    // General Polish model
    'google/gemma-7b'               // Fallback model
  ];

  for (const model of models) {
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: `Jesteś asystentem AI mówiącym po polsku. Odpowiedz po polsku na pytanie: ${prompt}`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].generated_text) {
          console.log(`Successfully used model: ${model}`);
          return data[0].generated_text;
        }
      }
      
      // If model is loading, wait and retry
      if (response.status === 503) {
        const retryAfter = response.headers.get('Retry-After') || 5;
        console.log(`Model ${model} is loading, retrying in ${retryAfter} seconds`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
    } catch (error) {
      console.warn(`Error with model ${model}:`, error.message);
      // Try next model
      continue;
    }
  }
  
  throw new Error("All Hugging Face models failed");
}

// Special function for Bielik model integration
async function callBielikModelAPI(prompt, env) {
  const apiKey = env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    console.warn("HUGGINGFACE_API_KEY not set for Bielik model");
    return getMockResponse(prompt);
  }

  try {
    // Bielik model specific endpoint (adjust based on actual model name)
    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: `<|system|>
Jesteś Bielik - zaawansowany asystent AI mówiący po polsku. Odpowiadaj w języku polskim, bądź pomocny i precyzyjny.
</s>
<|user|>
${prompt}
</s>
<|assistant|>`,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.8,
          top_p: 0.95,
          repetition_penalty: 1.1,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Bielik API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0].generated_text;
    
  } catch (error) {
    console.error("Bielik model failed, falling back to general Hugging Face:", error);
    return callHuggingFaceAPI(prompt, env);
  }
}

async function callAnthropicAPI(prompt, env) {
  // Requires ANTHROPIC_API_KEY secret
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY not set, unable to provide AI response");
    throw new Error('Anthropic API key not configured');
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.content[0].text;
}

// Cloudflare AI integration with Gemma 3 12B IT model
async function callCloudflareAI(prompt, env) {
  try {
    // Use Gemma 3 12B IT model for Polish language support
    const response = await env.AI.run('@cf/google/gemma-3-12b-it', {
      messages: [
        {
          role: 'system',
          content: 'Jesteś pomocnym asystentem AI mówiącym po polsku. Odpowiadaj w języku polskim w sposób naturalny i pomocny.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });
    
    return response.response || response;
    
  } catch (error) {
    console.error('Cloudflare AI call failed:', error);
    // Return error instead of mock response
    throw new Error('Cloudflare AI not available - unable to provide AI response');
  }
}

function getMockResponse(prompt) {
  // Mock responses for demonstration when no API keys are configured
  const responses = {
    "help": "Dostępne komendy: 'system status', 'ai workers', 'translation', 'agents'. Jestem asystentem AI opartym na Cloudflare Workers! Skonfiguruj klucz API dla pełnej funkcjonalności.",
    "system status": "System aktywny przez Cloudflare Workers. Baza wiedzy: dostępna. Model AI: wymaga konfiguracji klucza API.",
    "ai workers": "Workers: Generator Obrazów (Flux), Chatbot (GPT), Analytics, Kaggle, Search, Monitor - wszystko przez Cloudflare!",
    "translation": "Obsługuję tłumaczenia: pl, en, de, fr, es. Użyj komendy z tekstem do tłumaczenia.",
    "agents": "Dostępne agenty: POLACZEK_T (Translation), POLACZEK_AI (Art), POLACZEK_S1/S2 (Search) - działają przez Workers!",
    "api key": "Aby używać prawdziwego modelu AI, skonfiguruj klucz API w sekretach Cloudflare: OPENAI_API_KEY, HUGGINGFACE_API_KEY lub ANTHROPIC_API_KEY"
  };
  
  const lowerPrompt = prompt.toLowerCase().trim();
  
  // Check for exact matches first
  if (responses[lowerPrompt]) {
    return responses[lowerPrompt];
  }
  
  // Check for partial matches
  for (const [key, response] of Object.entries(responses)) {
    if (lowerPrompt.includes(key)) {
      return response;
    }
  }
  
  // Default response for unknown prompts
  return `Pytanie: "${prompt}" - uczę się odpowiadać! Skonfiguruj klucz API AI dla pełnej funkcjonalności. Spróbuj: help, system status, ai workers.`;
}
