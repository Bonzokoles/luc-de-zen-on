<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let activeTab = "recognition"; // recognition, synthesis, commands, analysis
  let isListening = false;
  let isRecording = false;
  let isSpeaking = false;
  let isProcessing = false;
  let error = null;
  let isExpanded = false;

  // Voice Recognition variables
  let recognitionText = "";
  let recognitionLanguage = "pl-PL";
  let recognitionResults = null;

  // Voice Synthesis variables
  let synthesisText = "";
  let synthesisVoice = "pl-PL-Wavenet-A";
  let synthesisSpeed = 1.0;
  let synthesisResults = null;

  // Voice Commands variables
  let commandQuery = "";
  let commandResults = null;
  let availableCommands = [
    "Otwórz POLACZEK",
    "Generuj obraz",
    "Uruchom muzykę",
    "Sprawdź status",
    "Analiza SEO",
    "Pokaż dashboard",
  ];

  // Audio Analysis variables
  let analysisFile = null;
  let analysisResults = null;
  let audioUrl = "";

  // WebRTC and Audio Context
  let mediaRecorder = null;
  let audioContext = null;
  let analyser = null;
  let recognition = null;

  // Voice Recognition funkcje
  async function startVoiceRecognition() {
    if (isListening || isProcessing) return;

    error = null;
    isProcessing = true;

    try {
      const response = await fetch("/api/voice/recognition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: recognitionLanguage,
          enableRealTime: true,
          model: "latest_long",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Uruchom Web Speech API dla lokalnego rozpoznawania
      await startWebSpeechRecognition();

      const result = await response.json();
      recognitionResults = result;
      dispatch("voiceRecognitionStarted", { results: result });
    } catch (err) {
      error = err.message;
      console.error("Voice Recognition error:", err);
    } finally {
      isProcessing = false;
    }
  }

  async function startWebSpeechRecognition() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      throw new Error("Speech Recognition API not supported");
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = recognitionLanguage;

    recognition.onstart = () => {
      isListening = true;
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      recognitionText = finalTranscript || interimTranscript;
    };

    recognition.onend = () => {
      isListening = false;
    };

    recognition.onerror = (event) => {
      error = `Speech recognition error: ${event.error}`;
      isListening = false;
    };

    recognition.start();
  }

  function stopVoiceRecognition() {
    if (recognition) {
      recognition.stop();
    }
    isListening = false;
  }

  // Voice Synthesis funkcje
  async function synthesizeVoice() {
    if (!synthesisText.trim() || isProcessing) return;

    const textToSynthesize = synthesisText.trim();
    synthesisText = "";

    isProcessing = true;
    isSpeaking = true;
    error = null;

    try {
      const response = await fetch("/api/voice/synthesis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToSynthesize,
          voice: synthesisVoice,
          speed: synthesisSpeed,
          format: "mp3",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Odtwórz wygenerowany dźwięk
      if (result.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audio.onended = () => {
          isSpeaking = false;
        };
        await audio.play();
      }

      synthesisResults = result;
      dispatch("voiceSynthesisCompleted", { results: result });
    } catch (err) {
      error = err.message;
      console.error("Voice Synthesis error:", err);
    } finally {
      isProcessing = false;
    }
  }

  // Voice Commands funkcje
  async function processVoiceCommand() {
    if (!commandQuery.trim() || isProcessing) return;

    const command = commandQuery.trim();
    commandQuery = "";

    isProcessing = true;
    error = null;

    try {
      const response = await fetch("/api/voice/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: command,
          context: "mybonzo-platform",
          executeAction: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      commandResults = result;

      // Wykonaj akcję jeśli została rozpoznana
      if (result.action) {
        await executeVoiceAction(result.action);
      }

      dispatch("voiceCommandProcessed", { results: result });
    } catch (err) {
      error = err.message;
      console.error("Voice Command error:", err);
    } finally {
      isProcessing = false;
    }
  }

  async function executeVoiceAction(action) {
    switch (action.type) {
      case "open-polaczek":
        window.togglePolaczekAssistant && window.togglePolaczekAssistant();
        break;
      case "generate-image":
        window.openImageGenerator && window.openImageGenerator();
        break;
      case "play-music":
        window.toggleMusicPlayer && window.toggleMusicPlayer();
        break;
      case "open-webmaster":
        window.toggleWebMasterWidget && window.toggleWebMasterWidget();
        break;
      default:
        console.log("Unknown voice action:", action);
    }
  }

  // Audio Analysis funkcje
  async function analyzeAudio() {
    if (!analysisFile && !audioUrl) return;

    isProcessing = true;
    error = null;

    try {
      const formData = new FormData();
      if (analysisFile) {
        formData.append("audio", analysisFile);
      } else if (audioUrl) {
        formData.append("audioUrl", audioUrl);
      }
      formData.append("analysisType", "full");
      formData.append("extractTranscript", "true");

      const response = await fetch("/api/voice/analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      analysisResults = result;
      dispatch("audioAnalysisCompleted", { results: result });
    } catch (err) {
      error = err.message;
      console.error("Audio Analysis error:", err);
    } finally {
      isProcessing = false;
    }
  }

  // Recording funkcje
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        analysisFile = new File([blob], "recording.wav", { type: "audio/wav" });
        isRecording = false;
      };

      mediaRecorder.start();
      isRecording = true;
    } catch (err) {
      error = `Recording error: ${err.message}`;
    }
  }

  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  // Utility funkcje
  function clearResults() {
    recognitionResults = null;
    synthesisResults = null;
    commandResults = null;
    analysisResults = null;
    recognitionText = "";
    error = null;
  }

  function toggleWidget() {
    isExpanded = !isExpanded;
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      analysisFile = file;
    }
  }

  // Command shortcuts
  function executeQuickCommand(command) {
    commandQuery = command;
    processVoiceCommand();
  }
