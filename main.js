//let drawnLayers = new L.FeatureGroup(); // Define drawnLayers outside the script block. Otherwise, it won't be accessible in the global scope. This is required for the Leaflet.draw plugin to work properly.

let drawnLayers;
//usual Leaflet stuff. Notez le CRS pour la carte iiif.


const map = L.map('map', {
  center: [0,0],
  crs: L.CRS.Simple,
  zoom: 0
});


// Function to set the start view of the map
function setStartview() {
  map.setView([-84, 53.25], 5);
}

// Event listener for the IIIF layer's 'load' event
// This will be triggered when the IIIF layer is fully loaded
map.on('load', () => {
  setStartview(); // Set the start view of the map
});

drawSomething(); // Initialize the Leaflet.draw plugin
// Load saved layers from local storage
loadFromLocalStorage();

////////////////
//LEAFLET iiif//
////////////////

var iiifLayers = {};
//pour monter les tuiles iiif

  
//Fond de carte
var manifestUrl = "https://gallica.bnf.fr/iiif/ark:/12148/btv1b531025148/f1/manifest.json";

// Grab a IIIF manifest
$.getJSON(manifestUrl)
.done(function(data) {
  // For each image create a L.TileLayer.Iiif object and add that to an object literal for the layer control
  $.each(data.sequences[0].canvases, function(_, val) {
    iiifLayers[val.label] = L.tileLayer.iiif(val.images[0].resource.service['@id'] + '/info.json');
  });

  // Access the first Iiif object and add it to the map
  iiifLayers[Object.keys(iiifLayers)[0]].addTo(map);
})
.fail(function() {
  console.error("Failed to load IIIF manifest.");
});

setTimeout(setStartview, 1000); // Set the start view of the map after 1 second 
  
////////////////
//  LEAFLET HASH(ISH)//
////////////////

//Ajouter hash (Leaflet-hash lets you to add dynamic URL hashes to web pages with Leaflet maps.) Pratique pour les coords de la carte iiif
var hash = new L.Hash(map);

////////////////
//LEAFLET DRAW//
////////////////
// Call the drawSomething function from main.js
// drawSomething();


//en complement a draw.js
var drawingGeoJson = L.geoJSON(drawing, {color: 'red', opacity: 0.5});

//drawingGeoJson.addTo(map);

