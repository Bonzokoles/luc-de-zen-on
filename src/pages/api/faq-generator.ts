import type { APIRoute } from 'astro';
import { getApiKey } from '../../utils/loadEnv.js';

// In-memory "database" for demonstration purposes
const faqDatabase: any[] = [];

export const POST: APIRoute = async ({ request }) => {
  try {
    const { knowledgeBase, category = 'general', count = 5 } = await request.json();
    
    if (!knowledgeBase || knowledgeBase.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Knowledge base content is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Check for OpenAI API key
    const openaiApiKey = getApiKey('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      // Return mock FAQ when no API key is available
      const mockFAQ = [
        {
          question: 'Jak działa system generowania FAQ?',
          answer: 'System analizuje bazę wiedzy i automatycznie tworzy najczęściej zadawane pytania wraz z odpowiedziami używając zaawansowanych algorytmów AI.',
          category,
          priority: 1
        },
        {
          question: 'Czy FAQ jest aktualizowane automatycznie?',
          answer: 'Tak, system może automatycznie aktualizować FAQ na podstawie nowych treści i pytań użytkowników.',
          category,
          priority: 2
        },
        {
          question: 'Jakie są korzyści z dynamicznego FAQ?',
          answer: 'Dynamiczne FAQ zapewnia zawsze aktualne informacje, zmniejsza obciążenie wsparcia klienta i poprawia doświadczenie użytkowników.',
          category,
          priority: 3
        }
      ];
      
      const generatedFAQ = mockFAQ.slice(0, count).map(item => ({
        ...item,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));
      
      // Add to database
      faqDatabase.push(...generatedFAQ);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'FAQ generated successfully (using mock data - add OPENAI_API_KEY for AI generation)',
        faq: generatedFAQ,
        isDemo: true
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Use OpenAI API for real FAQ generation
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Jesteś ekspertem od tworzenia FAQ. Na podstawie podanej bazy wiedzy wygeneruj ${count} najważniejszych pytań i odpowiedzi w języku polskim. 
            
            Zwróć odpowiedź w formacie JSON z tablicą obiektów zawierających:
            - question: pytanie
            - answer: szczegółowa odpowiedź
            - priority: priorytet od 1 do 5 (1 = najważniejsze)
            
            Pytania powinny być praktyczne i często zadawane przez użytkowników.`
          },
          {
            role: 'user',
            content: `Baza wiedzy: ${knowledgeBase.substring(0, 3000)}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });
    
    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }
    
    const openaiData = await openaiResponse.json();
    const aiContent = openaiData.choices[0].message.content;
    
    let parsedFAQ;
    try {
      // Try to parse JSON from AI response
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedFAQ = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      // Fallback: extract questions and answers from text
      const lines = aiContent.split('\n').filter((line: string) => line.trim());
      parsedFAQ = [];
      
      for (let i = 0; i < lines.length - 1; i += 2) {
        if (lines[i].includes('?') && lines[i + 1]) {
          parsedFAQ.push({
            question: lines[i].replace(/^\d+\.\s*/, '').trim(),
            answer: lines[i + 1].trim(),
            priority: Math.ceil((i / 2) + 1)
          });
        }
      }
    }
    
    // Process and add to database
    const generatedFAQ = parsedFAQ.slice(0, count).map((item: any) => ({
      id: crypto.randomUUID(),
      question: item.question,
      answer: item.answer,
      category,
      priority: item.priority || 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));
    
    faqDatabase.push(...generatedFAQ);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'FAQ generated successfully using AI',
      faq: generatedFAQ,
      isDemo: false
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('FAQ Generation Error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: `Failed to generate FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const params = new URL(url).searchParams;
  const category = params.get('category');
  const limit = parseInt(params.get('limit') || '20');
  
  try {
    let filteredFAQ = faqDatabase;
    
    if (category) {
      filteredFAQ = faqDatabase.filter(item => item.category === category);
    }
    
    // Sort by priority and creation date
    const sortedFAQ = filteredFAQ
      .sort((a, b) => a.priority - b.priority || b.createdAt - a.createdAt)
      .slice(0, limit);
    
    // Calculate statistics
    const stats = {
      total: faqDatabase.length,
      categories: [...new Set(faqDatabase.map(item => item.category))],
      lastUpdated: Math.max(...faqDatabase.map(item => item.updatedAt)),
      averagePriority: faqDatabase.reduce((sum, item) => sum + item.priority, 0) / faqDatabase.length
    };
    
    return new Response(JSON.stringify({
      success: true,
      faq: sortedFAQ,
      stats
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to retrieve FAQ'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { id, ...updateData } = await request.json();
    
    const faqIndex = faqDatabase.findIndex(item => item.id === id);
    
    if (faqIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'FAQ item not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    faqDatabase[faqIndex] = {
      ...faqDatabase[faqIndex],
      ...updateData,
      updatedAt: Date.now()
    };
    
    return new Response(JSON.stringify({
      success: true,
      message: 'FAQ item updated successfully',
      faq: faqDatabase[faqIndex]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to update FAQ item'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  const params = new URL(url).searchParams;
  const id = params.get('id');
  
  if (!id) {
    return new Response(JSON.stringify({
      success: false,
      message: 'FAQ item ID is required'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  try {
    const faqIndex = faqDatabase.findIndex(item => item.id === id);
    
    if (faqIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'FAQ item not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    faqDatabase.splice(faqIndex, 1);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'FAQ item deleted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to delete FAQ item'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
