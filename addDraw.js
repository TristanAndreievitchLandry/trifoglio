// Add the 'addDraw' function in addDraw.js
function addDraw(map, downloadedGeoJSONData) {
    // Parse the downloaded GeoJSON data
    const parsedData = JSON.parse(downloadedGeoJSONData);
  
    // Convert the GeoJSON data into a GeoJSON layer
    const drawnLayersGeoJSON = L.geoJSON(parsedData);
  
    // Add the GeoJSON layer to the map
    drawnLayersGeoJSON.addTo(map);
  }
