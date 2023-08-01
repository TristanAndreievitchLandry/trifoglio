// Créer un constructeur JSON
function AppData(manifesturl, cartographe, titre, continent, year, repo) {
    this.manifesturl = manifesturl;
    this.cartographe = cartographe;
    this.titre = titre;
    this.continent = continent;
    this.year = year;
    this.repo = repo;
  }
  
  // Créer une instance de l'objet avec les valeurs souhaitées
  var appData = new AppData(
    "https://gallica.bnf.fr/iiif/ark:/12148/btv1b531025148/f1/manifest.json",
    "Pierre Lapie",
    "Carte de la Perse, de la Turquie d'Asie et d'une partie de la Tartarie Indépendante",
    "Europe",
    1810,
    "BNF"
  );
  
  var appData2 = new AppData(
    "https://www.loc.gov/item/95684855/manifest.json",
    "",
    "Bird's eye view of Sherbrooke, P.Q.",
    "Amérique du Nord",
    1881,
    "LOC"
  );

  var appData3 = new AppData(
    "https://www.loc.gov/item/95684855/manifest.json",
    "Reichsbahnzentrale fur den Deutschen Reiseverkehr",
    "Germany, the beautiful travel country",
    "Europe",
    1836,
    "David Rumsey"
  );

  var appData4 = new AppData(
    "https://www.loc.gov/item/95684855/manifest.json",
    "",
    "Bird's eye view of Sherbrooke, P.Q.",
    "Europe",
    1881,
    "LOC"
  );

  // Accéder aux propriétés de l'objet
  console.log(appData.manifesturl); // Affiche : "https://exemple.com/manifest.json"
  console.log(appData.cartographe); // Affiche : "Nom du cartographe"
  console.log(appData.continent);   // Affiche : "Continent"
  console.log(appData.année);       // Affiche : 2023
  console.log(appData.repo);        // Affiche : "https://github.com/votre-nom-utilisateur/votre-repo"
  