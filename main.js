gsap.registerPlugin(ScrollTrigger, TextPlugin, DrawSVGPlugin);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
  L.map.center = [0, 0];
};

const map = L.map('map', {
  center: [0, 0],
  crs: L.CRS.Simple,
  zoom: 0,
  zoomControl: false,
  attributionControl: false,
});

// Add the attribution control to the map with 'bottomleft' position
L.control.attribution({ position: 'bottomleft' }).addTo(map);

loadIIIFManifest(
  'https://gallica.bnf.fr/iiif/ark:/12148/btv1b531025148/f1/manifest.json'
);

gsap.registerPlugin(ScrollTrigger, TextPlugin, DrawSVGPlugin);

// Remove the global declaration of drawnLayers
let manifestUrl;
let geoJSONLayer; // Declare the variable outside the functions

////////////////
//LEAFLET iiif//
////////////////

// Call the function to load the IIIF manifest with the user-specified URL

function loadIIIFManifest(manifestUrl) {
  // Grab a IIIF manifest
  $.getJSON(manifestUrl)
    .done(function (data) {
      // For each image create a L.TileLayer.Iiif object and add that to an object literal for the layer control
      $.each(data.sequences[0].canvases, function (_, val) {
        iiifLayers[val.label] = L.tileLayer.iiif(
          val.images[0].resource.service['@id'] + '/info.json'
        );
      });

      // Access the first Iiif object and add it to the map
      iiifLayers[Object.keys(iiifLayers)[0]].addTo(map);
    })
    .fail(function () {
      console.error('Failed to load IIIF manifest.');
    });
}

var iiifLayers = {};
//pour monter les tuiles iiif

//////////////////////
//STORY///////////////
/////////////////

// Select the aura element
const auraElement = document.querySelector('.aura');

// Create a blinking aura animation
const blinkingAura = gsap.fromTo(
  auraElement,
  { opacity: 0.5 }, // Initial state
  {
    opacity: 1, // Final state (fully visible)
    duration: 2, // Duration for one full blink cycle (in seconds)
    repeat: -1, // Infinite repeat
    yoyo: true, // Back and forth animation
    ease: 'power2.inOut', // Easing function for smooth animation
  }
);

const storyBox = document.getElementById('storyBox');
const storyContent = document.getElementById('storyContent');
const storyImage = document.getElementById('storyImage');
const maisonButton = document.getElementById('maison-button');
const nextButton = document.getElementById('next-button');

// Array of story objects
const stories = [
  {
    content: `<p>Cette carte de 1810 a été dessinée par Pierre Lapie</p>`,
    imageUrl: '',
    coords: [-82.008, 53.859],
    zoom: 5,
    geoJsonData: '',
  },

  {
    content: `<p>Pierre Lapie était un <i>colonel</i>, géographe et cartographe. Il fut admis à l'École du génie en 1789. Il fut l'un des membres fondateurs de la Société de géographie de Paris.</p>`,
    imageUrl: '',
    coords: [],
    zoom: 5,
    geoJsonData: '',
  },
  {
    content: `<p>On trouve sur la carte de Lapie la région perse du <span style="color: red;">Mazanderan</span></p>`,
    imageUrl: '',
    coords: [-56, 80.547],
    zoom: 5,
    geoJsonData: 'mazanderan.json',
  },
  {
    content: `<p>De même que les principales villes de la région.</p>`,
    imageUrl: '',
    coords: [],
    zoom: 4,
    geoJsonData: 'villes.json',
  },
  {
    content: `<p>Notre storymap nous permet d'afficher aussi des images, comme celle-ci, par Midjourney, imaginant une espionne occidentale dans la région au 19<sup>e</sup> siècle</sup></p> Le choix des images se fait collectivement.`,
    imageUrl: 'espionne.png',
    coords: [-56, 80.547],
    zoom: 5,
    geoJsonData: '',
  },
  {
    content: `<p>Comprendre le corpus implique d'être capable de lire la carte de Lapie et y retrouver les endroits dont les espions parlent dans les sources.</p>`,
    imageUrl: 'souk.png',
    coords: [-48.75, 99.516],
    zoom: 5,
    geoJsonData: '',
  },
  {
    content: `<p>Le défi sera de trouver une thématique qui dynamise logiquement la narration.</p>`,
    imageUrl: 'bazar.png',
    coords: [-33.391, 65.031],
    zoom: 5,
    geoJsonData: '',
  },
];

let currentGeoJsonLayer;

function loadGeoJsonData(geoJsonData) {
  // Return a new Promise
  return new Promise((resolve, reject) => {
    if (geoJsonData) {
      // Load the GeoJSON data
      $.getJSON(geoJsonData, function (data) {
        // Add the data to the map
        currentGeoJsonLayer = L.geoJson(data).addTo(map);

        // Resolve the Promise
        resolve();
      }).fail(function () {
        // Reject the Promise if the request fails
        reject('Failed to load GeoJSON data.');
      });
    } else {
      console.log('No GeoJSON data provided.');

      // Resolve the Promise immediately if no GeoJSON data was provided
      resolve();
    }
  });
}
let currentStoryIndex = -1;

async function openStoryBox(content, imageUrl, coords, zoom, geoJsonData) {
  if (currentStoryIndex < 0) {
    return;
  }
  storyContent.innerHTML = content;
  storyImage.src = imageUrl;
  if (
    map &&
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === 'number' &&
    typeof coords[1] === 'number' &&
    typeof zoom === 'number'
  ) {
    map.setView(coords, zoom, {});
  }

  // Wait for the GeoJSON data to load before proceeding
  await loadGeoJsonData(geoJsonData);
}
function closeStoryBox() {
  storyBox.style.display = 'none';
}
function showNextStory() {
  // Remove the current GeoJSON layer from the map
  if (currentGeoJsonLayer) {
    map.removeLayer(currentGeoJsonLayer);
  }

  // Increment the current story index
  currentStoryIndex = (currentStoryIndex + 1) % stories.length;

  // Open the current story box
  const { content, imageUrl, coords, zoom, geoJsonData } =
    stories[currentStoryIndex];
  openStoryBox(content, imageUrl, coords, zoom, geoJsonData);
}

// story button
nextButton.addEventListener('click', function (event) {
  event.stopPropagation();
  showNextStory();
  // Apply the "breathing" effect to the button using GSAP
  gsap.to('.breathe-button', {
    scale: 1.2, // Scale up to 1.2
    duration: 0.5, // Animation duration (in seconds)
    yoyo: true, // Yoyo means back and forth animation
    repeat: 1, // Repeat the animation once (2 times in total)
    ease: 'power1.inOut', // Easing function for smooth animation
  });
});

function expandImage() {
  var modal = document.getElementById('myModal');
  var img = document.getElementById('storyImage');
  var modalImg = document.getElementById('img01');

  modal.style.display = 'block';
  modalImg.src = img.src;

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName('close')[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none';
  };
}

map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
if (map.tap) map.tap.disable();
document.getElementById('map').style.cursor = 'default';
