globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_BJuaHVI9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_ChtfEq-M.mjs';
=======
import { c as createOPTIONSHandler } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DzCkhAcZ.mjs';
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7

const GET = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "machine learning";
    const env = locals.runtime?.env;
    const kaggleUsername = env?.KAGGLE_USERNAME;
    const kaggleKey = env?.KAGGLE_KEY;
    if (!kaggleUsername || !kaggleKey) {
      return new Response(JSON.stringify({
        status: "error",
        service: "Kaggle API",
        error: "Kaggle API nie jest skonfigurowane",
        message: "Brak wymaganych zmiennych środowiskowych: KAGGLE_USERNAME i KAGGLE_KEY",
        required_config: ["KAGGLE_USERNAME", "KAGGLE_KEY"],
        search_query: search,
        note: "Uzyskaj dane uwierzytelniające z https://www.kaggle.com/settings/account"
      }), {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    return new Response(JSON.stringify({
      status: "error",
      service: "Kaggle API",
      error: "Implementacja Kaggle API wymaga bibliotek klienta",
      message: "Prawdziwe wyszukiwanie datasetów wymaga implementacji Kaggle API client library",
      search_query: search,
      note: "Zaimplementuj prawdziwe połączenie z Kaggle API dla pełnej funkcjonalności"
    }), {
      status: 501,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      service: "Kaggle",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { action, dataset_ref } = body;
    const env = locals.runtime?.env;
    const kaggleUsername = env?.KAGGLE_USERNAME;
    const kaggleKey = env?.KAGGLE_KEY;
    if (!kaggleUsername || !kaggleKey) {
      return new Response(JSON.stringify({
        status: "error",
        service: "Kaggle API",
        error: "Kaggle API nie jest skonfigurowane",
        message: "Brak wymaganych zmiennych środowiskowych: KAGGLE_USERNAME i KAGGLE_KEY",
        required_config: ["KAGGLE_USERNAME", "KAGGLE_KEY"],
        action,
        dataset_ref
      }), {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    return new Response(JSON.stringify({
      status: "error",
      service: "Kaggle API",
      error: "Implementacja Kaggle API wymaga bibliotek klienta",
      message: "Prawdziwe operacje Kaggle wymagają implementacji Kaggle API client library",
      action,
      dataset_ref,
      available_actions: ["download_dataset", "list_competitions", "submit_competition"],
      note: "Zaimplementuj prawdziwe połączenie z Kaggle API dla pełnej funkcjonalności"
    }), {
      status: 501,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      service: "Kaggle",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const OPTIONS = createOPTIONSHandler(["GET", "POST", "OPTIONS"]);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
