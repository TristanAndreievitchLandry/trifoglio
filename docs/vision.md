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
ajouter une fonction rotation

---

## Versioning et suivi des modifications

Trifoglio doit prévoir, dès la conception de son architecture de données, la possibilité de suivre les modifications apportées aux projets, cartes, couches et objets géographiques.

L'approche de suivi des changements présentée dans l'écosystème IIIF montre l'intérêt de distinguer :

- l'état courant des données;
- les modifications apportées à cet état;
- les révisions successives du projet.

Le système n'a pas besoin de remplacer le stockage principal. PostgreSQL/PostGIS demeure la source de vérité de l'état courant, tandis qu'un historique append-only peut conserver les changements significatifs.

### Principes

Chaque entité importante doit disposer d'un identifiant stable. Les positions dans un tableau ou une collection ne doivent pas servir d'identifiant durable.

Une modification devrait pouvoir être décrite sous une forme conceptuelle similaire à :

```
projet 42
révision 17
feature 183
propriété : geometry
ancienne valeur : ...
nouvelle valeur : ...
utilisateur : ...
date : ...
```

Le système doit pouvoir distinguer :

- modification d'une propriété;
- ajout d'une entité;
- suppression d'une entité;
- déplacement ou modification d'une géométrie;
- modification des métadonnées;
- modification de la structure d'une carte ou d'une StoryMap.

### Architecture envisagée

Trifoglio conservera une représentation canonique de l'état actuel dans PostgreSQL/PostGIS et pourra associer à celle-ci un historique des changements.

Cette architecture hybride est préférable à une reconstruction permanente de l'état courant à partir d'un flux d'événements :

```
État courant
     +
Historique des modifications
     +
Snapshots / révisions
```

Le versioning doit être considéré comme une capacité de l'application, et non comme une propriété imposée par IIIF ou par le système de stockage.

### Utilisations futures

Le suivi des modifications pourra permettre :

- historique et révisions des projets;
- restauration d'une version antérieure;
- audit des modifications;
- annulation/rétablissement;
- synchronisation;
- collaboration;
- invalidation ciblée du cache;
- mise à jour sélective des index;
- notifications et webhooks;
- transmission uniquement des données modifiées;
- évolution éventuelle vers des fonctions hors ligne.

Cette architecture sera particulièrement utile pour la future fonction StoryMap, où plusieurs types d'objets — cartes, couches, données et contenus narratifs — devront pouvoir évoluer indépendamment.

### IIIF

Le suivi interne des modifications ne doit pas être confondu avec IIIF Change Discovery.

Le change tracking sert à déterminer précisément ce qui a changé à l'intérieur d'une ressource. IIIF Change Discovery sert plutôt à signaler qu'une ressource IIIF a été modifiée.

Trifoglio pourra éventuellement utiliser le premier pour alimenter le second.

### Décision architecturale

Le versioning complet n'est pas une priorité de la première version de Trifoglio, mais l'architecture initiale doit éviter de le rendre difficile à ajouter ultérieurement.

En particulier :

1. utiliser des identifiants stables pour les entités;
2. conserver des relations explicites entre les objets;
3. séparer l'état courant de l'historique;
4. prévoir une notion de révision;
5. éviter de dépendre exclusivement de la position d'un objet dans un tableau;
6. conserver suffisamment d'informations pour pouvoir introduire ultérieurement l'historique, la collaboration et la synchronisation.

L'objectif n'est pas de transformer Trifoglio en système entièrement « event-sourced », mais de conserver la possibilité d'introduire progressivement ces fonctionnalités sans refonte majeure de la base de données.
/////////////////////////////

## Collaboration et groupes — Trifoglio Pro

Trifoglio évoluera d’un outil individuel d’annotation IIIF vers un **espace collaboratif de travail sur les cartes et les images**.

### Concept

Les utilisateurs Pro pourront créer des **groupes de travail** autour d’une carte ou d’une image IIIF. Plusieurs personnes pourront alors annoter simultanément le même document spatial, partager leurs observations et construire collectivement un corpus d’annotations.

