import type { APIRoute } from "astro";
import { AGENT_CONFIG } from "./config";

// Response helper
const createResponse = (data: any, status: number = 200) => {
  return new Response(
    JSON.stringify({
      ...data,
      agent: AGENT_CONFIG.name,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
};

// Voice Command Agent API
export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, data } = (await request.json()) as any;

    switch (action) {
      case "test":
        return testVoiceAgent();

      case "process_voice":
        return processVoiceCommand(data);

      case "synthesize":
        return synthesizeSpeech(data);

      case "get_commands":
        return getAvailableCommands();

      case "status":
        return getAgentStatus();

      case "config":
        return getAgentConfig();

      default:
        return createResponse(
          {
            error: "Invalid action",
            available_actions: [
              "test",
              "process_voice",
              "synthesize",
              "get_commands",
              "status",
              "config",
            ],
          },
          400
        );
    }
  } catch (error) {
    console.error(`${AGENT_CONFIG.name} API Error:`, error);
    return createResponse(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
};

// Handle CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

// Voice Agent Functions

async function testVoiceAgent() {
  // Check Web Speech API availability (will be checked on client-side)
  const speechSupport = {
    recognition: "Client-side check required",
    synthesis: "Client-side check required",
  };

  return createResponse({
    success: true,
    message: `${AGENT_CONFIG.name} is ready for voice processing`,
    voice_support: speechSupport,
    language: AGENT_CONFIG.voice.language,
    commands_available: Object.keys(AGENT_CONFIG.commands).length,
  });
}

async function processVoiceCommand(data: any) {
  if (!data || typeof data !== "object") {
    return createResponse(
      {
        error: "Invalid payload: expected data object with transcript",
      },
      400
    );
  }

  const { transcript, confidence } = data;

  if (!transcript) {
    return createResponse(
      {
        error: "No transcript provided",
      },
      400
    );
  }

  // Normalize transcript
  const normalizedText = transcript.toLowerCase().trim();

  // Find matching command
  const matchedCommand = findMatchingCommand(normalizedText);

  if (matchedCommand) {
    const result = await executeCommand(matchedCommand, normalizedText);
    return createResponse({
      success: true,
      transcript,
      confidence,
      command: matchedCommand,
      result,
    });
  } else {
    return createResponse({
      success: false,
      transcript,
      confidence,
      message:
        'Nie rozpoznano komendy. Spróbuj: "czas", "data", "idź do dashboard"',
      suggestions: getSuggestions(normalizedText),
    });
  }
}

function findMatchingCommand(text: string) {
  for (const [category, commands] of Object.entries(AGENT_CONFIG.commands)) {
    for (const command of commands) {
      for (const trigger of command.trigger) {
        if (text.includes(trigger)) {
          return {
            category,
            action: command.action,
            trigger,
            original: command,
          };
        }
      }
    }
  }
  return null;
}

async function executeCommand(command: any, originalText: string) {
  switch (command.action) {
    case "navigate":
      return handleNavigation(originalText);

    case "back":
      return { action: "history_back", message: "Cofam do poprzedniej strony" };

    case "refresh":
      return { action: "page_refresh", message: "Odświeżam stronę" };

    case "get_time":
      return {
        action: "display_time",
        time: new Date().toLocaleTimeString("pl-PL"),
        message: `Aktualny czas: ${new Date().toLocaleTimeString("pl-PL")}`,
      };

    case "get_date":
      return {
        action: "display_date",
        date: new Date().toLocaleDateString("pl-PL"),
        message: `Dzisiejsza data: ${new Date().toLocaleDateString("pl-PL")}`,
      };

    case "get_weather":
      return {
        action: "show_weather",
        message: "Sprawdzam pogodę...",
        note: "Funkcja pogody wymaga integracji z API",
      };

    case "activate_agent":
      return handleAgentActivation(originalText);

    case "stop_agent":
      return handleAgentStop(originalText);

    case "list_agents":
      return {
        action: "show_agents",
        message: "Pokazuję listę dostępnych agentów",
        redirect: "/agents",
      };

    default:
      return { message: "Komenda rozpoznana, ale nie zaimplementowana" };
  }
}

function handleNavigation(text: string) {
  // Extract destination from text
  if (text.includes("dashboard")) {
    return {
      action: "navigate",
      url: "/dashboard",
      message: "Przechodzę do dashboard",
    };
  }
  if (text.includes("voice") || text.includes("głos")) {
    return {
      action: "navigate",
      url: "/voice-ai",
      message: "Przechodzę do Voice AI",
    };
  }
  if (text.includes("agentów") || text.includes("agents")) {
    return {
      action: "navigate",
      url: "/agents",
      message: "Przechodzę do agentów",
    };
  }
  if (text.includes("home") || text.includes("główna")) {
    return {
      action: "navigate",
      url: "/",
      message: "Przechodzę do strony głównej",
    };
  }

  return {
    action: "navigation_help",
    message:
      "Podaj dokładną lokalizację. Dostępne: dashboard, voice, agents, home",
  };
}

function handleAgentActivation(text: string) {
  // Extract agent name/number from text
  const agentMatch = text.match(/agent[a-z\s]*(\d+|[a-z]+)/i);
  if (agentMatch) {
    return {
      action: "activate_agent",
      target: agentMatch[1],
      message: `Uruchamiam agenta: ${agentMatch[1]}`,
    };
  }

  return {
    action: "agent_help",
    message: "Podaj numer lub nazwę agenta do uruchomienia",
  };
}

function handleAgentStop(text: string) {
  return {
    action: "stop_all_agents",
    message: "Zatrzymuję wszystkich aktywnych agentów",
  };
}

function getSuggestions(text: string) {
  // Simple suggestion system based on text similarity
  const suggestions = [
    "czas",
    "data",
    "idź do dashboard",
    "uruchom agenta",
    "lista agentów",
  ];

  return suggestions
    .filter(
      (suggestion) => suggestion.includes(text) || text.includes(suggestion)
    )
    .slice(0, 3);
}

async function synthesizeSpeech(data: any) {
  const { text, options = {} } = data;

  if (!text) {
    return createResponse(
      {
        error: "No text provided for synthesis",
      },
      400
    );
  }

  return createResponse({
    success: true,
    text,
    synthesis_options: {
      ...AGENT_CONFIG.voice.synthesis,
      ...options,
    },
    message: "Text prepared for speech synthesis",
  });
}

async function getAvailableCommands() {
  const commandsList = [];

  for (const [category, commands] of Object.entries(AGENT_CONFIG.commands)) {
    commandsList.push({
      category,
      commands: commands.map((cmd) => ({
        triggers: cmd.trigger,
        action: cmd.action,
        description: getCommandDescription(cmd.action),
      })),
    });
  }

  return createResponse({
    success: true,
    total_categories: commandsList.length,
    commands: commandsList,
  });
}

function getCommandDescription(action: string): string {
  const descriptions: { [key: string]: string } = {
    navigate: "Przechodzi do wskazanej strony",
    back: "Cofa do poprzedniej strony",
    refresh: "Odświeża aktualną stronę",
    get_time: "Pokazuje aktualny czas",
    get_date: "Pokazuje dzisiejszą datę",
    get_weather: "Sprawdza informacje o pogodzie",
    activate_agent: "Uruchamia wskazanego agenta",
    stop_agent: "Zatrzymuje agenta lub agentów",
    list_agents: "Wyświetla listę dostępnych agentów",
  };

  return descriptions[action] || "Opis niedostępny";
}

async function getAgentStatus() {
  return createResponse({
    agent: AGENT_CONFIG.name,
    status: AGENT_CONFIG.status,
    version: AGENT_CONFIG.version,
    language: AGENT_CONFIG.voice.language,
    commands_loaded: Object.keys(AGENT_CONFIG.commands).length,
    uptime: process.uptime ? process.uptime() : 0,
  });
}

async function getAgentConfig() {
  return createResponse({
    config: AGENT_CONFIG,
  });
}
