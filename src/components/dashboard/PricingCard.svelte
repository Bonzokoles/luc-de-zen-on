
<script>
  export let tier = "PRO";
  export let features = [];
  export let price = "19 PLN / mies.";
  export let isFeatured = false;
</script>

<div class={`border rounded-none p-6 flex flex-col h-full ${isFeatured ? 'border-cyber-blue shadow-glow-blue' : 'border-cyber-border bg-cyber-surface'}`}>
  <h3 class="uppercase tracking-widest text-xl mb-2 font-bold text-cyber-blue">{tier}</h3>
  <div class="text-4xl font-bold mb-4 text-white">{price}</div>
  <ul class="mb-6 space-y-2 text-cyber-text-dim flex-grow">
    {#each features as feature}
      <li class="flex items-start">
        <svg class="w-4 h-4 mr-2 mt-1 text-cyber-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <span>{feature}</span>
      </li>
    {/each}
  </ul>
  <button class={`w-full uppercase tracking-widest p-3 rounded-none font-bold transition-all duration-300 ${isFeatured ? 'bg-cyber-blue text-cyber-dark hover:shadow-glow-blue-strong' : 'bg-cyber-border text-cyber-text hover:bg-cyber-blue hover:text-cyber-dark'}`}>
      Wybierz Plan
  </button>
</div>
