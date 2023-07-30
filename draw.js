////////////////
//LEAFLET DRAW//
////////////////

// Initialize the Leaflet.draw plugin and load saved layers
function drawSomething() {
  if (drawnLayers) {
    map.removeLayer(drawnLayers); // Remove the existing drawnLayers from the map
  }

  drawnLayers = new L.FeatureGroup(); // Create the drawnLayers feature group if it doesn't exist
  map.addLayer(drawnLayers); // Add the drawnLayers to the map if it doesn't exist

  const drawControl = new L.Control.Draw({
    draw: {
      polygon: true,
      polyline: true,
      rectangle: false,
      circle: false,
      circlemarker: false,
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
  localStorage.removeItem('drawnLayers');

  drawSomething(); // Call the drawSomething function again to reinitialize the drawnLayers
}