</script>

<!-- Voice AI Agent Widget -->
<div class="voice-ai-widget" class:expanded={isExpanded}>
  <div class="widget-header">
    <div class="title-section">
      <h3>🎤 Voice AI Agent</h3>
      <span class="service-badge">ADK Inspired</span>
    </div>
    <div class="header-actions">
      <button class="expand-btn" on:click={toggleWidget} title="Toggle Widget">
        {isExpanded ? "➖" : "➕"}
      </button>
      <button
        class="full-btn"
        on:click={() => window.open("/voice-ai-hub", "_blank")}
        title="Open Full Voice AI Hub"
      >
        🚀
      </button>
    </div>
  </div>

  {#if isExpanded}
    <div class="widget-content">
      <!-- Tabs Navigation -->
      <div class="tabs-nav">
        <button
          class="tab-btn"
          class:active={activeTab === "recognition"}
          on:click={() => (activeTab = "recognition")}
        >
          🎙️ Recognition
        </button>
        <button
          class="tab-btn"
          class:active={activeTab === "synthesis"}
          on:click={() => (activeTab = "synthesis")}
        >
          🗣️ Synthesis
        </button>
        <button
          class="tab-btn"
          class:active={activeTab === "commands"}
          on:click={() => (activeTab = "commands")}
        >
          ⚡ Commands
        </button>
        <button
          class="tab-btn"
          class:active={activeTab === "analysis"}
          on:click={() => (activeTab = "analysis")}
        >
          📊 Analysis
        </button>
      </div>

      <!-- Voice Recognition Tab -->
      {#if activeTab === "recognition"}
        <div class="tab-content">
          <div class="input-section">
            <div class="recognition-controls">
              <select bind:value={recognitionLanguage} class="language-select">
                <option value="pl-PL">Polski</option>
                <option value="en-US">English</option>
                <option value="de-DE">Deutsch</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
              </select>

              <button
                class="voice-btn"
                class:listening={isListening}
                class:processing={isProcessing}
                on:click={isListening
                  ? stopVoiceRecognition
                  : startVoiceRecognition}
                disabled={isProcessing}
              >
                {#if isProcessing}
                  <div class="spinner"></div>
                {:else if isListening}
                  🛑 Stop
                {:else}
                  🎤 Start
                {/if}
              </button>
            </div>

            {#if recognitionText}
              <div class="recognition-display">
                <h4>Rozpoznany tekst:</h4>
                <p>{recognitionText}</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Voice Synthesis Tab -->
      {#if activeTab === "synthesis"}
        <div class="tab-content">
          <div class="input-section">
            <div class="synthesis-controls">
              <select bind:value={synthesisVoice} class="voice-select">
                <option value="pl-PL-Wavenet-A">Polski - Kobieta</option>
                <option value="pl-PL-Wavenet-B">Polski - Mężczyzna</option>
                <option value="en-US-Wavenet-C">English - Female</option>
                <option value="en-US-Wavenet-D">English - Male</option>
              </select>

              <div class="speed-control">
                <label for="synthesis-speed">Prędkość: {synthesisSpeed}x</label>
                <input
                  id="synthesis-speed"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  bind:value={synthesisSpeed}
                />
              </div>
            </div>

            <div class="input-container">
              <textarea
                bind:value={synthesisText}
                class="synthesis-input"
                placeholder="Wprowadź tekst do syntezowania..."
                rows="3"
              ></textarea>
              <button
                class="synthesis-btn"
                class:speaking={isSpeaking}
                on:click={synthesizeVoice}
                disabled={!synthesisText.trim() || isProcessing}
              >
                {#if isProcessing}
                  <div class="spinner"></div>
                {:else if isSpeaking}
                  🔊
                {:else}
                  🗣️
                {/if}
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Voice Commands Tab -->
      {#if activeTab === "commands"}
        <div class="tab-content">
          <div class="input-section">
            <div class="input-container">
              <input
                type="text"
                bind:value={commandQuery}
                class="command-input"
                placeholder="Wprowadź komendę głosową..."
                on:keydown={(e) => e.key === "Enter" && processVoiceCommand()}
              />
              <button
                class="command-btn"
                on:click={processVoiceCommand}
                disabled={!commandQuery.trim() || isProcessing}
              >
                {#if isProcessing}
                  <div class="spinner"></div>
                {:else}
                  ⚡
                {/if}
              </button>
            </div>

            <div class="quick-commands">
              <h4>Szybkie komendy:</h4>
              <div class="command-grid">
                {#each availableCommands as command}
                  <button
                    class="quick-command-btn"
                    on:click={() => executeQuickCommand(command)}
                  >
                    {command}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Audio Analysis Tab -->
      {#if activeTab === "analysis"}
        <div class="tab-content">
          <div class="input-section">
            <div class="analysis-controls">
              <div class="upload-section">
                <input
                  type="file"
                  accept="audio/*"
                  on:change={handleFileSelect}
                  class="file-input"
                  id="audioFile"
                />
                <label for="audioFile" class="file-label">
                  📁 Wybierz plik audio
                </label>
              </div>

              <div class="url-section">
                <input
                  type="url"
                  bind:value={audioUrl}
                  class="url-input"
                  placeholder="Lub wprowadź URL audio..."
                />
              </div>

              <div class="record-section">
                <button
                  class="record-btn"
                  class:recording={isRecording}
                  on:click={isRecording ? stopRecording : startRecording}
                >
                  {#if isRecording}
                    🛑 Stop Recording
                  {:else}
                    🎙️ Record
                  {/if}
                </button>
              </div>
            </div>

            <button
              class="analysis-btn"
              on:click={analyzeAudio}
              disabled={(!analysisFile && !audioUrl) || isProcessing}
            >
              {#if isProcessing}
                <div class="spinner"></div>
                 Analizowanie...
              {:else}
                📊 Analizuj Audio
              {/if}
            </button>
          </div>
        </div>
      {/if}

      <!-- Results Display -->
      {#if recognitionResults || synthesisResults || commandResults || analysisResults || error}
        <div class="results-container">
          {#if error}
            <div class="error-message">
              <span>❌</span>
              <p>{error}</p>
            </div>
          {:else}
            <div class="results-display">
              {#if recognitionResults}
                <div class="recognition-results">
                  <h4>🎤 Wyniki rozpoznawania:</h4>
                  <div class="result-item">
                    <strong>Tekst:</strong>
                    {recognitionResults.transcript || "Brak tekstu"}
                  </div>
                  <div class="result-item">
                    <strong>Pewność:</strong>
                    {recognitionResults.confidence || "N/A"}%
                  </div>
                  <div class="result-item">
                    <strong>Język:</strong>
                    {recognitionResults.language || recognitionLanguage}
                  </div>
                </div>
              {/if}

              {#if synthesisResults}
                <div class="synthesis-results">
                  <h4>🗣️ Wyniki syntezy:</h4>
                  <div class="result-item">
                    <strong>Głos:</strong>
                    {synthesisResults.voice || synthesisVoice}
                  </div>
                  <div class="result-item">
                    <strong>Długość:</strong>
                    {synthesisResults.duration || "N/A"}s
                  </div>
                  {#if synthesisResults.audioUrl}
                    <audio controls src={synthesisResults.audioUrl}></audio>
                  {/if}
                </div>
              {/if}

              {#if commandResults}
                <div class="command-results">
                  <h4>⚡ Wyniki komendy:</h4>
                  <div class="result-item">
                    <strong>Komenda:</strong>
                    {commandResults.recognizedCommand || "Nierozpoznana"}
                  </div>
                  <div class="result-item">
                    <strong>Akcja:</strong>
                    {commandResults.action?.type || "Brak akcji"}
                  </div>
                  <div class="result-item">
                    <strong>Status:</strong>
                    {commandResults.executed ? "✅ Wykonana" : "❌ Błąd"}
                  </div>
                </div>
              {/if}

              {#if analysisResults}
                <div class="analysis-results">
                  <h4>📊 Wyniki analizy:</h4>
                  <div class="result-item">
                    <strong>Długość:</strong>
                    {analysisResults.duration || "N/A"}s
                  </div>
                  <div class="result-item">
                    <strong>Format:</strong>
                    {analysisResults.format || "N/A"}
                  </div>
                  {#if analysisResults.transcript}
                    <div class="result-item">
                      <strong>Transkrypcja:</strong>
                      {analysisResults.transcript}
                    </div>
                  {/if}
                  {#if analysisResults.emotions}
                    <div class="emotions-grid">
                      <strong>Emocje:</strong>
                      {#each Object.entries(analysisResults.emotions) as [emotion, value]}
                        <div class="emotion-item">
                          {emotion}: {value}%
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/if}

              <div class="actions">
                <button class="clear-btn" on:click={clearResults}>
                  🗑️ Wyczyść
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .voice-ai-widget {
    border: 1px solid var(--color-edge, #ccc);
    padding: 20px;
    margin: 16px 0;
    background: var(--color-background, transparent);
    transition: all 0.3s ease;
    border-radius: 8px;
  }

  .voice-ai-widget:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .voice-ai-widget.expanded {
    border-color: var(--color-primary, #666);
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-edge, #ccc);
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .title-section h3 {
    margin: 0;
    color: var(--color-foreground, #000);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .service-badge {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid var(--color-edge, #ccc);
  }

  .header-actions {
    display: flex;
    gap: 6px;
  }

  .expand-btn,
  .full-btn {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-secondary-foreground, #000);
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .expand-btn:hover,
  .full-btn:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  /* Tabs Navigation */
  .tabs-nav {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--color-edge, #ccc);
    margin-bottom: 16px;
  }

  .tab-btn {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-secondary-foreground, #000);
    padding: 8px 16px;
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    border-bottom: none;
  }

  .tab-btn.active {
    background: var(--color-background, #fff);
    color: var(--color-primary, #666);
    border-color: var(--color-primary, #666);
    border-bottom: 1px solid var(--color-background, #fff);
    margin-bottom: -1px;
  }

  .tab-btn:hover:not(.active) {
    filter: brightness(1.05);
  }

  /* Input Controls */
  .input-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .recognition-controls,
  .synthesis-controls,
  .analysis-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-bottom: 12px;
  }

  .language-select,
  .voice-select,
  .command-input,
  .url-input {
    background: var(--color-input-background, transparent);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 6px;
    padding: 8px 12px;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .language-select:focus,
  .voice-select:focus,
  .command-input:focus,
  .url-input:focus {
    outline: none;
    border-color: var(--color-primary, #666);
  }

  .voice-btn,
  .synthesis-btn,
  .command-btn,
  .analysis-btn,
  .record-btn {
    background: var(--color-primary, #666);
    color: var(--color-primary-foreground, #fff);
    border: 1px solid var(--color-edge, #ccc);
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .voice-btn:hover:not(:disabled),
  .synthesis-btn:hover:not(:disabled),
  .command-btn:hover:not(:disabled),
  .analysis-btn:hover:not(:disabled),
  .record-btn:hover {
    filter: brightness(1.05);
  }

  .voice-btn:disabled,
  .synthesis-btn:disabled,
  .command-btn:disabled,
  .analysis-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .voice-btn.listening {
    background: #dc2626;
    animation: pulse 1s infinite;
  }

  .record-btn.recording {
    background: #dc2626;
    animation: pulse 1s infinite;
  }

  .synthesis-btn.speaking {
    background: #16a34a;
  }

  .input-container {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  .synthesis-input {
    flex: 1;
    background: var(--color-input-background, transparent);
    border: 1px solid var(--color-edge, #ccc);
    border-radius: 6px;
    padding: 8px 12px;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
    resize: vertical;
    min-height: 60px;
  }

  .synthesis-input:focus {
    outline: none;
    border-color: var(--color-primary, #666);
  }

  .speed-control {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 120px;
  }

  .speed-control label {
    font-size: 0.8rem;
    color: var(--color-muted-foreground, #666);
  }

  .speed-control input[type="range"] {
    width: 100%;
  }

  /* Recognition Display */
  .recognition-display {
    background: var(--color-muted, #f5f5f5);
    border-radius: 6px;
    padding: 12px;
    border: 1px solid var(--color-edge, #ccc);
  }

  .recognition-display h4 {
    margin: 0 0 8px 0;
    color: var(--color-foreground, #000);
    font-size: 0.9rem;
  }

  .recognition-display p {
    margin: 0;
    color: var(--color-muted-foreground, #666);
    font-style: italic;
  }

  /* Quick Commands */
  .quick-commands {
    margin-top: 16px;
  }

  .quick-commands h4 {
    margin: 0 0 12px 0;
    font-size: 0.9rem;
    color: var(--color-foreground, #000);
  }

  .command-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
  }

  .quick-command-btn {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-secondary-foreground, #000);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    text-align: left;
  }

  .quick-command-btn:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  /* File Upload */
  .upload-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .file-input {
    display: none;
  }

  .file-label {
    background: var(--color-secondary, #f5f5f5);
    border: 1px solid var(--color-edge, #ccc);
    color: var(--color-secondary-foreground, #000);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .file-label:hover {
    filter: brightness(1.05);
    border-color: var(--color-primary, #666);
  }

  .url-section,
  .record-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .url-input {
    min-width: 200px;
  }

  /* Results */
  .results-container {
    margin-top: 16px;
  }

  .results-display {
    background: var(--color-muted, #f5f5f5);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--color-edge, #ccc);
  }

  .recognition-results,
  .synthesis-results,
  .command-results,
  .analysis-results {
    margin-bottom: 16px;
  }

  .recognition-results h4,
  .synthesis-results h4,
  .command-results h4,
  .analysis-results h4 {
    margin: 0 0 12px 0;
    color: var(--color-foreground, #000);
    font-size: 1rem;
  }

  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid var(--color-edge, #ccc);
    font-size: 0.9rem;
  }

  .result-item:last-child {
    border-bottom: none;
  }

  .emotions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
    margin-top: 8px;
  }

  .emotion-item {
    background: var(--color-background, #fff);
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid var(--color-edge, #ccc);
    font-size: 0.8rem;
    text-align: center;
  }

  .error-message {
    background: var(--color-destructive-background, #fee);
    border: 1px solid var(--color-destructive, #dc2626);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .error-message p {
    margin: 0;
    color: var(--color-destructive, #dc2626);
    font-size: 0.9rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--color-edge, #ccc);
  }

  .clear-btn {
    background: var(--color-destructive-background, #fee);
    border: 1px solid var(--color-destructive, #dc2626);
    color: var(--color-destructive, #dc2626);
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
  }

  .clear-btn:hover {
    filter: brightness(1.05);
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--color-primary-alpha, rgba(255, 255, 255, 0.3));
    border-top: 2px solid var(--color-primary-foreground, #fff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @media (max-width: 768px) {
    .voice-ai-widget {
      padding: 16px;
    }

    .tabs-nav {
      flex-wrap: wrap;
      gap: 2px;
    }

    .tab-btn {
      flex: 1;
      min-width: 80px;
    }

    .recognition-controls,
    .synthesis-controls,
    .analysis-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .input-container {
      flex-direction: column;
    }

    .command-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
