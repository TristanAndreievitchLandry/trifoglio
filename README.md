# trifoglio

Trifoglio is a Svelte application for exploring, annotating, and analyzing any document available through the International Image Interoperability Framework (IIIF), including historical maps, artworks, manuscripts, photographs, botanical plates, and other digitized collections.

Users can load IIIF resources by providing a IIIF manifest URL, then create annotations directly on the document using markers, lines, polygons, and other geometric shapes. Annotations are stored locally in the browser and can also be exported as JSON for sharing or later reuse.

The application uses
<a href="https://leafletjs.com/" target="_blank">Leaflet</a>, <a href="https://github.com/mejackreed/Leaflet-IIIF" target="_blank">Leaflet-iiif</a>, <a href="https://github.com/Leaflet/Leaflet.draw" target="_blank">Leaflet.draw</a> et <a href="https://github.com/mlevans/leaflet-hash" target="_blank">Leaflet-hash</a></br></br>Conception: <a href="https://www.usherbrooke.ca/histoire/departement/personnel/personnel-enseignant/tristan-landry" target="blank">Tristan Landry</a>
The project is available on <a href="https://github.com/TristanAndreievitchLandry/trifoglio" target="blank">GitHub</a>.

## Build protegee (minifiee + obfusquee)

Pour generer une version moins lisible du code front-end, utilise:

```bash
npm run build:protect
```

Une version plus agressive est aussi disponible:

```bash
npm run build:protect:strict
```

Le resultat est genere dans le dossier `dist/`:

- `dist/index.html` (auto-rebranche sur les scripts `.min.js`)
- `dist/main.min.js`
- `dist/i18n-runtime.min.js`
- `dist/data.min.js`
- assets et dependances necessaires copies automatiquement

Note: l'obfuscation augmente la difficulte de lecture/copie, mais ne peut pas rendre un code client totalement incopiable.

## Securite des dependances

Le projet utilise un override npm pour `esbuild` afin de corriger une vulnerabilite transitive signalee via `svelte-i18n`.

- override applique: `esbuild@^0.25.0`
- objectif: conserver la version actuelle de `svelte-i18n` tout en supprimant les alertes `npm audit` moderees
