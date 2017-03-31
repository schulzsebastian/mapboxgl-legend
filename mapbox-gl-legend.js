const className = 'mapboxgl-ctrl mapbox-gl-legend'

class MapboxLegend {
    constructor(overlays, order) {
        this._overlays = overlays
        if(order == undefined) this._order = overlays.map(layer => {return layer.id})
        else this._order = order
        this._container = document.createElement('div')
        this._container.className = `${className}`
        this._addCSS()
    }
    onAdd(map) {
        this._map = map
        this._updateOverlays()
        return this._container
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container)
    }
    _updateOverlays() {
        console.log('rendering legend...')
        this._container.innerHTML = ''
        let ul = document.createElement('ul')
        for(let layerId of this._order){
            let layer = this._overlays.filter(l => {return l.id == layerId})[0]
            ul.appendChild(this._createLi(layer))
        }
        for(let layerId of this._order.slice().reverse()) this._map.moveLayer(layerId)
        this._container.appendChild(ul)
    }
    _createLi(layer) {
        let li = document.createElement('li')
        let li_text = document.createTextNode(`${layer.id} ↑ ↓`)
        let check = document.createElement('input')
        check.setAttribute('type', 'checkbox')
        check.id = layer.id
        li.appendChild(check)
        li.appendChild(li_text)
        check.addEventListener('change', this._toggleLayer.bind(this))
        let visibility = this._map.getLayoutProperty(layer.id, 'visibility')
        if(visibility == 'visible' || visibility == undefined){
            this._map.setLayoutProperty(layer.id, 'visibility', 'visible')
            check.checked = true
        }   
        return li
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
    _changeOrder(newOrder) {
        this._order = newOrder
        this._updateOverlays()
    }
    _addCSS() {
        const css = document.createElement('style')
        css.type = 'text/css'
        css.innerHTML = `
        .mapbox-gl-legend {
            margin: 25px;
            padding: 5px;
            background: red;
            position: relative;
        }
        .mapbox-gl-legend ul {
            list-style: none;
            padding: 0;
        }`
        document.body.appendChild(css)
    }
}

