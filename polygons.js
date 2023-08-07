var polygon3 = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.296875, -48.3125],
            [122.3125, -46.25],
            [125.296875, -48.703125],
            [125.34375, -51.234375],
            [120.5625, -52.640625],
            [116.296875, -48.3125],
          ],
        ],
      },
    },
  ],
};

var polygon3 = L.geoJSON(polygon3, {
  color: 'black',
  fillColor: 'green',
  opacity: 0.75,
});
