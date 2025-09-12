
<script>
  export let userId;
  import { onMount } from "svelte";

  let events = [];
  let newEventText = "";

  async function loadCalendar() {
    const res = await fetch(`/api/calendar?userId=${userId}`);
    const data = await res.json();
    events = data.events || [];
  }

  async function addEvent() {
    if (!newEventText.trim()) return;
    const newEvent = { text: newEventText, date: new Date().toISOString() };
    const updatedEvents = [...events, newEvent];
    await fetch(`/api/calendar?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: updatedEvents }),
    });
    events = updatedEvents;
    newEventText = "";
  }

  onMount(loadCalendar);
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6 font-mono h-full flex flex-col">
    <h3 class="font-bold text-lg text-cyber-blue mb-4">ORGANIZER ZADAŃ</h3>
    <div class="flex-grow space-y-2 max-h-48 overflow-y-auto pr-2 text-sm mb-4">
        {#each events as event}
            <div class="border-b border-cyber-border/30 pb-1 text-cyber-text">
                <span class="text-cyber-text-dim">{new Date(event.date).toLocaleTimeString()}:</span> {event.text}
            </div>
        {/each}
        {#if events.length === 0}
            <p class="text-cyber-text-dim">Brak zadań.</p>
        {/if}
    </div>
    <div class="flex gap-2 mt-auto">
        <input 
            class="w-full bg-cyber-dark border border-cyber-border/50 text-cyber-text p-2 rounded-none focus:outline-none focus:border-cyber-blue"
            bind:value={newEventText} 
            placeholder="Nowe zadanie lub wydarzenie..." 
            on:keydown={(e) => e.key === 'Enter' && addEvent()}
        />
        <button 
            class="bg-cyber-border text-cyber-text font-bold py-2 px-4 rounded-none hover:bg-cyber-blue hover:text-cyber-dark transition-colors"
            on:click={addEvent}>DODAJ</button>
    </div>
</div>