L’image ou la carte IIIF constitue le **référentiel spatial commun** du groupe.

### Fonctionnalités envisagées

- création de projets et de groupes de travail ;
- invitation de personnes participantes ;
- rôles et permissions : propriétaire, éditeur, contributeur, lecture seule ;
- annotations partagées : points, lignes, polygones, textes et images ;
- couleurs par personne, catégorie ou type d’annotation ;
- commentaires associés aux annotations ;
- historique et versionnement des modifications ;
- validation ou révision des annotations ;
- visualisation des contributions de chaque personne ;
- export des résultats en GeoJSON, Web Annotation et JSON Trifoglio.

### Distinction projet / groupe

Un **projet** correspond au contenu et aux documents étudiés.

Un **groupe** correspond aux personnes autorisées à travailler sur ces documents.

Un même projet pourra donc accueillir plusieurs groupes, et un groupe pourra travailler sur plusieurs cartes ou images.

```text
Projet
│
├── Carte / Image 1
│   ├── Groupe A
│   └── Groupe B
│
├── Carte / Image 2
│   └── Groupe A
│
└── Image 3
    └── Groupe C
```

### Architecture

Cette évolution s’intègre à une architecture fondée sur :

- **Cognito** pour l’authentification ;
- **PostgreSQL/PostGIS** pour les utilisateurs, projets, groupes et annotations ;
- **IIIF** comme infrastructure de diffusion des images ;
- un système d’événements et de versionnement permettant éventuellement la **synchronisation en temps réel** des annotations.

Le modèle d’annotation doit être conçu dès le départ pour permettre plusieurs auteurs, les modifications concurrentes, l’historique et la validation.

### Positionnement de Trifoglio Pro

La collaboration constitue un axe majeur de la version Pro. La valeur ajoutée ne repose plus uniquement sur des fonctionnalités supplémentaires, mais sur la possibilité de **faire travailler plusieurs personnes sur un même document spatial et de conserver la trace de leur démarche**.

À terme, Trifoglio pourrait ainsi devenir un **laboratoire collaboratif de cartographie et d’annotation historique**, particulièrement adapté à l’enseignement, à la recherche et aux projets collectifs.
/////////////////////////////

## Collaboration et groupes — Trifoglio Pro

Trifoglio évoluera d’un outil individuel d’annotation IIIF vers un **espace collaboratif de travail sur les cartes et les images**.

### Concept

Les utilisateurs Pro pourront créer des **groupes de travail** autour d’une carte ou d’une image IIIF. Plusieurs personnes pourront alors annoter simultanément le même document spatial, partager leurs observations et construire collectivement un corpus d’annotations.

L’image ou la carte IIIF constitue le **référentiel spatial commun** du groupe.

### Usages pédagogiques prioritaires

La collaboration sera d’abord conçue pour les **cours universitaires, les séminaires et les ateliers pratiques**.

Cas d’usage prioritaires :

- **Travail en équipe** : plusieurs personnes étudiantes annotent collectivement une même carte ou image.
- **Analyse comparative** : différents groupes travaillent sur le même document et leurs annotations sont ensuite comparées.
- **Répartition des tâches** : chaque personne ou sous-groupe reçoit une catégorie d’éléments à identifier — lieux, routes, frontières, bâtiments, végétation, personnages, etc.
- **Lecture critique des cartes** : les personnes étudiantes identifient les choix, omissions, classifications et représentations présentes dans une carte.
- **Exercice de cartographie historique** : repérage et annotation de territoires, itinéraires, frontières ou transformations spatiales.
- **Travail dirigé en classe** : l’enseignante ou l’enseignant projette une même image et suit les annotations produites par les personnes étudiantes.
- **Évaluation de la démarche** : l’historique des annotations permet de documenter la progression du travail plutôt que de conserver uniquement le résultat final.
- **Discussion autour des annotations** : les personnes étudiantes peuvent commenter, questionner ou proposer des modifications aux annotations des autres.
- **Validation par l’enseignante ou l’enseignant** : les annotations peuvent être révisées, commentées et validées avant leur intégration au résultat final.
- **Production collective** : le groupe produit finalement un corpus d’annotations exportable et réutilisable dans un travail, une exposition ou un projet de recherche.

