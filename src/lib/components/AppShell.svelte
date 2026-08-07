<script>
  import { appKernel } from '../stores/appKernelStore.js';
  import { projectStore } from '../stores/projectStore.js';
  import { viewerStore } from '../stores/viewerStore.js';
  import { selectionStore } from '../stores/selectionStore.js';
  import MapViewport from './MapViewport.svelte';
</script>

<section class="app-shell">
  <h1>Trifoglio</h1>
  <p>Svelte migration shell. No business features are active yet.</p>

  <MapViewport />

  <ul>
    <li>Kernel ready: {$appKernel ? 'yes' : 'no'}</li>
    <li>Project store: {$projectStore ? 'bound' : 'empty'}</li>
    <li>Viewer store: {$viewerStore ? 'bound' : 'empty'}</li>
    <li>Selection store: {$selectionStore ? 'bound' : 'empty'}</li>
  </ul>
</section>
