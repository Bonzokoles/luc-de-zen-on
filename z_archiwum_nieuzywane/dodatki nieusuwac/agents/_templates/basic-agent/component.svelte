<script>
  import { onMount } from "svelte";
  import { AGENT_CONFIG } from "./config.ts";

  // Component props
  export let variant = "full"; // 'full' | 'compact' | 'floating'
  export let disabled = false;

  // State
  let status = "idle";
  let result = "";
  let error = "";
  let isLoading = false;

  // Test the agent
  async function testAgent() {
    if (disabled) return;

    isLoading = true;
    error = "";
    result = "";

    try {
      const response = await fetch(AGENT_CONFIG.api.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });

      const data = await response.json();

      if (response.ok) {
        result = data.message;
        status = "success";
      } else {
        error = data.error || "Test failed";
        status = "error";
      }
    } catch (err) {
      error = "Connection error: " + err.message;
      status = "error";
    } finally {
      isLoading = false;
    }
  }

  // Execute agent with data
  async function executeAgent(inputData = "") {
    if (disabled) return;

    isLoading = true;
    error = "";
    result = "";

    try {
      const response = await fetch(AGENT_CONFIG.api.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "execute",
          data: { input: inputData },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        result = data.result || data.message;
        status = "success";
      } else {
        error = data.error || "Execution failed";
        status = "error";
      }
    } catch (err) {
      error = "Execution error: " + err.message;
      status = "error";
    } finally {
      isLoading = false;
    }
  }

  // Get agent status
  async function getAgentStatus() {
    try {
      const response = await fetch(AGENT_CONFIG.api.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status" }),
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Status check failed:", err);
      return null;
    }
  }

  onMount(() => {
    // Initialize component
    status = AGENT_CONFIG.status === "active" ? "ready" : "inactive";
  });
</script>

<!-- Full variant - Complete interface -->
{#if variant === "full"}
  <div class="agent-container" class:disabled>
    <div class="agent-header">
      <div class="agent-icon" style="color: {AGENT_CONFIG.ui.color}">
        {AGENT_CONFIG.ui.icon}
      </div>
      <div class="agent-info">
        <h3 class="agent-name">{AGENT_CONFIG.name}</h3>
        <p class="agent-description">{AGENT_CONFIG.description}</p>
        <span class="agent-status status-{status}">{status}</span>
      </div>
    </div>

    <div class="agent-content">
      <div class="agent-controls">
        <button
          class="btn-primary"
          on:click={testAgent}
          disabled={isLoading || disabled}
        >
          {isLoading ? "Testing..." : "Test Agent"}
        </button>

        <button
          class="btn-secondary"
          on:click={() => executeAgent("Hello World")}
          disabled={isLoading || disabled}
        >
          {isLoading ? "Executing..." : "Execute"}
        </button>
      </div>

      {#if result}
        <div class="result success">
          <strong>Result:</strong>
          {result}
        </div>
      {/if}

      {#if error}
        <div class="result error">
          <strong>Error:</strong>
          {error}
        </div>
      {/if}
    </div>
  </div>

  <!-- Compact variant - Minimal interface -->
{:else if variant === "compact"}
  <div class="agent-compact" class:disabled>
    <span class="agent-icon" style="color: {AGENT_CONFIG.ui.color}">
      {AGENT_CONFIG.ui.icon}
    </span>
    <span class="agent-name">{AGENT_CONFIG.name}</span>
    <button
      class="btn-test"
      on:click={testAgent}
      disabled={isLoading || disabled}
    >
      {isLoading ? "⏳" : "▶️"}
    </button>
    <span class="status-indicator status-{status}"></span>
  </div>

  <!-- Floating variant - Just button -->
{:else if variant === "floating"}
  <button
    class="floating-agent-btn"
    style="border-color: {AGENT_CONFIG.ui.color}; color: {AGENT_CONFIG.ui
      .color}"
    on:click={testAgent}
    disabled={isLoading || disabled}
    title="{AGENT_CONFIG.name} - {AGENT_CONFIG.description}"
  >
    <span class="floating-icon">{AGENT_CONFIG.ui.icon}</span>
    <span class="floating-name">{AGENT_CONFIG.name}</span>
    <div class="status-dot status-{status}"></div>
  </button>
{/if}

<style>
  /* Full variant styles */
  .agent-container {
    background: rgba(17, 24, 39, 0.9);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .agent-container:hover {
    border-color: rgba(0, 217, 255, 0.6);
    transform: translateY(-2px);
  }

  .agent-container.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .agent-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .agent-icon {
    font-size: 2.5rem;
  }

  .agent-info h3 {
    color: white;
    margin: 0 0 8px 0;
    font-size: 1.2rem;
  }

  .agent-info p {
    color: #9ca3af;
    margin: 0 0 8px 0;
    font-size: 0.9rem;
  }

  .agent-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status-ready {
    background: #22c55e;
    color: white;
  }
  .status-success {
    background: #22c55e;
    color: white;
  }
  .status-error {
    background: #ef4444;
    color: white;
  }
  .status-inactive {
    background: #6b7280;
    color: white;
  }
  .status-idle {
    background: #3b82f6;
    color: white;
  }

  .agent-controls {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #0284c7, #0369a1);
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: rgba(75, 85, 99, 0.6);
    color: #d1d5db;
    border: 1px solid rgba(75, 85, 99, 0.8);
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(75, 85, 99, 0.8);
  }

  .result {
    padding: 12px;
    border-radius: 8px;
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
  }

  .result.success {
    background: rgba(34, 197, 94, 0.2);
    border: 1px solid rgba(34, 197, 94, 0.4);
    color: #22c55e;
  }

  .result.error {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #ef4444;
  }

  /* Compact variant styles */
  .agent-compact {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(17, 24, 39, 0.8);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .agent-compact:hover {
    border-color: rgba(0, 217, 255, 0.6);
  }

  .btn-test {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 4px;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  /* Floating variant styles */
  .floating-agent-btn {
    position: relative;
    width: 65px;
    height: 65px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid;
    cursor: pointer;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .floating-agent-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 217, 255, 0.3);
  }

  .floating-icon {
    font-size: 1.5rem;
    margin-bottom: 4px;
  }

  .floating-name {
    font-size: 0.7rem;
    font-weight: 600;
    text-align: center;
    line-height: 1;
  }

  .status-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
</style>