### Exemple pédagogique

Une personne enseignante fournit une carte historique IIIF à un groupe de 5 personnes étudiantes.

```text id="71942"
Carte historique
       │
       ▼
Groupe de travail
       │
 ┌─────┼─────┬─────┬─────┐
 │     │     │     │     │
Routes Lieux Frontières Ressources Commentaires
 │     │     │     │     │
 └─────┴─────┴─────┴─────┘
              │
              ▼
       Corpus collectif
              │
              ▼
       Validation / discussion
              │
              ▼
        Export / remise
```

L’enseignante ou l’enseignant peut ensuite consulter **qui a produit quelle annotation, quand et à partir de quelles modifications**.

Cette traçabilité est particulièrement importante pour les activités pédagogiques fondées sur la démarche historienne : Trifoglio conserve non seulement le résultat, mais également une partie du **processus d’observation, d’interprétation et de discussion**.

### Fonctionnalités envisagées

- création de projets et de groupes de travail ;
- invitation de personnes participantes ;
- rôles et permissions : propriétaire, éditeur, contributeur, lecture seule ;
- annotations partagées : points, lignes, polygones, textes et images ;
- couleurs par personne, catégorie ou type d’annotation ;
- commentaires associés aux annotations ;
- historique et versionnement des modifications ;
- validation ou révision des annotations ;
- visualisation des contributions de chaque personne ;
- export des résultats en GeoJSON, Web Annotation et JSON Trifoglio.

### Distinction projet / groupe

Un **projet** correspond au contenu et aux documents étudiés.

Un **groupe** correspond aux personnes autorisées à travailler sur ces documents.

Un même projet pourra donc accueillir plusieurs groupes, et un groupe pourra travailler sur plusieurs cartes ou images.

### Architecture

Cette évolution s’intègre à une architecture fondée sur :

- **Cognito** pour l’authentification ;
- **PostgreSQL/PostGIS** pour les utilisateurs, projets, groupes et annotations ;
- **IIIF** comme infrastructure de diffusion des images ;
- un système d’événements et de versionnement permettant éventuellement la **synchronisation en temps réel** des annotations.

Le modèle d’annotation doit être conçu dès le départ pour permettre plusieurs auteurs, les modifications concurrentes, l’historique et la validation.

### Positionnement de Trifoglio Pro

La collaboration constitue un axe majeur de la version Pro. La valeur ajoutée ne repose plus uniquement sur des fonctionnalités supplémentaires, mais sur la possibilité de **faire travailler plusieurs personnes sur un même document spatial et de conserver la trace de leur démarche**.

Le premier marché cible de cette fonctionnalité est l’**enseignement supérieur**, où Trifoglio peut servir à organiser des exercices d’analyse collective, des travaux pratiques, des séminaires et des évaluations fondées sur la démarche.

À terme, Trifoglio pourrait ainsi devenir un **laboratoire collaboratif de cartographie et d’annotation historique**, adapté à l’enseignement, à la recherche et aux projets collectifs.
/////////////////////////////////////

## Usages pédagogiques prioritaires

Les fonctionnalités collaboratives de Trifoglio Pro seront développées en priorité pour les usages pédagogiques suivants.

### 1. Annotation collective d’une même carte ou image

**Priorité : très élevée**

Plusieurs personnes étudiantes travaillent simultanément sur le même document IIIF et produisent un corpus commun d’annotations.

**Objectif pédagogique :** apprendre à observer, localiser, décrire et interpréter collectivement une source visuelle.

C’est le **cas d’usage fondamental** de la collaboration dans Trifoglio.

---

### 2. Travail en équipes avec répartition des tâches

**Priorité : très élevée**

Une même carte est distribuée entre plusieurs personnes ou sous-groupes, chacun étant responsable d’un type d’élément :

