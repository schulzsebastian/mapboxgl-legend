const className = 'mapboxgl-ctrl mapbox-gl-legend'

class MapboxLegend {
    constructor(overlays) {
        this._layers = {}
        this._container = document.createElement('div')
        this._container.className = `${className}`
        //this._container.addEventListener('click', this._onClick.bind(this))
        this.addCSS()
    }
    onAdd(map) {
        this._map = map
        this._map.on('data', this._onData.bind(this))
        return this._container
    }
    _onClick(e) {
        console.log(this._layers)
    }
    _onData(e) {
        if(e.isSourceLoaded == true && e.sourceId != 'openmaptiles'){
            if(Object.keys(this._layers).indexOf(e.source) < 0){
                this._layers[e.sourceId] = e.source
                this._updateLayers()
            }
        }
    }
    _updateLayers() {
        this._container.innerHTML = ''
        let ul = document.createElement('ul')
        for(let layer in this._layers){
            let li = document.createElement('li')
            let li_text = document.createTextNode(layer)
            let check = document.createElement("input");
            check.setAttribute("type", "checkbox")
            check.id = layer
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

