globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$Layout } from '../chunks/Layout_CL3qsB8O.mjs';
import { j as jsxRuntimeExports } from '../chunks/jsx-runtime_DoH26EBh.mjs';
import { a as reactExports } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';

function StableDiffusionGenerator() {
  const [prompt, setPrompt] = reactExports.useState("");
  const [negativePrompt, setNegativePrompt] = reactExports.useState("");
  const [image, setImage] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [settings, setSettings] = reactExports.useState({
    width: 512,
    height: 512,
    steps: 20,
    guidance: 7.5,
    seed: -1
  });
  const [history, setHistory] = reactExports.useState([]);
  const canvasRef = reactExports.useRef(null);
  const [wildcards, setWildcards] = reactExports.useState({
    artists: [],
    styles: [],
    subjects: []
  });
  reactExports.useEffect(() => {
    Promise.all([
      fetch("/artists-data.js").then((r) => r.text()),
      fetch("/styles-data-converted.js").then((r) => r.text())
    ]).then(([artistsData, stylesData]) => {
      try {
        const artists = artistsData.match(/name:\s*"([^"]+)"/g)?.map((m) => m.match(/"([^"]+)"/)[1]) || [];
        const styles = stylesData.match(/name:\s*"([^"]+)"/g)?.map((m) => m.match(/"([^"]+)"/)[1]) || [];
        setWildcards({
          artists: artists.slice(0, 50),
          // Limit for performance
          styles: styles.slice(0, 50),
          subjects: ["portrait", "landscape", "abstract", "sci-fi", "fantasy", "cyberpunk", "digital art"]
        });
      } catch (e) {
        console.error("Error loading wildcards:", e);
      }
    });
  }, []);
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Wprowad┼║ prompt przed generowaniem!");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3e3));
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, settings.width, settings.height);
      gradient.addColorStop(0, "#001122");
      gradient.addColorStop(0.5, "#003344");
      gradient.addColorStop(1, "#001122");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, settings.width, settings.height);
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * settings.width,
          Math.random() * settings.height,
          Math.random() * 50 + 10,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 24px Orbitron";
      ctx.textAlign = "center";
      ctx.fillText("AI GENERATED", settings.width / 2, settings.height / 2);
      ctx.font = "bold 16px Orbitron";
      ctx.fillText(prompt.slice(0, 30) + "...", settings.width / 2, settings.height / 2 + 30);
      const imageUrl = canvas.toDataURL();
      setImage(imageUrl);
      setHistory((prev) => [{
        prompt,
        negativePrompt,
        image: imageUrl,
        settings: { ...settings },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("B┼é─ůd podczas generowania obrazu");
    } finally {
      setIsLoading(false);
    }
  };
  const addWildcard = (type, value) => {
    setPrompt((prev) => prev + (prev ? ", " : "") + value);
  };
  const randomizeSettings = () => {
    setSettings({
      width: [512, 768, 1024][Math.floor(Math.random() * 3)],
      height: [512, 768, 1024][Math.floor(Math.random() * 3)],
      steps: Math.floor(Math.random() * 30) + 10,
      guidance: Math.random() * 10 + 5,
      seed: Math.floor(Math.random() * 1e6)
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "square-grid", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "square-half", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel main-frame", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "neon-cyan sci-fi-type text-xl font-bold mb-4", children: "GENERATOR PROMPTS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold mb-2 sci-fi-type neon-white", children: "POSITIVE PROMPT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "input-glossy w-full h-24 resize-none",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              placeholder: "Opisz obraz kt├│ry chcesz wygenerowa─ç..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold mb-2 sci-fi-type neon-white", children: "NEGATIVE PROMPT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "input-glossy w-full h-20 resize-none",
              value: negativePrompt,
              onChange: (e) => setNegativePrompt(e.target.value),
              placeholder: "Czego nie chcesz w obrazie..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "scifi-btn text-sm py-2",
              onClick: () => setPrompt(""),
              children: "WYCZYSC"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "scifi-btn text-sm py-2",
              onClick: randomizeSettings,
              children: "LOSUJ USTAWIENIA"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "scifi-btn w-full py-3 text-lg font-bold",
            onClick: handleGenerate,
            disabled: isLoading,
            children: isLoading ? "GENEROWANIE..." : "GENERUJ OBRAZ"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel main-frame", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "neon-magenta sci-fi-type text-lg font-bold mb-3", children: "WILDCARDS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold mb-2 neon-white", children: "ARTY┼ÜCI:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: wildcards.artists.slice(0, 6).map((artist, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "text-xs px-2 py-1 bg-black/50 border border-cyan-400 rounded hover:bg-cyan-400/20 transition-colors",
                onClick: () => addWildcard("artist", artist),
                children: artist
              },
              i
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold mb-2 neon-white", children: "STYLE:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: wildcards.subjects.map((subject, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "text-xs px-2 py-1 bg-black/50 border border-magenta-400 rounded hover:bg-magenta-400/20 transition-colors",
                onClick: () => addWildcard("subject", subject),
                children: subject
              },
              i
            )) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "square-half", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel main-frame", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "neon-cyan sci-fi-type text-xl font-bold mb-4", children: "WYGENEROWANY OBRAZ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative bg-black/30 border border-white/20 rounded-lg aspect-square flex items-center justify-center", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading-pulse neon-cyan sci-fi-type text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "❌" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "PROCESSING..." })
        ] }) : image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: image,
            alt: "Wygenerowany obraz",
            className: "max-w-full max-h-full rounded-lg"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center neon-white opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "✅" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sci-fi-type", children: "BRAK OBRAZU" })
        ] }) }),
        image && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: image,
              download: "ai-generated-image.png",
              className: "scifi-btn flex-1 text-center py-2",
              children: "POBIERZ"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "scifi-btn flex-1 py-2",
              onClick: () => setImage(null),
              children: "USU┼â"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel main-frame", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "neon-magenta sci-fi-type text-lg font-bold mb-3", children: "USTAWIENIA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold mb-1 neon-white", children: "SZEROKOSC" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "input-glossy w-full text-sm",
                value: settings.width,
                onChange: (e) => setSettings({ ...settings, width: Number(e.target.value) }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 512, children: "512px" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 768, children: "768px" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1024, children: "1024px" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold mb-1 neon-white", children: "WYSOKOSC" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "input-glossy w-full text-sm",
                value: settings.height,
                onChange: (e) => setSettings({ ...settings, height: Number(e.target.value) }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 512, children: "512px" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 768, children: "768px" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1024, children: "1024px" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold mb-1 neon-white", children: "KROKI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                className: "input-glossy w-full text-sm",
                min: "10",
                max: "50",
                value: settings.steps,
                onChange: (e) => setSettings({ ...settings, steps: Number(e.target.value) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold mb-1 neon-white", children: "GUIDANCE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                className: "input-glossy w-full text-sm",
                min: "1",
                max: "20",
                step: "0.5",
                value: settings.guidance,
                onChange: (e) => setSettings({ ...settings, guidance: Number(e.target.value) })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        ref: canvasRef,
        width: settings.width,
        height: settings.height,
        style: { display: "none" }
      }
    )
  ] });
}

const $$Generator = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "AI Image Generator - Stable Diffusion" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="text-center mb-8"> <h1 class="neon-cyan sci-fi-type text-4xl font-bold mb-4">
STABLE DIFFUSION GENERATOR
</h1> <p class="neon-white sci-fi-type text-lg opacity-80">
Zaawansowany generator obraz├│w AI z interfejsem cyberpunk
</p> </div> ${renderComponent($$result2, "StableDiffusionGenerator", StableDiffusionGenerator, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/StableDiffusionGenerator.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/generator.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/generator.astro";
const $$url = "/generator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Generator,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