- frontières ;
- routes et itinéraires ;
- lieux ;
- bâtiments ;
- ressources ;
- éléments naturels ;
- toponymes ;
- zones d’incertitude.

**Objectif pédagogique :** développer une méthode d’analyse structurée et produire collectivement un corpus cohérent.

---

### 3. Comparaison des interprétations

**Priorité : élevée**

Plusieurs groupes travaillent sur **la même source**, mais leurs annotations restent séparées.

L’enseignante ou l’enseignant peut ensuite afficher les différents corpus et faire comparer les interprétations.

**Objectif pédagogique :** montrer qu’une source cartographique ou visuelle peut faire l’objet de lectures différentes et amener les personnes étudiantes à justifier leurs choix.

---

### 4. Discussion et révision des annotations

**Priorité : élevée**

Une annotation devient un objet de discussion :

```text
Annotation
   │
   ├── proposition
   ├── commentaire
   ├── contre-interprétation
   └── validation / révision
```

**Objectif pédagogique :** faire passer les personnes étudiantes de la simple identification à l’argumentation et à la confrontation des interprétations.

---

### 5. Suivi de la démarche historienne

**Priorité : élevée**

Trifoglio conserve l’auteur, les modifications et l’historique des annotations.

L’évaluation peut donc porter sur **la démarche**, et non uniquement sur le produit final.

**Objectif pédagogique :** rendre visible le processus d’observation, de recherche, d’interprétation, de correction et de validation.

---

### 6. Activité dirigée en classe

**Priorité : moyenne**

L’enseignante ou l’enseignant utilise Trifoglio en temps réel :

1. affiche une source ;
2. demande une observation ;
3. les personnes étudiantes proposent des annotations ;
4. les annotations apparaissent collectivement ;
5. la classe discute les interprétations.

**Objectif pédagogique :** transformer une analyse individuelle en discussion collective autour d’une source primaire.

---

### 7. Production d’un corpus réutilisable

**Priorité : moyenne**

Le travail réalisé dans le cadre du cours peut être exporté et réutilisé pour :

- un travail écrit ;
- une exposition numérique ;
- une présentation ;
- une autre activité pédagogique ;
- un projet de recherche.

**Objectif pédagogique :** faire comprendre que l’annotation constitue une production documentaire et non une activité jetable.

---

## Priorités de développement

Pour le développement de Trifoglio Pro, je concentrerais le premier cycle sur **trois fonctions pédagogiques** :

```text
1. ANNOTER ENSEMBLE
        ↓
2. DISCUTER / COMPARER
        ↓
3. CONSERVER LA DÉMARCHE
```

Cela implique que la première version collaborative devrait privilégier :

- groupes ;
- membres et permissions simples ;
- annotations partagées ;
- attribution des annotations à une personne ;
- commentaires ;
- historique minimal ;
- possibilité de séparer les travaux de plusieurs groupes sur une même image ;
- export du corpus final.

Les fonctions plus complexes — synchronisation en temps réel avancée, validation élaborée, statistiques pédagogiques, etc. — peuvent venir ensuite.

**Principe directeur :** Trifoglio ne doit pas seulement permettre à plusieurs personnes d’annoter une image ; il doit permettre à une enseignante ou un enseignant de **faire de l’annotation un objet d’apprentissage, de discussion et d’évaluation**.
//////////////////////////////////////

## Critères de hiérarchisation des usages pédagogiques

Les usages pédagogiques sont hiérarchisés selon cinq critères, chacun pouvant être évalué de 1 à 5.

| Critère                        | Question                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| **Valeur pédagogique**         | L’usage permet-il de développer une compétence importante ?                         |
| **Spécificité de Trifoglio**   | L’usage exploite-t-il particulièrement bien l’annotation IIIF et l’espace spatial ? |
| **Fréquence d’utilisation**    | Peut-il être utilisé régulièrement dans différents cours ?                          |
| **Simplicité pédagogique**     | Est-il facile à expliquer et à intégrer dans une activité de cours ?                |
| **Potentiel de développement** | L’usage peut-il servir de base à d’autres fonctionnalités de Trifoglio ?            |

