<script>
  import { onMount } from "svelte";

  export let agent;

  let messages = [];
  let userInput = "";
  let isLoading = false;

  onMount(() => {
    messages = [
      {
        from: "assistant",
        text: agent.prompt || "Witaj! Jestem gotowy do rozmowy.",
      },
    ];
  });

  async function sendMessage() {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage = { from: "user", text: userInput };
    messages = [...messages, newUserMessage];
    const currentInput = userInput;
    userInput = "";
    isLoading = true;

    try {
      const response = await fetch("/api/generic-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: currentInput,
          system_prompt: agent.prompt,
          model: agent.model,
        }),
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = { from: "assistant", text: data.answer };
      messages = [...messages, assistantMessage];

    } catch (error) {
      const errorMessage = { from: "assistant", text: `Przepraszam, wystąpił błąd: ${error.message}` };
      messages = [...messages, errorMessage];
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="chat-container border border-edge rounded-lg overflow-hidden mt-8" style="background: rgba(0, 0, 0, 0.5);">
  <!-- Chat Header -->
  <div class="chat-header border-b border-edge p-4 flex items-center justify-between" style="background: rgba(0, 0, 0, 0.3);">
    <div class="flex items-center gap-3">
      <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <span class="text-primary-foreground font-semibold">{agent.name}</span>
    </div>
  </div>

  <!-- Chat Messages -->
  <div class="chat-messages h-96 overflow-y-auto p-4 space-y-4">
    {#each messages as msg}
      <div class="message {msg.from}-message">
        <div class="message-content {msg.from === 'user' ? 'bg-blue-600/20 border-blue-400/30' : 'bg-cyan-600/20 border-cyan-400/30'} rounded-lg p-3">
            <div class="message-text text-primary-foreground whitespace-pre-wrap">{msg.text}</div>
        </div>
      </div>
    {/each}
    {#if isLoading}
        <div class="message assistant-message">
            <div class="message-content bg-cyan-600/20 border-cyan-400/30 rounded-lg p-3">
                <div class="message-text text-primary-foreground">AI pisze odpowiedź...</div>
            </div>
        </div>
    {/if}
  </div>

  <!-- Chat Input -->
  <div class="chat-input border-t border-edge p-4">
    <div class="flex gap-3">
      <textarea
        bind:value={userInput}
        rows="2"
        placeholder="Napisz swoją wiadomość..."
        class="flex-1 p-3 border border-edge rounded-lg text-primary-foreground placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
        style="background: rgba(0, 0, 0, 0.5);"
        on:keydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
        disabled={isLoading}
      ></textarea>
      <button
        on:click={sendMessage}
        class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
        disabled={isLoading}
      >
        Wyślij
      </button>
    </div>
  </div>
</div>

<style>
  .message {
    display: flex;
  }
  .user-message {
    justify-content: flex-end;
  }
  .assistant-message {
    justify-content: flex-start;
  }
  .message-content {
      max-width: 80%;
  }
</style>
