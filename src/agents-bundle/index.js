// MyBonzo Agents Bundle - Globalna i lokalna instalacja agentów
// Automatyczne uruchamianie 3 sekundy po załadowaniu strony

import { GeminiProAgent } from "../agents/GeminiProAgent.ts";
import { GeminiVisionAgent } from "../agents/GeminiVisionAgent.ts";
import { CodeBisonAgent } from "../agents/CodeBisonAgent.ts";
import { TextBisonAgent } from "../agents/TextBisonAgent.ts";
import { BusinessAssistantAgent } from "../agents/BusinessAssistantAgent.ts";
import { ADKAdapter } from "../utils/ADKAdapter.ts";
import { GoogleAgentManager } from "../utils/GoogleAgentManager.ts";
import { GoogleAgentFactory } from "../utils/GoogleAgentFactory.ts";

class MyBonzoAgentsSystem {
  constructor() {
    this.agents = new Map();
    this.isInitialized = false;
    this.autoStartDelay = 3000; // 3 sekundy
    this.adkAdapter = null;
    this.googleManager = null;
    this.googleFactory = null;
    this.localStorage = null;

    console.log("🤖 MyBonzo Agents System - Inicjalizacja...");

    // Bind methods to preserve context
    this.initializeGlobal = this.initializeGlobal.bind(this);
    this.initializeLocal = this.initializeLocal.bind(this);
    this.autoStart = this.autoStart.bind(this);
    this.createAgent = this.createAgent.bind(this);
    this.getAgent = this.getAgent.bind(this);
    this.getAllAgents = this.getAllAgents.bind(this);
    this.saveToLocal = this.saveToLocal.bind(this);
    this.loadFromLocal = this.loadFromLocal.bind(this);
  }

  async initializeGlobal() {
    try {
      console.log("🌍 Inicjalizacja globalnej instalacji agentów...");

      // Initialize adapters
      this.adkAdapter = new ADKAdapter();
      this.googleManager = new GoogleAgentManager();
      this.googleFactory = new GoogleAgentFactory();

      // Create global agents with demo credentials
      const apiKey = "demo-key";
      const projectId = "mybonzo-project";
      const config = {
        apiKey,
        projectId,
        location: "europe-west1",
      };

      // Initialize all agent types
      const agentTypes = [
        { name: "geminiPro", class: GeminiProAgent },
        { name: "geminiVision", class: GeminiVisionAgent },
        { name: "codeBison", class: CodeBisonAgent },
        { name: "textBison", class: TextBisonAgent },
        { name: "businessAssistant", class: BusinessAssistantAgent },
      ];

      // Initialize agents sequentially to prevent promise rejection issues
      for (const agentType of agentTypes) {
        try {
          const agent = new agentType.class(config);
          this.agents.set(agentType.name, {
            instance: agent,
            status: "ready",
            type: agentType.name,
            config: config,
            createdAt: new Date().toISOString(),
          });
          console.log(
            `✅ Agent ${agentType.name} - zainicjalizowany globalnie`
          );
        } catch (error) {
          console.warn(`⚠️ Błąd inicjalizacji ${agentType.name}:`, error);
          // Continue with other agents even if one fails
        }
      }

      this.isInitialized = true;
      console.log(
        `🎉 Globalna instalacja ukończona - ${this.agents.size} agentów gotowych`
      );

      return true;
    } catch (error) {
      console.error("❌ Błąd globalnej inicjalizacji:", error);
      return false;
    }
  }

  initializeLocal() {
    try {
      console.log("💾 Inicjalizacja lokalnej instalacji agentów...");

      // Setup localStorage
      if (typeof window !== "undefined" && window.localStorage) {
        this.localStorage = window.localStorage;

        // Load existing agents from local storage
        this.loadFromLocal();

        // Setup periodic save
        setInterval(() => {
          this.saveToLocal();
        }, 30000); // Save every 30 seconds

        console.log("✅ Lokalna instalacja skonfigurowana");
        return true;
      } else {
        console.warn("⚠️ localStorage niedostępne");
        return false;
      }
    } catch (error) {
      console.error("❌ Błąd lokalnej inicjalizacji:", error);
      return false;
    }
  }

