globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_HpSis98d.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_BwiF4hL0.mjs';
import { I as InteractiveQuizWidget } from '../chunks/InteractiveQuizWidget_DUMqsukp.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_D_xeYX_3.mjs';

const $$QuizNew = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Nowy Quiz AI | Kreator" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh relative z-10 pt-20" style="background-color: #0a0a0a;"> <div class="max-w-4xl mx-auto px-4 py-8"> <a href="/interactive-quizzes" class="text-cyan-400 hover:text-cyan-200 transition-colors duration-200">← Powrót do centrum quizów</a> <h1 class="text-3xl font-bold text-cyan-300 my-4">Kreator Quizów AI</h1> <p class="text-gray-400 mb-8">Wybierz temat i poziom trudności, a nasz system AI wygeneruje dla Ciebie unikalny quiz.</p> ${renderComponent($$result2, "InteractiveQuizWidget", InteractiveQuizWidget, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/InteractiveQuizWidget.svelte", "client:component-export": "default" })} </div> </main> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/quiz-new.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/quiz-new.astro";
const $$url = "/quiz-new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$QuizNew,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
