globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_D_xeYX_3.mjs';

const voiceCommands = {
  "pl-PL": [
    // POLACZEK Commands
    {
      patterns: [
        /otwórz polaczek/i,
        /uruchom polaczek/i,
        /pokaż polaczek/i,
        /włącz polaczek/i
      ],
      intent: "open_widget",
      action: "togglePolaczekAssistant",
      description: "Otwiera widget POLACZEK"
    },
    {
      patterns: [
        /zamknij polaczek/i,
        /wyłącz polaczek/i,
        /ukryj polaczek/i
      ],
      intent: "close_widget",
      action: "closePolaczekAssistant",
      description: "Zamyka widget POLACZEK"
    },
    // WebMaster Commands
    {
      patterns: [
        /otwórz webmaster/i,
        /uruchom webmaster/i,
        /analiza seo/i,
        /sprawdź seo/i
      ],
      intent: "open_widget",
      action: "toggleWebMasterWidget",
      description: "Otwiera widget WebMaster"
    },
    // AI Image Generation
    {
      patterns: [
        /wygeneruj obraz (.+)/i,
        /stwórz obraz (.+)/i,
        /narysuj (.+)/i
      ],
      intent: "generate_image",
      action: "generateImage",
      parameters: ["prompt"],
      description: "Generuje obraz na podstawie opisu"
    },
    // Music Commands
    {
      patterns: [
        /włącz muzykę/i,
        /puszczaj muzykę/i,
        /odtwarzaj muzykę/i
      ],
      intent: "music_control",
      action: "playMusic",
      description: "Rozpoczyna odtwarzanie muzyki"
    },
    {
      patterns: [
        /wyłącz muzykę/i,
        /zatrzymaj muzykę/i,
        /pauza muzyka/i
      ],
      intent: "music_control",
      action: "pauseMusic",
      description: "Zatrzymuje odtwarzanie muzyki"
    },
    // System Commands
    {
      patterns: [
        /sprawdź status/i,
        /status systemu/i,
        /jak działają systemy/i
      ],
      intent: "system_status",
      action: "checkSystemStatus",
      description: "Sprawdza status wszystkich systemów"
    },
    // Navigation Commands
    {
      patterns: [
        /idź do (.+)/i,
        /otwórz stronę (.+)/i,
        /przejdź do (.+)/i
      ],
      intent: "navigation",
      action: "navigateToPage",
      parameters: ["page"],
      description: "Nawiguje do określonej strony"
    },
    // Analysis Commands
    {
      patterns: [
        /przeanalizuj (.+)/i,
        /sprawdź wydajność (.+)/i,
        /analiza wydajności/i
      ],
      intent: "analysis",
      action: "performAnalysis",
      parameters: ["target"],
      description: "Wykonuje analizę wydajności"
    }
  ],
  "en-US": [
    // POLACZEK Commands
    {
      patterns: [
        /open polaczek/i,
        /show polaczek/i,
        /launch polaczek/i
      ],
      intent: "open_widget",
      action: "togglePolaczekAssistant",
      description: "Opens POLACZEK widget"
    },
    {
      patterns: [
        /close polaczek/i,
        /hide polaczek/i,
        /disable polaczek/i
      ],
      intent: "close_widget",
      action: "closePolaczekAssistant",
      description: "Closes POLACZEK widget"
    },
    // WebMaster Commands
    {
      patterns: [
        /open webmaster/i,
        /launch webmaster/i,
        /seo analysis/i,
        /check seo/i,
        /analyze seo/i
      ],
      intent: "open_widget",
      action: "toggleWebMasterWidget",
      description: "Opens WebMaster widget"
    },
    // AI Image Generation
    {
      patterns: [
        /generate image (.+)/i,
        /create image (.+)/i,
        /draw (.+)/i,
        /make picture (.+)/i
      ],
      intent: "generate_image",
      action: "generateImage",
      parameters: ["prompt"],
      description: "Generates image based on description"
    },
    // Music Commands
    {
      patterns: [
        /play music/i,
        /start music/i,
        /turn on music/i
      ],
      intent: "music_control",
      action: "playMusic",
      description: "Starts music playback"
    },
    {
      patterns: [
        /stop music/i,
        /pause music/i,
        /turn off music/i
      ],
      intent: "music_control",
      action: "pauseMusic",
      description: "Stops music playback"
    },
    // System Commands
    {
      patterns: [
        /check status/i,
        /system status/i,
        /how are systems/i,
        /system check/i
      ],
      intent: "system_status",
      action: "checkSystemStatus",
      description: "Checks all systems status"
    },
    // Navigation Commands
    {
      patterns: [
        /go to (.+)/i,
        /open page (.+)/i,
        /navigate to (.+)/i
      ],
      intent: "navigation",
      action: "navigateToPage",
      parameters: ["page"],
      description: "Navigates to specified page"
    },
    // Analysis Commands
    {
      patterns: [
        /analyze (.+)/i,
        /check performance (.+)/i,
        /performance analysis/i
      ],
      intent: "analysis",
      action: "performAnalysis",
      parameters: ["target"],
      description: "Performs performance analysis"
    }
  ]
};
function recognizeCommand(command, language) {
  const languageCommands = voiceCommands[language] || voiceCommands["en-US"];
  for (const cmdPattern of languageCommands) {
    for (const pattern of cmdPattern.patterns) {
      const match = command.match(pattern);
      if (match) {
        const parameters = {};
        if (cmdPattern.parameters && match.length > 1) {
          cmdPattern.parameters.forEach((param, index) => {
            if (match[index + 1]) {
              parameters[param] = match[index + 1].trim();
            }
          });
        }
        const confidence = Math.min(95, 70 + match[0].length / command.length * 25);
        return {
          success: true,
          recognized: true,
          command: {
            intent: cmdPattern.intent,
            action: cmdPattern.action,
            parameters: Object.keys(parameters).length > 0 ? parameters : void 0,
            confidence: Math.round(confidence)
          },
          execution: executeCommand(cmdPattern.action, parameters),
          suggestions: generateSuggestions(cmdPattern.intent, language)
        };
      }
    }
  }
  return {
    success: true,
    recognized: false,
    command: {
      intent: "unknown",
      action: "none",
      confidence: 0
    },
    execution: {
      executed: false,
      message: language === "pl-PL" ? "Nie rozpoznano komendy. Spróbuj ponownie lub sprawdź dostępne komendy." : "Command not recognized. Try again or check available commands."
    },
    suggestions: generateSuggestions("help", language)
  };
}
function executeCommand(action, parameters) {
  switch (action) {
    case "togglePolaczekAssistant":
      return {
        executed: true,
        result: { action: "toggle_polaczek" },
        message: "Widget POLACZEK został przełączony"
      };
    case "closePolaczekAssistant":
      return {
        executed: true,
        result: { action: "close_polaczek" },
        message: "Widget POLACZEK został zamknięty"
      };
    case "toggleWebMasterWidget":
      return {
        executed: true,
        result: { action: "toggle_webmaster" },
        message: "Widget WebMaster został przełączony"
      };
    case "generateImage":
      return {
        executed: true,
        result: {
          action: "generate_image",
          prompt: parameters?.prompt
        },
        message: `Rozpoczynam generowanie obrazu: "${parameters?.prompt}"`
      };
    case "playMusic":
      return {
        executed: true,
        result: { action: "play_music" },
        message: "Muzyka została włączona"
      };
    case "pauseMusic":
      return {
        executed: true,
        result: { action: "pause_music" },
        message: "Muzyka została zatrzymana"
      };
    case "checkSystemStatus":
      return {
        executed: true,
        result: {
          action: "system_status",
          status: {
            polaczek: "active",
            webmaster: "active",
            voiceai: "active",
            apis: "online"
          }
        },
        message: "Wszystkie systemy działają prawidłowo"
      };
    case "navigateToPage":
      return {
        executed: true,
        result: {
          action: "navigate",
          page: parameters?.page
        },
        message: `Nawiguję do: ${parameters?.page}`
      };
    case "performAnalysis":
      return {
        executed: true,
        result: {
          action: "analyze",
          target: parameters?.target
        },
        message: `Rozpoczynam analizę: ${parameters?.target}`
      };
    default:
      return {
        executed: false,
        message: "Nieznana komenda"
      };
  }
}
function generateSuggestions(intent, language) {
  const suggestions = {
    "pl-PL": {
      "help": [
        "Otwórz POLACZEK",
        "Uruchom WebMaster",
        "Wygeneruj obraz zachód słońca",
        "Włącz muzykę",
        "Sprawdź status systemu"
      ],
      "open_widget": [
        "Zamknij widget",
        "Pokaż więcej opcji",
        "Przełącz na pełny ekran"
      ],
      "music_control": [
        "Wyłącz muzykę",
        "Zmień głośność",
        "Następny utwór"
      ],
      "navigation": [
        "Wróć do strony głównej",
        "Otwórz ustawienia",
        "Przejdź do dashboard"
      ]
    },
    "en-US": {
      "help": [
        "Open POLACZEK",
        "Launch WebMaster",
        "Generate sunset image",
        "Play music",
        "Check system status"
      ],
      "open_widget": [
        "Close widget",
        "Show more options",
        "Switch to fullscreen"
      ],
      "music_control": [
        "Stop music",
        "Change volume",
        "Next track"
      ],
      "navigation": [
        "Go back home",
        "Open settings",
        "Go to dashboard"
      ]
    }
  };
  const langSuggestions = suggestions[language] || suggestions["en-US"];
  return langSuggestions[intent] || langSuggestions["help"];
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      command,
      language = "pl-PL",
      confidence = 80,
      context
    } = body;
    if (!command || command.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "Command field is required and cannot be empty"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (command.length > 500) {
      return new Response(JSON.stringify({
        success: false,
        error: "Command too long. Maximum 500 characters allowed"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (confidence < 60) {
      return new Response(JSON.stringify({
        success: true,
        recognized: false,
        command: {
          intent: "low_confidence",
          action: "none",
          confidence
        },
        execution: {
          executed: false,
          message: language === "pl-PL" ? "Komenda nie jest wystarczająco wyraźna. Spróbuj ponownie." : "Command not clear enough. Please try again."
        },
        suggestions: generateSuggestions("help", language)
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const result = recognizeCommand(command.trim(), language);
    if (context && result.execution.result) {
      result.execution.result.context = context;
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Voice Commands API Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error during command processing",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
const GET = async () => {
  const capabilities = {
    service: "Voice Commands API",
    version: "1.0.0",
    supportedLanguages: Object.keys(voiceCommands),
    availableCommands: voiceCommands,
    features: [
      "Natural language command recognition",
      "Multi-language support",
      "Context-aware execution",
      "Command suggestions",
      "Confidence scoring",
      "Parameter extraction"
    ],
    limits: {
      maxCommandLength: 500,
      minConfidence: 60,
      supportedIntents: [
        "open_widget",
        "close_widget",
        "generate_image",
        "music_control",
        "system_status",
        "navigation",
        "analysis"
      ]
    }
  };
  return new Response(JSON.stringify(capabilities), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
