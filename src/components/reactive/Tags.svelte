<script lang="ts">
    import { filters, addFilter } from '../../stores/filters.store.ts';

    interface Props {
        tags: string[];
    }

    const { tags }: Props = $props();
</script>

{#snippet tag(title: string)}
    <button onclick={() => addFilter(title)} disabled={$filters.includes(title)} class="inline-block w-fit px-2 py-1 bg-primary border rounded-interactive border-accent text-accent font-semibold not-disabled:hover:bg-accent not-disabled:hover:text-primary not-disabled:hover:cursor-pointer disabled:opacity-60 duration-200">
        {title}
    </button>
{/snippet}

<div class="flex flex-row flex-wrap justify-center gap-2 mt-4">
    {#each tags as title}
        {@render tag(title)}
    {/each}
</div>