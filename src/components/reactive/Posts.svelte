<script lang="ts">
    import { type CollectionEntry } from 'astro:content';
    import { filters } from '../../stores/filters.store';
    import Filters from './Filters.svelte';

    interface Props {
        allPosts: CollectionEntry<'posts'>[];
    }

    const { allPosts }: Props = $props();
    let sortedPosts: CollectionEntry<'posts'>[] = $state(allPosts);

    function getIntersectionLength(a: any[], b: any[]): number {
        const intersection = a.filter(value => b.includes(value));
        return intersection.length;
    }

    function sortPosts(filters: string[]) {
        if(!filters || filters.length == 0){
            sortedPosts = allPosts.sort((a: any, b: any) => b.data.date.valueOf() - a.data.date.valueOf());
            return;
        }
        
        sortedPosts = allPosts.sort((a: any, b: any) => getIntersectionLength(b.data.tags, filters) - getIntersectionLength(a.data.tags, filters));
    }

    filters.subscribe((value) => {
        sortPosts([...value]);
    })
</script>

{#snippet postCard(post: CollectionEntry<'posts'>)}
    <a href={`/posts/${post.id}`} class="flex flex-col justify-between gap-2 min-h-32 h-full p-2 border rounded-interactive border-primary-border bg-primary pointer-events-auto hover:border-accent hover:bg-accent/25 duration-200">
        <div>
            <h3 class="text-sm text-primary-foreground/75">
                <time datetime={post.data.date.toISOString()}>
                    {post.data.date.toLocaleDateString('en-us', {year: 'numeric', month: 'short', day: 'numeric'})}
                </time>
            </h3>
            <h2 class="text-lg font-semibold">{post.data.title}</h2>
            <p>{post.data.description}</p>
        </div>
        <div class="flex flex-row gap-2 text-accent">
            {#each post.data.tags as tag}
                <span>{tag}</span>
            {/each}
        </div>
    </a>
{/snippet}

<Filters />

<div class="group grid grid-cols-3 gap-2 p-4 rounded-interactive pointer-events-none hover:border-primary-border duration-200">					
    {#each sortedPosts as post}
        {@render postCard(post)}
    {/each}
</div>