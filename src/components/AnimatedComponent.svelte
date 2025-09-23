<script>
  import { fly, fade } from 'svelte/transition';
</script>

<div in:fly={{ y: 20, duration: 300 }} in:fade={{ duration: 300 }}>
  <slot />
</div>