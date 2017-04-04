'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var className = 'mapboxgl-ctrl mapboxgl-legend';
var defaultOptions = {
    'order': 'qgis',
    'overlaysOrder': [],
    'basemapsOrder': []
};

var MapboxLegend = function () {
    function MapboxLegend(overlays, basemaps, options) {
        _classCallCheck(this, MapboxLegend);

        // Overlays is an object "layer name: MapboxGL layers"
        this._overlays = overlays;
        // Basemaps is an object "layer name: MapboxGL style"
        this._basemaps = basemaps;
        // Options is an optional parameter
        if (options == undefined) this._options = defaultOptions;else this._options = options;
        // If the order of overlays is not specified - set object order
        if (this._options.overlaysOrder == undefined || this._options.overlaysOrder.length == 0) {
            this._overlaysOrder = Object.keys(overlays).map(function (layerName) {
                return overlays[layerName].id;
            });
        } else this._overlaysOrder = this._options.overlaysOrder;
        // If the order of basemaps is not specified - set object order
        if (this._options.basemapsOrder == undefined || this._options.basemapsOrder.length == 0) this._basemapsOrder = Object.keys(basemaps);else this._basemapsOrder = this._options.basemapsOrder;
        // Cache sources for refreshing data after basemap change
        this._sources = Object.keys(overlays).map(function (layerName) {
            return overlays[layerName].source;
        });
        // Creating legend container
        this._container = document.createElement('div');
        this._container.className = '' + className;
        // Loading CSS of legend
        this._addCSS();
    }

    _createClass(MapboxLegend, [{
        key: 'onAdd',
        value: function onAdd(map) {
            // Define map object in class
            this._map = map;
            // Run a function to create legend
            this._updateLegend();
            // onAdd method requires return an DOM element
            return this._container;
        }
    }, {
        key: 'onRemove',
        value: function onRemove() {
            // onRemove method to destroy DOM element
            this._container.parentNode.removeChild(this._container);
        }
    }, {
        key: 'changeOrder',
        value: function changeOrder(newOrder) {
            // newOrder is an array of new order
            this._overlaysOrder = newOrder;
            // Run a function to re-create legend
            this._updateOverlays();
        }
    }, {
        key: '_updateLegend',
        value: function _updateLegend() {
            // Clearing legend
            this._container.innerHTML = '';
            // Creating basemaps list
            this._updateBasemaps();
            // Creating overlays list
            this._updateOverlays();
            // Try check chosen basemap
            this._checkChosenBasemap();
        }
    }, {
        key: '_updateBasemaps',
        value: function _updateBasemaps() {
            // Creating a list
            var ul = document.createElement('ul');
            ul.id = 'mapbox-gl-legend-basemaps';
            // Creating list elements for each basemap
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._basemapsOrder[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var layerName = _step.value;
                    ul.appendChild(this._createBasemap(layerName, this._basemaps[layerName]));
                } // Appending list to legend
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._container.appendChild(ul);
            // Adding html line
            this._container.appendChild(document.createElement('hr'));
        }
    }, {
        key: '_updateOverlays',
        value: function _updateOverlays() {
            // If list exists - clear it
            if (document.getElementById('mapbox-gl-legend-overlays') != null) {
                var _ul = document.getElementById('mapbox-gl-legend-overlays');
                _ul.parentNode.removeChild(_ul);
            }
            // Creating a list
            var ul = document.createElement('ul');
            ul.id = 'mapbox-gl-legend-overlays';
            // Creating list elements for each layer
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._overlaysOrder[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var layerId = _step2.value;

                    for (var layerName in this._overlays) {
                        if (this._overlays[layerName].id == layerId) ul.appendChild(this._createOverlay(layerName, this._overlays[layerName]));
                    }
                }
                // Depends on the options set render order
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (this._options.order == 'qgis') {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this._overlaysOrder.slice().reverse()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _layerId = _step3.value;
                        this._map.moveLayer(_layerId);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            } else {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this._overlaysOrder[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _layerId2 = _step4.value;
                        this._map.moveLayer(_layerId2);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            } // Appending list to legend
            this._container.appendChild(ul);
        }
    }, {
        key: '_createOverlay',
        value: function _createOverlay(layerName, layer) {
            // Creating list element
            var li = document.createElement('li');
            // Creating checkbox for toggle layer
            var check = document.createElement('input');
            check.setAttribute('type', 'checkbox');
            check.setAttribute('layer', layer.id);
            check.id = layer.id.replace(/^[^a-z]+|[^\w:.-]+/gi, "") + '-layer';
            // Creating up button
            var up = document.createElement('a');
            up.style.float = 'right';
            up.setAttribute('layer', layer.id);
            up.id = layer.id.replace(/^[^a-z]+|[^\w:.-]+/gi, "") + '-layer';
            up.appendChild(document.createTextNode('↑'));
            // Creating down button
            var down = document.createElement('a');
            down.style.float = 'right';
            down.setAttribute('layer', layer.id);
            down.id = layer.id.replace(/^[^a-z]+|[^\w:.-]+/gi, "") + '-layer';
            down.appendChild(document.createTextNode('↓'));
            // Appending to list element checkbox, layer name and buttons
            li.appendChild(check);
            li.appendChild(document.createTextNode('' + layerName));
            li.appendChild(down);
            li.appendChild(up);
            // Event listener for checkbox
            check.addEventListener('change', this._toggleLayer.bind(this));
            // Event listener for up button
            up.addEventListener('click', this._upLayer.bind(this));
            // Event listener for down button
            down.addEventListener('click', this._downLayer.bind(this));
            // Get visibility of layer from map
            var visibility = this._map.getLayoutProperty(layer.id, 'visibility');
            // If is visible or is not specified - check the checkbox and set layer visibility
            if (visibility == 'visible' || visibility == undefined) {
                this._map.setLayoutProperty(layer.id, 'visibility', 'visible');
                check.checked = true;
            }
            // Return list element
            return li;
        }
    }, {
        key: '_createBasemap',
        value: function _createBasemap(basemapName, layer) {
            // Creating list element
            var li = document.createElement('li');
            // Creating radio button
            var radio = document.createElement('input');
            radio.setAttribute('type', 'radio');
            radio.setAttribute('name', 'basemaps');
            radio.setAttribute('basemap', basemapName);
            radio.id = basemapName.replace(/^[^a-z]+|[^\w:.-]+/gi, "") + '-basemap';
            // Appending to list radio and layer name
            li.appendChild(radio);
            li.appendChild(document.createTextNode('' + basemapName));
            // Event listener for radio
            radio.addEventListener('change', this._selectBasemap.bind(this));
            // Return list element
            return li;
        }
    }, {
        key: '_upLayer',
        value: function _upLayer(e) {
            // Return if layer is the first one
            var layerId = e.target.getAttribute('layer');
            var idx = this._overlaysOrder.indexOf(layerId);
            if (idx == 0) return;
            // Move layer to index - 1
            this._overlaysOrder.splice(idx - 1, 0, this._overlaysOrder.splice(idx, 1)[0]);
            // Run a function to re-create legend
            this._updateOverlays();
        }
    }, {
        key: '_downLayer',
        value: function _downLayer(e) {
            // Return if layer is the last one
            var layerId = e.target.getAttribute('layer');
            var idx = this._overlaysOrder.indexOf(layerId);
            if (idx == this._overlaysOrder.length - 1) return;
            // Move layer to index + 1
            this._overlaysOrder.splice(idx + 1, 0, this._overlaysOrder.splice(idx, 1)[0]);
            // Run a function to re-create legend
            this._updateOverlays();
        }
    }, {
        key: '_selectBasemap',
        value: function _selectBasemap(e) {
            var _this = this;

            // Get current sources
            var mapSources = this._map.getStyle().sources;
            // Change style and clear map data
            this._map.setStyle(this._basemaps[e.target.getAttribute('basemap')]);
            // Load cached sources and layers
            setTimeout(function () {
                for (var sourceName in mapSources) {
                    if (_this._sources.indexOf(sourceName) > -1) _this._map.addSource(sourceName, mapSources[sourceName]);
                }for (var layerName in _this._overlays) {
                    _this._map.addLayer(_this._overlays[layerName]);
                }_this._updateOverlays();
            }, 1000);
        }
    }, {
        key: '_checkChosenBasemap',
        value: function _checkChosenBasemap() {
            var _this2 = this;

            var _loop = function _loop(basemapName) {
                fetch(_this2._basemaps[basemapName]).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    if (_this2._map.getStyle().name == response.name) {
                        document.getElementById(basemapName.replace(/^[^a-z]+|[^\w:.-]+/gi, "") + '-basemap').checked = true;
                    }
                });
            };

            for (var basemapName in this._basemaps) {
                _loop(basemapName);
            }
        }
    }, {
        key: '_toggleLayer',
        value: function _toggleLayer(e) {
            if (e.target.checked) this._showLayer(e.target.getAttribute('layer'));else this._hideLayer(e.target.getAttribute('layer'));
        }
    }, {
        key: '_showLayer',
        value: function _showLayer(layerId) {
            this._map.setLayoutProperty(layerId, 'visibility', 'visible');
        }
    }, {
        key: '_hideLayer',
        value: function _hideLayer(layerId) {
            this._map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    }, {
        key: '_addCSS',
        value: function _addCSS() {
            var css = document.createElement('style');
            var display = void 0;
            if (this._overlaysOrder.length > 0) display = 'in-line';else display = 'none';
            css.type = 'text/css';
            css.innerHTML = '\n        .mapboxgl-legend {\n            margin: 25px;\n            padding: 5px;\n            background: red;\n            position: relative;\n            display: ' + display + '\n        }\n        .mapboxgl-legend ul {\n            list-style: none;\n            padding: 0;\n        }';
            document.body.appendChild(css);
        }
    }]);

    return MapboxLegend;
}();
