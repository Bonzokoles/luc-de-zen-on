<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale, slide } from "svelte/transition";
  import { elasticOut } from "svelte/easing";

  let showElements = false;
  let animationStep = 0;

  onMount(() => {
    // Sekwencyjne uruchamianie animacji
    setTimeout(() => (showElements = true), 300);

    // Animacja kroków
    const interval = setInterval(() => {
      animationStep = (animationStep + 1) % 4;
    }, 2000);

    return () => clearInterval(interval);
  });
</script>

<div class="animations-showcase">
  {#if showElements}
    <div class="showcase-container">
      <!-- Header z fade -->
      <h2 in:fade={{ duration: 800, delay: 100 }} class="showcase-title">
        🎨 Svelte Animations Showcase
      </h2>

      <!-- Grid z różnymi animacjami -->
      <div class="animations-grid">
        <!-- Fade Animation -->
        <div
          class="animation-card fade-demo"
          in:fade={{ duration: 600, delay: 200 }}
        >
          <h3>✨ Fade Transition</h3>
          <p>Płynne pojawienie się elementu</p>
          <div class="demo-element fade-element">
            {#if animationStep >= 0}
              <div in:fade={{ duration: 500 }} class="demo-box">FADE</div>
            {/if}
          </div>
        </div>

        <!-- Fly Animation -->
        <div
          class="animation-card fly-demo"
          in:fly={{ x: -100, duration: 600, delay: 400 }}
        >
          <h3>🚀 Fly Transition</h3>
          <p>Wlot z boku z efektem ruchu</p>
          <div class="demo-element">
            {#if animationStep >= 1}
              <div in:fly={{ y: 50, duration: 500 }} class="demo-box">FLY</div>
            {/if}
          </div>
        </div>

        <!-- Scale Animation -->
        <div
          class="animation-card scale-demo"
          in:scale={{ duration: 600, delay: 600, easing: elasticOut }}
        >
          <h3>📏 Scale Transition</h3>
          <p>Skalowanie z elastycznym efektem</p>
          <div class="demo-element">
            {#if animationStep >= 2}
              <div
                in:scale={{ duration: 500, easing: elasticOut }}
                class="demo-box"
              >
                SCALE
              </div>
            {/if}
          </div>
        </div>

        <!-- Slide Animation -->
        <div
          class="animation-card slide-demo"
          in:slide={{ duration: 600, delay: 800 }}
        >
          <h3>📜 Slide Transition</h3>
          <p>Wysuwanie się elementu</p>
          <div class="demo-element">
            {#if animationStep >= 3}
              <div in:slide={{ duration: 500 }} class="demo-box">SLIDE</div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Interactive Elements -->
      <div
        class="interactive-section"
        in:fly={{ y: 100, duration: 800, delay: 1000 }}
      >
        <h3>🎮 Animacje Interaktywne</h3>

        <div class="interactive-buttons">
          <button
            class="anim-btn"
            on:click={() => (animationStep = (animationStep + 1) % 4)}
          >
            🔄 Następna Animacja
          </button>

          <button
            class="anim-btn"
            on:click={() => (showElements = !showElements)}
          >
            {showElements ? "👁️ Ukryj" : "👁️ Pokaż"} Animacje
          </button>
        </div>

        <!-- Floating Elements -->
        <div class="floating-elements">
          {#each Array(6) as _, i}
            <div
              class="floating-dot"
              style="--delay: {i * 0.3}s; --x: {i * 15}%"
              in:scale={{ duration: 400, delay: 1200 + i * 100 }}
            ></div>
          {/each}
        </div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar" in:fade={{ duration: 600, delay: 1400 }}>
        <span class="status-indicator active"></span>
        <span>Animacje Svelte: Aktywne</span>
        <span class="step-counter">Krok: {animationStep + 1}/4</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .animations-showcase {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    overflow-x: hidden;
  }

  .showcase-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .showcase-title {
    text-align: center;
    color: white;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .animations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .animation-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    text-align: center;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .animation-card h3 {
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .animation-card p {
    color: #4a5568;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .demo-element {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .demo-box {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.8rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .fade-demo .demo-box {
    background: linear-gradient(45deg, #ff6b6b, #feca57);
  }

  .fly-demo .demo-box {
    background: linear-gradient(45deg, #48cae4, #023e8a);
  }

  .scale-demo .demo-box {
    background: linear-gradient(45deg, #7209b7, #a663cc);
  }

  .slide-demo .demo-box {
    background: linear-gradient(45deg, #f77f00, #fcbf49);
  }

  .interactive-section {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .interactive-section h3 {
    color: #2d3748;
    margin-bottom: 1.5rem;
  }

  .interactive-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .anim-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .anim-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .anim-btn:active {
    transform: translateY(0);
  }

  .floating-elements {
    position: relative;
    height: 100px;
    overflow: hidden;
  }

  .floating-dot {
    position: absolute;
    width: 20px;
    height: 20px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    border-radius: 50%;
    animation: float 3s ease-in-out infinite;
    animation-delay: var(--delay);
    left: var(--x);
    top: 40px;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
      opacity: 1;
    }
  }

  .status-bar {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
  }

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  .status-indicator.active {
    background: #48bb78;
    animation: pulse 2s infinite;
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

  .step-counter {
    font-weight: 600;
    color: #4ecdc4;
  }

  @media (max-width: 768px) {
    .animations-showcase {
      padding: 1rem;
    }

    .showcase-title {
      font-size: 2rem;
    }

    .animations-grid {
      grid-template-columns: 1fr;
    }

    .interactive-buttons {
      flex-direction: column;
      align-items: center;
    }

    .status-bar {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }
</style>
