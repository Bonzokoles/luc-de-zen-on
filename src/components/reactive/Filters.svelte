<script lang="ts">
    import { filters, removeFilter } from '../../stores/filters.store.ts';
    import { slide, blur } from 'svelte/transition';
</script>

{#snippet filter(title: string)}
    <button onclick={() => removeFilter(title)} in:slide out:blur class="group hover:cursor-pointer hover:opacity-60 duration-200">
        <div class="px-2 w-fit bg-primary border rounded-interactive border-primary-foreground group-hover:-translate-y-1/4 group-hover:-rotate-2 duration-200">
            <span class="text-primary-foreground font-semibold">{ title }</span>
        </div>    
    </button>
{/snippet}

{#if $filters.length > 0}
    <div transition:slide class="flex gap-4 p-4 pb-0 opacity-75">
        <svg class="w-8 h-8 my-auto stroke-primary-border" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 10L2 10 M10 14H2 M6 18H2 M18 6L2 6 M19 10V20M19 20L22 17M19 20L16 17" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>

        {#each $filters as title}
            {@render filter(title)}
        {/each}
    </div>
{/if}