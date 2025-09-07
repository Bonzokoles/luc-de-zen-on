<script>
  import { fade } from 'svelte/transition';
  export let key;
</script>

<div {key} transition:fade={{ duration: 300 }}>
  <slot />
</div>