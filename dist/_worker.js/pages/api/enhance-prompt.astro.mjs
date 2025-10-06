globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createOPTIONSHandler, a as createSuccessResponse, b as createErrorResponse } from '../../chunks/corsUtils_CwKkZG2q.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const artistStyles = [
  { "Name": "Aertsen, Pieter", "Prompt": "style of Pieter Aertsen", "Category": "Painting, Oil, Still Life, Portrait, Netherlands, 16th Century", "Type": "Classical" },
  { "Name": "Akira, Kurosawa", "Prompt": "style of Akira Kurosawa", "Category": "Movie Director, B&W, Japan", "Type": "Cinema" },
  { "Name": "Klimt, Gustav", "Prompt": "style of Gustav Klimt", "Category": "Painting, Oil, Symbolism, Art Nouveau, Austria, 19th Century", "Type": "Art Nouveau" },
  { "Name": "Van Gogh, Vincent Willem", "Prompt": "style of Vincent van Gogh", "Category": "Painting, Oil, Pointillism, Netherlands, 19th Century", "Type": "Post-Impressionist" },
  { "Name": "Picasso, Pablo", "Prompt": "style of Pablo Picasso", "Category": "Painting, Oil, Cubism, Spain", "Type": "Modern" },
  { "Name": "Warhol, Andy", "Prompt": "style of Andy Warhol", "Category": "Painting, Pop-Art, USA", "Type": "Pop Art" },
  { "Name": "Monet, Claude", "Prompt": "style of Claude Monet", "Category": "Painting, Oil, Landscape, Portrait, Impressionism, France, 19th Century", "Type": "Impressionist" },
  { "Name": "Dali, Salvador", "Prompt": "style of Salvador Dali", "Category": "Painting, Oil, Surrealism, Spain", "Type": "Surrealist" },
  { "Name": "Miyazaki, Hayao", "Prompt": "style of Hayao Miyazaki", "Category": "Movie Director, Anime, Ghibli, Japan", "Type": "Anime" },
  { "Name": "Banksy", "Prompt": "style of Banksy", "Category": "Street Art, Stencil, Graffiti, UK", "Type": "Street Art" },
  { "Name": "Basquiat, Jean-Michel", "Prompt": "style of Jean-Michel Basquiat", "Category": "Painting, Neo-Expressionism, Street Art, USA", "Type": "Neo-Expressionist" },
  { "Name": "Kaws", "Prompt": "style of Kaws", "Category": "Street Art, Pop Art, Sculpture, USA", "Type": "Contemporary" },
  { "Name": "Kusama, Yayoi", "Prompt": "style of Yayoi Kusama", "Category": "Painting, Sculpture, Pattern, Pop-Art, Japan", "Type": "Contemporary" },
  { "Name": "Hockney, David", "Prompt": "style of David Hockney", "Category": "Painting, Photography, Pop-Art, UK", "Type": "Pop Art" },
  { "Name": "Kahlo, Frida", "Prompt": "style of Frida Kahlo", "Category": "Painting, Oil, Portrait, Surrealism, Mexico", "Type": "Surrealist" },
  { "Name": "O'Keeffe, Georgia", "Prompt": "style of Georgia O'Keeffe", "Category": "Painting, Oil, USA", "Type": "American Modernist" },
  { "Name": "Pollock, Jackson", "Prompt": "style of Jackson Pollock", "Category": "Painting, Expressionism, USA", "Type": "Abstract Expressionist" },
  { "Name": "Rothko, Mark", "Prompt": "style of Mark Rothko", "Category": "Painting, Oil, Abstract, Expressionism, Russia, USA", "Type": "Abstract Expressionist" },
  { "Name": "Kandinsky, Wassily", "Prompt": "style of Wassily Kandinsky", "Category": "Painting, Expressionism, Abstract, Russia", "Type": "Abstract" },
  { "Name": "Matisse, Henri", "Prompt": "style of Henri Matisse", "Category": "Painting, Oil, Gouache, France", "Type": "Fauvism" },
  { "Name": "Cézanne, Paul", "Prompt": "style of Paul Cézanne", "Category": "Painting, Oil, Post-Impressionism, France", "Type": "Post-Impressionist" },
  { "Name": "Rembrandt, van Rijn", "Prompt": "style of Rembrandt", "Category": "Painting, Oil, Portrait, Baroque, Netherlands, 17th Century", "Type": "Baroque" },
  { "Name": "Leonardo, da Vinci", "Prompt": "style of Leonardo da Vinci", "Category": "Painting, Oil, Portrait, Renaissance, Italy, 15th Century", "Type": "Renaissance" },
  { "Name": "Munch, Edvard", "Prompt": "style of Edvard Munch", "Category": "Painting, Oil, Expressionism, Norway", "Type": "Expressionist" },
  { "Name": "Hokusai, Katsushika", "Prompt": "style of Katsushika Hokusai", "Category": "Woodblock Print, Ukiyo-e, Japan", "Type": "Japanese" },
  { "Name": "Turner, William", "Prompt": "style of William Turner", "Category": "Painting, Oil, Watercolor, Landscape, Romanticism, UK, 19th Century", "Type": "Romantic" },
  { "Name": "Caravaggio", "Prompt": "style of Caravaggio", "Category": "Painting, Oil, Portrait, Chiaroscuro, Baroque, Italy, 17th Century", "Type": "Baroque" },
  { "Name": "Manet, Édouard", "Prompt": "style of Édouard Manet", "Category": "Painting, Oil, Impressionism, France", "Type": "Impressionist" },
  { "Name": "Degas, Edgar", "Prompt": "style of Edgar Degas", "Category": "Painting, Oil, Pastel, Impressionism, France", "Type": "Impressionist" },
  { "Name": "Renoir, Pierre-Auguste", "Prompt": "style of Pierre-Auguste Renoir", "Category": "Painting, Oil, Portrait, Impressionism, France, 19th Century", "Type": "Impressionist" },
  { "Name": "Morisot, Berthe", "Prompt": "style of Berthe Morisot", "Category": "Painting, Oil, Portrait, France, 19th Century", "Type": "Impressionist" },
  { "Name": "Cassatt, Mary", "Prompt": "style of Mary Cassatt", "Category": "Painting, Oil, Pastel, Impressionism, USA", "Type": "Impressionist" },
  { "Name": "Magritte, René", "Prompt": "style of René Magritte", "Category": "Painting, Oil, Surrealism, Belgium", "Type": "Surrealist" },
  { "Name": "Ernst, Max", "Prompt": "style of Max Ernst", "Category": "Painting, Oil, Collage, Surrealism, Dada, Germany", "Type": "Surrealist" },
  { "Name": "Picabia, Francis", "Prompt": "style of Francis Picabia", "Category": "Painting, Oil, Watercolor, Portrait, Dada, Surrealism, Cubism, France", "Type": "Dada" },
  { "Name": "Duchamp, Marcel", "Prompt": "style of Marcel Duchamp", "Category": "Conceptual Art, Dada, Sculpture, France", "Type": "Dada" },
  { "Name": "Klee, Paul", "Prompt": "style of Paul Klee", "Category": "Painting, Oil, Watercolor, Expressionism, Bauhaus, Switzerland", "Type": "Bauhaus" },
  { "Name": "Mondrian, Piet", "Prompt": "style of Piet Mondrian", "Category": "Painting, Oil, De Stijl, Abstract, Netherlands", "Type": "De Stijl" },
  { "Name": "Lichtenstein, Roy", "Prompt": "style of Roy Lichtenstein", "Category": "Painting, Pop-Art, USA", "Type": "Pop Art" },
  { "Name": "Johns, Jasper", "Prompt": "style of Jasper Johns", "Category": "Painting, Sculpture, Neo-Dada, USA", "Type": "Neo-Dada" },
  { "Name": "Rauschenberg, Robert", "Prompt": "style of Robert Rauschenberg", "Category": "Painting, Collage, Neo-Dada, USA", "Type": "Neo-Dada" },
  { "Name": "Koons, Jeff", "Prompt": "style of Jeff Koons, sculpture", "Category": "Sculpture, Postmodernism, USA", "Type": "Contemporary" },
  { "Name": "Hirst, Damien", "Prompt": "style of Damien Hirst", "Category": "Conceptual Art, Installation, UK", "Type": "Contemporary" },
  { "Name": "Sherman, Cindy", "Prompt": "style of Cindy Sherman", "Category": "Photography, Portrait, USA", "Type": "Contemporary" },
  { "Name": "Kruger, Barbara", "Prompt": "style of Barbara Kruger", "Category": "Photography, Graphic Design, Text Art, USA", "Type": "Contemporary" },
  { "Name": "Kiefer, Anselm", "Prompt": "style of Anselm Kiefer", "Category": "Painting, Oil, Acrylic, Germany", "Type": "Contemporary" },
  { "Name": "Richter, Gerhard", "Prompt": "style of Gerhard Richter", "Category": "Painting, Oil, Photo-realism, Abstract, Germany", "Type": "Contemporary" },
  { "Name": "Bacon, Francis", "Prompt": "style of Francis Bacon", "Category": "Painting, Oil, Expressionism, UK", "Type": "Modern" },
  { "Name": "Freud, Lucian", "Prompt": "style of Lucian Freud", "Category": "Painting, Oil, Portrait, Realism, UK", "Type": "Contemporary" },
  { "Name": "Diebenkorn, Richard", "Prompt": "style of Richard Diebenkorn", "Category": "Painting, Oil, Abstract, USA", "Type": "Abstract" },
  { "Name": "Frankenthaler, Helen", "Prompt": "style of Helen Frankenthaler", "Category": "Painting, Acrylic, Color Field, USA", "Type": "Abstract" },
  { "Name": "Newman, Barnett", "Prompt": "style of Barnett Newman", "Category": "Painting, Color Field, Abstract Expressionism, USA", "Type": "Abstract" },
  { "Name": "Still, Clyfford", "Prompt": "style of Clyfford Still", "Category": "Painting, Oil, Abstract Expressionism, USA", "Type": "Abstract" },
  { "Name": "de Kooning, Willem", "Prompt": "style of Willem de Kooning", "Category": "Painting, Oil, Abstract, Expressionism, Netherlands, USA", "Type": "Abstract" }
];
const artMediaTypes = [
  "Photo, DSLR",
  "Analog Photo",
  "Lomography Photo",
  "Pinhole Photo",
  "BW Photo",
  "Wet-Plate Photo",
  "Painting",
  "Oil Painting",
  "Watercolor",
  "Acrylic",
  "Gouache",
  "Tempera",
  "Fresco",
  "Encaustic",
  "Drawing",
  "Pencil",
  "Charcoal",
  "Pastel",
  "Ink",
  "Pen and Ink",
  "Conte Crayon",
  "Graphite",
  "Print",
  "Lithography",
  "Woodcut",
  "Engraving",
  "Etching",
  "Screen Print",
  "Linoleum Print",
  "Digital Art",
  "Concept Art",
  "Matte Painting",
  "3D Render",
  "Pixel Art",
  "Vector Art",
  "Mixed Media",
  "Collage",
  "Mosaic",
  "Stained Glass",
  "Tapestry",
  "Embroidery",
  "Sculpture",
  "Bronze",
  "Marble",
  "Clay",
  "Wood Carving",
  "Stone Carving",
  "Metal Work",
  "Street Art",
  "Graffiti",
  "Mural",
  "Stencil Art",
  "Spray Paint"
];
const negativePrompts = [
  "blurry",
  "low quality",
  "pixelated",
  "jpeg artifacts",
  "watermark",
  "signature",
  "text",
  "logo",
  "username",
  "worst quality",
  "low res",
  "normal quality",
  "amateur",
  "poor composition",
  "bad anatomy",
  "deformed",
  "mutated",
  "extra limbs",
  "missing limbs",
  "floating limbs",
  "disconnected limbs",
  "malformed hands",
  "poor hands",
  "mutated hands",
  "ugly",
  "disgusting",
  "gross",
  "disturbing",
  "nsfw"
];
const colorPalettes = {
  cyberpunk: ["neon colors", "electric blue", "hot pink", "acid green", "purple glow", "chrome", "metallic"],
  vintage: ["sepia tone", "muted colors", "warm browns", "cream", "faded colors", "nostalgic"],
  monochrome: ["black and white", "grayscale", "high contrast", "noir", "chiaroscuro"],
  pastel: ["soft pastels", "light colors", "powder blue", "mint green", "lavender", "peach"],
  vibrant: ["saturated colors", "bold colors", "rainbow", "bright", "vivid", "intense"],
  earth: ["earth tones", "browns", "greens", "ochre", "natural colors", "organic"],
  ocean: ["blue tones", "turquoise", "teal", "aqua", "deep blue", "sea foam"],
  sunset: ["warm colors", "orange", "red", "yellow", "golden", "amber"],
  forest: ["green tones", "moss green", "forest green", "natural green", "emerald"],
  cosmic: ["deep purple", "dark blue", "starlight", "galaxy colors", "nebula", "cosmic"]
};
function enhancePrompt(originalPrompt, options = {}) {
  let enhancedPrompt = originalPrompt.trim();
  let suggestions = [];
  if (options.artistStyle) {
    const artist = artistStyles.find(
      (a) => a.Name.toLowerCase().includes(options.artistStyle.toLowerCase()) || options.artistStyle.toLowerCase().includes(a.Name.toLowerCase())
    );
    if (artist) {
      enhancedPrompt = `${artist.Prompt}, ${enhancedPrompt}`;
      suggestions.push(`Applied ${artist.Name} artistic style`);
    } else {
      enhancedPrompt = `style of ${options.artistStyle}, ${enhancedPrompt}`;
      suggestions.push(`Applied custom artistic style: ${options.artistStyle}`);
    }
  }
  if (options.mediaType) {
    const mediaMatch = artMediaTypes.find(
      (m) => m.toLowerCase().includes(options.mediaType.toLowerCase())
    );
    if (mediaMatch) {
      enhancedPrompt = `${mediaMatch}, ${enhancedPrompt}`;
      suggestions.push(`Applied medium: ${mediaMatch}`);
    } else {
      enhancedPrompt = `${options.mediaType}, ${enhancedPrompt}`;
      suggestions.push(`Applied custom medium: ${options.mediaType}`);
    }
  }
  if (options.colorPalette && colorPalettes[options.colorPalette]) {
    const palette = colorPalettes[options.colorPalette];
    const selectedColors = palette.slice(0, 2).join(", ");
    enhancedPrompt = `${enhancedPrompt}, ${selectedColors}`;
    suggestions.push(`Applied ${options.colorPalette} color palette`);
  }
  if (options.mood) {
    const moodDescriptors = {
      dramatic: "dramatic lighting, intense atmosphere, high contrast",
      peaceful: "serene, calm, peaceful atmosphere, soft lighting",
      mysterious: "mysterious, enigmatic, shadowy, atmospheric",
      energetic: "dynamic, energetic, vibrant, action-packed",
      romantic: "romantic, dreamy, soft focus, warm lighting",
      futuristic: "futuristic, sci-fi, advanced technology, sleek design",
      vintage: "vintage, retro, nostalgic, aged, classic",
      dark: "dark atmosphere, moody, gothic, dramatic shadows",
      bright: "bright, cheerful, uplifting, sunny, optimistic",
      surreal: "surreal, dreamlike, fantastical, otherworldly"
    };
    if (moodDescriptors[options.mood]) {
      enhancedPrompt = `${enhancedPrompt}, ${moodDescriptors[options.mood]}`;
      suggestions.push(`Applied ${options.mood} mood`);
    }
  }
  let qualityTerms = [];
  switch (options.quality) {
    case "ultra":
      qualityTerms = ["masterpiece", "best quality", "ultra detailed", "8k resolution", "award winning", "professional"];
      break;
    case "high":
      qualityTerms = ["high quality", "detailed", "professional", "sharp focus"];
      break;
    default:
      qualityTerms = ["good quality", "detailed"];
  }
  if (qualityTerms.length > 0) {
    enhancedPrompt = `${enhancedPrompt}, ${qualityTerms.join(", ")}`;
    suggestions.push(`Applied ${options.quality || "standard"} quality enhancements`);
  }
  if (options.enhanceCreativity) {
    const creativeTerms = [
      "creative composition",
      "unique perspective",
      "artistic interpretation",
      "innovative design",
      "imaginative",
      "original"
    ];
    const selectedCreative = creativeTerms.slice(0, 2).join(", ");
    enhancedPrompt = `${enhancedPrompt}, ${selectedCreative}`;
    suggestions.push("Applied creativity enhancements");
  }
  const negativePrompt = negativePrompts.slice(0, 10).join(", ");
  return {
    enhancedPrompt,
    negativePrompt,
    suggestions
  };
}
function recommendArtistStyle(prompt) {
  const promptLower = prompt.toLowerCase();
  const recommendations = [];
  if (promptLower.includes("portrait") || promptLower.includes("face") || promptLower.includes("person")) {
    recommendations.push("Leonardo da Vinci", "Rembrandt", "John Singer Sargent", "Lucian Freud");
  }
  if (promptLower.includes("landscape") || promptLower.includes("nature") || promptLower.includes("mountain")) {
    recommendations.push("Claude Monet", "William Turner", "Caspar David Friedrich", "Thomas Moran");
  }
  if (promptLower.includes("abstract") || promptLower.includes("geometric")) {
    recommendations.push("Wassily Kandinsky", "Piet Mondrian", "Jackson Pollock", "Mark Rothko");
  }
  if (promptLower.includes("cyberpunk") || promptLower.includes("futuristic") || promptLower.includes("sci-fi")) {
    recommendations.push("Syd Mead", "H.R. Giger", "Blade Runner style", "Ghost in the Shell style");
  }
  if (promptLower.includes("anime") || promptLower.includes("manga") || promptLower.includes("japanese")) {
    recommendations.push("Hayao Miyazaki", "Akira Toriyama", "Makoto Shinkai", "Studio Ghibli style");
  }
  if (promptLower.includes("street") || promptLower.includes("graffiti") || promptLower.includes("urban")) {
    recommendations.push("Banksy", "Jean-Michel Basquiat", "Kaws", "street art style");
  }
  return recommendations.slice(0, 3);
}
const GET = async () => {
  return createSuccessResponse({
    message: "Enhanced Prompt Generator API is running",
    status: "active",
    methods: ["GET", "POST", "OPTIONS"],
    description: "Send POST with { prompt, options } to enhance prompts with artistic styles and wildcards",
    availableArtists: artistStyles.length,
    availableMediaTypes: artMediaTypes.length,
    supportedOptions: {
      style: "General style descriptor",
      artistStyle: "Specific artist name or style",
      mediaType: "Art medium (painting, photography, etc.)",
      colorPalette: Object.keys(colorPalettes),
      mood: ["dramatic", "peaceful", "mysterious", "energetic", "romantic", "futuristic", "vintage", "dark", "bright", "surreal"],
      quality: ["standard", "high", "ultra"],
      enhanceCreativity: "Boolean - add creative terms"
    }
  });
};
const POST = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { prompt: rawPrompt, options = {}, recommend = false } = body ?? {};
    if (!rawPrompt || typeof rawPrompt !== "string" || rawPrompt.trim().length < 3) {
      return createErrorResponse("A valid prompt is required (minimum 3 characters).", 400);
    }
    const prompt = rawPrompt.trim();
    let artistRecommendations = [];
    if (recommend) {
      artistRecommendations = recommendArtistStyle(prompt);
    }
    const enhancement = enhancePrompt(prompt, options);
    const usedArtist = options.artistStyle ? artistStyles.find(
      (a) => a.Name.toLowerCase().includes(options.artistStyle.toLowerCase()) || options.artistStyle.toLowerCase().includes(a.Name.toLowerCase())
    ) : null;
    return createSuccessResponse({
      original: prompt,
      enhanced: enhancement.enhancedPrompt,
      negativePrompt: enhancement.negativePrompt,
      suggestions: enhancement.suggestions,
      artistRecommendations,
      usedArtist,
      options,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      stats: {
        originalLength: prompt.length,
        enhancedLength: enhancement.enhancedPrompt.length,
        improvement: `${Math.round(enhancement.enhancedPrompt.length / prompt.length * 100)}% enhancement`
      }
    });
  } catch (error) {
    console.error("Prompt enhancement API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return createErrorResponse("Failed to enhance prompt.", 500, { details: errorMessage });
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
