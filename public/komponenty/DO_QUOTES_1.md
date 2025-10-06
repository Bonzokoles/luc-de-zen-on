Obecny komponent RandomQuote.astro możesz znacznie rozbudować, by dodać:
- wiele nowych inspirujących cytatów (filozofia, sztuka, sci-fi, literatura) wraz z **linkami** do źródeł/biografii/filmów/opracowań – kliknięcie cytatu prowadzi do odpowiedniej strony,
- “ciekawostkę dnia” – fakt historyczny związany z bieżącą datą (np. „4 września: Los Angeles zostało założone w 1781”).[1][2][3]

***

## Przykładowa rozbudowana lista cytatów (z linkami):

```js
const quotes = [
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    source: "https://en.wikipedia.org/wiki/Socrates"
  },
  {
    text: "I think, therefore I am.",
    author: "René Descartes",
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
    text: "Granice mojego języka są granicami mojego świata.",
    author: "Ludwig Wittgenstein",
    source: "https://en.wikipedia.org/wiki/Ludwig_Wittgenstein"
  },
  {
    text: "Nie wolno się bać zmian, bo one tworzą przyszłość.",
    author: "Blade Runner (film)",
    source: "https://www.imdb.com/title/tt0083658/"
  },
  {
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    author: "Albert Einstein",
    source: "https://en.wikipedia.org/wiki/Albert_Einstein"
  },
  {
    text: "Science fiction writers foresee the inevitable, and although problems and catastrophes may be inevitable, solutions are not.",
    author: "Isaac Asimov",
    source: "https://en.wikipedia.org/wiki/Isaac_Asimov"
  },
  {
    text: "Człowiek jest tym, czym są jego decyzje.",
    author: "Frank Herbert (Dune)",
    source: "https://en.wikipedia.org/wiki/Dune_(novel)"
  }
];
const currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
```

**W Astro**, renderuj cytat i autora jako link:
```astro
<a target="_blank" rel="noopener" href={currentQuote.source}>
  “{currentQuote.text}”<br/>
  <span>- {currentQuote.author}</span>
</a>
```

***

## “Tego dnia w historii” – ciekawostka

**Przykład dla 4 września:**
- “1781 – Założono miasto Los Angeles.”[2][3]
- “1886 – Geronimo, legendarny wódz Apaczów, poddał się wojskom USA.”[3][1]

**Pozyskiwanie aktualnej daty w Astro/JS:**
```js
const today = new Date();
const month = today.getMonth() + 1;
const day = today.getDate();
const dateString = `${month}-${day}`;

// Słownik ciekawostek do wyświetlenia
const facts = {
  "9-4": [
    "1781 – Założono miasto Los Angeles.",
    "1886 – Geronimo, legendarny wódz Apaczów, poddał się wojskom USA."
  ]
};
const todayFacts = facts[`${month}-${day}`] || [];
```
**W renderze:**
```astro
{todayFacts.length > 0 &&
  <div>
    <strong>Dziś w historii:</strong>
    <ul>
      {todayFacts.map(f => <li>{f}</li>)}
    </ul>
  </div>
}
```

***

## Szybkie źródła, inspiracje i ciekawostki:
- Cytaty: [Famous Philosophy Quotes](https://www.philosophybasics.com/general_quotes.html), [Science Fiction Quotes - Goodreads](https://www.goodreads.com/quotes/tag/science-fiction), [100 Stoic Quotes](https://orionphilosophy.com/stoic-quotes/)[4][5][6]
- Fakty dnia: [Pop Culture History - Sep 4](https://popculturemadness.com/september-4-in-pop-culture-history/), [On-this-day - Sep 4](https://on-this-day.com/onthisday/thedays/alldays/sep04.htm)[2][3]

***

**Podsumowanie:**  
Po rozbudowie Twój komponent może wyświetlać losowy cytat (z podlinkowaniem do źródła i autora) oraz, jeśli jest ciekawostka dnia – jednocześnie interesujący historyczny fakt związany z aktualną datą.[1][3][2]

[1](https://thisday.thefamouspeople.com/4th-september.php)
[2](https://popculturemadness.com/september-4-in-pop-culture-history/)
[3](https://on-this-day.com/onthisday/thedays/alldays/sep04.htm)
[4](https://www.philosophybasics.com/general_quotes.html)
[5](https://orionphilosophy.com/stoic-quotes/)
[6](https://www.goodreads.com/quotes/tag/science-fiction)
[7](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/92027992/1302a47a-5bc2-4871-b536-a83fb8f1e287/RandomQuote.astro)
[8](https://www.goodreads.com/quotes/tag/philosophy)
[9](https://www.spiritedearthling.com/quotes-and-words/81-great-quotes-from-famous-philosophers-and-inspiring-thinkers)
[10](https://reflectionsbyken.wordpress.com/2018/02/27/philosophys-most-famous-quotations-part-1/)
[11](https://www.campion.edu.au/blog/world-philosophy-day-10-quotes-to-kick-start-your-intellectual-enquiry/)
[12](https://www.reddit.com/r/printSF/comments/17e2mij/scifi_quotes_that_have_stuck_with_you/)
[13](https://jlstowers.com/quotes-by-science-fiction-authors/)
