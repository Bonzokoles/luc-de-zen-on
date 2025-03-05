<script lang="ts">
    import { twMerge } from 'tailwind-merge';
import { filters, toggleFilter } from '../../stores/filters.store.ts';

    interface Props {
        tags: string[];
    }

    const { tags }: Props = $props();
</script>

{#snippet tag(title: string)}
    <button onclick={() => toggleFilter(title)} class={twMerge(selectedClass, "inline-block w-fit h-fit px-2 py-1 bg-primary border rounded-interactive border-accent text-accent font-semibold hover:bg-accent hover:text-primary hover:cursor-pointer duration-200")}>
        {title}
    </button>
{/snippet}

<div class="flex flex-row flex-wrap justify-center gap-2 mt-4">
    {#each tags as title}
        {@render tag(title)}
    {/each}
</div>