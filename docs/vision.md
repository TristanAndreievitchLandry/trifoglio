> **Vision de Trifoglio**
>
> Trifoglio est un environnement de recherche permettant d'explorer, de decrire, d'organiser et d'interpréter des documents IIIF (cartes anciennes, plans, manuscrits, oeuvres d'art, photographies) au moyen de Features.
>
> Les Features ne sont pas de simples objets graphiques : elles constituent des donnees scientifiques pouvant etre documentees, classees, recherchees, exportees et reutilisees.
>
> Les principes qui guident le developpement sont :
>
> - simplicite d'utilisation ;
> - compatibilite avec les standards IIIF et GeoJSON ;
> - architecture modulaire ;
> - extensibilite ;
> - interoperabilite avec les outils SIG lorsque pertinent.

Ce type de document est extremement precieux. Il vous aide a rester coherent lorsque le projet grandit et sera tres utile si, un jour, d'autres personnes contribuent au developpement.

Un manifeste IIIF peut representer :

- une carte ancienne ;
- une peinture ;
- un manuscrit ;
- une photographie ;
- une gravure ;
- une estampe ;
- une planche botanique ;
- une partition musicale ;
- un journal ancien ;
- un herbier ;
- un objet archeologique ;
- une sculpture (avec plusieurs vues) ;
- une image scientifique.

Toutes ces sources ont besoin des memes outils :

- zoom profond ;
- Features ;
- mesures ;
- regroupement des Features ;
- commentaires ;
- partage.

//////////////////////////

## Développement futur — Annotations IIIF interopérables

Une évolution importante de Trifoglio pourrait consister à ajouter une couche de conversion et d’export permettant de transformer les Features créées dans Trifoglio en **annotations interopérables selon les standards IIIF et W3C Web Annotation**.

Trifoglio dispose déjà d’une infrastructure permettant de créer, modifier et enregistrer des Features géométriques. Le développement envisagé ne nécessiterait donc pas de remplacer ce système, mais d’ajouter une couche entre les géométries Leaflet et les standards d’annotation IIIF.

Cette couche aurait trois fonctions principales :

1. **Conversion des coordonnées** — établir une correspondance fiable entre les coordonnées utilisées par Leaflet et le système de coordonnées du IIIF Canvas, afin qu’une Feature exportée puisse identifier précisément une région de l’image.

2. **Conversion des géométries** — transformer les Features créées dans Trifoglio en sélecteurs compatibles avec les standards IIIF/W3C : notamment `xywh` pour les régions rectangulaires et `SvgSelector` pour les polygones et autres formes complexes.

3. **Export d’annotations** — produire des annotations structurées pouvant être conservées indépendamment de Trifoglio et potentiellement réutilisées par d’autres outils et environnements compatibles avec IIIF.

L’objectif serait ainsi de faire évoluer Trifoglio d’un outil permettant de **creer et enrichir des Features sur des images IIIF** vers un outil permettant de **produire des annotations IIIF interopérables**.

Cette évolution préserverait le format JSON actuellement utilisé par Trifoglio pour le fonctionnement interne de l’application, tout en offrant éventuellement plusieurs formats d’export : données propres à Trifoglio, GeoJSON et annotations IIIF/W3C.

À plus long terme, cette architecture permettrait de dissocier les Features de l’interface utilisée pour les créer, tout en permettant leur projection dans un format d’annotation standardisé. Une annotation produite à partir d’une Feature Trifoglio pourrait ainsi être conservée comme donnée de recherche indépendante du logiciel et potentiellement réutilisée dans d’autres environnements IIIF.

**Principe architectural :**

`IIIF Manifest → IIIF Canvas → Leaflet-IIIF → Leaflet.Draw → Feature Trifoglio → conversion de coordonnées → annotation IIIF/W3C`

Cette fonctionnalité constitue une **orientation future** plutôt qu'une composante nécessaire du fonctionnement actuel de Trifoglio.
////////////////////////

## Passage de Vanilla JS à Svelte

Trifoglio évolue d’un prototype basé sur Vanilla JavaScript vers une architecture Svelte afin de mieux soutenir son développement à long terme.

Ce changement ne modifie pas le rôle de Leaflet ou d’IIIF : **Leaflet demeure le moteur de visualisation et d’interaction cartographique, tandis que Svelte devient la couche applicative qui orchestre l’interface, l’état et les fonctionnalités de Trifoglio.**

Cette évolution apporte plusieurs avantages :

- **Une meilleure gestion de l’état** : manifeste IIIF, couche active, Features, outils, pop-ups, langue et données exportées peuvent être gérés de manière réactive et cohérente.
- **Une architecture modulaire** : les différentes fonctionnalités peuvent être organisées en composants indépendants et réutilisables.
- **Une interface plus évolutive** : l'ajout de formulaires, panneaux, éditeurs de pop-ups, médias et outils devient plus simple sans complexifier un fichier JavaScript central.
- **Une internationalisation facilitée** : l’interface peut être structurée dès maintenant pour prendre en charge le français, l’anglais et l’italien.
- **Une meilleure préparation aux développements futurs** : comptes utilisateurs, projets, collaboration, persistance des Features, bases de données et nouvelles fonctions d’export peuvent être ajoutés progressivement.

Le passage à Svelte constitue donc une **évolution architecturale plutôt qu’un simple changement de technologie**. Il prépare Trifoglio à passer d’un viewer IIIF enrichi d’outils de Feature editing à une véritable plateforme de visualisation, de description et de partage de documents patrimoniaux.

///////////////////////////
les trois choses les plus intéressantes à tester ensuite seraient :

météo → API externe + état réactif ;
pop-up d'annotation → état + formulaire + Leaflet ;
sauvegarde d'annotations dans une API SvelteKit → frontend → backend → PostgreSQL.
///////////////////
