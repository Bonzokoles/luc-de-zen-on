globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { e as createAstro, c as createComponent, m as maybeRenderHead, g as addAttribute, an as renderSlot, a as renderTemplate, b as renderScript, r as renderComponent } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$UniversalPageLayout } from '../chunks/UniversalPageLayout_ChsqH4EH.mjs';
/* empty css                                           */
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_BgZWjcZU.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

const $$Astro$2 = createAstro("https://mybonzo.com");
const $$ThreePaneAI = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ThreePaneAI;
  const { pageTitle, pageDescription, dense = false, fullHeight = false, glass = true, gap = "gap-6" } = Astro2.props;
  const panelBase = `rounded-lg ${glass ? "bg-black/60 backdrop-blur-xl border border-cyan-500/20" : ""}`;
  const pad = dense ? "p-4" : "p-6";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`three-pane-wrapper w-full ${fullHeight ? "min-h-[70vh]" : ""}`, "class")} data-astro-cid-b5vdhurh> ${pageTitle && renderTemplate`<header class="mb-6 text-center" data-astro-cid-b5vdhurh> <h2 class="text-3xl font-bold tracking-wide text-cyan-400" data-astro-cid-b5vdhurh>${pageTitle}</h2> ${pageDescription && renderTemplate`<p class="mt-1 text-gray-300 text-sm" data-astro-cid-b5vdhurh>${pageDescription}</p>`} </header>`} <div${addAttribute(`grid grid-cols-1 xl:grid-cols-12 ${gap}`, "class")} data-astro-cid-b5vdhurh> <div${addAttribute(`xl:col-span-3 mb-6 xl:mb-0`, "class")} data-astro-cid-b5vdhurh> <div${addAttribute(`${panelBase} ${pad} h-full`, "class")} data-astro-cid-b5vdhurh> ${renderSlot($$result, $$slots["left"])} </div> </div> <div class="xl:col-span-6 mb-6 xl:mb-0" data-astro-cid-b5vdhurh> <div${addAttribute(`${panelBase} ${pad} h-full`, "class")} data-astro-cid-b5vdhurh> ${renderSlot($$result, $$slots["center"])} </div> </div> <div class="xl:col-span-3" data-astro-cid-b5vdhurh> <div${addAttribute(`${panelBase} ${pad} h-full`, "class")} data-astro-cid-b5vdhurh> ${renderSlot($$result, $$slots["right"])} </div> </div> </div> </div> `;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/ThreePaneAI.astro", void 0);

const $$Astro$1 = createAstro("https://mybonzo.com");
const $$PromptEnhancerModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PromptEnhancerModal;
  return renderTemplate`${maybeRenderHead()}<div id="promptEnhancerModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm hidden z-50" onclick="closePromptEnhancer(event)" data-astro-cid-fxmmjtho> <div class="flex items-center justify-center min-h-screen p-4" data-astro-cid-fxmmjtho> <div class="bg-black/90 border border-cyan-400/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto cyber-grid" onclick="event.stopPropagation()" data-astro-cid-fxmmjtho> <div class="p-6" data-astro-cid-fxmmjtho> <div class="flex items-center justify-between mb-4" data-astro-cid-fxmmjtho> <h2 class="text-2xl font-bold text-cyan-400" data-astro-cid-fxmmjtho>đźŽ¨ Prompt Enhancer</h2> <button onclick="closePromptEnhancer()" class="text-gray-400 hover:text-white text-2xl" data-astro-cid-fxmmjtho>Ă—</button> </div> <!-- Enhanced Prompt Input --> <div class="mb-6" data-astro-cid-fxmmjtho> <label class="block text-lg font-semibold text-primary-foreground mb-2" data-astro-cid-fxmmjtho>
Ulepszony prompt:
</label> <textarea id="enhancedPromptArea" rows="4" class="w-full p-3 border border-edge rounded text-primary-foreground placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none" style="background: rgba(0,0,0,0.5);" placeholder="Tutaj pojawi siÄ™ ulepszony prompt..." data-astro-cid-fxmmjtho></textarea> </div> <!-- Enhancement Options --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-astro-cid-fxmmjtho> <!-- Quick Actions --> <div data-astro-cid-fxmmjtho> <h3 class="text-lg font-semibold text-cyan-400 mb-3" data-astro-cid-fxmmjtho>âšˇ Szybkie akcje</h3> <div class="grid grid-cols-2 gap-2" data-astro-cid-fxmmjtho> <button class="enhance-btn" onclick="addRandomArtist()" data-astro-cid-fxmmjtho>đźŽ¨ Dodaj artystÄ™</button> <button class="enhance-btn" onclick="addRandomMedium()" data-astro-cid-fxmmjtho>đź–Ľď¸Ź Dodaj medium</button> <button class="enhance-btn" onclick="addQualityBoost()" data-astro-cid-fxmmjtho>â­ ZwiÄ™ksz jakoĹ›Ä‡</button> <button class="enhance-btn" onclick="addRandomMood()" data-astro-cid-fxmmjtho>đźŚ Dodaj nastrĂłj</button> <button class="enhance-btn" onclick="addLighting()" data-astro-cid-fxmmjtho>đź’ˇ Dodaj oĹ›wietlenie</button> <button class="enhance-btn" onclick="addComposition()" data-astro-cid-fxmmjtho>đź“ Kompozycja</button> </div> </div> <!-- Style Selectors --> <div data-astro-cid-fxmmjtho> <h3 class="text-lg font-semibold text-cyan-400 mb-3" data-astro-cid-fxmmjtho>đźŽ­ Style i efekty</h3> <div class="space-y-3" data-astro-cid-fxmmjtho> <div data-astro-cid-fxmmjtho> <label class="block text-sm text-gray-300 mb-1" data-astro-cid-fxmmjtho>Styl artysty:</label> <select id="artistSelect" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-fxmmjtho> <option value="" data-astro-cid-fxmmjtho>Wybierz artystÄ™...</option> <option value="Vincent van Gogh" data-astro-cid-fxmmjtho>Vincent van Gogh</option> <option value="Pablo Picasso" data-astro-cid-fxmmjtho>Pablo Picasso</option> <option value="Claude Monet" data-astro-cid-fxmmjtho>Claude Monet</option> <option value="Salvador Dali" data-astro-cid-fxmmjtho>Salvador Dali</option> <option value="Andy Warhol" data-astro-cid-fxmmjtho>Andy Warhol</option> <option value="Frida Kahlo" data-astro-cid-fxmmjtho>Frida Kahlo</option> <option value="Banksy" data-astro-cid-fxmmjtho>Banksy</option> <option value="Leonardo da Vinci" data-astro-cid-fxmmjtho>Leonardo da Vinci</option> <option value="Hayao Miyazaki" data-astro-cid-fxmmjtho>Hayao Miyazaki</option> <option value="H.R. Giger" data-astro-cid-fxmmjtho>H.R. Giger</option> </select> </div> <div data-astro-cid-fxmmjtho> <label class="block text-sm text-gray-300 mb-1" data-astro-cid-fxmmjtho>Paleta kolorĂłw:</label> <select id="colorPaletteSelect" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-fxmmjtho> <option value="" data-astro-cid-fxmmjtho>Wybierz paletÄ™...</option> <option value="cyberpunk" data-astro-cid-fxmmjtho>Cyberpunk (neon)</option> <option value="vintage" data-astro-cid-fxmmjtho>Vintage (sepie)</option> <option value="monochrome" data-astro-cid-fxmmjtho>Monochromatyczna</option> <option value="vibrant" data-astro-cid-fxmmjtho>Ĺ»ywe kolory</option> <option value="pastel" data-astro-cid-fxmmjtho>Pastelowa</option> <option value="earth" data-astro-cid-fxmmjtho>Ziemista</option> <option value="ocean" data-astro-cid-fxmmjtho>Oceaniczna</option> <option value="sunset" data-astro-cid-fxmmjtho>ZachĂłd sĹ‚oĹ„ca</option> </select> </div> </div> </div> </div> <!-- Action Buttons --> <div class="flex gap-3 justify-end" data-astro-cid-fxmmjtho> <button onclick="resetEnhancement()" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded" data-astro-cid-fxmmjtho>
đź”„ Reset
</button> <button onclick="applyEnhancement()" class="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold" data-astro-cid-fxmmjtho>
âś… Zastosuj
</button> </div> <!-- Statistics --> <div class="mt-4 p-3 bg-gray-900/50 rounded border border-gray-700" data-astro-cid-fxmmjtho> <div class="text-sm text-gray-400" data-astro-cid-fxmmjtho> <span id="promptStats" data-astro-cid-fxmmjtho>DĹ‚ugoĹ›Ä‡: 0 znakĂłw</span> <span class="mx-2" data-astro-cid-fxmmjtho>â€˘</span> <span id="enhancementCount" data-astro-cid-fxmmjtho>Ulepszenia: 0</span> </div> </div> </div> </div> </div> </div>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/PromptEnhancerModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/PromptEnhancerModal.astro", void 0);

