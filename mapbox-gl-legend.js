const className = 'mapboxgl-ctrl mapboxgl-legend'
const defaultOptions = {
    'order': 'qgis',
    'overlaysOrder': [],
    'basemapsOrder': []
}

class MapboxLegend {
    constructor(overlays, basemaps, options) {
        // Overlays is an object "layer name: MapboxGL layers"
        this._overlays = overlays
        // Basemaps is an object "layer name: MapboxGL style"
        this._basemaps = basemaps
        // Options is an optional parameter
        if(options == undefined) this._options = defaultOptions
        else this._options = options
        // If the order of overlays is not specified - set object order
        if(this._options.overlaysOrder == undefined || this._options.overlaysOrder.length == 0){
            this._overlaysOrder = Object.keys(overlays).map((layerName) => overlays[layerName].id)
        }
        else this._overlaysOrder = this._options.overlaysOrder
        // If the order of basemaps is not specified - set object order
        if(this._options.basemapsOrder == undefined || this._options.basemapsOrder.length == 0) this._basemapsOrder = Object.keys(basemaps)
        else this._basemapsOrder = this._options.basemapsOrder
        // Cache sources
        this._sources = Object.keys(overlays).map((layerName) => overlays[layerName].source)
        // Creating legend container
        this._container = document.createElement('div')
        this._container.className = `${className}`
        // Loading CSS of legend
        this._addCSS()
    }
    onAdd(map) {
        // Define map object in class
        this._map = map
        // Run a function to create legend
        this._updateLegend()
        // onAdd method requires return an DOM element
        return this._container
    }
    onRemove() {
        // onRemove method to destroy DOM element
        this._container.parentNode.removeChild(this._container)
    }
    changeOrder(newOrder) {
        // newOrder is an array of new order
        this._overlaysOrder = newOrder
        // Run a function to re-create legend
        this._updateOverlays()
    }
    _updateLegend() {
        // Clearing legend
        this._container.innerHTML = ''
        this._updateBasemaps()
        this._updateOverlays()
    }
    _updateBasemaps() {
        // Creating a list
        let ul = document.createElement('ul')
        ul.id = 'mapbox-gl-legend-basemaps'
        // Creating list elements for each basemap
        for(let layerName of this._basemapsOrder) ul.appendChild(this._createBasemap(layerName, this._basemaps[layerName]))
        // Appending list to legend
        this._container.appendChild(ul)
        // Adding html line
        this._container.appendChild(document.createElement('hr'))
    }
    _updateOverlays() {
        // If list exists - clear it
        if(document.getElementById('mapbox-gl-legend-overlays') != null){
            let ul = document.getElementById('mapbox-gl-legend-overlays')
            ul.parentNode.removeChild(ul)
        }
        // Creating a list
        let ul = document.createElement('ul')
        ul.id = 'mapbox-gl-legend-overlays'
        // Creating list elements for each layer
        for(let layerId of this._overlaysOrder){
            for(let layerName in this._overlays){
                if(this._overlays[layerName].id == layerId) ul.appendChild(this._createOverlay(layerName, this._overlays[layerName]))
            }
        }
        // Depends on the options set render order
        if(this._options.order == 'qgis') for(let layerId of this._overlaysOrder.slice().reverse()) this._map.moveLayer(layerId)
        else for(let layerId of this._overlaysOrder) this._map.moveLayer(layerId)
        // Appending list to legend
        this._container.appendChild(ul)
    }
    _createOverlay(layerName, layer) {
        // Creating list element
        let li = document.createElement('li')
        // Creating checkbox for toggle layer
        let check = document.createElement('input')
        check.setAttribute('type', 'checkbox')
        check.id = layer.id
        // Creating up button
        let up = document.createElement('a')
        up.style.float = 'right'
        up.id = layer.id
        up.appendChild(document.createTextNode('↑'))
        // Creating down button
        let down = document.createElement('a')
        down.style.float = 'right'
        down.id = layer.id
        down.appendChild(document.createTextNode('↓'))
        // Appending to list element checkbox, layer name and buttons
        li.appendChild(check)
        li.appendChild(document.createTextNode(`${layerName}`))
        li.appendChild(down)
        li.appendChild(up)
        // Event listener for checkbox
        check.addEventListener('change', this._toggleLayer.bind(this))
        // Event listener for up button
        up.addEventListener('click', this._upLayer.bind(this))
        // Event listener for down button
        down.addEventListener('click', this._downLayer.bind(this))
        // Get visibility of layer from map
        let visibility = this._map.getLayoutProperty(layer.id, 'visibility')
        // If is visible or is not specified - check the checkbox and set layer visibility
        if(visibility == 'visible' || visibility == undefined){
            this._map.setLayoutProperty(layer.id, 'visibility', 'visible')
            check.checked = true
        }
        // Return list element
        return li
    }
    _createBasemap(layerName, layer) {
        let li = document.createElement('li')
        let radio = document.createElement('input')
        radio.setAttribute('type', 'radio')
        radio.setAttribute('name', 'basemaps')
        radio.id = layerName
        li.appendChild(radio)
        li.appendChild(document.createTextNode(`${layerName}`))
        radio.addEventListener('click', this._selectBasemap.bind(this))
        return li
    }
    _upLayer(e) {
        // Return if layer is the first one
        let layerId = e.target.getAttribute('id')
        let idx = this._overlaysOrder.indexOf(layerId)
        if(idx == 0) return
        // Move layer to index - 1
        this._overlaysOrder.splice(idx - 1, 0, this._overlaysOrder.splice(idx, 1)[0])
        // Run a function to re-create legend
        this._updateOverlays()
    }
    _downLayer(e) {
        // Return if layer is the last one
        let layerId = e.target.getAttribute('id')
        let idx = this._overlaysOrder.indexOf(layerId)
        if(idx == this._overlaysOrder.length - 1) return
        // Move layer to index + 1
        this._overlaysOrder.splice(idx + 1, 0, this._overlaysOrder.splice(idx, 1)[0])
        // Run a function to re-create legend
        this._updateOverlays()
    }
    _selectBasemap(e) {
        let mapSources = this._map.getStyle().sources
        this._map.setStyle(this._basemaps[e.target.getAttribute('id')])
        setTimeout(() => {
            for(let sourceName in mapSources) if(this._sources.indexOf(sourceName) > -1) this._map.addSource(sourceName, mapSources[sourceName])
            for(let layerName in this._overlays) this._map.addLayer(this._overlays[layerName])
            this._updateOverlays()
        }, 1000)
    }
    _toggleLayer(e) {
        if(e.target.checked) this._showLayer(e.target.getAttribute('id'))
        else this._hideLayer(e.target.getAttribute('id'))
    }
    _showLayer(layerId) {
        this._map.setLayoutProperty(layerId, 'visibility', 'visible')
    }
    _hideLayer(layerId) {
        this._map.setLayoutProperty(layerId, 'visibility', 'none')
    }
    _addCSS() {
        const css = document.createElement('style')
        let display
        if(this._overlaysOrder.length > 0) display = 'in-line'
        else display = 'none'
        css.type = 'text/css'
        css.innerHTML = `
        .mapboxgl-legend {
            margin: 25px;
            padding: 5px;
            background: red;
            position: relative;
            display: ${display}
        }
        .mapboxgl-legend ul {
            list-style: none;
            padding: 0;
        }`
        document.body.appendChild(css)
    }
}

