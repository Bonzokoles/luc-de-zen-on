export interface VoiceConfig {
  enabled: boolean;
  pages: Record<string, boolean>;
  agents: Record<string, boolean>;
  privacy: {
    microphone: boolean;
    dataProcessing: boolean;
    aiLearning: boolean;
  };
  settings: {
    voiceMode: string;
    sttLanguage: string;
    ttsVoice: string;
    processingMode: string;
  };
}

export async function GET(request: Request) {
  try {
    // Default configuration
    const defaultConfig: VoiceConfig = {
      enabled: true,
      pages: {
        "/": true,
        "/agent-*": true,
        "/api-*": false,
        "/voice-*": true,
      },
      agents: {
        "chatbot-agent": true,
        "polaczek-agent": true,
        "kaggle-agent": false,
        "bigquery-agent": false,
        "tavily-agent": false,
        "deepseek-agent": false,
      },
      privacy: {
        microphone: false,
        dataProcessing: false,
        aiLearning: false,
      },
      settings: {
        voiceMode: "passive",
        sttLanguage: "pl-PL",
        ttsVoice: "pl-zofia",
        processingMode: "realtime",
      },
    };

    return new Response(
      JSON.stringify({
        success: true,
        config: defaultConfig,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("❌ Voice Assistant Config API Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to load voice assistant configuration",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { config: Partial<VoiceConfig> };
    const config: Partial<VoiceConfig> = body.config;

    // Validate configuration
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration provided");
    }

    // In a real app, you would save this to a database
    // For now, we just validate and return success

    console.log("🎤 Voice AI Configuration Updated:", config);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Voice assistant configuration updated successfully",
        config: config,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Voice Assistant Config Update Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update configuration",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