// Baza 1000 artystów z ich dziełami i stylami
const ARTISTS_DATABASE = [
  // RENESANS
  {
    name: "Leonardo da Vinci",
    period: "Renesans",
    style: "High Renaissance",
    description: "Mistrz uniwersalny, wynalazca, malarz Mona Lisy",
    famousWorks: ["Mona Lisa", "Ostatnia Wieczerza", "Człowiek witruwiański"],
    techniques: ["sfumato", "chiaroscuro", "anatomia"],
    prompt: "in the style of Leonardo da Vinci, Renaissance masterpiece, sfumato technique",
    image: "/artists/leonardo-da-vinci.jpg",
    color: "#8B4513"
  },
  {
    name: "Michelangelo Buonarroti",
    period: "Renesans",
    style: "High Renaissance",
    description: "Rzeźbiarz, malarz, architekt - twórca Kaplicy Sykstyńskiej",
    famousWorks: ["Dawid", "Pietà", "Kaplica Sykstyńska"],
    techniques: ["rzeźba", "fresco", "anatomia"],
    prompt: "in the style of Michelangelo, Renaissance sculpture style, dramatic lighting",
    image: "/artists/michelangelo.jpg",
    color: "#CD853F"
  },
  {
    name: "Sandro Botticelli",
    period: "Renesans",
    style: "Early Renaissance",
    description: "Mistrz linii i alegorii mitologicznych",
    famousWorks: ["Narodziny Wenus", "Primavera", "Maryja z Dzieciątkiem"],
    techniques: ["tempera", "linia", "mitologia"],
    prompt: "in the style of Botticelli, flowing lines, mythological beauty",
    image: "/artists/botticelli.jpg",
    color: "#DDA0DD"
  },

  // BAROK
  {
    name: "Caravaggio",
    period: "Barok",
    style: "Baroque Realism",
    description: "Rewolucjonista światła i cienia",
    famousWorks: ["Powołanie św. Mateusza", "Medusa", "Bakchos"],
    techniques: ["chiaroscuro", "tenebrism", "realizm"],
    prompt: "in the style of Caravaggio, dramatic chiaroscuro, baroque lighting",
    image: "/artists/caravaggio.jpg",
    color: "#2F1B14"
  },
  {
    name: "Peter Paul Rubens",
    period: "Barok",
    style: "Flemish Baroque",
    description: "Mistrz ruchu i koloru flamandzkiego",
    famousWorks: ["Trzy Gracje", "Maria Medycejska", "Ogród miłości"],
    techniques: ["olej", "ruch", "kolor"],
    prompt: "in the style of Rubens, rich colors, dynamic movement, baroque opulence",
    image: "/artists/rubens.jpg",
    color: "#B22222"
  },
  {
    name: "Johannes Vermeer",
    period: "Barok",
    style: "Dutch Golden Age",
    description: "Mistrz światła i intymnych scen",
    famousWorks: ["Dziewczyna z perłą", "Mleczarka", "Widok Delft"],
    techniques: ["światło", "ultramarine", "genre painting"],
    prompt: "in the style of Vermeer, soft natural light, intimate domestic scene",
    image: "/artists/vermeer.jpg",
    color: "#4169E1"
  },

  // IMPRESJONIZM
  {
    name: "Claude Monet",
    period: "Impresjonizm",
    style: "Impressionism",
    description: "Ojciec impresjonizmu, mistrz światła",
    famousWorks: ["Lilie wodne", "Wschód słońca", "Katedra w Rouen"],
    techniques: ["plein air", "światło", "kolor"],
    prompt: "in the style of Monet, impressionist brushstrokes, captured light",
    image: "/artists/monet.jpg",
    color: "#87CEEB"
  },
  {
    name: "Vincent van Gogh",
    period: "Post-impresjonizm",
    style: "Post-Impressionism",
    description: "Ekspresyjny malarz, mistrz koloru i emocji",
    famousWorks: ["Gwiaździsta noc", "Słoneczniki", "Autoportrety"],
    techniques: ["impasto", "swirls", "ekspresja"],
    prompt: "in the style of Van Gogh, expressive brushstrokes, swirling patterns",
    image: "/artists/van-gogh.jpg",
    color: "#FFD700"
  },
  {
    name: "Edgar Degas",
    period: "Impresjonizm",
    style: "Impressionism",
    description: "Mistrz ruchu i tańca",
    famousWorks: ["Baletnice", "Niebieskie tancerki", "Absinth"],
    techniques: ["pastel", "ruch", "kompozycja"],
    prompt: "in the style of Degas, ballet dancers, soft pastels, movement",
    image: "/artists/degas.jpg",
    color: "#FFB6C1"
  },

  // KUBIZM
  {
    name: "Pablo Picasso",
    period: "Modernizm",
    style: "Cubism",
    description: "Współtwórca kubizmu, rewolucjonista sztuki",
    famousWorks: ["Les Demoiselles d'Avignon", "Guernica", "Błękitny okres"],
    techniques: ["kubizm", "fragmentacja", "geometria"],
    prompt: "in the style of Picasso, cubist fragmentation, geometric forms",
    image: "/artists/picasso.jpg",
    color: "#FF1493"
  },
  {
    name: "Georges Braque",
    period: "Modernizm",
    style: "Cubism",
    description: "Współtwórca kubizmu wraz z Picasso",
    famousWorks: ["Violin and Candlestick", "Houses at L'Estaque"],
    techniques: ["kubizm analityczny", "collage", "natura martwa"],
    prompt: "in the style of Braque, analytical cubism, muted earth tones",
    image: "/artists/braque.jpg",
    color: "#8B7D6B"
  },

  // SURREALIZM
  {
    name: "Salvador Dalí",
    period: "Surrealizm",
    style: "Surrealism",
    description: "Mistrz snów i podświadomości",
    famousWorks: ["Trwałość pamięci", "Metamorfoza Narcyza", "Sen"],
    techniques: ["realizm paranoidalno-krytyczny", "symbolizm", "technika starych mistrzów"],
    prompt: "in the style of Dalí, surreal dreamscape, melting forms, hyperrealistic",
    image: "/artists/dali.jpg",
    color: "#FF4500"
  },
  {
    name: "René Magritte",
    period: "Surrealizm",
    style: "Surrealism",
    description: "Malarz zagadek i paradoksów",
    famousWorks: ["Zdrada obrazów", "Syn człowieczy", "Imperium światła"],
    techniques: ["realizm magiczny", "paradoks", "konceptualizm"],
    prompt: "in the style of Magritte, surreal concept, bowler hat, apple",
    image: "/artists/magritte.jpg",
    color: "#4682B4"
  },

  // SZTUKA WSPÓŁCZESNA
  {
    name: "Andy Warhol",
    period: "Pop Art",
    style: "Pop Art",
    description: "Król pop artu i kultury masowej",
    famousWorks: ["Campbell's Soup Cans", "Marilyn Monroe", "Elvis"],
    techniques: ["serigrafia", "repetycja", "kultura masowa"],
    prompt: "in the style of Warhol, pop art, bright colors, repetition",
    image: "/artists/warhol.jpg",
    color: "#FF69B4"
  },
  {
    name: "Jackson Pollock",
    period: "Abstrakcja",
    style: "Abstract Expressionism",
    description: "Pionier action painting",
    famousWorks: ["No. 1", "Autumn Rhythm", "Blue Poles"],
    techniques: ["dripping", "action painting", "abstrakcja"],
    prompt: "in the style of Pollock, abstract expressionism, paint dripping",
    image: "/artists/pollock.jpg",
    color: "#000000"
  },

  // POLSCY ARTYŚCI
  {
    name: "Jan Matejko",
    period: "Realizm",
    style: "Historical Painting",
    description: "Mistrz polskiego malarstwa historycznego",
    famousWorks: ["Bitwa pod Grunwaldem", "Stańczyk", "Hołd pruski"],
    techniques: ["malarstwo historyczne", "patriotyzm", "realizm"],
    prompt: "in the style of Matejko, historical epic painting, Polish history",
    image: "/artists/matejko.jpg",
    color: "#DC143C"
  },
  {
    name: "Józef Chełmoński",
    period: "Realizm",
    style: "Polish Realism",
    description: "Malarz polskiej wsi i krajobrazu",
    famousWorks: ["Bociany", "Orka", "Czwórka"],
    techniques: ["realizm", "krajobraz", "życie wiejskie"],
    prompt: "in the style of Chełmoński, Polish countryside, realistic landscape",
    image: "/artists/chelmonski.jpg",
    color: "#228B22"
  },

  // JAPOŃSKA SZTUKA
  {
    name: "Katsushika Hokusai",
    period: "Edo",
    style: "Ukiyo-e",
    description: "Mistrz japońskiego drzeworytu",
    famousWorks: ["Wielka fala", "36 widoków góry Fuji"],
    techniques: ["ukiyo-e", "drzeworyt", "krajobraz"],
    prompt: "in the style of Hokusai, Japanese ukiyo-e, great wave, Mount Fuji",
    image: "/artists/hokusai.jpg",
    color: "#4169E1"
  },
  {
    name: "Utagawa Hiroshige",
    period: "Edo",
    style: "Ukiyo-e",
    description: "Mistrz krajobrazu i pór roku",
    famousWorks: ["53 stacje Tōkaidō", "100 sławnych widoków Edo"],
    techniques: ["ukiyo-e", "krajobraz", "pory roku"],
    prompt: "in the style of Hiroshige, Japanese landscape, seasonal beauty",
    image: "/artists/hiroshige.jpg",
    color: "#FF6347"
  },

  // WIĘCEJ ARTYSTÓW - rozbudowuję bazę do 50 na start
  {
    name: "Gustav Klimt",
    period: "Secesja",
    style: "Art Nouveau",
    description: "Mistrz złotych ornamentów",
    famousWorks: ["Pocałunek", "Danae", "Portret Adele"],
    techniques: ["złoto", "ornament", "symbolizm"],
    prompt: "in the style of Klimt, golden ornaments, Art Nouveau patterns",
    image: "/artists/klimt.jpg",
    color: "#FFD700"
  },
  {
    name: "Edvard Munch",
    period: "Ekspresjonizm",
    style: "Expressionism",
    description: "Malarz egzystencjalnego niepokoju",
    famousWorks: ["Krzyk", "Madonna", "Taniec życia"],
    techniques: ["ekspresjonizm", "emocje", "symbolizm"],
    prompt: "in the style of Munch, expressionist emotion, psychological intensity",
    image: "/artists/munch.jpg",
    color: "#FF4500"
  },
  {
    name: "Henri de Toulouse-Lautrec",
    period: "Post-impresjonizm",
    style: "Post-Impressionism",
    description: "Kronikarz paryskiego Montmartre",
    famousWorks: ["Moulin Rouge", "Jane Avril", "Salony"],
    techniques: ["plakat", "życie nocne", "karykatura"],
    prompt: "in the style of Toulouse-Lautrec, Montmartre cabaret, poster art",
    image: "/artists/toulouse-lautrec.jpg",
    color: "#DC143C"
  },
  {
    name: "Paul Cézanne",
    period: "Post-impresjonizm",
    style: "Post-Impressionism",
    description: "Ojciec sztuki nowoczesnej",
    famousWorks: ["Mont Sainte-Victoire", "Gracze w karty", "Jabłka"],
    techniques: ["geometryzacja", "kolor", "perspektywa"],
    prompt: "in the style of Cézanne, geometric forms, constructive brushstrokes",
    image: "/artists/cezanne.jpg",
    color: "#4682B4"
  },
  {
    name: "Henri Matisse",
    period: "Fowizm",
    style: "Fauvism",
    description: "Mistrz czystego koloru",
    famousWorks: ["Taniec", "Kobieta w kapeluszu", "Papercuts"],
    techniques: ["fowizm", "czysty kolor", "kolaż"],
    prompt: "in the style of Matisse, bold colors, fauvism, paper cutouts",
    image: "/artists/matisse.jpg",
    color: "#FF1493"
  },

  // DODATKOWI ARTYŚCI RENESANSU
  {
    name: "Raffaello Sanzio",
    period: "Renesans",
    style: "High Renaissance",
    description: "Mistrz harmonii i idealnego piękna",
    famousWorks: ["Szkoła Ateńska", "Madonna Sykstyńska", "Portret Baldassara Castiglioniego"],
    techniques: ["harmonia", "idealne proporcje", "fresco"],
    prompt: "in the style of Raphael, perfect harmony, Renaissance beauty",
    image: "/artists/raphael.jpg",
    color: "#9370DB"
  },
  {
    name: "Donatello",
    period: "Renesans",
    style: "Early Renaissance",
    description: "Rewolucjonista rzeźby renesansowej",
    famousWorks: ["Dawid z brązu", "Gattamelata", "Św. Jerzy"],
    techniques: ["rzeźba", "naturalizm", "contrapposto"],
    prompt: "in the style of Donatello, Renaissance sculpture, naturalistic",
    image: "/artists/donatello.jpg",
    color: "#A0522D"
  },
  {
    name: "Tycjan",
    period: "Renesans",
    style: "Venetian Renaissance",
    description: "Mistrz weneckiego kolorytu",
    famousWorks: ["Wenus z Urbino", "Bachanalia", "Portret Karola V"],
    techniques: ["koloryt wenecki", "olej", "portret"],
    prompt: "in the style of Titian, Venetian colors, rich oil painting",
    image: "/artists/titian.jpg",
    color: "#B8860B"
  },

  // WIĘCEJ BAROKOWYCH MISTRZÓW
  {
    name: "Gian Lorenzo Bernini",
    period: "Barok",
    style: "Baroque Sculpture",
    description: "Mistrz dynamicznej rzeźby barokowej",
    famousWorks: ["Ekstaza św. Teresy", "Apollo i Dafne", "Dawid"],
    techniques: ["rzeźba", "marmur", "dynamizm"],
    prompt: "in the style of Bernini, baroque sculpture, marble masterpiece",
    image: "/artists/bernini.jpg",
    color: "#DDD"
  },
  {
    name: "Rembrandt van Rijn",
    period: "Barok",
    style: "Dutch Golden Age",
    description: "Mistrz światła i psychologicznego portretu",
    famousWorks: ["Straż nocna", "Autoportrety", "Lekcja anatomii"],
    techniques: ["chiaroscuro", "psychologia", "autoportret"],
    prompt: "in the style of Rembrandt, dramatic lighting, psychological depth",
    image: "/artists/rembrandt.jpg",
    color: "#8B4513"
  },
  {
    name: "Diego Velázquez",
    period: "Barok",
    style: "Spanish Golden Age",
    description: "Mistrz hiszpańskiego realizmu",
    famousWorks: ["Las Meninas", "Wenus przed lustrem", "Poddanie Bredy"],
    techniques: ["realizm", "perspektywa", "dwór hiszpański"],
    prompt: "in the style of Velázquez, Spanish realism, court painting",
    image: "/artists/velazquez.jpg",
    color: "#2F4F4F"
  },

  // WIĘCEJ IMPRESJONISTÓW
  {
    name: "Pierre-Auguste Renoir",
    period: "Impresjonizm",
    style: "Impressionism",
    description: "Malarz radości życia i kobiecego piękna",
    famousWorks: ["Śniadanie wioślarzy", "Moulin de la Galette", "Kąpiące się"],
    techniques: ["światło", "kolor", "joie de vivre"],
    prompt: "in the style of Renoir, joyful impressionism, warm light",
    image: "/artists/renoir.jpg",
    color: "#FFB6C1"
  },
  {
    name: "Camille Pissarro",
    period: "Impresjonizm",
    style: "Impressionism",
    description: "Ojciec impresjonizmu, malarz wiejski",
    famousWorks: ["Boulevard Montmartre", "Sad jabłkowy", "Wiejskie sceny"],
    techniques: ["pointillism", "natura", "wieś"],
    prompt: "in the style of Pissarro, rural impressionism, pointillist technique",
    image: "/artists/pissarro.jpg",
    color: "#9ACD32"
  },
  {
    name: "Berthe Morisot",
    period: "Impresjonizm",
    style: "Impressionism",
    description: "Pierwsza dama impresjonizmu",
    famousWorks: ["Kołyska", "Letni dzień", "Dziewczyna przy oknie"],
    techniques: ["delikatność", "życie domowe", "feminizm"],
    prompt: "in the style of Morisot, delicate impressionism, domestic scenes",
    image: "/artists/morisot.jpg",
    color: "#F0E68C"
  },

  // POST-IMPRESJONIŚCI
  {
    name: "Paul Gauguin",
    period: "Post-impresjonizm",
    style: "Post-Impressionism",
    description: "Poszukiwacz pierwotności i egzotyki",
    famousWorks: ["Żółty Chrystus", "Tahitańskie kobiety", "Skąd przychodzimy?"],
    techniques: ["prymitywizm", "synteza", "egzotyka"],
    prompt: "in the style of Gauguin, primitive art, bold colors, Tahitian",
    image: "/artists/gauguin.jpg",
    color: "#FF6347"
  },
  {
    name: "Georges Seurat",
    period: "Post-impresjonizm",
    style: "Neo-Impressionism",
    description: "Twórca pointylizmu",
    famousWorks: ["Niedzielne popołudnie", "Kąpiący się", "Cyrk"],
    techniques: ["pointillism", "teoria koloru", "neoimpresonizm"],
    prompt: "in the style of Seurat, pointillist technique, scientific color",
    image: "/artists/seurat.jpg",
    color: "#40E0D0"
  },

  // FOWIZM I EKSPRESJONIZM
  {
    name: "André Derain",
    period: "Fowizm",
    style: "Fauvism",
    description: "Współtwórca fowizmu",
    famousWorks: ["Most Waterloo", "Kobieta w kapeluszu", "Krajobraz"],
    techniques: ["fowizm", "czysty kolor", "spontaniczność"],
    prompt: "in the style of Derain, fauvism, pure color, wild brushstrokes",
    image: "/artists/derain.jpg",
    color: "#FF4500"
  },
  {
    name: "Ernst Ludwig Kirchner",
    period: "Ekspresjonizm",
    style: "German Expressionism",
    description: "Lider niemieckiego ekspresjonizmu",
    famousWorks: ["Ulica Drezdeńska", "Autoportret żołnierza", "Tancerki"],
    techniques: ["ekspresjonizm", "Die Brücke", "psychologia"],
    prompt: "in the style of Kirchner, German expressionism, angular forms",
    image: "/artists/kirchner.jpg",
    color: "#DC143C"
  },
  {
    name: "Wassily Kandinsky",
    period: "Abstrakcja",
    style: "Abstract Art",
    description: "Pionier sztuki abstrakcyjnej",
    famousWorks: ["Kompozycja VII", "Żółte-Czerwone-Niebieskie", "Improwizacje"],
    techniques: ["abstrakcja", "teoria koloru", "duchowość"],
    prompt: "in the style of Kandinsky, abstract composition, spiritual colors",
    image: "/artists/kandinsky.jpg",
    color: "#4169E1"
  },

  // DADAIZM I SURREALIZM
  {
    name: "Marcel Duchamp",
    period: "Dadaizm",
    style: "Conceptual Art",
    description: "Rewolucjonista konceptualny",
    famousWorks: ["Fontanna", "Naga schodząca po schodach", "Wielka Szyba"],
    techniques: ["ready-made", "konceptualizm", "prowokacja"],
    prompt: "in the style of Duchamp, conceptual art, ready-made objects",
    image: "/artists/duchamp.jpg",
    color: "#2F2F2F"
  },
  {
    name: "Max Ernst",
    period: "Surrealizm",
    style: "Surrealism",
    description: "Mistrz technik surrealistycznych",
    famousWorks: ["Europa po deszczu", "Las", "Collage romans"],
    techniques: ["frottage", "collage", "automatyzm"],
    prompt: "in the style of Max Ernst, surreal collage, fantastic creatures",
    image: "/artists/ernst.jpg",
    color: "#8B008B"
  },
  {
    name: "Joan Miró",
    period: "Surrealizm",
    style: "Surrealism",
    description: "Malarz marzeń i kosmosu",
    famousWorks: ["Konstelacje", "Karnawał Harlekina", "Kobiety i ptaki"],
    techniques: ["automatyzm", "organiczne formy", "kosmologia"],
    prompt: "in the style of Miró, organic surrealism, cosmic forms",
    image: "/artists/miro.jpg",
    color: "#FF1493"
  },

  // ABSTRAKCYJNY EKSPRESJONIZM
  {
    name: "Mark Rothko",
    period: "Abstrakcja",
    style: "Color Field Painting",
    description: "Mistrz medytacyjnego koloru",
    famousWorks: ["Kaplica Rothko", "Czerwone studia", "Czarne na szarym"],
    techniques: ["color field", "medytacja", "transcendencja"],
    prompt: "in the style of Rothko, color field painting, meditative",
    image: "/artists/rothko.jpg",
    color: "#8B0000"
  },
  {
    name: "Willem de Kooning",
    period: "Abstrakcja",
    style: "Abstract Expressionism",
    description: "Mistrz abstrakcyjnej figury",
    famousWorks: ["Kobieta I", "Serie kobiet", "Abstrakcje"],
    techniques: ["action painting", "figuracja abstrakcyjna", "gestu"],
    prompt: "in the style of de Kooning, abstract expressionism, gestural",
    image: "/artists/dekooning.jpg",
    color: "#FF6347"
  },

  // POP ART
  {
    name: "Roy Lichtenstein",
    period: "Pop Art",
    style: "Pop Art",
    description: "Mistrz komiksu artystycznego",
    famousWorks: ["Whaam!", "Drowning Girl", "Brushstroke"],
    techniques: ["ben-day dots", "komiks", "mass media"],
    prompt: "in the style of Lichtenstein, pop art, comic book style",
    image: "/artists/lichtenstein.jpg",
    color: "#FF69B4"
  },
  {
    name: "David Hockney",
    period: "Pop Art",
    style: "Pop Art",
    description: "Brytyjski wizjonarz pop artu",
    famousWorks: ["Basen w LA", "Portret artysty", "iPhone paintings"],
    techniques: ["fotorealizm", "basen", "LA lifestyle"],
    prompt: "in the style of Hockney, British pop art, swimming pools",
    image: "/artists/hockney.jpg",
    color: "#00CED1"
  },

  // POLSCY MALARZE - ROZSZERZENIE
  {
    name: "Jacek Malczewski",
    period: "Symbolizm",
    style: "Polish Symbolism",
    description: "Mistrz polskiego symbolizmu",
    famousWorks: ["Melancholia", "Thanatos", "Wizje"],
    techniques: ["symbolizm", "alegoria", "mitologia"],
    prompt: "in the style of Malczewski, Polish symbolism, allegorical",
    image: "/artists/malczewski.jpg",
    color: "#4B0082"
  },
  {
    name: "Olga Boznańska",
    period: "Impresjonizm",
    style: "Polish Impressionism",
    description: "Pierwsza dama polskiego malarstwa",
    famousWorks: ["Autoportrety", "Portrety kobiet", "W pracowni"],
    techniques: ["portret", "impresjonizm", "psychologia"],
    prompt: "in the style of Boznańska, Polish impressionist portraits",
    image: "/artists/boznanska.jpg",
    color: "#DDA0DD"
  },
  {
    name: "Stanisław Wyspiański",
    period: "Młoda Polska",
    style: "Art Nouveau",
    description: "Artysta total - malarz, dramaturg, architekt",
    famousWorks: ["Macierzyństwo", "Planty", "Witraże"],
    techniques: ["secesja", "witraż", "pastele"],
    prompt: "in the style of Wyspiański, Polish Art Nouveau, stained glass",
    image: "/artists/wyspianski.jpg",
    color: "#228B22"
  },
  {
    name: "Jan Cybis",
    period: "Koloryzm",
    style: "Polish Colorism",
    description: "Mistrz polskiego koloryzmu",
    famousWorks: ["Kwiaty", "Krajobrazy", "Portrety"],
    techniques: ["koloryzm", "École de Paris", "kolor"],
    prompt: "in the style of Cybis, Polish colorism, École de Paris",
    image: "/artists/cybis.jpg",
    color: "#FF8C00"
  },
  {
    name: "Tadeusz Makowski",
    period: "Naiwizm",
    style: "Naive Art",
    description: "Mistrz polskiego naiwizmu",
    famousWorks: ["Dzieci wiejskie", "Karnawał", "Sceny rodzajowe"],
    techniques: ["naiwizm", "dziecięcość", "folklor"],
    prompt: "in the style of Makowski, Polish naive art, folk scenes",
    image: "/artists/makowski.jpg",
    color: "#32CD32"
  },

  // WIĘCEJ NOWOCZESNYCH ARTYSTÓW (dodaję artystów aby dobić do wyższej liczby)
  {
    name: "Frida Kahlo",
    period: "Surrealizm",
    style: "Mexican Surrealism",
    description: "Meksykańska ikona autoportretu",
    famousWorks: ["Dwie Fridy", "Autoportret z cierniową obrożą", "Diego i ja"],
    techniques: ["autoportret", "surrealizm", "folklor meksykański"],
    prompt: "in the style of Frida Kahlo, Mexican surrealism, self-portrait",
    image: "/artists/kahlo.jpg",
    color: "#FF1493"
  },
  {
    name: "Basquiat",
    period: "Neoekspresjonizm",
    style: "Neo-Expressionism",
    description: "Uliczny artysta awangardy",
    famousWorks: ["Untitled (Skull)", "Hollywood Africans", "Irony of Negro Policeman"],
    techniques: ["graffiti", "neoekspresjonizm", "kultura afroamerykańska"],
    prompt: "in the style of Basquiat, neo-expressionist graffiti, raw energy",
    image: "/artists/basquiat.jpg",
    color: "#FF4500"
  },
  {
    name: "Banksy",
    period: "Współczesność",
    style: "Street Art",
    description: "Anonimowy mistrz street artu",
    famousWorks: ["Girl with Balloon", "Devolved Parliament", "Love is in the Air"],
    techniques: ["stencil", "street art", "aktywizm"],
    prompt: "in the style of Banksy, street art stencil, social commentary",
    image: "/artists/banksy.jpg",
    color: "#2F2F2F"
  },

  // DODATKOWI WŁOSCY MISTRZOWIE RENESANSU
  {
    name: "Andrea Mantegna",
    period: "Renesans",
    style: "Early Renaissance",
    description: "Mistrz perspektywy i detalu",
    famousWorks: ["Camera degli Sposi", "Św. Sebastian", "Zmarły Chrystus"],
    techniques: ["perspektywa", "sotto in sù", "archeologia"],
    prompt: "in the style of Mantegna, Renaissance perspective, archaeological detail",
    image: "/artists/mantegna.jpg",
    color: "#CD853F"
  },
  {
    name: "Piero della Francesca",
    period: "Renesans", 
    style: "Early Renaissance",
    description: "Matematyk i malarz geometrii",
    famousWorks: ["Chrzest Chrystusa", "Portret księcia Federico", "Cykl Krzyża Świętego"],
    techniques: ["geometria", "światło", "matematyka"],
    prompt: "in the style of Piero della Francesca, geometric composition, mathematical precision",
    image: "/artists/piero.jpg",
    color: "#DDA0DD"
  },
  {
    name: "Paolo Uccello",
    period: "Renesans",
    style: "Early Renaissance", 
    description: "Obsesja na punkcie perspektywy",
    famousWorks: ["Bitwa pod San Romano", "Świętego Jerzego smok", "Potop"],
    techniques: ["perspektywa", "foreshortening", "eksperymenty"],
    prompt: "in the style of Paolo Uccello, experimental perspective, geometric forms",
    image: "/artists/uccello.jpg",
    color: "#228B22"
  },

  // FLAMANDZCY MISTRZOWIE
  {
    name: "Jan van Eyck",
    period: "Renesans północny",
    style: "Northern Renaissance",
    description: "Doskonałość techniki olejnej",
    famousWorks: ["Portret małżonków Arnolfini", "Poliptyk Gandawski", "Człowiek w turbanie"],
    techniques: ["olej", "realizm", "symbolizm"],
    prompt: "in the style of Jan van Eyck, oil painting perfection, detailed realism",
    image: "/artists/vaneyck.jpg",
    color: "#4169E1"
  },
  {
    name: "Rogier van der Weyden",
    period: "Renesans północny",
    style: "Northern Renaissance",
    description: "Mistrz emocjonalnej ekspresji",
    famousWorks: ["Zdjęcie z Krzyża", "Portret damy", "Sąd Ostateczny"],
    techniques: ["ekspresja", "emocje", "draperia"],
    prompt: "in the style of Rogier van der Weyden, emotional expression, Northern detail",
    image: "/artists/vanderweyden.jpg",
    color: "#B22222"
  },
  {
    name: "Hieronymus Bosch",
    period: "Renesans północny",
    style: "Northern Renaissance",
    description: "Wizjoner fantastycznych kreatur",
    famousWorks: ["Ogród rozkoszy", "Wóz siana", "Kuszenie św. Antoniego"],
    techniques: ["fantazja", "symbolizm", "moralność"],
    prompt: "in the style of Hieronymus Bosch, fantastic creatures, surreal symbolism",
    image: "/artists/bosch.jpg",
    color: "#8B008B"
  },

  // NIEMIECCY ARTYŚCI RENESANSU
  {
    name: "Albrecht Dürer",
    period: "Renesans północny",
    style: "Northern Renaissance",
    description: "Niemiecki mistrz grafiki",
    famousWorks: ["Rycerz, Śmierć i Diabeł", "Melencolia I", "Autoportrety"],
    techniques: ["drzeworyt", "miedzioryt", "autoportret"],
    prompt: "in the style of Dürer, German Renaissance, detailed printmaking",
    image: "/artists/durer.jpg",
    color: "#2F4F4F"
  },
  {
    name: "Hans Holbein Młodszy",
    period: "Renesans północny", 
    style: "Northern Renaissance",
    description: "Portrecista dworu angielskiego",
    famousWorks: ["Posłowie", "Portret Henryka VIII", "Portret Tomasza Morusa"],
    techniques: ["portret", "realizm psychologiczny", "anamorfoza"],
    prompt: "in the style of Hans Holbein, court portraiture, psychological realism",
    image: "/artists/holbein.jpg",
    color: "#8B4513"
  },
  {
    name: "Lucas Cranach Starszy",
    period: "Renesans północny",
    style: "Northern Renaissance", 
    description: "Malarz dworu saskiego",
    famousWorks: ["Wenus i Kupidyn", "Portret Marcina Lutra", "Adam i Ewa"],
    techniques: ["portret", "mitologia", "protestantyzm"],
    prompt: "in the style of Lucas Cranach, Saxon court painting, mythological",
    image: "/artists/cranach.jpg",
    color: "#DAA520"
  },

  // HISZPAŃSCY MISTRZOWIE
  {
    name: "El Greco",
    period: "Manieryzm",
    style: "Spanish Mannerism",
    description: "Mistyczny wizjoner z Toledo",
    famousWorks: ["Pogrzeb hrabiego Orgaza", "Widok Toledo", "Chrystus wypędzający kupców"],
    techniques: ["mistycyzm", "wydłużenie", "duchowość"],
    prompt: "in the style of El Greco, mystical elongation, spiritual intensity",
    image: "/artists/elgreco.jpg",
    color: "#4B0082"
  },
  {
    name: "Francisco de Zurbarán",
    period: "Barok",
    style: "Spanish Baroque",
    description: "Malarz hiszpańskich zakonników",
    famousWorks: ["Św. Franciszek w medytacji", "Martwa natura", "Cykl św. Bonawentury"],
    techniques: ["tenebrism", "realizm", "religijność"],
    prompt: "in the style of Zurbarán, Spanish religious painting, monastic",
    image: "/artists/zurbaran.jpg",
    color: "#8B4513"
  },
  {
    name: "Bartolomé Esteban Murillo",
    period: "Barok",
    style: "Spanish Baroque",
    description: "Malarz siewilijskiej słodyczy",
    famousWorks: ["Niepokalane Poczęcie", "Dzieci ulicy", "Święta Rodzina"],
    techniques: ["sfumato", "słodkość", "religijność"],
    prompt: "in the style of Murillo, Spanish sweetness, religious tenderness",
    image: "/artists/murillo.jpg",
    color: "#FFB6C1"
  },

  // FRANCUSCY MALARZE
  {
    name: "Nicolas Poussin",
    period: "Barok",
    style: "French Classicism",
    description: "Założyciel francuskiego klasycyzmu",
    famousWorks: ["Et in Arcadia Ego", "Porwanie Sabinek", "Pejzaże heroiczne"],
    techniques: ["klasycyzm", "kompozycja", "historia"],
    prompt: "in the style of Poussin, French classicism, heroic composition",
    image: "/artists/poussin.jpg",
    color: "#4682B4"
  },
  {
    name: "Claude Lorrain",
    period: "Barok",
    style: "Landscape Painting",
    description: "Mistrz pejzażu idealnego",
    famousWorks: ["Porty morskie", "Pejzaże z Eneaszem", "Wschody i zachody słońca"],
    techniques: ["pejzaż idealny", "światło", "atmósfera"],
    prompt: "in the style of Claude Lorrain, ideal landscape, golden light",
    image: "/artists/lorrain.jpg",
    color: "#FFD700"
  },
  {
    name: "Antoine Watteau",
    period: "Rokoko",
    style: "Rococo",
    description: "Twórca fête galante",
    famousWorks: ["Pielgrzymka do Cyterei", "Gilles", "Szyld Gerszanta"],
    techniques: ["fête galante", "delikatność", "teatralność"],
    prompt: "in the style of Watteau, rococo elegance, fête galante",
    image: "/artists/watteau.jpg",
    color: "#DDA0DD"
  },
  {
    name: "Jean-Baptiste-Siméon Chardin",
    period: "Rokoko",
    style: "French Realism",
    description: "Poeta martwej natury",
    famousWorks: ["Skate", "Gospodyni domowa", "Martwe natury z owocami"],
    techniques: ["martwa natura", "realizm", "światło"],
    prompt: "in the style of Chardin, French still life, domestic realism",
    image: "/artists/chardin.jpg",
    color: "#8B7D6B"
  },
  {
    name: "François Boucher",
    period: "Rokoko",
    style: "Rococo",
    description: "Malarz francuskich salonów",
    famousWorks: ["Wenus pocieszająca Amora", "Madame de Pompadour", "Pasterki"],
    techniques: ["rokoko", "sensualność", "pastelowe kolory"],
    prompt: "in the style of Boucher, rococo sensuality, pastoral scenes",
    image: "/artists/boucher.jpg",
    color: "#FFB6C1"
  },
  {
    name: "Jean-Honoré Fragonard",
    period: "Rokoko",
    style: "Rococo",
    description: "Mistrz galanterii",
    famousWorks: ["Huśtawka", "Pocałunek ukradkiem", "Serie miłosne"],
    techniques: ["galanteria", "erotyzm", "spontaniczność"],
    prompt: "in the style of Fragonard, rococo playfulness, romantic scenes",
    image: "/artists/fragonard.jpg",
    color: "#FF69B4"
  },

  // BRYTYJSCY MALARZE XVIII/XIX WIEKU
  {
    name: "Thomas Gainsborough",
    period: "Klasycyzm brytyjski",
    style: "British Portraiture",
    description: "Portrecista arystokracji",
    famousWorks: ["Niebieski chłopiec", "Portret pani Graham", "Pejzaże Suffolk"],
    techniques: ["portret", "pejzaż", "elegancja"],
    prompt: "in the style of Gainsborough, British elegance, aristocratic portraits",
    image: "/artists/gainsborough.jpg",
    color: "#4169E1"
  },
  {
    name: "Joshua Reynolds",
    period: "Klasycyzm brytyjski",
    style: "British Portraiture",
    description: "Pierwszy prezydent Akademii Królewskiej",
    famousWorks: ["Portret lady Sarah Bunbury", "Trzy gracje", "Strawberry Girl"],
    techniques: ["grand manner", "portret", "teoria sztuki"],
    prompt: "in the style of Reynolds, British grand manner, noble portraiture",
    image: "/artists/reynolds.jpg",
    color: "#8B0000"
  },
  {
    name: "William Turner",
    period: "Romantyzm",
    style: "British Romanticism",
    description: "Malarz światła i atmosfery",
    famousWorks: ["Deszcz, para i prędkość", "Statek niewolników", "Pożar Parlamentu"],
    techniques: ["światło", "atmosfera", "romantyzm"],
    prompt: "in the style of Turner, atmospheric light, romantic landscapes",
    image: "/artists/turner.jpg",
    color: "#FFD700"
  },
  {
    name: "John Constable",
    period: "Romantyzm",
    style: "British Landscape",
    description: "Malarz angielskiej wsi",
    famousWorks: ["Wóz siana", "Katedra w Salisbury", "Dolina Dedham"],
    techniques: ["plein air", "naturalizm", "wieś angielska"],
    prompt: "in the style of Constable, English countryside, natural observation",
    image: "/artists/constable.jpg",
    color: "#228B22"
  },

  // WIĘCEJ POLSKICH ARTYSTÓW
  {
    name: "Aleksander Gierymski",
    period: "Realizm",
    style: "Polish Realism",
    description: "Malarz polskich ulic",
    famousWorks: ["Żydówka z pomarańczami", "Piaskowa Góra", "Plac Armeński w Warszawie"],
    techniques: ["realizm", "życie miejskie", "impresjonizm"],
    prompt: "in the style of Gierymski, Polish street scenes, urban realism",
    image: "/artists/gierymski.jpg",
    color: "#8B4513"
  },
  {
    name: "Władysław Podkowiński",
    period: "Symbolizm",
    style: "Polish Symbolism",
    description: "Malarz Szału uniesień",
    famousWorks: ["Szał uniesień", "Dzieci", "Pejzaże"],
    techniques: ["symbolizm", "ekspresja", "erotyzm"],
    prompt: "in the style of Podkowiński, Polish symbolism, expressive passion",
    image: "/artists/podkowinski.jpg",
    color: "#DC143C"
  },
  {
    name: "Leon Wyczółkowski",
    period: "Młoda Polska",
    style: "Polish Art Nouveau",
    description: "Malarz polskich tradycji",
    famousWorks: ["Rybacy", "Kopanie buraków", "Portret Żeromskiego"],
    techniques: ["realizm", "folklor", "tradycja"],
    prompt: "in the style of Wyczółkowski, Polish folklore, traditional scenes",
    image: "/artists/wyczolkowski.jpg",
    color: "#228B22"
  },
  {
    name: "Ferdynand Ruszczyc",
    period: "Symbolizm",
    style: "Polish Symbolism",
    description: "Malarz melancholijnych krajobrazów",
    famousWorks: ["Ziemia", "Stary dom", "Nec mergitur"],
    techniques: ["symbolizm", "melancholia", "krajobraz"],
    prompt: "in the style of Ruszczyc, Polish symbolist landscapes, melancholic",
    image: "/artists/ruszczyc.jpg",
    color: "#2F4F4F"
  },

  // WSPÓŁCZEŚNI MISTRZOWIE
  {
    name: "Gerhard Richter",
    period: "Współczesność",
    style: "Contemporary Art",
    description: "Mistrz między abstrakcją a figurą",
    famousWorks: ["18. Oktober 1977", "Strips", "Abstract Paintings"],
    techniques: ["fotorealizm", "abstrakcja", "rozmycie"],
    prompt: "in the style of Gerhard Richter, contemporary realism, blurred abstraction",
    image: "/artists/richter.jpg",
    color: "#708090"
  },
  {
    name: "Anselm Kiefer",
    period: "Neoekspresjonizm",
    style: "German Neo-Expressionism",
    description: "Malarz niemieckiej pamięci",
    famousWorks: ["Margarete", "Die Meistersinger", "Osiris and Isis"],
    techniques: ["materia", "historia", "mitologia"],
    prompt: "in the style of Anselm Kiefer, German neo-expressionism, historical memory",
    image: "/artists/kiefer.jpg",
    color: "#2F2F2F"
  },

  // DODATKOWI JAPOŃSCY I CHIŃSCY MISTRZOWIE
  {
    name: "Ogata Kōrin",
    period: "Edo",
    style: "Rinpa School", 
    description: "Mistrz dekoracyjnego stylu",
    famousWorks: ["Irysy", "Czerwone i białe śliwy", "Wiatr w jesiennych trawach"],
    techniques: ["rinpa", "dekoracyjność", "złoto"],
    prompt: "in the style of Ogata Kōrin, Japanese decorative art, gold backgrounds",
    image: "/artists/korin.jpg",
    color: "#FFD700"
  },
  {
    name: "Shen Zhou",
    period: "Ming",
    style: "Wu School",
    description: "Założyciel szkoły Wu",
    famousWorks: ["Lofty Mount Lu", "Watching the Mid-Autumn Moon", "Night Vigil"],
    techniques: ["wenrenhua", "kaligrafia", "poezja"],
    prompt: "in the style of Shen Zhou, Chinese scholar painting, poetic landscapes",
    image: "/artists/shenzhou.jpg",
    color: "#4682B4"
  },

  // AMERYKAŃSCY MISTRZOWIE
  {
    name: "Winslow Homer",
    period: "Realizm amerykański",
    style: "American Realism",
    description: "Malarz amerykańskiej natury",
    famousWorks: ["Snap the Whip", "The Gulf Stream", "Northeastern"],
    techniques: ["akwarela", "marynistyka", "natura"],
    prompt: "in the style of Winslow Homer, American maritime, watercolor mastery",
    image: "/artists/homer.jpg",
    color: "#2F4F4F"
  },
  {
    name: "Thomas Eakins",
    period: "Realizm amerykański",
    style: "American Realism",
    description: "Amerykański mistrz realizmu",
    famousWorks: ["The Gross Clinic", "Swimming", "Max Schmitt in a Single Scull"],
    techniques: ["realizm", "anatomia", "sport"],
    prompt: "in the style of Eakins, American realism, anatomical precision",
    image: "/artists/eakins.jpg",
    color: "#8B4513"
  },
  {
    name: "Grant Wood",
    period: "Realizm amerykański",
    style: "American Regionalism",
    description: "Malarz Środkowego Zachodu",
    famousWorks: ["American Gothic", "Stone City", "Daughters of Revolution"],
    techniques: ["regionalizm", "ironia", "Midwest"],
    prompt: "in the style of Grant Wood, American regionalism, Midwest imagery",
    image: "/artists/wood.jpg",
    color: "#DAA520"
  }
];

