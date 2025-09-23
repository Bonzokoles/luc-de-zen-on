globalThis.process ??= {}; globalThis.process.env ??= {};
<<<<<<< HEAD
import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate, b as renderScript } from '../chunks/astro/server_BDhFni3J.mjs';
import { $ as $$MyBonzoLayout } from '../chunks/MyBonzoLayout_B8kqLEdJ.mjs';
import { $ as $$RandomQuote } from '../chunks/RandomQuote_CGLTko5I.mjs';
import { B as BackgroundMusicPlayerFixed, A as AiHelpAssistant } from '../chunks/BackgroundMusicPlayerFixed_Ber633Wa.mjs';
import { j as jsxRuntimeExports } from '../chunks/jsx-runtime_DoH26EBh.mjs';
import { a as reactExports, d as attr_class } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_ChtfEq-M.mjs';
/* empty css                                 */
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_BgZWjcZU.mjs';

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const Icon$1 = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon$1, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
];
const Mic = createLucideIcon("mic", __iconNode$3);

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
  ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2", key: "cqa7eg" }],
  ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2", key: "16hl24" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }]
];
const MicOff = createLucideIcon("mic-off", __iconNode$2);

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272",
      key: "1wngk7"
    }
  ],
  ["path", { d: "M22 2 2 22", key: "y4kqgn" }],
  [
    "path",
    {
      d: "M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473",
      key: "10hv5p"
    }
  ]
];
const PhoneOff = createLucideIcon("phone-off", __iconNode$1);

/**
 * @license lucide-react v0.539.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);

function QuickVoiceAI({ variant = "compact" }) {
  const [isRecording, setIsRecording] = reactExports.useState(false);
  const [isConnected, setIsConnected] = reactExports.useState(false);
  const [transcript, setTranscript] = reactExports.useState("");
  const mediaRecorderRef = reactExports.useRef(null);
  const audioChunksRef = reactExports.useRef([]);
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setTranscript("❌ Przeglądarka nie obsługuje nagrywania audio");
        return;
      }
      const permissionStatus = await navigator.permissions.query({ name: "microphone" });
      if (permissionStatus.state === "denied") {
        setTranscript("❌ Brak dostępu do mikrofonu - sprawdź ustawienia przeglądarki");
        return;
      }
      setTranscript("🔄 Łączenie z mikrofonem...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        console.warn("WEBM/Opus not supported, falling back to default format");
      }
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm"
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size === 0) {
          setTranscript("❌ Nie udało się nagrać audio - spróbuj ponownie");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        console.log(`🎤 Nagranie zakończone: ${audioBlob.size} bytes`);
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setTranscript("❌ Błąd podczas nagrywania");
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start(100);
      setIsRecording(true);
      setTranscript("🎤 Nagrywam... (mów teraz)");
    } catch (error) {
      console.error("Error starting recording:", error);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setTranscript("❌ Dostęp do mikrofonu został odrzucony");
        } else if (error.name === "NotFoundError") {
          setTranscript("❌ Nie znaleziono mikrofonu");
        } else if (error.name === "NotSupportedError") {
          setTranscript("❌ Nagrywanie audio nie jest obsługiwane");
        } else {
          setTranscript(`❌ Błąd dostępu do mikrofonu: ${error.message}`);
        }
      } else {
        setTranscript("❌ Nieznany błąd mikrofonu");
      }
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setTranscript("⏳ Przetwarzam...");
    }
  };
  const handleAIResponse = async (userMessage) => {
    try {
      setTranscript((prev) => `${prev}
🤖 Agent myśli...`);
      const response = await fetch("/api/ai/advanced-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          language: "pl-PL",
          context: "mybonzo-voice-chat",
          features: ["speech", "voice-response"]
        }),
        signal: AbortSignal.timeout(15e3)
        // 15s timeout for AI
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AI API Error ${response.status}: ${errorData.error || "AI service unavailable"}`);
      }
      const data = await response.json();
      if (!data.success && !data.response) {
        throw new Error(data.error || "AI response generation failed");
      }
      const aiResponse = data.response;
      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error("Empty AI response received");
      }
      console.log(`🤖 AI Agent odpowiada: "${aiResponse}"`);
      setTranscript((prev) => `${prev.replace("🤖 Agent myśli...", "")}
🤖 Agent: ${aiResponse}`);
      await speakResponse(aiResponse);
    } catch (error) {
      console.error("AI Response Error:", error);
      let errorMessage = "❌ Błąd AI";
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "❌ AI zbyt długo myśli - spróbuj ponownie";
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "❌ Błąd połączenia z AI - sprawdź internet";
        } else if (error.message.includes("500")) {
          errorMessage = "❌ Błąd serwera AI - spróbuj za chwilę";
        } else {
          errorMessage = `❌ Błąd AI: ${error.message}`;
        }
      }
      setTranscript((prev) => `${prev.replace("🤖 Agent myśli...", "")}
${errorMessage}`);
    }
  };
  const speakResponse = async (text) => {
    try {
      console.log("🔊 Agent odpowiada głosem:", text);
      if (!("speechSynthesis" in window)) {
        console.warn("Speech Synthesis not supported in this browser");
        setTranscript((prev) => `${prev}
⚠️ Przeglądarka nie obsługuje syntezatora mowy`);
        return;
      }
      speechSynthesis.cancel();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pl-PL";
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      utterance.onstart = () => {
        console.log("🔊 TTS started");
        window.dispatchEvent(new CustomEvent("ai-voice-start", {
          detail: { text, duration: text.length * 100 }
        }));
      };
      utterance.onend = () => {
        console.log("🔊 TTS ended");
        window.dispatchEvent(new CustomEvent("ai-voice-end"));
      };
      utterance.onerror = (event) => {
        console.error("TTS Error:", event);
        window.dispatchEvent(new CustomEvent("ai-voice-end"));
        setTranscript((prev) => `${prev}
⚠️ Błąd podczas odtwarzania głosu`);
      };
      let attempts = 0;
      const maxAttempts = 3;
      const trySpeak = () => {
        attempts++;
        console.log(`🔊 TTS attempt ${attempts}/${maxAttempts}`);
        speechSynthesis.speak(utterance);
        setTimeout(() => {
          if (speechSynthesis.speaking || speechSynthesis.pending) {
            return;
          }
          if (attempts < maxAttempts) {
            console.warn(`TTS attempt ${attempts} failed, retrying...`);
            trySpeak();
          } else {
            console.error("TTS failed after all attempts");
            setTranscript((prev) => `${prev}
❌ Nie udało się odtworzyć głosu`);
          }
        }, 2e3);
      };
      trySpeak();
    } catch (error) {
      console.error("TTS Error:", error);
      setTranscript((prev) => `${prev}
❌ Błąd syntezatora mowy`);
      window.dispatchEvent(new CustomEvent("ai-voice-end"));
    }
  };
  const processAudio = async (audioBlob) => {
    try {
      setTranscript("⏳ Przetwarzam audio z Google Cloud...");
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", "pl-PL");
      const response = await fetch("/api/voice/recognition", {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(3e4)
        // 30s timeout
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error || "Unknown error"}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Voice recognition failed");
      }
      const userMessage = result.transcript || "Nie rozpoznano mowy";
      const confidence = result.confidence || 0;
      console.log(`🎤 Rozpoznano: "${userMessage}" (pewność: ${confidence}%)`);
      setTranscript(`Ty: ${userMessage} (${confidence}%)`);
      if (userMessage && userMessage !== "Nie rozpoznano mowy" && confidence > 50) {
        await handleAIResponse(userMessage);
      } else if (confidence <= 50) {
        setTranscript((prev) => `${prev}
⚠️ Niska pewność rozpoznania - spróbuj mówić wyraźniej`);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setTranscript("❌ Przekroczono czas oczekiwania - spróbuj ponownie");
        } else if (error.message.includes("network")) {
          setTranscript("❌ Błąd sieci - sprawdź połączenie internetowe");
        } else {
          setTranscript(`❌ Błąd przetwarzania: ${error.message}`);
        }
      } else {
        setTranscript("❌ Nieznany błąd podczas przetwarzania audio");
      }
    }
  };
  const toggleConnection = async () => {
    if (!isConnected) {
      try {
        setTranscript("🔄 Sprawdzanie uprawnień...");
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Przeglądarka nie obsługuje nagrywania audio");
        }
        if (!("speechSynthesis" in window)) {
          console.warn("Speech Synthesis not available - TTS will be limited");
        }
        try {
          const permissionStatus = await navigator.permissions.query({ name: "microphone" });
          console.log(`Microphone permission: ${permissionStatus.state}`);
          if (permissionStatus.state === "denied") {
            throw new Error("Dostęp do mikrofonu został zablokowany w ustawieniach przeglądarki");
          }
        } catch (permError) {
          console.warn("Could not check microphone permission:", permError);
        }
        setTranscript("🔄 Testowanie połączenia z API...");
        const apiTest = await fetch("/api/voice/recognition", {
          method: "GET",
          signal: AbortSignal.timeout(5e3)
        });
        if (!apiTest.ok) {
          throw new Error("API Voice Recognition niedostępne");
        }
        const apiInfo = await apiTest.json();
        console.log("API Voice Recognition capabilities:", apiInfo);
        const aiTest = await fetch("/api/ai/advanced-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "test", language: "pl-PL" }),
          signal: AbortSignal.timeout(5e3)
        });
        if (!aiTest.ok) {
          console.warn("AI Chat API may be unavailable");
        }
        setIsConnected(true);
        setTranscript(`✅ Połączono z Voice AI
🎤 Google Cloud Speech-to-Text: ${apiInfo.googleCloud?.enabled ? "Aktywne" : "Symulacja"}
🤖 AI Chat: ${aiTest.ok ? "Dostępny" : "Ograniczony"}
💬 Naciśnij "Rozpocznij nagrywanie" aby zacząć`);
      } catch (error) {
        console.error("Connection error:", error);
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            setTranscript("❌ Przekroczono czas połączenia - sprawdź internet");
          } else {
            setTranscript(`❌ Błąd połączenia: ${error.message}`);
          }
        } else {
          setTranscript("❌ Nieznany błąd podczas łączenia");
        }
        setIsConnected(false);
      }
    } else {
      setIsConnected(false);
      setTranscript("❌ Rozłączono z Voice AI");
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
    }
  };
  const getButtonStyle = () => {
    const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105";
    if (isRecording) {
      return `${baseStyle} bg-red-500 hover:bg-red-600 text-white animate-pulse`;
    }
    if (isConnected) {
      return `${baseStyle} bg-green-500 hover:bg-green-600 text-white shadow-lg`;
    }
    return `${baseStyle} bg-blue-500 hover:bg-blue-600 text-white shadow-md`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "voice-ai-widget p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "🎤 MyBonzo Voice AI" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: toggleConnection,
        className: `${getButtonStyle()} w-full max-w-sm`,
        disabled: isRecording,
        children: [
          isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "w-5 h-5" }),
          isConnected ? "Połączony" : "Połącz"
        ]
      }
    ),
    isConnected && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: isRecording ? stopRecording : startRecording,
        className: getButtonStyle(),
        disabled: !isConnected,
        children: [
          isRecording ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-5 h-5" }),
          isRecording ? "Stop nagrywania" : "Rozpocznij nagrywanie"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: transcript || '🎯 Naciśnij "Połącz" aby rozpocząć' }) }),
    isRecording && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center space-x-1 mt-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-2 bg-blue-400 rounded-full animate-pulse h-${4 + i % 3 * 2}`
      },
      i
    )) })
  ] }) });
}

const $$QuickVoiceAI = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="quick-voice-ai" class="py-20 my-10" data-astro-cid-hht4n5ep> <div class="max-w-6xl mx-auto border-x border-gray-800 bg-black/50 backdrop-blur-sm" data-astro-cid-hht4n5ep> <div class="container mx-auto text-center px-8" data-astro-cid-hht4n5ep> ${renderComponent($$result, "QuickVoiceAI", QuickVoiceAI, { "client:load": true, "variant": "hero", "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/QuickVoiceAI.tsx", "client:component-export": "default", "data-astro-cid-hht4n5ep": true })} </div> </div> </section> `;
}, "Q:/mybonzo/luc-de-zen-on/src/components/QuickVoiceAI.astro", void 0);

function OpenRouterFloatingButtons($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let isVisible = false;
		let isExpanded = false;
		let isLoading = false;

		$$renderer.push(`<div${attr_class('floating-ai-buttons svelte-bsgeo8', void 0, { 'visible': isVisible })}><div${attr_class('main-button svelte-bsgeo8', void 0, { 'expanded': isExpanded, 'loading': isLoading })}>`);

		{
			$$renderer.push('<!--[!-->');

			{
				$$renderer.push('<!--[!-->');
				$$renderer.push(`<span class="ai-icon svelte-bsgeo8">🤖</span>`);
			}

			$$renderer.push(`<!--]-->`);
		}

		$$renderer.push(`<!--]--></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Workers Platform | KAROL LISSON" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, {})}  ${maybeRenderHead()}<div class="workers-vertical-line-left"></div> <div class="workers-vertical-line-right"></div> <main class="min-h-svh"> <!-- Top Separator Section --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section> <!-- Header Section --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="flex justify-between max-h-72 min-h-64"> <!-- Left corner - O_MNIE content --> <div class="mt-auto" style="max-width: 45vw;"> <div class="text-edge text-sm italic px-2" style="
=======
/* empty css                                  */
import { c as createComponent, m as maybeRenderHead, b as renderScript, a as renderTemplate, r as renderComponent } from '../chunks/astro/server_CDFI50iS.mjs';
import { $ as $$MyBonzoLayout, F as ForwardRef$b } from '../chunks/MyBonzoLayout_DdWhmxse.mjs';
import { $ as $$RandomQuote, B as BackgroundMusicPlayerSimple, A as AiHelpAssistant } from '../chunks/BackgroundMusicPlayerSimple_BNZxycy-.mjs';
import { Q as QuickVoiceAI, F as ForwardRef$a, a as ForwardRef$c, b as ForwardRef$d, c as ForwardRef$e, d as ForwardRef$f, e as ForwardRef$g, f as ForwardRef$h, g as ForwardRef$i, h as ForwardRef$j, i as ForwardRef$k } from '../chunks/QuickVoiceAI_vOamKD-e.mjs';
import { $ as $$DecorativeLines } from '../chunks/DecorativeLines_cAs3q6CP.mjs';
/* empty css                                 */
import { d as reactExports } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DzCkhAcZ.mjs';

function ArchiveBoxIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
  }));
}
const ForwardRef$9 = /*#__PURE__*/ reactExports.forwardRef(ArchiveBoxIcon);

function BoltIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
  }));
}
const ForwardRef$8 = /*#__PURE__*/ reactExports.forwardRef(BoltIcon);

function BookOpenIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
  }));
}
const ForwardRef$7 = /*#__PURE__*/ reactExports.forwardRef(BookOpenIcon);

function CalendarDaysIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
  }));
}
const ForwardRef$6 = /*#__PURE__*/ reactExports.forwardRef(CalendarDaysIcon);

function FolderPlusIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
  }));
}
const ForwardRef$5 = /*#__PURE__*/ reactExports.forwardRef(FolderPlusIcon);

function ListBulletIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
  }));
}
const ForwardRef$4 = /*#__PURE__*/ reactExports.forwardRef(ListBulletIcon);

function PaintBrushIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
  }));
}
const ForwardRef$3 = /*#__PURE__*/ reactExports.forwardRef(PaintBrushIcon);

function RocketLaunchIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
  }));
}
const ForwardRef$2 = /*#__PURE__*/ reactExports.forwardRef(RocketLaunchIcon);

function StarIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
  }));
}
const ForwardRef$1 = /*#__PURE__*/ reactExports.forwardRef(StarIcon);

function WrenchScrewdriverIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/reactExports.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
  }));
}
const ForwardRef = /*#__PURE__*/ reactExports.forwardRef(WrenchScrewdriverIcon);

