//tristan landry
// 2021-04-20
// Initialize the Leaflet.draw plugin and load saved layers
let drawnLayers;

//make sure that the variable is defined
let manifestUrl;

const map = L.map('map', {
  center: [0,0],
  crs: L.CRS.Simple,
  zoom: 0
});

 // Define the drawndatas variable as a Leaflet FeatureGroup
 const drawndatas = new L.FeatureGroup();

 // Add the drawndatas to the map
 drawndatas.addTo(map);
 

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

// Get a reference to the button element
const manifestButton = document.getElementById("ask-button");

function resetAndLoadManifest(manifestUrl) {
  iiifLayers = {};
  loadIIIFManifest(manifestUrl);
}

// Add a click event listener to the button
manifestButton.addEventListener("click", function () {
  // Call the function to ask for the Manifest URL when the button is clicked
  const manifestUrl = askForManifestUrl();

  // Check if the user entered a valid URL
  if (manifestUrl !== null) {
    // Now you have the user-specified URL stored in the manifestUrl variable.
    resetAndLoadManifest(manifestUrl);
  }
});

// Call the function to load the IIIF manifest with the user-specified URL

function loadIIIFManifest(manifestUrl) {

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
}
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

///////////////////////
//DRAG AND DROP ///////
///////////////////////

// Function to handle the file drop
function handleFileDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const jsonContent = JSON.parse(e.target.result);
      // Do something with the JSON content, e.g., add it to the map
      L.geoJSON(jsonContent).addTo(map);
    } catch (error) {
      console.error("Error parsing JSON file:", error);
    }
  };

  reader.readAsText(file);
}

// Add event listeners to the entire window
window.addEventListener('dragover', (event) => event.preventDefault());
window.addEventListener('drop', handleFileDrop);

///////////////////////
//GESTION DES POP-UPS//
///////////////////////

// Fonction pour générer la liste à partir des données de data.js
function generateListFromData(data) {
  let listHtml = '<ul>';
  data.forEach((data) => {
    listHtml += `<li>${data.titre} - ${data.cartographe} (${year})</li>`;
  });
  listHtml += '</ul>';
  return listHtml;
}

const infoBox = document.getElementById("infoBox");
const infoContent = document.getElementById("infoContent");
const infoButton = document.getElementById("info-button");
const askButton = document.getElementById("ask-button");
const addButton = document.getElementById("add-button");
const favsButton = document.getElementById("favs-button");
//const randomButton = document.getElementById("random-button");



function openInfoBox(content) {
  infoContent.innerHTML = content;
  infoBox.style.display = "block";
}

function closeInfoBox() {
  infoBox.style.display = "none";
}

// Function to check if the click event is inside the info-box
function isClickInsideInfoBox(event) {
  return event.target === infoBox || infoBox.contains(event.target);
}

// Add a click event listener to the document
document.addEventListener("click", function (event) {
  // Check if the clicked element is inside the info box or the info button
  if (!isClickInsideInfoBox(event) && event.target !== infoButton && event.target !== addButton) {
    closeInfoBox(); // Close the info box if clicked outside
  }
});

// ☘ button 
infoButton.addEventListener("click", function (event) {
  event.stopPropagation(); // Stop the click event from propagating to the map
  const content = `
    <img src="clover_300.png" class="icon" alt="Un trèfle">
    <h2>Trifoglio</h2>
    <p>Cette application permet aux utilisateurs de charger des couches de carte à partir de services IIIF (International Image Interoperability Framework) en utilisant des URL de manifeste IIIF. Les utilisateurs peuvent également dessiner et sauvegarder des formes géométriques (polygones, lignes, marqueurs) sur la carte. Les dessins sont sauvegardés localement dans le navigateur à l'aide du stockage local, mais ils peuvent aussi être téléchargés en format json. L'application utilise <a href="https://leafletjs.com/" target="_blank">Leaflet</a>, <a href="https://github.com/mejackreed/Leaflet-IIIF" target="_blank">Leaflet-iiif</a>, <a href="https://github.com/Leaflet/Leaflet.draw" target="_blank">Leaflet.draw</a> et <a href="https://github.com/mlevans/leaflet-hash" target="_blank">Leaflet-hash.draw</a></br></br>Conception: <a href="https://www.usherbrooke.ca/histoire/departement/personnel/personnel-enseignant/tristan-landry" target="_blank">Tristan Landry</a> </p>
  `;
  openInfoBox(content);
});


// ➕ Add click event listeners to the buttons
addButton.addEventListener("click", function (event) {
  event.stopPropagation(); // Stop the click event from propagating to the map
  const content = `
    <img src="clover_300.png" class="icon" alt="Un trèfle">
    <h2>Trifoglio</h2>
    <p>Pour ajouter une couche json, simplement la glisser-déposer dans la fenêtre.</p>
  `;
  openInfoBox(content);
});

// 💛 button

function resetAndLoadManifest (manifestUrl) {	
  // Check if the firstLayer exists and if it is added to the map
  // Get the first layer from the iiifLayers object
  const firstLayer = iiifLayers[Object.keys(iiifLayers)[0]];

  if (firstLayer && map.hasLayer(firstLayer)) {
    // Remove the firstLayer from the map
    map.removeLayer(firstLayer);
    iiifLayers = {};
    loadIIIFManifest(manifestUrl);
  }
  }

 
// Function to check if the click event is inside the info-box
function isClickInsideInfoBox(event) {
  return event.target === infoBox || infoBox.contains(event.target);
}
