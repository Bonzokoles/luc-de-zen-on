import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { message, chain_type = 'conversation', options = {} } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'Message is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Access Cloudflare runtime environment
    const runtime = (locals as any)?.runtime;
    const DEEPSEEK_API_KEY = runtime?.env?.DEEPSEEK_API_KEY;
    
    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({
        status: 'error',
        error: 'API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // LangChain-style processing using DeepSeek
    const systemPrompt = getLangChainSystemPrompt(chain_type);
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Brak odpowiedzi';

    return new Response(JSON.stringify({
      status: 'success',
      data: {
        response: aiResponse,
        chain_type,
        processing_time: Date.now(),
        model: 'deepseek-chat',
        langchain_integration: true
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('LangChain API Error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function getLangChainSystemPrompt(chainType: string): string {
  const prompts = {
    conversation: `Jesteś zaawansowanym asystentem AI zintegrowanym z LangChain. 
    Prowadź naturalną konwersację, wykorzystując kontekst poprzednich wiadomości.
    Odpowiadaj precyzyjnie w języku polskim, zachowując ciągłość rozmowy.`,
    
    summarization: `Jesteś ekspertem w podsumowywaniu tekstów wykorzystującym LangChain.
    Tworzysz zwięzłe, precyzyjne podsumowania zachowując kluczowe informacje.
    Strukturyzuj odpowiedzi w punktach gdy to wskazane.`,
    
    qa: `Jesteś systemem Q&A opartym na LangChain.
    Analizujesz pytania i udzielasz dokładnych odpowiedzi na podstawie dostępnej wiedzy.
    Jeśli nie masz pewności, jasno to komunikuj.`,
    
    code_analysis: `Jesteś ekspertem analizy kodu z integracją LangChain.
    Analizujesz kod, wykrywasz problemy, sugerujesz ulepszenia.
    Wyjaśniaj decyzje i podawaj konkretne przykłady.`,
    
    document_qa: `Jesteś systemem do analizy dokumentów z LangChain.
    Przetwarzasz dokumenty i odpowiadasz na pytania na ich podstawie.
    Podawaj źródła i cytuj fragmenty gdy to potrzebne.`
  };

  return prompts[chainType as keyof typeof prompts] || prompts.conversation;
}