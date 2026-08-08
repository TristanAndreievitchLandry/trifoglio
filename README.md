# Trifoglio

Trifoglio is a web mapping application for exploring, annotating, and exporting IIIF resources (historical maps, artworks, manuscripts, photographs, botanical plates, and other digitized documents).

Users can:

- load a IIIF manifest URL,
- navigate canvases when a manifest contains multiple pages,
- draw annotations (lines, polygons, rectangles, circles, circle markers),
- save annotations locally per manifest/canvas,
- export and re-import GeoJSON with manifest/canvas context.

The project uses:

- Leaflet
- Leaflet-IIIF
- Leaflet.draw
- Leaflet-hash
- GSAP (intro animation)

Conception: <a href="https://www.usherbrooke.ca/histoire/departement/personnel/personnel-enseignant/tristan-landry" target="blank">Tristan Landry</a>

Repository: <a href="https://github.com/TristanAndreievitchLandry/trifoglio" target="blank">GitHub</a>

## Current Runtime Architecture

The app now boots through a single runtime loader:

- entrypoint in HTML: src/app/entry/bootstrap.js
- runtime scripts are loaded sequentially to preserve dependency order
- runtime paths can be overridden with window.**TRF_RUNTIME_PATHS** (used by protected builds)

Main source structure:

- src/app/entry/main.js: application runtime and UI orchestration
- src/app/entry/i18n-runtime.js: locale loading and DOM translation pass
- src/app/data/catalogs.js: built-in IIIF data entries
- src/app/styles/app.css: application styling
- src/lib/vendors: vendored runtime dependencies
- src/lib/i18n: locale dictionaries

## Run Locally

This project is browser-driven and can be served as static files.

Install dependencies:

```bash
npm install
```

Then open index.html from a static server (recommended for consistent browser behavior).

## Protected Build (Minified + Obfuscated)

Generate a standard protected build:

```bash
npm run build:protect
```

Generate a stricter protected build:

```bash
npm run build:protect:strict
```

Output is written to dist/.

Minified/obfuscated outputs:

- dist/main.min.js
- dist/i18n-runtime.min.js
- dist/catalogs.min.js

Copied runtime assets:

- src/app/assets
- src/lib/vendors
- src/lib/i18n
- src/app/styles/app.css
- src/app/entry/bootstrap.js
- LICENSE

The build script also rewrites dist/index.html by injecting window.**TRF_RUNTIME_PATHS** so bootstrap.js loads the protected scripts.

## i18n Notes

- Default locale is French.
- Supported locales: de, en, es, fr, it.
- Dynamic UI nodes rely on data-i18n-key and data-i18n-attr.
- Startup now explicitly reapplies translations after shell injection to avoid race conditions in modal labels/buttons.

## Dependency Security

The project keeps an npm override for a transitive esbuild issue via svelte-i18n:

- override: esbuild@^0.25.0
- goal: keep current svelte-i18n while avoiding moderate npm audit findings

## Third-Party Resource Attribution

The project uses or loads the following third-party resources:

- Playfair Display, loaded from Google Fonts in index.html:
  https://fonts.google.com/specimen/Playfair+Display

- Font Awesome, loaded via the official Font Awesome Kit in index.html:
  https://fontawesome.com/

- Leaflet 1.0.2, loaded from unpkg at runtime:
  https://leafletjs.com/

- Leaflet.draw 1.0.4, vendored under src/lib/vendors/leaflet-draw:
  https://github.com/Leaflet/Leaflet.draw

- Leaflet-IIIF 1.2.1 by Jack Reed, vendored under src/lib/vendors/leaflet/plugins/leaflet-iiif.js:
  https://github.com/mejackreed/Leaflet-IIIF

- Leaflet-hash, vendored under src/lib/vendors/leaflet/plugins/leaflet-hash.js:
  https://github.com/mlevans/leaflet-hash

- GSAP 3.15.0 by GreenSock, vendored under src/lib/vendors/gsap:
  https://gsap.com/
  License information in the distributed file points to:
  https://gsap.com/standard-license/

When relevant, please refer to each upstream project for its current license terms, attribution requirements, and documentation.

## Disclaimer

Obfuscation increases reverse-engineering effort but cannot make client-side code fully uncopyable.
