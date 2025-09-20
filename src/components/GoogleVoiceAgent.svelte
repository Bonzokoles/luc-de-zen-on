<script>
  import { onMount, onDestroy } from "svelte";
  import { ADKAdapter } from "../utils/ADKAdapter.js";
  import { GoogleAgentManager } from "../utils/GoogleAgentManager.js";
  import { GoogleAgentFactory } from "../utils/GoogleAgentFactory.js";
  import {
    RECOMMENDED_GOOGLE_AGENTS,
    getAllAgents,
    getAgentsByCategory,
    AGENT_CATEGORIES,
  } from "../utils/RecommendedGoogleAgents.js";

  let isListening = false;
  let isProcessing = false;
  let transcript = "";
  let confidence = 0;
  let isSupported = false;
  let recognition = null;
  let agentStatus = "disconnected";
  let lastResult = "";
  let adkAdapter = null;
  let googleManager = null;
  let importedAgents = [];
  let showAdvanced = false;
  let showAgentSelector = false;
  let selectedCategory = "core";
  let activeAgents = [];
  let googleFactory = null;
  let agentResults = {};
  let showAgentPanel = false;

  // Web Speech API Configuration
  let SpeechRecognition = null;

  onMount(() => {
    // Check for Web Speech API support
    if (typeof window !== "undefined") {
      SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      isSupported = !!SpeechRecognition;

      if (isSupported) {
        setupSpeechRecognition();
        setupGoogleVoiceAPI();
        agentStatus = "ready";
      } else {
        agentStatus = "not_supported";
        console.warn("🎤 Web Speech API not supported in this browser");
      }
    }
  });

  onDestroy(() => {
    if (recognition) {
      recognition.stop();
    }
    if (typeof window !== "undefined") {
      delete window.GOOGLE_VOICE;
    }
  });

  function setupSpeechRecognition() {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "pl-PL"; // Polish language
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started");
      isListening = true;
      agentStatus = "listening";
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          confidence = result[0].confidence;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        transcript = finalTranscript;
        lastResult = finalTranscript;
        console.log(
          "🎤 Final transcript:",
          finalTranscript,
          "Confidence:",
          confidence
        );
        processVoiceCommand(finalTranscript);
      } else {
        transcript = interimTranscript;
      }
    };

    recognition.onerror = (event) => {
      console.error("🎤 Speech recognition error:", event.error);
      agentStatus = "error";
      isListening = false;
      isProcessing = false;
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended");
      isListening = false;
      if (agentStatus !== "error") {
        agentStatus = "ready";
      }
    };
  }

  function setupGoogleVoiceAPI() {
    // Inicjalizuj ADK Adapter
    try {
      adkAdapter = new ADKAdapter();
      console.log("🔄 ADK Adapter zainicjalizowany");
    } catch (error) {
      console.warn("⚠️ ADK Adapter nie jest dostępny:", error);
    }

    // Inicjalizuj Google Agent Factory
    try {
      googleFactory = new GoogleAgentFactory({
        projectId: "mybonzo-project",
        location: "europe-west1",
        apiKey: "demo-key",
      });
      console.log("🤖 Google Agent Factory zainicjalizowany");
    } catch (error) {
      console.warn("⚠️ Google Factory nie jest dostępny:", error);
    }

    window.GOOGLE_VOICE = {
      startListening: startListening,
      stopListening: stopListening,
      getStatus: () => agentStatus,
      isSupported: () => isSupported,
      getLastResult: () => lastResult,
      importADKAgents: importADKAgents,
      testADKConnection: testADKConnection,
      getImportedAgents: () => importedAgents,
      activateAgent: activateAgent,
      deactivateAgent: deactivateAgent,
      getActiveAgents: () => activeAgents,
      getAllRecommendedAgents: getAllAgents,
      testGoogleAgent: testGoogleAgent,
      toggleAgentPanel: () => (showAgentPanel = !showAgentPanel),
    };

    console.log("🎤 Google Voice API registered and ready");
  }

  function startListening() {
    if (!isSupported || !recognition) {
      console.warn("🎤 Speech recognition not available");
      return;
    }

    if (isListening) {
      console.log("🎤 Already listening");
      return;
    }

    try {
      recognition.start();
      transcript = "";
      confidence = 0;
    } catch (error) {
      console.error("🎤 Failed to start recognition:", error);
      agentStatus = "error";
    }
  }

  function stopListening() {
    if (recognition && isListening) {
      recognition.stop();
    }
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  async function processVoiceCommand(command) {
    isProcessing = true;
    agentStatus = "processing";

    console.log("🎤 Processing voice command:", command);

    try {
      // Basic voice commands processing
      const lowerCommand = command.toLowerCase();

      if (lowerCommand.includes("otwórz") || lowerCommand.includes("uruchom")) {
        if (
          lowerCommand.includes("muzykę") ||
          lowerCommand.includes("player")
        ) {
          // Open music player
          if (window.toggleMusicPlayer) {
            window.toggleMusicPlayer(true);
          }
        } else if (
          lowerCommand.includes("asystent") ||
          lowerCommand.includes("pomoc")
        ) {
          // Open AI assistant
          if (window.togglePolaczekAssistant) {
            window.togglePolaczekAssistant(true);
          }
        }
      } else if (
        lowerCommand.includes("zamknij") ||
        lowerCommand.includes("ukryj")
      ) {
        // Close widgets
        const musicWidget = document.getElementById("musicPlayerWidget");
        const aiWidget = document.getElementById("polaczekWidget");

        if (musicWidget && !musicWidget.classList.contains("hidden")) {
          window.toggleMusicPlayer(true);
        }
        if (aiWidget && !aiWidget.classList.contains("hidden")) {
          window.togglePolaczekAssistant(true);
        }
      }

      // Here you could add Google Speech-to-Text API integration
      // or other advanced voice processing features
    } catch (error) {
      console.error("🎤 Error processing voice command:", error);
    } finally {
      isProcessing = false;
      agentStatus = "ready";
    }
  }

  function clearTranscript() {
    transcript = "";
    lastResult = "";
    confidence = 0;
  }

  // ADK Integration Functions
  async function importADKAgents() {
    if (!adkAdapter) {
      console.warn("🔄 ADK Adapter nie jest dostępny");
      return [];
    }

    try {
      agentStatus = "processing";
      console.log("🔄 Importuję agentów z ADK...");

      const results = await adkAdapter.importAllADKAgents();
      importedAgents = results;

      console.log("✅ Zaimportowano agentów:", results.length);
      agentStatus = "ready";
      return results;
    } catch (error) {
      console.error("❌ Błąd importu ADK:", error);
      agentStatus = "error";
      return [];
    }
  }

  async function testADKConnection() {
    if (!adkAdapter) {
      console.warn("🔄 ADK Adapter nie jest dostępny");
      return false;
    }

    try {
      agentStatus = "processing";
      console.log("🔄 Testuję połączenie z ADK...");

      const isAvailable = await adkAdapter.testADKAvailability();

      if (isAvailable) {
        console.log("✅ Połączenie z ADK działa");
        agentStatus = "ready";
      } else {
        console.log("❌ Połączenie z ADK nie działa");
        agentStatus = "error";
      }

      return isAvailable;
    } catch (error) {
      console.error("❌ Błąd testowania ADK:", error);
      agentStatus = "error";
      return false;
    }
  }

  function toggleAdvanced() {
    showAdvanced = !showAdvanced;
  }

  function getStatusColor() {
    switch (agentStatus) {
      case "listening":
        return "#1be1ff";
      case "processing":
        return "#ffaa1b";
      case "ready":
        return "#00ff88";
      case "error":
        return "#ff4444";
      case "not_supported":
        return "#666666";
      default:
        return "#888888";
    }
  }

  function getStatusText() {
    switch (agentStatus) {
      case "listening":
        return "Słucham...";
      case "processing":
        return "Przetwarzam...";
      case "ready":
        return "Gotowy";
      case "error":
        return "Błąd";
      case "not_supported":
        return "Brak wsparcia";
      default:
        return "Rozłączony";
    }
  }

  // Nowe funkcje Google Agents
  async function activateAgent(agentId) {
    try {
      console.log("🤖 Aktywowanie agenta:", agentId);

      if (!googleFactory) {
        throw new Error("Google Factory nie jest dostępny");
      }

      let agent = null;
      switch (agentId) {
        case "gemini_pro_agent":
          agent = await googleFactory.createGeminiProAgent();
          break;
        case "gemini_vision_agent":
          agent = await googleFactory.createGeminiVisionAgent();
          break;
        case "code_bison_agent":
          agent = await googleFactory.createCodeBisonAgent();
          break;
        case "text_bison_agent":
          agent = await googleFactory.createTextBisonAgent();
          break;
        default:
          throw new Error(`Nieznany agent: ${agentId}`);
      }

      const existingIndex = activeAgents.findIndex((a) => a.id === agentId);
      if (existingIndex >= 0) {
        activeAgents[existingIndex] = agent;
      } else {
        activeAgents = [...activeAgents, agent];
      }

      console.log("✅ Agent aktywowany:", agent.name);
      return agent;
    } catch (error) {
      console.error("❌ Błąd aktywacji agenta:", error);
      throw error;
    }
  }

  function deactivateAgent(agentId) {
    activeAgents = activeAgents.filter((agent) => agent.id !== agentId);
    delete agentResults[agentId];
    console.log("🔄 Agent dezaktywowany:", agentId);
  }

  async function testGoogleAgent(agentId) {
    try {
      const agent = await activateAgent(agentId);

      if (agent.chat) {
        const result = await agent.chat("Test komunikacji z agentem");
        agentResults[agentId] = result;
      } else if (agent.generateCode) {
        const result = await agent.generateCode(
          "Przykład funkcji",
          "typescript"
        );
        agentResults[agentId] = result;
      }

      console.log("🧪 Test agenta zakończony:", agentId);
    } catch (error) {
      console.error("❌ Błąd testu agenta:", error);
      agentResults[agentId] = `Błąd: ${error.message}`;
    }
  }

  function selectCategory(category) {
    selectedCategory = category;
  }

  function toggleAgentSelector() {
    showAgentSelector = !showAgentSelector;
  }
</script>

<div class="voice-control-panel floating-widget-template">
  <div class="voice-header">
    <div class="voice-title-section">
      <div class="voice-icon">🎤</div>
      <div class="voice-title">GOOGLE VOICE</div>
    </div>
    <div class="voice-status" style="color: {getStatusColor()};">
      {getStatusText()}
    </div>
  </div>

  <div class="voice-content">
    {#if !isSupported}
      <div class="voice-error">
        <p>Przeglądarka nie obsługuje rozpoznawania mowy</p>
        <small>Użyj Chrome, Edge lub Safari</small>
      </div>
    {:else}
      <div class="voice-controls">
        <button
          class="voice-button {isListening ? 'listening' : ''}"
          on:click={toggleListening}
          disabled={isProcessing}
        >
          {#if isListening}
            🛑 Zatrzymaj
          {:else if isProcessing}
            ⏳ Przetwarzam...
          {:else}
            🎤 Słuchaj
          {/if}
        </button>

        {#if transcript || lastResult}
          <button class="clear-button" on:click={clearTranscript}>
            🗑️ Wyczyść
          </button>
        {/if}

        <button class="advanced-button" on:click={toggleAdvanced}>
          {showAdvanced ? "🔼" : "🔽"} ADK
        </button>
      </div>

      {#if showAdvanced}
        <div class="advanced-section">
          <div class="advanced-title">🔧 Zaawansowane funkcje ADK</div>

          <div class="advanced-controls">
            <button class="adk-button" on:click={testADKConnection}>
              🔗 Test ADK
            </button>

            <button class="adk-button" on:click={importADKAgents}>
              📥 Import ADK
            </button>
          </div>

          {#if importedAgents.length > 0}
            <div class="imported-agents">
              <div class="agents-title">Zaimportowani agenci:</div>
              {#each importedAgents as agent}
                <div class="agent-item">
                  <span class="agent-name">{agent.name}</span>
                  <span class="agent-status {agent.status}">
                    {agent.status === "success" ? "✅" : "❌"}
                  </span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      {#if transcript}
        <div class="transcript-section">
          <div class="transcript-label">Rozpoznane:</div>
          <div class="transcript-text">{transcript}</div>
          {#if confidence > 0}
            <div class="confidence">
              Pewność: {Math.round(confidence * 100)}%
            </div>
          {/if}
        </div>
      {/if}

      {#if lastResult && lastResult !== transcript}
        <div class="last-result-section">
          <div class="result-label">Ostatnie polecenie:</div>
          <div class="result-text">{lastResult}</div>
        </div>
      {/if}

      <div class="voice-help">
        <small>
          Przykłady: "Otwórz muzykę", "Uruchom asystenta", "Zamknij wszystko"
        </small>
      </div>
    {/if}
  </div>
</div>

<!-- Floating Toggle Button dla Google Agents -->
<button
  class="floating-agents-toggle"
  on:click={() => {
    console.log("🔘 Kliknięto floating toggle button");
    showAgentPanel = !showAgentPanel;
    console.log("📱 showAgentPanel:", showAgentPanel);
  }}
  title="Toggle Google Agents Panel"
>
  🤖
</button>

<!-- Google Agents Panel - Floating po prawej stronie -->
{#if showAgentPanel}
  <div class="google-agents-panel floating-widget-template">
    <div class="agents-header">
      <div class="agents-title-section">
        <div class="agents-icon">🤖</div>
        <div class="agents-title">GOOGLE AGENTS</div>
      </div>
      <button
        class="close-agents-btn"
        on:click={() => (showAgentPanel = false)}
      >
        ✕
      </button>
    </div>

    <div class="agents-content">
      <!-- Category Selector -->
      <div class="category-selector">
        {#each AGENT_CATEGORIES as category}
          <button
            class="category-btn {selectedCategory === category.key
              ? 'active'
              : ''}"
            on:click={() => selectCategory(category.key)}
            style="border-color: {category.color};"
          >
            <span class="category-icon">{category.icon}</span>
            <span class="category-name">{category.name}</span>
          </button>
        {/each}
      </div>

      <!-- Agents Grid -->
      <div class="agents-grid">
        {#each getAgentsByCategory(selectedCategory) as agent}
          <div class="agent-card" style="border-left-color: {agent.color};">
            <div class="agent-header">
              <span class="agent-icon">{agent.icon}</span>
              <div class="agent-info">
                <div class="agent-name">{agent.name}</div>
                <div class="agent-model">{agent.model}</div>
              </div>
              <div
                class="agent-priority priority-{agent.priority.toLowerCase()}"
              >
                {agent.priority}
              </div>
            </div>

            <div class="agent-description">
              {agent.description}
            </div>

            <div class="agent-capabilities">
              {#each agent.capabilities.slice(0, 3) as capability}
                <span class="capability-tag">{capability}</span>
              {/each}
              {#if agent.capabilities.length > 3}
                <span class="capability-more"
                  >+{agent.capabilities.length - 3}</span
                >
              {/if}
            </div>

            <div class="agent-actions">
              {#if activeAgents.find((a) => a.id === agent.id)}
                <button
                  class="agent-btn active"
                  on:click={() => deactivateAgent(agent.id)}
                >
                  ✅ Aktywny
                </button>
                <button
                  class="agent-btn test"
                  on:click={() => testGoogleAgent(agent.id)}
                >
                  🧪 Test
                </button>
              {:else}
                <button
                  class="agent-btn activate"
                  on:click={() => {
                    console.log(
                      "🔘 Kliknięto przycisk aktywacji dla:",
                      agent.id
                    );
                    activateAgent(agent.id);
                  }}
                >
                  🚀 Aktywuj
                </button>
              {/if}
            </div>

            {#if agentResults[agent.id]}
              <div class="agent-result">
                <div class="result-header">📝 Ostatni wynik:</div>
                <div class="result-content">
                  {agentResults[agent.id].substring(0, 150)}
                  {#if agentResults[agent.id].length > 150}...{/if}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Active Agents Summary -->
      {#if activeAgents.length > 0}
        <div class="active-agents-summary">
          <div class="summary-title">
            🎯 Aktywne Agenty ({activeAgents.length})
          </div>
          <div class="active-agents-list">
            {#each activeAgents as agent}
              <div class="active-agent-item">
                <span class="agent-name">{agent.name}</span>
                <button
                  class="deactivate-btn"
                  on:click={() => deactivateAgent(agent.id)}
                >
                  ❌
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button
          class="quick-btn"
          on:click={() => testGoogleAgent("gemini_pro_agent")}
        >
          🤖 Test Gemini Pro
        </button>
        <button
          class="quick-btn"
          on:click={() => testGoogleAgent("code_bison_agent")}
        >
          💻 Test Code Bison
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Floating Toggle Button -->
<button
  class="toggle-agents-btn floating-widget-template"
  on:click={() => (showAgentPanel = !showAgentPanel)}
>
  <span class="toggle-icon">🤖</span>
  <span class="toggle-text">Google<br />Agents</span>
</button>

<style>
  .voice-control-panel {
    width: 320px;
    min-height: 180px;
    background: linear-gradient(
      135deg,
      rgba(15, 56, 70, 0.98),
      rgba(0, 0, 0, 0.95)
    );
    border: 2px solid #1be1ff;
    color: #ffffff;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 14px;
    display: flex;
    flex-direction: column;
  }

  .voice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(27, 225, 255, 0.3);
    background: rgba(0, 0, 0, 0.3);
  }

  .voice-title-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .voice-icon {
    font-size: 18px;
    color: #1be1ff;
  }

  .voice-title {
    font-weight: 600;
    font-size: 13px;
    color: #1be1ff;
    letter-spacing: 0.5px;
  }

  .voice-status {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 8px;
    border: 1px solid currentColor;
    background: rgba(0, 0, 0, 0.4);
  }

  .voice-content {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .voice-error {
    text-align: center;
    padding: 20px;
    color: #ff4444;
  }

  .voice-error small {
    display: block;
    margin-top: 8px;
    color: #cccccc;
    font-size: 12px;
  }

  .voice-controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .voice-button {
    flex: 1;
    padding: 10px 16px;
    background: linear-gradient(
      135deg,
      rgba(27, 225, 255, 0.2),
      rgba(27, 225, 255, 0.1)
    );
    border: 1px solid #1be1ff;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 13px;
    font-weight: 500;
  }

  .voice-button:hover {
    background: linear-gradient(
      135deg,
      rgba(27, 225, 255, 0.3),
      rgba(27, 225, 255, 0.2)
    );
    transform: translateY(-1px);
  }

  .voice-button:active {
    transform: translateY(0);
  }

  .voice-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .voice-button.listening {
    background: linear-gradient(
      135deg,
      rgba(255, 68, 68, 0.3),
      rgba(255, 68, 68, 0.2)
    );
    border-color: #ff4444;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .clear-button {
    padding: 10px 12px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;
  }

  .clear-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .advanced-button {
    padding: 10px 12px;
    background: rgba(27, 225, 255, 0.2);
    border: 1px solid #1be1ff;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;
  }

  .advanced-button:hover {
    background: rgba(27, 225, 255, 0.3);
  }

  .advanced-section {
    margin-top: 12px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(27, 225, 255, 0.3);
  }

  .advanced-title {
    font-size: 12px;
    color: #1be1ff;
    margin-bottom: 8px;
    font-weight: 600;
  }

  .advanced-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .adk-button {
    flex: 1;
    padding: 8px 12px;
    background: rgba(0, 255, 136, 0.2);
    border: 1px solid #00ff88;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
  }

  .adk-button:hover {
    background: rgba(0, 255, 136, 0.3);
  }

  .imported-agents {
    margin-top: 8px;
  }

  .agents-title {
    font-size: 11px;
    color: #1be1ff;
    margin-bottom: 6px;
  }

  .agent-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    margin-bottom: 2px;
    background: rgba(0, 0, 0, 0.2);
    font-size: 11px;
  }

  .agent-name {
    color: #ffffff;
  }

  .agent-status.success {
    color: #00ff88;
  }

  .agent-status.error {
    color: #ff4444;
  }

  .transcript-section,
  .last-result-section {
    background: rgba(0, 0, 0, 0.4);
    padding: 10px;
    border-left: 3px solid #1be1ff;
  }

  .transcript-label,
  .result-label {
    font-size: 11px;
    color: #1be1ff;
    margin-bottom: 4px;
    font-weight: 500;
  }

  .transcript-text,
  .result-text {
    font-size: 13px;
    color: #ffffff;
    line-height: 1.4;
  }

  .confidence {
    font-size: 10px;
    color: #888888;
    margin-top: 4px;
  }

  .voice-help {
    text-align: center;
    color: #888888;
    margin-top: auto;
  }

  .voice-help small {
    font-size: 11px;
    line-height: 1.3;
  }

  /* Floating Toggle Button - MyBonzo Style */
  .floating-agents-toggle {
    position: fixed;
    right: 20px;
    top: 80px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #1be1ff;
    color: #1be1ff;
    font-size: 18px;
    cursor: pointer;
    z-index: 9999;
    box-shadow:
      0 0 20px rgba(27, 225, 255, 0.3),
      0 4px 16px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  .floating-agents-toggle:hover {
    background: rgba(27, 225, 255, 0.1);
    box-shadow:
      0 0 25px rgba(27, 225, 255, 0.5),
      0 6px 20px rgba(0, 0, 0, 0.5);
    transform: scale(1.05);
    border-color: #00ff88;
    color: #00ff88;
  }

  /* Google Agents Panel Styles - MyBonzo Theme */
  .google-agents-panel {
    position: fixed;
    right: 240px; /* Po prawej obok głównego panelu */
    top: 20px;
    width: 400px;
    max-height: calc(100vh - 40px);
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(27, 225, 255, 0.5);
    border-radius: 8px;
    padding: 16px;
    z-index: 10000;
    overflow-y: auto;
    box-shadow:
      0 0 30px rgba(27, 225, 255, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .agents-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(66, 133, 244, 0.2);
  }

  .agents-title-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .agents-icon {
    font-size: 16px;
  }

  .agents-title {
    font-size: 14px;
    font-weight: 600;
    color: #1be1ff;
    text-shadow: 0 0 10px rgba(27, 225, 255, 0.5);
  }

  .close-agents-btn {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .close-agents-btn:hover {
    background: rgba(255, 0, 0, 0.2);
    border-color: #ff4444;
  }

  .category-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .category-btn {
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(27, 225, 255, 0.3);
    border-radius: 4px;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    transition: all 0.3s ease;
  }

  .category-btn:hover {
    background: rgba(27, 225, 255, 0.1);
    border-color: #1be1ff;
    box-shadow: 0 0 8px rgba(27, 225, 255, 0.3);
  }

  .category-btn.active {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    color: #00ff88;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }

  .category-icon {
    font-size: 12px;
  }

  .category-name {
    font-weight: 500;
  }

  .agents-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
  }

  .agent-card {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 3px solid #4285f4;
    border-radius: 8px;
    padding: 12px;
    transition: all 0.3s ease;
  }

  .agent-card:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-1px);
  }

  .agent-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .agent-icon {
    font-size: 16px;
  }

  .agent-info {
    flex: 1;
  }

  .agent-name {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
  }

  .agent-model {
    font-size: 10px;
    color: #888888;
    font-family: monospace;
  }

  .agent-priority {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
  }

  .priority-high {
    background: rgba(234, 67, 53, 0.2);
    color: #ea4335;
  }

  .priority-medium {
    background: rgba(251, 188, 4, 0.2);
    color: #fbbc04;
  }

  .priority-low {
    background: rgba(154, 160, 166, 0.2);
    color: #9aa0a6;
  }

  .agent-description {
    font-size: 11px;
    color: #cccccc;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .agent-capabilities {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 10px;
  }

  .capability-tag {
    padding: 2px 6px;
    background: rgba(66, 133, 244, 0.2);
    border: 1px solid rgba(66, 133, 244, 0.3);
    border-radius: 4px;
    font-size: 9px;
    color: #4285f4;
  }

  .capability-more {
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 9px;
    color: #888888;
  }

  .agent-actions {
    display: flex;
    gap: 6px;
  }

  .agent-btn {
    padding: 8px 12px;
    border: 1px solid rgba(27, 225, 255, 0.5);
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    transition: all 0.3s ease;
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    text-align: center;
  }

  .agent-btn.activate {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    color: #00ff88;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
  }

  .agent-btn.active {
    background: rgba(27, 225, 255, 0.2);
    border-color: #1be1ff;
    color: #1be1ff;
    box-shadow: 0 0 10px rgba(27, 225, 255, 0.3);
  }

  .agent-btn.test {
    background: rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
    color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
  }

  .agent-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(27, 225, 255, 0.3);
    background: rgba(27, 225, 255, 0.1);
  }

  .agent-result {
    margin-top: 10px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    border-left: 3px solid #fbbc04;
  }

  .result-header {
    font-size: 10px;
    color: #fbbc04;
    margin-bottom: 4px;
    font-weight: 600;
  }

  .result-content {
    font-size: 11px;
    color: #cccccc;
    line-height: 1.3;
  }

  .active-agents-summary {
    margin-top: 16px;
    padding: 12px;
    background: rgba(66, 133, 244, 0.1);
    border: 1px solid rgba(66, 133, 244, 0.2);
    border-radius: 8px;
  }

  .summary-title {
    font-size: 12px;
    color: #4285f4;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .active-agents-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .active-agent-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  .active-agent-item .agent-name {
    font-size: 11px;
    color: #ffffff;
  }

  .deactivate-btn {
    background: none;
    border: none;
    color: #ff4444;
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
  }

  .quick-actions {
    margin-top: 16px;
    display: flex;
    gap: 8px;
  }

  .quick-btn {
    flex: 1;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.3s ease;
  }

  .quick-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Floating Toggle Button */
  .toggle-agents-btn {
    position: fixed;
    right: 20px;
    top: 140px; /* Poniżej głównego widgetu voice */
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid rgba(66, 133, 244, 0.3);
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    z-index: 9999;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
  }

  .toggle-agents-btn:hover {
    transform: scale(1.05);
    border-color: #4285f4;
    box-shadow: 0 4px 20px rgba(66, 133, 244, 0.3);
  }

  .toggle-icon {
    font-size: 20px;
  }

  .toggle-text {
    font-size: 9px;
    color: #4285f4;
    font-weight: 600;
    text-align: center;
    line-height: 1;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .google-agents-panel {
      right: 10px;
      left: 10px;
      width: auto;
      max-width: none;
    }

    .toggle-agents-btn {
      right: 10px;
    }
  }
</style>