### 1. Valeur pédagogique — critère principal

Le premier critère est la capacité de l’activité à développer une compétence identifiable : observation, analyse de source, interprétation spatiale, argumentation, collaboration ou démarche historienne.

Un usage techniquement intéressant mais pédagogiquement faible ne doit pas être prioritaire.

### 2. Spécificité de Trifoglio

La priorité augmente lorsque l’activité dépend directement des caractéristiques de Trifoglio :

- image IIIF ;
- espace de coordonnées ;
- annotation spatiale ;
- superposition de plusieurs interprétations ;
- collaboration autour d’une même source.

L’objectif est d’éviter de développer des fonctionnalités que d’autres outils généralistes permettent déjà de réaliser aussi bien.

### 3. Fréquence et transférabilité

Une fonctionnalité utilisée dans un seul type de cours est moins prioritaire qu'une fonctionnalité utilisable dans :

- histoire ;
- géographie ;
- histoire de l’art ;
- archéologie ;
- études environnementales ;
- patrimoine ;
- autres disciplines utilisant des documents visuels ou cartographiques.

### 4. Simplicité d’intégration

Une activité doit pouvoir être mise en place rapidement par une personne enseignante.

La priorité est donc plus élevée lorsque le scénario peut être résumé simplement :

> **Je fournis une image → je crée un groupe → les personnes étudiantes annotent → nous discutons → j’évalue le résultat.**

### 5. Potentiel comme fondation technique

Certaines fonctionnalités ont une valeur supérieure parce qu’elles permettent d’en construire d’autres.

Par exemple, **les groupes et les permissions** constituent une infrastructure pour :

- le travail en équipe ;
- la comparaison de groupes ;
- la validation ;
- l’évaluation ;
- l'historique ;
- les projets de recherche collaboratifs.

Elles peuvent donc être prioritaires même si leur usage pédagogique immédiat est relativement simple.

## Principe de décision

La hiérarchisation doit privilégier les fonctionnalités qui combinent :

**forte valeur pédagogique + forte spécificité de Trifoglio + utilisation fréquente + simplicité d’usage + potentiel d’extension.**

La difficulté technique ne constitue pas en elle-même un critère de priorité pédagogique. Elle intervient ensuite dans la décision de développement et dans la planification des versions.
//////////////////////////////

# Trifoglio Pro — Collaboration et usages pédagogiques

## Vision

Trifoglio doit évoluer d’un outil individuel d’annotation IIIF vers un **espace collaboratif de travail sur les cartes et les images**.

Les utilisateurs Pro pourront créer des **projets et des groupes de travail** autour d’une ou plusieurs ressources IIIF. Plusieurs personnes pourront annoter une même image, discuter leurs interprétations et construire collectivement un corpus d’annotations.

L’image ou la carte IIIF constitue le **référentiel spatial commun** du groupe.

## Modèle projet / groupe

Un **projet** correspond au contenu et aux documents étudiés.

Un **groupe** correspond aux personnes autorisées à travailler sur ces documents.

Un projet peut donc contenir plusieurs groupes, et un groupe peut travailler sur plusieurs cartes ou images.

```text
Projet
│
├── Carte / Image 1
│   ├── Groupe A
│   └── Groupe B
│
├── Carte / Image 2
│   └── Groupe A
│
└── Image 3
    └── Groupe C
```

## Usages pédagogiques prioritaires

### 1. Annotation collective — très élevée

Plusieurs personnes étudiantes annotent simultanément la même carte ou image.

**Compétences :** observation, localisation, description, interprétation et collaboration.

C’est le **cas d’usage fondamental** de la collaboration dans Trifoglio.

### 2. Travail en équipes — très élevée

Les personnes ou sous-groupes se répartissent l’analyse : frontières, routes, lieux, bâtiments, ressources, éléments naturels, toponymes, zones d’incertitude, etc.

