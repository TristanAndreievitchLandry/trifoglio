<script>
  import { appKernel } from '../stores/appKernelStore.js';
  import { projectStore } from '../stores/projectStore.js';
  import { viewerStore } from '../stores/viewerStore.js';
  import { selectionStore } from '../stores/selectionStore.js';
  import MapViewport from './MapViewport.svelte';
  import Weather from './Weather.svelte';
</script>

<section class="app-shell">
  <div class="app-shell__topbar" id="app-shell-topbar">
    <div class="app-shell__topbar-title">
      <h1>Trifoglio</h1>
      <p>Svelte migration shell. No business features are active yet.</p>
    </div>
    <div class="app-shell__topbar-actions">
      <Weather />
      <div id="language-switcher" class="language-switcher" aria-label="Language switcher">
        <button type="button" class="language-switcher__item" data-locale="de">DE</button>
        <span class="language-switcher__sep" aria-hidden="true">|</span>
        <button type="button" class="language-switcher__item" data-locale="en">EN</button>
        <span class="language-switcher__sep" aria-hidden="true">|</span>
        <button type="button" class="language-switcher__item" data-locale="es">ES</button>
        <span class="language-switcher__sep" aria-hidden="true">|</span>
        <button type="button" class="language-switcher__item" data-locale="fr">FR</button>
        <span class="language-switcher__sep" aria-hidden="true">|</span>
        <button type="button" class="language-switcher__item" data-locale="it">IT</button>
      </div>
    </div>
  </div>

  <MapViewport />

  <ul>
    <li>Kernel ready: {$appKernel ? 'yes' : 'no'}</li>
    <li>Project store: {$projectStore ? 'bound' : 'empty'}</li>
    <li>Viewer store: {$viewerStore ? 'bound' : 'empty'}</li>
    <li>Selection store: {$selectionStore ? 'bound' : 'empty'}</li>
  </ul>
</section>
