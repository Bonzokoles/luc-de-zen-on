<script>
  import { writable } from "svelte/store";
  import AgentBuilder from "./AgentBuilder.svelte";

  let username = "";
  let password = "";
  let error = "";
  
  const state = writable({ 
    isLoggedIn: false, 
    isDemo: false 
  });

  function handleLogin() {
    // In a real app, this would be a call to a secure API endpoint.
    // For this demo, we use hardcoded credentials.
    if (username === "admin" && password === "password123") {
      state.update(s => ({ ...s, isLoggedIn: true }));
      error = "";
    } else {
      error = "Nieprawidłowa nazwa użytkownika lub hasło.";
    }
  }

  function handleDemo() {
    state.update(s => ({ ...s, isDemo: true }));
  }
</script>

{#if $state.isLoggedIn || $state.isDemo}
  <AgentBuilder demo={$state.isDemo} />
{:else}
  <div class="max-w-md mx-auto bg-gray-900/50 border border-edge rounded-2xl p-8 shadow-xl text-white">
    <h3 class="text-2xl font-bold text-center text-cyan-400 mb-6">Logowanie Administratora</h3>
    <form on:submit|preventDefault={handleLogin} class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-300 mb-2">Nazwa użytkownika</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="admin"
          class="w-full px-4 py-2 bg-gray-800 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Hasło</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="••••••••"
          class="w-full px-4 py-2 bg-gray-800 border border-edge rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {#if error}
        <p class="text-sm text-red-400">{error}</p>
      {/if}

      <div class="flex items-center justify-between gap-4 pt-4">
        <button 
          type="button" 
          on:click={handleDemo}
          class="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-all"
        >
          Zobacz Demo
        </button>
        <button 
          type="submit"
          class="w-full px-6 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-all"
        >
          Zaloguj się
        </button>
      </div>
    </form>
  </div>
{/if}
