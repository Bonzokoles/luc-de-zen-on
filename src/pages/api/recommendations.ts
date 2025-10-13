import type { APIRoute } from "astro";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/corsUtils";

// --- Symulowana Baza Danych ---

// 1. Profile Użytkowników
const userProfiles = {
  user_tech: {
    id: "user_tech",
    name: "Karol (Tech Enthusiast)",
    interests: ["AI", "Cloud Computing", "DevOps", "JavaScript Frameworks"],
    recentActivity: [
      "Viewed: Azure DevOps Premium",
      "Searched: Kubernetes course",
    ],
    segment: "Technology Professional",
  },
  user_travel: {
    id: "user_travel",
    name: "Anna (Travel Blogger)",
    interests: [
      "Luxury Travel",
      "Southeast Asia",
      "Adventure Sports",
      "Photography",
    ],
    recentActivity: [
      "Viewed: Bali Luxury Villa",
      "Searched: Best cameras for vlogging",
    ],
    segment: "Lifestyle & Travel",
  },
  user_business: {
    id: "user_business",
    name: "Piotr (Small Business Owner)",
    interests: [
      "Marketing Automation",
      "CRM",
      "E-commerce",
      "Financial Planning",
    ],
    recentActivity: [
      "Viewed: HubSpot Integration",
      "Searched: Small business accounting software",
    ],
    segment: "Business & Entrepreneurship",
  },
};

// 2. Katalog Produktów/Usług
const productCatalog = [
  {
    id: "prod_01",
    name: "Azure DevOps Premium",
    category: "DevOps",
    description: "Zaawansowane narzędzia CI/CD dla zespołów enterprise.",
  },
  {
    id: "prod_02",
    name: "OpenAI API Credits",
    category: "AI",
    description: "Dostęp do API GPT-4 do zaawansowanych integracji AI.",
  },
  {
    id: "prod_03",
    name: "Kubernetes Mastery Course",
    category: "DevOps",
    description: "Kompletny kurs orkiestracji kontenerów.",
  },
  {
    id: "prod_04",
    name: "Bali Luxury Villa Rental",
    category: "Travel",
    description: "Wynajem luksusowej willi na Bali z prywatnym basenem.",
  },
  {
    id: "prod_05",
    name: "Sony Alpha a7 IV",
    category: "Photography",
    description: "Profesjonalny aparat do fotografii i vlogowania.",
  },
  {
    id: "prod_06",
    name: "HubSpot CRM Integration",
    category: "Business",
    description: "Pełna integracja i automatyzacja z HubSpot CRM.",
  },
  {
    id: "prod_07",
    name: "Advanced Prompt Engineering Course",
    category: "AI",
    description:
      "Kurs zaawansowanego tworzenia promptów dla modeli językowych.",
  },
  {
    id: "prod_08",
    name: "SaaS Financial Modeling Template",
    category: "Business",
    description: "Szablon do modelowania finansowego dla firm SaaS.",
  },
];

// --- Logika API ---

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  // Jeśli brak userId, zwróć listę dostępnych użytkowników do wyboru
  if (!userId) {
    const userList = Object.values(userProfiles).map((u) => ({
      id: u.id,
      name: u.name,
    }));
    return createSuccessResponse({ availableUsers: userList });
  }

  // Sprawdź, czy użytkownik istnieje
  const userProfile = userProfiles[userId as keyof typeof userProfiles];
  if (!userProfile) {
    return createErrorResponse("Użytkownik nie znaleziony", 404);
  }

  try {
    const env = (locals as any)?.runtime?.env;
    if (!env || !env.AI) {
      return createErrorResponse("Środowisko AI nie jest dostępne.", 503);
    }

    // Stworzenie promptu dla AI
    const prompt = `
      Jesteś silnikiem rekomendacyjnym dla platformy MyBonzo.
      Twoim zadaniem jest przeanalizowanie profilu użytkownika i katalogu produktów, a następnie zarekomendowanie 3 najbardziej trafnych produktów.
      Dla każdej rekomendacji podaj krótki (jedno zdanie) powód, dlaczego ten produkt pasuje do użytkownika.

      PROFIL UŻYTKOWNIKA:
      - Zainteresowania: ${userProfile.interests.join(", ")}
      - Ostatnia aktywność: ${userProfile.recentActivity.join(", ")}
      - Segment: ${userProfile.segment}

      KATALOG PRODUKTÓW (id, nazwa, kategoria, opis):
      ${productCatalog
        .map((p) => `- ${p.id}, ${p.name}, ${p.category}, ${p.description}`)
        .join("\n")}

      Zwróć odpowiedź w formacie JSON, jako tablicę obiektów o strukturze: { "productId": "id_produktu", "reason": "powód rekomendacji" }. Nie dodawaj żadnych dodatkowych opisów ani wstępów, tylko czysty JSON.
    `;

    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" }, // Poproś o odpowiedź w formacie JSON
    });

    // Przetwarzanie odpowiedzi AI
    let recommendations: any[] = [];
    if (aiResponse.response) {
      try {
        // Llama może zwrócić JSON wewnątrz bloku kodu markdown
        const cleanedResponse = aiResponse.response.replace(
          /```json\n|\n```/g,
          ""
        );
        const parsedJson = JSON.parse(cleanedResponse);
        // Spodziewamy się, że klucz w JSON to np. 'recommendations'
        const recommendationsArray =
          parsedJson.recommendations || parsedJson.products || parsedJson;

        if (Array.isArray(recommendationsArray)) {
          recommendations = recommendationsArray
            .map((rec) => {
              const product = productCatalog.find(
                (p) => p.id === rec.productId
              );
              return product ? { ...product, reason: rec.reason } : null;
            })
            .filter(Boolean); // Usuń nulle, jeśli produkt nie został znaleziony
        }
      } catch (e) {
        console.error("Błąd parsowania JSON od AI:", e);
        // Fallback - jeśli AI nie zwróci poprawnego JSON, nie będzie rekomendacji
      }
    }

    return createSuccessResponse({
      userProfile,
      recommendations,
    });
  } catch (error) {
    console.error("Błąd w /api/recommendations:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Nieznany błąd serwera.";
    return createErrorResponse(errorMessage, 500);
  }
};
