import { Agent } from "agents";

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
interface MyBonzoAgentEnv extends Cloudflare.Env {
  // Dodatkowe bindings jeśli potrzebne
}

export class MyBonzoAgent extends Agent<MyBonzoAgentEnv, MyBonzoAgentState> {
  initialState: MyBonzoAgentState = {
    conversationHistory: [],
    userPreferences: {
      language: "pl",
      theme: "cyberpunk",
      preferredModel: "@cf/google/gemma-3-12b-it"
    },
    agentType: "mybonzo-assistant",
    lastActivity: null,
    stats: {
      messagesCount: 0,
      imagesGenerated: 0,
      tasksCompleted: 0
    }
  };

  async onStart() {
    console.log(`MyBonzo Agent uruchomiony`);
    this.setState({
      ...this.state,
      lastActivity: new Date().toISOString(),
      conversationHistory: []
    });
  }

  // Główna metoda czatu z AI
  async chat(message: string, model?: string) {
    const activeModel = model || this.state.userPreferences.preferredModel;
    
    try {
      const response = await this.env.AI.run(activeModel, {
        messages: [
          { 
            role: "system", 
            content: `Jesteś asystentem AI MyBonzo. Stylistyka: cyberpunk, neonowe kolory, nowoczesność. 
                     Odpowiadaj po polsku, używaj emotikon i nowoczesnego języka. 
                     Jesteś pomocny, kreatywny i techniczny.` 
          },
          ...this.state.conversationHistory.slice(-10), // Ostatnie 10 wiadomości
          { role: "user", content: message }
        ]
      });

      // Aktualizuj historię konwersacji
      this.setState({
        ...this.state,
        conversationHistory: [
          ...this.state.conversationHistory,
          { role: "user" as const, content: message, timestamp: new Date().toISOString() },
          { role: "assistant" as const, content: response.response, timestamp: new Date().toISOString() }
        ].slice(-20), // Zachowaj ostatnie 20 wiadomości
        lastActivity: new Date().toISOString(),
        stats: {
          ...this.state.stats,
          messagesCount: this.state.stats.messagesCount + 1
        }
      });

      return {
        response: response.response,
        model: activeModel,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error("Chat error:", error);
      return {
        response: "⚠️ Przepraszam, wystąpił błąd podczas przetwarzania wiadomości.",
        error: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Generowanie obrazów AI
  async generateImage(prompt: string, style: string = "cyberpunk") {
    try {
      const enhancedPrompt = `${style} style: ${prompt}. Neonowe kolory, futurystyczny design, wysokiej jakości digital art.`;
      
      const imageResponse = await this.env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
        prompt: enhancedPrompt
      });

      // Zapisz do R2 jeśli dostępne
      let imageUrl = null;
      if (this.env.IMAGES && imageResponse) {
        const imageKey = `mybonzo-${this.id}-${Date.now()}.png`;
        await this.env.IMAGES.put(imageKey, imageResponse);
        imageUrl = `https://images.mybonzo.com/${imageKey}`;
      }

      await this.setState({
        stats: {
          ...this.state.stats,
          imagesGenerated: this.state.stats.imagesGenerated + 1
        },
        lastActivity: new Date().toISOString()
      });

      return {
        success: true,
        imageUrl,
        prompt: enhancedPrompt,
        style,
        timestamp: new Date().toISOString(),
        agentId: this.id
      };

    } catch (error) {
      console.error("Image generation error:", error);
      return {
        success: false,
        error: "Nie udało się wygenerować obrazu",
        timestamp: new Date().toISOString(),
        agentId: this.id
      };
    }
  }

  // Analiza nastrojów wiadomości
  async analyzeSentiment(text: string) {
    try {
      const response = await this.env.AI.run("@cf/huggingface/distilbert-sst-2-int8", {
        text
      });

      return {
        sentiment: response,
        analyzedText: text,
        timestamp: new Date().toISOString(),
        agentId: this.id
      };

    } catch (error) {
      return {
        sentiment: null,
        error: "Analiza nastrojów niedostępna",
        timestamp: new Date().toISOString(),
        agentId: this.id
      };
    }
  }

  // Tłumaczenie tekstu
  async translate(text: string, targetLanguage: string = "en") {
    try {
      const response = await this.env.AI.run("@cf/meta/m2m100-1.2b", {
        text,
        source_lang: "polish",
        target_lang: targetLanguage
      });

      return {
        originalText: text,
        translatedText: response.translated_text,
        targetLanguage,
        timestamp: new Date().toISOString(),
        agentId: this.id
      };

    } catch (error) {
      return {
        originalText: text,
        translatedText: null,
        error: "Tłumaczenie niedostępne",
        timestamp: new Date().toISOString(),
        agentId: this.id
      };
    }
  }

  // Ustawienia użytkownika
  async updatePreferences(preferences: Partial<typeof this.initialState.userPreferences>) {
    await this.setState({
      userPreferences: {
        ...this.state.userPreferences,
        ...preferences
      },
      lastActivity: new Date().toISOString()
    });

    return {
      success: true,
      updatedPreferences: this.state.userPreferences,
      timestamp: new Date().toISOString(),
      agentId: this.id
    };
  }

  // Status agenta
  async getStatus() {
    return {
      id: this.id,
      status: "online",
      lastActivity: this.state.lastActivity,
      stats: this.state.stats,
      preferences: this.state.userPreferences,
      conversationLength: this.state.conversationHistory.length,
      agentType: this.state.agentType,
      timestamp: new Date().toISOString()
    };
  }

  // Wyczyść historię konwersacji
  async clearHistory() {
    await this.setState({
      conversationHistory: [],
      lastActivity: new Date().toISOString()
    });

    return {
      success: true,
      message: "Historia konwersacji została wyczyszczona",
      timestamp: new Date().toISOString(),
      agentId: this.id
    };
  }

  // Zadania do wykonania
  async executeTask(taskType: string, taskData: any) {
    try {
      let result;

      switch (taskType) {
        case "research":
          result = await this.chat(`Zbadaj temat: ${taskData.topic}. Podaj szczegółowe informacje.`);
          break;
        
        case "summarize":
          result = await this.chat(`Podsumuj następujący tekst w 3-5 punktach: ${taskData.text}`);
          break;
        
        case "creative":
          result = await this.chat(`Stwórz kreatywną treść na temat: ${taskData.prompt}. Styl: ${taskData.style || 'nowoczesny'}`);
          break;
        
        default:
          result = { response: "Nieznany typ zadania" };
      }

      await this.setState({
        stats: {
          ...this.state.stats,
          tasksCompleted: this.state.stats.tasksCompleted + 1
        }
      });

      return {
        taskType,
        result,
        timestamp: new Date().toISOString(),
        agentId: this.id
      };

    } catch (error) {
      return {
        taskType,
        error: "Błąd wykonania zadania",
        timestamp: new Date().toISOString(),
        agentId: this.id
      };
    }
  }
}

export default MyBonzoAgent;
