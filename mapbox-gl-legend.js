const className = 'mapboxgl-ctrl mapboxgl-legend'
const defaultOptions = {
    'order': 'qgis',
    'customOrder': []
}

class MapboxLegend {
    constructor(overlays, options) {
        // Overlays is an array of MapboxGL layers
        this._overlays = overlays
        // Options is an optional parameter
        if(options == undefined) this._options = defaultOptions
        else this._options = options
        // If the order is not specified - set object order
        if(this._options.customOrder == undefined || this._options.customOrder.length == 0) this._order = Object.keys(overlays).map((layerName) => overlays[layerName].id)
        else this._order = this._options.customOrder
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
        this._updateOverlays()
        // onAdd method requires return an DOM element
        return this._container
    }
    onRemove() {
        // onRemove method to destroy DOM element
        this._container.parentNode.removeChild(this._container)
    }
    changeOrder(newOrder) {
        // newOrder is an array of new order
        this._order = newOrder
        // Run a function to re-create legend
        this._updateOverlays()
    }
    _updateOverlays() {
        // Clearing legend
        this._container.innerHTML = ''
        // Creating a list
        let ul = document.createElement('ul')
        // Creating list elements for each layer
        for(let layerId of this._order){
            for(let layerName in this._overlays){
                if(this._overlays[layerName].id == layerId) ul.appendChild(this._createOverlay(layerName, this._overlays[layerName]))
            }
        }
        // Depends on the options set render order
        if(this._options.order == 'qgis') for(let layerId of this._order.slice().reverse()) this._map.moveLayer(layerId)
        else for(let layerId of this._order) this._map.moveLayer(layerId)
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
    _upLayer(e) {
        // Return if layer is the first one
        let layerId = e.target.getAttribute('id')
        let idx = this._order.indexOf(layerId)
        if(idx == 0) return
        // Move layer to index - 1
        this._order.splice(idx - 1, 0, this._order.splice(idx, 1)[0])
        // Run a function to re-create legend
        this._updateOverlays()
    }
    _downLayer(e) {
        // Return if layer is the last one
        let layerId = e.target.getAttribute('id')
        let idx = this._order.indexOf(layerId)
        if(idx == this._order.length - 1) return
        // Move layer to index + 1
        this._order.splice(idx + 1, 0, this._order.splice(idx, 1)[0])
        // Run a function to re-create legend
        this._updateOverlays()
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
        if(Object.keys(this._overlays).length > 0) display = 'in-line'
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

