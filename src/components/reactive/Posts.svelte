<script lang="ts">
    import { type CollectionEntry } from 'astro:content';
    import { filters } from '../../stores/filters.store';
    import Filters from './Filters.svelte';

    interface Props {
        allPosts: CollectionEntry<'posts'>[];
    }

    const { allPosts }: Props = $props();
    let sortedPosts: CollectionEntry<'posts'>[] = $state(allPosts);

    function scorePostOnFilters(post: CollectionEntry<'posts'>): number {
        const intersection = post.data.tags.filter(value => filters.get().includes(value));
        return intersection.length;
    }

    function sortPosts() {
        if($filters.length < 1){
            sortedPosts = allPosts.sort((a: any, b: any) => b.data.date.valueOf() - a.data.date.valueOf());
            return;
        }
        
        sortedPosts = allPosts.sort((a: any, b: any) => scorePostOnFilters(b) - scorePostOnFilters(a));
    }

    filters.subscribe(() => {
        sortPosts();
    })
</script>

{#snippet postCard(post: CollectionEntry<'posts'>)}
    <a href={`/posts/${post.id}`} class="min-h-32 h-full p-4 border rounded-interactive border-primary-border bg-primary pointer-events-auto hover:border-accent hover:bg-accent/25 duration-200">
        <h3 class="text-primary-foreground/75">
            <time datetime={post.data.date.toISOString()}>
                {post.data.date.toLocaleDateString('en-us', {year: 'numeric', month: 'short', day: 'numeric'})}
            </time>
        </h3>
        <h2 class="text-lg font-semibold">{post.data.title}</h2>
        <p>{post.data.description}</p>
    </a>
{/snippet}

<Filters />

<div class="group grid grid-cols-3 gap-2 p-2 rounded-interactive pointer-events-none hover:border-primary-border duration-200">					
    {#each sortedPosts as post}
        {@render postCard(post)}
    {/each}
</div>