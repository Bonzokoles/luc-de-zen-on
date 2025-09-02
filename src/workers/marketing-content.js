// Cloudflare Worker dla automatycznego generowania treści marketingowych
// Kompatybilny z Cloudflare AI Workers i modelami @cf/meta/llama-3.1-8b-instruct

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Obsługuje tylko POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }

  const url = new URL(request.url);
  
  // Endpoint do generowania treści marketingowych
  if (url.pathname === '/generate-marketing-content') {
    return await generateMarketingContent(request);
  }

  // Endpoint do generowania rekomendacji
  if (url.pathname === '/generate-recommendations') {
    return await generateRecommendations(request);
  }

  // Endpoint do kwalifikacji leadów
  if (url.pathname === '/qualify-lead') {
    return await qualifyLead(request);
  }

  return new Response('Not found', { 
    status: 404,
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}

async function generateMarketingContent(request) {
  try {
    const data = await request.json();
    const { prompt, contentType = 'post na social media' } = data;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Brak promptu' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // System message dla różnych typów treści
    const systemPrompts = {
      'post na social media': 'Jesteś ekspertem social media. Twórz angażujące posty z emotikonami i hashtagami.',
      'e-mail marketingowy': 'Jesteś ekspertem e-mail marketingu. Twórz profesjonalne e-maile z wyraźnym CTA.',
      'opis produktu': 'Jesteś copywriterem produktowym. Twórz przekonujące opisy podkreślające korzyści.'
    };

    const systemMessage = systemPrompts[contentType] || systemPrompts['post na social media'];
    
    const fullPrompt = `${systemMessage}\n\nTema: ${prompt}\n\nUtwórz ${contentType} w stylu dynamicznym, przystępnym, z zachęcającym do działania zakończeniem. Maksymalnie 300 słów.`;

    // Wywołanie Cloudflare AI
    const aiResponse = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Napisz ${contentType} na temat: ${prompt}. Użyj stylu: dynamiczny, przystępny, z CTA zachęcającym do działania.` }
      ],
      max_tokens: 500
    });

    return new Response(JSON.stringify({ 
      text: aiResponse.response || 'Błąd generowania treści',
      contentType,
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Błąd serwera: ' + error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function generateRecommendations(request) {
  try {
    const data = await request.json();
    const { preferences = '', history = '' } = data;

    const prompt = `Na podstawie preferencji użytkownika: "${preferences}" i historii: "${history}", zaproponuj 3 rekomendacje produktów/usług w formacie JSON:
    [
      {
        "title": "Nazwa produktu",
        "description": "Krótki opis dlaczego to pasuje",
        "category": "kategoria",
        "confidence": 0.95
      }
    ]
    Odpowiadaj tylko w formacie JSON, bez dodatkowego tekstu.`;

    const aiResponse = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'Jesteś ekspertem rekomendacji. Odpowiadaj tylko w formacie JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400
    });

    let recommendations;
    try {
      // Próba parsowania JSON z odpowiedzi AI
      const jsonMatch = aiResponse.response.match(/\[[\s\S]*\]/);
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      // Fallback jeśli AI nie zwróci poprawnego JSON
      recommendations = [
        {
          title: "Rekomendacja spersonalizowana",
          description: aiResponse.response || "Brak szczegółów",
          category: "ogólne",
          confidence: 0.8
        }
      ];
    }

    return new Response(JSON.stringify({ 
      recommendations,
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Błąd generowania rekomendacji: ' + error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function qualifyLead(request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ 
        error: 'Wszystkie pola są wymagane' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const prompt = `Jako asystent AI do kwalifikacji leadów, przeanalizuj następujące dane:
    Imię: ${name}
    Email: ${email}
    Wiadomość: ${message}
    
    Oceń wartość leadu (wysoka/średnia/niska), zasugeruj priorytet i napisz krótką, profesjonalną odpowiedź powitalną (max 150 słów) w serdecznym tonie, która zachęci do dalszej rozmowy.`;

    const aiResponse = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'Jesteś profesjonalnym asystentem kwalifikacji leadów. Odpowiadaj w przyjaznym, ale profesjonalnym tonie.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300
    });

    // Prosta analiza priorytetu na podstawie słów kluczowych
    const messageLower = message.toLowerCase();
    let priority = 'średni';
    let leadValue = 'średnia';

    if (messageLower.includes('pilne') || messageLower.includes('natychmiast') || messageLower.includes('budżet')) {
      priority = 'wysoki';
      leadValue = 'wysoka';
    } else if (messageLower.includes('może') || messageLower.includes('zastanawiam') || messageLower.includes('informacji')) {
      priority = 'niski';
      leadValue = 'niska';
    }

    return new Response(JSON.stringify({ 
      reply: aiResponse.response || 'Dziękujemy za kontakt. Wkrótce się odezwiemy!',
      priority,
      leadValue,
      timestamp: new Date().toISOString(),
      leadData: { name, email, message }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Błąd kwalifikacji leadu: ' + error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Obsługa CORS preflight requests
addEventListener('fetch', event => {
  if (event.request.method === 'OPTIONS') {
    event.respondWith(new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }));
  }
});
