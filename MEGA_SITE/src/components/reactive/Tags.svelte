<script lang="ts">
  let tags: string[] = ['AI', 'Voice Assistant', 'POLACZEK', 'Stable Diffusion', 'Admin Dashboard', 'Chat Bot'];
  let newTag: string = '';
  let selectedTags: Set<string> = new Set();

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      tags = [...tags, newTag.trim()];
      newTag = '';
    }
  }

  function removeTag(tagToRemove: string) {
    tags = tags.filter(tag => tag !== tagToRemove);
    selectedTags.delete(tagToRemove);
    selectedTags = selectedTags;
  }

  function toggleTag(tag: string) {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
    } else {
      selectedTags.add(tag);
    }
    selectedTags = selectedTags;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addTag();
    }
  }
</script>

<div class="tags-demo bg-gray-800/50 rounded-lg p-6">
  <h4 class="text-lg font-bold text-cyan-400 mb-4">System tagów AI</h4>
  
  <!-- Add new tag -->
  <div class="flex gap-2 mb-4">
    <input
      type="text"
      bind:value={newTag}
      on:keypress={handleKeyPress}
      placeholder="Dodaj nowy tag..."
      class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
    />
    <button
      on:click={addTag}
      class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors duration-200 font-medium"
    >
      Dodaj
    </button>
  </div>

  <!-- Tags display -->
  <div class="flex flex-wrap gap-2 mb-4">
    {#each tags as tag}
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200
               {selectedTags.has(tag) 
                 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        on:click={() => toggleTag(tag)}
      >
        <span>{tag}</span>
        <button
          on:click|stopPropagation={() => removeTag(tag)}
          class="ml-1 text-red-400 hover:text-red-300 font-bold"
          title="Usuń tag"
        >
          ×
        </button>
      </div>
    {/each}
  </div>

  <!-- Selected tags info -->
  {#if selectedTags.size > 0}
    <div class="text-sm text-cyan-400">
      Wybrane tagi ({selectedTags.size}): {Array.from(selectedTags).join(', ')}
    </div>
  {:else}
    <div class="text-sm text-gray-500">
      Kliknij na tagi aby je zaznaczyć
    </div>
  {/if}
</div>

<style>
  .tags-demo {
    min-height: 200px;
    border: 1px solid rgba(34, 211, 238, 0.3);
  }
</style>
