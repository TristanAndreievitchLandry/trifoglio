// Remove the global declaration of drawnLayers
let manifestUrl;

const map = L.map('map', {
  center: [0, 0],
  crs: L.CRS.Simple,
  zoom: 0,
});

let debugLogItems = [];

function debugLog(message, details) {
  const time = new Date().toLocaleTimeString();
  const suffix = details ? ' | ' + details : '';
  const line = '[' + time + '] ' + message + suffix;

  debugLogItems.unshift(line);
  debugLogItems = debugLogItems.slice(0, 8);

  const debugContent = document.getElementById('debugContent');
  if (debugContent) {
    debugContent.textContent = debugLogItems.join('\n');
  }

  console.log('[Trifoglio Debug]', message, details || '');
}

function initDebugPanel() {
  const panel = document.createElement('div');
  panel.id = 'debugPanel';
  panel.style.position = 'absolute';
  panel.style.right = '8px';
  panel.style.bottom = '8px';
  panel.style.zIndex = '1000';
  panel.style.backgroundColor = 'rgba(255,255,255,0.95)';
  panel.style.border = '1px solid #666';
  panel.style.padding = '6px';
  panel.style.width = '340px';
  panel.style.maxWidth = 'calc(100% - 16px)';
  panel.style.fontFamily = 'monospace';
  panel.style.fontSize = '11px';
  panel.style.lineHeight = '1.35';
  panel.style.whiteSpace = 'pre-wrap';

  const title = document.createElement('div');
  title.textContent = 'Debug IIIF';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '4px';

  const content = document.createElement('div');
  content.id = 'debugContent';
  content.textContent = 'En attente...';

  panel.appendChild(title);
  panel.appendChild(content);
  document.getElementById('map').appendChild(panel);

  debugLog('App initialized');
}

const JSON_PROXY_BASE_URL = 'https://api.allorigins.win/raw?url=';

function buildProxyUrl(url) {
  return JSON_PROXY_BASE_URL + encodeURIComponent(url);
}

function fetchJsonWithProxyFallback(url) {
  const deferred = $.Deferred();

  $.getJSON(url)
    .done(function (data) {
      deferred.resolve(data, false);
    })
    .fail(function () {
      const proxyUrl = buildProxyUrl(url);
      debugLog('Direct JSON blocked, retry proxy', url);

      $.getJSON(proxyUrl)
        .done(function (data) {
          deferred.resolve(data, true);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          deferred.reject(jqXHR, textStatus, errorThrown);
        });
    });

  return deferred.promise();
}
////////////////
//LEAFLET DRAW//
////////////////

let drawnLayers;

if (!drawnLayers) {
  drawnLayers = new L.FeatureGroup();
}

// Initialize the Leaflet.draw plugin and load saved layers
function drawSomething() {
  if (drawnLayers) {
    drawnLayers = new L.FeatureGroup();
    map.removeLayer(drawnLayers); // Remove the existing drawnLayers from the map
  }

  map.addLayer(drawnLayers); // Add the drawnLayers to the map if it doesn't exist

  const drawControl = new L.Control.Draw({
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: true,
      circlemarker: true,
      marker: true,
    },
    edit: {
      featureGroup: drawnLayers,
    },
  }).addTo(map);

  map.on('draw:created', (e) => {
    const layer = e.layer;
    drawnLayers.addLayer(layer);
    saveToLocalStorage(layer.toGeoJSON());
  });
}

function removeAllDrawnPolygons() {
  drawnLayers.clearLayers();
  // Clear the loaded GeoJSON layer, if any
  if (loadedGeoJSONLayer) {
    map.removeLayer(loadedGeoJSONLayer);
  }

  localStorage.removeItem('drawnLayers');
}

function saveToLocalStorage() {
  const savedLayers = drawnLayers.toGeoJSON();
  localStorage.setItem('drawnLayers', JSON.stringify(savedLayers));
}

// Function to load saved layers from local storage and recreate drawn layers
function loadFromLocalStorage() {
  const savedLayers = localStorage.getItem('drawnLayers');
  if (savedLayers) {
    const layersData = JSON.parse(savedLayers);
    L.geoJSON(layersData).addTo(drawnLayers);
  }
}