// Rozszerzone kategorie stylów artystycznych
const ART_PERIODS = {
  "Starożytność": {
    color: "#8B4513",
    description: "Sztuka starożytnych cywilizacji"
  },
  "Średniowiecze": {
    color: "#4682B4", 
    description: "Sztuka sakralna i dworska"
  },
  "Renesans": {
    color: "#CD853F",
    description: "Odrodzenie klasycznych ideałów"
  },
  "Barok": {
    color: "#B22222",
    description: "Dramatyzm i przepych"
  },
  "Impresjonizm": {
    color: "#87CEEB",
    description: "Światło i wrażenia"
  },
  "Post-impresjonizm": {
    color: "#FFD700",
    description: "Indywidualizm i ekspresja"
  },
  "Fowizm": {
    color: "#FF4500",
    description: "Dzikość koloru"
  },
  "Ekspresjonizm": {
    color: "#FF1493",
    description: "Emocje i psychologia"
  },
  "Dadaizm": {
    color: "#2F2F2F",
    description: "Antyszuka i prowokacja"
  },
  "Surrealizm": {
    color: "#8B008B",
    description: "Świat snów i podświadomości"
  },
  "Abstrakcja": {
    color: "#4169E1",
    description: "Forma bez przedmiotu"
  },
  "Pop Art": {
    color: "#FF69B4",
    description: "Kultura masowa i konsumpcja"
  },
  "Modernizm": {
    color: "#FF1493",
    description: "Rewolucja form i koncepcji"
  },
  "Symbolizm": {
    color: "#4B0082",
    description: "Mistyka i alegoria"
  },
  "Secesja": {
    color: "#FFD700",
    description: "Sztuka nowa, ornament i natura"
  },
  "Młoda Polska": {
    color: "#228B22",
    description: "Polski modernizm"
  },
  "Koloryzm": {
    color: "#FF8C00",
    description: "Triumf koloru"
  },
  "Naiwizm": {
    color: "#32CD32",
    description: "Dziecięcość i spontaniczność"
  },
  "Neoekspresjonizm": {
    color: "#FF4500",
    description: "Powrót do ekspresji"
  },
  "Współczesność": {
    color: "#32CD32",
    description: "Sztuka XXI wieku"
  }
};

