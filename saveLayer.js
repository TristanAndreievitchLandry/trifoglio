
// Function to save drawn layers to local storage
 function saveToLocalStorage() {
   const drawnLayers = drawnItems.toGeoJSON();
   localStorage.setItem('drawnLayers', JSON.stringify(drawnLayers));
 }
 
 // Function to load saved layers from local storage and recreate drawn layers
 function loadFromLocalStorage() {
   const savedLayers = localStorage.getItem('drawnLayers');
   if (savedLayers) {
     const layersData = JSON.parse(savedLayers);
     L.geoJSON(layersData).addTo(drawnItems);
   }
 }
 
 // Download drawn layers as a JSON file
async function downloadDrawnLayers() {
  const savedLayers = drawnLayers.toGeoJSON(); // Convert the drawnItems FeatureGroup to GeoJSON
  if (!savedLayers || savedLayers.features.length === 0) {
    alert('Dessinez d\'abord quelque chose 😉');
    return;
  }

  const jsonData = JSON.stringify(savedLayers, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const fileName = 'mon_dessin.json';
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;

  const confirmation = confirm('Télégarger le fichier ?');
  if (confirmation) {
    a.click();
  }
}
