<script lang="ts">
  let prompt = "";
  let response = "";
  let isLoading = false;

  async function sendToMyBonzo() {
    if (!prompt.trim() || isLoading) return;

    isLoading = true;
    try {
      const res = await fetch("/api/mybonzo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          language: "pl",
        }),
      });

      const data = await res.json();
      response = data.response || "Błąd odpowiedzi";
    } catch (error) {
      response = "Błąd połączenia z MyBonzo API";
      console.error(error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div
  class="mybonzo-chat-widget p-6 bg-gray-900 rounded-lg border border-gray-700"
>
  <div class="mb-4">
    <h3 class="text-xl font-bold text-white mb-2">🤖 MyBonzo AI Assistant</h3>
    <p class="text-gray-400 text-sm">
      Polski asystent AI specjalizujący się w Cloudflare Workers i technologiach
      chmurowych
    </p>
  </div>

  <div class="space-y-4">
    <div>
      <textarea
        bind:value={prompt}
        placeholder="Zapytaj MyBonzo o Cloudflare Workers, deployment, AI, lub inne technologie..."
        class="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none"
        rows="3"
      ></textarea>
    </div>

    <button
      on:click={sendToMyBonzo}
      disabled={isLoading || !prompt.trim()}
      class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
    >
      {isLoading ? "MyBonzo myśli..." : "Zapytaj MyBonzo"}
    </button>

    {#if response}
      <div class="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-md">
        <div class="text-green-400 font-medium mb-2">MyBonzo odpowiada:</div>
        <div class="text-white whitespace-pre-wrap">{response}</div>
      </div>
    {/if}
  </div>
</div>

<style>
  .mybonzo-chat-widget {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