const $$WorkerCommunicationPopup = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Universal Worker Communication Popup -->${maybeRenderHead()}<div id="workerPopup" class="worker-popup-overlay" style="display: none;" data-astro-cid-ugabcofn> <div class="worker-popup-container" data-astro-cid-ugabcofn> <div class="worker-popup-header" data-astro-cid-ugabcofn> <h3 id="popupTitle" data-astro-cid-ugabcofn>Worker Communication</h3> <button class="popup-close" onclick="closeWorkerPopup()" data-astro-cid-ugabcofn>✕</button> </div> <div class="worker-popup-content" data-astro-cid-ugabcofn> <!-- Input Section --> <div class="input-section" data-astro-cid-ugabcofn> <label for="workerInput" data-astro-cid-ugabcofn>Zapytanie / Query:</label> <textarea id="workerInput" placeholder="Wpisz swoją wiadomość lub zapytanie..." data-astro-cid-ugabcofn></textarea> </div> <!-- Response Section --> <div class="response-section" data-astro-cid-ugabcofn> <label for="workerResponse" data-astro-cid-ugabcofn>Odpowiedź / Response:</label> <div id="workerResponse" class="response-display" data-astro-cid-ugabcofn> <div class="loading-indicator" style="display: none;" data-astro-cid-ugabcofn> <div class="spinner" data-astro-cid-ugabcofn></div> <span data-astro-cid-ugabcofn>Przetwarzanie...</span> </div> <div class="response-content" data-astro-cid-ugabcofn></div> </div> </div> </div> <!-- Action Buttons --> <div class="worker-popup-actions" data-astro-cid-ugabcofn> <button class="btn-primary" onclick="sendWorkerQuery()" data-astro-cid-ugabcofn> <span class="btn-icon" data-astro-cid-ugabcofn>📤</span>
Wyślij
</button> <button class="btn-secondary" onclick="saveWorkerResponse()" data-astro-cid-ugabcofn> <span class="btn-icon" data-astro-cid-ugabcofn>💾</span>
Zapisz
</button> <button class="btn-secondary" onclick="addToHistory()" data-astro-cid-ugabcofn> <span class="btn-icon" data-astro-cid-ugabcofn>➕</span>
Dodaj
</button> <button class="btn-secondary" onclick="nextWorkerQuery()" data-astro-cid-ugabcofn> <span class="btn-icon" data-astro-cid-ugabcofn>⏭️</span>
Dalej
</button> <button class="btn-tertiary" onclick="closeWorkerPopup()" data-astro-cid-ugabcofn> <span class="btn-icon" data-astro-cid-ugabcofn>🔙</span>
Wróć
</button> </div> </div> </div>  ${renderScript($$result, "Q:/mybonzo/mybonzo-github/src/components/WorkerCommunicationPopup.astro?astro&type=script&index=0&lang.ts")}`;
}, "Q:/mybonzo/mybonzo-github/src/components/WorkerCommunicationPopup.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", " <!-- JavaScript Functions --> ", " <!-- BigQuery API Integration Script --> <script>\n  // Import BigQuery API functionality\n  import('../utils/bigQueryAPI.js').then(module => {\n    // Make BigQuery functions available globally\n    window.BigQueryAPI = module.BigQueryAPI;\n    window.BigQueryInterface = module.BigQueryInterface;\n    console.log('\u2705 BigQuery API loaded');\n  }).catch(err => console.warn('\u26A0\uFE0F BigQuery API load failed:', err));\n<\/script> <!-- Kaggle API Integration Script --> <script>\n  // Import Kaggle API functionality  \n  import('../utils/kaggleAPI.js').then(module => {\n    // Make Kaggle functions available globally\n    window.KaggleAPI = module.KaggleAPI;\n    window.KaggleInterface = module.KaggleInterface;\n    console.log('\u2705 Kaggle API loaded');\n  }).catch(err => console.warn('\u26A0\uFE0F Kaggle API load failed:', err));\n<\/script> <!-- Voice AI Integration Script --> <script>\n  // Import Voice AI functionality\n  import('../utils/voiceAiAPI.js').then(module => {\n    // Make Voice AI functions available globally\n    window.VoiceAIAPI = module.VoiceAIAPI;\n    window.VoiceAIInterface = module.VoiceAIInterface;\n    console.log('\u2705 Voice AI API loaded');\n  }).catch(err => console.warn('\u26A0\uFE0F Voice AI API load failed:', err));\n<\/script> "])), renderComponent($$result, "MyBonzoLayout", $$MyBonzoLayout, { "siteTitle": "AI Workers Platform | KAROL LISSON", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DecorativeLines", $$DecorativeLines, { "data-astro-cid-j7pv25f6": true })}  ${maybeRenderHead()}<div class="workers-vertical-line-left" data-astro-cid-j7pv25f6></div> <div class="workers-vertical-line-right" data-astro-cid-j7pv25f6></div> <main class="min-h-svh" data-astro-cid-j7pv25f6> <!-- Top Separator Section --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section> <!-- Header Section --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="flex justify-between max-h-72 min-h-64" data-astro-cid-j7pv25f6> <!-- Left corner - O_MNIE content --> <div class="mt-auto" style="max-width: 45vw;" data-astro-cid-j7pv25f6> <div class="text-edge text-sm italic px-2" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
<<<<<<< HEAD
              ">
Pasjonat technologii i programista z misj�.<br>
Tworz� nowoczesne rozwi�zania, kt�re ��cz�<br>
sztuczn� inteligencj� z automatyzacj�.<br>
Moim celem jest budowanie u�ytecznych narz�dzi.
</div> </div> <span class="mt-auto"> <div style="
=======
              " data-astro-cid-j7pv25f6>
Pasjonat technologii i programista z misją.<br data-astro-cid-j7pv25f6>
Tworzę nowoczesne rozwiązania, które łączą<br data-astro-cid-j7pv25f6>
sztuczną inteligencję z automatyzacją.<br data-astro-cid-j7pv25f6>
Moim celem jest budowanie użytecznych narzędzi.
</div> </div> <span class="mt-auto" data-astro-cid-j7pv25f6> <div style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              transform: scale(1.56);
              transform-origin: center right;
              margin: 15px;
              width: calc(50vw - 576px - 10px - 20px - 30px);
              max-width: 400px;
              text-align: right;
              word-wrap: break-word;
              hyphens: auto;
<<<<<<< HEAD
            "> ${renderComponent($$result2, "RandomQuote", $$RandomQuote, {})} </div> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]">
AUG 2025
</span> </span> </div> </div> </section> <!-- Header-Navigation Separator --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section> <!-- Navigation Section --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="flex flex-row p-2"> <a class="hover:brightness-125" href="/"> <h1 class="text-4xl sm:text-5xl">KAROL LISSON</h1> <h2 class="text-2xl sm:text-3xl">MY_Bonzo_AI_ZEnon_HuB</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col"> <a class="ml-auto hover:brightness-125 duration-200" href="mailto:LissonKarol.msa@gmail.com">
LissonKarol.msa@gmail.com
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> <div class="flex flex-row-reverse flex-wrap gap-4"> <a class="hover:brightness-125 duration-200" href="https://www.linkedin.com/in/linkedinHandle">
LinkedIn
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> <a class="hover:brightness-125 duration-200" href="https://www.github.com/githubUsername">
GitHub
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> </div> </div> </div> </div> </section> <!-- Separator Section 1 --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section> <!-- AI Workers Section - Centered --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative z-[1]" id="ai-workers"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto w-full"> <div class="section-container"> <h2 class="system-title">SYSTEM ZAAWANSOWANEJ AUTOMATYZACJI AI</h2> <!-- Separator after title --> <div style="
=======
            " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "RandomQuote", $$RandomQuote, { "data-astro-cid-j7pv25f6": true })} </div> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]" data-astro-cid-j7pv25f6>
AUG 2025
</span> </span> </div> </div> </section> <!-- Header-Navigation Separator --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section> <!-- Navigation Section --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="flex flex-row p-2" data-astro-cid-j7pv25f6> <a class="hover:brightness-125" href="/" data-astro-cid-j7pv25f6> <h1 class="text-4xl sm:text-5xl" data-astro-cid-j7pv25f6>KAROL LISSON</h1> <h2 class="text-2xl sm:text-3xl" data-astro-cid-j7pv25f6>MY_Bonzo_AI_ZEnon_HuB</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col" data-astro-cid-j7pv25f6> <a class="ml-auto hover:brightness-125 duration-200" href="mailto:LissonKarol.msa@gmail.com" data-astro-cid-j7pv25f6>
LissonKarol.msa@gmail.com
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> <div class="flex flex-row-reverse flex-wrap gap-4" data-astro-cid-j7pv25f6> <a class="hover:brightness-125 duration-200" href="https://www.linkedin.com/in/linkedinHandle" data-astro-cid-j7pv25f6>
LinkedIn
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> <a class="hover:brightness-125 duration-200" href="https://www.github.com/githubUsername" data-astro-cid-j7pv25f6>
GitHub
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> </div> </div> </div> </div> </section> <!-- Separator Section 1 --> <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div t class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section> <!-- AI Workers Section - Centered --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative" id="ai-workers" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto w-full" data-astro-cid-j7pv25f6> <div class="section-container" data-astro-cid-j7pv25f6> <h2 class="system-title" data-astro-cid-j7pv25f6>SYSTEM ZAAWANSOWANEJ AUTOMATYZACJI AI</h2> <!-- Separator after title --> <div style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
            max-width: 1212px;
            margin: 0 auto;
            border-t: 1px solid #ffffff;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
<<<<<<< HEAD
          "></div> <p class="section-description" style="
=======
          " data-astro-cid-j7pv25f6></div> <p class="section-description" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px) - 40px);
            max-width: 1100px;
            margin: 0 auto;
            margin-left: calc(50% - 10px);
            transform: translateX(-50%);
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            padding: 0 15px;
<<<<<<< HEAD
          ">
Platforma integruje wyspecjalizowane Workery AI, działające w
            chmurze Cloudflare, aby dostarczać kompleksowe rozwiązania
            automatyzacji z wykorzystaniem sztucznej inteligencji.
</p> </div>  ${renderComponent($$result2, "QuickVoiceAI", $$QuickVoiceAI, {})}   <!-- Full-width Music Visualizer - Extended to Left Screen Edge --> <div style="
=======
          " data-astro-cid-j7pv25f6>
Platforma integruje wyspecjalizowane Workery AI, działające w
            chmurze Cloudflare, aby dostarczać kompleksowe rozwiązania
            automatyzacji z wykorzystaniem sztucznej inteligencji.
</p> </div>  ${renderComponent($$result2, "QuickVoiceAI", QuickVoiceAI, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/QuickVoiceAI.tsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })}   <!-- Full-width Music Visualizer - Extended to Left Screen Edge --> <div style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
            position: relative;
            left: 0;
            right: 0;
            width: 100vw;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
            padding: 12px 0;
            margin-left: -50vw;
            margin-right: -50vw;
            left: 50%;
            background: rgba(0, 0, 0, 0.4);
<<<<<<< HEAD
          "> <!-- White lines extending to full screen width --> <div style="position:absolute; left:0; right:0; top:0; height:1px; background:#ffffff;"></div> <div style="position:absolute; left:0; right:0; bottom:0; height:1px; background:#ffffff;"></div> <!-- Music Visualizer - Two waves: Music Player and Mic --> <div style="
=======
          " data-astro-cid-j7pv25f6> <!-- White lines extending to full screen width --> <div style="position:absolute; left:0; right:0; top:0; height:1px; background:#ffffff;" data-astro-cid-j7pv25f6></div> <div style="position:absolute; left:0; right:0; bottom:0; height:1px; background:#ffffff;" data-astro-cid-j7pv25f6></div> <!-- Music Visualizer - Two waves: Music Player and Mic --> <div style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              width: 100vw;
              height: 120px;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
<<<<<<< HEAD
            "> <!-- Back layer: reacts to Music Player, same height but wave 3% taller --> <div style="
=======
            " data-astro-cid-j7pv25f6> <!-- Back layer: reacts to Music Player, same height but wave 3% taller --> <div style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%) scaleY(1.03); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.4;
                filter: hue-rotate(30deg) brightness(1.2);
                pointer-events:none;
<<<<<<< HEAD
              "> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Back layer mirrored: reacts to Music Player, flipped horizontally with darker color --> <div style="
=======
              " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Back layer mirrored: reacts to Music Player, flipped horizontally with darker color --> <div style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%) scaleY(1.03) scaleX(-1); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.3;
                filter: hue-rotate(30deg) brightness(0.8);
                pointer-events:none;
<<<<<<< HEAD
              "> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Front layer: reacts to Avatar (mic) --> <div style="
=======
              " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Front layer: reacts to Avatar (mic) --> <div style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.8;
                pointer-events:none;
<<<<<<< HEAD
              "> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "mic", "variant": "mic", "client:component-hydration": "only", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> </div> <!-- Optimized Script - Single Audio Context --> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </div> <!-- Dashboard Buttons Section (only buttons after login) --> <div class="dashboard-buttons-section hidden" id="dashboardButtons"> <a href="/dashboard/klienci" class="dashboard-btn" data-astro-cid-my52qgmw>KLIENCI_DSH_BON</a> <a href="/dashboard/statystyki" class="dashboard-btn" data-astro-cid-my52qgmw>AKYW_STATYSTIC</a> <a href="/dashboard/prywatne" class="dashboard-btn" data-astro-cid-my52qgmw>PRIV_STAFF</a> </div> <!-- Small Tags Section --> <div class="tags-section" style="
=======
              " data-astro-cid-j7pv25f6> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "mic", "variant": "mic", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> </div> <!-- Script to connect music player with visualizer --> ${renderScript($$result2, "Q:/mybonzo/mybonzo-github/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </div> <!-- Dashboard Buttons Section (only buttons after login) --> <div class="dashboard-buttons-section hidden" id="dashboardButtons" data-astro-cid-j7pv25f6> <a href="/admin/" class="dashboard-btn" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>ADMIN PANEL</a> <a href="/dashboard" class="dashboard-btn" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>DASHBOARD</a> <a href="/admin/ai-models" class="dashboard-btn" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>AI MODELS</a> </div> <!-- Small Tags Section --> <div class="tags-section" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
               display: flex !important;
               justify-content: center !important;
               gap: 1rem !important;
               margin-bottom: 2rem !important;
               width: 100% !important;
               z-index: 1000 !important;
               position: relative !important;
<<<<<<< HEAD
             " data-astro-cid-my52qgmw> <button class="tag-btn" onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" style="
=======
             " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="tag-btn" onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
<<<<<<< HEAD
            " data-astro-cid-my52qgmw>POLACZEK_AGENT_SYS_23</button> <button class="tag-btn" onclick="window.open('/hub/ai-agent-s', '_blank')" style="
=======
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>POLACZEK_AGENT_SYS_23</button> <button class="tag-btn" onclick="window.open('/hub/ai-agent-s', '_blank')" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
<<<<<<< HEAD
            " data-astro-cid-my52qgmw>BIELIK</button> <button class="tag-btn" onclick="window.open('/workers-status', '_blank')" style="
=======
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>BIELIK</button> <button class="tag-btn" onclick="window.open('/workers-status', '_blank')" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
<<<<<<< HEAD
            " data-astro-cid-my52qgmw>ZENON</button> <button class="tag-btn" onclick="window.open('/klf-sheed-shop', '_blank')" style="
=======
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>ZENON</button> <button class="tag-btn" onclick="window.open('/klf-sheed-shop', '_blank')" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              background: rgba(0, 217, 255, 0.1) !important;
              border: 1px solid rgba(0, 217, 255, 0.4) !important;
              color: #00d9ff !important;
              padding: 0.8rem 2rem !important;
              font-size: 0.9rem !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 1px !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              font-family: Rajdhani, sans-serif !important;
              flex: 1 !important;
              text-align: center !important;
              min-width: 0 !important;
<<<<<<< HEAD
            " data-astro-cid-my52qgmw>KLF_SHEED_SHOOP</button> </div> <div class="workers-grid" data-astro-cid-my52qgmw> <!-- Image Generator --> <div class="worker-card" data-worker="image" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>
Generator Obrazów
</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Twórz niesamowite obrazy z tekstu używając Flux-1 Schnell
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Flux AI</span> <span class="feature-tag" data-astro-cid-my52qgmw>512-1024px</span> <span class="feature-tag" data-astro-cid-my52qgmw>Tłumaczenie PL</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Opisz obraz..." class="quick-prompt" id="imagePrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openImageGenerator()" data-astro-cid-my52qgmw>Generuj</button> <button class="action-btn secondary" onclick="window.open('/image-generator', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- AI Chatbot --> <div class="worker-card" data-worker="chat" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>AI Chatbot</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Inteligentny asystent do rozmów i odpowiadania na pytania
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>OpenAI GPT</span> <span class="feature-tag" data-astro-cid-my52qgmw>Język polski</span> <span class="feature-tag" data-astro-cid-my52qgmw>Kontekst</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Zadaj pytanie..." class="quick-prompt" id="chatPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openChatbot()" data-astro-cid-my52qgmw>Chat</button> <button class="action-btn secondary" onclick="window.open('/chatbot', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- BigQuery Analytics --> <div class="worker-card" data-worker="bigquery" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>
BigQuery Analytics
</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Analizuj dane z Google BigQuery, wykonuj zapytania SQL
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Google Cloud</span> <span class="feature-tag" data-astro-cid-my52qgmw>SQL Query</span> <span class="feature-tag" data-astro-cid-my52qgmw>Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="SELECT * FROM..." class="quick-prompt" id="bigqueryPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openBigQuery()" data-astro-cid-my52qgmw>Analizuj</button> <button class="action-btn secondary" onclick="window.open('/bigquery-analytics', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- Kaggle Datasets --> <div class="worker-card" data-worker="kaggle" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>
Kaggle Datasets
</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Przeszukuj zbiory danych, konkursy i profile Kaggle
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Machine Learning</span> <span class="feature-tag" data-astro-cid-my52qgmw>Datasets</span> <span class="feature-tag" data-astro-cid-my52qgmw>Competitions</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="machine learning..." class="quick-prompt" id="kagglePrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openKaggle()" data-astro-cid-my52qgmw>Wyszukaj</button> <button class="action-btn secondary" onclick="window.open('/kaggle-datasets', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- Tavily Search --> <div class="worker-card" data-worker="tavily" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>
Tavily AI Search
</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Zaawansowane wyszukiwanie internetowe powered by AI
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>AI Search</span> <span class="feature-tag" data-astro-cid-my52qgmw>Real-time</span> <span class="feature-tag" data-astro-cid-my52qgmw>Deep Analysis</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="wyszukaj w sieci..." class="quick-prompt" id="tavilyPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="openTavily()" data-astro-cid-my52qgmw>Szukaj</button> <button class="action-btn secondary" onclick="window.open('/tavily-search', '_blank')" data-astro-cid-my52qgmw>Otwórz</button> </div> </div> <!-- STATUS WORKERS - Basic Opening Element --> <div class="worker-card" data-worker="status" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>
🔧 STATUS WORKERS
</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Zaawansowany system monitorowania statusu wszystkich Cloudflare
              Workers
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Real-time</span> <span class="feature-tag" data-astro-cid-my52qgmw>Monitoring</span> <span class="feature-tag" data-astro-cid-my52qgmw>Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="checkAllStatus()" data-astro-cid-my52qgmw>Sprawdź Status</button> <button class="action-btn secondary" onclick="window.open('/status-workers', '_blank')" data-astro-cid-my52qgmw>Otwórz Dashboard</button> </div> </div> <!-- API Testing Card --> <div class="worker-card" data-worker="api-tests" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>🧪 API Tests</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Testuj wszystkie Workers API endpoints i sprawdź połączenia
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Testing</span> <span class="feature-tag" data-astro-cid-my52qgmw>API</span> <span class="feature-tag" data-astro-cid-my52qgmw>Debug</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="runAllAPITests()" data-astro-cid-my52qgmw>Testuj wszystkie API</button> <button class="action-btn secondary" onclick="openAPITestConsole()" data-astro-cid-my52qgmw>Konsola testów</button> </div> </div> <!-- Flowise AI Card --> <div class="worker-card" data-worker="flowise" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>🧠 Flowise AI</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Visual AI workflow builder with drag-and-drop interface
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Visual Builder</span> <span class="feature-tag" data-astro-cid-my52qgmw>Workflows</span> <span class="feature-tag" data-astro-cid-my52qgmw>Integration</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="window.open('https://flowise.ai', '_blank')" data-astro-cid-my52qgmw>Open Flowise</button> <button class="action-btn secondary" onclick="launchFlowise()" data-astro-cid-my52qgmw>Launch</button> </div> </div> <!-- Content Creator Agent --> <div class="worker-card" data-worker="content-creator" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Content Creator Agent</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Automatyczne generowanie treści, artykułów i postów na bloga.
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>AI Content</span> <span class="feature-tag" data-astro-cid-my52qgmw>Blog</span> <span class="feature-tag" data-astro-cid-my52qgmw>SEO</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Podaj temat treści..." class="quick-prompt" id="contentCreatorPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="window.open('/agents/content-creator', '_blank')" data-astro-cid-my52qgmw>Generuj</button> </div> </div> <!-- Customer Experience Agent --> <div class="worker-card" data-worker="customer-experience" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Customer Experience Agent</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Analiza opinii klientów, automatyczne odpowiedzi i rekomendacje.
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Feedback</span> <span class="feature-tag" data-astro-cid-my52qgmw>CRM</span> <span class="feature-tag" data-astro-cid-my52qgmw>AI Support</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Wpisz zapytanie klienta..." class="quick-prompt" id="customerExperiencePrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="window.open('/agents/customer-experience', '_blank')" data-astro-cid-my52qgmw>Analizuj</button> </div> </div> <!-- Analytics Prophet Agent --> <div class="worker-card" data-worker="analytics-prophet" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Analytics Prophet Agent</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Prognozowanie trendów i analiza danych biznesowych.
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Forecast</span> <span class="feature-tag" data-astro-cid-my52qgmw>Business</span> <span class="feature-tag" data-astro-cid-my52qgmw>AI Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Opisz dane do analizy..." class="quick-prompt" id="analyticsProphetPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="window.open('/agents/analytics-prophet', '_blank')" data-astro-cid-my52qgmw>Prognozuj</button> </div> </div> <!-- Security Sentinel Agent --> <div class="worker-card" data-worker="security-sentinel" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>Security Sentinel Agent</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Monitorowanie bezpieczeństwa, wykrywanie zagrożeń i alerty.
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Security</span> <span class="feature-tag" data-astro-cid-my52qgmw>Monitoring</span> <span class="feature-tag" data-astro-cid-my52qgmw>AI Alert</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <input type="text" placeholder="Podaj incydent lub zapytanie..." class="quick-prompt" id="securitySentinelPrompt" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="window.open('/agents/security-sentinel', '_blank')" data-astro-cid-my52qgmw>Monitoruj</button> </div> </div> <!-- Activepieces Card --> <div class="worker-card" data-worker="activepieces" data-astro-cid-my52qgmw> <h3 class="worker-title" data-astro-cid-my52qgmw>
⚡ Activepieces
</h3> <p class="worker-description" data-astro-cid-my52qgmw>
Open-source automation platform for workflow automation
</p> <div class="worker-features" data-astro-cid-my52qgmw> <span class="feature-tag" data-astro-cid-my52qgmw>Automation</span> <span class="feature-tag" data-astro-cid-my52qgmw>Open Source</span> <span class="feature-tag" data-astro-cid-my52qgmw>Workflows</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw> <button class="action-btn primary" onclick="window.open('https://activepieces.com', '_blank')" data-astro-cid-my52qgmw>Open Activepieces</button> <button class="action-btn secondary" onclick="launchActivepieces()" data-astro-cid-my52qgmw>Launch</button> </div> </div> </div> <!-- 9 New Functions Grid --> <div class="additional-functions-section" data-astro-cid-my52qgmw> <h3 class="additional-title" data-astro-cid-my52qgmw>
ZAAWANSOWANE FUNKCJE AI
</h3> <div class="additional-grid" data-astro-cid-my52qgmw> <!-- Row 1 --> <div class="feature-tile" data-function="function2" onclick="openFunction('rekomendacje')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>🎯</div> <div class="feature-title" data-astro-cid-my52qgmw>
Personalizowane rekomendacje
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
System rekomendacyjny produktów i usług z analizą preferencji
                użytkowników
</div> </div> <div class="feature-tile" data-function="function3" onclick="openFunction('obsługa-klienta')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>📞</div> <div class="feature-title" data-astro-cid-my52qgmw>
Automatyzacja obsługi klienta
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
AI do kwalifikacji leadów i automatycznych odpowiedzi z
                integracją CRM
</div> </div> <div class="feature-tile" data-function="function4" onclick="openFunction('monitorowanie')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>📊</div> <div class="feature-title" data-astro-cid-my52qgmw>
Monitorowanie i raportowanie
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
Dashboard z automatycznym generowaniem raportów i alertami o
                anomaliach
</div> </div> <!-- Row 2 --> <div class="feature-tile" data-function="function6" onclick="openFunction('przypomnienia')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>🔔</div> <div class="feature-title" data-astro-cid-my52qgmw>
Harmonogramowanie i przypomnienia
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
Inteligentny system przypomnień z integracją z kalendarzami i AI
                przewidywaniem
</div> </div> <div class="feature-tile" data-function="function7" onclick="openFunction('faq-generator')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>❓</div> <div class="feature-title" data-astro-cid-my52qgmw>
Generator FAQ dynamiczny
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
AI generujący dynamicznie pytania i odpowiedzi na podstawie bazy
                wiedzy
</div> </div> <div class="feature-tile" data-function="function8" onclick="openFunction('edukacja')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>📚</div> <div class="feature-title" data-astro-cid-my52qgmw>
Rekomendacje edukacyjne
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
System rekomendacji kursów i materiałów edukacyjnych z
                profilowaniem użytkownika
</div> </div> <!-- Row 3 --> <div class="feature-tile" data-function="function9" onclick="openFunction('tickety')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>🎫</div> <div class="feature-title" data-astro-cid-my52qgmw>
System ticketów AI
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
Automatyczna klasyfikacja zgłoszeń z integracją Jira/Zendesk
</div> </div> <div class="feature-tile" data-function="quiz" onclick="openFunction('quizy')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>�</div> <div class="feature-title" data-astro-cid-my52qgmw>
Quizy i testy interaktywne
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
Framework do tworzenia quizów z AI oceną i spersonalizowanym
                feedbackiem
</div> </div> <div class="feature-tile" data-function="marketing" onclick="openFunction('marketing')" data-astro-cid-my52qgmw> <div class="feature-icon" data-astro-cid-my52qgmw>✍️</div> <div class="feature-title" data-astro-cid-my52qgmw>
Generator treści marketingowych
</div> <div class="feature-desc" data-astro-cid-my52qgmw>
Automatyczne generowanie i publikacja treści marketingowych
                przez AI
</div> </div> </div> </div> </div> </section> </main>  <div class="right-panel-fixed"> <div class="floating-widget-container"> <button onclick="toggleMusicPlayer()" class="right-btn" id="musicPlayerBtn"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:music" })} MUSIC PLAYER
</button> <div id="musicPlayerWidget" class="floating-widget hidden"> ${renderComponent($$result2, "BackgroundMusicPlayerFixed", BackgroundMusicPlayerFixed, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/BackgroundMusicPlayerFixed.svelte", "client:component-export": "default" })} </div> </div> <div class="floating-widget-container"> <button onclick="togglePolaczekAssistant()" class="right-btn" id="polaczekBtn" title="AI Assistant do wyjaśniania funkcji na stronie"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:bot" })} AI ASSISTANT
</button> <div id="polaczekWidget" class="floating-widget hidden"> ${renderComponent($$result2, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/AiHelpAssistant.svelte", "client:component-export": "default" })} </div> </div> <button onclick="openMainChat()" class="right-btn"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:message-circle" })} MAIN CHAT
</button> <button onclick="openRefresh()" class="right-btn"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:refresh-cw" })} REFRESH
</button> <button onclick="openFolder()" class="right-btn"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:folder" })} FOLDER
</button> <button onclick="openClose()" class="right-btn"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:x" })} CLOSE
</button> <!-- New Floating Buttons - Extended Set --> <button onclick="openSchowek()" class="right-btn" title="Schowek - Zbieranie informacji z r�nych stron"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:archive" })} SCHOWEK
</button> <button onclick="openKalendarz()" class="right-btn" title="Kalendarz - Organizacja zada� i termin�w"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:calendar-days" })} KALENDARZ
</button> <button onclick="openDodatki()" class="right-btn" title="Dodatki - Narz�dzia pomocnicze"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:wrench" })} DODATKI
</button> <button onclick="openFolder2()" class="right-btn" title="Folder 2 - Dodatkowy organizer plik�w"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:folder-plus" })} FOLDER 2
</button> <button onclick="openKatalogStron()" class="right-btn" title="Katalog Stron - Nawigacja po wszystkich funkcjach"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:list" })} KATALOG
</button> <button onclick="openInstrukcje()" class="right-btn" title="Instrukcje - Pomoc i przewodniki"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:book-open" })} INSTRUKCJE
</button> <button onclick="openZapas1()" class="right-btn" title="Zapas 1 - Funkcja do przysz�ego wykorzystania"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:star" })} ZAPAS 1
</button> <button onclick="openZapas2()" class="right-btn" title="Zapas 2 - Funkcja do przysz�ego wykorzystania"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:zap" })} ZAPAS 2
</button> <button onclick="openZapas3()" class="right-btn" title="Zapas 3 - Funkcja do przysz�ego wykorzystania"> ${renderComponent($$result2, "Icon", Icon, { "name": "lucide:rocket" })} ZAPAS 3
</button> </div>  <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section>  <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="flex flex-row justify-between items-center py-16 px-8"> <!-- Left corner - O_MNIE content --> <div class="max-w-xs text-left"> <div class="text-edge text-sm italic" style="
=======
            " data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>KLF_SHEED_SHOOP</button> </div> <div class="workers-grid" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <!-- Image Generator --> <div class="worker-card" data-worker="image" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Generator Obrazów
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Twórz niesamowite obrazy z tekstu używając Flux-1 Schnell
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Flux AI</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>512-1024px</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Tłumaczenie PL</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="Opisz obraz..." class="quick-prompt" id="imagePrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openImageGenerator()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Generuj</button> <button class="action-btn secondary" onclick="window.open('/image-generator', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> </div> <!-- AI Chatbot --> <div class="worker-card" data-worker="chat" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>AI Chatbot</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Inteligentny asystent do rozmów i odpowiadania na pytania
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>OpenAI GPT</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Język polski</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Kontekst</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="Zadaj pytanie..." class="quick-prompt" id="chatPrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openChatbot()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Chat</button> <button class="action-btn secondary" onclick="window.open('/chatbot', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> </div> <!-- BigQuery Analytics --> <div class="worker-card" data-worker="bigquery" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
BigQuery Analytics
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Analizuj dane z Google BigQuery, wykonuj zapytania SQL
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Google Cloud</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>SQL Query</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="SELECT * FROM..." class="quick-prompt" id="bigqueryPrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openBigQueryPopup()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Analizuj</button> <button class="action-btn secondary" onclick="window.open('/bigquery-analytics', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> </div> <!-- Kaggle Datasets --> <div class="worker-card" data-worker="kaggle" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Kaggle Datasets
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Przeszukuj zbiory danych, konkursy i profile Kaggle
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Machine Learning</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Datasets</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Competitions</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="machine learning..." class="quick-prompt" id="kagglePrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openKagglePopup()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Wyszukaj</button> <button class="action-btn secondary" onclick="window.open('/kaggle-datasets', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> </div> <!-- Tavily Search --> <div class="worker-card" data-worker="tavily" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Tavily AI Search
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Zaawansowane wyszukiwanie internetowe powered by AI
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>AI Search</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Real-time</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Deep Analysis</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="wyszukaj w sieci..." class="quick-prompt" id="tavilyPrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openTavily()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Szukaj</button> <button class="action-btn secondary" onclick="window.open('/tavily-search', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz</button> </div> </div> <!-- Voice AI Worker --> <div class="worker-card" data-worker="voice-ai" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
🎤 Voice AI Assistant
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Transkrypcja, synteza mowy i przetwarzanie komend głosowych
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Speech-to-Text</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Text-to-Speech</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Voice Commands</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <input type="text" placeholder="tekst do syntezy..." class="quick-prompt" id="voiceAiPrompt" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="openVoiceAIPopup()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🎤 Nagrywaj</button> <button class="action-btn secondary" onclick="quickSynthesize()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🔊 Synteza</button> </div> </div> <!-- STATUS WORKERS - Basic Opening Element --> <div class="worker-card" data-worker="status" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
🔧 STATUS WORKERS
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Zaawansowany system monitorowania statusu wszystkich Cloudflare
              Workers
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Real-time</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Monitoring</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Analytics</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="checkAllStatus()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Sprawdź Status</button> <button class="action-btn secondary" onclick="window.open('/status-workers', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Otwórz Dashboard</button> </div> </div> <!-- API Testing Card --> <div class="worker-card" data-worker="api-tests" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🧪 API Tests</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Testuj wszystkie Workers API endpoints i sprawdź połączenia
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Testing</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>API</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Debug</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="runAllAPITests()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Testuj wszystkie API</button> <button class="action-btn secondary" onclick="openAPITestConsole()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Konsola testów</button> </div> </div> <!-- Flowise AI Card --> <div class="worker-card" data-worker="flowise" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🧠 Flowise AI</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Visual AI workflow builder with drag-and-drop interface
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Visual Builder</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Workflows</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Integration</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="window.open('https://flowise.ai', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Open Flowise</button> <button class="action-btn secondary" onclick="launchFlowise()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Launch</button> </div> </div> <!-- Activepieces Card --> <div class="worker-card" data-worker="activepieces" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="worker-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
⚡ Activepieces
</h3> <p class="worker-description" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Open-source automation platform for workflow automation
</p> <div class="worker-features" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Automation</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Open Source</span> <span class="feature-tag" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Workflows</span> </div> <div class="worker-actions" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <button class="action-btn primary" onclick="window.open('https://activepieces.com', '_blank')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Open Activepieces</button> <button class="action-btn secondary" onclick="launchActivepieces()" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>Launch</button> </div> </div> </div> <!-- 9 New Functions Grid --> <div class="additional-functions-section" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <h3 class="additional-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
ZAAWANSOWANE FUNKCJE AI
</h3> <div class="additional-grid" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <!-- Row 1 --> <div class="feature-tile" data-function="function2" onclick="openFunction('rekomendacje')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🎯</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Personalizowane rekomendacje
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
System rekomendacyjny produktów i usług z analizą preferencji
                użytkowników
</div> </div> <div class="feature-tile" data-function="function3" onclick="openFunction('obsługa-klienta')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>📞</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Automatyzacja obsługi klienta
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
AI do kwalifikacji leadów i automatycznych odpowiedzi z
                integracją CRM
</div> </div> <div class="feature-tile" data-function="function4" onclick="openFunction('monitorowanie')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>📊</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Monitorowanie i raportowanie
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Dashboard z automatycznym generowaniem raportów i alertami o
                anomaliach
</div> </div> <!-- Row 2 --> <div class="feature-tile" data-function="function6" onclick="openFunction('przypomnienia')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🔔</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Harmonogramowanie i przypomnienia
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Inteligentny system przypomnień z integracją z kalendarzami i AI
                przewidywaniem
</div> </div> <div class="feature-tile" data-function="function7" onclick="openFunction('faq-generator')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>❓</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Generator FAQ dynamiczny
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
AI generujący dynamicznie pytania i odpowiedzi na podstawie bazy
                wiedzy
</div> </div> <div class="feature-tile" data-function="function8" onclick="openFunction('edukacja')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>📚</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Rekomendacje edukacyjne
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
System rekomendacji kursów i materiałów edukacyjnych z
                profilowaniem użytkownika
</div> </div> <!-- Row 3 --> <div class="feature-tile" data-function="function9" onclick="openFunction('tickety')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🎫</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
System ticketów AI
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Automatyczna klasyfikacja zgłoszeń z integracją Jira/Zendesk
</div> </div> <div class="feature-tile" data-function="quiz" onclick="openFunction('quizy')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>🧠</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Quizy i testy interaktywne
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Framework do tworzenia quizów z AI oceną i spersonalizowanym
                feedbackiem
</div> </div> <div class="feature-tile" data-function="marketing" onclick="openFunction('marketing')" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6> <div class="feature-icon" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>✍️</div> <div class="feature-title" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Generator treści marketingowych
</div> <div class="feature-desc" data-astro-cid-my52qgmw data-astro-cid-j7pv25f6>
Automatyczne generowanie i publikacja treści marketingowych
                przez AI
</div> </div> </div> </div> </div> </section> </main>  <div class="right-panel-fixed" data-astro-cid-j7pv25f6> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleMusicPlayer()" class="right-btn" id="musicPlayerBtn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "MusicalNoteIcon", ForwardRef$a, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} MUSIC PLAYER
</button> <div id="musicPlayerWidget" class="floating-widget" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "BackgroundMusicPlayerSimple", BackgroundMusicPlayerSimple, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/BackgroundMusicPlayerSimple.svelte", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> </div> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="togglePolaczekAssistant()" class="right-btn" id="polaczekBtn" title="AI Assistant do wyjaśniania funkcji na stronie" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CpuChipIcon", ForwardRef$b, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} AI ASSISTANT
</button> <div id="polaczekWidget" class="floating-widget" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "AiHelpAssistant", AiHelpAssistant, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/mybonzo-github/src/components/AiHelpAssistant.svelte", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </div> </div> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleGlobalVoice()" class="right-btn" id="globalVoiceBtn" title="Globalny system Voice - Włącz/wyłącz wszystkie agenty Voice" style="background: linear-gradient(45deg, #ff4444, #0f3846);" data-astro-cid-j7pv25f6>
🎤 VOICE OFF
</button> <!-- DEBUG/TEST BUTTONS for Voice System --> <div style="margin-top: 5px; display: flex; gap: 3px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="emergencyStopAll()" title="Awaryjne zatrzymanie wszystkich systemów" style="background: #ff0000; border: none; padding: 3px 6px; border-radius: 3px; color: white; cursor: pointer; font-size: 10px; font-weight: bold;" data-astro-cid-j7pv25f6>
🚨 STOP
</button> <button onclick="resetSystem()" title="Reset całego systemu Voice" style="background: #ffa500; border: none; padding: 3px 6px; border-radius: 3px; color: white; cursor: pointer; font-size: 10px; font-weight: bold;" data-astro-cid-j7pv25f6>
🔄 RESET
</button> <button onclick="testAllFunctions()" title="Test dostępności wszystkich funkcji" style="background: #0088ff; border: none; padding: 3px 6px; border-radius: 3px; color: white; cursor: pointer; font-size: 10px; font-weight: bold;" data-astro-cid-j7pv25f6>
🧪 TEST
</button> <button onclick="debugVoiceStatus()" title="Wyświetl status wszystkich systemów Voice" style="background: #00ff88; border: none; padding: 3px 6px; border-radius: 3px; color: white; cursor: pointer; font-size: 10px; font-weight: bold;" data-astro-cid-j7pv25f6>
📊 DEBUG
</button> </div> </div> <!-- Google Agent Widgets - Same structure as Music Player --> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleGeminiPro()" class="right-btn" id="geminiProBtn" title="Gemini Pro - Zaawansowany model językowy" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "SparklesIcon", ForwardRef$c, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} GEMINI PRO
</button> <div id="geminiProWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>✨ GEMINI PRO</span> <button onclick="toggleGeminiPro()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla Gemini Pro --> <div style="background: rgba(27, 225, 255, 0.1); border: 1px solid #1be1ff; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #1be1ff; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE GEMINI PRO</span> <button onclick="toggleGeminiProVoice()" id="geminiProVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 5px 10px; border-radius: 4px; color: #1be1ff; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startGeminiProVoice()" style="background: linear-gradient(45deg, #00ff88, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopGeminiProVoice()" style="background: linear-gradient(45deg, #ff4444, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="geminiProVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #1be1ff; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Otwórz muzykę", "Uruchom asystenta", "Zamknij wszystko"
</div> </div> <textarea id="geminiProInput" placeholder="Wpisz swoją wiadomość do Gemini Pro..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #1be1ff; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToGeminiPro()" style="background: linear-gradient(45deg, #1be1ff, #0f3846); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearGeminiPro()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 10px 20px; border-radius: 4px; color: #1be1ff; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="geminiProResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleGeminiVision()" class="right-btn" id="geminiVisionBtn" title="Gemini Vision - Analiza obrazów i wizji" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "EyeIcon", ForwardRef$d, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} GEMINI VISION
</button> <div id="geminiVisionWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>👁️ GEMINI VISION</span> <button onclick="toggleGeminiVision()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla Gemini Vision --> <div style="background: rgba(27, 225, 255, 0.1); border: 1px solid #1be1ff; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #1be1ff; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE GEMINI VISION</span> <button onclick="toggleGeminiVisionVoice()" id="geminiVisionVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 5px 10px; border-radius: 4px; color: #1be1ff; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startGeminiVisionVoice()" style="background: linear-gradient(45deg, #00ff88, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopGeminiVisionVoice()" style="background: linear-gradient(45deg, #ff4444, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="geminiVisionVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #1be1ff; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Opisz obraz", "Analizuj zdjęcie", "Co widzisz na ekranie"
</div> </div> <textarea id="geminiVisionInput" placeholder="Wpisz swoją wiadomość do Gemini Vision..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #1be1ff; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToGeminiVision()" style="background: linear-gradient(45deg, #1be1ff, #0f3846); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearGeminiVision()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 10px 20px; border-radius: 4px; color: #1be1ff; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="geminiVisionResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleCodeBison()" class="right-btn" id="codeBisonBtn" title="Code Bison - Asystent programowania" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CodeBracketIcon", ForwardRef$e, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} CODE BISON
</button> <div id="codeBisonWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>💻 CODE BISON</span> <button onclick="toggleCodeBison()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla Code Bison --> <div style="background: rgba(27, 225, 255, 0.1); border: 1px solid #1be1ff; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #1be1ff; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE CODE BISON</span> <button onclick="toggleCodeBisonVoice()" id="codeBisonVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 5px 10px; border-radius: 4px; color: #1be1ff; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startCodeBisonVoice()" style="background: linear-gradient(45deg, #00ff88, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopCodeBisonVoice()" style="background: linear-gradient(45deg, #ff4444, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="codeBisonVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #1be1ff; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Napisz funkcję JavaScript", "Debug ten kod", "Refaktoruj ten algorytm"
</div> </div> <textarea id="codeBisonInput" placeholder="Wpisz swoje pytanie programistyczne..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #1be1ff; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToCodeBison()" style="background: linear-gradient(45deg, #1be1ff, #0f3846); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearCodeBison()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 10px 20px; border-radius: 4px; color: #1be1ff; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="codeBisonResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleTextBison()" class="right-btn" id="textBisonBtn" title="Text Bison - Generowanie tekstu" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "DocumentTextIcon", ForwardRef$f, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} TEXT BISON
</button> <div id="textBisonWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>📝 TEXT BISON</span> <button onclick="toggleTextBison()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla Text Bison --> <div style="background: rgba(27, 225, 255, 0.1); border: 1px solid #1be1ff; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #1be1ff; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE TEXT BISON</span> <button onclick="toggleTextBisonVoice()" id="textBisonVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 5px 10px; border-radius: 4px; color: #1be1ff; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startTextBisonVoice()" style="background: linear-gradient(45deg, #00ff88, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopTextBisonVoice()" style="background: linear-gradient(45deg, #ff4444, #0f3846); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="textBisonVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #1be1ff; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Napisz artykuł o AI", "Stwórz opis produktu", "Generuj treść marketingową"
</div> </div> <textarea id="textBisonInput" placeholder="Wpisz tekst do wygenerowania..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #1be1ff; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToTextBison()" style="background: linear-gradient(45deg, #1be1ff, #0f3846); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearTextBison()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #1be1ff; padding: 10px 20px; border-radius: 4px; color: #1be1ff; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="textBisonResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <!-- Google Bard Agent --> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleGoogleBard()" class="right-btn" id="googleBardBtn" title="Google Bard - Zaawansowany AI Chat" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CpuChipIcon", ForwardRef$b, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} GOOGLE BARD
</button> <div id="googleBardWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>🧠 GOOGLE BARD</span> <button onclick="toggleGoogleBard()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla Google Bard --> <div style="background: rgba(255, 193, 7, 0.1); border: 1px solid #ffc107; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #ffc107; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE BARD</span> <button onclick="toggleBardVoice()" id="bardVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #ffc107; padding: 5px 10px; border-radius: 4px; color: #ffc107; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startBardVoice()" style="background: linear-gradient(45deg, #ffc107, #ff8f00); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopBardVoice()" style="background: linear-gradient(45deg, #ff4444, #cc0000); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="bardVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #ffc107; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Co wiesz o AI?", "Pomóż mi w projekcie", "Wytłumacz koncepcję"
</div> </div> <textarea id="googleBardInput" placeholder="Zapytaj Google Bard o cokolwiek..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #ffc107; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToGoogleBard()" style="background: linear-gradient(45deg, #ffc107, #ff8f00); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearGoogleBard()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #ffc107; padding: 10px 20px; border-radius: 4px; color: #ffc107; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="googleBardResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <!-- PaLM API Agent --> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="togglePaLMAPI()" class="right-btn" id="palmAPIBtn" title="PaLM API - Google's Large Language Model" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CpuChipIcon", ForwardRef$b, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} PALM API
</button> <div id="palmAPIWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>🌴 PALM API</span> <button onclick="togglePaLMAPI()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla PaLM API --> <div style="background: rgba(76, 175, 80, 0.1); border: 1px solid #4caf50; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #4caf50; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE PALM</span> <button onclick="togglePaLMVoice()" id="palmVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #4caf50; padding: 5px 10px; border-radius: 4px; color: #4caf50; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startPaLMVoice()" style="background: linear-gradient(45deg, #4caf50, #388e3c); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopPaLMVoice()" style="background: linear-gradient(45deg, #ff4444, #cc0000); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="palmVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #4caf50; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Analizuj dane", "Przetwórz informacje", "Generuj odpowiedź"
</div> </div> <textarea id="palmAPIInput" placeholder="Wprowadź zapytanie do PaLM API..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #4caf50; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToPaLMAPI()" style="background: linear-gradient(45deg, #4caf50, #388e3c); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearPaLMAPI()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #4caf50; padding: 10px 20px; border-radius: 4px; color: #4caf50; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="palmAPIResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <!-- Vertex AI Agent --> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleVertexAI()" class="right-btn" id="vertexAIBtn" title="Vertex AI - Google Cloud AI Platform" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "BoltIcon", ForwardRef$8, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} VERTEX AI
</button> <div id="vertexAIWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>⚡ VERTEX AI</span> <button onclick="toggleVertexAI()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla Vertex AI --> <div style="background: rgba(156, 39, 176, 0.1); border: 1px solid #9c27b0; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #9c27b0; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE VERTEX</span> <button onclick="toggleVertexVoice()" id="vertexVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #9c27b0; padding: 5px 10px; border-radius: 4px; color: #9c27b0; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startVertexVoice()" style="background: linear-gradient(45deg, #9c27b0, #7b1fa2); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopVertexVoice()" style="background: linear-gradient(45deg, #ff4444, #cc0000); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="vertexVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #9c27b0; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Przeprowadź analizę ML", "Trenuj model", "Predykcje biznesowe"
</div> </div> <textarea id="vertexAIInput" placeholder="Użyj Vertex AI do zaawansowanych zadań..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #9c27b0; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToVertexAI()" style="background: linear-gradient(45deg, #9c27b0, #7b1fa2); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearVertexAI()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #9c27b0; padding: 10px 20px; border-radius: 4px; color: #9c27b0; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="vertexAIResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <!-- Google AI Studio Agent --> <div class="floating-widget-container" data-astro-cid-j7pv25f6> <button onclick="toggleAIStudio()" class="right-btn" id="aiStudioBtn" title="AI Studio - Google's AI Development Platform" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "PaintBrushIcon", ForwardRef$3, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} AI STUDIO
</button> <div id="aiStudioWidget" class="floating-widget hidden" data-astro-cid-j7pv25f6> <div class="floating-widget-template" data-astro-cid-j7pv25f6> <div class="panel-header" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>🎨 AI STUDIO</span> <button onclick="toggleAIStudio()" style="background: transparent; border: none; color: #000; font-size: 18px; cursor: pointer;" data-astro-cid-j7pv25f6>×</button> </div> <div class="panel-content" data-astro-cid-j7pv25f6> <!-- Voice Controls dla AI Studio --> <div style="background: rgba(255, 87, 34, 0.1); border: 1px solid #ff5722; border-radius: 4px; padding: 10px; margin-bottom: 15px;" data-astro-cid-j7pv25f6> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;" data-astro-cid-j7pv25f6> <span style="color: #ff5722; font-weight: bold;" data-astro-cid-j7pv25f6>🎤 VOICE STUDIO</span> <button onclick="toggleAIStudioVoice()" id="aiStudioVoiceBtn" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #ff5722; padding: 5px 10px; border-radius: 4px; color: #ff5722; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>Rozłączony</button> </div> <div style="display: flex; gap: 10px; flex-wrap: wrap;" data-astro-cid-j7pv25f6> <button onclick="startAIStudioVoice()" style="background: linear-gradient(45deg, #ff5722, #e64a19); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>▶ Słuchaj</button> <button onclick="stopAIStudioVoice()" style="background: linear-gradient(45deg, #ff4444, #cc0000); border: none; padding: 8px 15px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; font-size: 12px;" data-astro-cid-j7pv25f6>⏹ Stop</button> <select id="aiStudioVoiceSelect" style="background: rgba(0, 0, 0, 0.7); border: 1px solid #ff5722; padding: 5px; border-radius: 4px; color: white; font-size: 12px;" data-astro-cid-j7pv25f6> <option value="pl-PL" data-astro-cid-j7pv25f6>Polskie 🇵🇱</option> <option value="en-US" data-astro-cid-j7pv25f6>English 🇺🇸</option> <option value="de-DE" data-astro-cid-j7pv25f6>Deutsch 🇩🇪</option> </select> </div> <div style="font-size: 11px; color: #aaa; margin-top: 8px;" data-astro-cid-j7pv25f6>
Przykłady: "Zaprojektuj model AI", "Przetestuj algorytm", "Optymalizuj wydajność"
</div> </div> <textarea id="aiStudioInput" placeholder="Pracuj z AI Studio nad projektami..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #ff5722; border-radius: 4px; background: rgba(0, 0, 0, 0.7); color: white; resize: vertical;" data-astro-cid-j7pv25f6></textarea> <div style="margin-top: 15px;" data-astro-cid-j7pv25f6> <button onclick="sendToAIStudio()" style="background: linear-gradient(45deg, #ff5722, #e64a19); border: none; padding: 10px 20px; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; margin-right: 10px;" data-astro-cid-j7pv25f6>Wyślij</button> <button onclick="clearAIStudio()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid #ff5722; padding: 10px 20px; border-radius: 4px; color: #ff5722; cursor: pointer;" data-astro-cid-j7pv25f6>Wyczyść</button> </div> <div id="aiStudioResponse" style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; min-height: 60px; text-align: left; font-size: 14px; display: none;" data-astro-cid-j7pv25f6></div> </div> </div> </div> </div> <button onclick="openBusinessAssistant()" class="right-btn" title="Business Assistant - Wsparcie biznesowe" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "BriefcaseIcon", ForwardRef$g, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} BUSINESS
</button> <button onclick="openMainChat()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ChatBubbleLeftRightIcon", ForwardRef$h, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} MAIN CHAT </button> <button onclick="openRefresh()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ArrowPathIcon", ForwardRef$i, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} REFRESH </button> <button onclick="openFolder()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "FolderIcon", ForwardRef$j, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} FOLDER </button> <button onclick="openClose()" class="right-btn" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "XMarkIcon", ForwardRef$k, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} CLOSE </button> <!-- New Floating Buttons - Extended Set --> <button onclick="openSchowek()" class="right-btn" title="Schowek - Zbieranie informacji z różnych stron" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ArchiveBoxIcon", ForwardRef$9, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} SCHOWEK </button> <button onclick="openKalendarz()" class="right-btn" title="Kalendarz - Organizacja zadań i terminów" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CalendarDaysIcon", ForwardRef$6, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} KALENDARZ </button> <button onclick="openDodatki()" class="right-btn" title="Dodatki - Narzędzia pomocnicze" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "WrenchScrewdriverIcon", ForwardRef, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} DODATKI </button> <button onclick="openFolder2()" class="right-btn" title="Folder 2 - Dodatkowy organizer plików" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "FolderPlusIcon", ForwardRef$5, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} FOLDER 2 </button> <button onclick="openKatalogStron()" class="right-btn" title="Katalog Stron - Nawigacja po wszystkich funkcjach" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ListBulletIcon", ForwardRef$4, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} KATALOG </button> <button onclick="openInstrukcje()" class="right-btn" title="Instrukcje - Pomoc i przewodniki" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "BookOpenIcon", ForwardRef$7, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} INSTRUKCJE </button> <button onclick="openZapas1()" class="right-btn" title="Zapas 1 - Funkcja do przyszłego wykorzystania" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "StarIcon", ForwardRef$1, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} ZAPAS 1 </button> <button onclick="openZapas2()" class="right-btn" title="Zapas 2 - Funkcja do przyszłego wykorzystania" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "BoltIcon", ForwardRef$8, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} ZAPAS 2 </button> <button onclick="openZapas3()" class="right-btn" title="Zapas 3 - Funkcja do przyszłego wykorzystania" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "RocketLaunchIcon", ForwardRef$2, { "className": "w-6 h-6 inline mr-2", "data-astro-cid-j7pv25f6": true })} ZAPAS 3 </button> </div>  <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="py-1" data-astro-cid-j7pv25f6></div> </div> </section>  <section class="border border-edge relative" data-astro-cid-j7pv25f6> <div class="absolute left-0 right-0 h-full" data-astro-cid-j7pv25f6> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge" data-astro-cid-j7pv25f6></div> </div> <div class="max-w-6xl mx-auto" data-astro-cid-j7pv25f6> <div class="flex flex-row justify-between items-center py-16 px-8" data-astro-cid-j7pv25f6> <!-- Left corner - O_MNIE content --> <div class="max-w-xs text-left" data-astro-cid-j7pv25f6> <div class="text-edge text-sm italic" style="
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
              transform: scale(1.69);
              transform-origin: left center;
              margin: 10px;
              margin-left: -10px;
              margin-bottom: 70px;
              width: calc(45vw - 20px);
              max-width: 320px;
              line-height: 1.4;
              word-wrap: break-word;
              hyphens: auto;
<<<<<<< HEAD
            ">
W mojej pracy skupiam się na integracji technologii w chmurze,
            nowoczesnych frameworków i AI, aby stworzyć asystenta, który rozumie
            i wspiera użytkownika w jego potrzebach.
</div> </div> <div class="flex flex-row justify-center gap-8 text-center"> <a class="hover:brightness-125 duration-200" target="_blank" rel="noopener noreferrer" href="/workers">
SYSTEM AGENTS
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> <div class="group w-24 p-1 border border-primary-foreground rounded-interactive text-primary-foreground text-xs font-black text-nowrap opacity-60"> <span class="group-hover:hidden">100% HANDMADE</span> <span class="hidden group-hover:inline">0% AI</span> </div> </div> </div> </div> </section>  <div class="admin-panel-fixed"> <a href="/admin/" class="admin-btn"> Panel Administracyjny </a> <!-- Login Section Below Admin Panel --> <div class="login-container-fixed" id="loginContainer"> <input type="text" id="dashboardLogin" maxlength="16" placeholder="Podaj login" class="login-input-fixed"> <button onclick="checkDashboardLogin()" class="login-btn-fixed">
Zaloguj się
</button> </div> </div>  ${renderComponent($$result2, "OpenRouterFloatingButtons", OpenRouterFloatingButtons, { "client:load": true, "client:component-hydration": "load", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/OpenRouterFloatingButtons.svelte", "client:component-export": "default" })} ` })}`;
}, "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro", void 0);

const $$file = "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro";
=======
            " data-astro-cid-j7pv25f6>
W mojej pracy skupiam się na integracji technologii w chmurze,
            nowoczesnych frameworków i AI, aby stworzyć asystenta, który rozumie
            i wspiera użytkownika w jego potrzebach.
</div> </div> <div class="flex flex-row justify-center gap-8 text-center" data-astro-cid-j7pv25f6> <a class="hover:brightness-125 duration-200" target="_blank" rel="noopener noreferrer" href="/workers" data-astro-cid-j7pv25f6>
SYSTEM AGENTS
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </a> <div class="group w-24 p-1 border border-primary-foreground rounded-interactive text-primary-foreground text-xs font-black text-nowrap opacity-60" data-astro-cid-j7pv25f6> <span class="group-hover:hidden" data-astro-cid-j7pv25f6>100% HANDMADE</span> <span class="hidden group-hover:inline" data-astro-cid-j7pv25f6>0% AI</span> </div> </div> </div> </div> </section>  <div class="admin-panel-fixed" data-astro-cid-j7pv25f6> <a href="/admin/" class="admin-btn" data-astro-cid-j7pv25f6> Panel Administracyjny </a> <!-- Login Section Below Admin Panel --> <div class="login-container-fixed" id="loginContainer" data-astro-cid-j7pv25f6> <input type="text" id="dashboardLogin" maxlength="16" placeholder="Podaj login" class="login-input-fixed" data-astro-cid-j7pv25f6> <button onclick="checkDashboardLogin()" class="login-btn-fixed" data-astro-cid-j7pv25f6>
Zaloguj się
</button> </div> </div>  ${renderComponent($$result2, "WorkerCommunicationPopup", $$WorkerCommunicationPopup, { "data-astro-cid-j7pv25f6": true })} ` }), renderScript($$result, "Q:/mybonzo/mybonzo-github/src/pages/index.astro?astro&type=script&index=1&lang.ts"));
}, "Q:/mybonzo/mybonzo-github/src/pages/index.astro", void 0);

const $$file = "Q:/mybonzo/mybonzo-github/src/pages/index.astro";
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