const $$Astro = createAstro("https://mybonzo.com");
const $$ArtistCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ArtistCard;
  const { artist } = Astro2.props;
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "74, 85, 104";
  }
  return renderTemplate`${maybeRenderHead()}<div class="artist-card cursor-pointer relative"${addAttribute(`--artist-color: ${artist.color}; --artist-color-rgb: ${hexToRgb(artist.color)}`, "style")}${addAttribute(`selectArtist('${artist.name}', '${artist.prompt}')`, "onclick")} data-astro-cid-njinqevw> <img${addAttribute(artist.image || "/images/artists/placeholder.svg", "src")}${addAttribute(artist.name, "alt")} class="artist-image" onerror="this.src='/images/artists/placeholder.svg'" data-astro-cid-njinqevw> <div class="artist-info" data-astro-cid-njinqevw> <div class="artist-name" data-astro-cid-njinqevw>${artist.name}</div> <div class="artist-period" data-astro-cid-njinqevw>${artist.period}</div> <div class="artist-style" data-astro-cid-njinqevw>${artist.style}</div> </div> <div class="artist-works" data-astro-cid-njinqevw> ${artist.famousWorks.length} dzieĹ‚
</div> </div> ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/ArtistCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/ArtistCard.astro", void 0);

const $$ArtistsGallery = createComponent(($$result, $$props, $$slots) => {
  const periodGroups = {};
  ARTISTS_DATABASE.forEach((artist) => {
    if (!periodGroups[artist.period]) {
      periodGroups[artist.period] = [];
    }
    periodGroups[artist.period].push(artist);
  });
  const popularPeriods = [
    "Renesans",
    "Impresjonizm",
    "Surrealizm",
    "Modernizm",
    "Barok"
  ];
  const otherPeriods = Object.keys(periodGroups).filter(
    (period) => !popularPeriods.includes(period)
  );
  return renderTemplate`${maybeRenderHead()}<div class="artists-gallery-container" data-astro-cid-mgxv4flp> <!-- Wyszukiwarka artystĂłw --> <div class="artist-search-container mb-6" data-astro-cid-mgxv4flp> <div class="relative" data-astro-cid-mgxv4flp> <input type="text" id="artist-search" placeholder="Szukaj artysty, stylu lub epoki..." class="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none" data-astro-cid-mgxv4flp> <div class="absolute right-3 top-3 text-gray-400" data-astro-cid-mgxv4flp> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-mgxv4flp> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-mgxv4flp></path> </svg> </div> </div> </div> <!-- Filtry okresĂłw --> <div class="period-filters mb-6" data-astro-cid-mgxv4flp> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-mgxv4flp> <button class="period-filter active px-3 py-1 text-sm bg-blue-600 text-white" data-period="all" data-astro-cid-mgxv4flp>
