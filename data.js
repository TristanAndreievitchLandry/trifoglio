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
    'https://gallica.bnf.fr/iiif/ark:/12148/btv1b531025148/f1/manifest.json',
    'data.cartographers.pierreLapie',
    'data.titles.persiaMap',
    'data.continents.europe',
    '1810',
    'data.sources.bnf',
  ),

  new AppData(
    'https://www.davidrumsey.com/luna/servlet/iiif/m/RUMSEY~8~1~293032~90065344/manifest',
    'data.cartographers.reichsbahnzentrale',
    'data.titles.germanyTravel',
    'data.continents.europe',
    '1836',
    'data.sources.davidRumsey',
  ),

  new AppData(
    'https://www.loc.gov/item/95684855/manifest.json',
    '',
    'data.titles.sherbrooke',
    'data.continents.europe',
    '1881',
    'data.sources.loc',
  ),
];
