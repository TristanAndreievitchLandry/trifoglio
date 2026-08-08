> **Vision de Trifoglio**
>
> Trifoglio est un environnement de recherche permettant d'explorer, d'annoter, d'organiser et d'interpréter des documents IIIF (cartes anciennes, plans, manuscrits, oeuvres d'art, photographies).
>
> Les annotations ne sont pas de simples objets graphiques : elles constituent des donnees scientifiques pouvant etre documentees, classees, recherchees, exportees et reutilisees.
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
- annotations ;
- mesures ;
- regroupement des annotations ;
- commentaires ;
- partage.

//////////////////////////

## Développement futur — Annotations IIIF interopérables

Une évolution importante de Trifoglio pourrait consister à ajouter une couche de conversion et d’export permettant de transformer les annotations créées avec Leaflet.Draw en **annotations interopérables selon les standards IIIF et W3C Web Annotation**.

Trifoglio dispose déjà d’une infrastructure permettant de créer, modifier et enregistrer des marqueurs, lignes et polygones. Le développement envisagé ne nécessiterait donc pas de remplacer ce système, mais d’ajouter une couche entre les géométries Leaflet et les standards d’annotation IIIF.

Cette couche aurait trois fonctions principales :

1. **Conversion des coordonnées** — établir une correspondance fiable entre les coordonnées utilisées par Leaflet et le système de coordonnées du IIIF Canvas, afin qu’une annotation puisse identifier précisément une région de l’image.

2. **Conversion des géométries** — transformer les formes créées dans Trifoglio en sélecteurs compatibles avec les standards IIIF/W3C : notamment `xywh` pour les régions rectangulaires et `SvgSelector` pour les polygones et autres formes complexes.

3. **Export d’annotations** — produire des annotations structurées pouvant être conservées indépendamment de Trifoglio et potentiellement réutilisées par d’autres outils et environnements compatibles avec IIIF.

L’objectif serait ainsi de faire évoluer Trifoglio d’un outil permettant de **dessiner et annoter des images IIIF** vers un outil permettant de **produire des annotations IIIF interopérables**.

Cette évolution préserverait le format JSON actuellement utilisé par Trifoglio pour le fonctionnement interne de l’application, tout en offrant éventuellement plusieurs formats d’export : données propres à Trifoglio, GeoJSON et annotations IIIF/W3C.

À plus long terme, cette architecture permettrait de dissocier les annotations des interfaces utilisées pour les créer. Une annotation produite dans Trifoglio pourrait ainsi être conservée comme donnée de recherche indépendante du logiciel et potentiellement réutilisée dans d’autres environnements IIIF.

**Principe architectural :**

`IIIF Manifest → IIIF Canvas → Leaflet-IIIF → Leaflet.Draw → géométrie Trifoglio → conversion de coordonnées → annotation IIIF/W3C`

Cette fonctionnalité constitue une **orientation future** plutôt qu'une composante nécessaire du fonctionnement actuel de Trifoglio.
////////////////////////
