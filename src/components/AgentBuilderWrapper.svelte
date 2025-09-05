<script>
  import { writable } from "svelte/store";
  import AgentBuilder from "./AgentBuilder.svelte";
  import { onMount } from "svelte";

  let error = "";
  let isLoading = true;

  const state = writable({
    isLoggedIn: false,
    isDemo: false,
    userType: null,
  });

  onMount(() => {
    // Sprawdź czy użytkownik jest zalogowany do systemu agentów
    const agentsAuthData = sessionStorage.getItem("mybonzo_agents_auth");
    if (agentsAuthData) {
      try {
        const parsed = JSON.parse(agentsAuthData);
        if (parsed.authenticated && parsed.system === "agents-system") {
          console.log(`AgentBuilder: Użytkownik systemu agentów zalogowany`);
          state.update((s) => ({
            ...s,
            isLoggedIn: true,
            userType: parsed.userType || "agents-user",
            isDemo: false, // System agentów nie jest demo
          }));
          isLoading = false; // Zakończ ładowanie
        } else {
          console.log("AgentBuilder: Sesja systemu agentów nieważna");
          isLoading = false; // Zakończ ładowanie, pokaż formularz logowania
        }
      } catch (e) {
        console.error("Błąd parsowania danych uwierzytelniania agentów:", e);
        isLoading = false; // Zakończ ładowanie, pokaż formularz logowania
      }
    } else {
      console.log("AgentBuilder: Brak uwierzytelniania systemu agentów");
      isLoading = false; // Zakończ ładowanie, pokaż formularz logowania
    }
  });

  // Funkcja wylogowania z systemu agentów
  function handleLogout() {
    sessionStorage.removeItem("mybonzo_agents_auth");
    console.log("🔐 Wylogowano z systemu agentów");
    state.update((s) => ({ ...s, isLoggedIn: false, userType: null }));
    window.location.reload();
  }

  // Funkcja do pokazania formularza logowania agentów
  function showAgentsLogin() {
    const placeholder = document.querySelector(".agents-login-placeholder");
    if (placeholder) {
      // Dynamicznie załaduj formularz logowania
      placeholder.innerHTML = `
        <div class="agents-inline-login">
          <h3>🔐 Kod dostępu do systemu agentów</h3>
          <form onsubmit="handleInlineAgentsLogin(event)" class="inline-form">
            <input 
              type="password" 
              id="inline-agents-password" 
              placeholder="Wprowadź kod BONZO23" 
              required
              class="inline-input"
            >
            <div id="inline-error" class="inline-error hidden"></div>
            <button type="submit" class="inline-submit-btn">Uwierzytelnij</button>
          </form>
        </div>
      `;

      // Focus na input
      setTimeout(() => {
        document.getElementById("inline-agents-password")?.focus();
      }, 100);
    }
  }

  // Handler dla inline logowania
  function handleInlineAgentsLogin(event) {
    event.preventDefault();

    const password = document.getElementById("inline-agents-password")?.value;
    const errorDiv = document.getElementById("inline-error");

    if (password === "BONZO23") {
      const agentsAuthData = {
        authenticated: true,
        userType: "agents-user",
        system: "agents-system",
        loginTime: new Date().toISOString(),
        accessLevel: "full",
      };

      sessionStorage.setItem(
        "mybonzo_agents_auth",
        JSON.stringify(agentsAuthData)
      );
      console.log("🤖 Inline: Dostęp do systemu agentów uzyskany");

      // Przeładuj stronę aby zaktualizować stan
      window.location.reload();
    } else {
      if (errorDiv) {
        errorDiv.textContent = "❌ Nieprawidłowy kod dostępu!";
        errorDiv.classList.remove("hidden");
      }
      const passwordInput = document.getElementById("inline-agents-password");
      if (passwordInput) passwordInput.value = "";
    }
  }

  // Dodaj style dla inline formularza w onMount
  onMount(() => {
    const inlineStyles = `
      .agents-inline-login h3 {
        color: #00d9ff;
        margin-bottom: 25px;
      }
      .inline-form {
        max-width: 300px;
        margin: 0 auto;
      }
      .inline-input {
        width: 100%;
        padding: 12px;
        background: rgba(30, 30, 30, 0.8);
        border: 2px solid rgba(0, 217, 255, 0.3);
        border-radius: 6px;
        color: #fff;
        font-family: monospace;
        letter-spacing: 2px;
        text-align: center;
        margin-bottom: 15px;
      }
      .inline-input:focus {
        outline: none;
        border-color: rgba(0, 217, 255, 0.6);
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
      }
      .inline-submit-btn {
        width: 100%;
        background: linear-gradient(135deg, #00d9ff, #0099cc);
        border: none;
        border-radius: 6px;
        color: #000;
        padding: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .inline-submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 217, 255, 0.3);
      }
      .inline-error {
        color: #ff6666;
        background: rgba(255, 0, 0, 0.1);
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 15px;
        font-size: 14px;
      }
      .hidden { display: none !important; }
    `;

    // Dodaj style do head
    if (typeof document !== "undefined") {
      const styleSheet = document.createElement("style");
      styleSheet.textContent = inlineStyles;
      document.head.appendChild(styleSheet);
    }

    // Dodaj funkcje do globalnego scope dla HTML onclick
    if (typeof window !== "undefined") {
      window.showAgentsLogin = showAgentsLogin;
      window.handleInlineAgentsLogin = handleInlineAgentsLogin;
    }
  });
