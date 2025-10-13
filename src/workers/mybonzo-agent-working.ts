import { Agent } from "../agents/agent";

// Typy dla stanu agenta
interface MyBonzoAgentState {
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  userPreferences: {
    language: string;
    theme: string;
    preferredModel: string;
  };
  agentType: string;
  lastActivity: string | null;
  stats: {
    messagesCount: number;
    imagesGenerated: number;
    tasksCompleted: number;
  };
}

// Rozszerzamy Cloudflare.Env z worker-configuration.d.ts
interface MyBonzoAgentEnv extends Cloudflare.Env {}

export class MyBonzoAgent extends Agent<MyBonzoAgentEnv, MyBonzoAgentState> {
  public id: string;
  public env: MyBonzoAgentEnv;

  constructor(id: string, env: MyBonzoAgentEnv) {
    super({});
    this.id = id;
    this.env = env;
    this.setState(this.initialState);
  }

  initialState: MyBonzoAgentState = {
    conversationHistory: [],
    userPreferences: {
      language: "pl",
      theme: "cyberpunk",
      preferredModel: "@cf/google/gemma-3-12b-it",
    },
    agentType: "mybonzo-assistant",
    lastActivity: null,
    stats: {
      messagesCount: 0,
      imagesGenerated: 0,
      tasksCompleted: 0,
    },
  };

  async onStart() {
    console.log("MyBonzo Agent uruchomiony");
    this.setState({
      ...this.state,
      lastActivity: new Date().toISOString(),
    });
  }

  // Główna metoda czatu z AI
  async chat(message: string, model?: string) {
    const activeModel = model || this.state.userPreferences.preferredModel;

    try {
      const response = await this.env.AI.run(activeModel as any, {
        messages: [
          {
            role: "system",
            content: `Jesteś asystentem AI MyBonzo. 🔥 Stylistyka: cyberpunk, neonowe kolory, nowoczesność.
                     Odpowiadaj po polsku, używaj emotikon i nowoczesnego języka. 
                     Jesteś pomocny, kreatywny i techniczny. 🚀`,
          },
          ...this.state.conversationHistory.slice(-8),
          { role: "user", content: message },
        ],
      });

      // Aktualizuj stan
      this.setState({
        ...this.state,
        conversationHistory: [
          ...this.state.conversationHistory,
          {
            role: "user" as const,
            content: message,
            timestamp: new Date().toISOString(),
          },
          {
            role: "assistant" as const,
            content: (response as any).response,
            timestamp: new Date().toISOString(),
          },
        ].slice(-16),
        lastActivity: new Date().toISOString(),
        stats: {
          ...this.state.stats,
          messagesCount: this.state.stats.messagesCount + 1,
        },
      });

      return {
        success: true,
        response: (response as any).response,
        model: activeModel,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Chat error:", error);
      return {
        success: false,
        response: "⚠️ Błąd podczas przetwarzania wiadomości.",
        error: String(error),
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Generowanie obrazów AI
  async generateImage(prompt: string, style: string = "cyberpunk") {
    try {
      const enhancedPrompt = `${style} style: ${prompt}. Neonowe kolory, futurystyczny design.`;

      const imageResponse = await this.env.AI.run(this.env.IMAGE_MODEL, {
        prompt: enhancedPrompt,
      });

      // Zapisz metadata do KV
      const imageKey = `mybonzo-img-${Date.now()}`;
      await this.env.IMAGES.put(
        imageKey,
        JSON.stringify({
          prompt: enhancedPrompt,
          style,
          created: new Date().toISOString(),
        })
      );

      this.setState({
        ...this.state,
        stats: {
          ...this.state.stats,
          imagesGenerated: this.state.stats.imagesGenerated + 1,
        },
        lastActivity: new Date().toISOString(),
      });

      return {
        success: true,
        imageKey,
        prompt: enhancedPrompt,
        style,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: "Błąd generowania obrazu",
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Zadania do wykonania
  async executeTask(taskType: string, taskData: any) {
    try {
      let result;

      switch (taskType) {
        case "research":
          result = await this.chat(
            `🔍 Zbadaj temat: ${taskData.topic}. Podaj szczegółowe informacje w stylu MyBonzo.`
          );
          break;

        case "summarize":
          result = await this.chat(
            `📋 Podsumuj w 3-5 punktach: ${taskData.text}`
          );
          break;

        case "creative":
          result = await this.chat(
            `🎨 Stwórz kreatywną treść: ${taskData.prompt}. Styl: ${
              taskData.style || "cyberpunk"
            }`
          );
          break;

        case "code":
          result = await this.chat(
            `💻 Pomóż z kodem: ${taskData.request}. Wyjaśnij i podaj przykład.`
          );
          break;

        default:
          result = { success: false, response: "❌ Nieznany typ zadania" };
      }

      this.setState({
        ...this.state,
        stats: {
          ...this.state.stats,
          tasksCompleted: this.state.stats.tasksCompleted + 1,
        },
      });

      return {
        taskType,
        result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        taskType,
        error: "Błąd wykonania zadania",
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Status agenta
  async getStatus() {
    return {
      status: "🟢 online",
      lastActivity: this.state.lastActivity,
      stats: this.state.stats,
      preferences: this.state.userPreferences,
      conversationLength: this.state.conversationHistory.length,
      agentType: this.state.agentType,
      timestamp: new Date().toISOString(),
    };
  }

  // Wyczyść historię
  async clearHistory() {
    this.setState({
      ...this.state,
      conversationHistory: [],
      lastActivity: new Date().toISOString(),
    });

    return {
      success: true,
      message: "🧹 Historia konwersacji wyczyszczona",
      timestamp: new Date().toISOString(),
    };
  }

  // Ustawienia
  async updatePreferences(
    preferences: Partial<MyBonzoAgentState["userPreferences"]>
  ) {
    this.setState({
      ...this.state,
      userPreferences: {
        ...this.state.userPreferences,
        ...preferences,
      },
      lastActivity: new Date().toISOString(),
    });

    return {
      success: true,
      message: "⚙️ Ustawienia zaktualizowane",
      preferences: this.state.userPreferences,
      timestamp: new Date().toISOString(),
    };
  }

  // Zapisz agenta do KV
  async saveToKV() {
    const agentData = {
      id: `mybonzo-${Date.now()}`,
      name: "MyBonzo Assistant",
      status: "active",
      config: this.state,
      system_prompt: "🤖 Asystent AI MyBonzo w stylu cyberpunk",
      created: new Date().toISOString(),
    };

    await this.env.AGENTS.put(
      `agent-${agentData.id}`,
      JSON.stringify(agentData)
    );

    return {
      success: true,
      agentId: agentData.id,
      message: "💾 Agent zapisany",
    };
  }

  // Analiza tekstu
  async analyzeText(text: string) {
    try {
      const analysisPrompt = `Przeanalizuj następujący tekst pod kątem:
      1. Nastroju/sentymentu
      2. Głównych tematów  
      3. Tonu wypowiedzi
      4. Sugerowanych działań
      
      Tekst: "${text}"
      
      Odpowiedz w formacie JSON z wynikami analizy.`;

      const result = await this.chat(analysisPrompt);

      return {
        success: true,
        analysis: result.response,
        originalText: text,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: "Błąd analizy tekstu",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default MyBonzoAgent;
