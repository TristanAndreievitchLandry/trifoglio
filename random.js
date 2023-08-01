// 🎲yyyy
let randomUrl; // Declare randomUrl in the broader scope

randomButton.addEventListener("click", function () {
  // Call the getRandomManifestUrl function to generate a random manifestUrl
  function getRandomManifestUrl() {
    if (!getRandomManifestUrl.previousIndex) {
      getRandomManifestUrl.previousIndex = -1;
    }

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * appDataArray.length);
    } while (newIndex === getRandomManifestUrl.previousIndex);

    getRandomManifestUrl.previousIndex = newIndex;
    return appDataArray[newIndex].manifesturl;
  }

  // Function to load the IIIF manifest with the user-specified URL
  function loadIIIFManifest(manifestUrl) {
    // Add a random query parameter to avoid caching
    const randomParam = Math.random().toString(36).substr(2, 9);
    const randomUrlWithParam = manifestUrl + `?cache=${randomParam}`;
  
    // Grab a IIIF manifest
    $.getJSON(randomUrlWithParam)
      .done(function(data) {
        // For each image create a L.TileLayer.Iiif object and add that to an object literal for the layer control
        $.each(data.sequences[0].canvases, function(_, val) {
          iiifLayers[val.label] = L.tileLayer.iiif(val.images[0].resource.service['@id'] + '/info.json');
        });
  
        // Access the first Iiif object and add it to the map
        iiifLayers[Object.keys(iiifLayers)[0]].addTo(map);
  
        // Now that randomUrl is set, you can log it here
        console.log(randomUrl);
      })
      .fail(function() {
        console.error("Failed to load IIIF manifest.");
      });
  }
});
