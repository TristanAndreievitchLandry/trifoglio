# trifoglio

Cette application permet aux utilisateurs de charger des couches de carte à partir de services IIIF (International Image Interoperability Framework) en utilisant des URL de manifeste IIIF. Les utilisateurs peuvent également dessiner et sauvegarder des formes géométriques (polygones, lignes, marqueurs) sur la carte. Les dessins sont sauvegardés localement dans le navigateur à l'aide du stockage local, mais ils peuvent aussi être téléchargés en format json. L'application utilise <a href="https://leafletjs.com/" target="_blank">Leaflet</a>, <a href="https://github.com/mejackreed/Leaflet-IIIF" target="_blank">Leaflet-iiif</a>, <a href="https://github.com/Leaflet/Leaflet.draw" target="_blank">Leaflet.draw</a> et <a href="https://github.com/mlevans/leaflet-hash" target="_blank">Leaflet-hash</a></br></br>Conception: <a href="https://www.usherbrooke.ca/histoire/departement/personnel/personnel-enseignant/tristan-landry" target="blank">Tristan Landry</a>

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
