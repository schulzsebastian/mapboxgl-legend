const className = 'mapboxgl-ctrl mapbox-gl-legend'

class MapboxLegend {
    constructor(overlays) {
        this._overlays = overlays
        this._container = document.createElement('div')
        this._container.className = `${className}`
        this.addCSS()
    }
    onAdd(map) {
        this._map = map
        this._updateOverlays()
        return this._container
    }
    _updateOverlays() {
        this._container.innerHTML = ''
        let ul = document.createElement('ul')
        for(let layer of this._overlays){
            let li = document.createElement('li')
            let li_text = document.createTextNode(layer.id)
            let check = document.createElement("input");
            check.setAttribute("type", "checkbox")
            check.id = layer.id
            this._map.on('load', () => {
                if(this._map.getLayoutProperty('Point layer', 'visibility') == 'visible'){
                    check.checked = true
                }
            })
            li.appendChild(check)
            li.appendChild(li_text)
            ul.appendChild(li)
            check.addEventListener('change', this._toggleLayer.bind(this))
        }
        this._container.appendChild(ul)
    }
    _toggleLayer(e) {
        if(e.target.checked){
            this._map.setLayoutProperty(e.target.getAttribute('id'), 'visibility', 'visible')
        }else{
            this._map.setLayoutProperty(e.target.getAttribute('id'), 'visibility', 'none')
        }
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container)
    }
    addCSS() {
        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = `
        .mapbox-gl-legend {
            margin: 25px;
            padding: 5px;
            background: red;
            position: relative;
        }
        .mapbox-gl-legend ul{
            list-style: none;
            padding: 0;
        }`
        document.body.appendChild(css);
    }
}