// Download drawn layers as a JSON file
async function downloadDrawnLayers() {
  const savedLayers = drawnLayers.toGeoJSON(); // Convert the drawnItems FeatureGroup to GeoJSON
  if (!savedLayers || savedLayers.features.length === 0) {
    alert("Dessinez d'abord quelque chose!");
    return;
  }

  const jsonData = JSON.stringify(savedLayers, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const fileName = 'mon_dessin.json';
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;

  const confirmation = confirm('Enregistrer le fichier ?');
  if (confirmation) {
    a.click();
  }
}

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

initDebugPanel();

drawSomething(); // Initialize the Leaflet.draw plugin
// Load saved layers from local storage
loadFromLocalStorage();

////////////////
//LEAFLET iiif//
////////////////

// Call the function to load the IIIF manifest with the user-specified URL

function loadIIIFManifest(manifestUrl) {
  debugLog('Loading manifest', manifestUrl);

  function asArray(value) {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }

  function firstItem(value) {
    const list = asArray(value);
    return list.length > 0 ? list[0] : null;
  }

  function getLabel(label, index) {
    if (!label) {
      return 'Canvas ' + (index + 1);
    }
    if (typeof label === 'string') {
      return label;
    }
    if (label.none && label.none[0]) {
      return label.none[0];
    }

    const firstLang = Object.keys(label)[0];
    if (firstLang && Array.isArray(label[firstLang]) && label[firstLang][0]) {
      return label[firstLang][0];
    }

    return 'Canvas ' + (index + 1);
  }

  function getServiceId(service) {
    const firstService = firstItem(service);
    if (!firstService) {
      return null;
    }
    return firstService.id || firstService['@id'] || null;
  }

  function getImageServiceIdFromCanvas(canvas) {
    if (!canvas) {
      return null;
    }

    // IIIF Presentation 2: canvas.images[].resource.service
    const p2Image = firstItem(canvas.images);
    if (p2Image && p2Image.resource) {
      const p2ServiceId = getServiceId(p2Image.resource.service);
      if (p2ServiceId) {
        return p2ServiceId;
      }
    }

    // IIIF Presentation 3: canvas.items[].items[].body.service
    const annotationPages = asArray(canvas.items);
    for (const page of annotationPages) {
      const annotations = asArray(page.items);
      for (const annotation of annotations) {
        const bodies = asArray(annotation.body);
        for (const body of bodies) {
          const p3ServiceId = getServiceId(body.service);
          if (p3ServiceId) {
            return p3ServiceId;
          }
        }
      }
    }

    return null;
  }

  function getCanvasesFromManifest(data) {
    if (!data || typeof data !== 'object') {
      return [];
    }

    const root = Array.isArray(data) ? data[0] : data;
    if (!root || typeof root !== 'object') {
      return [];
    }

    if (Array.isArray(root.items)) {
      return root.items;
    }

    const firstSequence = firstItem(root.sequences);
    if (firstSequence && Array.isArray(firstSequence.canvases)) {
      return firstSequence.canvases;
    }

    return [];
  }

  fetchJsonWithProxyFallback(manifestUrl)
    .done(function (data, usedProxy) {
      debugLog('Manifest fetched', usedProxy ? 'via proxy' : 'ok');

      // Reset previous layers each time a new manifest is loaded.
      iiifLayers = {};

      // IIIF Presentation 2 uses sequences[0].canvases; Presentation 3 uses items.
      const canvases = getCanvasesFromManifest(data);

      $.each(canvases, function (index, canvas) {
        const serviceId = getImageServiceIdFromCanvas(canvas);
        if (!serviceId) {
          debugLog('Canvas skipped', 'no image service at index ' + index);
          return;
        }

        const label = getLabel(canvas.label, index);
        const infoUrl = serviceId.replace(/\/$/, '') + '/info.json';
        iiifLayers[label] = L.tileLayer.iiif(infoUrl, {
          iiifBaseUrl: serviceId.replace(/\/$/, '') + '/',
          jsonProxyBase: JSON_PROXY_BASE_URL,
        });
      });

      const layerNames = Object.keys(iiifLayers);
      if (layerNames.length === 0) {
        console.error('No IIIF image services found in this manifest.');
        debugLog(
          'No layers created',
          'manifest parsed but no image services found',
        );
        alert('Aucun service IIIF image trouvé dans ce manifeste.');
        return;
      }

      // Access the first Iiif object and add it to the map.
      iiifLayers[layerNames[0]].addTo(map);
      debugLog(
        'Layer added',
        layerNames[0] + ' (' + layerNames.length + ' total)',
      );
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      const status =
        jqXHR && jqXHR.status ? 'HTTP ' + jqXHR.status : 'No HTTP status';
      const details = [status, textStatus, errorThrown]
        .filter(Boolean)
        .join(' - ');

      console.error('Failed to load IIIF manifest:', details, manifestUrl);
      debugLog('Manifest load failed', details);
      alert(
        'Échec du chargement du manifeste IIIF.\n\n' +
          'Détails: ' +
          details +
          '\n\nAstuce GitHub Pages: utilisez une URL HTTPS et un serveur IIIF qui autorise CORS.',
      );
    });
}

var iiifLayers = {};
//pour monter les tuiles iiif

// Function to ask the user for the Manifest URL using a prompt
function askForManifestUrl() {
  const manifestUrlInput = prompt(
    'Entrez le manifeste URL (ex.: https://gallica.bnf.fr/iiif/ark:/12148/btv1b531025148/f1/manifest.json):',
  );
  if (manifestUrlInput === null) {
    // User clicked "Cancel" on the prompt
    return null; // Return null to indicate that the prompt was canceled
  }

  const manifestUrl = normalizeManifestUrl(manifestUrlInput);
  if (!manifestUrl) {
    debugLog('Invalid manifest URL', manifestUrlInput);
    alert('Ce manifeste est invalide.Essayez de nouveau.');
    return askForManifestUrl(); // Ask again if the user input is invalid
  }

  debugLog('Manifest URL normalized', manifestUrl);

  return manifestUrl; // Return the valid URL
}

function normalizeManifestUrl(inputUrl) {
  if (!inputUrl) {
    return null;
  }

  let candidate = inputUrl.trim();
  if (!candidate) {
    return null;
  }

  // If no protocol is provided, default to HTTPS for GitHub Pages.
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = 'https://' + candidate.replace(/^\/\//, '');
  }

  // Avoid mixed-content blocking (http manifest on https page).
  if (/^http:\/\//i.test(candidate)) {
    candidate = candidate.replace(/^http:\/\//i, 'https://');
  }

  try {
    return new URL(candidate).toString();
  } catch (_) {
    return null;
  }
}

// Get a reference to the button element
const manifestButton = document.getElementById('ask-button');

// Add a click event listener to the button
manifestButton.addEventListener('click', function () {
  // Call the function to ask for the Manifest URL when the button is clicked
  const manifestUrl = askForManifestUrl();

  // Check if the user entered a valid URL
  if (manifestUrl !== null) {
    // Now you have the user-specified URL stored in the manifestUrl variable.
    loadIIIFManifest(manifestUrl);
  }
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

var div = document.createElement('div');
div.id = 'coordsDiv';
div.style.position = 'absolute';
div.style.bottom = '0';
div.style.left = '0';
div.style.backgroundColor = 'white';
div.style.zIndex = '999';
document.getElementById('map').appendChild(div);

map.on('mousemove', function (e) {
  var lat = e.latlng.lat.toFixed(5);
  var lon = e.latlng.lng.toFixed(5);

  document.getElementById('coordsDiv').innerHTML = lat + ', ' + lon;
});

///////////////////////
//DRAG AND DROP ///////
///////////////////////
// Variable to hold the loaded GeoJSON layer
let loadedGeoJSONLayer;

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
      // Remove the previously loaded GeoJSON layer, if any
      if (loadedGeoJSONLayer) {
        map.removeLayer(loadedGeoJSONLayer);
      }

      const jsonContent = JSON.parse(e.target.result);
      // Create a new GeoJSON layer and add it to the map
      loadedGeoJSONLayer = L.geoJSON(jsonContent).addTo(map);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
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

const infoBox = document.getElementById('infoBox');
const infoContent = document.getElementById('infoContent');
const infoButton = document.getElementById('info-button');
const askButton = document.getElementById('ask-button');
const addButton = document.getElementById('add-button');
const favsButton = document.getElementById('favs-button');
//const randomButton = document.getElementById("random-button");

function openInfoBox(content) {
  infoContent.innerHTML = content;
  infoBox.style.display = 'block';
}

function closeInfoBox() {
  infoBox.style.display = 'none';
}

// Function to check if the click event is inside the info-box
function isClickInsideInfoBox(event) {
  return event.target === infoBox || infoBox.contains(event.target);
}

// Add a click event listener to the document
document.addEventListener('click', function (event) {
  // Check if the clicked element is inside the info box or the info button
  if (
    !isClickInsideInfoBox(event) &&
    event.target !== infoButton &&
    event.target !== addButton
  ) {
    closeInfoBox(); // Close the info box if clicked outside
  }
});

// ☘ button
infoButton.addEventListener('click', function (event) {
  event.stopPropagation(); // Stop the click event from propagating to the map
  const content = `
    <img src="clover_300.png" class="icon" alt="Un trèfle">
    <h2>Trifoglio</h2>
    <p>Cette application permet aux utilisateurs de charger des couches de carte à partir de services IIIF (International Image Interoperability Framework) en utilisant des URL de manifeste IIIF. Les utilisateurs peuvent également dessiner et sauvegarder des formes géométriques (polygones, lignes, marqueurs) sur la carte. Les dessins sont sauvegardés localement dans le navigateur à l'aide du stockage local, mais ils peuvent aussi être téléchargés en format json. L'application utilise <a href="https://leafletjs.com/" target="_blank">Leaflet</a>, <a href="https://github.com/mejackreed/Leaflet-IIIF" target="_blank">Leaflet-iiif</a>, <a href="https://github.com/Leaflet/Leaflet.draw" target="_blank">Leaflet.draw</a> et <a href="https://github.com/mlevans/leaflet-hash" target="_blank">Leaflet-hash</a></br></br>Conception: <a href="https://www.usherbrooke.ca/histoire/departement/personnel/personnel-enseignant/tristan-landry" target="_blank">Tristan Landry</a> </p>
  `;
  openInfoBox(content);
});

// ➕ Add click event listeners to the buttons
addButton.addEventListener('click', function (event) {
  event.stopPropagation(); // Stop the click event from propagating to the map
  const content = `
    <img src="clover_300.png" class="icon" alt="Un trèfle">
    <h2>Trifoglio</h2>
    <p>Pour ajouter une couche json, simplement la glisser-déposer dans la fenêtre.</p>
  `;
  openInfoBox(content);
});

// 💛 button

function resetAndLoadManifest(manifestUrl) {
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
