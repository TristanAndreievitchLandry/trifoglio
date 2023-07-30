//tristan landry

// Initialize the Leaflet.draw plugin and load saved layers
let drawnLayers;

const map = L.map('map', {
  center: [0,0],
  crs: L.CRS.Simple,
  zoom: 0
});


// Function to set the start view of the map
function setStartview() {
  map.setView([-50, 50], 1);
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

// Function to ask the user for the Manifest URL using a prompt
function askForManifestUrl() {
  const manifestUrl = prompt('Entrez le manifeste URL (ex.: https://gallica.bnf.fr/iiif/ark:/12148/btv1b531025148/f1/manifest.json):');
  if (manifestUrl === null) {
    // User clicked "Cancel" on the prompt
    return null; // Return null to indicate that the prompt was canceled
  }

  // Check if the URL is valid using a regular expression
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/.*)?$/;
  if (!urlRegex.test(manifestUrl)) {
    alert('Ce manifeste est invalide.💩Essayez de nouveau.');
    return askForManifestUrl(); // Ask again if the user input is invalid
  }

  return manifestUrl; // Return the valid URL
}

// Call the function to ask for the Manifest URL when the app starts
const manifestUrl = askForManifestUrl();
// Now you have the user-specified URL stored in the manifestUrl variable.

// Function to load the IIIF manifest using the provided URL
function loadIIIFManifest(manifestUrl) {
  // Your code to load the IIIF manifest goes here
}

// Call the function to load the IIIF manifest with the user-specified URL
loadIIIFManifest(manifestUrl);

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

////////////////
//LEAFLET HASH//
////////////////

//Ajouter hash (Leaflet-hash lets you to add dynamic URL hashes to web pages with Leaflet maps.) Pratique pour les coords de la carte iiif
var hash = new L.Hash(map);

////////////////
//LEAFLET DRAW//
////////////////

//en complement a draw.js

 // Load saved layers from local storage when the page loads
 loadFromLocalStorage();

 ///////////////////////
 //afficher les coords//
  ///////////////////////

 var div = document.createElement ('div');
  div.id = 'coordsDiv';
  div.style.position = 'absolute';
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.backgroundColor = 'white';
  div.style.zIndex = '999';
  document.getElementById('map').appendChild(div);

  map.on('mousemove', function(e) {
    var lat = e.latlng.lat.toFixed(5);
    var lon = e.latlng.lng.toFixed(5);

    document.getElementById('coordsDiv').innerHTML = lat + ', ' + lon;
  });

  ///////////////////////info box////////////////////////

// Get references to the info box and button elements
const infoBox = document.getElementById("infoBox");
const infoButton = document.getElementById("info-button");

// Add a click event listener to the button
infoButton.addEventListener("click", function () {
//   // Toggle the display of the info box
if (infoBox.style.display === "block") {
//     infoBox.style.display = "none"; // Hide the info box if it's already open
   } else {
     infoBox.style.display = "block"; // Show the info box if it's currently hidden
   }
 });

 // Add a click event listener to the document
document.addEventListener("click", function (event) {
  // Check if the clicked element is inside the info box or the info button
  if (!infoBox.contains(event.target) && event.target !== infoButton) {
    infoBox.style.display = "none"; // Close the info box if clicked outside
  }
});

