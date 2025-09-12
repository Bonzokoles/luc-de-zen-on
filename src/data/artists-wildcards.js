// Baza 1000 artystów z ich dziełami i stylami
export const ARTISTS_DATABASE = [
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
export const ART_PERIODS = {
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

// Techniki malarskie
export const PAINTING_TECHNIQUES = [
  {
    name: "Olej na płótnie",
    description: "Klasyczna technika mistrzów",
    prompt: "oil on canvas, classical technique"
  },
  {
    name: "Akwarela",
    description: "Transparentne warstwy wodne",
    prompt: "watercolor painting, transparent layers"
  },
  {
    name: "Tempera",
    description: "Szybkoschnąca farba jajeczna",
    prompt: "tempera painting, egg-based medium"
  },
  {
    name: "Fresco",
    description: "Malarstwo na mokrym tynku",
    prompt: "fresco technique, wall painting"
  },
  {
    name: "Pastel",
    description: "Suche kredki artystyczne",
    prompt: "pastel drawing, soft colors"
  },
  {
    name: "Akryl",
    description: "Nowoczesna farba plastikowa",
    prompt: "acrylic painting, modern medium"
  },
  {
    name: "Mieszana",
    description: "Kombinacja różnych technik",
    prompt: "mixed media, combined techniques"
  }
];

// Kompozycje i style
export const COMPOSITION_STYLES = [
  {
    name: "Portret",
    description: "Przedstawienie osoby",
    prompt: "portrait composition, human subject"
  },
  {
    name: "Krajobraz",
    description: "Widoki natury",
    prompt: "landscape composition, natural scenery"
  },
  {
    name: "Natura martwa",
    description: "Przedmioty nieożywione",
    prompt: "still life composition, inanimate objects"
  },
  {
    name: "Scena rodzajowa",
    description: "Codzienne życie",
    prompt: "genre scene, everyday life"
  },
  {
    name: "Mitologia",
    description: "Tematy mitologiczne",
    prompt: "mythological scene, classical mythology"
  },
  {
    name: "Abstrakcja",
    description: "Formy niefiguratywne",
    prompt: "abstract composition, non-figurative"
  }
];

// Funkcje pomocnicze
export function getArtistsByPeriod(period) {
  return ARTISTS_DATABASE.filter(artist => artist.period === period);
}

export function getRandomArtist() {
  return ARTISTS_DATABASE[Math.floor(Math.random() * ARTISTS_DATABASE.length)];
}

export function searchArtists(query) {
  const lowercaseQuery = query.toLowerCase();
  return ARTISTS_DATABASE.filter(artist => 
    artist.name.toLowerCase().includes(lowercaseQuery) ||
    artist.style.toLowerCase().includes(lowercaseQuery) ||
    artist.period.toLowerCase().includes(lowercaseQuery) ||
    artist.description.toLowerCase().includes(lowercaseQuery)
  );
}

export function getArtistPrompt(artistName) {
  const artist = ARTISTS_DATABASE.find(a => a.name === artistName);
  return artist ? artist.prompt : null;
}