**Compétence :** construire collectivement une analyse structurée.

### 3. Comparaison des interprétations — élevée

Plusieurs groupes travaillent sur la même source avec des corpus d’annotations distincts, qui peuvent ensuite être comparés.

**Compétence :** confronter et justifier différentes interprétations d’une même source.

### 4. Discussion et révision — élevée

Les annotations deviennent des objets de discussion :

```text
proposition → commentaire → contre-interprétation → révision → validation
```

**Compétence :** passer de l’identification à l’argumentation.

### 5. Suivi de la démarche historienne — élevée

Trifoglio conserve l’auteur, les modifications et l’historique des annotations.

**Compétence :** rendre visible le processus d’observation, de recherche, d’interprétation et de correction.

### 6. Activité dirigée en classe — moyenne

Une source est affichée, les personnes étudiantes proposent des annotations en direct, puis la classe discute collectivement les résultats.

### 7. Corpus réutilisable — moyenne

Les annotations peuvent être exportées et réutilisées dans un travail, une exposition numérique, une présentation ou un projet de recherche.

## Critères de hiérarchisation

Les usages sont évalués selon cinq critères :

1. **Valeur pédagogique** — quelle compétence l’activité développe-t-elle ?
2. **Spécificité de Trifoglio** — exploite-t-elle réellement IIIF, l’espace et l’annotation ?
3. **Fréquence et transférabilité** — peut-elle être utilisée régulièrement et dans plusieurs disciplines ?
4. **Simplicité d’intégration** — une personne enseignante peut-elle facilement l’intégrer à un cours ?
5. **Potentiel de développement** — constitue-t-elle une base pour d’autres fonctionnalités ?

La priorité revient aux fonctionnalités combinant **forte valeur pédagogique, forte spécificité de Trifoglio, utilisation fréquente, simplicité d’usage et potentiel d’extension**.

La difficulté technique est évaluée séparément : elle influence la planification du développement, mais ne détermine pas la valeur pédagogique.

## Priorités de développement

Le premier cycle collaboratif doit se concentrer sur trois fonctions :

```text
ANNOTER ENSEMBLE
       ↓
DISCUTER / COMPARER
       ↓
CONSERVER LA DÉMARCHE
```

### Version initiale

- création de groupes ;
- membres et permissions simples ;
- annotations partagées ;
- attribution des annotations à chaque personne ;
- commentaires ;
- historique minimal ;
- séparation des travaux de plusieurs groupes sur une même image ;
- export du corpus final.

### Évolutions

- synchronisation en temps réel avancée ;
- validation et workflow de révision ;
- statistiques pédagogiques ;
- outils d’évaluation ;
- gestion avancée des projets et des cohortes.

## Architecture envisagée

La collaboration s’intègre à l’architecture existante :

```text
IIIF
 │
 ▼
Images / Cartes
 │
 ▼
Trifoglio
 │
 ├── Projets
 │    └── Groupes
 │         └── Membres / Permissions
 │
 └── Annotations
      ├── Auteur
      ├── Géométrie
      ├── Commentaires
      ├── Versions
      └── Validation
             │
             ▼
       PostgreSQL / PostGIS
```

**Cognito** pourra gérer l’authentification et PostgreSQL/PostGIS les utilisateurs, projets, groupes et annotations.

Le modèle d’annotation doit être conçu dès le départ pour supporter **plusieurs auteurs, les modifications concurrentes, l’historique et la validation**.

## Positionnement de Trifoglio Pro

La collaboration constitue un axe majeur de Trifoglio Pro. La valeur ajoutée n’est pas simplement de permettre à plusieurs personnes d’annoter une image, mais de transformer l’annotation en **objet d’apprentissage, de discussion, de collaboration et d’évaluation**.

Le premier marché cible est l’**enseignement supérieur**, avec un potentiel d’extension vers la recherche collaborative, le patrimoine et les projets institutionnels.

À terme, Trifoglio peut devenir un **laboratoire collaboratif de cartographie et d’annotation IIIF**.
//////////////////////////////////
