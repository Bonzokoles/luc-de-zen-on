<script>
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  export let demo = false;

  let agentName = writable("");
  let systemPrompt = writable("");
  let model = writable("@cf/meta/llama-3.1-8b-instruct");
  let status = writable({ type: "", message: "" });

  onMount(() => {
    if (demo) {
      status.set({
        type: "info",
        message: "Jesteś w trybie demo. Tworzenie agentów jest wyłączone.",
      });
    }
  });

  const models = [
    { id: "@cf/meta/llama-3.1-8b-instruct", name: "Llama 3.1 (Cloudflare)" },
    {
      id: "@hf/speakleash/bielik-7b-instruct-v0.1",
      name: "Bielik 7B (Hugging Face)",
    },
    { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo (OpenAI)" },
    { id: "anthropic/claude-3-opus", name: "Claude 3 Opus (Anthropic)" },
  ];

  async function createAgent() {
    if (demo) {
      status.set({
        type: "error",
        message: "Zapis jest wyłączony w trybie demo.",
      });
      return;
    }

    if (!$agentName || !$systemPrompt) {
      status.set({
        type: "error",
        message: "Nazwa agenta i prompt systemowy są wymagane.",
      });
      return;
    }

    status.set({ type: "loading", message: "Tworzenie agenta..." });

    try {
      const response = await fetch("/api/agents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: $agentName,
          prompt: $systemPrompt,
          model: $model,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        status.set({
          type: "success",
          message: `Agent "${$agentName}" został pomyślnie utworzony!`,
        });
        agentName.set("");
        systemPrompt.set("");
      } else {
        throw new Error(result.error || "Wystąpił nieznany błąd.");
      }
    } catch (error) {
      status.set({ type: "error", message: `Błąd: ${error.message}` });
    }
  }
</script>

<div
  class="w-full max-w-2xl mx-auto bg-primary/50 border border-edge rounded-2xl p-8 shadow-xl"
>
  <form on:submit|preventDefault={createAgent} class="space-y-6">
    <fieldset disabled={demo}>
      <div>
        <label
          for="agentName"
          class="block text-sm font-medium text-primary-foreground/80 mb-2"
          >Nazwa Agenta</label
        >
        <input
          type="text"
          id="agentName"
          bind:value={$agentName}
          placeholder="np. Asystent Marketingu"
          class="w-full px-4 py-2 bg-primary border border-edge rounded-lg text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label
          for="systemPrompt"
          class="block text-sm font-medium text-primary-foreground/80 mb-2"
          >Prompt Systemowy</label
        >
        <textarea
          id="systemPrompt"
          bind:value={$systemPrompt}
          rows="6"
          placeholder="Jesteś pomocnym asystentem, który specjalizuje się w..."
          class="w-full px-4 py-2 bg-primary border border-edge rounded-lg text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
        ></textarea>
      </div>

      <div>
        <label
          for="model"
          class="block text-sm font-medium text-primary-foreground/80 mb-2"
          >Model AI</label
        >
        <select
          id="model"
          bind:value={$model}
          class="w-full px-4 py-2 bg-primary border border-edge rounded-lg text-primary-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {#each models as m}
            <option value={m.id}>{m.name}</option>
          {/each}
        </select>
      </div>
    </fieldset>

    <div class="flex justify-end">
      <button
        type="submit"
        class="px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={$status.type === "loading" || demo}
      >
        {#if $status.type === "loading"}
          <span>Tworzenie...</span>
        {:else}
          <span>Stwórz Agenta</span>
        {/if}
      </button>
    </div>
  </form>

  {#if $status.message}
    <div
      class="mt-6 p-4 rounded-lg text-sm {$status.type === 'success'
        ? 'bg-green-500/20 text-green-300'
        : ''} {$status.type === 'error'
        ? 'bg-red-500/20 text-red-300'
        : ''} {$status.type === 'info' ? 'bg-blue-500/20 text-blue-300' : ''}"
    >
      {$status.message}
    </div>
  {/if}
</div>
