import type { APIRoute } from 'astro';
import { getApiKey } from '../../utils/loadEnv.js';

type TopicKey = 'programming' | 'design' | 'data-science' | 'marketing' | 'business' | 'ai';
type DifficultyKey = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { topic, difficulty, questionCount = 5 } = await request.json();
    
    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load OpenAI API key
    const openaiKey = getApiKey('OPENAI_API_KEY');

    const topicPrompts: Record<TopicKey, string> = {
      'programming': 'JavaScript, Python, React, Node.js, algorytmy, struktury danych, najlepsze praktyki programistyczne',
      'design': 'UI/UX design, design thinking, prototyping, user research, zasady designu, dostępność',
      'data-science': 'Machine learning, statystyka, Python dla data science, R, wizualizacja danych, analiza danych',
      'marketing': 'Digital marketing, SEO, content marketing, social media, analityka marketingowa, kampanie reklamowe',
      'business': 'Zarządzanie, finanse, strategia biznesowa, leadership, komunikacja biznesowa, procesy biznesowe',
      'ai': 'Sztuczna inteligencja, machine learning, deep learning, sieci neuronowe, NLP, computer vision'
    };

    const difficultyPrompts: Record<DifficultyKey, string> = {
      'beginner': 'podstawowe pytania wprowadzające, proste definicje i pojęcia',
      'intermediate': 'pytania wymagające analizy i zrozumienia konceptów',
      'advanced': 'kompleksowe scenariusze i zaawansowane zagadnienia',
      'expert': 'najwyższy poziom trudności, ekspertkie zagadnienia i przypadki brzegowe'
    };

    const systemPrompt = `Jesteś ekspertem w tworzeniu interaktywnych quizów edukacyjnych. 
    Twórz pytania o ${topicPrompts[topic as TopicKey] || topic} na poziomie ${difficultyPrompts[difficulty as DifficultyKey] || difficulty}.

    ZASADY:
    - Każde pytanie musi mieć dokładnie 4 opcje odpowiedzi (A, B, C, D)
    - Tylko jedna odpowiedź jest poprawna
    - Dodaj krótkie wyjaśnienie dla każdego pytania
    - Pytania mają być praktyczne i aplikacyjne
    - Unikaj pytań typu "trick question"
    - Odpowiedzi mają być różnorodne i prawdopodobne

    FORMAT ODPOWIEDZI (JSON):
    {
      "questions": [
        {
          "question": "Treść pytania?",
          "answers": ["Opcja A", "Opcja B", "Opcja C", "Opcja D"],
          "correctAnswer": "Opcja A",
          "explanation": "Krótkie wyjaśnienie dlaczego ta odpowiedź jest poprawna"
        }
      ]
    }`;

    const userPrompt = `Wygeneruj ${questionCount} pytań quizowych z dziedziny: ${topicPrompts[topic as TopicKey] || topic}.
    Poziom trudności: ${difficultyPrompts[difficulty as DifficultyKey] || difficulty}.
    
    Pytania mają być zróżnicowane, obejmować różne aspekty tematu i być praktyczne.`;

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
        max_tokens: 2000,
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: `OpenAI API error: ${error}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const quizContent = data.choices[0].message.content;
    
    let quiz;
    try {
      quiz = JSON.parse(quizContent);
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      return new Response(JSON.stringify({ error: 'Failed to generate valid quiz format' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate quiz structure
    if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid quiz format: missing questions' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate each question
    for (const question of quiz.questions) {
      if (!question.question || !question.answers || !Array.isArray(question.answers) || 
          question.answers.length !== 4 || !question.correctAnswer || !question.explanation) {
        return new Response(JSON.stringify({ error: 'Invalid question format' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ 
      quiz,
      metadata: {
        topic,
        difficulty,
        questionCount: quiz.questions.length,
        generatedAt: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Quiz API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error while generating quiz' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
