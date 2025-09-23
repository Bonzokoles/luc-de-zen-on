<script>
  import { onMount } from "svelte";

  let isVisible = false;
  let isExpanded = false;
  let isLoading = false;
  let activeModel = null;

  const models = [
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5",
      icon: "🧠",
      color: "#ff6b35",
      description: "Najlepszy do analizy i rozumowania",
    },
    {
      id: "google/gemini-pro-1.5",
      name: "Gemini Pro",
      icon: "⚡",
      color: "#4285f4",
      description: "Szybki i uniwersalny model",
    },
    {
      id: "openai/gpt-4o",
      name: "GPT-4o",
      icon: "🚀",
      color: "#00a67e",
      description: "Zaawansowany model OpenAI",
    },
    {
      id: "meta-llama/llama-3.1-405b-instruct",
      name: "Llama 3.1",
      icon: "🦙",
      color: "#8b5cf6",
      description: "Open-source flagship model",
    },
  ];

  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 1000);
  });

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  async function selectModel(model) {
    activeModel = model;
    isLoading = true;
    isExpanded = false;

    try {
      // Integrace z istniejącymi narzędziami AI
      const event = new CustomEvent("openRouterModelSelected", {
        detail: {
          model: model.id,
          name: model.name,
          description: model.description,
        },
      });
      window.dispatchEvent(event);

      // Automatycznie aktywuj główny chat widget z wybranym modelem
      const chatWidget = document.querySelector('[data-component="main-chat"]');
      if (chatWidget) {
        chatWidget.setAttribute("data-active-model", model.id);
        chatWidget.scrollIntoView({ behavior: "smooth" });
      }

      setTimeout(() => {
        isLoading = false;
      }, 1500);
    } catch (error) {
      console.error("Błąd podczas wyboru modelu:", error);
      isLoading = false;
    }
  }
</script>

<div class="floating-ai-buttons" class:visible={isVisible}>
  <!-- Main toggle button -->
  <div
    class="main-button"
    class:expanded={isExpanded}
    class:loading={isLoading}
    on:click={toggleExpanded}
  >
    {#if isLoading}
      <div class="loading-spinner"></div>
    {:else if activeModel}
      <span class="model-icon">{activeModel.icon}</span>
    {:else}
      <span class="ai-icon">🤖</span>
    {/if}
  </div>

  <!-- Model selection buttons -->
  {#if isExpanded}
    <div class="model-buttons">
      {#each models as model, index}
        <div
          class="model-button"
          style="--delay: {index * 0.1}s; --color: {model.color}"
          on:click={() => selectModel(model)}
        >
          <span class="model-icon">{model.icon}</span>
          <div class="model-tooltip">
            <div class="model-name">{model.name}</div>
            <div class="model-desc">{model.description}</div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Status indicator -->
  {#if activeModel}
    <div class="status-indicator" style="--model-color: {activeModel.color}">
      {activeModel.name}
    </div>
  {/if}
</div>

<style>
  .floating-ai-buttons {
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: 1000;
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .floating-ai-buttons.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .main-button {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #00d9ff 0%, #7b2cbf 50%, #ff006e 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow:
      0 10px 30px rgba(0, 217, 255, 0.3),
      0 0 0 0 rgba(0, 217, 255, 0.4);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .main-button:hover {
    transform: scale(1.1);
    box-shadow:
      0 15px 40px rgba(0, 217, 255, 0.4),
      0 0 0 10px rgba(0, 217, 255, 0.1);
  }

  .main-button.expanded {
    background: linear-gradient(135deg, #7b2cbf 0%, #ff006e 50%, #00d9ff 100%);
    transform: rotate(45deg);
  }

  .main-button.loading {
    animation: pulse 2s infinite;
  }

  .ai-icon,
  .model-icon {
    font-size: 30px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    transition: transform 0.3s ease;
  }

  .main-button.expanded .ai-icon,
  .main-button.expanded .model-icon {
    transform: rotate(-45deg);
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .model-buttons {
    position: absolute;
    bottom: 90px;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .model-button {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--color), rgba(0, 0, 0, 0.8));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateX(100px);
    animation: slideIn 0.4s ease forwards;
    animation-delay: var(--delay);
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.3),
      0 0 0 0 var(--color);
    transition: all 0.3s ease;
    position: relative;
  }

  .model-button:hover {
    transform: scale(1.1) translateX(0);
    box-shadow:
      0 12px 35px rgba(0, 0, 0, 0.4),
      0 0 0 8px rgba(255, 255, 255, 0.1);
  }

  .model-button .model-icon {
    font-size: 24px;
  }

  .model-tooltip {
    position: absolute;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 217, 255, 0.3);
    border-radius: 12px;
    padding: 12px 16px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    min-width: 200px;
  }

  .model-button:hover .model-tooltip {
    opacity: 1;
    transform: translateY(-50%) translateX(-10px);
  }

  .model-name {
    color: #00d9ff;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .model-desc {
    color: #ffffff;
    font-size: 12px;
    opacity: 0.8;
  }

  .status-indicator {
    position: absolute;
    bottom: -35px;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid var(--model-color);
    border-radius: 20px;
    padding: 6px 12px;
    color: var(--model-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    animation: fadeInUp 0.5s ease;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow:
        0 10px 30px rgba(0, 217, 255, 0.3),
        0 0 0 0 rgba(0, 217, 255, 0.4);
    }
    50% {
      box-shadow:
        0 15px 40px rgba(0, 217, 255, 0.5),
        0 0 0 15px rgba(0, 217, 255, 0.2);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .floating-ai-buttons {
      right: 20px;
      bottom: 20px;
    }

    .main-button {
      width: 60px;
      height: 60px;
    }

    .ai-icon,
    .model-icon {
      font-size: 24px;
    }

    .model-button {
      width: 50px;
      height: 50px;
    }

    .model-button .model-icon {
      font-size: 20px;
    }

    .model-tooltip {
      right: 70px;
      min-width: 180px;
    }
  }
</style>