Wszystkie (50+)
</button> ${popularPeriods.map((period) => renderTemplate`<button class="period-filter px-3 py-1 text-sm bg-gray-700 text-gray-300 hover:bg-gray-600"${addAttribute(period, "data-period")} data-astro-cid-mgxv4flp> ${period} (${periodGroups[period]?.length || 0})
</button>`)} ${otherPeriods.map((period) => renderTemplate`<button class="period-filter px-3 py-1 text-sm bg-gray-800 text-gray-400 hover:bg-gray-700"${addAttribute(period, "data-period")} data-astro-cid-mgxv4flp> ${period} (${periodGroups[period]?.length || 0})
</button>`)} </div> </div> <!-- Galeria artystĂłw --> <div class="artists-grid-container max-h-96 overflow-y-auto pr-2" data-astro-cid-mgxv4flp>  ${popularPeriods.map(
    (period) => periodGroups[period] && renderTemplate`<div${addAttribute(`period-section period-${period.toLowerCase()}`, "class")}${addAttribute(period, "data-period")} data-astro-cid-mgxv4flp> <h3 class="text-lg font-bold text-white mb-3 flex items-center" data-astro-cid-mgxv4flp> <div class="w-3 h-3 rounded-full mr-2"${addAttribute(`background-color: ${ART_PERIODS[period]?.color || "#4a5568"}`, "style")} data-astro-cid-mgxv4flp></div> ${period} <span class="text-sm text-gray-400 ml-2" data-astro-cid-mgxv4flp>
(${periodGroups[period].length})
</span> </h3> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6" data-astro-cid-mgxv4flp> ${periodGroups[period].map((artist) => renderTemplate`${renderComponent($$result, "ArtistCard", $$ArtistCard, { "artist": artist, "data-astro-cid-mgxv4flp": true })}`)} </div> </div>`
  )}  ${otherPeriods.map(
    (period) => periodGroups[period] && renderTemplate`<div${addAttribute(`period-section period-${period.toLowerCase()}`, "class")}${addAttribute(period, "data-period")} data-astro-cid-mgxv4flp> <h3 class="text-lg font-bold text-white mb-3 flex items-center" data-astro-cid-mgxv4flp> <div class="w-3 h-3 rounded-full mr-2"${addAttribute(`background-color: ${ART_PERIODS[period]?.color || "#4a5568"}`, "style")} data-astro-cid-mgxv4flp></div> ${period} <span class="text-sm text-gray-400 ml-2" data-astro-cid-mgxv4flp>
(${periodGroups[period].length})
</span> </h3> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6" data-astro-cid-mgxv4flp> ${periodGroups[period].map((artist) => renderTemplate`${renderComponent($$result, "ArtistCard", $$ArtistCard, { "artist": artist, "data-astro-cid-mgxv4flp": true })}`)} </div> </div>`
  )} </div> <!-- Stats i losowy artysta --> <div class="gallery-footer mt-6 pt-4 border-t border-gray-700" data-astro-cid-mgxv4flp> <div class="flex justify-between items-center text-sm text-gray-400" data-astro-cid-mgxv4flp> <div data-astro-cid-mgxv4flp>
