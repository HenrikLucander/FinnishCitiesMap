// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window.onload = init

function init() {

    //Controls
    const fullScreenControl = new ol.control.FullScreen();
    const mousePositionControl = new ol.control.MousePosition();
    const overviewMapControl = new ol.control.OverviewMap({
        collapsed: true,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ]
    });
    //const scaleLineControl = new ol.control.ScaleLine();
    const zoomSliderControl = new ol.control.ZoomSlider();
    const zoomToExtentControl = new ol.control.ZoomToExtent();
    const attributionControl = new ol.control.Attribution({ //Collapsible attribution button
        collapsible: true
    })

    //Map
    const map = new ol.Map({
        view: new ol.View({
            center: [3000000, 9667547], //x and y coordinates
            zoom: 5,
            maxZoom: 10,
            minZoom: 2,
            rotation: 0
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: "openlayers-map",
        keyboardEventTarget: document, //keyboard interactions allowed
        //adding controls
        controls: ol.control.defaults({ attribution: false }).extend([
            attributionControl,
            fullScreenControl,
            mousePositionControl,
            overviewMapControl,
            //scaleLineControl,
            zoomSliderControl,
            zoomToExtentControl
        ])
    })

    // Finnish Cities GeoJSON
    const finnishCitiesStyle = function (feature) {
        let cityID = feature.get("ID");
        let cityIDString = cityID.toString();
        const styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [77, 219, 105, 0.6]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [6, 125, 34, 1],
                        width: 2
                    }),
                    radius: 12
                }),
                text: new ol.style.Text({
                    text: cityIDString,
                    scale: 1.5,
                    fill: new ol.style.Fill({
                        color: [232, 26, 26, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [232, 26, 26, 1],
                        width: 0.3
                    })
                })
            })
        ]
        return styles
    }

    const finnishCitiesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            //url: 'C:\\Users\\lucanhen\\source\\repos\\udemy\\OpenLayersProject\\OpenLayers\\wwwroot\\data\\map.geojson'
            url: './data/finnish_cities.geojson.txt'
        }),
        style: finnishCitiesStyle
    })
    map.addLayer(finnishCitiesLayer);
}
