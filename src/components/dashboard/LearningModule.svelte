
<script>
  import { onMount } from 'svelte';
  export let userId;

  let dialogues = [];
  let newDialogue = "";
  let status = 'idle'; // idle, loading, saving

  // --- Gamification Logic ---
  $: intelligenceLevel = dialogues.length;
  $: progressPercentage = Math.min((intelligenceLevel / 50) * 100, 100); // Example goal: 50 dialogues

  const allAchievements = [
      { name: 'Pierwszy Krok', threshold: 1, icon: 'M12 4.5v15m7.5-7.5h-15' }, // Plus icon
      { name: 'Młody Adept', threshold: 5, icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.178-2.178m2.178 2.178l2.178 2.178m15.482-2.178l2.178-2.178m-2.178 2.178l-2.178 2.178m0 0l-2.178 2.178m2.178-2.178l2.178-2.178' }, // Academic cap icon
      { name: 'Mistrz Konwersacji', threshold: 15, icon: 'M8.25 7.5l.415-.207a.75.75 0 011.085.707v5.362a.75.75 0 01-1.085.707l-.415-.207M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }, // Chat bubble icon
      { name: 'Cyfrowy Mentor', threshold: 30, icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.324h5.383c.494 0 .693.658.328.988l-4.355 3.18a.563.563 0 00-.182.623l1.634 4.83c.148.44-.372.824-.764.55l-4.355-3.18a.563.563 0 00-.652 0l-4.355 3.18c-.392.274-.912-.11-.764-.55l1.634-4.83a.563.563 0 00-.182-.623L2.39 9.92c-.365-.33-.166-.988.328-.988h5.383a.563.563 0 00.475-.324L11.48 3.5z' } // Star icon
  ];

  $: unlockedAchievements = allAchievements.filter(a => intelligenceLevel >= a.threshold);

  async function loadLearning() {
    if (!userId) return;
    status = 'loading';
    try {
        const res = await fetch(`/api/learning?userId=${userId}`);
        if (res.ok) {
            const data = await res.json();
            dialogues = data.dialogues || [];
        }
    } catch (e) { console.error("Failed to load learning data", e); } 
    finally { status = 'idle'; }
  }

  async function saveLearning() {
    if (!userId || !newDialogue.trim()) return;
    status = 'saving';
    try {
        await fetch(`/api/learning?userId=${userId}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dialogues: [newDialogue.trim()] })
        });
        newDialogue = "";
        await loadLearning();
    } catch (e) { console.error("Failed to save learning data", e); } 
    finally { status = 'idle'; }
  }

  onMount(() => { loadLearning(); });
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6 font-mono h-full flex flex-col">
  <h3 class="font-bold text-lg text-cyber-blue mb-4">ROZWÓJ INTELIGENCJI BIELIKA</h3>

  <div class="mb-4">
      <div class="flex justify-between items-center text-xs text-cyber-text-dim mb-1">
          <span>POZIOM ROZWOJU: {intelligenceLevel}</span>
          <span>CEL: 50</span>
      </div>
      <div class="w-full bg-cyber-dark border border-cyber-border/50 h-4 p-0.5">
          <div class="bg-cyber-blue h-full transition-all duration-500" style="width: {progressPercentage}%;"></div>
      </div>
  </div>

  <div class="mb-4">
      <h4 class="text-cyber-text-dim text-xs uppercase mb-2">Osiągnięcia</h4>
      <div class="flex gap-3">
          {#each allAchievements as achievement}
              <div class="text-center transition-all duration-300" class:opacity-40={intelligenceLevel < achievement.threshold} title="{achievement.name} (Próg: {achievement.threshold})">
                  <div class="w-10 h-10 border flex items-center justify-center" class:border-cyber-blue={intelligenceLevel >= achievement.threshold} class:border-cyber-border/50={intelligenceLevel < achievement.threshold}>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" class:text-cyber-blue={intelligenceLevel >= achievement.threshold} class:text-cyber-text-dim={intelligenceLevel < achievement.threshold}>
                           <path stroke-linecap="round" stroke-linejoin="round" d={achievement.icon} />
                       </svg>
                  </div>
              </div>
          {/each}
      </div>
  </div>

  <textarea 
    class="w-full bg-cyber-dark border border-cyber-border/50 text-cyber-text p-2 rounded-none focus:outline-none focus:border-cyber-blue resize-none mt-2"
    placeholder="Wprowadź wskazówkę lub poprawkę dla Bielika..."
    bind:value={newDialogue} 
    rows="2"
    disabled={status !== 'idle'}
  ></textarea>

  <button 
    class="w-full mt-2 bg-cyber-border text-cyber-text font-bold py-2 px-4 rounded-none hover:bg-cyber-blue hover:text-cyber-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
    on:click={saveLearning} 
    disabled={!newDialogue.trim() || status !== 'idle'}
  >
    {#if status === 'saving'}WSPIERANIE ROZWOJU...{:else}WSPIERAJ ROZWÓJ BIELIKA{/if}
  </button>

  <h4 class="text-cyber-text-dim mt-4 mb-2 text-xs uppercase">Historia Rozwoju</h4>
  <div class="flex-grow space-y-2 max-h-24 overflow-y-auto pr-2 text-sm">
    {#if status === 'loading'}
        <div class="text-cyber-blue animate-pulse">ANALIZA HISTORII...</div>
    {/if}
    {#each dialogues.slice().reverse() as d}
      <div class="border-b border-cyber-border/30 pb-1 text-cyber-text">{d}</div>
    {/each}
    {#if dialogues.length === 0 && status === 'idle'}
        <div class="text-cyber-text-dim">Brak wpisów w historii rozwoju.</div>
    {/if}
  </div>
</div>
