<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { startAppRuntime, stopAppRuntime } from '../lib/bootstrap/index.js';

  onMount(() => {
    startAppRuntime();

    return () => {
      stopAppRuntime();
    };
  });
</script>

<slot />