</script>

{#if isLoading}
  <!-- Loading state - sprawdzanie uwierzytelnienia systemu agentów -->
  <div class="text-center text-cyan-400 py-8">
    <div
      class="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
    ></div>
    <p>Sprawdzanie dostępu do systemu agentów...</p>
  </div>
{:else if $state.isLoggedIn}
  <!-- Wyświetl informacje o zalogowanym użytkowniku systemu agentów -->
  <div class="mb-4 flex justify-between items-center">
    <div class="text-sm text-cyan-400">
      <strong>🤖 SYSTEM AGENTÓW AKTYWNY</strong>
      <span class="ml-2 px-2 py-1 text-xs bg-cyan-600 text-white rounded">
        BONZO AGENTS
      </span>
    </div>
    <button
      on:click={handleLogout}
      class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
    >
      Wyloguj z systemu agentów
    </button>
  </div>

  <!-- Główny komponent AgentBuilder -->
  <AgentBuilder demo={$state.isDemo} />
{:else}
  <!-- Import komponentu logowania agentów -->
  <div id="agents-login-wrapper">
    <!-- Komponent logowania zostanie załadowany tutaj -->
    <div class="agents-login-placeholder">
      <div class="placeholder-content">
        <h3>🔐 Dostęp do systemu agentów</h3>
        <p>Wymagane uwierzytelnienie</p>
        <div class="login-prompt">
          <button on:click={showAgentsLogin} class="access-btn">
            Wprowadź kod dostępu
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .agents-login-placeholder {
    text-align: center;
    padding: 60px 20px;
    background: rgba(15, 15, 15, 0.9);
    border: 2px solid rgba(0, 217, 255, 0.3);
    border-radius: 12px;
    margin: 20px 0;
  }

  .placeholder-content h3 {
    color: #00d9ff;
    margin-bottom: 15px;
    font-size: 20px;
  }

  .placeholder-content p {
    color: #b0b0b0;
    margin-bottom: 30px;
  }

  .access-btn {
    background: linear-gradient(135deg, #00d9ff, #0099cc);
    border: none;
    border-radius: 8px;
    color: #000;
    padding: 15px 30px;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .access-btn:hover {
    background: linear-gradient(135deg, #00ccff, #0088bb);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 217, 255, 0.3);
  }
</style>
