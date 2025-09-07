import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message, phone, company, budget } = await request.json();
    
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize OpenAI with API key from environment
    const openai = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY,
    });

    const leadData = {
      name,
      email,
      message,
      phone: phone || 'nie podano',
      company: company || 'nie podano',
      budget: budget || 'nie określono'
    };

    const systemMessage = {
      role: "system" as const,
      content: "Jesteś asystentem AI do kwalifikacji leadów. Oceń wartość leadu (WYSOKI, ŚREDNI, NISKI), określ priorytet (1-5) i napisz profesjonalną, ale serdeczną odpowiedź powitalną (maksymalnie 150 słów). Zwróć odpowiedź w formacie JSON."
    };

    const userMessage = {
      role: "user" as const,
      content: `Oceń lead na podstawie danych: ${JSON.stringify(leadData)}. 
      
      Zwróć odpowiedź w formacie JSON:
      {
        "leadScore": "WYSOKI/ŚREDNI/NISKI",
        "priority": 1-5,
        "category": "kategoria leadu",
        "reply": "Odpowiedź powitalna dla klienta",
        "internalNotes": "Notatki wewnętrzne dla zespołu sprzedaży",
        "suggestedAction": "Sugerowane następne kroki"
      }
      
      Napisz odpowiedź w profesjonalnym, ale serdecznym tonie, zachęcającym do dalszej rozmowy.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, userMessage],
      max_tokens: 600,
      temperature: 0.6,
    });

    const generatedText = response.choices[0].message.content;
    
    // Try to parse the JSON response
    let leadAnalysis;
    try {
      leadAnalysis = JSON.parse(generatedText || '{}');
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      leadAnalysis = {
        leadScore: "ŚREDNI",
        priority: 3,
        category: "ogólne zapytanie",
        reply: generatedText || "Dziękujemy za kontakt! Skontaktujemy się z Państwem wkrótce.",
        internalNotes: "Lead wymaga ręcznej weryfikacji",
        suggestedAction: "Kontakt telefoniczny w ciągu 24h"
      };
    }

    // Store lead data (in real application, this would go to database/CRM)
    const leadRecord = {
      ...leadData,
      ...leadAnalysis,
      timestamp: new Date().toISOString(),
      status: 'NEW'
    };

    // Here you could integrate with ActivePieces or CRM system
    console.log('New lead processed:', leadRecord);

    return new Response(JSON.stringify({ 
      success: true,
      reply: leadAnalysis.reply,
      leadScore: leadAnalysis.leadScore,
      priority: leadAnalysis.priority,
      category: leadAnalysis.category,
      suggestedAction: leadAnalysis.suggestedAction,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error qualifying lead:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process lead qualification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