  saveToLocal() {
    if (!this.localStorage) return;

    try {
      const agentsData = Array.from(this.agents.entries()).map(
        ([name, data]) => ({
          name,
          status: data.status,
          type: data.type,
          config: { ...data.config, apiKey: "REDACTED" }, // Don't save sensitive data
          createdAt: data.createdAt,
          lastSaved: new Date().toISOString(),
          version: "1.0.0",
          sessionId: this.getSessionId(),
        })
      );

      // Also save system metadata
      const systemData = {
        agentCount: this.agents.size,
        lastAutoStart: new Date().toISOString(),
        browserInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
        },
        performance: {
          initTime: this.initTime || 0,
          avgResponseTime: this.calculateAvgResponseTime(),
        },
      };

      this.localStorage.setItem("mybonzo_agents", JSON.stringify(agentsData));
      this.localStorage.setItem("mybonzo_system", JSON.stringify(systemData));
      console.log("💾 Agenci i metadane zapisane lokalnie");
    } catch (error) {
      console.warn("⚠️ Błąd zapisu lokalnego:", error);
    }
  }

  loadFromLocal() {
    if (!this.localStorage) return;

    try {
      const savedAgents = this.localStorage.getItem("mybonzo_agents");
      const savedSystem = this.localStorage.getItem("mybonzo_system");

      if (savedAgents) {
        const agentsData = JSON.parse(savedAgents);
        console.log(
          `💾 Wczytano ${agentsData.length} agentów z lokalnego storage`
        );

        // Restore agent preferences if available
        for (const agentData of agentsData) {
          if (this.agents.has(agentData.name)) {
            const currentAgent = this.agents.get(agentData.name);
            currentAgent.preferences = agentData.preferences || {};
            currentAgent.lastUsed = agentData.lastUsed;
          }
        }
      }

      if (savedSystem) {
        const systemData = JSON.parse(savedSystem);
        console.log("💾 Wczytano metadane systemu:", systemData);
        this.systemMetadata = systemData;
      }

      return {
        agents: savedAgents ? JSON.parse(savedAgents) : [],
        system: savedSystem ? JSON.parse(savedSystem) : null,
      };
    } catch (error) {
      console.warn("⚠️ Błąd odczytu lokalnego:", error);
      return { agents: [], system: null };
    }
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
    return this.sessionId;
  }

  calculateAvgResponseTime() {
    // Placeholder for future response time tracking
    return 0;
  }

  clearLocalData() {
    if (this.localStorage) {
      this.localStorage.removeItem("mybonzo_agents");
      this.localStorage.removeItem("mybonzo_system");
      console.log("🗑️ Lokalne dane agentów wyczyszczone");
    }
  }

  createAgent(type, config = {}) {
    const agentClasses = {
      geminiPro: GeminiProAgent,
      geminiVision: GeminiVisionAgent,
      codeBison: CodeBisonAgent,
      textBison: TextBisonAgent,
      businessAssistant: BusinessAssistantAgent,
    };

    if (!agentClasses[type]) {
      throw new Error(`Nieznany typ agenta: ${type}`);
    }

    const AgentClass = agentClasses[type];
    const agent = new AgentClass(config);

    const agentData = {
      instance: agent,
      status: "ready",
      type: type,
      config: config,
      createdAt: new Date().toISOString(),
    };

    this.agents.set(type, agentData);
    this.saveToLocal();

    return agent;
  }

  getAgent(type) {
    const agentData = this.agents.get(type);
    return agentData ? agentData.instance : null;
  }

  getAllAgents() {
    const result = {};
    for (const [type, data] of this.agents.entries()) {
      result[type] = {
        instance: data.instance,
        status: data.status,
        type: data.type,
        createdAt: data.createdAt,
      };
    }
    return result;
  }

  async autoStart() {
    console.log(`⏰ Auto-start agentów za ${this.autoStartDelay}ms...`);

    setTimeout(() => {
      // Wrap async operations to handle promise rejections
      (async () => {
        try {
          console.log("🚀 Rozpoczynam automatyczne uruchamianie agentów...");

          // Initialize global and local systems
          const globalSuccess = await this.initializeGlobal();
          const localSuccess = this.initializeLocal();

          if (globalSuccess && localSuccess) {
            console.log("🎉 Wszystkie agenci gotowi do pracy!");

            // Expose global API
            if (typeof window !== "undefined") {
              window.MyBonzoAgents = this;
              window.AGENTS_READY = true;

              // Dispatch custom event
              window.dispatchEvent(
                new CustomEvent("mybonzo:agents:ready", {
                  detail: {
                    agents: this.getAllAgents(),
                    system: this,
                  },
                })
              );
            }
          } else {
            console.warn(
              "⚠️ Nie wszystkie systemy agentów zostały zainicjalizowane poprawnie"
            );
          }
        } catch (error) {
          console.error("❌ Błąd podczas auto-start agentów:", error);
        }
      })().catch((error) => {
        console.error("❌ Nieobsłużony błąd auto-start:", error);
      });
    }, this.autoStartDelay);
  }

  // Public API methods for external access
  openAgent(type) {
    const agent = this.getAgent(type);
    if (agent) {
      console.log(`🎯 Otwieranie agenta: ${type}`);
      // Trigger opening agent interface
      if (
        window.GOOGLE_VOICE &&
        window.GOOGLE_VOICE[
          `open${type.charAt(0).toUpperCase() + type.slice(1)}`
        ]
      ) {
        window.GOOGLE_VOICE[
          `open${type.charAt(0).toUpperCase() + type.slice(1)}`
        ]();
      }
      return agent;
    } else {
      console.warn(`⚠️ Agent ${type} nie jest dostępny`);
      return null;
    }
  }

  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      agentsCount: this.agents.size,
      autoStartDelay: this.autoStartDelay,
      hasLocalStorage: !!this.localStorage,
      agents: this.getAllAgents(),
    };
  }
}

// Auto-initialize system when script loads
const myBonzoAgentsSystem = new MyBonzoAgentsSystem();

// Start auto-initialization on DOM ready or immediately if DOM is already loaded
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      try {
        myBonzoAgentsSystem.autoStart();
      } catch (error) {
        console.error("❌ Błąd podczas DOMContentLoaded autoStart:", error);
      }
    });
  } else {
    // DOM already loaded
    try {
      myBonzoAgentsSystem.autoStart();
    } catch (error) {
      console.error("❌ Błąd podczas bezpośredniego autoStart:", error);
    }
  }
} else if (typeof window !== "undefined") {
  // Fallback for window-only environments
  window.addEventListener("load", () => {
    try {
      myBonzoAgentsSystem.autoStart();
    } catch (error) {
      console.error("❌ Błąd podczas window.load autoStart:", error);
    }
  });
}

// Export for module usage
export default myBonzoAgentsSystem;
