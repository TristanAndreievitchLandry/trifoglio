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

météo → API externe + état réactif ;✔️
pop-up d'annotation → état + formulaire + Leaflet ;
sauvegarde d'annotations dans une API SvelteKit → frontend → backend → PostgreSQL.
///////////////////

### Évolution technique : SvelteKit et TypeScript

Trifoglio évoluera progressivement d'une architecture JavaScript/Svelte vers **SvelteKit**, puis **TypeScript**.

Le passage à **SvelteKit** constitue d'abord une évolution architecturale : il permettra de mieux organiser l'application, de préparer l'intégration d'une API, l'authentification et, à terme, un stockage partagé des annotations dans **PostgreSQL/PostGIS**.

**TypeScript sera introduit ensuite progressivement**, sans réécriture complète du projet. Les modules les plus importants seront typés en priorité : données IIIF, annotations GeoJSON, métadonnées, médias, utilisateurs et échanges avec l'API.

Cette combinaison permettra à Trifoglio de conserver la simplicité de son interface actuelle tout en fournissant une base plus robuste et maintenable pour les développements futurs, notamment les contributions collaboratives, les projets étudiants et le stockage centralisé des annotations.

**Ordre de migration prévu :**

`JavaScript → Svelte → SvelteKit → TypeScript → API/PostgreSQL/PostGIS`

===================================

# Trifoglio — Vision future : plateforme collaborative, StoryMaps et IIIF

## 1. Évolution du projet

Trifoglio doit évoluer d’un simple outil d’annotation cartographique vers une **plateforme de création, de narration et de publication de cartes historiques et d’images IIIF**.

L’architecture envisagée repose sur :

- **SvelteKit** pour l’interface;
- **Cognito** pour l’authentification;
- **API / Lambda** pour la logique applicative;
- **PostgreSQL + PostGIS** pour les projets, utilisateurs, permissions et données géographiques;
- **S3** pour les fichiers et médias;
- **CloudFront** pour la distribution des images et tuiles;
- **Python + libvips/GDAL** pour les traitements d’images lourdes;
- **IIIF** pour les images haute résolution et les manifestes.

## 2. Comptes et sauvegarde

Les personnes utilisatrices pourront créer un compte et sauvegarder leurs projets.

Un projet pourra contenir :

- features géographiques;
- propriétés JSON;
- annotations;
- médias;
- images IIIF;
- StoryMaps;
- métadonnées.

PostGIS doit stocker les géométries comme véritables données spatiales plutôt que de considérer le GeoJSON comme le format de stockage principal. Le GeoJSON restera notamment un format d’import/export.

Les projets pourront être partagés avec d’autres personnes utilisatrices avec différents niveaux de permission :

- owner;
- editor;
- viewer.

## 3. Modèle économique

Le modèle envisagé comporte trois niveaux.

### Free — Explorer et annoter

- création de projets;
- annotation cartographique;
- nombre limité de features;
- export GeoJSON;
- accès aux fonctions fondamentales.

La limite de features sert notamment de mécanisme de conversion vers les abonnements payants.

### Pro — Enseigner, raconter et publier

Le forfait Pro ajoute notamment :

- nombre élevé de features;
- sauvegarde en ligne;
- partage;
- collaboration;
- médias;
- **parcours des features**;
- **StoryMap**;
- publication;
- intégration (`iframe/embed`).

Le **parcours des features** est particulièrement pertinent pour l'enseignement : une personne enseignante peut préparer une série de sites ou d'objets et les présenter séquentiellement. Chaque étape peut centrer la carte, modifier le zoom, sélectionner la feature et afficher son popup ou ses médias.

### Premium — Créer et héberger du IIIF

Le forfait Premium ajoute :

- upload de TIFF haute résolution;
- traitement automatique;
- génération des tuiles IIIF;
- `info.json`;
- manifeste IIIF;
- hébergement des ressources IIIF;
- URL publique.

Le Premium doit être associé à des quotas de stockage et de traitement afin de protéger la marge du service.

## 4. Pipeline TIFF → IIIF

Le TIFF original ne doit pas être stocké dans PostgreSQL. Il est conservé dans S3.

Pipeline envisagé :

