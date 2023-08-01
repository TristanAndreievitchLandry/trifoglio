// Créer un constructeur JSON
function AppData(manifesturl, cartographe, titre, continent, year, repo) {
    this.manifesturl = manifesturl;
    this.cartographe = cartographe;
    this.titre = titre;
    this.continent = continent;
    this.year = year;
    this.repo = repo;
  }
  
  var appDataArray = [
    new AppData(
      "https://gallica.bnf.fr/iiif/ark:/12148/btv1b531025148/f1/manifest.json",
      "Pierre Lapie",
      "Carte de la Perse, de la Turquie d'Asie et d'une partie de la Tartarie Indépendante",
      "Europe",
      "1810",
      "BNF"
    ),
  
    new AppData(
      "https://www.loc.gov/item/95684855/manifest.json",
      "Reichsbahnzentrale fur den Deutschen Reiseverkehr",
      "Germany, the beautiful travel country",
      "Europe",
      "1836",
      "David Rumsey"
    ),
  
    new AppData(
      "https://www.loc.gov/item/95684855/manifest.json",
      "",
      "Bird's eye view of Sherbrooke, P.Q.",
      "Europe",
      "1881",
      "LOC"
    )
  ];
  

