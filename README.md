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
- runtime paths can be overridden with window.__TRF_RUNTIME_PATHS__ (used by protected builds)

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

The build script also rewrites dist/index.html by injecting window.__TRF_RUNTIME_PATHS__ so bootstrap.js loads the protected scripts.

## i18n Notes

- Default locale is French.
- Supported locales: de, en, es, fr, it.
- Dynamic UI nodes rely on data-i18n-key and data-i18n-attr.
- Startup now explicitly reapplies translations after shell injection to avoid race conditions in modal labels/buttons.

## Dependency Security

The project keeps an npm override for a transitive esbuild issue via svelte-i18n:

- override: esbuild@^0.25.0
- goal: keep current svelte-i18n while avoiding moderate npm audit findings

## Disclaimer

Obfuscation increases reverse-engineering effort but cannot make client-side code fully uncopyable.