```text
TIFF
 ↓
S3 / originals
 ↓
SQS
 ↓
Worker Python / Docker
 ↓
libvips / GDAL
 ↓
pyramide + tuiles
 ↓
S3 / IIIF
 ↓
info.json + manifest.json
 ↓
CloudFront
 ↓
Trifoglio
```

Le traitement lourd doit être séparé du frontend et probablement exécuté dans un conteneur, par exemple avec ECS Fargate, plutôt que dans une Lambda lorsque les fichiers sont très volumineux.

Le TIFF original pourra éventuellement être déplacé vers **S3 Glacier / Deep Archive** après une longue période d'inactivité, tandis que les tuiles nécessaires à l'affichage resteront immédiatement accessibles.

## 5. StoryMap native pour IIIF

Une opportunité stratégique est de faire de Trifoglio un outil de **StoryMap spécifiquement conçu pour les images et cartes IIIF**.

Les StoryMaps existantes sont souvent centrées sur des fonds cartographiques web tels qu'OSM. Trifoglio peut se différencier en faisant de l'image historique elle-même le fond du récit.

Exemple :

```text
Section 1
→ texte
→ position/zoom IIIF
→ annotations
→ photo

Section 2
→ texte
→ nouvelle position/zoom
→ nouvelles annotations
→ autre photo

Section 3
→ texte
→ autre région de la carte
→ médias
```

Le défilement d'une StoryMap peut donc contrôler simultanément :

- le texte;
- la position de la carte;
- le niveau de zoom;
- les features sélectionnées;
- les annotations;
- les photos et autres médias.

Positionnement possible :

> **StoryMaps for IIIF**

ou :

> **Turn IIIF images into interactive stories.**

Cette niche doit toutefois être validée par une recherche concurrentielle avant d'affirmer qu'il s'agit d'une fonctionnalité sans équivalent.

## 6. Médias dans les StoryMaps

Les personnes utilisatrices Pro pourront associer des photos aux sections des StoryMaps.

Les fichiers images seront stockés dans S3, tandis que PostgreSQL conservera leurs métadonnées et leurs relations avec les projets et StoryMaps.

Les photos seront automatiquement optimisées à l'upload :

```text
photo originale
 ↓
worker Python
 ↓
redimensionnement
 ↓
WebP / AVIF
 ↓
thumbnail
 ↓
S3
```

L'original pourra être conservé séparément selon le forfait.

Une même photo doit pouvoir être réutilisée dans plusieurs StoryMaps sans duplication du fichier.

## 7. StoryMap et diffusion

Les StoryMaps publiées doivent être accessibles par une URL publique et pouvoir être intégrées dans des sites externes :

```html
<iframe src="https://trifoglio.app/story/..."></iframe>
```

Cela ouvre un marché potentiel auprès :

- des journaux;
- des bibliothèques;
- des archives;
- des musées;
- des universités;
- des personnes enseignantes;
- des chercheurs;
- des projets d'humanités numériques.

Les projets publics doivent être indexables et posséder leurs propres métadonnées afin de devenir des portes d'entrée vers Trifoglio.

## 8. Acquisition d'utilisateurs

Chaque StoryMap publiée peut comporter un petit branding :

> **Fait avec Trifoglio**

avec un lien vers Trifoglio.

L'objectif est de transformer les StoryMaps publiées en mécanisme de diffusion organique :

```text
StoryMap
 ↓
site universitaire / journal / musée
 ↓
lecteurs
 ↓
« Fait avec Trifoglio »
 ↓
nouveaux utilisateurs
```

Le branding doit rester discret pour que le contenu publié demeure au premier plan.

Les marchés à cibler en priorité sont :

- IIIF;
- humanités numériques;
- GIS historique;
- bibliothèques;
- archives;
- musées;
- histoire de l'art;
- enseignement universitaire.

L'écosystème italien est notamment intéressant en raison de l'importance de ses collections numériques et de l'adoption du IIIF par des institutions comme l'ICCU, la Biblioteca Apostolica Vaticana, l'Estense Digital Library et d'autres bibliothèques.

## 9. Architecture de stockage

Séparer clairement les données applicatives des fichiers :

