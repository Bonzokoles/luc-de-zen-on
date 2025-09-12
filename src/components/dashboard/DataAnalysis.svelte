<script>
  let dataInput = `[
  {"product": "X", "sold": 120, "revenue": 1500.50},
  {"product": "Y", "sold": 95, "revenue": 1100.00}
]`;
  let analysis = null;
  let status = 'idle';

  async function analyze() {
    status = 'loading';
    try {
        const res = await fetch("/api/data-analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: dataInput,
        });
        analysis = await res.json();
    } catch (e) {
        analysis = { error: 'Invalid JSON format' };
    } finally {
        status = 'idle';
    }
  }
</script>

<div class="bg-cyber-surface border border-cyber-border rounded-none p-6 font-mono h-full flex flex-col">
    <h3 class="font-bold text-lg text-cyber-blue mb-4">ANALIZA DANYCH</h3>
    <textarea 
        rows="8"
        placeholder="Wprowadź dane w formacie JSON..."
        bind:value={dataInput}
        class="w-full bg-cyber-dark border border-cyber-border/50 text-cyber-text p-2 rounded-none focus:outline-none focus:border-cyber-blue resize-none text-xs"
    ></textarea>
    <button 
        class="w-full mt-2 bg-cyber-border text-cyber-text font-bold py-2 px-4 rounded-none hover:bg-cyber-blue hover:text-cyber-dark transition-colors disabled:opacity-50"
        on:click={analyze} disabled={status === 'loading'}>ANALIZUJ</button>
    
    {#if analysis}
        <div class="mt-4 text-xs flex-grow overflow-y-auto pr-2">
            <h4 class="text-cyber-text-dim mb-2">Wynik analizy:</h4>
            <pre class="bg-cyber-dark p-2 border border-cyber-border/50 text-cyber-blue whitespace-pre-wrap">{JSON.stringify(analysis, null, 2)}</pre>
        </div>
    {/if}
</div>
