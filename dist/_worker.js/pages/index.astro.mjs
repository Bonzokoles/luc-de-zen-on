globalThis.process ??= {}; globalThis.process.env ??= {};
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
                transform: scale(1.32);
                transform-origin: left center;
                margin: 15px;
                margin-left: 0px;
                width: calc(45vw - 30px);
                max-width: 380px;
                line-height: 1.4;
                word-wrap: break-word;
                hyphens: auto;
              ">
Pasjonat technologii i programista z misj�.<br>
Tworz� nowoczesne rozwi�zania, kt�re ��cz�<br>
sztuczn� inteligencj� z automatyzacj�.<br>
Moim celem jest budowanie u�ytecznych narz�dzi.
</div> </div> <span class="mt-auto"> <div style="
              transform: scale(1.56);
              transform-origin: center right;
              margin: 15px;
              width: calc(50vw - 576px - 10px - 20px - 30px);
              max-width: 400px;
              text-align: right;
              word-wrap: break-word;
              hyphens: auto;
            "> ${renderComponent($$result2, "RandomQuote", $$RandomQuote, {})} </div> <span style="" class="text-edge block px-2 text-xl font-semibold tracking-[0.3em]">
AUG 2025
</span> </span> </div> </div> </section> <!-- Header-Navigation Separator --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section> <!-- Navigation Section --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="flex flex-row p-2"> <a class="hover:brightness-125" href="/"> <h1 class="text-4xl sm:text-5xl">KAROL LISSON</h1> <h2 class="text-2xl sm:text-3xl">MY_Bonzo_AI_ZEnon_HuB</h2> </a> <div class="hidden ml-auto gap-4 md:gap-0 md:flex md:flex-col"> <a class="ml-auto hover:brightness-125 duration-200" href="mailto:LissonKarol.msa@gmail.com">
LissonKarol.msa@gmail.com
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> <div class="flex flex-row-reverse flex-wrap gap-4"> <a class="hover:brightness-125 duration-200" href="https://www.linkedin.com/in/linkedinHandle">
LinkedIn
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> <a class="hover:brightness-125 duration-200" href="https://www.github.com/githubUsername">
GitHub
<svg style="--rotation: -45deg" class="stroke-primary-foreground inline aspect-square w-3 h-auto fill-transparent rotate-[var(--rotation)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg> </a> </div> </div> </div> </div> </section> <!-- Separator Section 1 --> <section class="border border-edge relative z-[1]"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto"> <div class="py-1"></div> </div> </section> <!-- AI Workers Section - Centered --> <section class="border border-edge ai-workers-section flex items-center justify-center py-16 relative z-[1]" id="ai-workers"> <div class="absolute left-0 right-0 h-full"> <!-- Inner vertical lines --> <div class="absolute left-[calc(50vw+400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-400px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <!-- Outer vertical lines --> <div class="absolute left-[calc(50vw+600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> <div class="absolute right-[calc(50vw-600px)] top-0 bottom-0 w-px bg-edge z-[1]"></div> </div> <div class="max-w-6xl mx-auto w-full"> <div class="section-container"> <h2 class="system-title">SYSTEM ZAAWANSOWANEJ AUTOMATYZACJI AI</h2> <!-- Separator after title --> <div style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
            max-width: 1212px;
            margin: 0 auto;
            border-t: 1px solid #ffffff;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
          "></div> <p class="section-description" style="
            width: calc(100vw - 2 * (50vw - 576px - 10px - 20px) - 40px);
            max-width: 1100px;
            margin: 0 auto;
            margin-left: calc(50% - 10px);
            transform: translateX(-50%);
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.6;
            padding: 0 15px;
          ">
Platforma integruje wyspecjalizowane Workery AI, działające w
            chmurze Cloudflare, aby dostarczać kompleksowe rozwiązania
            automatyzacji z wykorzystaniem sztucznej inteligencji.
</p> </div>  ${renderComponent($$result2, "QuickVoiceAI", $$QuickVoiceAI, {})}   <!-- Full-width Music Visualizer - Extended to Left Screen Edge --> <div style="
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
          "> <!-- White lines extending to full screen width --> <div style="position:absolute; left:0; right:0; top:0; height:1px; background:#ffffff;"></div> <div style="position:absolute; left:0; right:0; bottom:0; height:1px; background:#ffffff;"></div> <!-- Music Visualizer - Two waves: Music Player and Mic --> <div style="
              width: 100vw;
              height: 120px;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
            "> <!-- Back layer: reacts to Music Player, same height but wave 3% taller --> <div style="
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%) scaleY(1.03); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.4;
                filter: hue-rotate(30deg) brightness(1.2);
                pointer-events:none;
              "> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Back layer mirrored: reacts to Music Player, flipped horizontally with darker color --> <div style="
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%) scaleY(1.03) scaleX(-1); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.3;
                filter: hue-rotate(30deg) brightness(0.8);
                pointer-events:none;
              "> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "music", "variant": "music", "client:component-hydration": "only", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> <!-- Front layer: reacts to Avatar (mic) --> <div style="
                position:absolute; 
                left: 50%; 
                transform: translateX(-50%); 
                width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
                max-width: 1212px;
                height: 120px;
                opacity: 0.8;
                pointer-events:none;
              "> ${renderComponent($$result2, "EdgeAudioVisualizer", null, { "client:only": "react", "height": 120, "source": "mic", "variant": "mic", "client:component-hydration": "only", "client:component-path": "Q:/mybonzo/luc-de-zen-on/src/components/voice-ai/EdgeAudioVisualizer.tsx", "client:component-export": "default" })} </div> </div> <!-- Optimized Script - Single Audio Context --> ${renderScript($$result2, "Q:/mybonzo/luc-de-zen-on/src/pages/index.astro?astro&type=script&index=0&lang.ts")} </div> <!-- Dashboard Buttons Section (only buttons after login) --> <div class="dashboard-buttons-section hidden" id="dashboardButtons"> <a href="/dashboard/klienci" class="dashboard-btn" data-astro-cid-my52qgmw>KLIENCI_DSH_BON</a> <a href="/dashboard/statystyki" class="dashboard-btn" data-astro-cid-my52qgmw>AKYW_STATYSTIC</a> <a href="/dashboard/prywatne" class="dashboard-btn" data-astro-cid-my52qgmw>PRIV_STAFF</a> </div> <!-- Small Tags Section --> <div class="tags-section" style="
               display: flex !important;
               justify-content: center !important;
               gap: 1rem !important;
               margin-bottom: 2rem !important;
               width: 100% !important;
               z-index: 1000 !important;
               position: relative !important;
             " data-astro-cid-my52qgmw> <button class="tag-btn" onclick="window.open('/POLACZEK_AGENT_SYS_23', '_blank')" style="
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
            " data-astro-cid-my52qgmw>POLACZEK_AGENT_SYS_23</button> <button class="tag-btn" onclick="window.open('/hub/ai-agent-s', '_blank')" style="
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
            " data-astro-cid-my52qgmw>BIELIK</button> <button class="tag-btn" onclick="window.open('/workers-status', '_blank')" style="
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
            " data-astro-cid-my52qgmw>ZENON</button> <button class="tag-btn" onclick="window.open('/klf-sheed-shop', '_blank')" style="
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
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
