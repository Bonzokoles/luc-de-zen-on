import type { APIRoute } from 'astro';
import { getApiKey } from '../../utils/loadEnv.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { question, selectedAnswer, correctAnswer, isCorrect, topic, difficulty } = await request.json();
    
    if (!question || !selectedAnswer || !correctAnswer) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load OpenAI API key
    const openaiKey = getApiKey('OPENAI_API_KEY');

    const systemPrompt = `Jesteś ekspertem edukacyjnym tworzącym spersonalizowane feedback dla uczących się.
    Analizujesz odpowiedzi na pytania quizowe i dajesz konstruktywne komentarze.
    
    ZASADY FEEDBACK:
    - Dla poprawnych odpowiedzi: pozytywne wzmocnienie + dodatkowa ciekawostka/kontekst
    - Dla błędnych odpowiedzi: wyjaśnij dlaczego odpowiedź była błędna, podaj poprawną odpowiedź z wyjaśnieniem
    - Zachowaj pozytywny, motywujący ton
    - Dodaj praktyczne porady lub przykłady
    - Maksymalnie 2-3 zdania
    - Używaj emoji do ozdobienia`;

    const userPrompt = `
    PYTANIE: ${question}
    WYBRANA ODPOWIEDŹ: ${selectedAnswer}
    POPRAWNA ODPOWIEDŹ: ${correctAnswer}
    CZY POPRAWNA: ${isCorrect ? 'TAK' : 'NIE'}
    TEMAT: ${topic}
    POZIOM: ${difficulty}
    
    Wygeneruj spersonalizowane feedback dla tej odpowiedzi.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: userPrompt 
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      
      // Fallback feedback
      const fallbackFeedback = isCorrect 
        ? `✅ Świetnie! Poprawna odpowiedź. ${correctAnswer} to rzeczywiście właściwy wybór.`
        : `❌ Niepoprawnie. Prawidłowa odpowiedź to: ${correctAnswer}. Spróbuj ponownie w kolejnym pytaniu!`;
      
      return new Response(JSON.stringify({ 
        feedback: fallbackFeedback 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const feedback = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      feedback: feedback.trim()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Quiz feedback API error:', error);
    
    // Fallback feedback on error
    const { isCorrect, correctAnswer } = await request.json().catch(() => ({ isCorrect: false, correctAnswer: 'N/A' }));
    const fallbackFeedback = isCorrect 
      ? '✅ Poprawna odpowiedź! Świetna robota!'
      : `❌ Niepoprawnie. Spróbuj ponownie!`;
    
    return new Response(JSON.stringify({ 
      feedback: fallbackFeedback
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
