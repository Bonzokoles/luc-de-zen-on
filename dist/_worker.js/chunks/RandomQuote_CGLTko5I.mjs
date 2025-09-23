globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, g as addAttribute, a as renderTemplate } from './astro/server_BDhFni3J.mjs';
/* empty css                         */

const $$RandomQuote = createComponent(($$result, $$props, $$slots) => {
  const quotes = [
    {
      text: "The unexamined life is not worth living.",
      author: "Socrates",
      source: "https://en.wikipedia.org/wiki/Socrates"
    },
    {
      text: "I think, therefore I am.",
      author: "Ren\u0102\xA9 Descartes",
      source: "https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes"
    },
    {
      text: "Man is condemned to be free.",
      author: "Jean-Paul Sartre",
      source: "https://en.wikipedia.org/wiki/Jean-Paul_Sartre"
    },
    {
      text: "Two possibilities exist: either we are alone in the Universe or we are not. Both are equally terrifying.",
      author: "Arthur C. Clarke",
      source: "https://en.wikipedia.org/wiki/Arthur_C._Clarke"
    },
    {
      text: "To, co mnie nie zabije, czyni mnie silniejszym.",
      author: "Friedrich Nietzsche",
      source: "https://en.wikipedia.org/wiki/Friedrich_Nietzsche"
    },
    {
      text: "Granice mojego j\xC4\u2122zyka s\xC4\u2026 granicami mojego \u0139\u203Awiata.",
      author: "Ludwig Wittgenstein",
      source: "https://en.wikipedia.org/wiki/Ludwig_Wittgenstein"
    },
    {
      text: "Science fiction is a laboratory for ideas about the future.",
      author: "Isaac Asimov",
      source: "https://en.wikipedia.org/wiki/Isaac_Asimov"
    },
    {
      text: "Cz\u0139\u201Aowiek jest tym, czym s\xC4\u2026 jego decyzje.",
      author: "Frank Herbert (Dune)",
      source: "https://en.wikipedia.org/wiki/Dune_(novel)"
    }
  ];
  const currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return renderTemplate`${maybeRenderHead()}<div class="rq-container" data-astro-cid-q65ond43> ${currentQuote.source ? renderTemplate`<a class="rq-quote" target="_blank" rel="noopener"${addAttribute(currentQuote.source, "href")} data-astro-cid-q65ond43>
"${currentQuote.text}" <span class="rq-author" data-astro-cid-q65ond43>â€” ${currentQuote.author}</span> </a>` : renderTemplate`<div class="rq-quote" data-astro-cid-q65ond43>
"${currentQuote.text}" <span class="rq-author" data-astro-cid-q65ond43>â€” ${currentQuote.author}</span> </div>`} </div> `;
}, "Q:/mybonzo/luc-de-zen-on/src/components/RandomQuote.astro", void 0);

export { $$RandomQuote as $ };