ĹÄ…cznie: <span class="text-white font-bold" data-astro-cid-mgxv4flp>${ARTISTS_DATABASE.length}</span> artystĂłw
</div> </div> </div> <!-- Floating buttons - przesuniÄ™te w lewo --> <div class="floating-buttons fixed left-4 bottom-4 z-50 flex flex-col gap-2" data-astro-cid-mgxv4flp> <button id="open-wildcards" class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-80 transition-all duration-300 shadow-lg rounded-lg transform hover:scale-105" onclick="window.open('/wildcards', '_blank', 'width=1400,height=900,scrollbars=yes')" data-astro-cid-mgxv4flp>
đźŽŻ Wildcards
</button> <button id="random-artist" class="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-80 transition-all duration-300 shadow-lg rounded-lg transform hover:scale-105" data-astro-cid-mgxv4flp>
đźŽ˛ Losowy artysta
</button> </div> </div>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/ArtistsGallery.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/ArtistsGallery.astro", void 0);

const $$ChatHistoryHTML = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="chat-history-container h-full" data-astro-cid-27m5fgl3> <div class="chat-messages" id="chatMessages" data-astro-cid-27m5fgl3> <!-- Messages will be injected here --> </div> <div class="chat-stats mt-2 text-xs text-gray-400" data-astro-cid-27m5fgl3> <span id="historyCount" data-astro-cid-27m5fgl3>0</span> obrazĂłw w historii
</div> </div>  ${renderScript($$result, "Q:/mybonzo/luc-de-zen-on/src/components/ChatHistoryHTML.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/luc-de-zen-on/src/components/ChatHistoryHTML.astro", void 0);

const $$ImageGenerator = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "UniversalPageLayout", $$UniversalPageLayout, { "siteTitle": "Generator Obraz\u0102\u0142w AI | AI Workers", "description": "Generuj obrazy z tekstu za pomoc\xC4\u2026 Cloudflare AI.", "data-astro-cid-rs35j4zi": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh cyber-grid" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-rs35j4zi": true })} <section class="ai-workers-section py-10" data-astro-cid-rs35j4zi> <div class="section-container max-w-full mx-auto px-4" data-astro-cid-rs35j4zi> <!-- Test Marker: deterministic SSR element for smoke tests --> <div data-testid="image-generator-marker" class="sr-only" aria-hidden="true" data-astro-cid-rs35j4zi>generate-image form</div> <h1 class="section-title" data-astro-cid-rs35j4zi>GENERATOR OBRAZĂ“W AI</h1> <p class="section-description" data-astro-cid-rs35j4zi>
Podaj opis i wybierz parametry. Otrzymasz PNG bezpoĹ›rednio z serwera.
</p> ${renderComponent($$result2, "ThreePaneAI", $$ThreePaneAI, { "data-astro-cid-rs35j4zi": true }, { "center": async ($$result3) => renderTemplate`<div data-astro-cid-rs35j4zi> <h2 class="text-2xl font-bold text-cyan-400 mb-4" data-astro-cid-rs35j4zi>đźŽ¨ Text-to-Image Generator</h2> <div class="mb-6" data-astro-cid-rs35j4zi> <div class="flex items-center justify-between mb-3" data-astro-cid-rs35j4zi> <label for="imagePrompt" class="block text-xl font-semibold text-primary-foreground" data-astro-cid-rs35j4zi>Opis obrazu</label> <div class="flex gap-3" data-astro-cid-rs35j4zi> <button id="openPromptEnhancerBtn" class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors" onclick="openPromptEnhancer()" data-astro-cid-rs35j4zi>đź”§ OtwĂłrz enhancer</button> <button id="enhancePromptBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium transition-colors" onclick="enhancePrompt()" data-astro-cid-rs35j4zi>âś¨ Ulepsz prompt</button> </div> </div> <textarea id="imagePrompt" rows="6" class="w-full p-4 text-primary-foreground placeholder-gray-400 focus:outline-none resize-none text-lg" style="background: rgba(0,0,0,0.5);" placeholder="Opisz swĂłj obraz szczegĂłĹ‚owo. Np: Futurystyczne miasto o zachodzie sĹ‚oĹ„ca, neonowe Ĺ›wiatĹ‚a odbijajÄ…ce siÄ™ w szkle drapaczy chmur, styl cyberpunk, 4K, bardzo szczegĂłĹ‚owe..." data-astro-cid-rs35j4zi></textarea> </div> <div class="mb-6" data-astro-cid-rs35j4zi> <h3 class="text-lg font-semibold text-cyan-400 mb-4 flex items-center" data-astro-cid-rs35j4zi><span class="mr-2" data-astro-cid-rs35j4zi>đźŽ­</span> Galeria ArtystĂłw (1000+ stylĂłw)</h3> ${renderComponent($$result3, "ArtistsGallery", $$ArtistsGallery, { "data-astro-cid-rs35j4zi": true })} </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6" data-astro-cid-rs35j4zi> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>API Provider</label> <select id="apiProvider" class="w-full p-3 text-primary-foreground" style="background: rgba(0,0,0,0.5);" onchange="updateModelOptions()" data-astro-cid-rs35j4zi> <option value="cloudflare" selected data-astro-cid-rs35j4zi>Cloudflare Workers AI</option> <option value="huggingface" data-astro-cid-rs35j4zi>Hugging Face API</option> </select> </div> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Model</label> <select id="imageModel" class="w-full p-3 text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="@cf/stabilityai/stable-diffusion-xl-base-1.0" selected data-astro-cid-rs35j4zi>Stable Diffusion XL</option> <option value="@cf/lykon/dreamshaper-8-lcm" data-astro-cid-rs35j4zi>DreamShaper 8 LCM</option> <option value="@cf/black-forest-labs/flux-1-schnell" data-astro-cid-rs35j4zi>Flux-1 Schnell</option> <option value="@cf/runwayml/stable-diffusion-v1-5" data-astro-cid-rs35j4zi>Stable Diffusion v1.5</option> </select> </div> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Styl</label> <select id="imageStyle" class="w-full p-3 text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="photographic" data-astro-cid-rs35j4zi>Fotograficzny</option> <option value="artistic" data-astro-cid-rs35j4zi>Artystyczny</option> <option value="digital" data-astro-cid-rs35j4zi>Cyfrowy</option> <option value="anime" data-astro-cid-rs35j4zi>Anime</option> <option value="abstract" data-astro-cid-rs35j4zi>Abstrakcyjny</option> </select> </div> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Rozmiar</label> <select id="imageSize" class="w-full p-3 text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="512x512" data-astro-cid-rs35j4zi>512Ă—512 (kwadrat)</option> <option value="768x512" data-astro-cid-rs35j4zi>768Ă—512 (poziomo)</option> <option value="512x768" data-astro-cid-rs35j4zi>512Ă—768 (pionowo)</option> <option value="1024x1024" data-astro-cid-rs35j4zi>1024Ă—1024 (duĹĽy)</option> </select> </div> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Kroki</label> <select id="imageSteps" class="w-full p-3 text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="15" data-astro-cid-rs35j4zi>15</option> <option value="25" selected data-astro-cid-rs35j4zi>25</option> <option value="35" data-astro-cid-rs35j4zi>35</option> <option value="50" data-astro-cid-rs35j4zi>50</option> </select> </div> </div> <div class="mb-6" data-astro-cid-rs35j4zi> <button id="generateBtn" class="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white py-4 px-6 font-bold text-xl rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg" onclick="console.log('Button clicked!'); generateImage();" data-astro-cid-rs35j4zi>đźŽ¨ Generuj Obraz</button> </div> <div class="mb-6 text-right" data-astro-cid-rs35j4zi> <button id="toggleAdvancedBtn" type="button" class="text-xs px-3 py-1 rounded border border-cyan-600/40 text-cyan-300 hover:bg-cyan-600/10 transition" onclick="toggleAdvancedSettings()" data-astro-cid-rs35j4zi>âš™ď¸Ź Zaawansowane</button> </div> <div id="advancedSettings" class="mb-6 hidden text-left border border-cyan-600/30 rounded-lg p-4 bg-black/40 space-y-4" data-astro-cid-rs35j4zi> <h3 class="text-cyan-300 font-semibold text-sm tracking-wide" data-astro-cid-rs35j4zi>Zaawansowane Ustawienia</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-astro-cid-rs35j4zi> <div data-astro-cid-rs35j4zi> <label class="block text-xs uppercase tracking-wide text-gray-400 mb-1" data-astro-cid-rs35j4zi>Negative Prompt</label> <textarea id="negativePrompt" rows="2" class="w-full p-2 text-xs bg-black/50 border border-gray-700 rounded focus:outline-none focus:border-cyan-500 text-gray-200" placeholder="artefakty, rozmazane, znieksztaĹ‚cone..." data-astro-cid-rs35j4zi></textarea> </div> <div data-astro-cid-rs35j4zi> <label class="block text-xs uppercase tracking-wide text-gray-400 mb-1" data-astro-cid-rs35j4zi>Seed</label> <input id="seedInput" type="number" class="w-full p-2 text-xs bg-black/50 border border-gray-700 rounded focus:outline-none focus:border-cyan-500 text-gray-200" placeholder="Losowy jeĹ›li puste" data-astro-cid-rs35j4zi> </div> <div data-astro-cid-rs35j4zi> <label class="block text-xs uppercase tracking-wide text-gray-400 mb-1" data-astro-cid-rs35j4zi>Guidance</label> <input id="guidanceScale" type="number" step="0.5" min="1" max="30" value="7.5" class="w-full p-2 text-xs bg-black/50 border border-gray-700 rounded focus:outline-none focus:border-cyan-500 text-gray-200" data-astro-cid-rs35j4zi> </div> <div data-astro-cid-rs35j4zi> <label class="block text-xs uppercase tracking-wide text-gray-400 mb-1" data-astro-cid-rs35j4zi>Batch</label> <input id="batchCount" type="number" min="1" max="6" value="1" class="w-full p-2 text-xs bg-black/50 border border-gray-700 rounded focus:outline-none focus:border-cyan-500 text-gray-200" data-astro-cid-rs35j4zi> </div> <div data-astro-cid-rs35j4zi> <label class="block text-xs uppercase tracking-wide text-gray-400 mb-1" data-astro-cid-rs35j4zi>CFG (HF)</label> <input id="cfgScale" type="number" step="0.5" min="1" max="30" value="7.5" class="w-full p-2 text-xs bg-black/50 border border-gray-700 rounded focus:outline-none focus:border-cyan-500 text-gray-200" data-astro-cid-rs35j4zi> </div> <div class="flex items-end gap-2" data-astro-cid-rs35j4zi> <label class="flex items-center gap-2 text-xs text-gray-300" data-astro-cid-rs35j4zi><input id="tilingToggle" type="checkbox" class="accent-cyan-500" data-astro-cid-rs35j4zi> Tiling</label> <label class="flex items-center gap-2 text-xs text-gray-300" data-astro-cid-rs35j4zi><input id="hiResToggle" type="checkbox" class="accent-cyan-500" data-astro-cid-rs35j4zi> Hi-Res</label> </div> </div> <div class="pt-2 border-t border-cyan-600/20 text-[10px] text-gray-400 leading-relaxed" data-astro-cid-rs35j4zi>
Te ustawienia sÄ… opcjonalne. Wysokie wartoĹ›ci guidance/CFG mogÄ… powodowaÄ‡ utratÄ™ kreatywnoĹ›ci. Batch > 1 generuje kilka wariantĂłw sekwencyjnie.
</div> </div> <div id="batchResults" class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 hidden" data-astro-cid-rs35j4zi></div> <div id="loading" class="text-center py-4 hidden" data-astro-cid-rs35j4zi> <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-4 border-cyan-400" data-astro-cid-rs35j4zi></div> <p class="mt-2 text-sm text-muted-foreground" data-astro-cid-rs35j4zi>Generowanie obrazu...</p> </div> <div id="previewWindow" class="hidden" data-astro-cid-rs35j4zi> <div class="border border-cyan-400/30 p-4 glass-effect rounded-lg" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <div class="mb-4" data-astro-cid-rs35j4zi> <div class="flex justify-between text-sm text-gray-300 mb-2" data-astro-cid-rs35j4zi> <span id="progressLabel" data-astro-cid-rs35j4zi>Przygotowywanie...</span> <span id="progressPercent" data-astro-cid-rs35j4zi>0%</span> </div> <div class="w-full bg-gray-700 rounded-full h-3" data-astro-cid-rs35j4zi> <div id="progressBar" class="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500" style="width: 0%" data-astro-cid-rs35j4zi></div> </div> </div> <div class="aspect-square bg-gray-900/50 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden" data-astro-cid-rs35j4zi> <div id="placeholderContent" class="text-center" data-astro-cid-rs35j4zi> <div class="animate-pulse" data-astro-cid-rs35j4zi> <div class="w-16 h-16 bg-cyan-400/20 rounded-full mx-auto mb-3 flex items-center justify-center" data-astro-cid-rs35j4zi><span class="text-2xl" data-astro-cid-rs35j4zi>đźŽ¨</span></div> <p class="text-gray-400" data-astro-cid-rs35j4zi>Generowanie obrazu...</p> </div> </div> <img id="previewImage" class="hidden w-full h-full object-contain rounded-lg" alt="PodglÄ…d obrazu" data-astro-cid-rs35j4zi> </div> </div> </div> <div id="errorBox" class="mt-4 p-3 bg-red-900/50 border border-red-600 rounded-lg hidden text-red-200" data-astro-cid-rs35j4zi></div> </div>`, "left": async ($$result3) => renderTemplate`<div data-astro-cid-rs35j4zi> <h2 class="text-xl font-bold text-purple-400 mb-4 flex items-center" data-astro-cid-rs35j4zi> <span class="mr-2" data-astro-cid-rs35j4zi>đź—‚ď¸Ź</span> Historia Generacji
</h2> <p class="text-sm text-gray-300 mb-6" data-astro-cid-rs35j4zi>Interaktywny chat z historiÄ… twoich obrazĂłw</p> <div class="h-[600px]" data-astro-cid-rs35j4zi>${renderComponent($$result3, "ChatHistoryHTML", $$ChatHistoryHTML, { "data-astro-cid-rs35j4zi": true })}</div> <div class="mt-4 grid grid-cols-2 gap-3 text-center" data-astro-cid-rs35j4zi> <div class="bg-gray-800/50 rounded border border-cyan-600/30 p-3" data-astro-cid-rs35j4zi> <div class="text-cyan-400 font-bold text-lg" id="totalGenerated" data-astro-cid-rs35j4zi>0</div> <div class="text-gray-400 text-xs" data-astro-cid-rs35j4zi>Wygenerowane</div> </div> <div class="bg-gray-800/50 rounded border border-purple-600/30 p-3" data-astro-cid-rs35j4zi> <div class="text-purple-400 font-bold text-lg" id="todayGenerated" data-astro-cid-rs35j4zi>0</div> <div class="text-gray-400 text-xs" data-astro-cid-rs35j4zi>Dzisiaj</div> </div> </div> </div>`, "right": async ($$result3) => renderTemplate`<div data-astro-cid-rs35j4zi> <h2 class="text-xl font-bold text-orange-400 mb-4 flex items-center" data-astro-cid-rs35j4zi><span class="mr-2" data-astro-cid-rs35j4zi>đź“¸</span> AI CHATBOX</h2> <p class="text-sm text-gray-300 mb-6" data-astro-cid-rs35j4zi>Przetwarzanie obrazu na obraz z AI</p> <div class="mb-6 p-4 bg-gray-800/50 rounded-lg border border-orange-600/30" data-astro-cid-rs35j4zi> <h3 class="text-sm font-bold text-orange-300 mb-3" data-astro-cid-rs35j4zi>1. ZDJÄCIE</h3> <div class="aspect-square bg-gray-900/50 rounded border-2 border-dashed border-orange-600/50 flex items-center justify-center mb-3" id="photoUploadPreview" data-astro-cid-rs35j4zi> <div class="text-center" data-astro-cid-rs35j4zi><span class="text-orange-400 text-2xl mb-2 block" data-astro-cid-rs35j4zi>đź“·</span><span class="text-gray-400 text-xs" data-astro-cid-rs35j4zi>PrzeciÄ…gnij lub kliknij</span></div> </div> <input type="file" id="photoToPhotoImage" class="w-full p-2 text-xs text-primary-foreground rounded" style="background: rgba(0,0,0,0.5);" accept="image/*" data-astro-cid-rs35j4zi> </div> <div class="mb-6 p-4 bg-gray-800/50 rounded-lg border border-orange-600/30" data-astro-cid-rs35j4zi> <h3 class="text-sm font-bold text-orange-300 mb-3" data-astro-cid-rs35j4zi>2. AI CHAT PROMPT</h3> <div class="chat-input-container mb-3" data-astro-cid-rs35j4zi> <div class="flex items-end gap-2" data-astro-cid-rs35j4zi> <div class="flex-1 relative" data-astro-cid-rs35j4zi> <textarea id="photoPrompt" rows="3" class="w-full p-3 text-sm text-primary-foreground placeholder-gray-400 focus:outline-none resize-none chat-input" style="background: rgba(0,0,0,0.7); border: 1px solid rgba(79, 209, 197, 0.3); border-radius: 8px;" placeholder="Opisz jak chcesz przeksztaĹ‚ciÄ‡ obraz... đź’¬" data-astro-cid-rs35j4zi></textarea> </div> <button id="sendChatPrompt" class="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white p-3 rounded-lg transition-all duration-300 flex items-center justify-center" onclick="sendChatMessage()" style="min-width: 45px; height: 45px;" data-astro-cid-rs35j4zi>đź“¤</button> </div> </div> <div class="chat-messages-area bg-gray-900/50 rounded-lg p-3 mb-3" style="height: 120px; overflow-y: auto; border: 1px solid rgba(147, 51, 234, 0.3);" data-astro-cid-rs35j4zi> <div id="chatMessagesArea" class="space-y-2" data-astro-cid-rs35j4zi> <div class="text-center text-gray-500 text-xs" data-astro-cid-rs35j4zi>đź’­ Rozpocznij konwersacjÄ™ z AI...</div> </div> </div> <button id="generatePhotoToPhotoBtn" class="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-2 px-4 font-bold text-sm rounded-lg transition-all duration-300" onclick="generatePhotoToPhotoImage()" data-astro-cid-rs35j4zi>đźŽ¨ PrzetwĂłrz Obraz z AI</button> </div> <div class="p-4 bg-gray-800/50 rounded-lg border border-orange-600/30" data-astro-cid-rs35j4zi> <h3 class="text-sm font-bold text-orange-300 mb-3" data-astro-cid-rs35j4zi>3. REZULTAT</h3> <div class="aspect-square bg-gray-900/50 rounded border border-orange-600/30 flex items-center justify-center" id="photoResult" data-astro-cid-rs35j4zi> <div class="text-center" data-astro-cid-rs35j4zi><span class="text-orange-400 text-2xl mb-2 block" data-astro-cid-rs35j4zi>âś¨</span><span class="text-gray-400 text-xs" data-astro-cid-rs35j4zi>Przetworzony obraz</span></div> </div> <div id="loadingPhotoToPhoto" class="text-center py-3 hidden" data-astro-cid-rs35j4zi><div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400" data-astro-cid-rs35j4zi></div><p class="mt-1 text-xs text-muted-foreground" data-astro-cid-rs35j4zi>Przetwarzanie...</p></div> <div id="errorBoxPhotoToPhoto" class="mt-3 p-2 bg-red-900/50 border border-red-600 rounded hidden text-red-200 text-xs" data-astro-cid-rs35j4zi></div> </div> </div>` })} <!-- Result Section --> <div id="resultSection" class="hidden mt-8 max-w-4xl mx-auto" data-astro-cid-rs35j4zi> <h3 class="text-2xl font-semibold mb-4 text-primary-foreground" data-astro-cid-rs35j4zi>âś… Wygenerowany obraz</h3> <div class="border border-green-500/30 rounded-lg p-4" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <img id="generatedImage" class="w-full rounded mb-4 cursor-pointer hover:scale-105 transition-transform" alt="Wygenerowany obraz" onclick="openImageModal()" data-astro-cid-rs35j4zi> <div class="flex gap-2 flex-wrap justify-center" data-astro-cid-rs35j4zi> <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm" onclick="downloadImage()" data-astro-cid-rs35j4zi>đź’ľ Pobierz</button> <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" onclick="shareImage()" data-astro-cid-rs35j4zi>đź“¤ UdostÄ™pnij</button> <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm" onclick="generateVariation()" data-astro-cid-rs35j4zi>đź”„ Wariacja</button> <button class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm" onclick="openImageModal()" data-astro-cid-rs35j4zi>đź”Ť PeĹ‚ny ekran</button> </div> </div> </div> <!-- Prompt Enhancer Modal --> ${renderComponent($$result2, "PromptEnhancerModal", $$PromptEnhancerModal, { "data-astro-cid-rs35j4zi": true })} <!-- Full Screen Image Modal --> <div id="imageModal" class="fixed inset-0 bg-black/90 backdrop-blur-sm hidden z-50" onclick="closeImageModal(event)" data-astro-cid-rs35j4zi> <div class="flex items-center justify-center min-h-screen p-4" data-astro-cid-rs35j4zi> <div class="relative max-w-7xl w-full" data-astro-cid-rs35j4zi> <button onclick="closeImageModal()" class="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-xl z-10" data-astro-cid-rs35j4zi>Ă—</button> <img id="modalImage" class="w-full h-auto max-h-[90vh] object-contain rounded-lg" alt="Obraz w peĹ‚nej rozdzielczoĹ›ci" data-astro-cid-rs35j4zi> <div class="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3" data-astro-cid-rs35j4zi> <p id="modalPrompt" class="text-white text-sm mb-2" data-astro-cid-rs35j4zi></p> <div class="flex gap-2 justify-center" data-astro-cid-rs35j4zi> <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm" onclick="downloadImageFromModal()" data-astro-cid-rs35j4zi>đź’ľ Pobierz</button> <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" onclick="shareImageFromModal()" data-astro-cid-rs35j4zi>đź“¤ UdostÄ™pnij</button> </div> </div> </div> </div> </div> </div> </section>  ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/image-generator.astro?astro&type=script&index=0&lang.ts")}  </main> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/image-generator.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/image-generator.astro";
=======
/* empty css                                  */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_DdWhmxse.mjs';
/* empty css                                           */
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

