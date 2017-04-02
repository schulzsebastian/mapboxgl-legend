# mapboxgl-legend
Mapbox GL layers control

**Example setup**

```js
const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json',
  center: [16.913988783638445, 52.357498181163635],
  zoom: 8
})
map.on('load', () => {
  map.addSource('layer_source', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {
        'type': 'Point'
      },
      geometry: {
        type: 'Point',
        coordinates: [16.895824670791626,52.39501823939772]
      }
    }
  })
  let overlays = {
    'Point Layer': {
      'id': 'layer_id',
      'source': 'layer_source',
      'type': 'circle',
      'paint': {
        'circle-radius': 10,
        'circle-color': '#007cbf'
      }
    }
  }
  map.addLayer(overlays['Point Layer'])
  const legend = new MapboxLegend(overlays, {
    order: 'qgis'
  })
  map.addControl(legend)
})
```
