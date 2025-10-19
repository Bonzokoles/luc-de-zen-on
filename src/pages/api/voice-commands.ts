// Voice Commands API - Integracja z D1 Database
// Endpoint: /api/voice-commands

export async function POST({ request, locals }) {
  try {
    const {
      action,
      command,
      recognizedText,
      language = "pl-PL",
    } = await request.json();
    const db = locals.runtime.env.AGENTS_DB;

    switch (action) {
      case "process_command":
        return await processVoiceCommand(db, {
          command,
          recognizedText,
          language,
        });
      case "get_history":
        return await getCommandHistory(db);
      case "analyze_command":
        return await analyzeCommand(db, { command, language });
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Voice Commands API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function processVoiceCommand(db, { command, recognizedText, language }) {
  let targetAgent = "unknown";
  let actionTaken = "none";
  let success = false;

  // Analiza komendy i delegacja do odpowiedniego agenta
  const commandLower = command.toLowerCase();

  if (
    commandLower.includes("muzyka") ||
    commandLower.includes("graj") ||
    commandLower.includes("play")
  ) {
    targetAgent = "music-control";
    actionTaken = "music_control";

    // Wywołaj Music Control API
    try {
      const musicResponse = await fetch("/api/music-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "play" }),
      });
      success = musicResponse.ok;
    } catch (error) {
      console.error("Failed to call music API:", error);
    }
  } else if (
    commandLower.includes("tłumacz") ||
    commandLower.includes("translate")
  ) {
    targetAgent = "polaczek";
    actionTaken = "translation";

    // Wywołaj Translation API
    try {
      const translateResponse = await fetch("/api/polaczek-t", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: command.replace(/tłumacz|translate/i, "").trim(),
          targetLang: "en",
          action: "translate",
        }),
      });
      success = translateResponse.ok;
    } catch (error) {
      console.error("Failed to call translation API:", error);
    }
  } else if (
    commandLower.includes("system") ||
    commandLower.includes("status")
  ) {
    targetAgent = "system-monitor";
    actionTaken = "system_check";

    // Wywołaj System API
    try {
      const systemResponse = await fetch("/api/system/validate", {
        method: "GET",
      });
      success = systemResponse.ok;
    } catch (error) {
      console.error("Failed to call system API:", error);
    }
  } else if (
    commandLower.includes("email") ||
    commandLower.includes("wyślij")
  ) {
    targetAgent = "email-handler";
    actionTaken = "email_operation";
    success = true; // Mock success for now
  } else if (
    commandLower.includes("bezpieczeństwo") ||
    commandLower.includes("security")
  ) {
    targetAgent = "security-guard";
    actionTaken = "security_scan";
    success = true; // Mock success for now
  } else {
    // Domyślnie przekaż do Polaczek (główny asystent)
    targetAgent = "polaczek";
    actionTaken = "general_chat";
    success = true;
  }

  // Zapisz komendę w historii
  await db
    .prepare(
      `
    INSERT INTO voice_commands (command, recognized_text, action_taken, target_agent, success, language)
    VALUES (?, ?, ?, ?, ?, ?)
  `
    )
    .bind(command, recognizedText, actionTaken, targetAgent, success, language)
    .run();

  // Loguj w system_logs
  await db
    .prepare(
      `
    INSERT INTO system_logs (agent_id, log_level, message, data)
    VALUES (?, ?, ?, ?)
  `
    )
    .bind(
      "voice-command",
      success ? "INFO" : "ERROR",
      "Voice command processed",
      JSON.stringify({ command, targetAgent, actionTaken, success })
    )
    .run();

  return new Response(
    JSON.stringify({
      success: success,
      command: command,
      targetAgent: targetAgent,
      actionTaken: actionTaken,
      message: success
        ? `Komenda przekazana do ${targetAgent}: ${actionTaken}`
        : `Nie udało się przetworzyć komendy: ${command}`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getCommandHistory(db, { limit = 20 } = {}) {
  const result = await db
    .prepare(
      `
    SELECT * FROM voice_commands
    ORDER BY timestamp DESC
    LIMIT ?
  `
    )
    .bind(limit)
    .all();

  return new Response(
    JSON.stringify({
      success: true,
      commands: result.results,
      count: result.results.length,
      message: `Retrieved ${result.results.length} voice commands from history`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function analyzeCommand(db, { command, language }) {
  const commandLower = command.toLowerCase();
  let analysis = {
    intent: "unknown",
    confidence: 0.5,
    suggestedAgent: "polaczek",
    keywords: [],
  };

  // Prosta analiza NLP
  if (
    commandLower.includes("muzyka") ||
    commandLower.includes("graj") ||
    commandLower.includes("play")
  ) {
    analysis = {
      intent: "music_control",
      confidence: 0.9,
      suggestedAgent: "music-control",
      keywords: ["muzyka", "graj", "play"],
    };
  } else if (
    commandLower.includes("tłumacz") ||
    commandLower.includes("translate")
  ) {
    analysis = {
      intent: "translation",
      confidence: 0.85,
      suggestedAgent: "polaczek",
      keywords: ["tłumacz", "translate"],
    };
  } else if (
    commandLower.includes("system") ||
    commandLower.includes("status")
  ) {
    analysis = {
      intent: "system_monitoring",
      confidence: 0.8,
      suggestedAgent: "system-monitor",
      keywords: ["system", "status"],
    };
  } else if (
    commandLower.includes("email") ||
    commandLower.includes("wyślij")
  ) {
    analysis = {
      intent: "email_operation",
      confidence: 0.75,
      suggestedAgent: "email-handler",
      keywords: ["email", "wyślij"],
    };
  }

  return new Response(
    JSON.stringify({
      success: true,
      command: command,
      analysis: analysis,
      message: `Analyzed command with ${analysis.confidence * 100}% confidence`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
