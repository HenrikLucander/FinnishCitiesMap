// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window.onload = init

function init() {
    //Controls
    const fullScreenControl = new ol.control.FullScreen();
    //const mousePositionControl = new ol.control.MousePosition();
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
    const finlandCenterCoordinate = [3000000, 9667547];
    const map = new ol.Map({     
        view: new ol.View({
            center: finlandCenterCoordinate, //x and y coordinates
            zoom: 5,
            extent: [398695, 7478292, 4627424, 12357456]
            //maxZoom: 10,
            //minZoom: 2,
            //rotation: 0
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
            //mousePositionControl,
            overviewMapControl,
            //scaleLineControl,
            zoomSliderControl,
            zoomToExtentControl
        ])
    })

    // Finnish Cities GeoJSON
    // Style
    const finnishCitiesStyle = function (feature) {
        let cityID = feature.get("ID");
        let cityIDString = cityID.toString();
        const styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [153, 204, 255, 0.6]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [0, 128, 255, 1],
                        width: 2
                    }),
                    radius: 13
                }),
                text: new ol.style.Text({
                    text: cityIDString,
                    scale: 1.5,
                    fill: new ol.style.Fill({
                        color: [0, 0, 0, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [0, 0, 0, 1],
                        width: 0.3
                    })
                })
            })
        ]
        return styles
    }
    const styleForSelect = function (feature) {
        let cityID = feature.get("ID");
        let cityIDString = cityID.toString();
        const styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [0, 255, 0, 0.5]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [6, 125, 34, 1],
                        width: 2
                    }),
                    radius: 13
                }),
                text: new ol.style.Text({
                    text: cityIDString,
                    scale: 1.5,
                    fill: new ol.style.Fill({
                        color: [0, 0, 0, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [0, 0, 0, 1],
                        width: 0.3
                    })
                })
            })
        ]
        return styles
    }

    // Vector layer (circles of cities)
    const finnishCitiesLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            //url: 'C:\\Users\\lucanhen\\source\\repos\\udemy\\OpenLayersProject\\OpenLayers\\wwwroot\\data\\map.geojson'
            url: './data/finnish_cities.geojson.txt'
        }),
        style: finnishCitiesStyle
    })
    map.addLayer(finnishCitiesLayer);

    // Map Features Click Logic
    const navElements = document.querySelector(".column-navigation");
    const cityNameElement = document.getElementById("cityname");
    const cityImageElement = document.getElementById("cityimage");
    const mapView = map.getView();

    map.on("singleclick", function (evt) {
        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            let featureName = feature.get("Cityname");
            let navElement = navElements.children.namedItem(featureName);
            mainLogic(feature, navElement);          
        })
    })

    function mainLogic(feature, clickedAnchorElement) {   
        //Re-assign active class to the clicked element
        let currentActiveStyledElement = document.querySelector(".active");
        currentActiveStyledElement.className = currentActiveStyledElement.className.replace("active", "");
        clickedAnchorElement.className = "active";

        //Change the style of all features
        let finnishCitiesFeatures = finnishCitiesLayer.getSource().getFeatures();
        finnishCitiesFeatures.forEach(function (feature) {
            feature.setStyle(finnishCitiesStyle);
        })
        
        //Home Element : Change content in the menu to HOME
        if (clickedAnchorElement.id === "Home") {
            mapView.animate({ center: finlandCenterCoordinate }, { zoom: 5 });
            cityNameElement.innerHTML = "Welcome to Finnish Cities Map";
            cityImageElement.setAttribute("src", "./img/Finland.jpg");
        }
        //Change view, and content in the menu base on the feature
        else {
            //Set style of the chosen feature
            feature.setStyle(styleForSelect);

            //Change the view based on the feature
            let featureCoordinates = feature.get("geometry").getCoordinates();
            mapView.animate({ center: featureCoordinates }, { zoom: 6 })

            //Change content based on the chosen feature
            let featureName = feature.get("Cityname");
            let featureImage = feature.get("Cityimage");
            cityNameElement.innerHTML = featureName;
            cityImageElement.setAttribute("src", "./img/" + featureImage + ".jpg")
        }     
    }

    //Navigation Button Logic
    const anchorNavElements = document.querySelectorAll('.column-navigation > a');
    for (let anchorNavElement of anchorNavElements) {
        anchorNavElement.addEventListener("click", function (e) {
            let clickedAnchorElement = e.currentTarget;
            let clickedAnchorElementID = clickedAnchorElement.id;
            let finCitiesFeatures = finnishCitiesLayer.getSource().getFeatures();
            finCitiesFeatures.forEach(function (feature) {
                let featureCityName = feature.get("Cityname");
                if (clickedAnchorElementID === featureCityName) {
                    mainLogic(feature, clickedAnchorElement);
                }
            })
            //Home Navigation Case
            if (clickedAnchorElementID === "Home") {
                mainLogic(undefined, clickedAnchorElement);
            }
        })
    }
}
