  
 // Save the drawn layer to local storage
  function saveToLocalStorage(geoJSON) {
    const savedLayers = JSON.parse(localStorage.getItem('drawnLayers')) || [];
    savedLayers.push(geoJSON);
    localStorage.setItem('drawnLayers', JSON.stringify(savedLayers));
  }

  // Download drawn layers as a JSON file
  async function downloadDrawnLayers() {
    const savedLayers = JSON.parse(localStorage.getItem('drawnLayers'));
    if (!savedLayers || savedLayers.length === 0) {
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

  // Load saved layers from local storage when the page loads
  function loadFromLocalStorage() {
    const savedLayers = JSON.parse(localStorage.getItem('drawnLayers'));
    if (savedLayers) {
      savedLayers.forEach(layer => {
        L.geoJSON(layer).addTo(map);
      });
    }
  }

 