```text
PostgreSQL/PostGIS
│
├── users / permissions
├── projects
├── features
├── stories
├── story_sections
└── media metadata

S3
│
├── original TIFF
├── photos originales
├── photos optimisées
├── IIIF tiles
├── info.json
└── manifests
```

PostgreSQL ne doit pas servir de stockage binaire principal.

## 10. Économie du service

Le modèle de travail envisagé est approximativement :

- Free : 0 $ US;
- Pro : ~9,99 $ US/mois;
- Premium : ~29,99 $ US/mois.

Les prix devront être validés ultérieurement par rapport aux coûts réels et au marché.

Le Premium devrait comporter des quotas de :

- stockage;
- nombre de TIFF traités;
- éventuellement trafic.

Le stockage des originaux peut être optimisé avec S3 Intelligent-Tiering et, à long terme, Glacier.

Le principal risque de coût n'est probablement pas le calcul nécessaire pour générer les tuiles, mais plutôt :

- stockage à long terme;
- volume de tuiles;
- trafic;
- consultations massives de ressources IIIF.

## 11. Vision globale

La chaîne de valeur de Trifoglio peut être résumée ainsi :

```text
TIFF
 ↓
IIIF
 ↓
Annotation
 ↓
Features
 ↓
StoryMap
 ↓
Publication
 ↓
Partage / Embed
```

Trifoglio ne serait donc plus seulement un éditeur GeoJSON, mais une plateforme permettant de transformer une **source historique numérisée en expérience interactive et publiable**.

La différenciation principale serait :

> **Annoter, raconter et publier des cartes et images historiques à partir de IIIF.**

# Le développement commercial doit privilégier cette chaîne complète plutôt que de présenter Trifoglio comme un simple concurrent des outils GIS ou des StoryMaps généralistes.

==================================
j'ai acheté le nom de domaine trifoglio.app
17/08/26
désormais domaine officiel du projet qui sera herbergé dans aws s3
================================

## Monétisation et paiements

Trifoglio utilisera **Stripe** pour gérer les abonnements et les paiements. AWS ne gère pas directement les revenus : AWS facture l'infrastructure, tandis que Stripe encaisse les abonnements et verse les revenus nets dans le compte bancaire du projet.

### Flux financier

```text
Personne utilisatrice
        │
        ▼
      Stripe
        │
        ├── frais de paiement
        │
        ▼
Compte bancaire Trifoglio

AWS
 │
 └── facture séparément l'infrastructure
```

### Abonnements

Le modèle envisagé comporte trois niveaux :

- **Free** : accès aux fonctions de base avec certaines limites.
- **Pro** : environ 9,99 $ US/mois, avec notamment sauvegarde, partage, médias, parcours des features et création/publication de StoryMaps.
- **Premium** : environ 29,99 $ US/mois, avec notamment upload de TIFF, traitement automatique, génération de tuiles IIIF, manifestes IIIF et hébergement.

Les prix et quotas devront être validés avant le lancement commercial.

### Intégration technique

Stripe gère :

- les paiements;
- les abonnements mensuels et annuels;
- les renouvellements;
- les remboursements;
- les changements d'abonnement;
- les versements vers le compte bancaire.

Trifoglio conserve uniquement les informations nécessaires à la gestion des droits, par exemple :

```text
user_id
stripe_customer_id
subscription_id
plan
subscription_status
```

Les changements d'état de l'abonnement seront transmis à Trifoglio par les mécanismes de notification de Stripe afin d'activer ou désactiver automatiquement les fonctionnalités Pro et Premium.

### Architecture financière

```text
                    TRIFOGLIO
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       Cognito        Stripe          AWS
          │             │             │
     identité       revenus       infrastructure
                        │
                        ▼
                 Compte bancaire
```

AWS Marketplace pourrait éventuellement être envisagé plus tard pour les **ventes institutionnelles**, notamment les licences universitaires, mais Stripe constitue le système de paiement privilégié pour les abonnements individuels.

# Les coûts AWS et les frais Stripe doivent être considérés séparément dans le modèle financier. La rentabilité doit être calculée sur le revenu net après frais de paiement et coûts d'infrastructure, avant les autres dépenses du projet.

================================
