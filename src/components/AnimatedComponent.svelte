<script>
<<<<<<< HEAD
  import { fly, fade } from 'svelte/transition';
</script>

<div in:fly={{ y: 20, duration: 300 }} in:fade={{ duration: 300 }}>
  <slot />
</div>
=======
  import { fly, fade } from "svelte/transition";
</script>

<div in:fly={{ y: 20, duration: 300 }}>
  <slot />
</div>
>>>>>>> c1c4ac5534f2943dcdcdd273d347cf64339cc1a7
