if (typeof MessageChannel === 'undefined') {
  class __PolyfillPort {
    constructor(){ this.onmessage = null; }
    postMessage(data){ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> this.onmessage && this.onmessage(e)); }
    start(){} close(){}
  }
  class MessageChannel {
    constructor(){
      this.port1 = new __PolyfillPort();
      this.port2 = new __PolyfillPort();
      const dispatch = (target, data)=>{ const e={data}; (typeof queueMicrotask==='function'?queueMicrotask:(f)=>setTimeout(f,0))(()=> target.onmessage && target.onmessage(e)); };
      this.port1.postMessage = (d)=> dispatch(this.port2, d);
      this.port2.postMessage = (d)=> dispatch(this.port1, d);
    }
  }
  globalThis.MessageChannel = MessageChannel;
}
import { e as createAstro, c as createComponent, h as addAttribute, f as renderHead, q as renderSlot, a as renderTemplate, r as renderComponent, m as maybeRenderHead } from '../chunks/vendor_QZhDtzeH.mjs';
export { d as renderers } from '../chunks/vendor_QZhDtzeH.mjs';
/* empty css                                 */
import { R as React, r as reactExports, j as jsxRuntimeExports } from '../chunks/react_wu9MgIUH.mjs';

const $$Astro = createAstro("https://www.mybonzo.com");
const $$StableDiffusionLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StableDiffusionLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="pl" class="h-full"> <head><meta charset="UTF-8"><meta name="description" content="Stable Diffusion - Generator obrazów AI"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="h-full" style="background: linear-gradient(to bottom right, #000000 0%, #020a02 25%, #0a1a0a 50%, #020a02 75%, #000000 100%);"> <div class="min-h-full"> <header class="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between items-center py-4"> <div class="flex items-center"> <h1 class="text-2xl font-bold text-white">
🎨 Stable Diffusion Dev
</h1> </div> <nav class="flex space-x-4"> <a href="/" class="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
Generator
</a> <a href="/gallery" class="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
Galeria
</a> </nav> </div> </div> </header> <main class="flex-1"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="bg-slate-800/30 border-t border-slate-700"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> <p class="text-center text-slate-400 text-sm">
© 2025 Stable Diffusion Dev - Środowisko deweloperskie
</p> </div> </footer> </div> </body></html>`;
}, "Q:/mybonzo/luc-de-zen-on/src/layouts/StableDiffusionLayout.astro", void 0);

const StableDiffusionGenerator = () => {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
            
            .cyberpunk-container {
                background: #0a0a0a;
                position: relative;
                min-height: 100vh;
                font-family: 'Rajdhani', system-ui, sans-serif;
                overflow-x: hidden;
            }
            
            .circuit-traces-top {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 33.33vh;
                background-image: repeating-linear-gradient(
                    135deg,
                    transparent,
                    transparent 20px,
                    rgba(6,182,212,0.15) 20px,
                    rgba(6,182,212,0.15) 21px
                );
                pointer-events: none;
                z-index: 1;
            }
            
            .circuit-traces-middle {
                position: fixed;
                top: 33.33vh;
                left: 0;
                right: 0;
                height: 33.33vh;
                background-image: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 25px,
                    rgba(6,182,212,0.12) 25px,
                    rgba(6,182,212,0.12) 26px
                );
                pointer-events: none;
                z-index: 1;
            }
            
            .circuit-traces-bottom {
                position: fixed;
                top: 66.66vh;
                left: 0;
                right: 0;
                height: 33.34vh;
                background-image: repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 30px,
                    rgba(6,182,212,0.10) 30px,
                    rgba(6,182,212,0.10) 31px
                );
                pointer-events: none;
                z-index: 1;
            }
            
            .white-frame-lines {
                position: fixed;
                inset: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                pointer-events: none;
                z-index: 2;
            }
            
            .cyber-panel {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(0, 217, 255, 0.3);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 16px;
            }
            
            .cyber-title {
                color: #00d9ff;
                font-size: 2.8rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-align: center;
                margin-bottom: 1rem;
                font-family: 'Rajdhani', sans-serif;
                text-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
            }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [prompt, setPrompt] = reactExports.useState("");
  const [negativePrompt, setNegativePrompt] = reactExports.useState("");
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [generatedImage, setGeneratedImage] = reactExports.useState(null);
  const [photoToPhoto, setPhotoToPhoto] = reactExports.useState(null);
  const [variations, setVariations] = reactExports.useState([]);
  const [error, setError] = reactExports.useState(null);
  const [settings, setSettings] = reactExports.useState({
    width: 512,
    height: 512,
    steps: 20,
    cfgScale: 7.5,
    seed: -1
  });
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Proszę wprowadzić prompt");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3e3));
      const placeholderImage = `https://picsum.photos/${settings.width}/${settings.height}?random=${Date.now()}`;
      setGeneratedImage(placeholderImage);
    } catch (err) {
      setError("Błąd podczas generowania obrazu: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  const handlePromptGenerator = async (generatorType) => {
    setIsGenerating(true);
    setError(null);
    try {
      let enhancedPrompt = "";
      switch (generatorType) {
        case "magic-prompt":
          enhancedPrompt = await callMagicPrompt(prompt);
          break;
        case "lexart":
          enhancedPrompt = await callLexartGenerator(prompt);
          break;
        case "majinai":
          enhancedPrompt = await callMajinaiGenerator(prompt);
          break;
        case "random-enhance":
          enhancedPrompt = await randomEnhancePrompt(prompt);
          break;
        case "wild-cards":
          await openWildCards();
          return;
        // Nie zmieniamy promptu, tylko otwieramy narzędzie
        default:
          enhancedPrompt = prompt;
      }
      setPrompt(enhancedPrompt);
    } catch (err) {
      setError("Błąd generatora promptów: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };
  const callMagicPrompt = async (inputPrompt) => {
    const enhancements = [
      ", highly detailed, 8k resolution, masterpiece",
      ", photorealistic, cinematic lighting, dramatic shadows",
      ", artstation trending, concept art, digital painting",
      ", ultra-detailed, sharp focus, professional photography",
      ", hyperrealistic, award-winning photograph"
    ];
    const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    return inputPrompt + randomEnhancement;
  };
  const callLexartGenerator = async (inputPrompt) => {
    const artisticStyles = [
      ", in the style of greg rutkowski, trending on artstation",
      ", painted by thomas kinkade, oil on canvas",
      ", concept art by james gurney, fantasy illustration",
      ", digital art by alex ross, comic book style",
      ", artwork by h.r. giger, surreal biomechanical"
    ];
    const randomStyle = artisticStyles[Math.floor(Math.random() * artisticStyles.length)];
    return inputPrompt + randomStyle;
  };
  const callMajinaiGenerator = async (inputPrompt) => {
    const safeEnhancements = [
      ", beautiful composition, soft lighting, peaceful atmosphere",
      ", colorful, vibrant, joyful mood, uplifting",
      ", serene landscape, calming colors, harmonious",
      ", warm lighting, cozy atmosphere, inviting scene",
      ", bright and airy, positive energy, cheerful"
    ];
    const randomSafe = safeEnhancements[Math.floor(Math.random() * safeEnhancements.length)];
    return inputPrompt + randomSafe;
  };
  const randomEnhancePrompt = async (inputPrompt) => {
    const qualityTerms = ["4k", "8k", "ultra detailed", "masterpiece", "best quality"];
    const lightingTerms = ["cinematic lighting", "dramatic lighting", "soft lighting", "golden hour"];
    const styleTerms = ["digital art", "oil painting", "watercolor", "concept art", "photorealistic"];
    const randomQuality = qualityTerms[Math.floor(Math.random() * qualityTerms.length)];
    const randomLighting = lightingTerms[Math.floor(Math.random() * lightingTerms.length)];
    const randomStyle = styleTerms[Math.floor(Math.random() * styleTerms.length)];
    return `${inputPrompt}, ${randomQuality}, ${randomLighting}, ${randomStyle}`;
  };
  const openWildCards = async () => {
    try {
      const wildCardsPath = "T:\\LUC_de_ZEN_ON\\StableDiffusion\\wildcards\\SupaGruen_SD_CheatSheet\\index.html";
      if (typeof window !== "undefined") {
        window.open(`file:///${wildCardsPath}`, "_blank");
      } else {
        alert(`Otwórz plik: ${wildCardsPath}`);
      }
    } catch (err) {
      setError("Błąd podczas otwierania Wild Cards: " + err.message);
    }
  };
  const presetPrompts = [
    "A majestic dragon soaring through storm clouds, digital art",
    "Cyberpunk city at night with neon lights reflection on wet streets",
    "Beautiful fantasy forest with magical glowing mushrooms",
    "Portrait of a wise old wizard with a long white beard, oil painting style",
    "Futuristic spaceship landing on an alien planet with two moons",
    "Steampunk mechanical clockwork castle with copper gears and brass pipes",
    "Underwater coral city with bioluminescent sea creatures, ethereal lighting"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cyberpunk-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "circuit-traces-top" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "circuit-traces-middle" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "circuit-traces-bottom" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "white-frame-lines" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen p-3", style: { position: "relative", zIndex: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto cyber-panel", style: { maxWidth: "2780px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "cyber-title", children: "GENERATOR OBRAZÓW AI" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg p-1 border border-white/10 border-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 w-[35%]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-white/80 text-xs font-medium mb-1", children: "Dodaj Photo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center", children: photoToPhoto ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: photoToPhoto,
                alt: "Obraz źródłowy",
                className: "w-full h-full object-contain rounded-lg"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-slate-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mx-auto h-8 w-8 mb-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60", children: "Photo2Photo" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                className: "mt-2 w-full text-xs text-white/60 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-white/10 file:text-white/80 hover:file:bg-white/20",
                onChange: (e) => {
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e2) => setPhotoToPhoto(e2.target.result);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-white/80 text-xs font-medium mb-1", children: "Wariacje" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-black/30 backdrop-blur-sm rounded border border-white/20 flex items-center justify-center", children: variations[i] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: variations[i], alt: `Wariacja ${i + 1}`, className: "w-full h-full object-contain rounded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-white/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mx-auto h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }) }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[65%]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-1 h-full flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-white/80 text-xs font-medium mb-1", children: "Canvas Główny" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center w-full", children: generatedImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: generatedImage,
              alt: "Wygenerowany obraz",
              className: "w-full h-full object-contain rounded-lg"
            }
          ) : isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 h-64 w-64 rounded-lg mx-auto mb-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60", children: "Generowanie obrazu..." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-slate-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mx-auto h-16 w-16", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60", children: "Tutaj pojawi się wygenerowany obraz" })
          ] }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 border-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleGenerate,
            disabled: isGenerating || !prompt.trim(),
            className: "py-3 px-6 bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm text-white font-medium rounded-lg hover:from-green-500/80 hover:to-emerald-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-white/10 flex items-center justify-center gap-2",
            children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Generowanie..." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
              "🎨 ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Generuj Obraz" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "py-3 px-6 bg-blue-600/80 backdrop-blur-sm hover:bg-blue-500/80 text-white font-medium rounded-lg transition-all duration-200 border border-white/10 flex items-center justify-center gap-2", children: [
          "💾 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pobierz" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "py-3 px-6 bg-purple-600/80 backdrop-blur-sm hover:bg-purple-500/80 text-white font-medium rounded-lg transition-all duration-200 border border-white/10 flex items-center justify-center gap-2", children: [
          "🔄 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Wariacje" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 border-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "py-3 px-6 bg-orange-600/80 backdrop-blur-sm hover:bg-orange-500/80 text-white font-medium rounded-lg transition-all duration-200 border border-white/10 flex items-center justify-center gap-2", children: [
          "📜 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Historia" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "py-3 px-6 bg-indigo-600/80 backdrop-blur-sm hover:bg-indigo-500/80 text-white font-medium rounded-lg transition-all duration-200 border border-white/10 flex items-center justify-center gap-2", children: [
          "⚙️ ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ustawienia" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "py-3 px-6 bg-teal-600/80 backdrop-blur-sm hover:bg-teal-500/80 text-white font-medium rounded-lg transition-all duration-200 border border-white/10 flex items-center justify-center gap-2", children: [
          "💾 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Zapisz" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 border-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Ustawienia Generacji" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-white/80 text-sm font-medium mb-2", children: "Prompt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "w-full px-4 py-3 bg-black/30 backdrop-blur-sm text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-green-500/50 focus:border-white/20 resize-none placeholder-white/40",
                rows: 3,
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                placeholder: "Opisz obraz który chcesz wygenerować..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-white/80 text-sm font-medium mb-2", children: "Negative Prompt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "w-full px-4 py-3 bg-black/30 backdrop-blur-sm text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-red-500/50 focus:border-white/20 resize-none placeholder-white/40",
                rows: 2,
                value: negativePrompt,
                onChange: (e) => setNegativePrompt(e.target.value),
                placeholder: "Czego NIE chcesz w obrazie..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-white/80 text-sm font-medium mb-2", children: "Szerokość" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: settings.width,
                  onChange: (e) => handleSettingChange("width", parseInt(e.target.value)),
                  className: "w-full px-3 py-2 bg-black/30 backdrop-blur-sm text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-white/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 512, children: "512px" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 768, children: "768px" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1024, children: "1024px" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-white/80 text-sm font-medium mb-2", children: "Wysokość" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: settings.height,
                  onChange: (e) => handleSettingChange("height", parseInt(e.target.value)),
                  className: "w-full px-3 py-2 bg-black/30 backdrop-blur-sm text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-white/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 512, children: "512px" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 768, children: "768px" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1024, children: "1024px" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-white/80 text-sm font-medium mb-2", children: [
                "Kroki: ",
                settings.steps
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "range",
                  min: "10",
                  max: "50",
                  className: "w-full accent-green-500",
                  value: settings.steps,
                  onChange: (e) => handleSettingChange("steps", parseInt(e.target.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-white/80 text-sm font-medium mb-2", children: [
                "CFG Scale: ",
                settings.cfgScale
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "range",
                  min: "1",
                  max: "20",
                  step: "0.5",
                  className: "w-full accent-green-500",
                  value: settings.cfgScale,
                  onChange: (e) => handleSettingChange("cfgScale", parseFloat(e.target.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-white/80 text-sm font-medium mb-2", children: "Seed (losowe: -1)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  className: "w-full px-3 py-2 bg-black/30 backdrop-blur-sm text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-white/20",
                  value: settings.seed,
                  onChange: (e) => handleSettingChange("seed", parseInt(e.target.value) || -1),
                  placeholder: "-1"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 border-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Przykładowe Prompty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: presetPrompts.map((preset, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPrompt(preset),
              className: "w-full text-left p-4 bg-black/30 backdrop-blur-sm hover:bg-black/40 text-white/80 hover:text-white rounded-lg transition-all duration-200 text-sm border border-white/10 hover:border-white/20",
              children: preset
            },
            index
          )) })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 bg-red-900/50 backdrop-blur-sm rounded-lg p-4 border border-red-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-red-300", children: "Wystąpił błąd" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-red-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: error }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 border-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-4 text-center", children: "🎭 Generatory Promptów AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handlePromptGenerator("magic-prompt"),
              className: "py-3 px-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm text-white font-medium rounded-lg hover:from-purple-500/80 hover:to-pink-500/80 transition-all duration-200 border border-white/10 flex items-center justify-center gap-2",
              children: [
                "🪄 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Magic Prompt" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handlePromptGenerator("lexart"),
              className: "py-3 px-4 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 backdrop-blur-sm text-white font-medium rounded-lg hover:from-cyan-500/80 hover:to-blue-500/80 transition-all duration-200 border border-white/10 flex items-center justify-center gap-2",
              children: [
                "🎨 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Lexart Gen" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handlePromptGenerator("majinai"),
              className: "py-3 px-4 bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-sm text-white font-medium rounded-lg hover:from-emerald-500/80 hover:to-teal-500/80 transition-all duration-200 border border-white/10 flex items-center justify-center gap-2",
              children: [
                "🌟 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Majinai Safe" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handlePromptGenerator("random-enhance"),
              className: "py-3 px-4 bg-gradient-to-r from-amber-600/80 to-orange-600/80 backdrop-blur-sm text-white font-medium rounded-lg hover:from-amber-500/80 hover:to-orange-500/80 transition-all duration-200 border border-white/10 flex items-center justify-center gap-2",
              children: [
                "🎲 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Random+" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handlePromptGenerator("wild-cards"),
              className: "py-3 px-4 bg-gradient-to-r from-red-600/80 to-rose-600/80 backdrop-blur-sm text-white font-medium rounded-lg hover:from-red-500/80 hover:to-rose-500/80 transition-all duration-200 border border-white/10 flex items-center justify-center gap-2",
              children: [
                "🃏 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Wild Cards" })
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "StableDiffusionLayout", $$StableDiffusionLayout, { "title": "Stable Diffusion Generator" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="text-center mb-8"> <h1 class="text-4xl font-bold text-white mb-4">
Generator Obrazów AI
</h1> <p class="text-xl text-slate-300 max-w-2xl mx-auto">
Twórz niesamowite obrazy za pomocą sztucznej inteligencji Stable Diffusion.
        Wpisz swój prompt i zobacz, jak AI zamienia Twoje słowa w sztukę.
</p> </div> <div class="max-w-4xl mx-auto"> ${renderComponent($$result2, "StableDiffusionGenerator", StableDiffusionGenerator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/StableDiffusionGenerator.jsx", "client:component-export": "default" })} </div> </div> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/generator/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/generator/index.astro";
const $$url = "/generator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
