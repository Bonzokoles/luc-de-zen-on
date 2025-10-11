
import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// --- Symulowana Baza Danych ---
const courseCatalog = [
  { id: 'js_adv', name: 'Advanced JavaScript Patterns', category: 'Frontend', level: 'advanced', description: 'Głębokie zanurzenie w zaawansowane wzorce projektowe i techniki w JavaScript.' },
  { id: 'ml_fun', name: 'Machine Learning Fundamentals', category: 'AI', level: 'beginner', description: 'Podstawy uczenia maszynowego, od regresji po proste sieci neuronowe.' },
  { id: 'k8s_mastery', name: 'Kubernetes Mastery', category: 'DevOps', level: 'advanced', description: 'Kompletny kurs orkiestracji kontenerów dla profesjonalistów.' },
  { id: 'react_basics', name: 'React for Beginners', category: 'Frontend', level: 'beginner', description: 'Zbuduj swoją pierwszą interaktywną aplikację w React.' },
  { id: 'python_ds', name: 'Data Science with Python', category: 'AI', level: 'intermediate', description: 'Praktyczne wykorzystanie bibliotek Pandas, NumPy i Scikit-learn.' },
  { id: 'node_backend', name: 'Node.js Backend Development', category: 'Backend', level: 'intermediate', description: 'Tworzenie wydajnych i skalowalnych aplikacji serwerowych w Node.js.' },
  { id: 'css_grid', name: 'CSS Grid & Flexbox', category: 'Frontend', level: 'beginner', description: 'Opanuj nowoczesne techniki layoutu w CSS.' },
  { id: 'prompt_eng', name: 'AI Prompt Engineering', category: 'AI', level: 'intermediate', description: 'Naucz się tworzyć efektywne prompty dla modeli językowych.' },
];

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    const { skillLevel, interests } = await request.json();

    if (!skillLevel || !interests || !Array.isArray(interests) || interests.length === 0) {
      return createErrorResponse("Poziom umiejętności i zainteresowania są wymagane.", 400);
    }

    const systemPrompt = `
      Jesteś doradcą edukacyjnym AI. Twoim zadaniem jest zarekomendowanie 3 kursów z poniższego katalogu, które najlepiej pasują do profilu użytkownika.
      Dla każdej rekomendacji podaj krótki (jedno zdanie) powód, dlaczego ten kurs jest dobrym wyborem.

      PROFIL UŻYTKOWNIKA:
      - Poziom zaawansowania: ${skillLevel}
      - Zainteresowania: ${interests.join(', ')}

      KATALOG KURSÓW (id, nazwa, kategoria, poziom, opis):
      ${courseCatalog.map(c => `- ${c.id}, ${c.name}, ${c.category}, ${c.level}, ${c.description}`).join('\n')}

      Zwróć odpowiedź w formacie JSON, jako obiekt z kluczem "recommendations", który zawiera tablicę 3 obiektów. Każdy obiekt musi mieć klucze: "courseId" i "reason".
      Przykład: { "recommendations": [{"courseId": "js_adv", "reason": "To idealny następny krok..."}] }
      Nie dodawaj żadnych dodatkowych opisów ani wstępów, tylko czysty obiekt JSON.
    `;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "system", content: systemPrompt }],
      response_format: { type: "json_object" },
    });

    const cleanedResponse = aiResponse.response.replace(/```json\n|\n```/g, '');
    const result = JSON.parse(cleanedResponse);

    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      return createErrorResponse("AI zwróciło nieprawidłowy format danych.", 500);
    }

    // Połącz wyniki AI z pełnymi danymi kursów
    const populatedRecommendations = result.recommendations.map(rec => {
        const course = courseCatalog.find(c => c.id === rec.courseId);
        return course ? { ...course, reason: rec.reason } : null;
    }).filter(Boolean);

    return createSuccessResponse({ recommendations: populatedRecommendations });

  } catch (error) {
    console.error("Błąd w /api/education-recommendations:", error);
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
