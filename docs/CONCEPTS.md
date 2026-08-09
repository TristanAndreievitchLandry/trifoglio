# Concepts Trifoglio

## Feature

Dans Trifoglio, une Feature designe tout objet graphique ajoute par l'utilisateur sur le document IIIF.

Feature est le terme canonique du modele et du code.

Le mot annotation peut encore apparaitre dans certains textes, dans l'interface ou dans de l'ancien code, mais il doit etre compris comme un alias historique de Feature.

Une Feature peut etre:

- un marqueur (Marker)
- une ligne (Polyline)
- un polygone (Polygon)
- un rectangle (Rectangle)
- un cercle (Circle)
- un cercle de rayon (CircleMarker si utilise)
- toute future geometrie Leaflet Draw

Une Feature est composee de deux parties:

1. une geometrie Leaflet
2. des proprietes (metadonnees)

Les proprietes ne dependent jamais du type de geometrie.

Toutes les Features, quel que soit leur type, peuvent posseder:

- un titre
- une description
- une categorie
- des metadonnees personnalisees
- un style
- des tags
- des pieces jointes (fonctionnalite future)
- une popup

## Projet Trifoglio

Un projet represente tout l'environnement de travail.

Il contient:

- le manifeste IIIF
- l'etat du visualiseur
- les calques
- les Features
- les preferences du projet

## Couche (Layer)

Une couche est un groupe logique de Features.

Elle ne contient aucune logique metier.

Elle permet uniquement:

- organiser
- masquer
- verrouiller
- colorer
- ordonner

des Features.

## Metadonnee

Une metadonnee est une paire cle/valeur libre.

Exemples:

- species : Acer saccharum
- artist : Claude Monet
- pigment : Azurite
- bibliography : ...
- date : 1763

Le logiciel ne fait aucune hypothese sur leur signification.

## Positionnement de la plateforme

Trifoglio est une plateforme generique permettant d'explorer, de decrire, d'organiser et d'analyser tout document compatible avec IIIF au moyen de Features.

Le logiciel n'est pas specialise pour une discipline.

Les cartes anciennes, les oeuvres d'art, les manuscrits, les herbiers, les photographies ou les objets de musee sont simplement des cas d'utilisation differents.

L'architecture ne doit contenir aucune hypothese propre a une discipline.

## Terminologie pratique

- Feature : terme de reference pour le domaine, le code et l'architecture.
- Annotation : terme tolere seulement comme synonyme historique ou pedagogique.
- Layer : groupe logique de Features.
- Metadata : proprietes descriptives associees a une Feature.

## References architecture

- docs/architecture/README.md
- docs/architecture/adrs/ADR-001-es6-modular-architecture.md
- docs/architecture/adrs/ADR-002-event-driven-coordination.md
- docs/architecture/adrs/ADR-003-canonical-domain-model.md
- docs/architecture/adrs/ADR-004-project-lifecycle.md
- docs/architecture/adrs/ADR-005-feature-lifecycle.md
- docs/architecture/adrs/ADR-006-extension-strategy.md