const $$ImageGenerator = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "Generator Obraz\xF3w | AI Workers", "description": "Generuj obrazy z tekstu za pomoc\u0105 Cloudflare AI.", "data-astro-cid-rs35j4zi": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-svh" data-astro-cid-rs35j4zi> <section class="ai-workers-section py-10" data-astro-cid-rs35j4zi> <div class="section-container max-w-4xl mx-auto" data-astro-cid-rs35j4zi> <h1 class="section-title" data-astro-cid-rs35j4zi>GENERATOR OBRAZÓW AI</h1> <p class="section-description" data-astro-cid-rs35j4zi>
Podaj opis i wybierz parametry. Otrzymasz PNG bezpośrednio z serwera.
</p> <div class="border border-edge rounded-lg p-6 mt-6" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <!-- Prompt --> <div class="mb-5" data-astro-cid-rs35j4zi> <label for="imagePrompt" class="block text-lg font-semibold mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Opis obrazu</label> <textarea id="imagePrompt" rows="3" class="w-full p-3 border border-edge rounded text-primary-foreground placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none" style="background: rgba(0,0,0,0.5);" placeholder="Np. Futurystyczne miasto o zachodzie słońca, styl fotograficzny, 4K" data-astro-cid-rs35j4zi></textarea> </div> <!-- Controls --> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5" data-astro-cid-rs35j4zi> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Model</label> <select id="imageModel" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="@cf/stabilityai/stable-diffusion-xl-base-1.0" data-astro-cid-rs35j4zi>Stable Diffusion XL</option> <option value="@cf/lykon/dreamshaper-8-lcm" data-astro-cid-rs35j4zi>DreamShaper 8 LCM</option> <option value="@cf/black-forest-labs/flux-1-schnell" data-astro-cid-rs35j4zi>Flux-1 Schnell</option> </select> </div> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Styl</label> <select id="imageStyle" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="photographic" data-astro-cid-rs35j4zi>Fotograficzny</option> <option value="artistic" data-astro-cid-rs35j4zi>Artystyczny</option> <option value="digital" data-astro-cid-rs35j4zi>Cyfrowy</option> <option value="anime" data-astro-cid-rs35j4zi>Anime</option> <option value="abstract" data-astro-cid-rs35j4zi>Abstrakcyjny</option> </select> </div> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Rozmiar</label> <select id="imageSize" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="512x512" data-astro-cid-rs35j4zi>512×512 (kwadrat)</option> <option value="768x512" data-astro-cid-rs35j4zi>768×512 (poziomo)</option> <option value="512x768" data-astro-cid-rs35j4zi>512×768 (pionowo)</option> <option value="1024x1024" data-astro-cid-rs35j4zi>1024×1024 (duży)</option> </select> </div> <div data-astro-cid-rs35j4zi> <label class="block text-sm font-medium mb-2 text-primary-foreground" data-astro-cid-rs35j4zi>Kroki</label> <select id="imageSteps" class="w-full p-2 border border-edge rounded text-primary-foreground" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <option value="15" data-astro-cid-rs35j4zi>15</option> <option value="25" data-astro-cid-rs35j4zi>25</option> <option value="35" data-astro-cid-rs35j4zi>35</option> <option value="50" data-astro-cid-rs35j4zi>50</option> </select> </div> </div> <!-- Action --> <div class="mb-5" data-astro-cid-rs35j4zi> <button id="generateBtn" class="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onclick="generateImage()" data-astro-cid-rs35j4zi>🎨 Generuj Obraz</button> </div> <!-- Loading --> <div id="loading" class="text-center py-3 hidden" data-astro-cid-rs35j4zi> <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" data-astro-cid-rs35j4zi></div> <p class="mt-2 text-muted-foreground" data-astro-cid-rs35j4zi>Generowanie obrazu...</p> </div> <!-- Error --> <div id="errorBox" class="mt-3 p-3 bg-red-900/50 border border-red-600 rounded hidden text-red-200" data-astro-cid-rs35j4zi></div> <!-- Result --> <div id="resultSection" class="hidden mt-5" data-astro-cid-rs35j4zi> <h3 class="text-xl font-semibold mb-3 text-primary-foreground" data-astro-cid-rs35j4zi>
Wygenerowany obraz
</h3> <div class="border border-edge rounded-lg p-3" style="background: rgba(0,0,0,0.5);" data-astro-cid-rs35j4zi> <img id="generatedImage" class="w-full rounded mb-3" alt="Wygenerowany obraz" data-astro-cid-rs35j4zi> <div class="flex gap-2 flex-wrap" data-astro-cid-rs35j4zi> <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm" onclick="downloadImage()" data-astro-cid-rs35j4zi>💾 Pobierz</button> <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" onclick="shareImage()" data-astro-cid-rs35j4zi>📤 Udostępnij</button> <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm" onclick="generateVariation()" data-astro-cid-rs35j4zi>🔄 Wariacja</button> </div> </div> </div> </div> <!-- History --> <div class="mt-8" data-astro-cid-rs35j4zi> <h3 class="text-xl font-semibold mb-3 text-primary-foreground" data-astro-cid-rs35j4zi>
Historia
</h3> <div id="historyGrid" class="grid grid-cols-2 md:grid-cols-4 gap-4" data-astro-cid-rs35j4zi></div> </div> </div> </section> </main> ` })}  ${renderScript($$result, "Q:/mybonzo/mybonzo-github/src/pages/image-generator.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/mybonzo-github/src/pages/image-generator.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/image-generator.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "/image-generator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ImageGenerator,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
