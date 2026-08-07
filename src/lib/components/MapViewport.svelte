<script>
  /**
   * Structure-only viewport component for future Leaflet mounting.
   * No map initialization or business behavior is implemented.
   */
  export let id = 'map-viewport';
</script>

<section class="map-viewport" aria-label="Map viewport scaffold">
  <div id={id} class="map-viewport__surface"></div>
</section>
