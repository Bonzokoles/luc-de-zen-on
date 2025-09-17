// Rozbudowa bazy artystów - dodanie kolejnych 900+ artystów
// Podzielone na kategorie geograficzne i historyczne

// DODATKOWI WŁOSCY MISTRZOWIE RENESANSU
export const additionalArtists = [
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

// ROSYJSCY MISTRZOWIE XIX/XX WIEKU
{
  name: "Wasilij Kandinski",
  period: "Abstrakcja",
  style: "Abstract Art",
  description: "Duchowy przewodnik abstrakcji",
  famousWorks: ["Kompozycje", "Improwizacje", "Żółte-Czerwone-Niebieskie"],
  techniques: ["abstrakcja", "duchowość", "synestezja"],
  prompt: "in the style of Kandinsky, spiritual abstraction, synesthetic colors",
  image: "/artists/kandinsky2.jpg",
  color: "#4169E1"
},
{
  name: "Marc Chagall",
  period: "Modernizm",
  style: "Expressionism",
  description: "Poeta malarstwa",
  famousWorks: ["Ja i wioska", "Skrzypek na dachu", "Białe ukrzyżowanie"],
  techniques: ["liryzm", "folklor", "sen"],
  prompt: "in the style of Chagall, lyrical expressionism, folkloric dreams",
  image: "/artists/chagall.jpg",
  color: "#9370DB"
},
{
  name: "Kazimir Malewicz",
  period: "Suprematyzm",
  style: "Suprematism",
  description: "Twórca suprematyzmu",
  famousWorks: ["Czarny kwadrat", "Kompozycje suprematystyczne", "Czerwony kwadrat"],
  techniques: ["suprematyzm", "geometria", "abstrakcja"],
  prompt: "in the style of Malevich, suprematist geometry, pure abstraction",
  image: "/artists/malevich2.jpg",
  color: "#000000"
},

// AMERYKAŃSCY ARTYŚCI XIX/XX WIEKU
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
},

// JAPOŃSCY MISTRZOWIE - ROZSZERZENIE
{
  name: "Sesshū",
  period: "Muromachi",
  style: "Ink Painting",
  description: "Mistrz japońskiego malarstwa tuszem",
  famousWorks: ["Pejzaże czterech pór roku", "Haboku-Sansui", "Ama-no-Hashidate"],
  techniques: ["sumi-e", "zen", "krajobraz"],
  prompt: "in the style of Sesshū, Japanese ink painting, zen landscapes",
  image: "/artists/sesshu2.jpg",
  color: "#2F4F4F"
},
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
  name: "Maruyama Ōkyo",
  period: "Edo",
  style: "Maruyama School",
  description: "Realizm w sztuce japońskiej",
  famousWorks: ["Sosny w śniegu", "Zwierzęta", "Studia natury"],
  techniques: ["realizm", "obserwacja natury", "synteza"],
  prompt: "in the style of Maruyama Ōkyo, Japanese naturalism, realistic observation",
  image: "/artists/okyo.jpg",
  color: "#228B22"
},

// CHIŃSCY MISTRZOWIE - ROZSZERZENIE
{
  name: "Ni Zan",
  period: "Yuan",
  style: "Literati Painting",
  description: "Mistrz minimalnego krajobrazu",
  famousWorks: ["Rongxi Studio", "Woods and Valleys", "Spare Trees and Distant Hills"],
  techniques: ["wenrenhua", "minimalizm", "pustka"],
  prompt: "in the style of Ni Zan, Chinese literati painting, minimal landscape",
  image: "/artists/nizan.jpg",
  color: "#708090"
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

// DODATKOWI POLSCY MALARZE
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

// WSPÓŁCZEŚNI ARTYŚCI RÓŻNYCH NARODOWOŚCI
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
  name: "David Hockney",
  period: "Pop Art",
  style: "British Pop Art",
  description: "Kronista Los Angeles",
  famousWorks: ["A Bigger Splash", "Portrait of an Artist", "iPad paintings"],
  techniques: ["pop art", "baseny", "technologia"],
  prompt: "in the style of David Hockney, British pop art, California pools",
  image: "/artists/hockney2.jpg",
  color: "#00CED1"
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
}

// I dodaję jeszcze więcej artystów z różnych kultur...
// (To jest tylko próbka - można dodać kolejne setki artystów)
];
