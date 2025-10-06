globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, e as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_HpSis98d.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_DvEt2LDO.mjs';
import { I as InteractiveQuizWidget } from '../chunks/InteractiveQuizWidget_DUMqsukp.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$Astro = createAstro();
const $$Quiz = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Quiz;
  const id = Astro2.url.searchParams.get("id");
  let premadeQuiz = null;
  let error = null;
  try {
    const response = await fetch(`${Astro2.url.origin}/api/quiz?id=${id}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        premadeQuiz = data.quiz;
      } else {
        throw new Error(data.error || "Quiz not found.");
      }
    } else {
      throw new Error(`API Error: ${response.status}`);
    }
  } catch (e) {
    console.error("Failed to fetch pre-made quiz:", e);
    error = e.message;
  }
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": premadeQuiz ? premadeQuiz.title : "B\u0142\u0105d Quizu" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh relative z-10 pt-20" style="background-color: #0a0a0a;"> <div class="max-w-4xl mx-auto px-4 py-8"> <a href="/interactive-quizzes" class="text-cyan-400 hover:text-cyan-200 transition-colors duration-200">← Powrót do listy quizów</a> ${premadeQuiz && renderTemplate`<h1 class="text-3xl font-bold text-cyan-300 my-4">${premadeQuiz.title}</h1>`} ${error && renderTemplate`<div class="bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 font-mono p-4"> <h1 class="text-2xl font-bold mb-2">Błąd ładowania quizu</h1> <p>${error}</p> </div>`} ${premadeQuiz && renderTemplate`${renderComponent($$result2, "InteractiveQuizWidget", InteractiveQuizWidget, { "client:load": true, "premadeQuiz": premadeQuiz, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/InteractiveQuizWidget.svelte", "client:component-export": "default" })}`} </div> </main> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/quiz.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/quiz.astro";
const $$url = "/quiz";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Quiz,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
