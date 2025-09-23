import type { APIRoute } from 'astro';

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Advanced AI Chat API is running',
    status: 'active',
    methods: ['GET', 'POST', 'OPTIONS'],
    description: 'Send POST request with { message: "your prompt", language: "pl-PL", context: "voice-chat" }',
    features: ['speech', 'voice-response', 'polish-language']
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { 
      message, 
      language = 'pl-PL', 
      context = 'voice-chat',
      features = [],
      temperature = 0.7
    } = body;

    if (!message?.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // System prompt for voice AI assistant
    const systemPrompt = language === 'pl-PL' 
      ? `Jesteś MyBonzo AI - inteligentny polski asystent głosowy. 

ZASADY ODPOWIEDZI:
- Odpowiadaj krótko i konkretnie (1-3 zdania)
- Używaj naturalnego, przyjaznego tonu
- Mów po polsku, chyba że użytkownik poprosi o inny język
- Jesteś pomocny, ale też ciekawy i kreatywny
- Przy pytaniach o technologie, programowanie, AI - odpowiadaj szczegółowo
- Przy prostych pytaniach - odpowiadaj zwięźle
- Zawsze zakończ odpowiedź pytaniem lub zachęceniem do dalszej rozmowy

KONTEKST: ${context}
FUNKCJE: ${features.join(', ')}

Odpowiadaj naturalnie jak prawdziwy rozmówca.`
      : `You are MyBonzo AI - an intelligent voice assistant.

RESPONSE RULES:
- Keep responses short and concise (1-3 sentences)
- Use natural, friendly tone
- Be helpful, curious and creative
- For tech/programming/AI questions - provide detailed answers
- For simple questions - keep it brief
- Always end with a question or encouragement to continue

CONTEXT: ${context}
FEATURES: ${features.join(', ')}

Respond naturally like a real conversation partner.`;

    // Get Cloudflare AI environment
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;

    if (!env?.AI) {
      // Fallback response if no AI available
      const fallbackResponses = language === 'pl-PL' ? [
        "Cześć! Jestem MyBonzo AI. Jak mogę Ci dzisiaj pomóc?",
        "Witaj! Jestem gotowy do rozmowy. O czym chcesz porozmawiać?",
        "Hej! Miło Cię słyszeć. W czym mogę Ci dziś pomóc?",
        "Dzień dobry! Jestem MyBonzo AI. Jestem tu, żeby Ci pomóc!",
        "Siema! Gotowy na ciekawą rozmowę. Co Cię interesuje?"
      ] : [
        "Hello! I'm MyBonzo AI. How can I help you today?",
        "Hi there! I'm ready to chat. What would you like to talk about?",
        "Hey! Nice to hear from you. How can I assist you today?",
        "Good day! I'm MyBonzo AI, here to help you!",
        "Hello! Ready for an interesting conversation. What interests you?"
      ];

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return new Response(JSON.stringify({
        success: true,
        response: randomResponse,
        model: 'mybonzo-ai-fallback',
        context: context,
        timestamp: new Date().toISOString(),
        confidence: 0.95
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // Use Cloudflare AI with improved Polish language model
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: message
          }
        ],
        temperature: temperature,
        max_tokens: 300, // Keep responses concise for voice
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });

      let responseText = aiResponse?.response || "Przepraszam, wystąpił błąd podczas generowania odpowiedzi.";
      
      // Clean up response for voice synthesis
      responseText = responseText
        .replace(/\*\*/g, '') // Remove markdown bold
        .replace(/\*/g, '') // Remove markdown italic
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
        .replace(/```[\s\S]*?```/g, '[kod programistyczny]') // Replace code blocks
        .replace(/`([^`]+)`/g, '$1') // Remove inline code formatting
        .trim();

      // Ensure response is not too long for voice
      if (responseText.length > 500) {
        const sentences = responseText.split(/[.!?]+/);
        responseText = sentences.slice(0, 3).join('. ') + '.';
      }

      return new Response(JSON.stringify({
        success: true,
        response: responseText,
        model: 'llama-3.1-8b-instruct',
        context: context,
        timestamp: new Date().toISOString(),
        confidence: 0.92,
        features_used: features,
        language: language
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (aiError) {
      console.error('AI Processing Error:', aiError);
      
      // Smart fallback based on message content
      const lowerMessage = message.toLowerCase();
      let smartResponse = '';
      
      if (language === 'pl-PL') {
        if (lowerMessage.includes('cześć') || lowerMessage.includes('hej') || lowerMessage.includes('dzień dobry')) {
          smartResponse = 'Cześć! Miło Cię słyszeć. Jestem MyBonzo AI i jestem gotowy do pomocy. Co Cię dzisiaj interesuje?';
        } else if (lowerMessage.includes('jak') && lowerMessage.includes('masz')) {
          smartResponse = 'Dziękuję za pytanie! Jako AI mam się świetnie - pełen energii i gotowy do rozmowy. A jak się masz Ty?';
        } else if (lowerMessage.includes('pomocy') || lowerMessage.includes('pomóc')) {
          smartResponse = 'Oczywiście! Chętnie Ci pomogę. Powiedz mi, w czym dokładnie potrzebujesz wsparcia?';
        } else {
          smartResponse = 'Rozumiem Cię! To ciekawy temat. Czy możesz powiedzieć mi trochę więcej, żebym mógł lepiej Ci pomóc?';
        }
      } else {
        smartResponse = "I understand! That's an interesting topic. Could you tell me a bit more so I can help you better?";
      }

      return new Response(JSON.stringify({
        success: true,
        response: smartResponse,
        model: 'mybonzo-ai-smart-fallback',
        context: context,
        timestamp: new Date().toISOString(),
        confidence: 0.85,
        fallback: true
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

  } catch (error) {
    console.error('Advanced Chat API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
